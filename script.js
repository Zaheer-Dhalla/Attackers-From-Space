// ATTACKERS FROM SPACE
// ZAHEER, OWEN, ARUJAN
// MONDAY, JUNE 20TH, 2022
//-------------------------------------------------------------------------------------
import {Algorithms} from "./highscore.js";

// This class is used to format all of the hover images used
class HoverImage
  {
    constructor(ImageSource)
    {
      this.x = -1000;
      this.y = -1000;
      this.boolean = false;
      this.image = new Image();
      this.image.src = ImageSource;
    }
  }
// Allows player to choose between 4 types of ships
class ChooseShip {
  constructor(chosenShip) {
    this.chosenShip = chosenShip;
    this.dataFactory(this.chosenShip);
  }
  static dataFactory(chosenShip) {
    switch (chosenShip) {
      case 0: {
        return new Ship1();
      }
      case 1: {
        return new Ship2();
      }
      case 2: {
        return new Ship3();
      }
      case 3: {
        return new Ship4();
      }
    }
  }
}

// This abstract class is used to create player and enemy sprites on the canvas
class Sprite {
  constructor() {
    if (new.target === Sprite) {
      throw new Error("Cannot create instance of class")
    }
    this.bulletX;
    this.bulletY;
    this.bulletDamage = 5;
    this.velocityVar = 7
    this.collisionHappen = true;
  }

  checkCollision() {
    throw new Error("You have to implement method")
  }

  moveCharacter() {
    throw new Error("You have to implement method")
  }
}
// This class saves an x, y, and boolean value for each bullet used. Width and height are also saved
class Bullet {
  constructor(bulletX, bulletY, allowFire){
    this.bulletWidth = 15;
    this.bulletHeight = 30;
    this.bulletX = bulletX;
    this.bulletY = bulletY;
    this.allowFire = allowFire;
  }
}

// This class contains the player details
class Player extends Sprite {
  constructor() {
    super();
    // Mainly used to convert piercing bullets
    this.shipType;
    this.playerX = 70;
    this.playerY = 585;
    this.playerLives = 3;
    this.playerBullet = new Bullet (-70, 800, true);
    this.playerWidth = 65;
    this.playerHeight = 70;
    this.moveRight = false;
    this.moveLeft = false;
    this.bulletSpeed = 9;
    
    // 0 = Normal | 1 = Piercing
    this.bulletMode = 0;
    document.addEventListener("keydown", (e) => { this.keyDownAction(e) });
    document.addEventListener("keyup", (e) => { this.keyUpAction(e) });

    // Audio cues for shooting and getting hit
    this.fireProjectileSound = new Audio('Audio/fixedProjectileAudio.wav');
    this.robloxOof = new Audio('Audio/fixedRobloxOof.mp3');
  }
  // This method activates booleans and actions depending on what button is clicked
  keyDownAction(e) {
    if (e.keyCode === 68) {
      this.moveRight = true;
    }
    if (e.keyCode === 65) {
      this.moveLeft = true;
    }
    if (e.keyCode === 87 && this.playerBullet.allowFire == true) {
      this.playerBullet.bulletX = this.playerX + 23;
      this.playerBullet.bulletY = this.playerY;
      this.playerBullet.allowFire = false;
      this.fireProjectileSound.play()
    }
  }
  // This method deactivates booleans and actions when keys are not being pressed
  keyUpAction(e) {
    if (e.keyCode === 68) {
      this.moveRight = false;
    }
    if (e.keyCode === 65) {
      this.moveLeft = false;
    }
  }
  // This method moves the players projectile towards the aliens in the right conditions
  fire() {
    // Section will be used for rolling piercing bullets
    if (this.bulletMode === 1){
      let specialBulletChance = 30;
      let specialBulletNumber = Math.floor(Math.random()*specialBulletChance);
      if (specialBulletNumber > 15){
        this.bulletMode = 0;
      }
    }
    // Moving the bullet towards the top of the canvas until it reaches off screen
    this.playerBullet.bulletY -= this.bulletSpeed;
    if (this.playerBullet.bulletY <= 74) {
      this.playerBullet.bulletX = 1000;
      this.playerBullet.allowFire = true;
    }
  }
  // Use a boolean to move character left or right if they are within boundaries. If statements are to stop player from going past boundaries
  moveCharacter() {
    if (this.moveRight === true) {
      if (this.playerX >= 540) {
        this.playerX = 540;
      }
      else {
        this.playerX += this.velocityVar;
      }
    }
    if (this.moveLeft === true) {
      if (this.playerX <= 0) {
        this.playerX = 0;
      }
      else {
        this.playerX -= this.velocityVar;
      }
    }
    // Since moveCharacter is constantly called, fire() is also called
    this.fire();
  }

  // See if the player sprite collides with any of the opponent's bullet sprites
  checkPlayerCollision(canvas, bullet)
  {
    for (let i=0; i < 5; i++)
    {
      if (this.playerX < bullet.bulletX +  bullet.bulletWidth &&
        this.playerX + this.playerWidth > bullet.bulletX &&
        this.playerY < bullet.bulletY + bullet.bulletHeight &&
        this.playerY + this.playerHeight > bullet.bulletY) 
      {
        bullet.bulletX = -1000;
        this.playerLives--;
        this.robloxOof.play();
      }
    }
    this.deathCheck(canvas)
  }

  // If player lives = 0, transition to death state
  deathCheck(canvas){
      if(this.playerLives == 0){
        canvas.deathState();
      }
    }
  }

