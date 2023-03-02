class Example1 extends Phaser.Scene {
    constructor(){
        super({key:"Example1"})
    }


    preload(){
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
        
        var bomb = bombs.create(200, 200, 'bomb')
        bomb.setCollideWorldBounds(true)

        // Timer
        this.timeText = this.add.text(220, 30, "", {font: '30px Arial', fill: '#FFFFFF', align: 'center'})
        this.endLevelText = this.add.text(220, 80, "", {font: '40px Arial', fill: '#FFFFFF', align: 'center'})

        this.duration = 2000
        this.timer = new Timer(this, this.timeText)
        this.timer.setTimer(this.onEnd, this.duration)
    }

    update(delta){
        if (gameOver)
        {
            gameOverTxt = this.add.text(this.player.x, this.player.y,"GAME OVER",{font: '40px Arial', fill: '#FFFFFF', align: 'center'})
            return
        }

        this.timer.update(delta)
        this.seconds = this.timer.seconds

        this.movement()
       
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    onEnd(scene){
        scene.endLevelText.setText("Time ran out!")
    }

    hitBomb (player, bomb)
    {
        this.physics.pause()
        player.setTint(0xff0000)
        gameOver = true
    }


    movement(){
        if (this.cursors.left.isDown && this.player.x >= 0 && !this.cursors.right.isDown) 
            this.player.setVelocityX(-200)
        else if (this.cursors.right.isDown && this.player.x <= this.xLimit && !this.cursors.left.isDown)
            this.player.setVelocityX(200)
        else 
            this.player.setVelocityX(0)
        
        if (this.cursors.up.isDown && this.player.y >= 0 && !this.cursors.down.isDown)
            this.player.setVelocityY(-200)
        else if (this.cursors.down.isDown && this.player.y <= this.yLimit && !this.cursors.up.isDown)
            this.player.setVelocityY(200)
        else
            this.player.setVelocityY(0)
    }
}