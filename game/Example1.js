class Example1 extends Phaser.Scene {
    constructor(){
        super({key:"Example1"})
    }

    preload(){
        this.load.image('caution', 'assets/caution.png')
        this.load.image('ground', 'assets/ground2.png')
        this.load.image('circle', 'assets/circle.png')
        this.load.image('bomb', 'assets/bomb.png')
    }

    create(){
        this.background = this.add.image(400,400,'ground')
        this.background.x = this.background.displayWidth / 2
        this.background.y = this.background.displayHeight / 2
        this.xLimit = this.background.displayWidth
        this.yLimit = this.background.displayHeight

        this.player = this.physics.add.sprite(350, 350, 'circle')
        this.player.setScale(0.05)
        
        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit)
        this.player.setCollideWorldBounds(true)
        
        this.cursors = this.input.keyboard.createCursorKeys()

        // Bombs
        bombs = this.physics.add.group()
        this.physics.add.collider(this.player, bombs, this.hitBomb, null, this)

        this.gameOverText = this.add.text(0, 0, "GAME OVER" , {font: '40px Arial', fill: '#FFFFFF', align: 'center'})
        this.gameOverText.visible = false

        // Bomb Generator
        this.frequency = 2000
        this.bombGenerator = new ObstacleGenerator(this)
        this.bombGenerator.setGenerator([0, 0, 800, 600], this.frequency)

        // Timer
        this.timeText = this.add.text(30, 30, "", {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)

        this.endLevelText = this.add.text(30, 80, "Timer ran out!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0)
        this.endLevelText.visible = false

        this.duration = 20000
        this.timer = new Timer(this, this.timeText)
        this.timer.setTimer(this.onEnd, this.duration)

        // Stats
        this.healthCapacity = 100
        this.health = this.healthCapacity
        this.penaltyRate = 0.025;
        this.healthText = this.add.text(30, 120, this.health, {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)

        this.velocity = 400
    }

    update(delta){
        if (gameOver)
        {
            this.gameOverText.setPosition(this.player.x, this.player.y)
            this.gameOverText.visible = true

            this.endGame()
            return
        }

        this.timer.update(delta)

        this.healthText.setText(this.health)

        this.movement()
       
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    endGame(){
        this.timer.stop()
        this.bombGenerator.stop()
    }

    onEnd(scene){
        scene.endLevelText.visible = true
    }

    hitBomb (player, bomb)
    {
        this.physics.pause()
        player.setTint(0xff0000)
        gameOver = true
    }

    updateHealth(amount){
        if (this.health + amount > this.healthCapacity)
            this.health = this.healthCapacity
        else if (this.health + amount < 0)
            this.health = 0
        else 
            this.health += amount
    }

    movement(){
        if (this.cursors.left.isDown && this.player.x >= 0 && !this.cursors.right.isDown) 
            this.player.setVelocityX(-this.velocity)
        else if (this.cursors.right.isDown && this.player.x <= this.xLimit && !this.cursors.left.isDown)
            this.player.setVelocityX(this.velocity)
        else 
            this.player.setVelocityX(0)
        
        if (this.cursors.up.isDown && this.player.y >= 0 && !this.cursors.down.isDown)
            this.player.setVelocityY(-this.velocity)
        else if (this.cursors.down.isDown && this.player.y <= this.yLimit && !this.cursors.up.isDown)
            this.player.setVelocityY(this.velocity)
        else
            this.player.setVelocityY(0)

        if (this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.left.isDown || this.cursors.down.isDown)
            this.updateHealth(this.penaltyRate * this.healthCapacity)
        else
            this.updateHealth(2 * -this.penaltyRate * this.healthCapacity)
    }
}