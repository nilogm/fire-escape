class TileGenerator{
    constructor(scene){
        this.scene = scene
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

    setEnvironment(group, name, x=0, y=0){
        var obj = group.create(x, y, 'ambient').setScale(3).setCollideWorldBounds(true).refreshBody()   
        if (name == 'water'){
            obj.setFrame(0)
            obj.setCircle(8, 8, 42).setImmovable(true)
        }

        else if (name == 'table'){
            obj.setFrame(1)
            obj.setCircle(12, 4, 38)
        }

        else if (name == 'large_table'){
            obj.setFrame(2)
            obj.setBodySize(22, 60).setImmovable(true)
            // obj.setFrame(1)
            // obj.setCircle(12, 4, 38)
        }

        else if (name == 'drawer'){
            obj.setFrame(3)
            obj.setCircle(13, 3, 36).setImmovable(true)
        }

        else if (name == 'chair'){
            obj.setFrame(4)
            obj.setCircle(8, 8, 42)
        }
        
        obj.setDepth(y)
        return obj
    }

    setDecorations(x, y){
        var type = Phaser.Math.Between(0, 3)
        this.scene.physics.add.sprite(x, y, 'map_decor').setScale(2).setDepth(10).setFrame(type)
    }
}