<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link href="style.css" rel="stylesheet">

</head>
<body>
    <div class="login-box">
        <h2>Login</h2>
        <?php
          //Error messages
          if(isset($_GET['error'])){
            if($_GET['error'] == "emptyfields"){
              echo '<p>Fill in all fields</p>';
            }
            if($_GET['error'] == "nouser"){
              echo '<p>This Username does not exist</p>';
            }
            if($_GET['error'] == "wrongpwd"){
              echo '<p>Wrong Password</p>';
            }
          }
        ?>
        <!-- Login data inputs -->
        <form action="includes/login.inc.php" method="POST">
        <?php
          //Saves specific input when sign up fails
          if(isset($_GET['usn'])){
            $usn = $_GET['usn'];
            echo'<div class="user-box">
            <input type="text" name="usn" value="'.$usn.'">
            <label>Username</label>
            </div>';
          }
          else{
            echo'<div class="user-box">
            <input type="text" name="usn">
            <label>Username</label>
            </div>';
          }
        ?>
          <div class="user-box">
            <input type="password" name="pwd">
            <label>Password</label>
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
</body>
</html>