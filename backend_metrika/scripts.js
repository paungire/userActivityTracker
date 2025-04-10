// Функция преобразования секунд в объект времени (аналог вашей PHP-функции)
function secondsToTime(seconds) {
	const days = Math.floor(seconds / 86400);
	seconds %= 86400;

	const hours = Math.floor(seconds / 3600);
	seconds %= 3600;

	const minutes = Math.floor(seconds / 60);
	seconds %= 60;

	return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	};
}

// Функция для расчета и вывода оставшегося времени
function updateTokenTimeLeft() {
	const now = Math.floor(Date.now() / 1000);
	const timePassed = now - tokenData.created_at;
	const expiresIn = tokenData.expires_in - timePassed;

	const timeLeft = secondsToTime(expiresIn > 0 ? expiresIn : 0);

	// Обновляем значения в таблице
	document.getElementById("time-days").textContent = timeLeft.days;
	document.getElementById("time-hours").textContent = timeLeft.hours;
	document.getElementById("time-minutes").textContent = timeLeft.minutes;
	document.getElementById("time-seconds").textContent = timeLeft.seconds;

	if (expiresIn <= 0) {
		clearInterval(tokenTimer);
		window.location.reload();
	}

	return timeLeft;
}

// Запускаем обновление каждую секунду
const tokenTimer = setInterval(updateTokenTimeLeft, 1000);

// Первый вызов сразу
updateTokenTimeLeft();

// Универсальная функция показа уведомлений
function showNotification(message, type = "success", duration = 3000) {
	const notification = document.createElement("div");
	notification.className = `notification notification-${type}`;

	const icon = type === "success" ? "✓" : type === "error" ? "⚠" : "ℹ";

	notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${message}</span>
  `;

	document.body.appendChild(notification);

	// Показываем уведомление
	setTimeout(() => notification.classList.add("show"), 10);

	// Скрываем через указанное время
	setTimeout(() => {
		notification.classList.add("hide");
		notification.addEventListener("animationend", () => notification.remove());
	}, duration);
}

// Обработка успешного получения токена из URL
function handleTokenSuccess() {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("success")) {
		showNotification("Токен успешно получен и сохранён!", "success");

		// Убираем параметр из URL
		urlParams.delete("success");
		const newUrl =
			window.location.pathname +
			(urlParams.toString() ? "?" + urlParams.toString() : "");
		window.history.replaceState({}, document.title, newUrl);
	}
}

// Обновлённая функция копирования токена
function copyToken() {
	const tokenElement = document.getElementById("tokenValue");
	const tokenText = tokenElement.innerText;

	navigator.clipboard
		.writeText(tokenText)
		.then(() => {
			showNotification("Токен скопирован в буфер обмена!", "success");
		})
		.catch((err) => {
			console.error("Ошибка при копировании:", err);
			showNotification("Не удалось скопировать токен", "error");
		});
}

// Обновлённая функция обновления токена
async function refreshToken() {
	const btn = document.querySelector(".btn-secondary");
	const originalText = btn.innerHTML;

	try {
		btn.disabled = true;
		btn.innerHTML = '<span class="loader"></span> Обновление...';

		const response = await fetch("refresh_token.php");
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || `HTTP error! status: ${response.status}`);
		}

		showNotification("Токен успешно обновлён!", "success");
		setTimeout(() => window.location.reload(), 1000);
	} catch (error) {
		showNotification(`Ошибка обновления: ${error.message}`, "error");
		console.error("Refresh error:", error);
	} finally {
		btn.disabled = false;
		btn.innerHTML = originalText;
	}
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
	handleTokenSuccess();
	// Назначение обработчиков
	document.getElementById("tokenValue").addEventListener("click", copyToken);
	document
		.querySelector(".btn-secondary")
		.addEventListener("click", refreshToken);
});
