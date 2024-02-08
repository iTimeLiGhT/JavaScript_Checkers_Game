//Updating player names in the scoreboard:
var player1Name = "";
var player2Name = "";
$(document).ready(function () {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    if(urlParams.has("param1") && urlParams.has("param2")){
        player1Name = urlParams.get("param1");
        player2Name = urlParams.get("param2");
        $("#player1Name").text(player1Name);
        $("#player2Name").text(player2Name);
    }
    else{
        $("#dialog").dialog();
    }
    
});
$("#startButton").click(function () {
    player1Name = $("#player1").val();
    player2Name = $("#player2").val();
    if (player1Name == "") {
        player1Name = "Foo";
    }
    if (player2Name == "") {
        player2Name = "Bar";
    }
    $("#player1Name").text(player1Name);
    $("#player2Name").text(player2Name);
    $("#dialog").dialog("close");
});

//Updating player score in the scoreboard:
var player1Score;
var player2Score;
$(document).ready(function () {
    player1Score = 0;
    player2Score = 0;
    $("#player1Score").text(player1Score);
    $("#player2Score").text(player2Score);
});

function updateScore(player){
    if(player == player2Name){
        player2Score++;
        $("#player2Score").text(player2Score);
        if(player2Score == 12){
            $("#winner-name").text(player2Name);
            $("#dialog-winner").dialog("open");
        }
    }
    else{
        player1Score++;
        $("#player1Score").text(player1Score);
        if(player1Score == 12){
            $("#winner-name").text(player1Name);
            $("#dialog-winner").dialog("open");
        }
    }
}

//Winner message:
$("#dialog-winner").dialog({
    autoOpen: false,
    modal: true,
    width: 400,
});

//Error message:
$("#dialog-error").dialog({
    autoOpen: false,
    modal: true,
    width: 200,
});
//Error message:
$("#dialog-error-endTurn").dialog({
    autoOpen: false,
    modal: true,
    width: 250,
});

//End turn button:
$("#endtern-bt").click(function(){
    endTurnButton();
})

//Reset game button:
$("#restart-bt1, #restart-bt2").click(function(){
        var param1Value = player1Name;
        var param2Value = player2Name;
    var newURL = "Checkers.html"+ "?param1=" + encodeURIComponent(param1Value) + "&param2=" + encodeURIComponent(param2Value);
    window.location.href = newURL;

})

//Functionality of pieces movement on the board:
var state = "PlayerTurn";
var currentTurn = "red-piece";
let startingPos = [-1, -1];
var startPiece;
var direction = -1;
var ateFlag = 0;
$(".piece").mouseup(function () {
    if(this.classList.contains(currentTurn)){
    if (state == "PlayerTurn") {
        startingPos = [parseInt(this.getAttribute("x"), 10), parseInt(this.getAttribute("y"), 10)];
        startPiece = this;
        state = "clicked";
        direction = -1;
         if (this.classList.contains("red-piece")) {
            direction = 1;
        }
        var vaildSpots = neighborChecker(this, direction);
        if(vaildSpots.length==0){
            state="PlayerTurn";
        }else{
        var mark = markSpots(vaildSpots);
        }
    }
    }
    
});

$("div").on("click", ".black-marked", function () {
    if (state == "clicked") {
        var sX=parseInt(startPiece.getAttribute("x"), 10)
        var sY=parseInt(startPiece.getAttribute("y"), 10)
        moveSelectedPiece(this, startPiece);
        eatPiece(this,sX,sY,startPiece.classList.contains("king"));
        if (ateFlag == 1){
        var multiArray=multiMoveCheck(startPiece);
        if (multiArray.length==0){
            ateFlag = 0;
        }
        else{
            markSpots(multiArray);
        }}
        if(ateFlag == 0){
        if(parseInt(startPiece.getAttribute("y"), 10)==0||parseInt(startPiece.getAttribute("y"), 10)==7){
            coronation(startPiece);
        }

        nextTurn();
        }
}});
$("div").on("mousedown", ".black",function () {
    if ((state == "clicked")&&(!this.classList.contains("black-marked"))) {
        $("#dialog-error").dialog("open")
    }
});
$("div").on("mousedown", ".white",function () {
    if ((state == "clicked")&&(!this.classList.contains("black-marked"))) {
        $("#dialog-error").dialog("open")
    }
});


