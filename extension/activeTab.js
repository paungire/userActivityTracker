if (!document.querySelector("#activityTracker")) {
	const userTracker = new UserActivityTracker(89499315);
	userTracker.startAll();

	const activityTracker = document.createElement("div");
	activityTracker.id = "activityTracker";
	if (userTracker.isHidden) {
		activityTracker.style.display = "none";
	} else {
		activityTracker.style.display = "block";
	}

	const btnStart = document.createElement("button");
	btnStart.textContent = "Start";
	btnStart.addEventListener("click", () => {
		userTracker.startTracking();
		console.log("Tracking started");
	});
	activityTracker.appendChild(btnStart);

	const btnStop = document.createElement("button");
	btnStop.textContent = "Stop";
	btnStop.addEventListener("click", () => {
		userTracker.stopTracking();
		console.log("Tracking stopped");
	});
	activityTracker.appendChild(btnStop);

	const btnClear = document.createElement("button");
	btnClear.textContent = "Clear";
	btnClear.addEventListener("click", () => {
		userTracker.clearStore();
		console.log("Store cleared");
	});
	activityTracker.appendChild(btnClear);

	const scores = document.createElement("div");
	setInterval(() => {
		scores.textContent =
			"Activity Score: " + userTracker.calculateActivityScore().toFixed(2);
	}, 1000);
	activityTracker.appendChild(scores);
	const level = document.createElement("div");
	setInterval(() => {
		level.textContent = "Activity Level: " + userTracker.getActivityLevel();
	}, 1000);
	activityTracker.appendChild(level);
	const times = document.createElement("div");
	setInterval(() => {
		times.textContent = "Times: " + userTracker.times;
	}, 1000);
	activityTracker.appendChild(times);
	const clicks = document.createElement("div");
	setInterval(() => {
		clicks.textContent = "Clicks: " + userTracker.clicks;
	}, 1000);
	activityTracker.appendChild(clicks);
	const scrolls = document.createElement("div");
	setInterval(() => {
		scrolls.textContent = "Scrolls: " + userTracker.scrolls;
	}, 1000);
	activityTracker.appendChild(scrolls);
	const mousemoves = document.createElement("div");
	setInterval(() => {
		mousemoves.textContent = "Mousemoves: " + userTracker.mousemoves;
	}, 1000);
	activityTracker.appendChild(mousemoves);

	// const changeClickFactorLabel = document.createElement("label");
	// changeClickFactorLabel.textContent = "Click Factor";
	// const changeClickFactor = document.createElement("input");
	// changeClickFactor.value = userTracker.clickFactor;
	// changeClickFactor.addEventListener("change", (e) => {
	// 	userTracker.changeFactor("click", e.target.value);
	// });
	// changeClickFactorLabel.appendChild(changeClickFactor);
	// activityTracker.appendChild(changeClickFactorLabel);

	// const changeScrollFactorLabel = document.createElement("label");
	// changeScrollFactorLabel.textContent = "Scroll Factor";
	// const changeScrollFactor = document.createElement("input");
	// changeScrollFactor.value = userTracker.scrollFactor;
	// changeScrollFactor.addEventListener("change", (e) => {
	// 	userTracker.changeFactor("scroll", e.target.value);
	// });
	// changeScrollFactorLabel.appendChild(changeScrollFactor);
	// activityTracker.appendChild(changeScrollFactorLabel);

	// const changeTimesFactorLabel = document.createElement("label");
	// changeTimesFactorLabel.textContent = "Times Factor";
	// const changeTimesFactor = document.createElement("input");
	// changeTimesFactor.value = userTracker.timesFactor;
	// changeTimesFactor.addEventListener("change", (e) => {
	// 	userTracker.changeFactor("times", e.target.value);
	// });
	// changeTimesFactorLabel.appendChild(changeTimesFactor);
	// activityTracker.appendChild(changeTimesFactorLabel);

	//executedFlags
	const execudet1 = document.createElement("div");
	setInterval(() => {
		execudet1.textContent = "flag1: " + userTracker.executedFlags["1"];
	}, 1000);
	activityTracker.appendChild(execudet1);
	const execudet2 = document.createElement("div");
	setInterval(() => {
		execudet2.textContent = "flag2: " + userTracker.executedFlags["2"];
	}, 1000);
	activityTracker.appendChild(execudet2);
	const execudet3 = document.createElement("div");
	setInterval(() => {
		execudet3.textContent = "flag3: " + userTracker.executedFlags["3"];
	}, 1000);
	activityTracker.appendChild(execudet3);
	const execudet4 = document.createElement("div");
	setInterval(() => {
		execudet4.textContent = "flag4: " + userTracker.executedFlags["4"];
	}, 1000);
	activityTracker.appendChild(execudet4);
	const execudet5 = document.createElement("div");
	setInterval(() => {
		execudet5.textContent = "flag5: " + userTracker.executedFlags["5"];
	}, 1000);
	activityTracker.appendChild(execudet5);

	const btnHide = document.createElement("button");
	btnHide.textContent = "Hide";
	btnHide.id = "btnHideActivityTracker";
	btnHide.addEventListener("click", () => {
		userTracker.hideToggle();
		activityTracker.style.display =
			activityTracker.style.display === "none" ? "block" : "none";
	});
	document.body.appendChild(btnHide);

	document.body.appendChild(activityTracker);
}
