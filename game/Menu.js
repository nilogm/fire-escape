class Menu extends Phaser.Scene{
    constructor(){
        super({key:"Menu"});
    }
    
    preload(){
        
    }

    create(){
        this.startKey = this.input.keyboard.addKey("SPACE");
        this.add.text(20, 20, "Press Space to Load Game ...");
    }

    update(delta){
        if (this.startKey.isDown == true){
            this.startGame()
            this.scene.start("Example1")
        }
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
    }
}