$(document).ready(() => {
  // code here.
  document.body.style.backgroundImage = "url(img/background.jpg)";
  document.body.style.backgroundRepeat = "no-repeat";
  //document.body.style.backgroundColor = "black";
  const WALL_THICKNESS = 20;
  const PADDLE_WIDTH = 300;
  const PADDLE_SPEED = 16;
  const PUCK_SPEED = 15;
  const PADDLE_HITS_FOR_NEW_LEVEL = 5;
  const SCORE_BOARD_HEIGHT = 50;
  const ARROW_KEY_LEFT = 37;
  const ARROW_KEY_RIGHT = 39;
  const SPACE_KEY = 32;

  var canvas, stage, paddle, puck, board, scoreTxt, livesTxt, messageTxt, messageInterval;
  var leftWall, rightWall, ceiling, floor;
  var leftKeyDown = false;
  var rightKeyDown = false;

  var bricks = [];

  var paddleHits = 0;
  var combo = 0;
  var lives = 5;
  var score = 0;
  var level = 0;

  var gameRunning = true;

  var levels = [{
      color: '#003E3E',
      points: 1
    },
    {
      color: '#005757',
      points: 2
    },
    {
      color: '#007979',
      points: 3
    },
    {
      color: '#009393',
      points: 4
    },
    {
      color: '#00AEAE',
      points: 5
    },
    {
      color: '#00CACA',
      points: 6
    },
    {
      color: '#00E3E3',
      points: 7
    },
    {
      color: '#00FFFF',
      points: 8
    },
    {
      color: '#4DFFFF',
      points: 9
    },
    {
      color: '#80FFFF',
      points: 10
    },
    {
      color: '#A6FFFF',
      points: 11
    },
    {
      color: '#BBFFFF',
      points: 12
    }
  ];

  let icon;

  let repo = new createjs.LoadQueue();





  function init() {
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);

    repo.loadManifest([{
      id: 'ic1',
      src: "icon/1.png"
    }, {
      id: 'ic2',
      src: "icon/2.png"
    }, {
      id: 'ic3',
      src: "icon/3.png"
    }, {
      id: 'ic4',
      src: "icon/4.png"
    }, {
      id: 'ic5',
      src: "icon/5.png"
    }, {
      id: 'ic6',
      src: "icon/6.png"
    }]);

    repo.on('complete', newGame);
    //newGame();
    //startGame();
  }



  function setIconArray() {

    icon = [new createjs.Bitmap(repo.getResult('ic1')),
      new createjs.Bitmap(repo.getResult('ic2')),
      new createjs.Bitmap(repo.getResult('ic3')),
      new createjs.Bitmap(repo.getResult('ic4')),
      new createjs.Bitmap(repo.getResult('ic5')),
      new createjs.Bitmap(repo.getResult('ic6'))
    ];

    for (var i = 0; i < icon.length; i++) {
      icon[i].set({
        scaleX: 0.1,
        scaleY: 0.1
      });
    }

  }

  function newGame() {

    setIconArray()
    buildWalls();
    stage.update();
    buildMessageBoard();
    buildPaddle();
    buildPuck();
    setControls();
    newLevel();
    newLevel();
    startGame();
  }

  function buildWalls() {
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0, 0, WALL_THICKNESS, canvas.height);
    stage.addChild(wall);
    wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0, 0, WALL_THICKNESS, canvas.height);
    wall.x = canvas.width - WALL_THICKNESS;
    stage.addChild(wall);
    wall = new createjs.Shape();
    wall.graphics.beginFill('#333');
    wall.graphics.drawRect(0, 0, canvas, WALL_THICKNESS);
    stage.addChild(wall);
    leftWall = WALL_THICKNESS;
    rightWall = canvas.width - WALL_THICKNESS;
    ceiling = WALL_THICKNESS;
  }

  function buildMessageBoard() {
    board = new createjs.Shape();
    board.graphics.beginFill('#333');
    board.graphics.drawRect(0, 0, canvas.width, SCORE_BOARD_HEIGHT);
    board.y = canvas.height - SCORE_BOARD_HEIGHT;
    stage.addChild(board);
    livesTxt = new createjs.Text('lives: ' + lives, '20px Times', '#fff');
    livesTxt.y = board.y + 10;
    livesTxt.x = WALL_THICKNESS;
    stage.addChild(livesTxt);
    scoreTxt = new createjs.Text('score: ' + score, '20px Times', '#fff');
    scoreTxt.textAlign = "right";
    scoreTxt.y = board.y + 10;
    scoreTxt.x = canvas.width - WALL_THICKNESS;
    stage.addChild(scoreTxt);
    messageTxt = new createjs.Text('press spacebar to pause', '18px Times', '#fff');
    messageTxt.textAlign = 'center';
    messageTxt.y = board.y + 10;
    messageTxt.x = canvas.width / 2;
    stage.addChild(messageTxt);
  }

  function buildPaddle() {
    paddle = new createjs.Shape();
    paddle.width = PADDLE_WIDTH;
    paddle.height = 20;
    paddle.graphics.beginFill('#3e6dc0').drawRect(0, 0, paddle.width, paddle.height);
    paddle.nextX = 0;
    paddle.x = 20;
    paddle.y = canvas.height - paddle.height - SCORE_BOARD_HEIGHT;
    stage.addChild(paddle);
  }

  function buildPuck() {
    puck = new createjs.Shape();
    puck.graphics.beginFill('#D9006C').drawCircle(0, 0, 50);
    puck.width = 50;
    puck.height = 20;
    puck.x = canvas.width - 100;
    puck.y = 160;
    puck.velx = PUCK_SPEED;
    puck.vely = PUCK_SPEED;
    puck.isAlive = true;
    stage.addChildAt(puck, 0);
  }

  function setControls() {
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
  }

  function handleKeyDown(e) {
    e = !e ? window.event : e;
    switch (e.keyCode) {
      case ARROW_KEY_LEFT:
        leftKeyDown = true;
        break;
      case ARROW_KEY_RIGHT:
        rightKeyDown = true;
        break;
    }
  }

  function handleKeyUp(e) {
    e = !e ? window.event : e;
    switch (e.keyCode) {
      case ARROW_KEY_LEFT:
        leftKeyDown = false;
        break;
      case ARROW_KEY_RIGHT:
        rightKeyDown = false;
        break;
      case SPACE_KEY:
        if (gameRunning) {
          createjs.Ticker.setPaused(createjs.Ticker.getPaused() ? false : true);
        } else {
          resetGame();
        }
        break;
    }
  }

  function newLevel() {
    var i, brick, freeLifeTxt;
    var data = levels[level];
    var xPos = WALL_THICKNESS;
    var yPos = WALL_THICKNESS;
    var freeLife = Math.round(Math.random() * 10) % 6;
    paddleHits = 0;
    shiftBricksDown();
    for (i = 0; i < 5; i++) {
      brick = new createjs.Shape();
      brick.graphics.beginFill(i == freeLife ? '#009900' : data.color);
      brick.graphics.drawRect(0, 0, 144, 30);
      brick.graphics.endFill();
      brick.x = xPos + 400;
      brick.y = yPos;
      brick.width = 144;
      brick.height = 30;
      brick.points = data.points;
      brick.freeLife = false;
      bricks.push(brick);
      stage.addChild(brick);
      if (i == freeLife) {
        freeLifeTxt = new createjs.Text('1UP', '12px Times', '#fff');
        freeLifeTxt.x = brick.x + (brick.width / 2);
        freeLifeTxt.y = brick.y + 4;
        freeLifeTxt.width = brick.width;
        freeLifeTxt.textAlign = 'center';
        brick.freeLife = freeLifeTxt;
        stage.addChild(freeLifeTxt);

        // icon[i].x = freeLifeTxt.x - 4;
        // icon[i].y = freeLifeTxt.y - 6;
        // stage.addChild(icon[i])
      }
      xPos += brick.width;
      if (xPos > (brick.width * 10)) {
        xPos = WALL_THICKNESS
        yPos += brick.height;
      }
    }
    level++;
    if (level == levels.length) {
      level--;
    }
  }

  function shiftBricksDown() {
    var i, brick;
    var shiftHeight = 80;
    var len = bricks.length;
    for (i = 0; i < len; i++) {
      brick = bricks[i];
      brick.y += shiftHeight;
      if (brick.freeLife) {
        brick.freeLife.y += shiftHeight;
      }
    }
  }

  function update() {
    updatePaddle();
    updatePuck();
    checkPaddle();
    checkBricks();
  }

  function updatePaddle() {
    var nextX = paddle.x;
    if (leftKeyDown) {
      nextX = paddle.x - PADDLE_SPEED;
      if (nextX < leftWall) {
        nextX = leftWall;
      }
    } else if (rightKeyDown) {
      nextX = paddle.x + PADDLE_SPEED;
      if (nextX > rightWall - paddle.width) {
        nextX = rightWall - paddle.width;
      }
    }
    paddle.nextX = nextX;
  }

  function updatePuck() {
    var nextX = puck.x + puck.velx;
    var nextY = puck.y + puck.vely;
    if (nextX < leftWall) {
      nextX = leftWall;
      puck.velx *= -1;
    } else if (nextX > (rightWall - puck.width)) {
      nextX = rightWall - puck.width;
      puck.velx *= -1;
    }
    if (nextY < (ceiling)) {
      nextY = ceiling;
      puck.vely *= -1;
    }
    puck.nextX = nextX;
    puck.nextY = nextY;
  }

  function checkPaddle() {
    if (puck.vely > 0 && puck.isAlive && puck.nextY > (paddle.y - paddle.height) && puck.nextX >= paddle.x && puck.nextX <= (paddle.x + paddle.width)) {
      puck.nextY = paddle.y - puck.height;
      combo = 0;
      paddleHits++;
      puck.vely *= -1;
    }
  }

  function checkBricks() {
    if (!puck.isAlive) {
      return;
    }
    var i, brick;
    for (i = 0; i < bricks.length; i++) {
      brick = bricks[i];
      if (puck.nextY >= brick.y && puck.nextY <= (brick.y + brick.height) && puck.nextX >= brick.x && puck.nextX <= (brick.x + brick.width)) {
        score += brick.points;
        combo++;
        if (brick.freeLife) {
          lives++;
          //get food
          getFood(i);

          createjs.Tween.get(brick.freeLife)
            .to({
              alpha: 0,
              y: brick.freeLife.y - 100
            }, 1000)
            .call(function() {
              stage.removeChild(this);
            });
        }
        if (combo > 4) {
          score += (combo * 10);
          var comboTxt = new createjs.Text('COMBO X' + (combo * 10), '14px Times', '#FF0000');
          comboTxt.x = brick.x;
          comboTxt.y = brick.y;
          comboTxt.regX = brick.width / 2;
          comboTxt.regY = brick.height / 2;
          comboTxt.alpha = 0;
          stage.addChild(comboTxt);
          createjs.Tween.get(comboTxt)
            .wait(200)
            .to({
              alpha: 1,
              scaleX: 2,
              scaleY: 2,
              y: comboTxt.y - 60
            }, 1000)
            .call(function() {
              stage.removeChild(this);
            });
        }
        stage.removeChild(brick);
        brick = null;
        bricks.splice(i, 1);
        puck.vely *= -1;
        break;
      }
    }
  }

  let count = 0;
  //let foodFallX = canvas.width/3;
  //let foodFallY = canvas.height-100;
  function getFood(j) {

    if(count > 5) {
      return;
    }

    icon[count].x = bricks[j].x + 40;
    icon[count].y = bricks[j].y;
    stage.addChild(icon[count]);

    if(count === 5) {
      setTimeout(function() {
        createjs.Tween.get(icon[count], {loop:false}).to({x:canvas.width/6+count*180, y:canvas.height-100, scaleX: 0.2, scaleY: 0.2}, 1000);
      }, 20000);
      gameOver();
      count = 0;
    }

    createjs.Tween.get(icon[count], {loop:false}).to({x:canvas.width/6+count*180, y:canvas.height-100, scaleX: 0.2, scaleY: 0.2}, 1000);
    count += 1;
    console.log(count);
  }

  let myScore;
  let word;
  function finishFood() {
    if(count === 0) {
      myScore = 0;
    }
    else if(count ===1) {
      myScore = 1;
    }
    else if(count ===2) {
      myScore = 2;
    }
    else if(count ===3) {
      myScore = 3;
    }
    else if(count ===4) {
      myScore = 4;
    }
    else if(count ===5) {
      myScore = 5;
    }
    word = new createjs.Text(myScore, '74px 華康郭泰碑W4', '#800040');
    word.y = canvas.width/2;
    stage.addChild(word);

  }

  function render() {
    paddle.x = paddle.nextX;
    puck.x = puck.nextX;
    puck.y = puck.nextY;
    livesTxt.text = "lives: " + lives;
    scoreTxt.text = "score: " + score;
  }

  function evalPuck() {
    if (puck.y > paddle.y) {
      puck.isAlive = false;
    }
    if (puck.y > canvas.height + 200) {
      puck.y = bricks[0].y + bricks[0].height + 40;
      puck.x = stage.canvas.width / 2;
      puck.velx *= -1;
      puck.isAlive = true;
      combo = 0;
      lives--;
    }
  }

  function evalGame() {
    if (lives < 0 || bricks[0].y > board.y) {
      gameOver();
    }
    if (paddleHits === PADDLE_HITS_FOR_NEW_LEVEL) {
      newLevel();
    }
  }

  function gameOver() {
    finishFood();
    createjs.Ticker.setPaused(true);
    gameRunning = false;
    messageTxt.text = "press spacebar to play";
    puck.visible = false;
    paddle.visible = false;
    stage.update();
    messageInterval = setInterval(function() {
      messageTxt.visible = messageTxt.visible ? false : true;
      stage.update();
    }, 1000);
  }

  function resetGame() {
    clearInterval(messageInterval);
    level = 0;
    score = 0;
    lives = 5;
    paddleHits = 0;
    puck.y = 160;
    puck.vely = PUCK_SPEED;
    puck.visible = true;
    paddle.visible = true;
    messageTxt.visible = true;
    gameRunning = true;
    messageTxt.text = "press spacebar to pause";
    stage.update();
    removeBricks();
    stage.removeChild(word);/////////
    newLevel();
    newLevel();
    createjs.Ticker.setPaused(false);
  }

  function removeBricks() {
    var i, brick;
    for (i = 0; i < bricks.length; i++) {
      brick = bricks[i];
      if (brick.freeLife) {
        stage.removeChild(brick.freeLife);
      }
      stage.removeChild(brick);
    }
    bricks = [];
  }

  function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(e) {
      if (!e.paused) {
        runGame();
        stage.update();
      }
    });
  }

  function runGame() {
    update();
    render();
    evalPuck();
    evalGame();
  }

  init();
});
