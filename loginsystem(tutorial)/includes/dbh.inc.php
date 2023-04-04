<?php


$servername = "192.168.178.42";
$dBUsername = "Edwin";
$dBPassword = "zmbrush";
$dBName = "loginsystemtut";

$conn = mysqli_connect($servername, $dBUsername, $dBPassword, $dBName);

if(!$conn) {
    die("Connection failed: ".mysqli_connect_error());
}