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
        this.player.setScale(0.05)
        this.player.setCollideWorldBounds(true)
        
        // Cameras
        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit)
        this.cameras.main.zoomTo(2, timerDuration)
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()

        // Bombs
        bombs = this.physics.add.group()
        this.physics.add.collider(this.player, bombs, this.hitBomb, null, this)

        // Game Over Text
        this.gameOverText = this.add.text(0, 0, "GAME OVER!" , {font: '40px Arial', fill: '#FFFFFF', align: 'center'})
        this.gameOverText.visible = false

        // Bomb Generator
        this.frequency = 500
        new ObstacleGenerator(this).setGenerator([0, 0, 800, 600], this.frequency)

        // Exit Door
        var doorOffset = 40
        var doorX = Phaser.Math.Between(0 + doorOffset, background.displayWidth - doorOffset);
        var doorY = Phaser.Math.Between(0 + doorOffset, background.displayHeight - doorOffset);
        var exitDoor = new Interactable(this, 'door')
        exitDoor.create(this.player, ()=>{this.exitLevel()}, doorX, doorY)
        exitDoor.obj.setScale(0.3).setImmovable(true)

        // Key
        var keyX, keyY, keyOffset = 40
        do{
            keyX = Phaser.Math.Between(0 + keyOffset, background.displayWidth - keyOffset)
            keyY = Phaser.Math.Between(0 + keyOffset, background.displayHeight - keyOffset)
        } while(keyX > doorX - 20 && keyX < doorX + 20 && keyY > doorY - 20 && keyY < doorY + 20)
        this.key = new Interactable(this, 'key')
        this.key.create(this.player, ()=>{this.getKey()}, keyX, keyY)
        this.key.obj.setScale(0.1)

        this.hasKey = false
        this.keyText = this.add.text(0, 0, "Requires Key!", {font: '30px Arial', fill: '#FFFF44', align: 'center'})
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
        if (gameOver)
        {
            this.gameOverText.setPosition(this.player.x - 115, this.player.y - 80)
            this.gameOverText.visible = true

            this.time.paused = true
            return
        }

        this.timer.update(delta)
        if (this.keyTextTimer)
            this.keyText.setPosition(this.player.x - 90, this.player.y - 80)

        this.healthText.setText(this.health)

        this.movement()
       
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    hitBomb(player, bomb)
    {
        this.physics.pause()
        player.setTint(0xff0000)
        gameOver = true
    }

    exitLevel(){
        if (this.hasKey)
            this.scene.restart()

        if (this.keyTextTimer)
            this.keyTextTimer.stop()
        this.keyTextTimer = new Timer(this)
        this.keyText.visible = true
        this.keyTextTimer.setTimer(()=>{this.keyText.visible=false;this.keyTextTimer = null}, 2000)
    }

    getKey(){
        this.hasKey = true
        this.key.obj.destroy()
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