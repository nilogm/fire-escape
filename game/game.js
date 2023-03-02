var config = {
    type:Phaser.AUTO,
    scale: {
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default:'arcade',
        arcade: {
            debug : false
        }
    },
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update
    // }
    scene: [Example1]
};

var game = new Phaser.Game(config);