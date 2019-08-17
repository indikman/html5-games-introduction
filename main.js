
// Initializing global variables
var playerSpeed = 7;
var enemySpeed = 5;
var enemies = [];


function StartGame() {

    gameArea.Start();

    // Loading the game items
    player = new component(66, 113, "/assets/player.png", gameArea.canvas.width / 2, gameArea.canvas.height - 150);
    score = new textComponent("30px", "Consolas", "black", 20, 40);
    bg = new background(480,1716,"/assets/bg.png", 0,-858);

    // Adding touch events
    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);
}

var gameArea = {

    canvas: document.createElement("canvas"),
    Start: function () {
        this.canvas.width = 480;
        this.canvas.height = 858;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(Update, 20);
    },
    Clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    Stop: function () {
        clearInterval(this.interval);
    }



}


// Interval Function to return true if the interval is complete within n frames
function everyInterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}


// ###### --------- COMPONENTS ------------------------

function textComponent(fontsize, fonttype, color, x, y){
    this.fontsize = fontsize;
    this.fonttype = fonttype;
    this.x = x;
    this.y = y;
    
    ctx = gameArea.context;

    this.Update = function () {
        ctx.font = this.fontsize + " " + this.fonttype;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}


function background(width, height, image, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    
    this.image = new Image();
    this.image.src = image;
    
    // Adding controllers
    this.speedX = 0;
    this.speedY = 0;
    
    ctx = gameArea.context;
    this.Update = function () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.SetPosition = function () {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y >= 0) {
            this.y = -858;
        }
    }
}


function component(width, height, image, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = image;

    // Adding controllers
    this.speedX = 0;
    this.speedY = 0;

    ctx = gameArea.context;
    this.Update = function () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.SetPosition = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    //collision detection
    this.Collides = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}



function Update() {

    var x;      // random x value to spawn enemies

    // Collision check with all enemies and player
    for (i = 0; i < enemies.length; i++) {
        if (player.Collides(enemies[i])) {
            gameArea.Stop();
            return;
        }
    }

    // clear the canvas
    gameArea.Clear();

    // increment the frame number
    gameArea.frameNo++;

    // moving background
    bg.speedY = 1;
    bg.SetPosition();
    bg.Update();

    // adding new enemy when the interval hits
    if (gameArea.frameNo == 1 || everyInterval(150)) {
        x = Math.random() * (gameArea.canvas.width - 20);

        enemies.push(new component(66, 113, "/assets/enemy1.png", x, -100));
    }

    // updating all the enemy components
    for (i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;
        enemies[i].Update();
    }


    score.text = "SCORE : " + gameArea.frameNo;
    score.Update();

    player.SetPosition();
    player.Update();
}

// #### ---- INPUT MANAGEMENT ---------

function PlayerLeft() {
    player.speedX = -playerSpeed;
}

function PlayerRight() {
    player.speedX = playerSpeed;
}


function keyPress(event) {
    switch (event.keyCode) {
        case 37:
            PlayerLeft();
            break;
        case 39:
            PlayerRight();
            break;
        case 32:
            Console.Log("Space!");
            break;
        default:
            break;
    }
}

function keyRelease(event) {
    if (event.keyCode == 37 || event.keyCode == 39) {
        player.speedX = 0;
    }
}