// 4 different ship types with unique passives
class Ship1 extends Player {
  constructor() {
    super();
    this.velocityVar = 13;
    this.shipType = 1;
  }
}
class Ship2 extends Player {
  constructor() {
    super();
    this.playerLives = 5;
    this.shipType = 2;
  }
}
class Ship3 extends Player {
  constructor() {
    super();
    this.bulletMode = 1;
    this.shipType = 3;
  }
}
class Ship4 extends Player {
  constructor() {
    super();
    this.bulletSpeed = 20;
    this.shipType = 4;
  }
}
// This subclass contains details for enemies
class Enemy extends Sprite {
  constructor(enemyX, enemyY) {
    super();
    this.isAlive = true;
    this.enemyX = enemyX;
    this.enemyY = enemyY;
    this.enemyWidth = 60;
    this.enemyHeight = 60;
  }
}
// Classes for different types of aliens
class GreenEnemy extends Enemy {
  constructor(enemyX, enemyY) {
    super(enemyX, enemyY);
  }
}
class YellowEnemy extends Enemy {
  constructor(enemyX, enemyY) {
    super(enemyX, enemyY);
  }
}
class RedEnemy extends Enemy {
  constructor(enemyX, enemyY) {
    super(enemyX, enemyY);
  }
}
class BlueEnemy extends Enemy {
  constructor(enemyX, enemyY) {
    super(enemyX, enemyY);
  }
}
class TheRoundOne extends Enemy {
  constructor(enemyX, enemyY) {
    super(enemyX, enemyY);
    this.enemyWidth = 50;
    this.enemyHeight = 40;
  }
}
// Controls the movement/behaviour of the opponents in singleplayer
class Grid {
  constructor() {
    // 0 = moving left | 1 = moving right
    this.direction = 0;
    // Position where left most aliens will start
    this.enemyX = 200;
    this.greenPositionY = 300;
    this.yellowPositionY = 250;
    this.redPositionY = 200;
    this.bluePositionY = 150;
    this.originalEnemyX = 200;
    // These will remain unchanging like the previous ones
    this.originalGreenPositionY = 300;
    this.originalYellowPositionY = 250;
    this.originalRedPositionY = 200;
    this.originalBluePositionY = 150;
    // Counting for rounds and game end states
    this.enemiesOnScreen = 20;
    this.greenEnemiesOnScreen = 5;
    this.yellowEnemiesOnScreen = 5;
    this.redEnemiesOnScreen = 5;
    this.blueEnemiesOnScreen = 5;
    // Used to determine how often bullets are fired
    this.levelDiff = 300;
    // This boolean is used to determine whether the user has picked easy or hard mode
    this.hardModeActivated = false;
    
    // Bullets will be shared amongst all the aliens
    this.E1Bullet = new Bullet (-50, 100, false);
    this.E2Bullet = new Bullet (-50, 100, false);
    this.E3Bullet = new Bullet (-50, 100, false);
    this.E4Bullet = new Bullet (-50, 100, false);
    this.E5Bullet = new Bullet (-50, 100, false);
    this.bulletArr = [this.E1Bullet, this.E2Bullet, this.E3Bullet, this.E4Bullet, this.E5Bullet]
    this.velocity = {
      x: 20,
      y: 10
    }
    this.enemiesBlue = [];
    this.enemiesYellow = [];
    this.enemiesGreen = [];
    this.enemiesRed = [];
    this.mike = new TheRoundOne(275, 100);
    
    this.arrayOfEnemies = [this.enemiesGreen, this.enemiesYellow, this.enemiesRed, this.enemiesBlue]

    // In singleplayer, create 5 instances of each type of alien
    // THE SIXTH INSTANCE IS A PLACEHOLDER FOR POSITIONING PURPOSES
    for (let i = 0; i <= 6; i++) {
      this.enemiesGreen.push(new GreenEnemy(this.enemyX + 70 * [i], this.greenPositionY))
    }
    for (let i = 0; i <= 6; i++) {
      this.enemiesYellow.push(new YellowEnemy(this.enemyX + 70 * [i], this.yellowPositionY))
    }
    for (let i = 0; i <= 6; i++) {
      this.enemiesRed.push(new RedEnemy(this.enemyX + 70 * [i], this.redPositionY))
    }
    for (let i = 0; i <= 6; i++) {
      this.enemiesBlue.push(new BlueEnemy(this.enemyX + 70 * [i], this.bluePositionY))
    }
    // Audio cues for enemies firing and being destroyed
    this.enemyDestroyedSound = new Audio ('Audio/alienDestroy.mp3');
    this.enemyFireSound = new Audio ('Audio/enemyFireAudioFixed.mp3');
    this.nextRoundAudio = new Audio('Audio/nextRound.mp3');
  }
  // This method is used to move the aliens downwards
  aliensMovingDown(enemyObject){
    for (let i = 0; i < 6; i++) {
        enemyObject[i].enemyY += this.velocity.y;
      }
  }
  // This method is used for moving the aliens leftwards
  aliensMovingLeft(enemyObject){
    for (let i = 0; i < 6; i++) {
        enemyObject[i].enemyX -= this.velocity.x;
      }
  }
  // This method is used to move the aliens rightwards
  aliensMovingRight(enemyObject){
    for (let i = 0; i < 6; i++) {
        enemyObject[i].enemyX += this.velocity.x;
      }
  }
  // Move enemies after a certain interval
  moveEnemies(canvas) {
    this.hardModeActivated = canvas.hardMode;
    this.leftBoundary = 35;
    this.rightBoundary = 200;
    // If touching boundary, move down
    if (this.enemyX <= this.leftBoundary || this.enemyX >= this.rightBoundary) {
      this.aliensMovingDown(this.enemiesGreen);
      this.aliensMovingDown(this.enemiesYellow);
      this.aliensMovingDown(this.enemiesRed);
      this.aliensMovingDown(this.enemiesBlue);
    }
    // Constant move in either direction
    if (this.enemyX <= this.leftBoundary) {
      this.direction = 1;
    }
    if (this.enemyX >= this.rightBoundary) {
      this.direction = 0;
    }
    // Move left
    if (this.direction === 0 && this.enemyX > this.leftBoundary) {
      this.aliensMovingLeft(this.enemiesGreen);
      this.aliensMovingLeft(this.enemiesYellow);
      this.aliensMovingLeft(this.enemiesRed);
      this.aliensMovingLeft(this.enemiesBlue);
      
      this.enemyX -= this.velocity.x;
    }
    // Move right
    if (this.direction === 1 && this.enemyX < this.rightBoundary) {
      this.aliensMovingRight(this.enemiesGreen);
      this.aliensMovingRight(this.enemiesYellow);
      this.aliensMovingRight(this.enemiesRed);
      this.aliensMovingRight(this.enemiesBlue);
      
      this.enemyX += this.velocity.x;
    }
    this.checkBottomBoundary(canvas);
  }
  // This method ends the game if the aliens get too close to the user
  checkBottomBoundary(canvas){
   if((this.enemiesGreen[5].enemyY >= 525 && this.greenEnemiesOnScreen > 0) || (this.enemiesYellow[5].enemyY >= 525 && this.yellowEnemiesOnScreen > 0) || (this.enemiesRed[5].enemyY >= 525 && this.redEnemiesOnScreen > 0) || (this.enemiesBlue[5].enemyY >= 525 && this.blueEnemiesOnScreen > 0)){
     
      canvas.deathState();
   }
  }
  // This method is used to check if the player projectiles have come into contact with the aliens
  scanForEnemyCollisions(enemyType, player, scoreIncrement, canvas)
  {
    for (let i = 0; i < 5; i++) {
      if (enemyType[i].enemyX < player.playerBullet.bulletX + player.playerBullet.bulletWidth &&
        enemyType[i].enemyX + enemyType[i].enemyHeight > player.playerBullet.bulletX &&
        enemyType[i].enemyY < player.playerBullet.bulletY + player.playerBullet.bulletHeight &&
        enemyType[i].enemyY + enemyType[i].enemyHeight > player.playerBullet.bulletY) 
      {
        enemyType[i].enemyX = -1000
        enemyType[i].enemyY = -1000;
        enemyType[i].isAlive = false;
        if (player.bulletMode === 0 || enemyType === this.enemiesBlue){
          canvas.resetBullet(player.playerBullet);
        }
        this.enemiesOnScreen--;
        if (enemyType === this.enemiesGreen){
          this.greenEnemiesOnScreen--;
        }
        else if (enemyType === this.enemiesYellow){
          this.yellowEnemiesOnScreen--;
        }
        if (enemyType === this.enemiesRed){
          this.redEnemiesOnScreen--;
        }
        if (enemyType === this.enemiesBlue){
          this.blueEnemiesOnScreen--;
        }
        //--------------------------
        this.roundEndCheck(canvas);
        canvas.scoreCount += scoreIncrement;
        this.enemyDestroyedSound.play();
      } 
    }
  }
  // Check if the player shoots an enemy
  checkEnemyCollision(player, canvas) {
    // All alien collisions using the method above this one 
    this.scanForEnemyCollisions(this.enemiesGreen, player,  25, canvas);
    this.scanForEnemyCollisions(this.enemiesYellow, player,  50, canvas);
    this.scanForEnemyCollisions(this.enemiesRed, player,  100, canvas);
    this.scanForEnemyCollisions(this.enemiesBlue, player,  200, canvas);

    if(player.shipType === 3){
      player.bulletMode = 1;
    }
  }
  // This method is used to move aliens back onto the canvas when the round ends. This method is called for each alien in the method below
  movingEnemies(enemyType, originalEnemyType){
    for (let i=0;i<6;i++){
      enemyType[i].enemyX = this.originalEnemyX+70*i;
      enemyType[i].enemyY = originalEnemyType;
      enemyType[i].isAlive = true;
    }
  }

