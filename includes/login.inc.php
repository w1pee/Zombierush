<?php
if(isset($_POST['login-submit'])){
    require 'dbh.inc.php';
    $usn = $_POST['usn'];
    $pwd = $_POST['pwd'];

    if(empty($usn) || empty($pwd)){
        header("Location: ../login.php?error=emptyfields");
        exit();
    }
    else{
        $sql = "SELECT * FROM users WHERE usnUsers=?;";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../login.php?error=sqlerror");
            exit();
        }
        else{
            mysqli_stmt_bind_param($stmt, "s", $usn);
            mysqli_stmt_execute($stmt);
            //Checks if User exists
            $result = mysqli_stmt_get_result($stmt);
            if($row = mysqli_fetch_assoc($result)){
                //Checks if password of the user is matching
                $pwdCheck = password_verify($pwd, $row['pwdUsers']);
                if($pwdCheck == false){
                    header("Location: ../login.php?error=wrongpwd&usn=".$usn);
                    exit();
                }
                elseif($pwdCheck == true){
                    session_start();
                    $_SESSION['userid'] = $row['idUsers'];
                    $_SESSION['userusn'] = $row['usnUsers'];

                    header("Location: ../main.php?login=success");
                    exit();
                }
                else{
                    header("Location: ../login.php?error=wrongpwd&usn=".$usn);
                    exit();
                }
            }
            else {
                header("Location: ../login.php?error=nouser");
                exit();
            }
        }
    }

    
}
else{
    header("Location: ../main.php");
    exit();
}