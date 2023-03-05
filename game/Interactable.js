class Interactable{
    constructor(scene, sprite){
        this.scene = scene
        this.obj = this.scene.physics.add.sprite(0, 0, sprite).setCollideWorldBounds(true)
    }

    create(player, callback=null){
        this.scene.physics.add.collider(player, this.obj, callback, null, this)
    }
}