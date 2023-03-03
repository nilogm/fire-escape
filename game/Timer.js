class Timer
{
    /** @type {Phaser.Scene} */
    scene

    /** @type {Phaser.GameObjects.Text} */
    timerLabel

    /** @type {Phaser.Time.TimerEvent} */
    timerEvent

    duration = 0

    /**
	 * 
	 * @param {Phaser.Scene} scene 
	 * @param {Phaser.GameObjects.Text} timerLabel 
	 */
    constructor(scene, timerLabel=null)
	{
		this.scene = scene
		this.timerLabel = timerLabel
	}

    update(delta){
        if (this.timerEvent){
            const elapsed = this.timerEvent.getElapsed()
            const remaining = this.duration - elapsed
            this.seconds = remaining / 1000
        }

        if (this.timerLabel)
            this.timerLabel.text = this.seconds.toFixed(2)
    }

    /**
	 * @param {() => void} callback
	 * @param {number} duration 
	 */
    setTimer(callback, duration=1000, loop=false){
        this.seconds = 0
        this.duration = duration

        this.stop()
        this.timerEvent = this.scene.time.addEvent({
            delay: duration,
            loop: loop,
            callback: () => {
                this.seconds = 0
                if (!loop)
                    this.stop()
                callback()
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