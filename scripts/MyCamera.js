export default class CustomCamera extends Phaser.Cameras.Scene2D.Camera {
  constructor(scene, x, y, width, height) {
    super(x, y, width, height);
    this.scene = scene;
    // additional custom camera logic here
    this.setZoom(1);
  }

  follow(Player){
    this.startFollow(Player, false, 0.1, 0.1, 0, 0);
    this.setBounds(0, 0, 1600, 1600);
  }
}