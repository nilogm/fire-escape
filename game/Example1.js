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
        // Difficulty control
        timerDuration -= (1000 * difficultyIncrease)
        keyRange[0] += (1000 * difficultyIncrease)
        if (keyRange[0] > keyRange[1] - 1000)
            keyRange[0] = keyRange[1] - 1000
        keyRange[1] = timerDuration * 0.8
        bombFrequency -= (100 * difficultyIncrease)
        maxHealth -= (100 * difficultyIncrease)

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
        var doorPosition = this.getPosition([0,0], [800,600], 40)
        var exitDoor = new Interactable(this, 'door')
        exitDoor.create(this.player, ()=>{this.exitLevel()})
        exitDoor.obj.setPosition(doorPosition[0], doorPosition[1]).setScale(0.2).setImmovable(true)

        // Key
        this.setKey(doorPosition)
        this.physics.add.overlap(exitDoor.obj, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [800,600], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })

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
            this.resetGame()
        else{   
            if (this.keyTextTimer)
                this.keyTextTimer.stop()
            this.keyTextTimer = new Timer(this)
            this.keyText.visible = true
            this.keyTextTimer.setTimer(()=>{this.keyText.visible=false;this.keyTextTimer = null}, 2000)
        }
    }

    setKey(start=[0,0]){
        // Creates key object
        this.key = new Interactable(this, 'key')
        this.key.obj.setPosition(start[0], start[1]).setScale(0.05).setVisible(false).refreshBody()

        // Time until key is shown
        var timer = new Timer(this)
        timer.setTimer(()=>{
            this.showKey()
        }, Phaser.Math.Between(keyRange[0], keyRange[1]))
    }

    showKey(){
        // Shadow before key falls
        var caution = this.add.image(this.key.obj.x, this.key.obj.y,'shadow').setScale(0.07)
        var event = new Timer(this)
        event.setTimer(()=>{
            caution.destroy()

            // Show key
            this.key.create(this.player, ()=>{
                this.hasKey = true
                this.key.obj.destroy()
                this.sound.add("porta_abrindo").play()
            })
            this.key.obj.setVisible(true)
            this.sound.add("chave_caindo").play()
            
        }, 1000)
    }

    getPosition(min=[0, 0], max=[800, 600], offset=0){
        return [Phaser.Math.Between(min[0] + offset, max[0] - offset), Phaser.Math.Between(min[1] + offset, max[1] - offset)]
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