class UserActivityTracker {
	constructor(metricCode) {
		this.metricCode = metricCode;
		this.clicks = 0;
		this.scrolls = 0;
		this.times = 0;
		this.intervalId = null;
		this.loadState();

		this.trackClick = this.trackClick.bind(this);
		this.trackScroll = this.trackScroll.bind(this);

		this.clickFactor = 0.2;
		this.scrollFactor = 0.003;
		this.timesFactor = 0.15;
		// this.loadStateFactors();

		this.isStarted = this.getStateSarted();
		if (this.isStarted) {
			this.startTracking();
		}

		this.isHidden = this.getStateHidden();

		this.executedFlags = this.getStateExecutedFlags();
		this.timesInactive = 1; // минуты
	}

	trackClick(e) {
		this.clicks++;
		this.saveState();
	}

	trackScroll(e) {
		this.scrolls++;
		this.saveState();
	}

	initEventListeners() {
		document.addEventListener("click", this.trackClick);
		document.addEventListener("scroll", this.trackScroll);
	}

	removeEventListeners() {
		document.removeEventListener("click", this.trackClick);
		document.removeEventListener("scroll", this.trackScroll);
	}

	startTracking() {
		this.isStarted = true;
		this.saveStateActive();
		this.initEventListeners();
		this.intervalId = setInterval(() => {
			this.times += 1;
			this.saveState();
		}, 1000);
	}

	stopTracking() {
		this.isStarted = false;
		this.saveStateActive();
		this.removeEventListeners();
		clearInterval(this.intervalId);
		this.saveState();
	}

	calculateActivityScore() {
		const timeCoefficient = Math.min(
			1 + Math.floor(this.times / 15) * this.timesFactor,
			2
		);
		const clicksCoefficient = this.clicks * this.clickFactor;
		const scrollsCoefficient = this.scrolls * this.scrollFactor;
		const activityScore =
			timeCoefficient * (clicksCoefficient + scrollsCoefficient);
		return activityScore;
	}

	getActivityLevel() {
		const activityScore = this.calculateActivityScore();
		if (activityScore >= 0 && activityScore <= 1.5) {
			return 1;
		} else if (activityScore > 1.5 && activityScore <= 3) {
			return 2;
		} else if (activityScore > 3 && activityScore <= 4.5) {
			return 3;
		} else if (activityScore > 4.5 && activityScore <= 6) {
			return 4;
		} else {
			return 5;
		}
	}

	saveState() {
		localStorage.setItem(
			"userActivityTrackerState",
			JSON.stringify({
				clicks: this.clicks,
				scrolls: this.scrolls,
				times: this.times,
			})
		);
	}

	loadState() {
		const state = JSON.parse(localStorage.getItem("userActivityTrackerState"));
		if (state) {
			this.clicks = state.clicks;
			this.scrolls = state.scrolls;
			this.times = state.times;
		}
	}

	// loadStateFactors() {
	// 	const state = JSON.parse(
	// 		localStorage.getItem("userActivityTrackerStateFactors")
	// 	);
	// 	if (state) {
	// 		this.clickFactor = state.clickFactor;
	// 		this.scrollFactor = state.scrollFactor;
	// 		this.timesFactor = state.timesFactor;
	// 	}
	// }

	// changeFactor(name, val) {
	// 	this[name + "Factor"] = val;
	// 	this.saveStateFactors();
	// }

	saveStateFactors() {
		localStorage.setItem(
			"userActivityTrackerStateFactors",
			JSON.stringify({
				clickFactor: this.clickFactor,
				scrollFactor: this.scrollFactor,
				timesFactor: this.timesFactor,
			})
		);
	}

	saveStateActive() {
		localStorage.setItem(
			"userActivityTrackerStateActive",
			JSON.stringify({
				isStarted: this.isStarted,
			})
		);
	}

	getStateSarted() {
		const state = JSON.parse(
			localStorage.getItem("userActivityTrackerStateActive")
		);
		return state ? state.isStarted : false;
	}

	saveStateHidden() {
		localStorage.setItem(
			"userActivityTrackerStateHidden",
			JSON.stringify({
				isHidden: this.isHidden,
			})
		);
	}

	getStateHidden() {
		const state = JSON.parse(
			localStorage.getItem("userActivityTrackerStateHidden")
		);
		return state ? state.isHidden : true;
	}

	clearStore() {
		localStorage.removeItem("userActivityTrackerState");
		this.clicks = 0;
		this.scrolls = 0;
		this.times = 0;

		localStorage.removeItem("userActivityTrackerExecutedFlags");
		this.executedFlags = {
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
		};
	}

	hideToggle() {
		this.isHidden = !this.isHidden;
		this.saveStateHidden();
	}

	//* обработка метрики + события сбрасывания
	checkLastCloseTime() {
		const lastCloseTime = localStorage.getItem("lastCloseTime");

		if (lastCloseTime) {
			const currentTime = new Date().getTime();
			const timeDiff = (currentTime - parseInt(lastCloseTime)) / (1000 * 60); // Разница в минутах

			if (timeDiff > this.timesInactive) {
				console.log("checkLastCloseTime");
				this.clearStore();
			}
		}
	}

	setupBeforeUnload() {
		window.addEventListener("beforeunload", () => {
			localStorage.setItem("lastCloseTime", new Date().getTime());
		});
	}

	setupTabActivityCheck() {
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				// Вкладка неактивна — запускаем проверку через 30 минут
				setTimeout(() => {
					if (document.hidden) {
						console.log("setupTabActivityCheck");
						this.clearStore();
					}
				}, this.timesInactive * 60 * 1000);
			}
		});
	}

	setupSendMetric() {
		setInterval(() => {
			if (this.executedFlags[this.getActivityLevel()] === false) {
				try {
					// ym(
					// 	this.metricCode,
					// 	"reachGoal",
					// 	"activity_" + this.getActivityLevel()
					// );
					console.log("activity_" + this.getActivityLevel());
					this.executedFlags[this.getActivityLevel()] = true;
					this.setStateExecutedFlags();
				} catch (error) {
					console.error("Ошибка отправки метрики:", error);
				}
			}
		}, 1000);
	}

	getStateExecutedFlags() {
		const state = JSON.parse(
			localStorage.getItem("userActivityTrackerExecutedFlags")
		);
		return state
			? state
			: {
					1: false,
					2: false,
					3: false,
					4: false,
					5: false,
			  };
	}

	setStateExecutedFlags() {
		localStorage.setItem(
			"userActivityTrackerExecutedFlags",
			JSON.stringify(this.executedFlags)
		);
	}

	// Запуск всех обработчиков
	startAll() {
		this.checkLastCloseTime();
		this.setupBeforeUnload();
		this.setupTabActivityCheck();
		this.setupSendMetric();
	}
}
