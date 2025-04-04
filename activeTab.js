console.log(document.querySelector("#activityTracker"));
if (!document.querySelector("#activityTracker")) {
	const userTracker = new UserActivityTracker(89499315);

	const activityTracker = document.createElement("div");
	activityTracker.id = "activityTracker";

	console.log(activityTracker);

	const btnStart = document.createElement("button");
	btnStart.textContent = "Start Tracking";
	btnStart.addEventListener("click", () => {
		userTracker.startTracking();
		console.log("Tracking started");
	});
	activityTracker.appendChild(btnStart);

	const btnStop = document.createElement("button");
	btnStop.textContent = "Stop Tracking";
	btnStop.addEventListener("click", () => {
		userTracker.stopTracking();
		console.log("Tracking stopped");
	});
	activityTracker.appendChild(btnStop);

	const btnClear = document.createElement("button");
	btnClear.textContent = "Clear Store";
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

	const changeClickFactorLabel = document.createElement("label");
	changeClickFactorLabel.textContent = "Click Factor";
	const changeClickFactor = document.createElement("input");
	changeClickFactor.value = userTracker.clickFactor;
	changeClickFactor.addEventListener("change", (e) => {
		userTracker.changeFactor("click", e.target.value);
	});
	changeClickFactorLabel.appendChild(changeClickFactor);
	activityTracker.appendChild(changeClickFactorLabel);

	const changeScrollFactorLabel = document.createElement("label");
	changeScrollFactorLabel.textContent = "Scroll Factor";
	const changeScrollFactor = document.createElement("input");
	changeScrollFactor.value = userTracker.scrollFactor;
	changeScrollFactor.addEventListener("change", (e) => {
		userTracker.changeFactor("scroll", e.target.value);
	});
	changeScrollFactorLabel.appendChild(changeScrollFactor);
	activityTracker.appendChild(changeScrollFactorLabel);

	const changeTimesFactorLabel = document.createElement("label");
	changeTimesFactorLabel.textContent = "Times Factor";
	const changeTimesFactor = document.createElement("input");
	changeTimesFactor.value = userTracker.timesFactor;
	changeTimesFactor.addEventListener("change", (e) => {
		userTracker.changeFactor("times", e.target.value);
	});
	changeTimesFactorLabel.appendChild(changeTimesFactor);
	activityTracker.appendChild(changeTimesFactorLabel);

	// const formula = document.createElement("div");
	// setInterval(() => {
	// 	formula.textContent = `Math.min(1 + Math.floor(${userTracker.times} / 15) * ${userTracker.timesFactor},2) * (${userTracker.clicks} * ${userTracker.clickFactor} + ${userTracker.scrolls} * ${userTracker.scrollFactor})`;
	// }, 1000);
	// activityTracker.appendChild(formula);

	document.body.appendChild(activityTracker);
}
