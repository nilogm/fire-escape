class Fire{
    constructor(scene, x, y, scale=2){
        var type = Phaser.Math.Between(0, 2)
        if (type == 0){
            this.fire = scene.physics.add.sprite(x, y, 'fire1').setScale(scale)
            this.fire.play("fire1_anim", true)
        }
        if (type == 1){
            this.fire = scene.physics.add.sprite(x, y, 'fire2').setScale(scale)
            this.fire.play("fire2_anim", true)
        }
        if (type == 2){
            this.fire = scene.physics.add.sprite(x, y, 'fire3').setScale(scale)
            this.fire.play("fire3_anim", true)
        }
    }
}