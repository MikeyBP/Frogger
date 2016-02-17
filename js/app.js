var CONSTANTS = new function(){
    this.FIELD = {
        width: 505,
        height: 550,
        winning_zone: 15
    };
    this.OBJECTS_PROPERTIES = {
        PLAYER: {
            SIZE: {
                width: 100,
                height: 100
            },
            DEFAULT: {
                x: this.FIELD.width / 2 - 50,
                y: this.FIELD.height / 2 + 130
            }
        },
        CELL_SIZE: {
            x: 100,
            y: 83
        },
        ENEMY: {
            default_x: -100,
            streets: [60, 145, 230]
        }
    };
    this.HIT_ZONE = {
        width: 70,
        height: 70
    }
};


var easy = true;

// ENEMIESSS!!
var Enemy = function() {
    this.x = CONSTANTS.OBJECTS_PROPERTIES.ENEMY.default_x;
    this.y = CONSTANTS.OBJECTS_PROPERTIES.ENEMY.streets[
             getRandomIndex(CONSTANTS.OBJECTS_PROPERTIES.ENEMY.streets)];
    this.sprite = 'images/enemy-bug.png';
    if (easy == true) {
        this.speed = 100;
        easy = false;
    }
    else
    this.speed = getRandomSpeed();
};

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.x > CONSTANTS.FIELD.width + 100){
        this.reset();
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Enemy.prototype.reset = function(){
    this.x = CONSTANTS.OBJECTS_PROPERTIES.ENEMY.default_x;
    this.y = CONSTANTS.OBJECTS_PROPERTIES.ENEMY.streets[
        getRandomIndex(CONSTANTS.OBJECTS_PROPERTIES.ENEMY.streets)];
};


// PLAYA PLAYA!!
var Player = function(){
    this.x = CONSTANTS.OBJECTS_PROPERTIES.PLAYER.DEFAULT.x;
    this.y = CONSTANTS.OBJECTS_PROPERTIES.PLAYER.DEFAULT.y;
    this.sprite = 'images/char-boy.png';
    this.collided = false;
    this.dead = false;
    this.life = 3;
};

Player.prototype.update = function(){
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.resetPosition = function(){
    this.x = CONSTANTS.OBJECTS_PROPERTIES.PLAYER.DEFAULT.x;
    this.y = CONSTANTS.OBJECTS_PROPERTIES.PLAYER.DEFAULT.y;
    this.collided = false;
};

Player.prototype.updateLife = function(life){
    (this.life >= 0) ? this.life += life : this.life;

    if (this.life <= 0){
        this.dead = true;
    }
}

Player.prototype.handleInput = function(direction){

    if (!this.collided){
        var moveVal = 0;
        switch (direction){
            case "left":
                moveVal = this.x - CONSTANTS.OBJECTS_PROPERTIES.CELL_SIZE.x;
                if (moveVal > 0){
                    this.x = moveVal;
                }
                break;
            case "up":
                moveVal = this.y - CONSTANTS.OBJECTS_PROPERTIES.CELL_SIZE.y;
                if (moveVal > -(CONSTANTS.OBJECTS_PROPERTIES.PLAYER.SIZE.height)){
                    this.y = moveVal;
                }
                break;
            case "right":
                moveVal = this.x + CONSTANTS.OBJECTS_PROPERTIES.CELL_SIZE.x;
                if (moveVal < CONSTANTS.FIELD.width - CONSTANTS.OBJECTS_PROPERTIES.PLAYER.SIZE.width){
                    this.x = moveVal;
                }
                break;
            case "down":
                moveVal = this.y + CONSTANTS.OBJECTS_PROPERTIES.CELL_SIZE.y;
                if (moveVal < CONSTANTS.FIELD.height - CONSTANTS.OBJECTS_PROPERTIES.PLAYER.SIZE.height){
                    this.y = moveVal;
                }
                break;
        }
    }
};

//Get the game going~!
var Game = function(){
    this.collisionTriggered = false;
    this.levelCompleted = false;
    this.gameOver = false;
    this.timeLeft = 10;
    this.timestamp = Date.now();
    this.score = 0;
    this.prevScore = 0;

    this.update = function(dt){
        this.player.update();

        this.collisionDetection();

        this.player.collided = this.collisionTriggered;

        this.levelCompleted = (this.player.y <= CONSTANTS.FIELD.winning_zone);

        this.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        if (!this.levelCompleted && !this.gameOver){
            this.updateTime();
        }
    };

    this.reset = function(){
        this.levelCompleted = false;
        this.gameOver = false;
        this.resetTime();
        this.resetScore();
    }

    this.render = function(){
        this.player.render();
        this.interface.drawLife(this.player.life);
        this.interface.renderTimeLeft(this.timeLeft);

        this.allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        if (this.collisionTriggered){
            this.collisionCallback();
        }

        if (this.levelCompleted){
            this.levelCompletedCallback();
        }

        if (this.player.dead){
            this.gameOver = true;
            this.newGame();
        }

        if (this.levelCompleted){
            this.updateScore();
        }
        else{
            this.interface.renderScore(this.score);
        }

    };

    this.newGame = function(){
        easy = true;
        this.interface  = new Interface();
        this.player     = new Player();
        this.allEnemies = [new Enemy()];

        this.reset();
    };

    this.collisionDetection = function(){

        if (!this.collisionTriggered){
            for (var i = 0; i < this.allEnemies.length; i++)
            {
                var enemy = this.allEnemies[i];
                if (this.player.x < enemy.x + CONSTANTS.HIT_ZONE.width &&
                    this.player.x + CONSTANTS.HIT_ZONE.width > enemy.x &&
                    this.player.y < enemy.y + CONSTANTS.HIT_ZONE.height &&
                    this.player.y + CONSTANTS.HIT_ZONE.height > enemy.y)
                {
                    this.collisionTriggered = true;
                    break;
                }
            }
        }
    };

    this.collisionCallback = function(){
        this.player.updateLife(-1);
        this.player.resetPosition();

        this.collisionTriggered = false;
    };

    this.levelCompletedCallback = function(){
        this.prevScore = this.score;
        this.player.resetPosition();
        this.allEnemies.push(new Enemy());
        this.resetTime();
    };

    // this.gameOverCallback = function(){
    //     this.player.resetPosition();
    // }

    this.updateScore = function(){
        this.score += 20 + this.timeLeft;
    };

    this.resetScore = function(){
        this.score = 0;
        this.prevScore = 0;
    };

    this.updateTime = function(){
        if (Date.now() - this.timestamp > 1000) {
            this.timeLeft -= 1;
            this.timestamp = Date.now();
        }

        if (this.timeLeft == 0){
            this.player.updateLife(-1);
            this.resetTime();
        }
    };

    this.resetTime = function(){
        this.timeLeft = 10;
    };
};

//Game Start
var game = new Game();
game.newGame();


//Inputs Yo!
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(allowedKeys[e.keyCode] !== undefined){
        e.preventDefault();
    }

    game.player.handleInput(allowedKeys[e.keyCode]);
});


//Random enemy position
function getRandomIndex(array){
    return Math.floor(Math.random() * array.length);
}

function getRandomSpeed(){
    return Math.floor(Math.random() * (500 - 100 + 1)) + 100;
}
