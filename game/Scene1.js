
class Scene1 extends Phaser.Scene {
    constructor(){
        super({key:"Scene1"})
    }

    preload(){
        // IMAGE AND SPRITES
        this.load.image('caution', 'assets/caution.png')
        this.load.image('ground', 'assets/ground2.png')
        this.load.image('circle', 'assets/circle.png')
        this.load.image('bomb', 'assets/bomb.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('key', 'assets/key.png')
        this.load.image('shadow', 'assets/shadow.png')
        this.load.image('axe', 'assets/axe.png')
        this.load.image('medkit', 'assets/medkit.png')
        this.load.image('fire', 'assets/extinguisher.png')

        //SOUND ASSETS
        this.load.audio('chave_caindo', 'assets/sound/chave_caindo.wav')
        this.load.audio('porta_abrindo','assets/sound/porta_abrindo.wav')
        this.load.audio('footstep00', 'assets/sound/footstep00.ogg')
        this.load.audio('footstep01', 'assets/sound/footstep01.ogg')
        this.load.audio('footstep02', 'assets/sound/footstep02.ogg')
        this.load.audio('footstep03', 'assets/sound/footstep03.ogg')
        this.load.audio('footstep04', 'assets/sound/footstep04.ogg')
        this.load.audio('footstep05', 'assets/sound/footstep05.ogg')
        this.load.audio('footstep06', 'assets/sound/footstep06.ogg')
        this.load.audio('footstep07', 'assets/sound/footstep07.ogg')
        this.load.audio('footstep08', 'assets/sound/footstep08.ogg')
        this.load.audio('footstep09', 'assets/sound/footstep09.ogg')
        this.load.audio('obstacle', 'assets/sound/obstacle_dropping.wav')
    }

    create(){
        this.time.paused=false

        // Difficulty control
        timerDuration -= (1000 * difficultyIncrease * level)
        keyRange[0] += (1000 * difficultyIncrease * level)
        if (keyRange[0] > keyRange[1] - 1000)
            keyRange[0] = keyRange[1] - 1000
        keyRange[1] = timerDuration * 0.8
        bombFrequency -= (100 * difficultyIncrease * level)
        maxHealth -= (50 * difficultyIncrease * level)

        // Background Image
        var background = this.add.image(400, 400,'ground')
        background.x = background.displayWidth/2
        background.y = background.displayHeight/2
            // esses são os limites corretos
        this.xLimit = this.game.scale.width
        this.yLimit = this.game.scale.height

        // Player
        this.player = this.physics.add.sprite(350, 350, 'circle')
        this.player.setScale(0.025)
        this.player.setCollideWorldBounds(true)
        
        // Cameras
        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit,true)
        
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
        var doorPosition, doorSize
        var side = Phaser.Math.Between(0, 3)
        switch (side) {
            case 0:
                doorPosition = this.getPosition([0,0], [790,0], 0)
                doorSize = [60, 20]
                break
            case 1:
                doorPosition = this.getPosition([0,0], [0,590], 0)
                doorSize = [20, 60]
                break
            case 2:
                doorPosition = this.getPosition([0,600], [800,600], 0)
                doorSize = [60, 20]
                break
            case 3:
                doorPosition = this.getPosition([800,0], [800,600], 0)
                doorSize = [20, 60]
                break
        
            default:
                doorPosition = this.getPosition([0,0], [800,600], 40)
                break;
        }

        var exitDoor = this.add.rectangle(doorPosition[0], doorPosition[1], doorSize[0], doorSize[1], 0x773311)
        exitDoor.setStrokeStyle(4, 0x333333)
        this.physics.add.existing(exitDoor)
        this.physics.add.collider(this.player, exitDoor, ()=>{this.exitLevel()}, null, this)
        exitDoor.body.setCollideWorldBounds(true).setImmovable(true)

        // Key
        this.setKey(doorPosition)
        this.physics.add.overlap(exitDoor, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [800,600], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })

        this.hasKey = false
        this.keyText = this.add.text(0, 0, "Requires Key!", {font: '30px Arial', fill: '#FFFF44', align: 'center'})
        this.keyText.setShadow(0, 5, '#000000', 4).setScrollFactor(0)
        this.keyText.visible = false

        // Random Object
        this.emitter = EventDispatcher.getInstance();
        this.emitter.on('use item',() =>{
            this.itemText.destroy()
            item = "none"
        })
        this.createItem(Phaser.Math.Between(0, 2), this.getPosition([0,0], [800,600], 40))

