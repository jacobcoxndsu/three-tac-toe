/*
PLayer object.
Contains the player attributes and the cubes the player has selected
*/
function Player(){
    this.id = null;
    this.score =  0;
    this.turn = false;
    this.color = 0x000000;
    this.buttonColor = "#000000";
    this.cubes = [];
    
    this.addCube = function(cube){
        this.cubes.push(cube);
    }
}

//Instantiate the Players
var player1 = new Player();
player1.id = 1;
player1.color = 0xff0000;
player1.buttonColor = "#ff0000";
var player2 = new Player();
player2.id = 2;
player2.color = 0x0000ff;
player2.buttonColor = "#0000ff";

//Set Player1's turn to true;
player1.turn = true;

function getCurrentPlayer(){
    if(player1.turn){
        return player1;
    } else if(player2.turn){
        return player2;
    } else {
        console.log("player turn broken");
    }
}

function endTurn(player, cube){
    player.addCube(cube);
    player1.turn = !player1.turn;
    player2.turn = !player2.turn;
    
    if(player1.turn){
        currentPlayerButton.style.background = player1.buttonColor;
        currentPlayerButton.innerHTML = "Red's Turn";
    } else if(player2.turn) {
        currentPlayerButton.style.background = player2.buttonColor;
        currentPlayerButton.innerHTML = "Blue's Turn";
    }
    
    //console.log(player1.cubes);
    //console.log(player2.cubes);
    //console.log("-------------------------");
    
    hasWon();
}

function hasWon(){
    //check Player1
    if(player1.cubes.length > 2){
        for(var i = 0; i < player1.cubes.length; i++){
            for(var j = 0; j < player1.cubes.length; j++){
                for(var k = 0; k < player1.cubes.length; k++){
                    if(i != j && j != k && k != i){
                        if(hasSameSlope(player1.cubes[i],                                 player1.cubes[j],
                                        player1.cubes[k])
                                        ){
                            win(1);
                        }
                    }
                }
            }
        }
    }
    
    //check Player2
    if(player2.cubes.length > 2){
        for(var i = 0; i < player2.cubes.length; i++){
            for(var j = 0; j < player2.cubes.length; j++){
                for(var k = 0; k < player2.cubes.length; k++){
                    if(i != j && j != k && k != i){
                        if(hasSameSlope(player2.cubes[i],                                 player2.cubes[j],
                                        player2.cubes[k])
                                        ){
                            win(2);
                        }
                    }
                }
            }
        }
    }
}

function compareCubePositions(pos1, pos2){
    if(pos1[0] === pos2[0])
        if(pos1[1] === pos2[1])
            if(pos1[2] === pos[2])
                return true;
    return false;
}

function hasSameSlope(cube1,cube2,cube3){
    var x1, y1, z1, x1, x2, x3, z1, z2, z3;
    
    x1 = cube1.object.positionInGame.x;
    y1 = cube1.object.positionInGame.y;
    z1 = cube1.object.positionInGame.z;
    
    x2 = cube2.object.positionInGame.x;
    y2 = cube2.object.positionInGame.y;
    z2 = cube2.object.positionInGame.z;
    
    x3 = cube3.object.positionInGame.x;
    y3 = cube3.object.positionInGame.y;
    z3 = cube3.object.positionInGame.z;
    
    sum1 = (y2-y1) * (z3-z1) - (y3-y1) * (z2-z1);
    sum2 = (x3-x1) * (z2-z1) - (x2-x1) * (z3-z1);
    sum3 = (x2-x1) * (y3-y1) - (x3-x1) * (y2-y1);
    
    if(sum1 == 0 && sum2 == 0 && sum3 == 0){
        return true;
    }
    
    return false;
}
