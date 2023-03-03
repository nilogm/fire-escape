class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    preload(){
        this.load.image("ground",'./assets/ground.png')
    }
    create(){
        this.background = this.add.image(0,0,'ground');
        this.background.setOrigin(0,0);
        this.add.text(20,20,"Loading Game ...");
        this.scene.start("Example1");
    }
}