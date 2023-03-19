class ObstacleGenerator{
    /** @type {Phaser.Scene} */
    scene

    /** @type {Phaser.Time.TimerEvent} */
    timerEvent

    /**
	 * 
	 * @param {Phaser.Scene} scene
     * @param {TileGenerator} tileGenerator
	 */
    constructor(scene, tileGenerator)
	{
		this.scene = scene
        this.tileGenerator = tileGenerator
	}

    setGenerator(info=[0,0,0,0], frequency=1000){
        this.minX = info[0]
        this.minY = info[1]
        this.maxX = info[2]
        this.maxY = info[3]

        this.timerEvent = new Timer(this.scene)
        this.timerEvent.setTimer(()=>{
            this.generate()
        }, frequency, true)
    }

    generate(){
        var x = Phaser.Math.Between(this.minX, this.maxX);
        var y = Phaser.Math.Between(this.minY, this.maxY);
        var caution = this.scene.add.image(x, y,'shadow').setScale(2).setDepth(2000)

        var sprite = Phaser.Math.Between(0, 2)
        var info = [0, 0, 0, 0]
        
        var obstacle_falling = this.scene.physics.add.sprite(x, 0, 'obstacles').setScale(2).setDepth(2000)
        if (sprite == 0){
            obstacle_falling.setFrame(0)
            info = [0, 9, 6, 10]
        }
        else if (sprite == 1){
            obstacle_falling.setFrame(1)
            info = [2, 8, 8, 16]
        }
        else if (sprite == 2){
            obstacle_falling.setFrame(3)
            info = [3, 9, 6, 10]
        }

        var flip = Phaser.Math.Between(0, 1)
        if (flip == 1)
            obstacle_falling.setFlipX(true)
        
        var fire = this.tileGenerator.setFire(x, 0, 3)
        fire.setVelocity(0, y).setDepth(2001)

        obstacle_falling.setVelocity(0, y)

        var event = new Timer(this.scene)
        event.setTimer(()=>{
            obstacle_falling.destroy()
            fire.setVelocity(0, 0)
            caution.destroy()
            this.createObstacle(x, y, info[0], info[1], info[2], info[3], flip, fire)
            this.scene.events.emit('shake')
            this.scene.sound.add('obstacle').setDetune(Phaser.Math.Between(-1200,1200)).play()
        }, 1000)
    }

    createObstacle(x, y, frame, radius, offsetX, offsetY, flip, fire){
        var obstacle = bombs.create(x, y, 'obstacles').setImmovable(true).setScale(2).refreshBody().setFrame(frame)
        obstacle.setCircle(radius, offsetX, offsetY).setDepth(2000)
        obstacle.setCollideWorldBounds(true)

        obstacle.on('destroy', ()=>{
            bombs.remove(obstacle, true, true)
            fire.destroy()
        })

        if (flip == 1)
            obstacle.setFlipX(true)

        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                bombs.remove(obstacle, true, true)
                fire.destroy() 
            }
        })
    }
}