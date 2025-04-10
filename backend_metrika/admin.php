<? require("config.php") ?>

<?
$token_exists = file_exists('token.json');
$token_valid = false;

if ($token_exists) {
  $token_data = json_decode(file_get_contents('token.json'), true);
  $expires_at = $token_data['expires_in'] - (time() - $token_data['created_at']);
  $token_valid = $expires_at > 0;
}
?>
<!DOCTYPE html>
<html>

<head>
  <title>Управление токеном Метрики</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles.css">
</head>

<body>
  <h1>Управление токеном Яндекс.Метрики</h1>

  <div class="token-status <?= $token_valid ? 'valid' : 'expired' ?>">
    <? if ($token_exists): ?>
      <div style="font-weight: 500; margin-bottom: 0.5rem;">
        <?= $token_valid ? 'Токен активен' : 'Токен истёк' ?>
      </div>
      <div class="token-info">
        <div>
          <span>Срок действия</span>
          <div class="time-grid">
            <div>
              <div class="time-label">Дни</div>
              <div class="time-value" id="time-days">0</div>
            </div>
            <div>
              <div class="time-label">Часы</div>
              <div class="time-value" id="time-hours">0</div>
            </div>
            <div>
              <div class="time-label">Минуты</div>
              <div class="time-value" id="time-minutes">0</div>
            </div>
            <div>
              <div class="time-label">Секунды</div>
              <div class="time-value" id="time-seconds">0</div>
            </div>
          </div>
        </div>
      </div>

      <div class="token-value" id="tokenValue">
        <?= $token_data['access_token'] ?>
      </div>

      <div class="token-actions">
        <button id="refresh_token" class="btn btn-secondary">
          Обновить токен
        </button>
      </div>
    <? else: ?>
      <div style="font-weight: 500;">Токен не получен</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
        Для работы с API необходимо получить токен
      </div>
      <div class="token-actions">
        <a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=<?= CLIENT_ID ?>" class="btn" style="margin-top: 1rem;">
          Получить токен
        </a>
      </div>
    <? endif; ?>
  </div>

  <script>
    // Исходные данные (должны быть переданы из PHP)
    const tokenData = {
      created_at: <?= $token_data['created_at'] ?>, // UNIX timestamp выдачи токена
      expires_in: <?= $token_data['expires_in'] ?> // Время жизни токена в секундах
    };
  </script>
  <script src="./scripts.js"></script>
</body>

</html>