  // Checking if the round is over
  roundEndCheck(canvas){
    if (this.enemiesOnScreen === 0){
      if (this.hardModeActivated === true){
        canvas.scoreCount += 5000;
      }
      else{
        canvas.scoreCount += 1000;
      }
      canvas.roundCount ++; 
      // Reset enemy counters and positions
      this.enemiesOnScreen = 20;
      this.greenEnemiesOnScreen = 5;
      this.yellowEnemiesOnScreen = 5;
      this.redEnemiesOnScreen = 5;
      this.blueEnemiesOnScreen = 5
      this.enemyX = this.originalEnemyX;
      // Increase speed after each round
      this.velocity.x *= 1.1;
      this.velocity.y *= 1.1;
      // Increase size of mike in the background
      this.mike.enemyWidth *= 1.2;
      this.mike.enemyHeight *= 1.2;
      this.mike.enemyX -= this.mike.enemyWidth/10
      // Increase bullet chance after each round
      if (this.hardModeActivated === true){
        this.levelDiff -= 40;
      }
      else{
        this.levelDiff -= 20;
      }
      this.nextRoundAudio.play();

      // Using the method above to move the aliens after the round ends
      this.movingEnemies(this.enemiesGreen, this.originalGreenPositionY);
      this.movingEnemies(this.enemiesYellow, this.originalYellowPositionY);
      this.movingEnemies(this.enemiesRed, this.originalRedPositionY);
      this.movingEnemies(this.enemiesBlue, this.originalBluePositionY);
    }
  }
  // This method is used to give each alien a chance to shoot at a projectile. This method is called for each alien type in the method below
  enemiesFireChanceTemplate(enemyType)
  {
    for (let i=0; i<5;i++){
      let shotChance = Math.floor(Math.random()*this.levelDiff);
      if (this.hardModeActivated === true){
        if (shotChance < 10 && enemyType[i].isAlive === true){
        this.enemyFireSuccess(enemyType[i]);
        }
      }
      else{
        if (shotChance === 2 && enemyType[i].isAlive === true){
        this.enemyFireSuccess(enemyType[i]);
        }
      }
    }
  }
  // Where enemies have a chance to fire a bullet
  enemiesFireChance(){
    this.enemiesFireChanceTemplate(this.enemiesGreen);
    this.enemiesFireChanceTemplate(this.enemiesYellow);
    this.enemiesFireChanceTemplate(this.enemiesRed);
    this.enemiesFireChanceTemplate(this.enemiesBlue);
  }
  // See which bullet is available and fire it
  enemyFireSuccess(enemy){
    let currentBullet = this.bulletCheck();
    if (currentBullet >=0 && currentBullet <=5){
      this.bulletArr[currentBullet].bulletX = enemy.enemyX + 23;
      this.bulletArr[currentBullet].bulletY = enemy.enemyY;
      this.enemyFire (this.bulletArr[currentBullet]);
    }
  }
  // If an enemy gets the right number, check to see which bullets are available
  bulletCheck(){
    if (this.E1Bullet.allowFire === false){
      this.E1Bullet.allowFire = true;
      this.enemyFireSound.play();
      return 0;
    }
    else if (this.E2Bullet.allowFire === false){
      this.E2Bullet.allowFire = true;
      this.enemyFireSound.play();
      return 1;
    }
    else if (this.E3Bullet.allowFire === false){
      this.E3Bullet.allowFire = true;
      this.enemyFireSound.play();
      return 2;
    }
    else if (this.E4Bullet.allowFire === false){
      this.E4Bullet.allowFire = true;
      this.enemyFireSound.play();
      return 3;
    }
    else if (this.E5Bullet.allowFire === false){
      this.E5Bullet.allowFire = true;
      this.enemyFireSound.play();
      return 4;
    }
    else{
      return -1;
    }
  }
  // Firing enemy bullets
  enemyFire(bullet){
    if (bullet.bulletY <626){
      if (this.hardModeActivated === true){
        bullet.bulletY += 20;
      }
      else{
        bullet.bulletY += 9
      }
    }
    else{
      bullet.bulletX = 1000;
      bullet.allowFire = false;
    }
  }
}

