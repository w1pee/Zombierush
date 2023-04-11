<?php
  session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

    <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
    <script src="//cdn.jsdelivr.net/npm/phaser-matter-collision-plugin"></script>
    <title>Zombierush</title>
    <style>
      .game{
        border-style: groove;
        border-width: 10px;
      }
    </style>
</head>
<body>
    <nav class="navbar navbar-inverse">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="#">Zombierush</a>
          </div>
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
           
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <div>
              <?php
                if(isset($_SESSION['userid'])){
                  echo '<form action="includes/logout.inc.php" method="post">
                  <button type="submit" name="logout-submit">Logout</button>
                  </form>';
                  echo($_SESSION['userusn']);
                }
                else{
                  echo ' <li><a href="signup.php"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
                  <li><a href="login.php"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>';
                }
              ?>
            </div>
          </ul>
        </div>
      </nav>
      <div class="game" id="container"></div>
      <script type="module" src="scripts/game.js"></script>
</body>
</html>