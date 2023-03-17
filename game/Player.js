class Player{
    constructor(scene, xLimit, yLimit, maxHealth, audio_footstep){
        this.xLimit = xLimit
        this.yLimit = yLimit

        this.health = maxHealth

        this.audio_footstep = audio_footstep

        this.obj = scene.physics.add.sprite(100, 100, 'player').setScale(3).setCollideWorldBounds(true)
        this.playerFire = scene.physics.add.sprite(100, 100, 'big_flame').setScale(3)
        this.obj.setCircle(6, 9, 15)
        this.playerCenter = new Phaser.Geom.Point()

        this.scene = scene

        this.obj.on("animationupdate", () => {
            if (this.obj.body.velocity.equals(Phaser.Math.Vector2.ZERO)) {
                this.obj.anims.stop();
                this.obj.anims.setCurrentFrame(this.obj.anims.currentAnim.frames[0])
            }
        })
    }

    setAnimations(anims){
        anims.create({
            key: "player_anim",
            frames: anims.generateFrameNumbers('player', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "small_fire_anim",
            frames: anims.generateFrameNumbers('small_flame'),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "medium_fire_anim",
            frames: anims.generateFrameNumbers('medium_flame'),
            frameRate: 10,
            repeat: -1
        })
        anims.create({
            key: "big_fire_anim",
            frames: anims.generateFrameNumbers('big_flame'),
            frameRate: 10,
            repeat: -1
        })
    }

    update(cursors){
        this.movement(cursors)
        
        this.playerCenter.setTo(this.obj.x, this.obj.y)
        this.playerFire.setPosition(this.obj.x, this.obj.y)

        var percentage = (maxHealth - this.health)/maxHealth
        if (percentage > 0.8){
            this.playerFire.setDepth(this.obj.y + 1)
            this.playerFire.play("big_fire_anim", true)
        }
        else if (percentage > 0.6){
            this.playerFire.setDepth(this.obj.y + 1)
            this.playerFire.play("medium_fire_anim", true)
        }
        else if (percentage > 0.4){
            this.playerFire.setDepth(this.obj.y + 1)
            this.playerFire.play("small_fire_anim", true)
        }
        else {
            this.playerFire.setDepth(this.obj.y - 1)
            this.playerFire.play("small_fire_anim", true)
        }

        this.obj.setDepth(this.obj.y)
    }

    updateHealth(amount){
        if (this.health + amount > maxHealth)
            this.health = maxHealth
        else if (this.health + amount < 0)
            this.health = 0
        else 
            this.health += amount
    }

    movement(cursors){
        if (this.obj.body.velocity.equals(Phaser.Math.Vector2.ZERO)){
            this.updateHealth(-movementPenalty * maxHealth)
        }
        else {
            this.obj.play("player_anim", true)
            this.updateHealth(movementPenalty * maxHealth / 2)
            if(!this.audio_footstep.isPlaying){
                var aud = Phaser.Math.Between(0, 9)
                var aud_name = 'footstep0' + aud
                this.audio_footstep.destroy()
                this.audio_footstep = this.scene.sound.add(aud_name)
                this.audio_footstep.setVolume(0.3)
                this.audio_footstep.play()
            }
        }

        if (cursors.left.isDown && this.obj.x >= 0 && !cursors.right.isDown){
            this.obj.setFlipX(true)
            this.playerFire.setFlipX(true)
            this.obj.setVelocityX(-velocity)
        }
        else if (cursors.right.isDown && this.obj.x <= this.xLimit && !cursors.left.isDown){
            this.obj.setFlipX(false)
            this.playerFire.setFlipX(false)
            this.obj.setVelocityX(velocity)
        }
        else{
            this.obj.setVelocityX(0)
        } 
        
        if (cursors.up.isDown && this.obj.y >= 0 && !cursors.down.isDown){
            this.obj.setVelocityY(-velocity)
        }
        else if (cursors.down.isDown && this.obj.y <= this.yLimit && !cursors.up.isDown){
            this.obj.setVelocityY(velocity)
        }
        else{
            this.obj.setVelocityY(0)
        }
    }

    aimMovement(cursors, extinguisher){
        var angle = Phaser.Math.Angle.Between(extinguisher.x, extinguisher.y, this.obj.x, this.obj.y)

        if (cursors.left.isDown){
            if (angle >= 0){
                if (angle - aimVelocity < 0)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > 0)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (cursors.right.isDown){
            if (angle >= 0){
                if (angle + aimVelocity > Math.PI)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, Math.PI - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, - angle - Math.PI, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
        }

        if (cursors.up.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle >= Math.PI/2 && angle - aimVelocity < Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
            else {
                if (angle + aimVelocity > Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
        }

        if (cursors.down.isDown){
            if (angle >= Math.PI/2 || angle <= -Math.PI/2){
                if (angle <= -Math.PI/2 && angle + aimVelocity > -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, aimVelocity, aimRadius)
            }
            else {
                if (angle - aimVelocity < -Math.PI/2)
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, - Math.PI/2 - angle, aimRadius)
                else 
                    Phaser.Actions.RotateAroundDistance([extinguisher], this.playerCenter, -aimVelocity, aimRadius)
            }
        }
    }
}