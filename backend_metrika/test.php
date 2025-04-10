<?php
require('config.php');
if (!file_exists('token.json')) {
  die(json_encode(['error' => 'Token not found']));
}
if (!file_exists('conversions.csv')) {
  die(json_encode(['error' => 'CSV file not found']));
}

$token = json_decode(file_get_contents('token.json'), true)['access_token'];
$counter = '100958459';

$curl = curl_init("https://api-metrika.yandex.net/management/v1/counter/" . $counter . "/offline_conversions/upload");

curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, array('file' => new CurlFile(realpath('conversions.csv'))));
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: multipart/form-data", "Authorization: OAuth " . $token));

$result = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

header('Content-Type: application/json');
http_response_code($status);
echo $result;