// This class manages the barriers just above the user's position
class Barrier {
  constructor(barrierX) {
    this.health = 100;
    this.shieldVisual;
    this.barrierX = barrierX;
    this.barrierY = 528;
    this.barrierWidth = 95;
    this.barrierHeight = 50;
  }
  // Check if a bullet collides with the barrier
  checkBarrierCollision(canvas, bullet){
    if (this.barrierX < bullet.bulletX + bullet.bulletWidth &&
      this.barrierX + this.barrierWidth > bullet.bulletX &&
      this.barrierY < bullet.bulletY + bullet.bulletHeight &&
      this.barrierY + this.barrierHeight > bullet.bulletY) {
      canvas.resetBullet(bullet);
      this.health -= 5;
      this.barrierHealthCheck(canvas);
    }
  }
  // Check health state of barrier
  barrierHealthCheck(canvas){
    if (this.health <=75 && this.health >50){
      this.shieldVisual = canvas.dentedShield;
    }
    else if (this.health <=50 && this.health >25){
      this.shieldVisual = canvas.halfShield;
    }
    else if (this.health <=25 && this.health >0){
      this.shieldVisual = canvas.weakShield;
    }
    else if (this.health <=0){
      this.barrierX = -1000;
    }
  }
}
// This class formats the canvas depending on the situation and user input
class Canvas {
  constructor() {
    // This event listener is used to check if the submit name button is clicked for the leaderboard

    this.nameSubmitted = false;
    document.getElementById('submitName').addEventListener('click', ()=> this.submitNameClicked())
    this.algorithms = new Algorithms();
    
    // Canvas properties
    this.canvas = document.getElementById('gameWindow');
    this.context = this.canvas.getContext('2d');

    this.loadingImages();
    // These properties are used to correctly play audio whenever it is needed
    this.musicPlaying = false;
    this.confirmSound = new Audio('Audio/confirmSound.mp3');

    // Plays the main theme music
    this.playMainTheme();

    this.activateActions();
    this.currentBackground = 'Starting Screen';

    // Defaulting the main music to play
    this.mainMusicPlaying = true;
    this.gameOverSound = new Audio('Audio/gameOverAudio.mp3');

    this.mainMusic = new Audio('Audio/mainTheme.mp3');

    // Hover Image Objects
    this.easyHover = new HoverImage('Images/Menu/1P_Hover.png');
    this.hardHover = new HoverImage('Images/Menu/hard_Hover.png');
    this.audioButtonHover = new HoverImage('Images/Menu/Audio_Hover.png');
    this.mutedAudioHover = new HoverImage('Images/Menu/Muted_Hover.png');
    this.backHover = new HoverImage('Images/ChooseCharacter/Back_Hover.png');
    this.restartHover = new HoverImage('Images/SPlayer/Game_Over/Restart_Hover.png');
    this.gameOverMenuHover = new HoverImage('Images/SPlayer/Game_Over/Menu_Hover.png');
    this.char1Hover = new HoverImage('Images/ChooseCharacter/Character_Hovers/P1_Hover.png');
    this.char2Hover = new HoverImage('Images/ChooseCharacter/Character_Hovers/P2_Hover.png');
    this.char3Hover = new HoverImage('Images/ChooseCharacter/Character_Hovers/P3_Hover.png');
    this.char4Hover = new HoverImage('Images/ChooseCharacter/Character_Hovers/P4_Hover.png'); 

    // The input field and submit button elements
    this.submitScoreButton = document.getElementById('submitName')
    this.submitScoreName = document.getElementById('userName');
  }
  // This method is used to move hover images off screen
  hideObject(object) {
    object.x = -1000;
    object.y = -1000;
    object.boolean = false;
  }
  // This method is used to move hover images to a specific spot
  moveHoverImage(object, X_Value, Y_Value) {
    object.x = X_Value;
    object.y = Y_Value;
    object.boolean = true;
  }
  // Used most frequently in collisions to reset bullet states and position
  resetBullet(bullet){
    bullet.bulletX = -2000;
    bullet.bulletY = -2000;
    bullet.allowFire = true;
  }
// Use this method to refactor conditionals in the mousemove event listener
  controlHovers(minX, maxX, minY, maxY, currentBackground, object, finalX, finalY)
  {
    if (this.mouseX >= minX && this.mouseX <= maxX && this.mouseY >= minY && this.mouseY <= maxY && this.currentBackground === currentBackground) {
      this.moveHoverImage(object, finalX, finalY);
    }
    else {
      this.hideObject(object);
    }
  }
  activateActions() {
    // Adding an event listener for moving the mouse on the canvas
    this.canvas.addEventListener('mousemove', e => {
      // Storing the x and y coordinates of the mouse on the canvas
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;

      // ---------- START MENU HOVERS
      // If the user hovers over any of the buttons, the UI will update appropriately
      this.controlHovers(160, 440, 250, 372, 'Starting Screen', this.easyHover, 162, 250);
      this.controlHovers(160, 440, 418, 538, 'Starting Screen', this.hardHover, 162, 414);
      this.controlHovers(195, 417, 580, 649, 'Choose Character', this.backHover, 194, 580);
      this.controlHovers(71, 257, 567, 651, 'Game Over', this.restartHover, 72, 567);
      this.controlHovers(325, 509, 567, 651, 'Game Over', this.gameOverMenuHover, 324, 567);

      // ---------- CHOOSE CHARACTER HOVERS
      this.controlHovers(115, 249, 243, 377, 'Choose Character', this.char1Hover, 115, 244);
      this.controlHovers(359, 494, 247, 381, 'Choose Character', this.char2Hover, 358, 244);
      this.controlHovers(115, 249, 409, 544, 'Choose Character', this.char3Hover, 115, 405);
      this.controlHovers(359, 494, 409, 544, 'Choose Character', this.char4Hover, 358, 405);
      
      // This hover action is unique to the rest of the buttons. This is why the preset method is not being used
      if (this.mouseX >= 255 && this.mouseX <= 331 && this.mouseY >= 589 && this.mouseY <= 663 && this.currentBackground === 'Starting Screen') {
        this.audioButtonHover.boolean = true;

        if (this.mainMusicPlaying === true) {
          this.moveHoverImage(this.audioButtonHover, 259, 589);
        }
        else {
          this.mutedAudioHover.x = 259;
          this.mutedAudioHover.y = 589;
        }
      }
      else {
        this.audioButtonHover.boolean = false;
        
        if (this.mainMusicPlaying === true) {
          this.hideObject(this.audioButtonHover);
        }
        else {
          this.hideObject(this.mutedAudioHover);
          this.mutedAudioX = 259;
          this.mutedAudioY = 589;

          if (this.currentBackground !== 'Starting Screen') {
            this.mutedAudioX = -1000;
          }
        }
      }
    });
    // Adding an event listener for clicking the mouse
    this.canvas.addEventListener('mousedown', e => this.clickAction());
  }
  // Plays the main music that will be played as soon as the user interacts with the canvas
playMainTheme() {
    // This conditional is used to only play the main music ONCE as soon as the user interacts with the canvas
    if (this.musicPlaying === false) {
      // This nested conditional loops the main music so it plays continuously
      if (typeof this.mainMusic.loop == 'boolean') {
        this.mainMusic.loop = true;
        this.mainMusic.play();
        this.musicPlaying = true;
      }
      else {
        this.mainMusic.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
      }
    }
  }

