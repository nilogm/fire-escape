class HowtoPlay extends Phaser.Scene{
    constructor(){
        super({key:"HowtoPlay"});
    }
    
    preload(){
        this.load.image('main','./assets/mainscreen.png')
    }

    create(){
        
        var background = this.add.image(400, 400,'main')
        background.x = background.displayWidth/2
        background.y = background.displayHeight/2

        this.backButton = this.add.text(400, 450, "Voltar")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#111' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.showInfo())
                            .on('pointerover', () => this.infoButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.infoButton.setStyle({ fill: '#FFF' }));

        this.add.text(150,100,"<nome> é um jogo em que você não pode ficar parado!\nO prédio está ruindo, e para fugir você deve correr\npara pegar a chave que abre a saída evitando obstáculos.").setStyle({ backgroundColor: '#111' }).setStyle({ backgroundColor: '#111' }).setStyle({ backgroundColor: '#111' }) 
    }

    update(){
    }

    showInfo(){
        this.scene.start("Menu")
    }
}

