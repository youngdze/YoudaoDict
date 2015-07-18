<?php
header('Content-Type:text/html;charet=utf-8');

if (!isset($_GET['target']) || empty($_GET['target'])) {
    exit();
}

$target = htmlspecialchars($_GET['target']);
$data = file_get_contents($target);
#$data = file_get_contents('data.json');
echo $data;

?>