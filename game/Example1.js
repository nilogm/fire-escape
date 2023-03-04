class Example1 extends Phaser.Scene {
    constructor(){
        super({key:"Example1"})
    }

    preload(){
        this.load.image('caution', 'assets/caution.png')
        this.load.image('ground', 'assets/ground2.png')
        this.load.image('circle', 'assets/circle.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('key', 'assets/key.png')
        this.load.image('shadow', 'assets/shadow.png')
        this.load.audio('chave_caindo', 'assets/sound/chave_caindo.wav')
        this.load.audio('porta_abrindo','assets/sound/porta_abrindo.wav')
    }

    create(){
        // Background Image
        var background = this.add.image(400,400,'ground')
        background.x = background.displayWidth / 2
        background.y = background.displayHeight / 2
        this.xLimit = background.displayWidth
        this.yLimit = background.displayHeight

        // Player
        this.player = this.physics.add.sprite(350, 350, 'circle')
        this.player.setScale(0.025)
        this.player.setCollideWorldBounds(true)
        
        // Cameras
        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit)
        
        // Fade Effect + Zoom
        this.cameras.main.zoomTo(1.2, cameraFXOffset)

        var startFade = new Timer(this)
        startFade.setTimer(()=>{
            this.cameras.main.resetFX()
            this.cameras.main.zoomTo(2, timerDuration - cameraFXOffset)
            this.cameras.main.fade(timerDuration - cameraFXOffset)
        }, cameraFXOffset)
        
        // Shake Event
        this.events.on('shake', ()=>{this.cameras.main.shake(100, 0.0025)})
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.on('pointerdown', ()=>{this.resetGame()})
        
        // Bombs
        bombs = this.physics.add.group()
        this.physics.add.collider(this.player, bombs, null, null, this)
        
        // Game Over Text
        this.gameOverText = this.add.text(0, 0, "GAME OVER!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0)
        this.gameOverText.visible = false
        this.gameOverText.setDepth(1)
        this.gameOverText.setPosition(400 - this.gameOverText.getCenter().x, 300 - this.gameOverText.getCenter().y)
        this.gameOverText.setShadow(0, 5, '#000000', 4)

        // Bomb Generator
        new ObstacleGenerator(this).setGenerator([0, 0, 800, 600], bombFrequency)

        // Exit Door
        var doorOffset = 40
        var doorX = Phaser.Math.Between(0 + doorOffset, background.displayWidth - doorOffset);
        var doorY = Phaser.Math.Between(0 + doorOffset, background.displayHeight - doorOffset);
        var exitDoor = new Interactable(this, 'door')
        exitDoor.create(this.player, ()=>{this.exitLevel()}, doorX, doorY)
        exitDoor.obj.setScale(0.2).setImmovable(true)

        // Key
        this.setKey(background, doorX, doorY, 4000)

        this.hasKey = false
        this.keyText = this.add.text(0, 0, "Requires Key!", {font: '30px Arial', fill: '#FFFF44', align: 'center'})
        this.keyText.setShadow(0, 5, '#000000', 4)
        this.keyText.visible = false

        // Timer
        var timeText = this.add.text(30, 30, "", {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)
        var endLevelText = this.add.text(30, 80, "Timer ran out!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0)
        endLevelText.visible = false

        this.timer = new Timer(this, timeText)
        this.timer.setTimer(()=>{endLevelText.visible = true}, timerDuration)

        // Stats
        this.health = maxHealth
        this.healthText = this.add.text(30, 120, this.health, {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)
    }

    update(delta){
        if (gameOver){ return }

        this.timer.update(delta)
        if (this.keyTextTimer)
            this.keyText.setPosition(this.player.x - this.keyText.width/2, this.player.y - this.keyText.height/2 - 70)
        
        this.healthText.setText(this.health)
        
        this.movement()
        
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    hitBomb()
    {
        this.physics.pause()
        this.player.setTint(0xff0000)
        this.endGame()
        gameOver = true
    }

    endGame(){
        this.gameOverText.visible = true
        this.cameras.main.resetFX()
        this.cameras.main.fade(2000)
        this.time.paused = true
    }

    resetGame(){
        gameOver = false
        this.time.paused = false
        this.scene.restart()
    }

    exitLevel(){
        if (this.hasKey)
            this.scene.restart()
        else{   
            if (this.keyTextTimer)
                this.keyTextTimer.stop()
            this.keyTextTimer = new Timer(this)
            this.keyText.visible = true
            this.keyTextTimer.setTimer(()=>{this.keyText.visible=false;this.keyTextTimer = null}, 2000)
        }
    }

    setKey(background, doorX, doorY, duration=0){
        var keyX, keyY, keyOffset = 40
        do{
            keyX = Phaser.Math.Between(0 + keyOffset, background.displayWidth - keyOffset)
            keyY = Phaser.Math.Between(0 + keyOffset, background.displayHeight - keyOffset)
        } while(keyX > doorX - 20 && keyX < doorX + 20 && keyY > doorY - 20 && keyY < doorY + 20)

        var timer = new Timer(this)
        timer.setTimer(()=>{
            this.key = new Interactable(this, 'key')
            this.key.create(this.player, ()=>{
                this.hasKey = true
                this.key.obj.destroy()
                this.sound.add("porta_abrindo").play()
            }, keyX, keyY)
            this.key.obj.setScale(0.05).refreshBody()
            this.sound.add("chave_caindo").play()
        }, duration)
    }

    updateHealth(amount){
        if (this.health + amount > maxHealth)
            this.health = maxHealth
        else if (this.health + amount < 0)
            this.health = 0
        else 
            this.health += amount
    }

    movement(){
        if (this.cursors.left.isDown && this.player.x >= 0 && !this.cursors.right.isDown) 
            this.player.setVelocityX(-velocity)
        else if (this.cursors.right.isDown && this.player.x <= this.xLimit && !this.cursors.left.isDown)
            this.player.setVelocityX(velocity)
        else 
            this.player.setVelocityX(0)
        
        if (this.cursors.up.isDown && this.player.y >= 0 && !this.cursors.down.isDown)
            this.player.setVelocityY(-velocity)
        else if (this.cursors.down.isDown && this.player.y <= this.yLimit && !this.cursors.up.isDown)
            this.player.setVelocityY(velocity)
        else
            this.player.setVelocityY(0)

        if (this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.left.isDown || this.cursors.down.isDown)
            this.updateHealth(movementPenalty * maxHealth)
        else
            this.updateHealth(2 * -movementPenalty * maxHealth)
    }
}