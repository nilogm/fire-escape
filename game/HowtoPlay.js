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
                            
        this.add.text(150,100,"<nome> é um jogo em que você não pode ficar parado!\nO prédio está ruindo, e para fugir você deve correr!\nPegar a chave que abre a saída evitando obstáculos\n e Usa-la para sair pela porta").setStyle({ backgroundColor: '#111' })
        this.add.text(150,170,"Seu objetivo é conseguir chegar o mais longe possível,\ncada andar descido conta um ponto no seu score!\nCada andar contém uma saida em um lugar aleatório nas laterais.")
        this.add.text(150,220,"Em cada nível itens irão cair para te ajudar na aventura!").setStyle({ backgroundColor: '#112' })
        this.add.text(150,250,"O Medkit irá previnir que você morra ao ser atingido uma vez!\nO Extintor pode ser usado para destruir obstaculos no seu caminho!\nO Machado pode ser usado para saír do andar sem a chave quebrando a porta!")
        this.add.text(150,300,"Use as setinhas para se mover, e o espaço para usar o machado ou o extintor.")
    
    }


    update(){
    }

    showInfo(){
        this.scene.start("Menu")
    }
}