var neighborChecker = function (currentPiece, direction) {
    var array = [];
    var currentPieceX = parseInt(currentPiece.getAttribute("x"), 10);
    var currentPieceY = parseInt(currentPiece.getAttribute("y"), 10);
    var emptyLeft = 1;
    var emptyRight = 1;
    var kingEmptyLeft = 1;
    var kingEmptyRight = 1;
    
        var pieces = document.querySelectorAll(".piece");
        pieces.forEach(function (element) {
            const temp_x = parseInt(element.getAttribute("x"), 10);
            const temp_y = parseInt(element.getAttribute("y"), 10);
            //right
            if ((temp_x == (currentPieceX + 1)) && (temp_y == (currentPieceY + direction))) {
                var canJump = 0;
                emptyRight = 0;
                if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) { }
                else {
                    canJump = 1;
                    pieces.forEach(function (piece) {
                        var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                        var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                        if ((temp_x1 == (currentPieceX + 2) && temp_y1 == (currentPieceY + 2 * direction))) {
                            canJump = 0;

                        }
                    });
                    if (canJump == 1) {
                        if((currentPieceX + 2)>=0 && (currentPieceX + 2)<=7 && (currentPieceY + 2 * direction)>=0 && (currentPieceY + 2 * direction)<=7){
                        array.push(currentPieceX + 2);
                        array.push(currentPieceY + 2 * direction);
                        canJump = 0;
                    }}
                }
                
        }
        if (currentPiece.classList.contains("king")) {
            if ((temp_x == (currentPieceX + 1)) && ((temp_y == (currentPieceY - direction)))) {
                var canJump = 0;
                kingEmptyRight = 0;
                if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) { }
                else {
                    canJump = 1;
                    pieces.forEach(function (piece) {
                        var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                        var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                        if ((temp_x1 == (currentPieceX + 2) && temp_y1 == (currentPieceY - 2 * direction))) {
                            canJump = 0;

                        }
                    });
                    if (canJump == 1) {
                        if((currentPieceX + 2)>=0 && (currentPieceX + 2)<=7 && (currentPieceY - 2 * direction)>=0 && (currentPieceY - 2 * direction)<=7){
                        array.push(currentPieceX + 2);
                        array.push(currentPieceY - 2 * direction);
                        canJump = 0;
                    }}
                }
        }
    }
            //left
            if (temp_x == (currentPieceX - 1) && temp_y == (currentPieceY + direction)) {
                var canJump = 0;
                emptyLeft = 0;
                if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) {
                } else {
                    canJump = 1;
                    pieces.forEach(function (piece) {
                        var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                        var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                        if ((temp_x1 == (currentPieceX - 2) && temp_y1 == (currentPieceY + 2 * direction))) {
                            canJump = 0;
                        }
                    });
                    if (canJump == 1) {
                        if((currentPieceX - 2)>=0 && (currentPieceX - 2)<=7 && (currentPieceY + 2 * direction)>=0 && (currentPieceY + 2 * direction)<=7){
                        array.push(currentPieceX - 2);
                        array.push(currentPieceY + 2 * direction);
                        canJump = 0;
                    }}
                }
            }
            if (currentPiece.classList.contains("king")) {
                if ((temp_x == (currentPieceX - 1)) && (temp_y == (currentPieceY - direction))) {
                    var canJump = 0;
                    kingEmptyLeft = 0;
                    if ((element.classList.contains("red-piece") && (direction == 1))|| (element.classList.contains("white-piece") && (direction == -1))) { }
                    else {
                        canJump = 1;
                        pieces.forEach(function (piece) {
                            var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                            var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                            if ((temp_x1 == (currentPieceX - 2) && temp_y1 == (currentPieceY - 2 * direction))) {
                                canJump = 0;
    
                            }
                        });
                        if (canJump == 1) {
                            if((currentPieceX - 2)>=0 && (currentPieceX - 2)<=7 && (currentPieceY - 2 * direction)>=0 && (currentPieceY - 2 * direction)<=7){
                            array.push(currentPieceX - 2);
                            array.push(currentPieceY - 2 * direction);
                            canJump = 0;
                        }}
                    }
            }
        }
        });

    
    if (emptyRight == 1&&((currentPieceX +1)>=0 && (currentPieceX + 1)<=7 && (currentPieceY +1 * direction)>=0 && (currentPieceY +1 * direction)<=7)) {
        array.push(currentPieceX + 1);
        array.push(currentPieceY + direction);
    }
    if (emptyLeft == 1&&((currentPieceX - 1)>=0 && (currentPieceX - 1)<=7 && (currentPieceY +1 * direction)>=0 && (currentPieceY +1 * direction)<=7)) {
        array.push(currentPieceX - 1);
        array.push(currentPieceY + direction);
    }
    if(currentPiece.classList.contains("king")){
        if (kingEmptyRight == 1 &&((currentPieceX +1)>=0 && (currentPieceX + 1)<=7 && (currentPieceY -1 * direction)>=0 && (currentPieceY -1 * direction)<=7)) {
            array.push(currentPieceX + 1);
            array.push(currentPieceY - direction);
        }
        if (kingEmptyLeft == 1 &&((currentPieceX - 1)>=0 && (currentPieceX - 1)<=7 && (currentPieceY -1 * direction)>=0 && (currentPieceY -1 * direction)<=7)) {
            array.push(currentPieceX - 1);
            array.push(currentPieceY - direction);
        }
    }
    return array;
}

