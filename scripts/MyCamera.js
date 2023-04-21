export default class CustomCamera extends Phaser.Cameras.Scene2D.Camera {
  constructor(scene, x, y, width, height) {
    super(x, y, width, height);
    this.scene = scene;
    // additional custom camera logic here
    this.setZoom(2.8);
  }

  follow(Player){
    this.startFollow(Player, false, 0.05, 0.05, 0, 0);
    this.setBounds(0, 0, 1280, 1280);
  }
}