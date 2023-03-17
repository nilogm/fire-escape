
class Scene1 extends Phaser.Scene {
    constructor(){
        super({key:"Scene1"})
    }

    preload(){
        // IMAGE AND SPRITES
        this.load.image('caution', 'assets/caution.png')
        this.load.image('ground', 'assets/ground2.png')
        this.load.image('circle', 'assets/circle.png')
        //this.load.image('bomb', 'assets/bomb.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('key', 'assets/key.png')
        this.load.image('shadow', 'assets/shadow.png')

        this.load.image('fire', 'assets/Extintor.png')
        this.load.image('axe', 'assets/Machado.png')
        this.load.image('medkit', 'assets/MedKit.png')
        this.load.image('obstacle1', 'assets/Obstaculo1.png')
        this.load.image('obstacle2', 'assets/Obstaculo2.png')
        this.load.image('obstacle3', 'assets/Obstaculo3.png')
        this.load.image('obstacle4', 'assets/Obstaculo4.png')

        this.load.spritesheet('cloud', 'assets/cloud.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('items', 'assets/items.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('oxygen', 'assets/oxygen.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('obstacles', 'assets/obstacles.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('ambient', 'assets/ambient.png', {frameWidth: 32, frameHeight: 64})
        this.load.image('fog', 'assets/fog.png')


        //SOUND ASSETS
        this.load.audio('chave_caindo', 'assets/sound/chave_caindo.wav')
        this.load.audio('porta_abrindo','assets/sound/porta_abrindo.wav')
        this.load.audio('obstacle', 'assets/sound/obstacle_dropping.wav')
        //  Passos
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
        // Porta
        this.load.audio('forcingdoor0', 'assets/sound/forcingdoor0.ogg')
        this.load.audio('forcingdoor1', 'assets/sound/forcingdoor1.ogg')
        this.load.audio('forcingdoor2', 'assets/sound/forcingdoor2.ogg')
        this.load.audio('forcingdoor3', 'assets/sound/forcingdoor3.ogg')
        
        this.load.audio('door_break', 'assets/sound/door_ripped.wav')
        this.load.audio('usemedkit', 'assets/sound/usemedkit.wav')
        this.load.audio('firextinguisher', 'assets/sound/fireextinguisher.mp3')

        this.load.audio('gameover', 'assets/sound/gameover.wav')

    }

    create(){
        this.time.paused = false

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
        this.xLimit = this.game.scale.width
        this.yLimit = this.game.scale.height
        
        // Pre-fog
        var width = this.game.scale.width
        var height = this.game.scale.height
        const rt = this.make.renderTexture({
            width,
            height
        }, true)
        rt.draw('ground')
        // rt.setTint(0x111111).setDepth(2)

        // Stats
        hasKey = false
        this.health = maxHealth
        
        // Player
        this.player = this.physics.add.sprite(350, 350, 'circle').setScale(0.025).setCollideWorldBounds(true)
        this.playerCenter = new Phaser.Geom.Point()
        
        // Cameras
        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit,true)
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        
        // Bombs
        bombs = this.physics.add.group()
        this.physics.add.collider(this.player, bombs, null, null, this)
        var obstacle_generator = new ObstacleGenerator(this)
        obstacle_generator.setGenerator([0, 0, 800, 600], bombFrequency)

        // Exit Door
        var doorPosition = this.createDoor()
        
        // Key
        this.setKey(doorPosition)
        this.physics.add.overlap(this.exitDoor, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [800,600], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })
        
        // Random Object
        this.audio_usingitem = this.sound.add('firextinguisher');
        this.itemHUD;
        this.showItemHUD()
        this.emitter = EventDispatcher.getInstance();
        this.emitter.on('use item', () =>{item = 'none';this.audio_usingitem.play();this.itemHUD.destroy()})
        this.createItem(Phaser.Math.Between(0, 2), this.getPosition([0,0], [800,600], 40))

        // Environment
        // var water_tank = this.physics.add.sprite(300, 300, 'ambient').setScale(3).setFrame(0).setCollideWorldBounds(true)
        // water_tank.setCircle(8, 8, 42).setImmovable(true)
        // var water_tank = this.physics.add.sprite(300, 300, 'ambient').setScale(3).setFrame(1).setCollideWorldBounds(true)
        // water_tank.setCircle(12, 4, 38).setImmovable(true)
        // var water_tank = this.physics.add.sprite(300, 300, 'ambient').setScale(2).setFrame(2).setCollideWorldBounds(true).setImmovable(true)
        // water_tank.setBodySize(22, 60)
        // var water_tank = this.physics.add.sprite(300, 300, 'ambient').setScale(3).setFrame(3).setCollideWorldBounds(true)
        // water_tank.setCircle(13, 3, 36).setImmovable(true)
        // var water_tank = this.physics.add.sprite(300, 300, 'ambient').setScale(3).setFrame(4).setCollideWorldBounds(true)
        // water_tank.setCircle(8, 8, 42).setImmovable(true)
        // this.physics.add.collider(water_tank, this.player);

        // Timer
        this.timer = new Timer(this)
        this.timer.setTimer(()=>{this.endGame()}, timerDuration)

        // Animations -------------
        // Extinguisher Cloud
        this.anims.create({
            key: "cloud_anim",
            frames: this.anims.generateFrameNumbers("cloud"),
            frameRate: 5,
            repeat: -1
        })

        // SFX --------------------
        // Movement Audio
        this.audio_footstep = this.sound.add('footstep00')
        // Trying to open door
        this.audio_trying_open_door = this.sound.add('forcingdoor0')
        this.audio_gameover = this.sound.add('gameover')

        // UI ---------------------
        // Oxygen Meter
        this.oxygenMeter = this.add.sprite(width/2, 500, 'oxygen').setScrollFactor(0).setScale(3).setDepth(3)
        this.oxygenPointer = this.add.sprite(this.oxygenMeter.x - 2, this.oxygenMeter.y, 'oxygen').setScrollFactor(0).setScale(3).setDepth(3)
        this.oxygenPointer.setFrame(1).setOrigin(0.48, 0.575).setAngle(-115)

        // FX ---------------------
        // Fog 
        this.vision = this.make.image({
            x: this.player.x + 4,
            y: this.player.y + 2,
            key: 'fog',
            add: false
        })
        this.vision.scale = 1
        rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision)
        rt.mask.invertAlpha = true

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