function markSpots(array) {
    for (var index = 0; index < array.length; index += 2) {
        var spots = document.querySelectorAll(".black");
        spots.forEach(function (spot) {
            if (parseInt(spot.getAttribute("x"), 10) == parseInt(array[index], 10) && parseInt(spot.getAttribute("y"), 10) == parseInt(array[index + 1], 10)) {
                $(spot).toggleClass("black-marked");
            }
        });
    }
}

function multiMoveCheck(currentPiece){
    var array = [];
    var currentPieceX = parseInt(currentPiece.getAttribute("x"), 10);
    var currentPieceY = parseInt(currentPiece.getAttribute("y"), 10);
        var pieces = document.querySelectorAll(".piece");
        pieces.forEach(function (element) {
            const temp_x = parseInt(element.getAttribute("x"), 10);
            const temp_y = parseInt(element.getAttribute("y"), 10);
            //right
            if ((temp_x == (currentPieceX +1)) && (temp_y == (currentPieceY + direction))) {
                var canJump = 0;
                if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) { }
                else {
                    canJump = 1;
                    pieces.forEach(function (piece) {
                        var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                        var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                        if ((temp_x1 == (currentPieceX + 2) && temp_y1 == (currentPieceY + 2 * direction))) {
                            canJump = 0;

                        }
                    });
                    if (canJump == 1) {
                    if((currentPieceX + 2)>=0 && (currentPieceX + 2)<=7 && (currentPieceY + 2 * direction)>=0 && (currentPieceY + 2 * direction)<=7){
                        array.push(currentPieceX + 2);
                        array.push(currentPieceY + 2 * direction);
                        canJump = 0;
                    }}
                }
            }
            if (currentPiece.classList.contains("king")) {
                if ((temp_x == (currentPieceX + 1)) && ((temp_y == (currentPieceY - direction)))) {
                    var canJump = 0;
                    kingEmptyRight = 0;
                    if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) { }
                    else {
                        canJump = 1;
                        pieces.forEach(function (piece) {
                            var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                            var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                            if ((temp_x1 == (currentPieceX + 2) && temp_y1 == (currentPieceY - 2 * direction))) {
                                canJump = 0;
    
                            }
                        });
                        if (canJump == 1) {
                            if((currentPieceX + 2)>=0 && (currentPieceX + 2)<=7 && (currentPieceY - 2 * direction)>=0 && (currentPieceY - 2 * direction)<=7){
                            array.push(currentPieceX + 2);
                            array.push(currentPieceY - 2 * direction);
                            canJump = 0;
                        }}
                    }
            }
        }
            //left
            if (temp_x == (currentPieceX - 1) && temp_y == (currentPieceY + direction)) {
                var canJump = 0;
                if ((element.classList.contains("red-piece") && (direction == 1)) || (element.classList.contains("white-piece") && (direction == -1))) {
                } else {
                    canJump = 1;
                    pieces.forEach(function (piece) {
                        var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                        var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                        if ((temp_x1 == (currentPieceX - 2) && temp_y1 == (currentPieceY + 2 * direction))) {
                            canJump = 0;
                        }
                    });
                    if (canJump == 1) {
                        if((currentPieceX - 2)>=0 && (currentPieceX - 2)<=7 && (currentPieceY + 2 * direction)>=0 && (currentPieceY + 2 * direction)<=7){
                        array.push(currentPieceX - 2);
                        array.push(currentPieceY + 2 * direction);
                        canJump = 0;
                        }
                    }
                }
            }
            if (currentPiece.classList.contains("king")) {
                if ((temp_x == (currentPieceX - 1)) && (temp_y == (currentPieceY - direction))) {
                    var canJump = 0;
                    kingEmptyLeft = 0;
                    if ((element.classList.contains("red-piece") && (direction == 1))|| (element.classList.contains("white-piece") && (direction == -1))) { }
                    else {
                        canJump = 1;
                        pieces.forEach(function (piece) {
                            var temp_x1 = parseInt(piece.getAttribute("x"), 10);
                            var temp_y1 = parseInt(piece.getAttribute("y"), 10);
                            if ((temp_x1 == (currentPieceX - 2) && temp_y1 == (currentPieceY - 2 * direction))) {
                                canJump = 0;
    
                            }
                        });
                        if (canJump == 1) {
                            if((currentPieceX - 2)>=0 && (currentPieceX - 2)<=7 && (currentPieceY - 2 * direction)>=0 && (currentPieceY - 2 * direction)<=7){
                            array.push(currentPieceX - 2);
                            array.push(currentPieceY - 2 * direction);
                            canJump = 0;
                        }}
                    }
            }
        }
        });

