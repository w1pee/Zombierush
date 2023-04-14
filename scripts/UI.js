export default class UIScene extends Phaser.Scene{
    constructor(){
        super('UIScene');
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }
    preload(){

    }

    create(){

        //basic UI design
        this.add.text(0,0,'Highsore', { font: '50px Arial', fill: '#000000' });
        this.Highscore = this.add.text(0,50, 50, { font: '50px Arial', fill: '#000000' });

        this.ScoreText = this.add.text(640,0,'Score',{font: '50px Arial', fill: '#000000'});
        this.ScoreText.setOrigin(0.5,0);
        this.Score = this.add.text(640,50,0,{font: '50px Arial', fill: '#000000'});
        this.Score.setOrigin(0.5,0);

        this.HealthText = this.add.text(0,750,'Health: ', {font: '50px Arial', fill: '#000000' });
        
    }
      
}