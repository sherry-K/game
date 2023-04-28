/** memo */
//https://cdnjs.com/libraries/p5.js p5 is not defined defer?


//----エンティティ関連の関数 ----------------------------------------------

// 全エンティティ共通

function updatePosition(entity){
  entity.x += entity.vx;
  entity.y += entity.vy;
}

// プレイヤーエンティティ用

function createPlayer(){
  return{
    x: 200,
    y: 300,
    vx: 0,
    vy: 0
  };
}

function applyGravity(entity){
  entity.vy += 0.15;
}

function applyJump(entity){
  entity.vy = -5;
}

function drawPlayer(entity){
  noStroke();
  if(gameState === "play"){
    image(paperAirplane, entity.x, entity.y);
  }
}

function playerIsAlive(entity){
  // プレイヤーの位置が生存圏内なら true を返す。
  // 600 は画面の下端
  return entity.y < 600;
}

// ブロックエンティティ用

function createBlock(y){
  return{
    x: 900,
    y,
    vx: -2,
    vy: 0
  };
}

function drawBlock(entity){
  image(block, entity.x, entity.y);
}

function movingBlocks(){
  // ブロックの追加と削除
  if (frameCount % 120 === 1) addBlockPair(blocks); // 一定間隔で追加
  blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す
  // ブロックの位置を更新
  for (let entity of blocks) updatePosition(entity);
}

function blockIsAlive(entity){
  // エンティティの位置が生存圏内なら true を返す。
  // -100は適当な位置（エンティティが見えなくなる位置であればよい）
  return -100 < entity.x;
}

// 雲エンティティ用

function createCloud(y){
  return{
    x: 900,
    y,
    vx: -1,
    vy: 0
  };
}

function drawCloud(entity){
  image(cloud, entity.x, entity.y);
}

function movingClouds(){
  // 雲の追加と削除
  if (frameCount % 240 === 1) addCloud(clouds); // 一定間隔で追加
  clouds = clouds.filter(cloudIsAlive); // 生きている雲だけ残す
  // 雲の位置を更新
  for (let entity of clouds) updatePosition(entity);
}

function cloudIsAlive(entity){
  return -146 < entity.x;
}

// 気球エンティティ用

function createBalloon(y){
  return{
    x: 1000,
    y,
    vx: -0.75,
    vy: 0
  };
}

function drawBalloon(entity){
  image(balloon, entity.x, entity.y);
}

function movingBalloons(){
  // 気球の追加と削除
  if (frameCount % 1800 === 1) addBalloon(balloons); // 一定間隔で追加
  balloons = balloons.filter(balloonIsAlive); // 生きている気球だけ残す
  // 気球の位置を更新
  for (let entity of balloons) updatePosition(entity);
}

function balloonIsAlive(entity){
  return -40 < entity.x;
}

// 複数のエンティティを処理する関数

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
 * 
 * @param entityA 衝突しているかどうかを確認したいエンティティ
 * @param entityB 同上
 * @param collisionXDistance 衝突しないギリギリのx距離
 * @param collisionYDistance 衝突しないギリギリのy距離
 * @returns 衝突していたら 'true' そうでなければ 'false' を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
){
  // xとy、いずれの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}

//----ゲーム全体に関わる部分 ----------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティの配列 */
let blocks;

/** ゲームの状態。"play"、"gameover"、"start" を入れるものとする */
let gameState;

/** 背景 */
let balloon;
let balloons;
let cloud;
let clouds;

/** 音 */
let TopBGM;
let playBGM;
let clickEffect;
let gameoverEffect;

/** 記録 */
let record;

/** 他 */
let num;
let i;

/** ボタン作成 */
function createButtons(){
  if(gameState === "gameover"){
    noStroke();
    fill(255);
    rect(400, 350, 200, 50); // トライアゲインボタン生成
    rect(400, 425, 200, 50); // スタート画面に戻るボタン生成
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER); // 横に中央揃え & 縦にも中央揃え
    text("TRY AGAIN", 400, 350); 
    text("BACK TO TOP", 400, 425);
    if (mouseIsPressed){
      if(mouseX >= 300 && mouseX <= 500){
        if(mouseY >= 325 && mouseY <= 375){
          pushStartButton();
        }
        if(mouseY >= 400 && mouseY <= 450){
          pushStartScreenButton();
        }
      }
    }
  }
  if(gameState === "start"){
    noStroke();
    fill(255);
    rect(400, 375, 200, 50); // スタートボタン生成
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER); // 横に中央揃え & 縦にも中央揃え
    text("START", 400, 375); // 画面中央にテキスト表示
    if (mouseIsPressed){
      if(mouseX >= 300 && mouseX <= 500){
        if(mouseY >= 350 && mouseY <= 400){
          pushStartButton();
        }
      }
    }
  }
}

/** スタートボタンが押されたら */
function pushStartButton(){
  TopBGM.stop();
  playBGM.stop();
  clickEffect.play();
  playBGM.volume(1.0);
  playBGM.loop();
  // プレイヤーを作成
  player = createPlayer();
  resetGame();
  drawGame();
}

