// @ts-nocheck


/* ----- setup ------ */

let speed = [];

// sets up a bodystream with configuration object
const bodies = new BodyStream ({
    posenet: posenet,
    architecture: modelArchitecture.MobileNetV1, 
    detectionType: detectionType.singleBody, 
    videoElement: document.getElementById('video'), 
    samplingRate: 400})
  



let body
let distance

bodies.addEventListener('bodiesDetected', (e) => {
  body = e.detail.bodies.getBodyAt(0)
  distance = Math.round(body.getDistanceBetweenBodyParts(bodyParts.rightKnee, bodyParts.rightWrist))
  speed.push(distance);
  document.getElementById('output').innerText = `Distance between wrists: ${distance}`
  body.getDistanceBetweenBodyParts(bodyParts.rightKnee, bodyParts.rightWrist)
  if (speed.length > 6){
    speed.pop();
  }
})

//Working-------------------
let prevValueIsWithinDistance = false;
let currentValueIsWithinDistance = false;

var audio = new Audio('ding.wav');

window.setInterval( function(){
  
  currentValueIsWithinDistance = (distance > 20 && distance < 100)
  
  if(currentValueIsWithinDistance && prevValueIsWithinDistance){
      audio.play()
  }

  prevValueIsWithinDistance = currentValueIsWithinDistance
},2000)
// get elements
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// draw the video, nose and eyes into the canvas
function drawCameraIntoCanvas() {

    // draw the video element into the canvas
    ctx.drawImage(video, 0, 0, video.width, video.height);
    
    if (body) {
        // draw circle for left and right wrist
        const rightWrist = body.getBodyPart(bodyParts.rightWrist)
        const rightAnkle = body.getBodyPart(bodyParts.rightKnee)
        const leftEye = body.getBodyPart(bodyParts.leftEye)
        const rightEye = body.getBodyPart(bodyParts.rightEye)

        // draw left wrist
        ctx.beginPath();
        ctx.arc(rightWrist.position.x, rightWrist.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right wrist
        ctx.beginPath();
        ctx.arc(rightAnkle.position.x, rightAnkle.position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'white'
        ctx.fill()

        // draw right eye
        //ctx.beginPath();
        //ctx.arc(rightEye.position.x, rightA);
    }
    requestAnimationFrame(drawCameraIntoCanvas)
}

/* ----- run ------ */

// start body detecting 
bodies.start()
// draw video and body parts into canvas continously 
drawCameraIntoCanvas();