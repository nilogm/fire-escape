class Example1 extends Phaser.Scene {
    constructor(){
        super({key:"Example1"});
    }

    preload(){
        this.load.image('ground', 'assets/ground2.png');
        this.load.image('circle', 'assets/circle.png');
    }

    create(){
        this.background = this.add.image(400,400,'ground');
        this.background.x = this.background.displayWidth / 2;
        this.background.y = this.background.displayHeight / 2;
        this.xLimit = this.background.displayWidth;
        this.yLimit = this.background.displayHeight;

        this.player = this.physics.add.sprite(350, 350, 'circle');
        this.player.setScale(0.05);

        this.cameras.main.setBounds(0, 0, this.xLimit, this.yLimit);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.clock = new Phaser.Time.Clock(this);

        this.timerEvent = new Phaser.Time.TimerEvent();
        this.timerEvent.delay = 1000;
        this.timerEvent.loop = true;
        this.timerEvent.function = this.onEnd;

        this.clock.addEvent(this.timerEvent);

        this.seconds = 0;
    }

    update(delta){
        this.clock.update(Date.now, delta);
        console.log(this.timerEvent.getProgress());

        this.movement();
       
        this.cameras.main.centerOn(this.player.x, this.player.y);
        
        // this.time.events.loop(Phaser.Timer.SECOND, this.onEnd, this);
        this.secondText = this.add.text(220, 80, "Time: 0:00", {font: '30px Arial', fill: '#FFFFFF', align: 'center'});
        this.timeText = this.add.text(220, 30, "Time ran out! " + this.seconds, {font: '30px Arial', fill: '#FFFFFF', align: 'center'});
    }

    onEnd(){
        this.seconds++;
    }

    movement(){
        if (this.cursors.left.isDown && this.player.x >= 0 && !this.cursors.right.isDown) 
            this.player.setVelocityX(-200);
        else if (this.cursors.right.isDown && this.player.x <= this.xLimit && !this.cursors.left.isDown)
            this.player.setVelocityX(200);
        else 
            this.player.setVelocityX(0);
        
        if (this.cursors.up.isDown && this.player.y >= 0 && !this.cursors.down.isDown)
            this.player.setVelocityY(-200);
        else if (this.cursors.down.isDown && this.player.y <= this.yLimit && !this.cursors.up.isDown)
            this.player.setVelocityY(200);
        else
            this.player.setVelocityY(0);
    }
}