        level = 1
    }

    update(delta){
        if (gameOver){ return }

        this.timer.update(delta)

        this.oxygenPointer.setAngle((((timerDuration - this.timer.seconds * 1000) / timerDuration) * 230) - 115)

        if (this.vision)
        {
            this.vision.x = this.player.x + 4
            this.vision.y = this.player.y + 2
        }
        
        this.player.setTint(0xffaaaa * ((maxHealth - this.health)/maxHealth))
        
        this.movement()
        this.playerCenter.setTo(this.player.x, this.player.y)

        this.extinguisherControl()
        
        this.cameras.main.centerOn(this.player.x, this.player.y)
    }

    extinguisherControl(){
        if (item == "fire" && this.cursors.space.isDown){
            this.emitter.emit('use item')
            this.useExtinguisher()
        }
        
        if (this.extinguisher != null){
            this.aimMovement()
            var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.extinguisher.x, this.extinguisher.y)
            this.extinguisher.setRotation(angle)
            this.extinguisher.setFlipY(angle > Math.PI/2 || angle < -Math.PI/2)
        }
    }

    createItem(object_key, pos=[0,0]){
        var item_name
        if (object_key == 0)
            item_name = "fire"
        else if (object_key == 1)
            item_name = "medkit"      
        else if (object_key == 2)
            item_name = "axe"
                       
        this.itemObject = new Interactable(this, 'items', this.player, ()=>{
            if (object_key == 0)
                this.audio_usingitem = this.sound.add('firextinguisher')
            else if (object_key == 1)
                this.audio_usingitem = this.sound.add('usemedkit')
            else if (object_key == 2)
                this.audio_usingitem = this.sound.add('door_break')

            item = item_name
            this.showItemHUD()
        })
        this.itemObject.obj.setFrame(object_key)
        this.itemObject.setObject(pos, 2)
        this.itemObject.setGenerator(itemRange)
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
        cloud.destroy()
    }

    endGame(){
        this.gameOverText = this.add.text(0, 0, "GAME OVER!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0).setDepth(3)
        this.gameOverText.setPosition(400 - this.gameOverText.getCenter().x, 300 - this.gameOverText.getCenter().y)
        this.gameOverText.setShadow(0, 5, '#000000', 4)

        this.cameras.main.resetFX()
        this.cameras.main.fade(2000)

        var endGameTimer = new Timer(this)
        endGameTimer.setTimer(()=>{this.scene.start("Menu")}, 2100)
    }

    resetGame(){
        this.hasKey = false
        gameOver = false
        this.time.paused = false
        lastScore += 1
        this.scene.restart()
    }

    useExtinguisher(){
        this.extinguisher = this.add.sprite(this.player.x + 40, this.player.y, 'items').setScale(2)
        this.extinguisher.setFrame(0)
        
        this.extinguisherClouds = this.physics.add.group()
        this.physics.add.collider(this.extinguisherClouds, bombs, this.cloudHit, null, this)

        var generatorTimer = new Timer(this)
        generatorTimer.setTimer(()=>{
            var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.extinguisher.x, this.extinguisher.y)

            var cloud = this.extinguisherClouds.create(this.extinguisher.x, this.extinguisher.y, 'cloud')
            cloud.play("cloud_anim")
            var velocity = Phaser.Math.Between(550, 650)
            this.physics.velocityFromRotation(angle, velocity, cloud.body.velocity)
            cloud.body.setDrag(1000)

            var cloudTimer = new Timer(this)
            cloudTimer.setTimer(()=>{
                cloud.destroy()
            }, 400)
        }, 100, true)

        var timer = new Timer(this)
        timer.setTimer(()=>{
            this.extinguisher.destroy()
            generatorTimer.stop()
        }, 5000)
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
            if(!this.audio_trying_open_door.isPlaying){
                var aud = Phaser.Math.Between(0,3)
                var aud_name = 'forcingdoor' + aud
                this.audio_trying_open_door.destroy()
                this.audio_trying_open_door = this.sound.add(aud_name)
                this.audio_trying_open_door.setVolume(2)
                this.audio_trying_open_door.play()
            }
        }

    }

    createDoor(){
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

        this.exitDoor = this.add.rectangle(doorPosition[0], doorPosition[1], doorSize[0], doorSize[1], 0x773311).setStrokeStyle(4, 0x333333)
        this.physics.add.existing(this.exitDoor)
        this.physics.add.collider(this.player, this.exitDoor, ()=>{this.exitLevel()}, null, this)
        this.exitDoor.body.setCollideWorldBounds(true).setImmovable(true)

        return doorPosition
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

    aimMovement(){
        var angle = Phaser.Math.Angle.Between(this.extinguisher.x, this.extinguisher.y, this.player.x, this.player.y)

        if (this.cursors.left.isDown){
            if (angle >= 0){
                if (angle - aimVelocity < 0)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > 0)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (this.cursors.right.isDown){
            if (angle >= 0){
                if (angle + aimVelocity > Math.PI)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, Math.PI - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, - angle - Math.PI, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
        }

        if (this.cursors.up.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle >= Math.PI/2 && angle - aimVelocity < Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (this.cursors.down.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle <= -Math.PI/2 && angle + aimVelocity > -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([this.extinguisher], this.playerCenter, -aimVelocity, aimRadius)
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

    showItemHUD(){
        if(item == 'none') return;
        else{
            if(this.itemHUD) this.itemHUD.destroy()
            if(this.audio_usingitem) this.audio_usingitem.destroy()
            switch (item) {
                case 'medkit':
                    this.audio_usingitem = this.sound.add('usemedkit')
                    this.itemHUD = this.add.image(this.game.scale.width/2 +60,500,'medkit').setScale(0.5).setDepth(3).setScrollFactor(0)
                    break;

                case 'axe':
                    this.audio_usingitem = this.sound.add('door_break')
                    this.itemHUD = this.add.image(this.game.scale.width/2 +60,500,'axe').setScale(0.5).setDepth(3).setScrollFactor(0)
                    break;

                case 'fire':
                    this.audio_usingitem = this.sound.add('firextinguisher')
                    this.itemHUD = this.add.image(this.game.scale.width/2 +60, 500,'fire').setScale(0.5).setDepth(3).setScrollFactor(0)
                    break;
                default:
                    break;
            }
        }
    }
}