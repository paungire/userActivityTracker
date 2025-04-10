<?
require 'config.php';
require 'auth_yandex.php';

if (isset($_GET['code'])) {
  $token_data = getYandexToken(CLIENT_ID, CLIENT_SECRET, $_GET['code']);

  $token_data['created_at'] = time();

  // Сохраняем в файл (или БД)
  file_put_contents('token.json', json_encode($token_data));

  // Перенаправляем обратно в админку
  header("Location: admin.php?success=1");
  exit;
}
