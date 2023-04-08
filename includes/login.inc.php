<?php
if(isset($_POST['login-submit'])){
    require 'dbh.inc.php';
    $usn = $_POST['usn'];
    $pwd = $_POST['pwd'];

    $sql = "SELECT * FROM users WHERE usnUsers=?;";
    $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../main.php?error=sqlerror");
            exit();
        }
        else{
            mysqli_stmt_bind_param($stmt, "s", $usn);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if($row = mysqli_fetch_assoc($result)){
                $pwdCheck = password_verify($pwd, $row['pwdUsers']);
                if($pwdCheck == false){
                    header("Location: ../main.php?error=wrongpwd");
                    exit();
                }
                elseif($pwdCheck == true){
                    session_start();
                    $_SESSION['userid'] = $row['idUsers'];
                    $_SESSION['userusn'] = $row['usnUsers'];

                    header("Location: ../main.php?login=success");
                    exit();
                }
            }
        }
}
else{
    header("Location: ../main.php");
    exit();
}