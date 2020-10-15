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

let body;

// get right/left wrist
//let leftWrist = body.getBodyPart(bodyParts.leftWrist);
//let rightWrist = body.getBodyPart(bodyParts.rightWrist);

//circle's X,Y and radius
let randomX = Math.random() * Math.floor(640);
let randomY = Math.random() * Math.floor(480);
let radius = 10;

//distance between wrists
let distance;

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
    posenet: posenet,
    architecture: modelArchitecture.MobileNetV1, 
    detectionType: detectionType.singleBody, 
    videoElement: document.getElementById('video'), 
    samplingRate: 250})
  


bodies.addEventListener('bodiesDetected', (e) => {
  body = e.detail.bodies.getBodyAt(0)
  distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist))
  document.getElementById('output').innerText = `Distance between wrists: ${distance}`
  body.getDistanceBetweenBodyParts(bodyParts.leftWrist, bodyParts.rightWrist)
})

// start body detecting 
bodies.start();

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
        bodies.start();
        const leftWrist = body.getBodyPart(bodyParts.leftWrist);
        const rightWrist = body.getBodyPart(bodyParts.rightWrist);
        if(//left wrist
            (this._x < leftWrist.position.x) || (leftWrist.position.x < (this._x + this._width)) || (this._y < leftWrist.position.y) || (leftWrist.position.y < (this._y + this._height)) ||
            //right wrist
            (this._x < rightWrist.position.x) || (rightWrist.position.x < (this._x + this._width)) || (this._y < rightWrist.position.y) || (rightWrist.position.y < (this._y + this._height))) {
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

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);

    //run update() and draw() for each array element
    for (let i = 0; i < HitBoxArray.length; i++){
		HitBoxArray[i].update();
		HitBoxArray[i].draw();		
	}
    
    if (body) {
        // draw circle for left and right wrist
        //const leftWrist = body.getBodyPart(bodyParts.leftWrist);
        //const rightWrist = body.getBodyPart(bodyParts.rightWrist);

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
    requestAnimationFrame(drawCameraIntoCanvas);
}

function init(){
    //create a hitbox
    let hitbox = new Hitbox(randomX, randomY, rectangleWidth, rectangleHeight, 'green', ctx);
    HitBoxArray.push(hitbox);
}



//===========================================
//                  RUN
//===========================================

init();


// draw video and body parts into canvas continously 
drawCameraIntoCanvas();