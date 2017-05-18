$(document).ready(() => {
  let stage = new createjs.Stage(canvas);
  let repo = new createjs.LoadQueue();

  stage.canvas.width = window.innerWidth - 100;
  stage.canvas.height = window.innerHeight - 100;
  document.body.style.backgroundColor = "black";

  var ctx = canvas.getContext("2d");
  //球半徑,x,y
  let ballRadius = 10;
  let ballX = stage.canvas.width / 2;
  let ballY = stage.canvas.height - 30;
  var dx = 3;
  var dy = -3;

  //盤子設定
  let paddleHeight = 20;
  let paddleWidth = 100;
  let paddleX = (stage.canvas.width - paddleWidth) / 2;

  //滑鼠按鍵初始值
  let rightPressed = false;
  let leftPressed = false;

  //磚塊設定
  let brickRowCount = 5;
  let brickColumnCount = 3;
  let brickWidth = 75;
  let brickHeight = 20;
  let brickPadding = 10;
  let brickOffsetTop = 30;
  let brickOffsetLeft = window.innerWidth / 3;
  //分數及規則
  let score = 0;
  let lives = 3;

  var bricks = [];

  //產生磚塊
  for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1
      };
    }
  }


  let ball = new createjs.Shape();
  let Paddle = new createjs.Shape();
  let Score = new createjs.Text('Score:' + score, '16px Arial', "#0095DD");
  let Lives = new createjs.Text("Lives: " + lives, '16px Arial', "#0095DD");

  function setup() {
    // automatically update
    createjs.Ticker.on("tick", e => stage.update());
    createjs.Ticker.setFPS(60);

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
        }, {
          id: 'ic7',
          src: "icon/7.png"
        }, {
          id: 'bowl',
          src: "icon/bowl.png"
        }, {
          id: 'start',
          src: "icon/start.png"
        }]);



    repo.on('complete', start); // wait until all assets are loaded
  }
  ///碰撞偵測
  function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  //畫球
  function drawBall() {
    //drawbackground()
    if (ballX + dx > stage.canvas.width - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;
    }
    if (ballY + dy < ballRadius) {
      dy = -dy;
    } else if (ballY + dy > stage.canvas.height - paddleHeight) {
      if (ballX > Paddle.x && ballX < Paddle.x + paddleWidth) {
        dy = -dy;
      }
    }
    ballX += dx;
    ballY += dy;

    //let ball = new createjs.Shape();
    ball.graphics.beginFill('#0095DD').drawCircle(ballX, ballY, ballRadius);
    let theBall = createjs.Tween.get(ball);
    stage.addChild(ball);
  }

  //畫盤子
  function drawPaddle() {
    //let Paddle = new createjs.Shape();

    Paddle.graphics.beginFill("#0095DD").drawRect(stage.mouseX, stage.canvas.height - 30, paddleWidth, paddleHeight);
    stage.addChild(Paddle);
    Paddle.on('tick', e => {
      if (stage.mouseX > 0 && stage.mouseX < stage.canvas.width) {
        Paddle.x = stage.mouseX - (paddleWidth / 2);

      }
    });

  }
  //畫磚塊
  function drawBricks() {

    let icon = [new createjs.Bitmap(repo.getResult('ic1')),
      new createjs.Bitmap(repo.getResult('ic2')),
      new createjs.Bitmap(repo.getResult('ic3')),
      new createjs.Bitmap(repo.getResult('ic4')),
      new createjs.Bitmap(repo.getResult('ic5')),
      new createjs.Bitmap(repo.getResult('ic6')),
      new createjs.Bitmap(repo.getResult('ic7'))
    ];
    for (var i = 0; i < icon.length; i++) {
      icon[i].set({
        scaleX: 0.1,
        scaleY: 0.1
      });
}

    var num=0;
    for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
          var Bricks = new createjs.Shape();
          Bricks.graphics.beginFill('#0095DD').drawRect(brickX, brickY, brickWidth, brickHeight);
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          stage.addChild(Bricks);
          icon[num].x = brickX;
          icon[num].y = brickY;
          num=num%6;
          stage.addChild(icon[num])
          num++;
        }
      }
    }
  }
  //畫分數
  function drawScore() {
    //let Score = new createjs.Text('Score:' + score, '16px Arial', "#0095DD");
    Score.x = 8;
    Score.y = 20;
    stage.addChild(Score);
  }
  //畫生命
  function drawLives() {
    //let Lives = new createjs.Text("Lives: " + lives, '16px Arial', "#0095DD");
    Lives.x = stage.canvas.width - 65;
    Lives.y = 20;
    stage.addChild(Lives);
  }

  function draw() {

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection()
    requestAnimationFrame(draw);
  }

  function start(){
    let start = new createjs.Bitmap(repo.getResult('start'));
    start.set({
      scaleX: 1,
      scaleY: 1
    });
    start.x = window.innerWidth / 2 - (start.image.width / 2);
    start.y = window.innerHeight / 2 - (start.image.width / 2);
    start.regX = start.image.width / 2 * start.scaleX;
    start.regY = start.image.height / 2 * start.scaleY;
    //createjs.Tween.get(shape,{loop:true}).to({rotation:360},1000);

    createjs.Tween.get(start, {
        loop: true
      })
      .to({
        rotation: 10
      }, 1000)
      .to({
        rotation: -10
      }, 1000);
    start.on('click', e => {
      stage.removeChild(start);
      draw();
    });

    stage.addChild(start);

    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

  }

  setup();

});
