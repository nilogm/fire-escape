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
        this.stop()
        this.minX = info[0]
        this.minY = info[1]
        this.maxX = info[2]
        this.maxY = info[3]

        this.timerEvent = this.scene.time.addEvent({
            delay: frequency,
            loop: true,
            callback: () => {
                this.generate()
            }
        })
    }

    generate(){
        var x = Phaser.Math.Between(this.minX, this.maxX);
        var y = Phaser.Math.Between(this.minY, this.maxY);
        var caution = this.scene.add.image(x, y,'caution').setScale(0.07);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                caution.destroy()
                var obstacle = bombs.create(x, y, 'bomb').setScale(2).refreshBody();
                obstacle.setTint(0xff0000)
                obstacle.setCollideWorldBounds(true)
                this.killTimer(obstacle)
            }
        })
    }

    killTimer(bomb){
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                bombs.killAndHide(bomb)
            }
        })
    }

    stop(){
        if (this.timerEvent)
        {
            this.timerEvent.destroy()
            this.timerEvent = undefined
        }
    }
}