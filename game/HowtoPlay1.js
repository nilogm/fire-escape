class HowtoPlay1 extends Phaser.Scene{
    constructor(){
        super({key:"HowtoPlay1"});
    }
    
    preload(){
        this.load.image('howtoplay1','./assets/howtoplay1.png')
    }

    create(){
        
        var background = this.add.image(400, 400,'howtoplay1')
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
                            
        this.nextButton = this.add.text(650, 550, "Próximo")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#111' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.scene.start('HowtoPlay2'))
                            .on('pointerover', () => this.nextButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.nextButton.setStyle({ fill: '#FFF' }));
                    
    
    }


    update(){
    }

    showInfo(){
        this.scene.start("Menu")
    }
}