  // ---------- ON CLICK ACTIONS
  // This method should be called whenever any button is clicked on the screen
  clickAction() {
    // If you click the 'Easy' Button, you will be taken to the ship selection page
    if (this.easyHover.boolean === true) {
      this.hardMode = false;
      this.mutedAudioX = -1000;
      this.easyHover.x = -1000;
      this.background.src = 'Images/ChooseCharacter/Choose_Character.png';
      this.currentBackground = 'Choose Character';
      this.confirmSound.play();
      this.positionMenuSprites = true;
    }
    // If you click the back button on character select, you will be taken back to the main music
    if (this.backHover.boolean === true) {
      this.confirmSound.play();
      this.backHover.x = -1000;
      this.background.src = 'Images/Menu/Opening_Screen.png';
      this.currentBackground = 'Starting Screen';
      if (this.mainMusicPlaying === false){
        this.mutedAudioX = 259;
        this.mutedAudioY = 589;
      }
      this.positionMenuSprites = false;
    }
    // If the audio button is clicked, the appropriate image will be shown
    if (this.audioButtonHover.boolean === true) {
      if (this.mainMusicPlaying === true) {
        this.confirmSound.play();
        this.mainMusic.pause();
        this.audioButtonHover.x = -1000;

        this.mutedAudioHover.x = 259;
        this.mutedAudioHover.y = 589;
        this.mainMusicPlaying = false;
      }
      else {
        this.confirmSound.play();
        this.mainMusic.play();

        this.mutedAudioHover.x = -1000;
        this.mutedAudioX = -1000;

        this.audioButtonHover.x = 259;
        this.audioButtonHover.y = 589;
        this.mainMusicPlaying = true;
      }
    }
    // Brings the user back to the choosing character screen
    if (this.restartHover.boolean === true){
      this.restartHover.x = -1000;
      this.gameEnd();
      this.gameOverSound.pause();
      this.background.src = 'Images/ChooseCharacter/Choose_Character.png';
      this.currentBackground = 'Choose Character';
      this.nameSubmitted = false;

      // If the main music was playing in game, it will start to play again. If not, the main music will not play
      if (this.mainMusicPlaying === true){
        this.mainMusic.play();
      }
      this.confirmSound.play();

      // Disabling the input field and submit button
      this.submitScoreName.disabled = true;
      this.submitScoreButton.disabled = true;

      this.positionMenuSprites = true;
    }
    // Brings the user back to the menu screen
    if (this.gameOverMenuHover.boolean === true){
      this.gameOverSound.pause();
      this.gameOverMenuHover.x = -1000;
      this.hardMode = false;
      this.gameEnd();
      this.background.src = 'Images/Menu/Opening_Screen.png';
      this.currentBackground = 'Starting Screen';
      this.confirmSound.play();
      // Limit access to button and text
      this.submitScoreButton.disabled = true;
      this.submitScoreName.disabled = true;
      
      if (this.mainMusicPlaying === true){
        this.mainMusic.play();
      }
      else{
        this.mutedAudioX = 259;
        this.mutedAudioY = 589;
      }
    }
    // Bringing the user to the character selection page if the 'Hard' button is clicked
    if (this.hardHover.boolean === true){
      this.hardHover.x = -1000;
      this.hardMode = true;
      this.confirmSound.play();
      
      this.mutedAudioX = -1000;
      this.background.src = 'Images/ChooseCharacter/Choose_Character.png';
      this.currentBackground = 'Choose Character';
      this.confirmSound.play();

      this.positionMenuSprites = true;
    }
    this.choosingCharacter();
  }
  // This method saves the users name and score into the leaderboard when clicking the submit button under the canvas
  submitNameClicked()
    {
      if (this.hardMode === true){
        this.algorithms.updateUserObjects(document.getElementById('userName').value + ' (HM ඞ)', this.scoreCount);
      }
      else{
        this.algorithms.updateUserObjects(document.getElementById('userName').value, this.scoreCount);
      }
      this.submitScoreName.value = '';
      this.submitScoreButton.disabled = true;
      this.submitScoreName.disabled = true;
    }
  // When the user clicks one of the four squares in choose characer, make an instance of that class
  choosingCharacter() {

    if (this.char1Hover.boolean === true) {
      this.playerShip = ChooseShip.dataFactory(0);
      this.char1Check = true;
    }
    if (this.char2Hover.boolean === true) {
      this.playerShip = ChooseShip.dataFactory(1);
      this.char2Check = true;
    }
    if (this.char3Hover.boolean === true) {
      this.playerShip = ChooseShip.dataFactory(2);
      this.char3Check = true;
    }
    if (this.char4Hover.boolean === true) {
      this.playerShip = ChooseShip.dataFactory(3);
      this.char4Check = true;
    }
    // Move the hover and start the singleplayer mode
    if (this.char1Hover.boolean === true || this.char2Hover.boolean === true || this.char3Hover.boolean === true || this.char4Hover.boolean === true) {
      this.confirmSound.play();
      this.char1Hover.x = -1000;
      this.char2Hover.x = -1000;
      this.char3Hover.x = -1000;
      this.char4Hover.x = -1000;
      this.setSPlayerMode();
      this.SPMode = true;
    }
  }
  // When the user dies, enable them to add their score to the leaderboard
  setScoreMode() {
    this.SPMode = false;
    let nameInput = document.getElementById('userName');
    nameInput.setAttribute('disabled', 'false');
    let nameButton = document.getElementById('submitName');
    nameButton.setAttribute('disabled', 'false');
  }
  // When the user clicks any of the four characters, set the mode to singleplayer
  setSPlayerMode() {
    this.background.src = 'Images/SPlayer/SPlayer_Map.png';
    this.currentBackground = 'Singleplayer Screen';
    this.scoreCount = 0;
    this.roundCount = 1;
    this.barrier1 = new Barrier(79);
    this.barrier2 = new Barrier(256);
    this.barrier3 = new Barrier(434);
    this.enemyGrid = new Grid ();
    this.barrier1.shieldVisual = this.fullShield;
    this.barrier2.shieldVisual = this.fullShield;
    this.barrier3.shieldVisual = this.fullShield;
  }
  // When the user dies, show the death screen
  deathState(){
    this.mainMusic.pause();
    this.gameOverSound.load();
    this.gameOverSound.play();
    this.SPMode = false;
    this.currentBackground = 'Game Over';
    this.background.src = 'Images/SPlayer/Game_Over/Game_Over_Screen.png';
    this.showScore = true;

    // Enabling the input field and button for leaderboard submission
    document.getElementById('userName').disabled = false;
    document.getElementById('submitName').disabled = false;
  }
  // If the user restarts/returns to menu after death, reset character and score
  gameEnd(){
    this.showScore = false;
    // Stops drawing previous ship
    this.char1Check = false;
    this.char2Check = false;
    this.char3Check = false;
    this.char4Check = false;
  }
  // Refactoring of check collisions between bullet and barrier
  bulletToBarrier(bulletType){
    this.barrier1.checkBarrierCollision(this, bulletType);
    this.barrier2.checkBarrierCollision(this, bulletType);
    this.barrier3.checkBarrierCollision(this, bulletType);
  }
  // ---------- SOURCING IMAGES
  loadingImages() {
    // Background Image
    this.background = new Image();
    this.background.src = 'Images/Menu/Opening_Screen.png';
    // Muted hover image
    this.mutedAudioImage = new Image();
    this.mutedAudioImage.src = 'Images/Menu/Muted_Normal.png';
    // Various player sprites
    this.player1 = new Image();
    this.player2 = new Image();
    this.player3 = new Image();
    this.player4 = new Image();
    this.player1.src = 'Images/PlayerSprites/P1.png';
    this.player2.src = 'Images/PlayerSprites/P2.png';
    this.player3.src = 'Images/PlayerSprites/P3.png';
    this.player4.src = 'Images/PlayerSprites/P4.png';

    //Bullet type sprites
    this.SPBullet = new Image();
    this.SPBullet.src = 'Images/SPlayer/Bullet.png'
    this.enemyBullet = new Image();
    this.enemyBullet.src = 'Images/Enemy/alienBullet.png'
    // Lives sprites (singleplayer)
    this.lives = new Image();
    this.lives.src = 'Images/SPlayer/Lives.png'

    // Shields sprites (singeplayer)
    this.fullShield = new Image();
    this.dentedShield = new Image();
    this.halfShield = new Image();
    this.weakShield = new Image();
    this.fullShield.src = 'Images/SPlayer/Shields/SP_Shield_Full.png';
    this.dentedShield.src = 'Images/SPlayer/Shields/SP_Shield_Worn.png';
    this.halfShield.src = 'Images/SPlayer/Shields/SP_Shield_Half.png';
    this.weakShield.src = 'Images/SPlayer/Shields/SP_Shield_Dmgd.png';

    // Alien sprites (singleplayer)
    this.alien1 = new Image();
    this.alien2 = new Image();
    this.alien3 = new Image();
    this.alien4 = new Image();
    this.bonusAlien = new Image();
    this.alien1.src = 'Images/Enemy/Enemy1.png';
    this.alien2.src = 'Images/Enemy/Enemy2.png';
    this.alien3.src = 'Images/Enemy/Enemy3.png';
    this.alien4.src = 'Images/Enemy/Enemy4.png';
    this.bonusAlien.src = 'Images/Enemy/RedMike.png';
    this.frameCount = 0;
    setInterval(() => this.updateImages(), 50);
  }
  // WHENEVER ANY IMAGE NEEDS TO BE BLITTED ON THE CANVAS, DRAW THE IMAGE IN THIS METHOD
  // ---------- UPDATING IMAGES
  // ---------- UPDATING IMAGES
  
