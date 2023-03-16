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

    setGenerator(info=[0,0,0,0], frequency=1000, sprites=['','','','']){
        this.minX = info[0]
        this.minY = info[1]
        this.maxX = info[2]
        this.maxY = info[3]

        this.timerEvent = new Timer(this.scene)
        this.timerEvent.setTimer(()=>{
            this.generate(sprites[Phaser.Math.Between(0,sprites.length-1)])
        }, frequency, true)
    }

    generate(sprite){
        var x = Phaser.Math.Between(this.minX, this.maxX);
        var y = Phaser.Math.Between(this.minY, this.maxY);
        var caution = this.scene.add.image(x, y,'shadow').setScale(0.1);

        var event = new Timer(this.scene)
        event.setTimer(()=>{
            caution.destroy()
            this.createObstacle(x, y,sprite)
            this.scene.events.emit('shake')
            this.scene.sound.add('obstacle').play()
        }, 1000)
    }

    createObstacle(x, y, sprite){
        var obstacle = bombs.create(x, y, sprite).setImmovable(true).refreshBody()
        obstacle.setCollideWorldBounds(true)

        this.scene.physics.add.overlap(this.scene.player, obstacle, ()=>{
            obstacle.destroy()
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
            delay: 3000,
            callback: () => {
                bombs.remove(bomb, true, true)
            }
        })
    }
}