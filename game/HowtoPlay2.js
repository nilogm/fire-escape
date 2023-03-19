class HowtoPlay2 extends Phaser.Scene{
    constructor(){
        super({key:"HowtoPlay2"});
    }
    
    preload(){
        this.load.image('howtoplay2','./assets/howtoplay2.png')
    }

    create(){
        
        var background = this.add.image(400, 400,'howtoplay2')
        background.x = background.displayWidth/2
        background.y = background.displayHeight/2

        this.backButton = this.add.text(200, 550, "Voltar")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#111' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.showInfo())
                            .on('pointerover', () => this.backButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.backButton.setStyle({ fill: '#FFF' }));
                    
    
    }


    update(){
    }

    showInfo(){
        this.scene.start("HowtoPlay1")
    }
}

