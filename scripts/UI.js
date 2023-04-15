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
        //score
        this.ScoreText = this.add.text(640,0,'Score',{font: '50px Arial', fill: '#000000'});
        this.ScoreText.setOrigin(0.5,0);
        this.Score = this.add.text(640,50,0,{font: '50px Arial', fill: '#000000'});
        this.Score.setOrigin(0.5,0);
        //health
        this.HealthText = this.add.text(0,750,'Health: ', {font: '50px Arial', fill: '#000000'});
        //Zombie number
        this.ZombieText = this.add.text(0,400,'Zombies: ', {font: '50px Arial', fill: '#000000'})
        const myGame = this.scene.get('MainScene');

        myGame.events.on('setValues', function(hlt,zmb)
        {
            this.HealthText.text = 'Health: ' + hlt;
            this.ZombieText.text = 'Zombies: ' + zmb;
        },this);

    }

    update(){
    }
}