<main>
    <h1>Signup</h1>
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
            if(isset($_GET['usn'])){
                $usn = $_GET['usn'];
                echo'<input type="text" name="usn" placeholder="Username" value="'.$usn.'">';
            }   
            else{
                echo'<input type="text" name="usn" placeholder="Username">';
            }
            if(isset($_GET['mail'])){
                $email = $_GET['mail'];
                echo'<input type="email" name="email" placeholder="E-Mail" value="'.$email.'">';
            }
            else{
                echo'<input type="email" name="email" placeholder="E-Mail">';
            }
        ?>
        <input type="password" name="pwd" placeholder="password">
        <input type="password" name="pwd-rep" placeholder="Repeat password">
        <button type="submit" name="signup-submit">Submit</button>
    </form>
</main>