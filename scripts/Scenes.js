//This is the Scene for pausing the game
//a button that when pressed stops the scene

//and resumes tha mainscene, that has just been paused
export default class Pause extends Phaser.Scene{
    constructor(){
        super("Pause");
    }
    create(){
        console.log("now in Pause"); //just for debugging
        
        //text
        this.add.text(
            640,
            800,
            "press ESC to continue...",
            {                           //styling
                fontSize: 30,
                color: "#FFFFFF",
                fontStyle: "bold",
                backgroundColor: "#000000",
            }
        ).setOrigin(0.5,1);
        //----------------------------------------------------------------

        //button
        this.add.text(
            640, 
            200, 
            "Paused", 
            {                           //styling
                fontSize: 50,
                color: "#FFFFFF",
                fontStyle: "bold",
                backgroundColor: "#000000",
            }
        ).setOrigin(0.5,0.5);
        //----------------------------------------------------------------

        //input
        this.inputkeys = this.input.keyboard.addKeys({
            unpause: Phaser.Input.Keyboard.KeyCodes.ESC,
        });
        //----------------------------------------------------------------
    }
    update(){
        //when ESC pressed, resumes Mainscene & stops this one
        if (this.inputkeys.unpause.isDown) {
            console.log('unpaused')
            this.scene.resume("MainScene");
            this.scene.launch("UIScene");
            this.scene.stop();
            const myGame = this.scene.get('MainScene');
            myGame.pipelineInstance.remove(myGame.cameras.main);
        }
        //----------------------------------------------------------------
    }
}
//----------------------------------------------------------------

//this is the Scene for the game over screen
//it is called when the player dies
//a button that shows the score and a button for restarting
export class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver')
    }
    create(){
        console.log("now in GameOver Scene");   //just for debugging
        this.add.text(640,400,'game over');
        // goes to start Scene after 2seconds
        this.time.delayedCall(2000, () => {
            this.scene.launch('Start');
            this.scene.stop();
        });
        //----------------------------------------------------------------
    }
}
//----------------------------------------------------------------

//this is the Scene for the start screen
//it should only appear at the beginning of the game
//text that says the name of the game + Highscore + button to start the game
export class Start extends Phaser.Scene{
    constructor(){
        super('Start');
    }
    create(){
        console.log("now in Start Scene");  //just for debugging
        //text
        this.add.text(
            640,
            800,
            "press Space to start",
            {                           //styling
                fontSize: 30,
                color: "#FFFFFF",
                fontStyle: "bold",
                backgroundColor: "#000000",
            }
        ).setOrigin(0.5,1);

        //Button
        this.add.text(
            640,
            400,
            "Play",
            {                           //styling
                fontSize: 50,
                color: "#FFFFFF",
                fontStyle: "bold",
                backgroundColor: "#000000",
            }
        ).setOrigin(0.5,0.5);
        //----------------------------------------------------------------

        //input
        this.inputkeys = this.input.keyboard.addKeys({
            Start: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        //----------------------------------------------------------------
    }
    update(){
        if (this.inputkeys.Start.isDown) {
            this.scene.launch('MainScene');
            this.scene.launch("UIScene");
            this.scene.stop();
        }
    }
}
