<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<main>
<div class="login-box">
    <h2>Signup</h2>
        <?php
            //Error messages
            if(isset($_GET['error'])){
                if($_GET['error'] == "emptyfields"){
                    echo '<p>Fill in all fields</p>';
                }
                elseif($_GET['error'] == "invalidmailusn"){
                    echo '<p>Invalid username and e-mail!</p>';
                }
                elseif($_GET['error'] == "invalidusn"){
                    echo '<p>Invalid username!</p>';
                }
                elseif($_GET['error'] == "invalidmail"){
                    echo '<p>Invalid e-mail!</p>';
                }
                elseif($_GET['error'] == "passwordcheck"){
                    echo '<p>Your passwords do not match!</p>';
                }
                elseif($_GET['error'] == "userclaimed"){
                    echo '<p>Username is already taken!</p>';
                }
                elseif($_GET['error'] == "weakpwd"){
                    echo '<p>Weak Password - should be at least 5 characters in length and include at least one uppercase and number</p>';
                }
                elseif($_GET['signup'] == "success"){
                    echo '<p>Signup successful!</p>';
                    echo '<button type="submit" name="headbacktogamefromsignup">Head back to the Game!</button>';
                }
            }
        ?>
    <!-- Registration data inputs -->
    <form action="includes/signup.inc.php" method="POST">
        <?php
            //Saves specific inputs when sign up fails
            echo '<div class="user-box">';
            if(isset($_GET['usn'])){
                $usn = $_GET['usn'];
                echo'<input id="usn" type="text" name="usn" placeholder="Username" value="'.$usn.'">';
            }   
            else{
                echo'<input id="usn" type="text" name="usn" placeholder="Username">';
            }
            echo '<label for="usn">Username</label>';
            echo '</div>';

            echo '<div class="user-box">';
            if(isset($_GET['mail'])){
                $email = $_GET['mail'];
                echo'<input type="email" name="email" placeholder="E-Mail" value="'.$email.'">';
            }
            else{
                echo'<input id="email" type="email" name="email" placeholder="E-Mail">';
            }
            echo '<label for="email">Username</label>';
            echo '</div>';
        ?>
        <div class="user-box">
        <input id="pwd" type="password" name="pwd" placeholder="password">
        <label for="pwd">password</label>
        </div>
        <div class="user-box">
        <input id="pwd-rep" type="password" name="pwd-rep" placeholder="Repeat password">
            <label for="pwd-rep">Repeat password</label>
        </div>
        <button type="submit" name="login-submit">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </button>
    </form>
</div>
</main>
</body>
</html>