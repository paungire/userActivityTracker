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

		this.clickFactor = 0.3;
		this.scrollFactor = 0.01;
		this.timesFactor = 0.1;
		this.loadStateFactors();

		this.isStarted = this.getStateSarted();
		if (this.isStarted) {
			this.startTracking();
		}

		this.isHidden = this.getStateHidden();
	}

	trackClick() {
		this.clicks++;
		this.saveState();
	}

	trackScroll() {
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
			return "Activity 1";
		} else if (activityScore > 1.5 && activityScore <= 3) {
			return "Activity 2";
		} else if (activityScore > 3 && activityScore <= 4.5) {
			return "Activity 3";
		} else if (activityScore > 4.5 && activityScore <= 6) {
			return "Activity 4";
		} else {
			return "Activity 5";
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

	loadStateFactors() {
		const state = JSON.parse(
			localStorage.getItem("userActivityTrackerStateFactors")
		);
		if (state) {
			this.clickFactor = state.clickFactor;
			this.scrollFactor = state.scrollFactor;
			this.timesFactor = state.timesFactor;
		}
	}

	changeFactor(name, val) {
		this[name + "Factor"] = val;
		this.saveStateFactors();
	}

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
	}

	hideToggle() {
		this.isHidden = !this.isHidden;
		this.saveStateHidden();
	}
}
