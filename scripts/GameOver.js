export default class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver')
    }
    create(){
        this.add.text(0,0,'game over');
    }
}