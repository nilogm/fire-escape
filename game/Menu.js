class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    
    preload(){
        
    }

    create(){
        
        var background = this.add.image(400, 400,'')
        background.x = background.displayWidth/2
        background.y = background.displayHeight/2

        this.startButton = this.add.text(400, 300, "COMEÇAR")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#112' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.startGame())
                            .on('pointerover', () => this.startButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }));

        this.infoButton = this.add.text(400, 450, "Como Jogar")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#111' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.showInfo())
                            .on('pointerover', () => this.infoButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.infoButton.setStyle({ fill: '#FFF' }));
    }

    update(){
    }

    startGame(){
        gameOver = false
        level = 0

        timerDuration = 20000
        keyRange = [timerDuration * 0.1, timerDuration * 0.75]
        cameraFXOffset = timerDuration/2

        difficultyIncrease = 0.05

        velocity = 400
        maxHealth = 100
        movementPenalty = 0.025

        bombs;
        bombFrequency = 500
        bombOnContact = false
        if(lastScore > highScore) 
            highScore = lastScore;
        lastScore = 0
        this.scene.start("Scene1")
        console.log("GAME START")
    }

    showInfo(){
        //ADICIONAR

        var text = 'COMO JOGAR FIRE ESCAPE:' 
    }
}

