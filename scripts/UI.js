export default class UIScene extends Phaser.Scene{
    constructor(){
        super('UIScene');
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    create(){
        //basic UI design

        //Highscore // sync with database later
        this.add.text(0,0,'Highsore', { font: '50px Arial', fill: '#000000' });
        this.Highscore = this.add.text(0,50, 50, { font: '50px Arial', fill: '#000000' });
        //----------------------------------------------------------------

        //score
        this.ScoreText = this.add.text(640,0,'Score',{font: '50px Arial', fill: '#000000'});
        this.ScoreText.setOrigin(0.5,0);
        this.Score = this.add.text(640,50,0,{font: '50px Arial', fill: '#000000'});
        this.Score.setOrigin(0.5,0);
        //----------------------------------------------------------------

        //health
        this.HealthText = this.add.text(0,750,'Health: ', {font: '50px Arial', fill: '#000000'});
        //----------------------------------------------------------------

        //Zombie number
        this.ZombieText = this.add.text(0,400,'Zombies: ', {font: '50px Arial', fill: '#000000'})
        const myGame = this.scene.get('MainScene');
        //----------------------------------------------------------------

        //function that syncs the values from the MainScene to UI(here)
        myGame.events.on('setValues', function(hlt,zmb)
        {
            this.HealthText.text = 'Health: ' + hlt;
            this.ZombieText.text = 'Zombies: ' + zmb;
        },this);
        //----------------------------------------------------------------

        //this function announces the wave, after 2 seconds it deletes itself
        myGame.events.on('announce', function(n)
        {
            let announce = this.add.text(640,200,'Wave ' + n, {font: '100px Arial', fill: '#FFFFFFFF'});
            announce.setOrigin(0.5,0.5);
            this.time.delayedCall(2000, () => {
                announce.destroy();
            });
        },this);
        //----------------------------------------------------------------
    }

    update(){
    }
}