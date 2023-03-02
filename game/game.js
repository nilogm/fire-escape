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
 
    scene: [Example1]
};

var game = new Phaser.Game(config);
var bombs;
var score = 0;
var gameOver = false;
var gameOverTxt;
