<?php


$servername = "localhost";
$dBUsername = "root";
$dBPassword = "";
$dBName = "loginsystemtut";

$conn = mysqli_connect($servername, $dBUsername, $dBPassword, $dBName);

if(!$conn) {
    die("Connection failed: ".mysqli_connect_error());
}