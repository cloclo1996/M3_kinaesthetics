// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//=========================================
//              VARIABLES
//=========================================

let HitBoxArray = [];

let rectangleWidth = 100; 
let rectangleHeight = 100;

//distance between wrists
let body;

     
//============================================
//                 CLASSES
//============================================

class Hitbox{
    constructor(x,y,width,height,color,ctx){
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._color = color;
    
    
    //When the wrist hits the hit box
    this._isOver = false;

    //Reference to drawing context
		this._ctx = ctx;
    }

    update(){
        //var leftWristX = wrists.leftWristX;
        //var leftWristY = wrists.leftWristY;
        //var rightWristX = wrists.rightWristX;
        //var rightWristY = wrists.rightWristY;
        if(//left wrist
            (this._x < wrists.leftWristX) || (wrists.leftWristX < (this._x + this._width)) || (this._y < wrists.leftWristY) || (wrists.leftWristY < (this._y + this._height)) ||
            //right wrist
            (this._x < wrists.rightWristX) || (wrists.rightWristX < (this._x + this._width)) || (this._y < wrists.rightWristY) || (wrists.rightWristY < (this._y + this._height))) {
                this._isOver = true;
         } else {
             this._isOver = false;
         }
    }

    hitBoxSquare(){
        this._ctx.save();

        let hitbox = new Path2D();
        hitbox.rect(this._x,this._y,this._width, this._height);
        ctx.fillStyle = this._color;
        ctx.fill(hitbox);
    }

    drawHitBox() {

        this.hitBoxSquare();

        if(this._isOver == true){
			ctx.fillStyle = 'green';
            ctx.fill(hitbox);
            setTimeout(this.drawHitBox, 2000);
            this._ctx.restore();
		}
    }
}

//==============================================
//                 ML PART
//==============================================

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
    posenet: posenet,
    architecture: modelArchitecture.MobileNetV1, 
    detectionType: detectionType.singleBody, 
    videoElement: document.getElementById('video'), 
    samplingRate: 100})


//save function for event listener onto a variable.
let wrists = (e) => {
    body = e.detail.getBodyAt(0)
    const leftWrist = body.getBodyPart(bodyParts.leftWrist);
    const rightWrist = body.getBodyPart(bodyParts.rightWrist);
    document.getElementById('output').innerText = `Left Wrist: ${Math.round(leftWrist.position.x)}, ${Math.round(leftWrist.position.y)}` + ` Right Wrist: ${Math.round(rightWrist.position.x)}, ${Math.round(rightWrist.position.y)}`;

  //this function will also be used to call specific variables elsewhere in the code  
  return {leftWristX: leftWrist.position.x,
    leftWristY: leftWrist.position.y,
    rightWristX: rightWrist.position.x,
    rightWristY: rightWrist.position.y
  };
}

//this is fired when posenet detects a pose
bodies.addEventListener('bodiesDetected', wrists);

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        //circle's radius
        let radius = 10;

        // draw left wrist
        ctx.beginPath();
        ctx.arc(wrists.leftWristX, wrists.leftWristY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // draw right wrist
        ctx.beginPath();
        ctx.arc(wrists.rightWristX, wrists.rightWristY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    //start camera
    requestAnimationFrame(drawCameraIntoCanvas());
}

function init(){
    let randomX = Math.random() * Math.floor(video.width);
    let randomY = Math.random() * Math.floor(video.height);

    //create a hitbox
    let hitbox = new Hitbox(randomX, randomY, rectangleWidth, rectangleHeight, 'purple', ctx);
    HitBoxArray.push(hitbox);
    HitBoxArray[0].update();
	HitBoxArray[0].drawHitBox();

    //run update() and draw() for each array element
    /*for (let i = 0; i < HitBoxArray.length; i++){
		HitBoxArray[i].update();
		HitBoxArray[i].drawHitBox();		
	}*/
}



//===========================================
//                  RUN
//===========================================



// start body detecting 
bodies.start();

drawCameraIntoCanvas();

init();