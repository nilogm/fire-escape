class ObstacleGenerator{
    /** @type {Phaser.Scene} */
    scene

    /** @type {Phaser.Time.TimerEvent} */
    timerEvent

    /**
	 * 
	 * @param {Phaser.Scene} scene
	 */
    constructor(scene)
	{
		this.scene = scene
	}

    setGenerator(info=[0,0,0,0], frequency=1000){
        this.minX = info[0]
        this.minY = info[1]
        this.maxX = info[2]
        this.maxY = info[3]

        this.timerEvent = new Timer(this.scene)
        this.timerEvent.setTimer(()=>{
            this.generate()
        }, 10000, true)
    }

    generate(){
        var x = Phaser.Math.Between(this.minX, this.maxX);
        var y = Phaser.Math.Between(this.minY, this.maxY);
        var caution = this.scene.add.image(x, y,'shadow').setScale(0.1);

        var sprite = Phaser.Math.Between(2, 2)
        var info = [0, 0, 0, 0]

        var obstacle_falling = this.scene.physics.add.sprite(x, 0, 'obstacles').setScale(2)
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

        obstacle_falling.setVelocity(0, y)

        var event = new Timer(this.scene)
        event.setTimer(()=>{
            obstacle_falling.destroy()
            caution.destroy()
            this.createObstacle(x, y, info[0], info[1], info[2], info[3])
            this.scene.events.emit('shake')
            this.scene.sound.add('obstacle').setDetune(Phaser.Math.Between(-1200,1200)).play()
        }, 1000)
    }

    createObstacle(x, y, frame, radius, offsetX, offsetY){
        var obstacle = bombs.create(x, y, 'obstacles').setImmovable(true).setScale(2).refreshBody().setFrame(frame)
        obstacle.setCircle(radius, offsetX, offsetY)
        obstacle.setCollideWorldBounds(true)

        this.scene.physics.add.overlap(this.scene.player, obstacle, ()=>{
            this.scene.audio_gameover.play()
            this.scene.hitBomb()
        });

        this.killTimer(obstacle)
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} bomb 
     */
    killTimer(bomb){
        this.scene.time.addEvent({
            delay: 30000,
            callback: () => {
                bombs.remove(bomb, true, true)
            }
        })
    }
}