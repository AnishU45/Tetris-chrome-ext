// const canvas = document.getElementById("tetris");
// const ctx = canvas.getContext("2d");
// //ctx.scale(20,20);
// ctx.beginPath();
// ctx.arc(20,20,10,0,2*Math.PI);
// ctx.stroke;


document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-btn");
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colours = [
        'Red',
        'Orange',
        'Green',
        'Blue',
        'Purple'
    ]

    const ltetromino =[
        [1,width+1,width*2+1,2],
        [width,width+1,width+2,width*2+2],
        [1,width+1,width*2+1,width*2],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

    const tetrominos = [ltetromino,zTetromino,tTetromino,oTetromino,iTetromino];

    let currentPosition = 3;
    let currentRotation = 0;

    let random = Math.floor(Math.random()*tetrominos.length)
    let current = tetrominos[random][currentRotation];

    function draw() {
        current.forEach(index =>{
            squares[currentPosition+index].classList.add("tetromino");
            squares[currentPosition+index].style.backgroundColor = colours[random];
        })
    }

    function undraw(){
        current.forEach(index => {
            squares[currentPosition+index].classList.remove("tetromino")
            squares[currentPosition+index].style.backgroundColor = '';
        })
    }

    
    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }
        else if(e.keyCode === 38){
            rotate();
        }
        else if(e.keyCode === 39){
            moveRight();
        }
        else if(e.keyCode === 40){
            moveDown();
        }
        
    }

    document.addEventListener('keyup', control)


    //  timerId = setInterval(moveDown,750);

    function moveDown(){
        undraw()
        currentPosition+=width;
        draw();
        freeze();
    }

    function freeze(){
        if(current.some(index  => squares[currentPosition+index+width].classList.contains("taken"))){
            current.forEach(index => squares[currentPosition +index].classList.add("taken"))
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*tetrominos.length)
            current = tetrominos[random][currentRotation];
            currentPosition = 3;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft(){

        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition+index)%width === 0);

        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            currentPosition += 1;
        }

        draw();
    }

    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index=>(currentPosition+index)%width === width-1);

        if(!isAtRightEdge) currentPosition +=1;

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
            currentPosition -=1;
        }

        draw();
    }

    function rotate(){
         undraw();
         currentRotation++;
         if(currentRotation === current.length){
            currentRotation = 0;
         }
         current = tetrominos[random][currentRotation];
         draw();
    }

    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 5;

    const displayIndex = 0;

    const upNextTetrimino = [
        [displayWidth+2,displayWidth*2+2,displayWidth*3+2,displayWidth+3], //ltetremino
        [displayWidth+1,displayWidth*2+1,displayWidth*2+2,displayWidth*3+2],// ztetremino
        [displayWidth+2,displayWidth*2+1,displayWidth*2+2,displayWidth*2+3], // ttetermino
        [displayWidth+1,displayWidth+2,displayWidth*2+1,displayWidth*2+2], // otetermino
        [2,displayWidth+2,displayWidth*2+2,displayWidth*3+2] // itetermino
    ]

    function displayShape(){
        displaySquares.forEach(square =>{
            square.classList.remove("tetromino")
            square.style.backgroundColor = '';
        })
        upNextTetrimino[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add("tetromino")
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom];
        })
    }

    startBtn.addEventListener('click' , () => {
        if(timerId){
            clearInterval(timerId);
            timerId = null;
        }
        else{
            draw();
            timerId = setInterval(moveDown, 750);
            nextRandom = Math.floor(Math.random()*tetrominos.length);
            displayShape();
        }
    })

    function addScore(){
        for(let i=0;i<199;i+= width){
            const row = [ i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');  
                    squares[index].style.backgroundColor = '';
                })
                const squareRemoved = squares.splice(i,width);
                squares = squareRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            scoreDisplay.innerHTML = "GAME OVER😢";
            clearInterval(timerId);
        }
    }

});

