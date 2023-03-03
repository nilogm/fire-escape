class Interactable{
    constructor(scene, sprite){
        this.scene = scene
        this.obj = this.scene.physics.add.sprite(0, 0, sprite).setCollideWorldBounds(true)
    }

    create(player, callback=null, x=0, y=0){
        this.obj.setPosition(x, y)
        this.scene.physics.add.collider(player, this.obj, callback, null, this)
    }
}