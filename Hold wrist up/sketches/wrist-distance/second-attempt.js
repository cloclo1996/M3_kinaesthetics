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


// get right/left wrist
//let body;

//circle's X,Y and radius
let randomX = Math.random() * Math.floor(640);
let randomY = Math.random() * Math.floor(480);
let radius = 10;

//distance between wrists
let leftWrist, rightWrist,body;

     
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
        var leftWristX = wrists.leftWristX;
        var leftWristY = wrists.leftWristY;
        var rightWristX = wrists.rightWristX;
        var rightWristY = wrists.rightWristY;
        if(//left wrist
            (this._x < leftWristX) || (leftWristX < (this._x + this._width)) || (this._y < leftWristY) || (leftWristY < (this._y + this._height)) ||
            //right wrist
            (this._x < rightWristX) || (rightWristX < (this._x + this._width)) || (this._y < rightWristY) || (rightWristY < (this._y + this._height))) {
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
var wrists = (e) => {
    body = e.detail.getBodyAt(0)
    leftWrist = body.getBodyPart(bodyParts.leftWrist);
    rightWrist = body.getBodyPart(bodyParts.rightWrist);
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

        // draw left wrist
        ctx.beginPath();
        ctx.arc(leftWrist.position.x, leftWrist.position.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    requestAnimationFrame(drawCameraIntoCanvas());
}

function init(){
    //create a hitbox
    let hitbox = new Hitbox(randomX, randomY, rectangleWidth, rectangleHeight, 'green', ctx);
    HitBoxArray.push(hitbox);

    //run update() and draw() for each array element
    for (let i = 0; i < HitBoxArray.length; i++){
		HitBoxArray[i].update();
		HitBoxArray[i].drawHitBox();		
	}
}



//===========================================
//                  RUN
//===========================================



// start body detecting 
bodies.start();

//start camera
drawCameraIntoCanvas();

init();