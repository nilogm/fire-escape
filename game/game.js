var config = {
    type:Phaser.AUTO,
    scale: {
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    pixelArt: true,
    physics: {
        default:'arcade',
        arcade: {
            debug : false
        }
    },
 
    scene: [Menu, Scene1]
};

var game = new Phaser.Game(config);

var gameOver = false
var level = 0

var hasKey = false

var timerDuration = 20000
var keyRange = [timerDuration * 0.1, timerDuration * 0.75]
var itemRange = [timerDuration * 0.2, timerDuration * 0.5]
var cameraFXOffset = timerDuration/2

var difficultyIncrease = 0.05

var velocity = 400
var maxHealth = 100
var movementPenalty = 0.025

var bombs;
var bombFrequency = 500
var bombOnContact = false

// "none" / "medkit" / "fire" / "axe"
var item = "fire"

var aimRadius = 40
var aimVelocity = Math.PI/10