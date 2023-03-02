class Timer
{
    /** @type {Phaser.Scene} */
    scene

    /** @type {Phaser.GameObjects.Text} */
    label

    /** @type {Phaser.Time.TimerEvent} */
    timerEvent

    duration = 0

    /**
	 * 
	 * @param {Phaser.Scene} scene 
	 * @param {Phaser.GameObjects.Text} label 
	 */
    constructor(scene, label)
	{
		this.scene = scene
		this.label = label
	}

    update(delta){
        if (this.timerEvent){
            const elapsed = this.timerEvent.getElapsed()
            const remaining = this.duration - elapsed
            this.seconds = remaining / 1000
        }

        this.label.text = this.seconds.toFixed(2)
    }

    /**
	 * @param {() => void} callback
	 * @param {number} duration 
	 */
    setTimer(callback, duration=1000){
        this.seconds = 0
        this.duration = duration

        this.stop()
        this.finishedCallback = callback
        this.timerEvent = this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.seconds = 0
                this.stop()
                this.finishedCallback(this.scene)
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