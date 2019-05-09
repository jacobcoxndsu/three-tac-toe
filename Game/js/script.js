var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var expanded = false;
var clickedSpaceBar = false;

var headerSize = 50;
var playing = true;
var sound = true;

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xa0a0a0 );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clickCorrect = new Audio("sounds/ping-bing.wav");
var clickWrong = new Audio("sounds/bonk-click-deny-feel.wav");

function placeInGameBoard(coord, player){
    if(coord.z === 0){
        //middle
        gameBoardMiddle[coord.x + 1][coord.y + 1] = player.id;
    } else if(coord.z === 1){
        //top
        gameBoardTop[coord.x + 1][coord.y + 1] = player.id;
    } else if(coord.z === -1){
        //bottom
        gameBoardBottom[coord.x + 1][coord.y + 1] = player.id;
    }
}

//Origin is the main cube
var cubePositions = [
        [0,1,0],
        [0,-1,0],
        [1,0,0],
        [-1,0,0],
        [1,-1,0],
        [1,1,0],
        [-1,-1,0],
        [-1,1,0],

        [0,0,1],
        [0,1,1],
        [0,-1,1],
        [1,0,1],
        [-1,0,1],
        [1,-1,1],
        [1,1,1],
        [-1,-1,1],
        [-1,1,1],

        [0,0,-1],
        [0,1,-1],
        [0,-1,-1],
        [1,0,-1],
        [-1,0,-1],
        [1,-1,-1],
        [1,1,-1],
        [-1,-1,-1],
        [-1,1,-1],
                    ];

var cubes = [];

var geometry = new THREE.BoxGeometry(.8,.8,.8);

//Parent Cube
var material = new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.2});
var parentCube = new THREE.Mesh(geometry, material);
parentCube.playerID = null;
parentCube.positionInGame = {x:0, y:0, z:0};

for(var i = 0; i < 26; i++){
    var material = new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.2});

    var cube = new THREE.Mesh(geometry, material);
    cube.playerID = null;
    cube.positionInGame = {x:cubePositions[i][0], y: cubePositions[i][1], z:cubePositions[i][2]};
    cube.position.set(cubePositions[i][0], cubePositions[i][1], cubePositions[i][2]);
    cubes.push(cube);
    parentCube.add(cube);
}

cubes.push(parentCube);
scene.add(parentCube);

camera.position.z = 5;