return array;
}

function moveSelectedPiece(targetSpot, piece) {
    var cellSize = parseInt(80, 10);
    var targetX = parseInt(targetSpot.getAttribute("x"), 10);
    var targetY = parseInt(targetSpot.getAttribute("y"), 10);
    $(targetSpot).append(piece);
    $(piece).attr("x", targetX);
    $(piece).attr("y", targetY);
    $(".black-marked").removeClass("black-marked");
}

function nextTurn() {
    isGameOver();
    if (currentTurn == "white-piece") {
        currentTurn = "red-piece"
        $(".scoreboard").removeClass("scoreboard-whiteTurn");
        $(".scoreboard").addClass("scoreboard-redTurn");
    }
    else {
        currentTurn = "white-piece"
        $(".scoreboard").removeClass("scoreboard-redTurn");
        $(".scoreboard").addClass("scoreboard-whiteTurn");
    }
    state="PlayerTurn";
    $(".black-marked").removeClass("black-marked");

}
function endTurnButton(){
    if(state=="clicked"){
        $("#dialog-error-endTurn").dialog("open");
    }else{
        nextTurn();
    }
}

function coronation(piece){
    if(!piece.classList.contains("king")){
    $(piece).removeClass("pawn");
    $(piece).addClass("king");
    var spanCrown= document.createElement('span');
    spanCrown.innerHTML='<img src="./Files/crown.png" width="40" class="centered-img"></img>';
    $(piece).append(spanCrown);
    }
}

function eatPiece(targetSpot,sX,sY,king) {
        if((Math.abs(parseInt(targetSpot.getAttribute("y"), 10)-sY)==2)){
            if(sX<parseInt(targetSpot.getAttribute("x"))){
                var x=sX+1
            }
            else{
                var x=sX-1
            }
            var y=sY+direction;
            if (king){
            if(sY<parseInt(targetSpot.getAttribute("y"))){
                y=sY+1
            }
            else{
                y=sY-1
            }}
     
    
    var pieces = document.querySelectorAll(".piece");
        ateFlag = 0;
        pieces.forEach(function (element) {
            const temp_x = parseInt(element.getAttribute("x"), 10);
            const temp_y = parseInt(element.getAttribute("y"), 10);
            if(temp_x==x&&temp_y==y){
                element.remove();
                if(currentTurn=="white-piece"){
                    updateScore(player2Name);
                }
                else{
                    updateScore(player1Name);
                }
                ateFlag = 1;
            }
        })}

}

function isGameOver(){
    var array=[];
    if(currentTurn=="white-piece"){
    var pieces = document.querySelectorAll(".red-piece");
    pieces.forEach(function (element) {array.push.apply(array,neighborChecker(element,1))});
}
else{
    var pieces = document.querySelectorAll(".white-piece");
    pieces.forEach(function (element) {array.push.apply(array,neighborChecker(element,-1))});
}
if(array.length==0){
    if(currentTurn=="white-piece"){
    $("#winner-name").text(player2Name);
    $("#dialog-winner").dialog("open");
    }
else{
    $("#winner-name").text(player1Name);
    $("#dialog-winner").dialog("open");
}
}
}
