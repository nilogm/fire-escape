
class Scene1 extends Phaser.Scene {
    constructor(){
        super({key:"Scene1"})
    }

    preload(){
        // IMAGE AND SPRITES
        this.load.image('key', 'assets/key.png')
        this.load.image('door', 'assets/door.png')
        this.load.image('fog', 'assets/fog.png')
        this.load.image('shadow', 'assets/shadow.png')
        this.load.spritesheet('cloud', 'assets/cloud.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('items', 'assets/items.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('oxygen', 'assets/oxygen.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('obstacles', 'assets/obstacles.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('ambient', 'assets/ambient.png', {frameWidth: 32, frameHeight: 64})
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('small_flame', 'assets/small_flame.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('medium_flame', 'assets/medium_flame.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('big_flame', 'assets/big_flame.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('map_decor', 'assets/map_decor.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('fire1', 'assets/fire1.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('fire2', 'assets/fire2.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('fire3', 'assets/fire3.png', {frameWidth: 32, frameHeight: 32})
        this.load.spritesheet('thermo', 'assets/thermo.png', {frameWidth: 32, frameHeight: 32})
        this.load.image('tiles', 'assets/tilemap.png', {frameWidth: 32, frameHeight: 32})

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

        this.load.audio('getitem', 'assets/sound/getitem.wav')


        this.load.audio('gameover', 'assets/sound/gameover.wav')

    }

    create(){
        // Difficulty control
        this.increaseStats()
        this.time.paused = false        

        var width = 1920
        var height = 1080
        
        this.map = new Map(this, width, height)
        this.map.setFog()

        var worldOffset = 128
        this.physics.world.setBounds(worldOffset, worldOffset, width - 2 * worldOffset, height - 2 * worldOffset)

        // SFX --------------------
        // Trying to open door
        this.audio_trying_open_door = this.sound.add('forcingdoor0')
        this.audio_gameover = this.sound.add('gameover')
        this.audio_usingitem;
        
        // Player
        var footsteps = this.sound.add('footstep00')
        var playerPosition = this.getPosition([worldOffset, worldOffset], [width - 2 * worldOffset, height - 2 * worldOffset])
        this.player = new Player(this, playerPosition[0], playerPosition[1], width, height, maxHealth, footsteps)

        // Tile Generator
        var tileGenerator = new TileGenerator(this, this.player)
        tileGenerator.setFireAnimations(this.anims)
        environmentObjects = this.physics.add.group()
        this.map.generateEnvironment(environmentObjects, this.player, tileGenerator, 30, [worldOffset, worldOffset], [width - 2 * worldOffset, height - 2 * worldOffset])
        this.map.generateDecorations(tileGenerator, 30, [worldOffset, worldOffset], [width - worldOffset, height - worldOffset])
        
        // Cameras
        this.cameras.main.setBounds(0, 0, width, height, true)
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()
        
        // Bombs
        bombs = this.physics.add.group()
        this.physics.add.overlap(this.player.obj, bombs, (player, bomb)=>{
            this.audio_gameover.play()
            this.hitBomb(player, bomb)
        }, null, this)
        var obstacle_generator = new ObstacleGenerator(this, tileGenerator)
        obstacle_generator.setGenerator([worldOffset, worldOffset, width - worldOffset, height - worldOffset], bombFrequency)

        // Exit Door
        var doorPosition = this.createDoor(worldOffset, worldOffset, width - worldOffset, height - worldOffset)

        // Key
        this.setKey(doorPosition)
        this.physics.add.overlap(this.exitDoor, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [width,height], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })
        this.physics.add.overlap(environmentObjects, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [width,height], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })
        this.physics.add.overlap(this.player.obj, this.key.obj, ()=>{
            var keyPosition = this.getPosition([0,0], [width,height], 40)
            this.key.obj.setPosition(keyPosition[0], keyPosition[1])
        })

        // Random Object
        this.audio_usingitem = this.sound.add('firextinguisher');
        this.itemHUD;
        this.showItemHUD()
        this.emitter = EventDispatcher.getInstance();
        this.emitter.on('use item', () =>{
            item = 'none'
            this.audio_usingitem.play()
            this.itemHUD.destroy()
        })
        this.createItem(Phaser.Math.Between(0, 2), this.getPosition([0,0], [width,height], 40))

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
        this.player.setAnimations(this.anims)

        // Oxygen Meter
        this.oxygenMeter = this.add.sprite(100, 100, 'oxygen').setScrollFactor(0).setScale(3).setDepth(3000)
        this.oxygenPointer = this.add.sprite(this.oxygenMeter.x - 2, this.oxygenMeter.y, 'oxygen').setScrollFactor(0).setScale(3).setDepth(3000)
        this.oxygenPointer.setFrame(1).setOrigin(0.48, 0.575).setAngle(-115)

        // Thermometer
        this.thermometer = this.add.sprite(200, 100, 'thermo').setScrollFactor(0).setScale(3).setDepth(3000).setFrame(0)

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
        if (this.player.health/maxHealth < 0.2){
            this.thermometer.setFrame(3)
            if (this.healthTimer == null){
                this.healthTimer = new Timer(this)
                this.healthTimer.setTimer(()=>{
                    this.physics.pause()
                    this.player.obj.setTint(0xff0000)
                    this.endGame()
                    gameOver = true
                }, 2000)
            }
        }
        else if (this.player.health/maxHealth < 0.4){
            this.thermometer.setFrame(2)
        }
        else if (this.player.health/maxHealth < 0.6){
            this.thermometer.setFrame(1)
            if (this.healthTimer != null){
                this.healthTimer.stop()
                this.healthTimer = null
            }
        }
        else
            this.thermometer.setFrame(0)

        this.map.updateFogPosition(this.player)
                
        this.player.update(this.cursors)

        this.extinguisherControl()
        
        this.cameras.main.centerOn(this.player.obj.x, this.player.obj.y)
    }

    extinguisherControl(){
        if (item == "fire" && this.cursors.space.isDown){
            this.emitter.emit('use item')
            this.useExtinguisher()
        }
        
        if (this.extinguisher != null){
            this.player.aimMovement(this.cursors, this.extinguisher)
            var angle = Phaser.Math.Angle.Between(this.player.obj.x, this.player.obj.y, this.extinguisher.x, this.extinguisher.y)
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

        this.itemObject = new Interactable(this, 'items', this.player.obj, ()=>{
            if (object_key == 0)
                this.audio_usingitem = this.sound.add('firextinguisher')
            else if (object_key == 1)
                this.audio_usingitem = this.sound.add('usemedkit')
            else if (object_key == 2)
                this.audio_usingitem = this.sound.add('door_break')

            item = item_name
            this.showItemHUD()
        }, "chave_caindo", "getitem")
        this.itemObject.obj.setFrame(object_key)
        this.itemObject.setObject(pos, 2)
        this.itemObject.setGenerator(itemRange)
    }

    hitBomb(player, bomb)
    {
        if(item == "medkit"){
            this.emitter.emit('use item')
            bomb.emit('destroy')
        }
        else {
            this.physics.pause()
            this.player.obj.setTint(0xff0000)
            this.player.playerFire.play("big_fire_anim", true)
            this.player.playerFire.setDepth(this.player.obj.y + 1)
            this.endGame()
            gameOver = true
        }
    }

    cloudHit(cloud, obstacle){
        obstacle.destroy()
        cloud.destroy()
    }

    endGame(){
        this.gameOverText = this.add.text(0, 0, "GAME OVER!", {font: '40px Arial', fill: '#FF0000', align: 'center'}).setScrollFactor(0).setDepth(3000)
        this.gameOverText.setPosition(400 - this.gameOverText.getCenter().x, 300 - this.gameOverText.getCenter().y)
        this.gameOverText.setShadow(0, 5, '#000000', 4)

        this.cameras.main.resetFX()
        this.cameras.main.fade(2000)

        var endGameTimer = new Timer(this)
        endGameTimer.setTimer(()=>{this.scene.start("Menu")}, 2100)
    }

    resetGame(){
        hasKey = false
        gameOver = false
        this.time.paused = false
        lastScore += 1
        this.scene.restart()
    }

    useExtinguisher(){
        this.extinguisher = this.add.sprite(this.player.obj.x + 40, this.player.obj.y, 'items').setScale(2)
        this.extinguisher.setFrame(0)
        
        this.extinguisherClouds = this.physics.add.group()
        this.physics.add.collider(this.extinguisherClouds, bombs, this.cloudHit, null, this)

        var generatorTimer = new Timer(this)
        generatorTimer.setTimer(()=>{
            var angle = Phaser.Math.Angle.Between(this.player.obj.x, this.player.obj.y, this.extinguisher.x, this.extinguisher.y)

            var cloud = this.extinguisherClouds.create(this.extinguisher.x, this.extinguisher.y, 'cloud')
            cloud.play("cloud_anim", true)
            var velocity = Phaser.Math.Between(650, 850)
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
        if (hasKey)
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

    createDoor(minX, minY, maxX, maxY){
        var doorPosition, doorSize, spritePosition
        var side = Phaser.Math.Between(3, 3)
        var sprite = this.add.sprite(0, 0, 'door').setScale(3)

        switch (side) {
            case 0:
                doorPosition = this.getPosition([minX, minY], [maxX, minY], 0)
                doorSize = [60, 20]
                spritePosition = [doorPosition[0], doorPosition[1] - 50]
                break
            case 1:
                doorPosition = this.getPosition([minX, minY], [minX, maxY], 0)
                doorSize = [20, 60]
                sprite.setAngle(270).setFlipX(true)
                spritePosition = [doorPosition[0] - 50, doorPosition[1]]
                break
            case 2:
                doorPosition = this.getPosition([minX, maxY], [maxX, maxY], 0)
                doorSize = [60, 20]
                sprite.setAngle(180).setFlipX(true)
                spritePosition = [doorPosition[0], doorPosition[1] + 60]
                break
            case 3:
                doorPosition = this.getPosition([maxX, minY], [maxX, maxY], 0)
                doorSize = [20, 60]
                sprite.setAngle(90)
                spritePosition = [doorPosition[0] + 50, doorPosition[1]]
                break
        }

        sprite.setPosition(spritePosition[0], spritePosition[1])

        this.exitDoor = this.add.rectangle(doorPosition[0], doorPosition[1], doorSize[0], doorSize[1])
        this.physics.add.existing(this.exitDoor)
        this.physics.add.collider(this.player.obj, this.exitDoor, ()=>{this.exitLevel()}, null, this)
        this.exitDoor.body.setCollideWorldBounds(true).setImmovable(true)

        return doorPosition
    }

    setKey(pos=[0,0]){
        // Creates key object
        this.key = new Interactable(this, 'key', this.player.obj, ()=>{
            hasKey = true
        }, "chave_caindo", "porta_abrindo")
        this.key.setObject(pos, 2)
        this.key.setGenerator(keyRange)
    }

    getPosition(min=[0, 0], max=[800, 600], offset=0){
        return [Phaser.Math.Between(min[0] + offset, max[0] - offset), Phaser.Math.Between(min[1] + offset, max[1] - offset)]
    }

    showItemHUD(){
        if(item == 'none') return;
        else{
            if(this.itemHUD) this.itemHUD.destroy()
            if(this.audio_usingitem) this.audio_usingitem.destroy()
            this.itemHUD = this.add.image(100, 180, 'items').setFrame(1).setScale(3).setDepth(3000).setScrollFactor(0)
            switch (item) {
                case 'medkit':
                    this.audio_usingitem = this.sound.add('usemedkit')
                    this.itemHUD.setFrame(1)
                    break;

                case 'axe':
                    this.audio_usingitem = this.sound.add('door_break')
                    this.itemHUD.setFrame(2)
                    break;

                case 'fire':
                    this.audio_usingitem = this.sound.add('firextinguisher')
                    this.itemHUD.setFrame(0)
                    break;
                default:
                    break;
            }
        }
    }

    increaseStats(){
        timerDuration -= (10000 * difficultyIncrease * level)
        
        keyRange = [timerDuration * keyRangeVariation[0], timerDuration * keyRangeVariation[1]]
        itemRange = [timerDuration * itemRangeVariation[0], timerDuration * itemRangeVariation[1]]
        
        bombFrequency -= (500 * difficultyIncrease * level)
        maxHealth -= (100 * difficultyIncrease * level)
        fogScaling -= (1000 * difficultyIncrease * level)
    }
    
}