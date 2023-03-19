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
 
    scene: [Menu, HowtoPlay ,Scene1]
};

var game = new Phaser.Game(config);

var gameOver = false
var level = 0

var hasKey = false

var timerDuration = 60000
var keyRangeVariation = [0.1, 0.2]
var itemRangeVariation = [0.2, 0.5]
var keyRange = [timerDuration * keyRangeVariation[0], timerDuration * keyRangeVariation[1]]
var itemRange = [timerDuration * itemRangeVariation[0], timerDuration * itemRangeVariation[1]]
var cameraFXOffset = timerDuration/2

var difficultyIncrease = 0.05

var fogScaling = 3

var environmentObjects

var velocity = 400
var maxHealth = 200
var movementPenalty = 0.025

var bombs;
var bombFrequency = 500

// "none" / "medkit" / "fire" / "axe"
var item = "fire"

var aimRadius = 40
var aimVelocity = Math.PI/10

var highScore = 0
var lastScore = 0