        // Timer
        var timeText = this.add.text(30, 30, "", {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)
        var endLevelText = this.add.text(30, 80, "Timer ran out!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0)
        endLevelText.visible = false

        this.timer = new Timer(this, timeText)
        this.timer.setTimer(()=>{endLevelText.visible = true}, timerDuration)

        // Stats
        this.health = maxHealth
        this.healthText = this.add.text(30, 120, this.health, {font: '30px Arial', fill: '#FFFFFF', align: 'center'}).setScrollFactor(0)

        // Extinguisher orb
        this.extinguisherCloud = this.add.circle(100, 100, 30, 0xFDFDFD, 100)//.setVisible(false)
        this.physics.add.existing(this.extinguisherCloud)
        this.physics.add.collider(bombs, this.extinguisherCloud, this.cloudHit, null, this)
        this.playerCenter = new Phaser.Geom.Point(400, 300);

        // Movement Audio
        this.audio_footstep = this.sound.add('footstep00')

        level = 1
    }

    update(delta){
        if (gameOver){ return }

        this.timer.update(delta)
        if (this.keyTextTimer)
            this.keyText.setPosition(400 - this.keyText.width/2, 40 - this.keyText.height/2)
        
        this.healthText.setText(this.health)
        this.player.setTint(0xffaaaa * ((maxHealth - this.health)/maxHealth))
        
        this.movement()
        this.playerCenter.setTo(this.player.x, this.player.y)

        this.aimMovement()
        
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    createItem(object_key, pos=[0,0]){
        var item_info = ["", ""]
        if (object_key == 0)
            item_info = ["axe", "Tem machado"]
        else if (object_key == 1)
            item_info = ["medkit", "Tem medkit"]
        else if (object_key == 2)
            item_info = ["fire", "Tem extintor"]
                    
        this.itemObject = new Interactable(this, item_info[0], this.player, ()=>{
            item = item_info[0]
            this.itemText.setVisible(true)
        })
        this.itemObject.setObject(pos, 0.1)
        this.itemObject.setGenerator(itemRange)
        
        this.itemText = this.add.text(0, 0, item_info[1], {font: '40px Arial', fill: '#FF0000', align: 'center'}).setVisible(false).setScrollFactor(0)
        this.itemText.setPosition(800 - 200 - this.itemText.width / 2, 600 - 100 - this.itemText.height / 2)
    }

    hitBomb()
    {
        if(item == "medkit")
            this.emitter.emit('use item')
        else {
            this.physics.pause()
            this.player.setTint(0xff0000)
            this.endGame()
            gameOver = true
        }
    }

    cloudHit(cloud, obstacle){
        obstacle.destroy()
    }

    endGame(){
        this.gameOverText.visible = true
        this.cameras.main.resetFX()
        this.cameras.main.fade(2000)

        var endGameTimer = new Timer(this)
        endGameTimer.setTimer(()=>{this.scene.start("Menu")}, 2100)
    }

    resetGame(){
        gameOver = false
        this.time.paused = false
        this.scene.restart()
    }

    exitLevel(){
        if (this.hasKey)
            this.resetGame()
        else if (item == "axe"){
            if (this.cursors.space.isDown){
                this.emitter.emit('use item')
                this.resetGame()
            }
        }
        else {
            if (this.keyTextTimer)
                this.keyTextTimer.stop()
            this.keyTextTimer = new Timer(this)
            this.keyText.visible = true
            this.keyTextTimer.setTimer(()=>{this.keyText.visible=false;this.keyTextTimer = null}, 2000)
        }

    }

    setKey(pos=[0,0]){
        // Creates key object
        this.key = new Interactable(this, 'key', this.player, ()=>{
            this.hasKey = true
        }, "chave_caindo", "porta_abrindo")
        this.key.setObject(pos, 0.05)
        this.key.setGenerator(keyRange)
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

    updateAngle(amount, max){
        if (this.aimAngle + amount > 360)
            this.aimAngle -= 360

        if (amount > 0){
            if (this.aimAngle + amount >= max)
                this.aimAngle = max
            else
                this.aimAngle += amount
        }
        else {
            if (this.aimAngle + amount <= max)
                this.aimAngle = max
            else
                this.aimAngle += amount
        }
    }   

    aimMovement(){
        var angle = Phaser.Math.Angle.Between(this.extinguisherCloud.x, this.extinguisherCloud.y, this.player.x, this.player.y)

        if (this.cursors.left.isDown){
            if (angle >= 0){
                if (angle - aimVelocity < 0)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > 0)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (this.cursors.right.isDown){
            if (angle >= 0){
                if (angle + aimVelocity > Math.PI)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, Math.PI - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, - angle - Math.PI, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -aimVelocity, aimRadius)
            }
        }

        if (this.cursors.up.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle >= Math.PI/2 && angle - aimVelocity < Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (this.cursors.down.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle <= -Math.PI/2 && angle + aimVelocity > -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisherCloud], this.playerCenter, -aimVelocity, aimRadius)
            }
        }
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

        // CASO O PERSONAGEM NÃO ESTEJA ANDANDO POR CONTA DE BOTOES SIMULTANEAMENTE APERTADOS ELE TOMA DANO
        if ((this.cursors.up.isDown && this.cursors.down.isDown && (!this.cursors.right.isDown && !this.cursors.left.isDown)) 
             || (this.cursors.right.isDown && this.cursors.left.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown))
             || (this.cursors.up.isDown && this.cursors.right.isDown && this.cursors.left.isDown && this.cursors.down.isDown))    {
            this.updateHealth(2 * -movementPenalty * maxHealth)
        }
        if (this.cursors.up.isDown || this.cursors.right.isDown || this.cursors.left.isDown || this.cursors.down.isDown){
            this.updateHealth(movementPenalty * maxHealth)
            if(!this.audio_footstep.isPlaying){
                var aud = Phaser.Math.Between(0,9)
                var aud_name = 'footstep0' + aud
                this.audio_footstep.destroy()
                this.audio_footstep = this.sound.add(aud_name)
                this.audio_footstep.setVolume(0.3)
                this.audio_footstep.play()
            }
        }
        else{
            this.updateHealth(2 * -movementPenalty * maxHealth)
        }
    }
}