  updateImages() {
    this.context.clearRect(0, 0, 700, 700);
    // Draw appropriate background
    this.context.drawImage(this.background, 0, 0);

    // Drawing Menu Buttons
    this.context.drawImage(this.easyHover.image, this.easyHover.x, this.easyHover.y);
    this.context.drawImage(this.hardHover.image, this.hardHover.x, this.hardHover.y);
    this.context.drawImage(this.backHover.image, this.backHover.x, this.backHover.y);
    this.context.drawImage(this.audioButtonHover.image, this.audioButtonHover.x, this.audioButtonHover.y, 77, 78);
    this.context.drawImage(this.mutedAudioImage, this.mutedAudioX, this.mutedAudioY, 77, 78);
    this.context.drawImage(this.mutedAudioHover.image, this.mutedAudioHover.x, this.mutedAudioHover.y, 77, 78);

    // Drawing Hover Sprites
    this.context.drawImage(this.char1Hover.image, this.char1Hover.x, this.char1Hover.y, 140, 140);
    this.context.drawImage(this.char2Hover.image, this.char2Hover.x, this.char2Hover.y, 140, 140);
    this.context.drawImage(this.char3Hover.image, this.char3Hover.x, this.char3Hover.y, 140, 140);
    this.context.drawImage(this.char4Hover.image, this.char4Hover.x, this.char4Hover.y, 140, 140);
      
    // Draw various sprites if the mode is singleplayer
    if (this.SPMode === true) {
      
      this.frameCount++;
    if (this.frameCount % 10 === 0){
      this.enemyGrid.moveEnemies(this);
      this.frameCount = 0;
    }
      this.enemyGrid.enemiesFireChance();
      this.playerShip.moveCharacter();
      for (let i=0;i<5;i++){
        this.enemyGrid.enemyFire(this.enemyGrid.bulletArr[i]);
      }
      // Drawing score
      this.context.font = "30px Monospace";
      this.context.fillStyle = "white";
      this.context.fillText(this.scoreCount, 151, 54);
      this.context.drawImage(this.bonusAlien, this.enemyGrid.mike.enemyX, this.enemyGrid.mike.enemyY, this.enemyGrid.mike.enemyWidth, this.enemyGrid.mike.enemyHeight);
      this.context.font = "150px VT323";
      this.context.fillStyle = "#4a4a4a";
      this.context.fillText(`Round ${this.roundCount}`, 90, 350);
      // Drawing shields
      this.context.drawImage(this.barrier1.shieldVisual, this.barrier1.barrierX, 528)
      this.context.drawImage(this.barrier2.shieldVisual, this.barrier2.barrierX, 528)
      this.context.drawImage(this.barrier3.shieldVisual, this.barrier3.barrierX, 528)
      // Drawing lives
      this.context.font = "30px Monospace";
      this.context.fillStyle = "white";
      this.context.fillText(this.playerShip.playerLives, 535, 55);

      // Drawing aliens
      let alien1Row = [
        this.context.drawImage(this.alien1, this.enemyGrid.enemiesGreen[0].enemyX, this.enemyGrid.enemiesGreen[0].enemyY),
        this.context.drawImage(this.alien1, this.enemyGrid.enemiesGreen[1].enemyX, this.enemyGrid.enemiesGreen[1].enemyY),
        this.context.drawImage(this.alien1, this.enemyGrid.enemiesGreen[2].enemyX, this.enemyGrid.enemiesGreen[2].enemyY),
        this.context.drawImage(this.alien1, this.enemyGrid.enemiesGreen[3].enemyX, this.enemyGrid.enemiesGreen[3].enemyY),
        this.context.drawImage(this.alien1, this.enemyGrid.enemiesGreen[4].enemyX, this.enemyGrid.enemiesGreen[4].enemyY)];

      let alien2Row = [
        this.context.drawImage(this.alien2, this.enemyGrid.enemiesYellow[0].enemyX, this.enemyGrid.enemiesYellow[0].enemyY),
        this.context.drawImage(this.alien2, this.enemyGrid.enemiesYellow[1].enemyX, this.enemyGrid.enemiesYellow[1].enemyY),
        this.context.drawImage(this.alien2, this.enemyGrid.enemiesYellow[2].enemyX, this.enemyGrid.enemiesYellow[2].enemyY),
        this.context.drawImage(this.alien2, this.enemyGrid.enemiesYellow[3].enemyX, this.enemyGrid.enemiesYellow[3].enemyY),
        this.context.drawImage(this.alien2, this.enemyGrid.enemiesYellow[4].enemyX, this.enemyGrid.enemiesYellow[4].enemyY)]

      let alien3Row = [
        this.context.drawImage(this.alien3, this.enemyGrid.enemiesRed[0].enemyX, this.enemyGrid.enemiesRed[0].enemyY),
        this.context.drawImage(this.alien3, this.enemyGrid.enemiesRed[1].enemyX, this.enemyGrid.enemiesRed[1].enemyY),
        this.context.drawImage(this.alien3, this.enemyGrid.enemiesRed[2].enemyX, this.enemyGrid.enemiesRed[2].enemyY),
        this.context.drawImage(this.alien3, this.enemyGrid.enemiesRed[3].enemyX, this.enemyGrid.enemiesRed[3].enemyY),
        this.context.drawImage(this.alien3, this.enemyGrid.enemiesRed[4].enemyX, this.enemyGrid.enemiesRed[4].enemyY)];

      let alien4Row = [
        this.context.drawImage(this.alien4, this.enemyGrid.enemiesBlue[0].enemyX, this.enemyGrid.enemiesBlue[0].enemyY),
        this.context.drawImage(this.alien4, this.enemyGrid.enemiesBlue[1].enemyX, this.enemyGrid.enemiesBlue[1].enemyY),
        this.context.drawImage(this.alien4, this.enemyGrid.enemiesBlue[2].enemyX, this.enemyGrid.enemiesBlue[2].enemyY),
        this.context.drawImage(this.alien4, this.enemyGrid.enemiesBlue[3].enemyX, this.enemyGrid.enemiesBlue[3].enemyY),
        this.context.drawImage(this.alien4, this.enemyGrid.enemiesBlue[4].enemyX, this.enemyGrid.enemiesBlue[4].enemyY)]
      // Drawing SPbullet
      this.context.drawImage(this.SPBullet, this.playerShip.playerBullet.bulletX, this.playerShip.playerBullet.bulletY, this.playerShip.playerBullet.bulletWidth, this.playerShip.playerBullet.bulletHeight);

      // Drawing Enemy Bullets
      this.context.drawImage(this.enemyBullet, this.enemyGrid.E1Bullet.bulletX, this.enemyGrid.E1Bullet.bulletY, this.enemyGrid.E1Bullet.bulletWidth, this.enemyGrid.E1Bullet.bulletHeight);
      this.context.drawImage(this.enemyBullet, this.enemyGrid.E2Bullet.bulletX, this.enemyGrid.E2Bullet.bulletY, this.enemyGrid.E2Bullet.bulletWidth, this.enemyGrid.E2Bullet.bulletHeight);
      this.context.drawImage(this.enemyBullet, this.enemyGrid.E3Bullet.bulletX, this.enemyGrid.E3Bullet.bulletY, this.enemyGrid.E3Bullet.bulletWidth, this.enemyGrid.E3Bullet.bulletHeight);
      this.context.drawImage(this.enemyBullet, this.enemyGrid.E4Bullet.bulletX, this.enemyGrid.E4Bullet.bulletY, this.enemyGrid.E4Bullet.bulletWidth, this.enemyGrid.E5Bullet.bulletHeight);
      this.context.drawImage(this.enemyBullet, this.enemyGrid.E5Bullet.bulletX, this.enemyGrid.E5Bullet.bulletY, this.enemyGrid.E5Bullet.bulletWidth, this.enemyGrid.E5Bullet.bulletHeight);
      // Drawing player
      if (this.char1Check === true) {
        this.context.drawImage(this.player1, this.playerShip.playerX, this.playerShip.playerY);
      }
      if (this.char2Check === true) {
        this.context.drawImage(this.player2, this.playerShip.playerX, this.playerShip.playerY);
      }
      if (this.char3Check === true) {
        this.context.drawImage(this.player3, this.playerShip.playerX, this.playerShip.playerY);
      }
      if (this.char4Check === true) {
        this.context.drawImage(this.player4, this.playerShip.playerX, this.playerShip.playerY);
      }
     
    // Doing collision checks
    this.enemyGrid.checkEnemyCollision(this.playerShip, this);

    this.bulletToBarrier(this.playerShip.playerBullet);
    this.bulletToBarrier(this.enemyGrid.E1Bullet);
    this.bulletToBarrier(this.enemyGrid.E2Bullet);
    this.bulletToBarrier(this.enemyGrid.E3Bullet);
    this.bulletToBarrier(this.enemyGrid.E4Bullet);
    this.bulletToBarrier(this.enemyGrid.E5Bullet);
    this.playerShip.checkPlayerCollision(this, this.enemyGrid.E1Bullet)
    this.playerShip.checkPlayerCollision(this, this.enemyGrid.E2Bullet)
    this.playerShip.checkPlayerCollision(this, this.enemyGrid.E3Bullet)
    this.playerShip.checkPlayerCollision(this, this.enemyGrid.E4Bullet)
    this.playerShip.checkPlayerCollision(this, this.enemyGrid.E5Bullet)
    
    }
    if (this.showScore === true){
      this.scoreCountX = 231;
      this.scoreCountY = 375;
      
      this.context.font = "80px Monospace";
      this.context.fillStyle = "white";
      this.context.fillText(this.scoreCount, this.scoreCountX, this.scoreCountY);
    }
    else{
      this.scoreCountX = -1000;
      this.scoreCountY = -1000;
    }
    this.context.drawImage(this.restartHover.image, this.restartHover.x, this.restartHover.y);
    this.context.drawImage(this.gameOverMenuHover.image, this.gameOverMenuHover.x, this.gameOverMenuHover.y);
  }
}

new Canvas();
