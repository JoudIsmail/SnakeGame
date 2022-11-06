  /* global Object */
  const snakeGame = {
    "food": null,
    "snakeHead": null,
    "snakeHeadX": null,
    "snakeHeadY": null,
    "speed": null,
    "snakeBodyX": null,
    "snakeBodyY": null,
    "radius": 7,
    "w": Math.PI,
    "t": null,
    "snakeDeque": null
}
//let food = null, snakeHead = null, snakeHeadX = null, snakeHeadY = null;
let singleGeometry = new THREE.BoxGeometry();
snakeGame.speed = new THREE.Vector3(0, 0, 0);

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setClearColor('rgb(255,255,255)');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
camera.position.set(7, -7, 18);
scene.add(camera);

camera.lookAt(scene.position);
scene.add(new THREE.AxesHelper(1.5));

// * Render loop
const controls = new THREE.TrackballControls(camera, renderer.domElement);
const clock = new THREE.Clock();


// Creating plane 
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
        color: 0x808080,
        side: THREE.DoubleSide
    })
);
scene.add(plane);

// Creating Grid
const grid = new THREE.GridHelper(10, 10, new THREE.Color(0xffffff), new THREE.Color(0xffffff));
grid.rotateX(Math.PI / 2);
scene.add(grid);

// creating snakeHead
function getSnake() {
    const snake = new THREE.Mesh(
        new THREE.BoxGeometry(.95, .95, 1),
        new THREE.MeshBasicMaterial({
            color: 0x006400,
        })
    );
    snake.position.set(getRandomIndex(), getRandomIndex(), .51);
    return snake;
}
snakeGame.snakeHead = getSnake();
scene.add(snakeGame.snakeHead);

// add snakeBody
function createSnakeBody() {
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(.95, .95, 1),
        new THREE.MeshBasicMaterial({
            color: 0x0000ff,
        })
    );
    return body;
}

// create food sphere
function createFood(){
    const food = new THREE.Mesh(
        new THREE.SphereGeometry(.5, 50, 50),
        new THREE.MeshBasicMaterial({
          color: 0xff0000
        })
      );
      food.position.set(getRandomIndex(), getRandomIndex(), .51);
      return food;
}

snakeGame.food = createFood();
scene.add(snakeGame.food);
function generateFood(){
    let eatingAudio = new Audio("sound2.wav");
    if((snakeGame.snakeHead.position.x == snakeGame.food.position.x)&&(snakeGame.snakeHead.position.y == snakeGame.food.position.y)){
        eatingAudio.play();
        if(snakeGame.snakeDeque.isEmpty()){
            snakeGame.snakeHeadX = snakeGame.snakeHead.position.x;
            snakeGame.snakeHeadY = snakeGame.snakeHead.position.y;
        }else{
            snakeGame.snakeHeadX = snakeGame.snakeDeque.getBack().position.x;
            snakeGame.snakeHeadY = snakeGame.snakeDeque.getBack().position.y;
        }
        snakeGame.snakeDeque.insertBack(createSnakeBody());
        snakeGame.snakeDeque.getBack().position.set(snakeGame.snakeHeadX - snakeGame.speed.x, snakeGame.snakeHeadY - snakeGame.speed.y, .51);
        scene.add( snakeGame.snakeDeque.getBack());
        snakeGame.food.position.set(getRandomIndex(), getRandomIndex(), .51);
    }

    for(var i = 0 ; i < snakeGame.snakeDeque.size(); i++){
        X = snakeGame.snakeDeque.getValues()[i].position.x;
        Y = snakeGame.snakeDeque.getValues()[i].position.y;
        if( (( snakeGame.snakeDeque.getValues()[i].position.x == snakeGame.food.position.x) && ( snakeGame.snakeDeque.getValues()[i].position.y == snakeGame.food.position.y)) ){
            snakeGame.food.position.set(getRandomIndex(), getRandomIndex(), .51);
          scene.add(snakeGame.food);
        }
  }
}

function gameOver(){
    let gameOverAudio = new Audio("sound1.wav");
    if((snakeGame.snakeHead.position.x > 4.5)||(snakeGame.snakeHead.position.x< -4.5)||(snakeGame.snakeHead.position.y>4.5)||(snakeGame.snakeHead.position.y<-4.5)){
        clearInterval(moving);
        gameOverAudio.play();
        alert("Game Over \n\nYour score: " + snakeGame.snakeDeque.size());
        return;
    }
    for(let i = 2 ; i<snakeGame.snakeDeque.size(); i++){

        snakeGame.snakeBodyX = snakeGame.snakeDeque.getValues()[i].position.x;
        snakeGame.snakeBodyY = snakeGame.snakeDeque.getValues()[i].position.y;
        if(((snakeGame.snakeBodyX == snakeGame.snakeHead.position.x) && ( snakeGame.snakeBodyY == snakeGame.snakeHead.position.y))){
            clearInterval(moving);
            gameOverAudio.play();
          alert("Game Over \n\nYour score: " + snakeGame.snakeDeque.size());
          return;
        }
    }
}

// initialize the deque
snakeGame.snakeDeque = new Deque();
function render() {
    requestAnimationFrame(render);
    snakeGame.t = clock.getElapsedTime();
    camera.position.x = snakeGame.radius * Math.cos(snakeGame.w * snakeGame.t);
    camera.position.y = snakeGame.radius * Math.sin(snakeGame.w * snakeGame.t);
    renderer.render(scene, camera);
    controls.update();
}
render();


