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

var gameOver = false;

var timerDuration = 20000
var velocity = 400
var maxHealth = 100
var movementPenalty = 0.025
