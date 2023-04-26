<?php
  session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style2.css"/>
</head>
<body>
<?php
    require 'includes/dbh.inc.php';
    $sql = "SELECT * FROM users WHERE idUsers='".$_SESSION['userid']."'";
    $result= mysqli_query($conn, $sql);
    echo'<div class="infouberdemuser">
        <p> Account created: <p/>' ;
    while($row = mysqli_fetch_assoc($result)){
        echo $row['dateUsers'];
    }
    echo'
  
    </div>

    <div class="navbar">
        <h2>'.$_SESSION['userusn'].'</h2>

    </div>

    <div class="bestenliste">
        <h3>Scoreboard</h3> 
    </div>

    <div class="achlevements">
       <h3>Achievements</h3> 
       <p class="commingsoon"> <b>Coming Soon</b>  </p> 
    </div>';
?>
</body>
</html>