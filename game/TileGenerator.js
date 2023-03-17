class TileGenerator{
    constructor(scene, player){
        this.scene = scene
        this.player = player
    }

    setFire(x, y, scale=2){
        var fire;
        
        var type = Phaser.Math.Between(0, 2)
        if (type == 0){
            fire = this.scene.physics.add.sprite(x, y, 'fire1').setScale(scale)
            fire.play("fire1_anim", true)
        }
        if (type == 1){
            fire = this.scene.physics.add.sprite(x, y, 'fire2').setScale(scale)
            fire.play("fire2_anim", true)
        }
        if (type == 2){
            fire = this.scene.physics.add.sprite(x, y, 'fire3').setScale(scale)
            fire.play("fire3_anim", true)
        }
        
        return fire
    }

    setFireAnimations(anims){
        anims.create({
            key: "fire1_anim",
            frames: anims.generateFrameNumbers("fire1"),
            frameRate: 5,
            repeat: -1
        })
        anims.create({
            key: "fire2_anim",
            frames: anims.generateFrameNumbers("fire2"),
            frameRate: 5,
            repeat: -1
        })
        anims.create({
            key: "fire3_anim",
            frames: anims.generateFrameNumbers("fire3"),
            frameRate: 5,
            repeat: -1
        })
    }

    setEnvironment(name, x=0, y=0){
        var obj
        if (name == 'water'){
            obj = this.scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(0).setCollideWorldBounds(true)
            obj.setCircle(8, 8, 42).setImmovable(true)
        }

        else if (name == 'table'){
            obj = this.scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(1).setCollideWorldBounds(true)
            obj.setCircle(12, 4, 38).setImmovable(true)
        }

        else if (name == 'large_table'){
            obj = this.scene.physics.add.sprite(x, y, 'ambient').setScale(2).setFrame(2).setCollideWorldBounds(true)
            obj.setBodySize(22, 60).setImmovable(true)
        }

        else if (name == 'drawer'){
            obj = this.scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(3).setCollideWorldBounds(true)
            obj.setCircle(13, 3, 36).setImmovable(true)
        }

        else if (name == 'chair'){
            obj = this.scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(4).setCollideWorldBounds(true)
            obj.setCircle(8, 8, 42).setImmovable(true)
        }
        
        this.scene.physics.add.collider(obj, this.player.obj);
        obj.setDepth(y)
        return obj
    }
}