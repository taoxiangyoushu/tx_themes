<?php

use MobileDetect\Mobile_Detect;
include "./Mobile_Detect.php";

$path = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$route = [
    '/'=>[
        'pc'=>__DIR__ . '/pc/index.html',
        'mobile'=>__DIR__ . '/mobile/index.html'
    ],
    '/index.html'=>[
        'pc'=>__DIR__ . '/pc/index.html',
        'mobile'=>__DIR__ . '/mobile/index.html'
    ],
    '/pay.html'=>[
        'pc'=>__DIR__ . '/pc/pay.html',
        'mobile'=>__DIR__ . '/mobile/pay.html'
    ],
    '/query.html'=>[
        'pc'=>__DIR__ . '/pc/query.html',
        'mobile'=>__DIR__ . '/mobile/query.html'
    ],
    '/pay_tmp.html'=>[
        'mobile'=>__DIR__ . '/mobile/pay_tmp.html'
    ],
    '/pay_result.html'=>[
        'mobile'=>__DIR__ . '/mobile/pay_result.html'
    ]
];
$m = new Mobile_Detect();
if (isset($route[$path])){
    $routeConfig = $route[$path];
    if($m->isMobile($_SERVER['HTTP_USER_AGENT'])){
        echo  file_get_contents($routeConfig['mobile']);
        exit();
    }
    echo file_get_contents($routeConfig['pc']);
}
exit();
