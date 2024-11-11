<?php

use MobileDetect\Mobile_Detect;
include "./Mobile_Detect.php";

$path = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$route = [
    '/'=>[
        'pc'=>__DIR__ . '/pc/src/index.html',
        'mobile'=>__DIR__ . '/mobile/src/index.html'
    ],
    '/index.html'=>[
        'pc'=>__DIR__ . '/pc/src/index.html',
        'mobile'=>__DIR__ . '/mobile/src/index.html'
    ],
    '/pay.html'=>[
        'pc'=>__DIR__ . '/pc/src/pay.html',
        'mobile'=>__DIR__ . '/mobile/src/pay.html'
    ],
    '/query.html'=>[
        'pc'=>__DIR__ . '/pc/src/query.html',
        'mobile'=>__DIR__ . '/mobile/src/query.html'
    ],
    '/pay_tmp.html'=>[
        'mobile'=>__DIR__ . '/mobile/src/pay_tmp.html'
    ],
    '/pay_result.html'=>[
        'mobile'=>__DIR__ . '/mobile/src/pay_result.html'
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
