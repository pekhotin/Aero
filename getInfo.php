<?php

function CallAPI($url, $data = false)
{
    $curl = curl_init();
    if ($data)
        $url = sprintf("%s?%s", $url, http_build_query($data));


    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}

$type = $_GET['type'] == 'arrive' ? 'arr' : 'dep' ;
$airport = $_GET['airport'];
$hour = $_GET['hour'];
$day = $_GET['day'];
$month = $_GET['month'];
$year = $_GET['year'];
$appId = $_GET['appId'];
$appKey = $_GET['appKey'];

$url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/".
    $airport . "/" .
    $type . "/" .
    $year . "/" .
    $month . "/" .
    $day . "/" .
    $hour .
    "?appId=" . $appId .
    "&appKey=" . $appKey .
    "&utc=false&numHours=6&maxFlights=10";

$responce = CallAPI($url);

echo $responce;
