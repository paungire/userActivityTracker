<?php
require('config.php');
header('Content-Type: application/json');
if (!file_exists('token.json')) {
  http_response_code(404);
  die(json_encode(['error' => 'Токен не найден']));
}

$token_data = json_decode(file_get_contents('token.json'), true);
if (empty($token_data['refresh_token'])) {
  http_response_code(400);
  die(json_encode(['error' => 'Refresh token отсутствует']));
}

$url = 'https://oauth.yandex.ru/token';
$data = [
  'grant_type' => 'refresh_token',
  'refresh_token' => $token_data['refresh_token'],
  'client_id' => CLIENT_ID,
  'client_secret' => CLIENT_SECRET
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status >= 400) {
  http_response_code($status);
  die($response);
}

$new_token = json_decode($response, true);
if (!isset($new_token['access_token'])) {
  http_response_code(500);
  die(json_encode(['error' => 'Invalid token response']));
}

// Сохраняем новый токен
$token_data['access_token'] = $new_token['access_token'];
$token_data['created_at'] = time();
$token_data['expires_in'] = $new_token['expires_in'];

if (isset($new_token['refresh_token'])) {
  $token_data['refresh_token'] = $new_token['refresh_token'];
}

file_put_contents('token.json', json_encode($token_data));

http_response_code(200);
echo json_encode(['success' => true, 'access_token' => $new_token['access_token']]);
