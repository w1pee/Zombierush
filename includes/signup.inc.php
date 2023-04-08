<?php
if(isset($_POST['signup-submit'])){
        require 'dbh.inc.php';
        $username = $_POST['usn'];
        $email = $_POST['email'];
        $password = $_POST['pwd'];
        $passwordrepeat = $_POST['pwd-rep'];
        $date = date('Y-m-d H:i:s');

        $sql = "SELECT usnUsers FROM users WHERE usnUsers=?;";
        $stmt = mysqli_stmt_init($conn);
        //SQL Error if preparation fails
        if(!mysqli_stmt_prepare($stmt, $sql)){
                header("Location: ../signup.php?error=sqlerror");
                exit();
        }
        else{
                //Checking if Users already existing
                mysqli_stmt_bind_param($stmt, "s", $username);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_store_result($stmt);
                $resultCheck = mysqli_stmt_num_rows($stmt);
                if($resultCheck > 0){
                        header("Location: ../signup.php?error=userclaimed");
                        exit();
                }
                else{
                        $sql = "INSERT INTO users(usnUsers, emailUsers, pwdUsers, dateUsers) VALUES (?, ?, ?, ?);";
                        $stmt = mysqli_stmt_init($conn);
                        //SQL Error if preparation fails
                        if(!mysqli_stmt_prepare($stmt, $sql)){
                                header("Location: ../signup.php?error=sqlerror");
                                exit();
                        }
                        else{
                                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                                //Binding data from the input filled by User to database rows
                                mysqli_stmt_bind_param($stmt, "ssss", $username, $email, $hashedPassword, $date);
                                mysqli_stmt_execute($stmt);
                                header("Location: ../signup.php?signup=success");
                                exit();
                        }
                }

        }
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
}
else{
        header("Location: ../signup.php");
        exit();
}