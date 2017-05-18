$(document).ready(() => {
  let stage = new createjs.Stage(canvas);
  let repo = new createjs.LoadQueue();

  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;
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


    repo.on('complete', draw); // wait until all assets are loaded
  }

  function draw() {
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
    });


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
        scaleX: 0.4,
        scaleY: 0.4
      });
      //  var offSetX = Math.floor((Math.random() * 100)%window.innerWidth);
      var offSetY = Math.floor((Math.random() * 10000) % window.innerHeight);
      icon[i].x = window.innerWidth;
      icon[i].y = offSetY;
      var time = Math.floor((Math.random() * 10000) % 6000);
      var ani = createjs.Tween.get(icon[i], {
          loop: false
        })
        .to({
          x: 0
        }, time)
        .wait(500)
        .call(() => {
          stage.removeChild(icon[i-1])
        });
          stage.addChild(icon[i])

    }

    stage.addChild(start);


    //requestAnimationFrame(draw);
  }

  setup();

});