// listen to key input
document.addEventListener("keydown", onDocumentKeyDown, false);
// function to move the snake
function onDocumentKeyDown(event) {
    var input = event.key;
    if (!snakeGame.snakeDeque.isEmpty()) {
        if (input === "ArrowDown" && snakeGame.snakeDeque.getFront().position.y != (snakeGame.snakeHead.position.y - 1)) {
            snakeGame.speed.y = -1;
            snakeGame.speed.x = 0;
        }
        if (input === "ArrowUp" && snakeGame.snakeDeque.getFront().position.y != (snakeGame.snakeHead.position.y + 1)) {
            snakeGame.speed.y = 1;
            snakeGame.speed.x = 0;
        }
        if (input === "ArrowLeft" && snakeGame.snakeDeque.getFront().position.x != (snakeGame.snakeHead.position.x - 1)) {
            snakeGame.speed.x = - 1;
            snakeGame.speed.y = 0;
        }
        if(input === "ArrowRight" && snakeGame.snakeDeque.getFront().position.x != (snakeGame.snakeHead.position.x + 1)){
            snakeGame.speed.x = 1;
            snakeGame.speed.y = 0;
        }
    } else {
        switch (input) {
            case "ArrowDown":
                snakeGame.speed.y = -1;
                snakeGame.speed.x = 0;
                break;
            case "ArrowUp":
                snakeGame.speed.y = 1;
                snakeGame.speed.x = 0;
                break;
            case "ArrowLeft":
                snakeGame.speed.x = -1;
                snakeGame.speed.y = 0;
                break;
            case "ArrowRight":
                snakeGame.speed.x = 1;
                snakeGame.speed.y = 0;
                break;
        }
    }
}

// moving the snake
function move(){
    snakeGame.snakeHeadX = snakeGame.snakeHead.position.x;
    snakeGame.snakeHeadY = snakeGame.snakeHead.position.y;
    snakeGame.snakeHead.position.set(snakeGame.snakeHeadX + snakeGame.speed.x, snakeGame.snakeHeadY + snakeGame.speed.y, .51);
    snakeGame.snakeDeque.insertFront(createSnakeBody());
    snakeGame.snakeDeque.getFront().position.set(snakeGame.snakeHeadX , snakeGame.snakeHeadY ,0.51);
    scene.add( snakeGame.snakeDeque.getFront() );
    scene.remove(snakeGame.snakeDeque.getBack());
    snakeGame.snakeDeque.removeBack();
    generateFood();
    gameOver();
}

const moving = setInterval(move,250);


// return random number in range between -4.5 and 4.5
function getRandomIndex() {
    var random = Math.floor(Math.random() * 10) - 4.5;
    if (random == 0) return random * -1;
    return random;
  }


// * Deque: https://learnersbucket.com/tutorials/data-structures/implement-deque-data-structure-in-javascript/

function Deque() {
    //To track the elements from back
    let count = 0;

    //To track the elements from the front
    let lowestCount = 0;

    //To store the data
    let items = {};
    this.getValues = () => { return Object.values(items); };

    //Add an item on the front
    this.insertFront = (elm) => {

        if (this.isEmpty()) {
            //If empty then add on the back
            this.insertBack(elm);

        } else if (lowestCount > 0) {
            //Else if there is item on the back
            //then add to its front
            items[--lowestCount] = elm;

        } else {
            //Else shift the existing items
            //and add the new to the front
            for (let i = count; i > 0; i--) {
                items[i] = items[i - 1];
            }

            count++;
            items[0] = elm;
        }
    };

    //Add an item on the back of the list
    this.insertBack = (elm) => {
        items[count++] = elm;
    };

    //Remove the item from the front
    this.removeFront = () => {
        //if empty return null
        if (this.isEmpty()) {
            return null;
        }

        //Get the first item and return it
        const result = items[lowestCount];
        delete items[lowestCount];
        lowestCount++;
        return result;
    };

    //Remove the item from the back
    this.removeBack = () => {
        //if empty return null
        if (this.isEmpty()) {
            return null;
        }

        //Get the last item and return it
        count--;
        const result = items[count];
        delete items[count];
        return result;
    };

    //Peek the first element
    this.getFront = () => {
        //If empty then return null
        if (this.isEmpty()) {
            return null;
        }

        //Return first element
        return items[lowestCount];
    };

    //Peek the last element
    this.getBack = () => {
        //If empty then return null
        if (this.isEmpty()) {
            return null;
        }

        //Return first element
        return items[count - 1];
    };

    //Check if empty
    this.isEmpty = () => {
        return this.size() === 0;
    };

    //Get the size
    this.size = () => {
        return count - lowestCount;
    };

    //Clear the deque
    this.clear = () => {
        count = 0;
        lowestCount = 0;
        items = {};
    };

    //Convert to the string
    //From front to back
    this.toString = () => {
        if (this.isEmpty()) {
            return '';
        }
        let objString = `${items[lowestCount]}`;
        for (let i = lowestCount + 1; i < count; i++) {
            objString = `${objString},${items[i]}`;
        }
        return objString;
    };
}