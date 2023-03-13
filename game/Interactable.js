class Interactable{
    constructor(scene, sprite, player, callback=null, sound_on_fall=null, sound_on_pick=null){
        this.scene = scene
        this.player = player
        this.callback = callback
        this.sound_on_fall = sound_on_fall
        this.sound_on_pick = sound_on_pick
        this.obj = this.scene.physics.add.sprite(0, 0, sprite).setCollideWorldBounds(true)
    }

    setObject(pos=[0,0], scale=0.5){
        this.position = pos
        this.obj.setPosition(pos[0], pos[1]).setScale(scale).setVisible(false).refreshBody()
    }

    setGenerator(timerRange=[0,1]){
        var timer = new Timer(this.scene)
        timer.setTimer(()=>{
            this.showItem()
        }, Phaser.Math.Between(timerRange[0], timerRange[1]))
    }

    showItem(){
        var caution = this.scene.add.image(this.position[0], this.position[1], 'shadow').setScale(0.07)
        
        var event = new Timer(this.scene)
        event.setTimer(()=>{
            caution.destroy()

            this.scene.physics.add.collider(this.player, this.obj, ()=>{
                    if (this.callback != null)
                        this.callback()
                    if (this.sound_on_pick != null)
                        this.scene.sound.add(this.sound_on_pick).play()
                    this.obj.destroy()
                }, null, this)

            this.obj.setVisible(true)
            if (this.sound_on_fall != null)
                this.scene.sound.add(this.sound_on_fall).play()
            
        }, 1000)
    }
}