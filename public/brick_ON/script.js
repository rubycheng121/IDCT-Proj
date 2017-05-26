// Code goes here
window.onload = function() {
  // code here.
  var stage = new createjs.Stage("demoCanvas");
  var radius = 10;
  var shapes = [];
  var enemies = [];
  var reibing = 0.1;
  var polygon = new createjs.Shape();
  var bulSpeed = 100;
  var strokeWidth=0;
  var maxBull=2;
  //IMMER +1
  var enCount=10;
  var lastX=0;
  var lastY=0;
  var rows=5;
  var rectWidth=50;
  var rectHeight=8;
  stage.enableMouseOver(10);
  stage.enableDOMEvents(true);
  createjs.Touch.enable(stage);
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, rectWidth,rectHeight);
  circle.x = radius;
  circle.y = stage.canvas.height - radius;
  circle.vx = 0;
  circle.vy = 0;
  circle.lastX = 0;
  circle.lasty = 0;
  circle.right = true;
  circle.up = true;
  //shapes.push(circle);
  stage.addChild(circle);
  stage.update();
spawnEn();
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.setFPS(60);

  stage.on("stagemousemove", handleMouseMove);
  stage.on("stagemousedown", handleMouseDown);

  function handleMouseMove(event) {
    circle.vx = (circle.x - stage.mouseX) * -1;
    stage.update();
  }

  function handleMouseDown(event) {
    if(shapes.length<maxBull){
    var bull = new createjs.Shape();
    bull.graphics.beginFill("Orange").drawCircle(0, 0, radius);
    bull.x = circle.x+rectWidth/2;
    bull.y = circle.y - rectHeight;
    bull.vx = circle.vx;
    bull.vy = bulSpeed;
    bull.bullet=true;
    shapes.push(bull);
    stage.addChild(bull);
    stage.update();
    }

  }
    function spawnEn() {
      for(var r=1;r<rows;r++){
      for(var i=1;i<enCount;i++){
         var en = new createjs.Shape();
    en.graphics.beginFill("Red").drawCircle(0, 0, radius);
    en.x = ((stage.canvas.width)/enCount*i);
    en.y =radius*(r*4);
    en.vx = 0;
    en.vy = 0;
    en.enemy=true;
    enemies.push(en);
    stage.addChild(en);
      }
      }
    stage.update();
  }

  function tick(event) {
            var xDist = stage.mouseX -circle.x;
        var distance = Math.sqrt(xDist * xDist);
    if(distance<1){
      circle.vx=0;
    }
    if (circle.x > stage.canvas.width - radius) {
      console.log("Rechts angedotzt")
      circle.x = stage.canvas.width - radius;
    } else if (circle.x < radius) {
      console.log("LINKS angedotzt")
      circle.x = radius;
    }
    circle.x += event.delta / 1000 * circle.vx;
    circle.y += event.delta / 1000 * circle.vy;

    for (var i = 0; i < shapes.length; i++) {
      if (shapes[i].x > stage.canvas.width - radius) {
        console.log("Rechts Obj angedotzt")
        shapes[i].vx *= -1;
      } else if (shapes[i].x < radius) {
        console.log("Links angedotzt")
        shapes[i].vx *= -1;
      }
      if (shapes[i].y > stage.canvas.height - radius) {
        console.log("Unten Obj angedotzt")
        //shapes[i].vy *= -1;
          stage.removeChild(shapes[i]);
          shapes.splice(i,1);
      } else if (shapes[i].y < radius) {
        console.log("Oben Obj angedotzt")
        shapes[i].vy *= -1;
      }
        var xDist = shapes[i].x -circle.x;
        var yDist = shapes[i].y - circle.y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);
        if((shapes[i].x>(circle.x)&&shapes[i].x<(circle.x+(rectWidth)))&&(shapes[i].y>circle.y-rectHeight)){
                  shapes[i].vy*=-1;
                  shapes[i].vx=circle.vx;
          shapes[i].y=circle.y - rectHeight;  
        }
        if (distance < radius + radius) {

        }
      for (var x = 0; x < shapes.length; x++) {
        xDist = shapes[i].x - shapes[x].x;
        yDist = shapes[i].y - shapes[x].y;
        distance = Math.sqrt(xDist * xDist + yDist * yDist);
        if (distance < radius + radius) {
          checkCollision(shapes[i],shapes[x]);
        }
      }
      for (var x = 0; x < enemies.length; x++) {
         xDist = shapes[i].x - enemies[x].x;
         yDist = shapes[i].y - enemies[x].y;
         distance = Math.sqrt(xDist * xDist + yDist * yDist);
        if (distance < radius + radius) {
          stage.removeChild(enemies[x]);
          enemies.splice(x,1);
                    shapes[i].vy*=-1;
        }
      }
      shapes[i].x += event.delta / 1000 * shapes[i].vx;
      shapes[i].y -= event.delta / 1000 * shapes[i].vy;
    }
    stage.update();
  }
      function checkCollision(s1,s2){
      var uvx=s1.vx;
      s1.vx=s2.vx;
      if(!s2.enemy)
      s2.vx=uvx;
      var uvy=s1.vy;
      s1.vy=s2.vy;
      if(!s2.enemy)
      s2.vy=uvy;
    }


};