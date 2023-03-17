class Environment{
    constructor(scene, player, name, x=0, y=0){
        if (name == 'water'){
            this.obj = scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(0).setCollideWorldBounds(true)
            this.obj.setCircle(8, 8, 42).setImmovable(true)
        }

        else if (name == 'table'){
            this.obj = scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(1).setCollideWorldBounds(true)
            this.obj.setCircle(12, 4, 38).setImmovable(true)
        }

        else if (name == 'large_table'){
            this.obj = scene.physics.add.sprite(x, y, 'ambient').setScale(2).setFrame(2).setCollideWorldBounds(true)
            this.obj.setBodySize(22, 60).setImmovable(true)
        }

        else if (name == 'drawer'){
            this.obj = scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(3).setCollideWorldBounds(true)
            this.obj.setCircle(13, 3, 36).setImmovable(true)
        }

        else if (name == 'chair'){
            this.obj = scene.physics.add.sprite(x, y, 'ambient').setScale(3).setFrame(4).setCollideWorldBounds(true)
            this.obj.setCircle(8, 8, 42).setImmovable(true)
        }
        
        scene.physics.add.collider(this.obj, player);
    }
}