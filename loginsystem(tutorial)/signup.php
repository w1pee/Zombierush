<?php
    require "header.php";
?>

    <main>
        <h1>Signup</h1>
        <?php
            if(isset($_GET['error'])){
                if($_GET['error'] == "emptyfields"){
                    echo '<p>Fill in all fields</p>';
                }
                elseif($_GET['error'] == "invalidmailuid"){
                    echo '<p>Invalid username and e-mail!</p>';
                }
                elseif($_GET['error'] == "invalidmail"){
                    echo '<p>Invalid username!</p>';
                }
                elseif($_GET['error'] == "invaliduid"){
                    echo '<p>Invalid e-mail!</p>';
                }
                elseif($_GET['error'] == "passwordcheck"){
                    echo '<p>Your passwords do not match!</p>';
                }
                elseif($_GET['error'] == "usertaken"){
                    echo '<p>Username is already taken!</p>';
                }
                elseif($_GET['signup'] == "success"){
                    echo '<p>Signup successful!</p>';
                }
            }
        ?>
        <form action="includes/signup.inc.php" method="POST">
        <input type="text" name="uid" placeholder="Username">
        <input type="text" name="mail" placeholder="E-mail">
        <input type="password" name="pwd" placeholder="Password">
        <input type="password" name="pwd-repeat" placeholder="Repeat password">
        <button type="submit" name="signup-submit">Signup</button>
        </form>
    </main>

<?php
    require "footer.php";
?>