/** スタート画面ボタンが押されたら */
function pushStartScreenButton(){
  playBGM.stop();
  clickEffect.play();
  TopBGM.loop();
  resetGame();
  gameState = "start";
  drawStartScreen()
}

/**　ブロックを上下ペアで作成し、 'blocks' に追加する */
function addBlockPair(){
  let y = random(-100, 100);
  blocks.push(createBlock(y)); // 上のブロック
  blocks.push(createBlock(y + 600)); // 下のブロック
}

/**　雲を作成し、 'clouds' に追加する */
function addCloud(){
  let y = random(50, 400);
  clouds.push(createCloud(y));
}

/**　気球を作成し、 'balloons' に追加する */
function addBalloon(){
  let y = random(100, 300);
  balloons.push(createBalloon(y));
}

/** ゲームオーバー画面を表示する */
function drawGameoverScreen(){
  playBGM.volume(0);
  if (num === 0){
    gameoverEffect.play()
    num = 1;
  }
  background(0, 192); // 透明度 192 の黒
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER); // 横に中央揃え & 縦にも中央揃え
  text("GAME OVER", width / 2, 250); // 画面中央にテキスト表示
  createButtons();
}

/** スタート画面を表示する */
function drawStartScreen(){
  gameState = "start";
  // 気球の追加と削除、更新
  movingBalloons();
  // 雲の追加と削除、更新
  movingClouds();
  // ブロックの追加と削除、更新
  movingBlocks();
  fill(255);
  strokeWeight(5);
  stroke(35, 125, 255)
  textSize(64);
  textAlign(CENTER, CENTER); // 横に中央揃え & 縦にも中央揃え
  text("Zig-Zag", width / 2, 175); // 画面中央にテキスト表示
  text("PAPER AIRPLANE", width / 2, 275); 
  fill(255);
  rect(400, 375, 200, 50);
  createButtons();
}

//記録の表示
function displayRecord(){
  if (gameState === "play"){
    //記録の計算
    record = Math.floor(i / 15);
    
    noStroke();
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(record, 40, 40);
    i += 1
  }
  if(gameState === "gameover"){
    //記録の初期化
    i = 0;

    noStroke();
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Your record is " + record + " m!", width / 2, 150);
  }
}

/** ゲームの初期化・リセット */
function resetGame(){
  // 状態をリセット
  gameState = "play";
  // 気球を配列準備
  balloons = [];
  // 雲を配列準備
  clouds = [];
  // ブロックを配列準備
  blocks = [];
  //数リセット
  num = 0;
}

/** ゲームの更新 */
function updateGame(){
  if(gameState === "start") return;

  // 気球の追加と削除、更新
  movingBalloons();
  // 雲の追加と削除、更新
  movingClouds();
  // ブロックの追加と削除、更新
  movingBlocks();

  // プレイヤーの位置を更新
  updatePosition(player);

  // プレイヤーに重力を適用
  applyGravity(player);

  displayRecord();

  // プレイヤーが死んでいたらゲームオーバー
  if (!playerIsAlive(player)) gameState = "gameover";
  // 衝突判定
  for (let block of blocks){
    if (entitiesAreColliding(player, block, 20 + 40, 15 + 200)){
      gameState = "gameover";
      break;
    }
  }
}

/** ゲームの描画 */
function drawGame(){

  // 全エンティティを描画
  background("#2378ff");
  for(let balloon of balloons) drawBalloon(balloon);
  for(let cloud of clouds) drawCloud(cloud);
  for(let block of blocks) drawBlock(block);
  drawPlayer(player);

  // ゲームオーバーならそれ用の画面を表示
  if (gameState === "gameover") drawGameoverScreen();

  if(gameState === "start") drawStartScreen();
}

function onMousePress(){
  if(gameState == "play"){
    // プレイ中の状態ならプレイヤーをジャンプさせる
    applyJump(player);
  }
}

/** ゲームサウンド */
function BGMstop(){
  if(gameState == "start"){
    playBGM.stop();
  } else if(gameState == "play"){
    TopBGM.stop();
  } else {
    TopBGM.stop();
    playBGM.stop();
  }
}

//----setup/draw 他 ------------------------------------------------------

function preload(){
  TopBGM = createAudio('SE/おばけのまあち_-_8bit.mp3');
  playBGM = createAudio('SE/ネジが1本取れちゃった_-_8bit.mp3');
  clickEffect = createAudio('SE/ポコッ.mp3');
  gameoverEffect = createAudio('SE/チープな正解音.mp3');

  balloon = loadImage('pic/balloon.png');
  block = loadImage('pic/block.png');
  cloud = loadImage('pic/clouds.png');
  paperAirplane = loadImage('pic/paperplanenomal.png');
}

function setup() {
  createCanvas(800, 600); // 800 x 600 ピクセル
  rectMode(CENTER); //四角形の基準点を中心に変更
  imageMode(CENTER); //エンティティの基準点を中心に変更

  TopBGM.loop();
  resetGame();
  drawStartScreen(); //スタート画面表示
  i = 0;
}

function draw() {
  updateGame();
  drawGame();
  displayRecord();
}

function mousePressed(){
  onMousePress();
}