/*
This function is the main render function for everything in the game. It is used so that when a user navagates away from the window it does not use any computer resources.
*/
function render(){
    //drawHeader();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();


/*
These methods are all part of the click and mouse drag handling and user interaction

This includes player switching, rotation of the game, and the expansion and contraction of the game.
*/

var isDragging = false;
var previousMousePosition = {
    x:0,
    y:0
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

document.onmousedown = function(event){
    isDragging = true;
    
    if(!playing){
        
    }
}

document.onmousemove = function(e){
    var deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
    }

    if(isDragging){
        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(toRadians(deltaMove.y * 1), toRadians(deltaMove.x * 1), 0, 'XYZ'));

        parentCube.quaternion.multiplyQuaternions(deltaRotationQuaternion, parentCube.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    }
}

document.onmouseup = function(e){
    isDragging = false;
}

document.ondblclick = function(e){
    if(playing){
        mouse.x = (event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(cubes);

        if(intersects.length > 0){
            if(intersects[0].object.playerID == null){
                clickCorrect.currentTime = 0;
                if(sound)
                    clickCorrect.play();
                intersects[0].object.playerID = getCurrentPlayer().id;
                intersects[0].object.material.color.setHex(getCurrentPlayer().color);
                intersects[0].object.material.opacity = 0.9;
                endTurn(getCurrentPlayer(), intersects[0]); 
            }
            else{
                clickWrong.currentTime = 0;
                if(sound)
                    clickWrong.play();
                console.log('Piece taken');
            }
        }
    }
    
}

function toRadians(angle) {
   return angle * (Math.PI / 180);
}

function toDegrees(angle) {
   return angle * (180 / Math.PI);
}


function win(num){
    console.log("win");
    if(playing == true){
        if(num == 1){
            displayWinner(num);
        } else if(num == 2){
            displayWinner(num);
        }
    }
    playing = false;
}





/*
This is the keypress method for the entire web page.
*/
document.body.onkeypress = function(e){
    if(e.keyCode == 32){
        if(!expanded){
            expanded = true;
        } else {
            expanded = false;
        }
        beginAnimation();
    }
}

/*
This method needs some work but at the moment only calls the expansion and contraction of the cubes in space. it happens to fast for the human eye to see what is going on so it does not really do much by way of animation.
*/
function beginAnimation(){
    if(expanded)
        expandTo();
    else
        contractTo();
}

/*
This method takes in teh positions of the cubes and translates them one frame to the new position a little but farther away from the center.
*/
function expand(){
    for(var i = 0; i < cubePositions.length; i++){
        var x = cubePositions[i][0];
        var y = cubePositions[i][1];
        var z = cubePositions[i][2];

        var change = 0.1;
        var changeCap = 2;

        if(i < cubePositions.length){
            if(x < changeCap && x > -changeCap){
                if(x > 0){
                    x += change;
                } else if(x < 0){
                    x -= change;
                }
            }

            if(y < changeCap && y > -changeCap){
                if(y > 0){
                    y += change;
                } else if(y < 0){
                    y -= change;
                }
            }

            if(z < changeCap && z > -changeCap){
                if(z > 0){
                    z += change;
                } else if(z < 0){
                    z -= change;
                }
            }
        }

        //Reset the variables
        cubePositions[i][0] = x;
        cubePositions[i][1] = y;
        cubePositions[i][2] = z;

        //set cubes
        cubes[i].position.set(cubePositions[i][0], cubePositions[i][1], cubePositions[i][2]);
    }
}

/*
This method takes the cubes and instantaniously puts them back to their original positions.
*/
function contract(){
    for(var i = 0; i < cubePositions.length; i++){
        var x = cubePositions[i][0];
        var y = cubePositions[i][1];
        var z = cubePositions[i][2];

        var change = 0.1;

        if(x < 0){
            x = -1;
        } else if(x > 0){
            x = 1;
        }

        if(y < 0){
            y = -1;
        } else if(y > 0){
            y = 1;
        }

        if(z < 0){
            z = -1;
        } else if(z > 0){
            z = 1;
        }

        //Reset the variables
        cubePositions[i][0] = x;
        cubePositions[i][1] = y;
        cubePositions[i][2] = z;

        //set cubes
        cubes[i].position.set(cubePositions[i][0], cubePositions[i][1], cubePositions[i][2]);
    }
}

//methods that control the buttons
var soundButton = document.getElementById('soundButton');
var currentPlayerButton = document.getElementById('currentPlayer');

currentPlayerButton.style.background = player1.buttonColor;

soundButton.onclick = function(){
    sound = !sound;
    if(sound){
        soundButton.style.background = "#f2f2f2";
        soundButton.style.color = "#404040";
    } else if(!sound) {
        soundButton.style.background = "#404040";
        soundButton.style.color = "#f2f2f2";
        clickCorrect.currentTime = 0;
        clickWrong.currentTime = 0;
        boom.currentTime = 0;
    }
}

/*
This method creates the stems nesesary for the expand to happen as it calles expand the required times to make it "fully" expand.
*/
function expandTo(){
    for(var i = 0; i < 100; i++){
        expand();
    }
}

/*
This method at the moment is not very useful as it only calls the contract method too many times, the contract method does not actually need to be called this many times.
*/
function contractTo(){
    for(var i = 0; i < 100; i++){
        contract();
    }
}

function IncludeJavaScript(jsFile)
{
  document.write('<script type="text/javascript" src="'
    + jsFile + '"></scr' + 'ipt>'); 
}