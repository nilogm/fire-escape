class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    
    preload(){
        
    }

    create(){
        this.startButton = this.add.text(400, 300, "START GAME")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#112' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.startGame())
                            // .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
                            // .on('pointerout', () => button.setStyle({ fill: '#FFF' }));

        this.infoButton = this.add.text(400, 450, "How to Play")
                            .setOrigin(0.5)
                            .setPadding(10)
                            .setStyle({ backgroundColor: '#111' })
                            .setInteractive({hitArea:[20,20], useHandCursor: true })
                            .on('pointerdown', () => this.showInfo());
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
        this.scene.start("Scene1")
        console.log("GAME START")
    }

    showInfo(){
        //ADICIONAR
    }
}

