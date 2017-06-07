$(document).ready(()=>{ // jQuery main
    
	let stage = new createjs.Stage(canvas);
	let repo = new createjs.LoadQueue();
		   
	function setup() {
		// automatically update
		createjs.Ticker.on("tick", e => stage.update());
		createjs.Ticker.setFPS(60);
		// load assets
		repo.loadManifest([{id:'plane',src:"image/plane.jpg"},
			               {id:'explode',src:"image/exp.png"},
			               {id:'m1',src:"image/m1.png"},
		                   {id:'m2',src:"image/m2.png"},
		                   {id:'m3',src:"image/m3.png"},
		                   {id:'m4',src:"image/m4.png"}]);
	    repo.on('complete', draw); // wait until all assets are loaded
	}
	
	function draw(){
		let plane = new createjs.Bitmap(repo.getResult('plane'));
		let exp = new createjs.Bitmap(repo.getResult('explode'));
		let mountains = [new createjs.Bitmap(repo.getResult('m1')),
            new createjs.Bitmap(repo.getResult('m2')),
            new createjs.Bitmap(repo.getResult('m3')),
            new createjs.Bitmap(repo.getResult('m4'))
           ];
		
		plane.x = 10;
		plane.y = 10;
		
  		mountains[0].x = 600;
		mountains[0].y = 150;

		mountains[1].x = 600;
		mountains[1].y = 175;
		
		mountains[2].x = 600;
		mountains[2].y = 200;
		
		mountains[3].x = 600;
		mountains[3].y = 225;
		
		createjs.Tween.get(mountains[0],{loop:true}).to({x:0,y:150},5000);
		createjs.Tween.get(mountains[1],{loop:true}).to({x:0,y:170},4500);
		createjs.Tween.get(mountains[2],{loop:true}).to({x:0,y:200},4000);
		createjs.Tween.get(mountains[3],{loop:true}).to({x:0,y:225},3500);
		
		window.addEventListener('keydown', function(e){
			switch(e.keyCode){
		           case 38:// up
		        	   plane.y -= 10;
			           break;
			       case 40:// down
			    	   plane.y += 10;
			           break;
			   }
		});
		
		plane.on('click', e=>{
            let dot = new createjs.Shape();
            dot.graphics.beginFill('red').drawCircle(plane.x+100,plane.y+50,5);
            createjs.Tween.get(dot)
                          .to({x:600},1000)
                          .call(()=> {
                        	  stage.removeChild(dot);
                        	  exp.x = 500;
                              exp.y = plane.y;
                              stage.addChild(exp);
                           }).wait(500).call(()=>{stage.removeChild(exp)});
                          
            stage.addChild(dot);
        });
		
		stage.addChild(mountains[0],mountains[1],mountains[2],mountains[3]);
		stage.addChild(plane);
	}
	
	setup();
	
});






