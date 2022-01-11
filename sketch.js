var canvas;
var ironman, ironmanImg, beam, beamImg, beamGroup, badBeamGroup;
var sky, skyImg;
var robot, robotImg, robotGroup, trappedGirl, trappedGirlImg;
var play, titleScreenImg, titleScreen;
var gameState = "start";
var score = 0;
var backgroundMusic;
var boom, boomImg;
var reset, gameOver, gameOverImg;
var lazerSound, boomSound, gameOverSound;

function preload() {
    ironmanImg = loadImage("Images/ironMan.png");
    skyImg = loadImage("Images/sky.jpg");
    robotImg = loadImage("Images/robot.png");
    trappedGirlImg = loadImage("Images/trappedGirl.png");
    backgroundMusic = loadSound("Images/backgroundMusic.mp3")
    titleScreenImg = loadImage("Images/titleScreen.jpg");
    beamImg = loadImage("Images/beam.png");
    boomImg = loadImage("Images/explosion.png")
    gameOverImg = loadImage("Images/gameOver.png");
    lazerSound = loadSound("Images/laserBeam.mp3");
    boomSound = loadSound("Images/explosion.mp3");
    gameOverSound = loadSound("Images/gameOver.mp3");
}

function setup() {
    canvas = createCanvas(1200,800);
    backgroundMusic.play();

    sky = createSprite(300,300);
    sky.addImage("sky",skyImg);
    sky.scale = 6;
    sky.velocityY = 1;

    gameOver = createSprite(600,400);
    gameOver.addImage("gameover", gameOverImg);
    gameOver.visible = false;

    titleScreen = createSprite(500,400);
    titleScreen.addImage("title", titleScreenImg);
    titleScreen.scale = 0.75;

    play = createImg("Images/play.png");
    play.position(800,400);
    play.size(300,300);
    play.mouseClicked(hide);

    reset = createImg("Images/reset.png");
    reset.position(1100,0);
    reset.size(100,100);
    reset.mouseClicked(resetGame);
    reset.hide();

    ironman = createSprite(300,300,20,20);
    ironman.addImage("ironman", ironmanImg);
    ironman.scale = 0.3;
    ironman.visible = false;
    ironman.setCollider("rectangle",0,0,300,300);

    robotGroup = new Group();
    beamGroup = new Group();
    badBeamGroup = new Group();

    score = 0;
}

function draw() {
    background(200);
    
    if (gameState === "play") {
        reset.show();
        ironman.visible = true;
        if(keyDown("RIGHT")) {
            ironman.x = ironman.x + 8;
        }
      
        if(keyDown("LEFT")) {
            ironman.x = ironman.x + -8;
        }
      
        if(keyDown("SPACE")) {
            ironman.velocityY = -10;
        }

        if(keyDown("UP")) {
            shootBeam();
            lazerSound.play();
        }

        ironman.velocityY = ironman.velocityY + 0.8;

        if(sky.y > 1000){
            sky.y = 300;
        }

        if(robotGroup.collide(beamGroup)) {
            robotHit();
            score = score + 1;
            boomSound.play();
        }

        spawnRobots();

        if(score >= 5) {
            spawnBeams();
        }

        if(score >= 10) {
            spawnRobots();
        }

        if(score >= 20) {
            spawnBeams();
        }

        if(score >= 50) {
            spawnRobots();
        }

        console.log(score);
        
        if (robotGroup.isTouching(ironman)||badBeamGroup.isTouching(ironman)||ironman.y >= 800) {
            gameState = "end";
            reset.position(500,450)
            gameOverSound.play();
            gameOverSound.setVolume(0.05);
            backgroundMusic.stop();
        }
    }
    else if (gameState === "end") {
        ironman.velocityY = 14;
        sky.velocityY = 0;
        gameOver.visible = true;
    }
    drawSprites();
}

function spawnRobots() {
    if (frameCount % 40 === 0) {
        var robot = createSprite(600,-100,40,10);
        robot.x = Math.round(random(1160,40));
        robot.addImage(robotImg);
        robot.scale = 0.3;
        robot.velocityY = (6);
        robot.lifetime = 200;
        robot.depth = ironman.depth;
        ironman.depth = ironman.depth + 1;
        robotGroup.add(robot);
    }
}

function spawnBeams() {
    if (frameCount % 60 === 0) {
        var badBeam = createSprite(600,-100,40,10);
        badBeam.x = Math.round(random(1160,40));
        badBeam.addImage(beamImg);
        badBeam.scale = 0.05;
        badBeam.velocityY = (10);
        badBeam.lifetime = 200;
        badBeam.depth = ironman.depth;
        ironman.depth = ironman.depth + 1;
        badBeamGroup.add(badBeam);
    }
}

function shootBeam() {
    beam = createSprite(150,width/2,50,20);
    beam.y=ironman.y-20;
    beam.x=ironman.x-20;
    beam.addImage(beamImg);
    beam.scale = 0.05;
    beam.velocityY = -10;
    beamGroup.add(beam);
}

function robotHit() {
    beamGroup.destroyEach();
    robotGroup.destroyEach();
    boom = createSprite(beam.x,beam.y-100,50,50);
    boom.addImage(boomImg);
    boom.life=20
    boom.scale = 0.7;
}
  
function hide() {
    play.hide();
    titleScreen.visible = false;
    gameState = "play";
}

function resetGame() {
    location.reload();
}