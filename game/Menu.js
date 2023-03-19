class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    
    preload(){
        this.load.image('main','./assets/menuScreen.png')
    }

    create(){
        var textColor = "#FFFFFF"
        if(lastScore > highScore) {
            textColor = "#FFFF00"
            highScore = lastScore;
        }
        
        var background = this.add.image(400, 400,'main')
        background.x = background.displayWidth/2
        background.y = background.displayHeight/2

        this.startButton = this.add.text(400, 350, "Começar")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ font: "bold 20px Arial",backgroundColor: '#112', fill: "#fff"})
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.startGame())
                            .on('pointerover', () => this.startButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.startButton.setStyle({ fill: '#FFF' }));

        this.infoButton = this.add.text(400, 450, "Como Jogar")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({font: "bold 20px Arial", backgroundColor: '#112' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.showInfo())
                            .on('pointerover', () => this.infoButton.setStyle({ fill: '#f39c12' }))
                            .on('pointerout', () => this.infoButton.setStyle({ fill: '#FFF' }));
                        
        this.HighScoreText = this.add.text(100, 550,"Last Score: " + lastScore + '\nHigh Score: ' + highScore)
                            .setStyle({ font: "italic 15px Arial", color: textColor, backgroundColor: '#113' });

        lastScore = 0
    }

    update(){
    }

    startGame(){
        gameOver = false
        level = 0

        timerDuration = 40000
        
        hasKey = false
        keyRangeVariation = [0.1, 0.2]
        keyRange = [timerDuration * keyRangeVariation[0], timerDuration * keyRangeVariation[1]]

        itemRangeVariation = [0.2, 0.5]
        itemRange = [timerDuration * itemRangeVariation[0], timerDuration * itemRangeVariation[1]]

        cameraFXOffset = timerDuration / 2

        difficultyIncrease = 0.05

        velocity = 400
        maxHealth = 100
        movementPenalty = 0.025

        fogScaling = 3

        // "none" / "medkit" / "fire" / "axe"
        item = "fire"

        lastScore = 0

        bombs = null
        bombFrequency = 500
        
        this.scene.start("Scene1")
    }

    showInfo(){
        this.scene.start("HowtoPlay")
    }
}

