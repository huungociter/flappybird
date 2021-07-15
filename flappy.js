let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let audioEndGame = new Audio("endgame.mp3")
let audioAnVang = new Audio("anvang.mp3")
let audioClick = new Audio("nhay.mp3")



canvas.height = 700;
canvas.width = 530;

let sprites = new Image();
sprites.src = 'sprites.png';
let frame = 0;
let game = 'start';

//Vẽ backgroud
const bg = {
    sX: 163,
    sY: 0,
    sW: 229,
    sH: 625,
    cX: 0,
    cY: 0,
    cW: 229,
    cH: 625,
    draw: function() {
        ctx.drawImage(sprites, this.sX, this.sY, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
        ctx.drawImage(sprites, this.sX, this.sY, this.sW, this.sH, this.cX + 229, this.cY, this.cW, this.cH)
        ctx.drawImage(sprites, this.sX, this.sY, this.sW, this.sH, this.cX + 458, this.cY, this.cW, this.cH)
    }
}

//Vẽ màn hình start game
const start = {
    draw: function() {
        ctx.beginPath();
        ctx.drawImage(sprites, 1012, 0, 228, 61, canvas.width / 2 - 114, 50, 228, 61);
        ctx.drawImage(sprites, 1012, 62, 236, 64, canvas.width / 2 - 118, 200, 236, 64);
        ctx.drawImage(sprites, 855, 157, 140, 126, canvas.width / 2 - 70, 350, 140, 126);

    }
}

const end = {
    draw: function() {
        ctx.beginPath();
        ctx.drawImage(sprites, 1012, 126, 246, 54, canvas.width / 2 - 123, 200, 246, 54)
        ctx.drawImage(sprites, 624, 432, 290, 145, canvas.width / 2 - 145, 350, 290, 145)
        ctx.drawImage(sprites, 624, 578, 83, 46, canvas.width / 2 - 41.5, 500, 83, 46)
    }
}

class Bird {
    constructor(cX, cY) {
        this.cX = cX;
        this.cY = cY;
        this.animate = [840, 900, 960]
        this.sY = 0;
        this.sW = 51;
        this.sH = 36;
        this.cW = 51;
        this.cH = 36;
        this.i = 0;
        this.v = 0;
        this.a = 0.3;
    }
    draw() {
        ctx.beginPath();
        if (game == 'start') {
            if (frame % 35 == 0) {
                this.i++;
                this.i = this.i % 3;
            }
        }
        if (game == 'play') {
            if (frame % 14 == 0) {
                this.i++;
                this.i = this.i % 3;
            }
        }
        ctx.drawImage(sprites, this.animate[this.i], this.sY, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }

    update() {
        if (game == 'play' || game == 'end') {
            this.v += this.a;
            this.cY += this.v;
            if (this.cY + 18 > 625) {
                game = 'end';
                this.cY = 625 - this.cH / 2;
                this.v = 0;
                audioEndGame.play();
            }
            // Kiểm tra va chạm với đường ống
            if (
                this.cX + this.cW > arrPipes[score.value].cX &&
                this.cX < arrPipes[score.value].cX + arrPipes[score.value].cW &&
                (
                    this.cY < arrPipes[score.value].cY + arrPipes[score.value].cH ||
                    this.cY + this.cH > arrPipes[score.value].cY + arrPipes[score.value].cH + arrPipes[score.value].space
                )
            ) {
                game = 'end';
                audioEndGame.play();

            }

            // Trường hợp ăn điểm
            if (this.cX == arrPipes[score.value].cX + 82 || this.cX == arrPipes[score.value].cX + 81) {
                score.value++;
                audioAnVang.play();
                maxScore.value = Math.max(maxScore.value, score.value)
            }
        }
    }
}

class Medal {
    constructor(i) {
        this.sX = 80;
        this.sY = [0, 58, 114];
        this.sW = 53;
        this.sH = 54;
        this.cX = canvas.width / 2 - 97;
        this.cY = 407;
        this.cW = 53;
        this.cH = 54;
        this.i = i; // 0 là bạc, 1 là vàng, 2 là k có gì
    }

    draw() {
        ctx.beginPath();
        ctx.drawImage(sprites, this.sX, this.sY[this.i], this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }

    update() {
        if (score.value == 0) {
            this.i = 2; // Nếu điểm = 0 thì không vẽ gì 
            return;
        }

        if (score.value == maxScore.value) {
            this.i = 1; // Nếu điểm người chơi = maxScore thì vẽ huy hiệu vàng
        } else if (score.value >= maxScore.value / 2 && score.value < maxScore.value) {
            this.i = 0; // Nếu điểm > 1/2 maxScore và < maxScore thì vẽ huy hiệu bạc
        } else {
            this.i = 2; // Còn lại không vẽ gì cả
        }
    }
}

let medal = new Medal(0)

class Ground {
    constructor(cX, cY) {
        this.cX = cX;
        this.cY = cY;
        this.sX = 624;
        this.sY = 0;
        this.sW = 215;
        this.sH = 143;
        this.cW = 215;
        this.cH = 143;
        this.dx = -2;
    }
    draw() {
        ctx.beginPath();
        ctx.drawImage(sprites, this.sX, this.sY, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }
}


let arrGround = [];
let bird = new Bird(150, canvas.height / 2 - 12)
for (let i = 0; i < 4; i++) {
    let ground = new Ground(215 * i, 625);
    arrGround.push(ground)
}


function drawArrGround() {
    arrGround.forEach(ground => {
        ground.draw()
    })
}

function updateArrGround() {
    arrGround.forEach(ground => {
        ground.cX += ground.dx;
    })

    if (arrGround[0].cX <= -336) {
        arrGround.splice(0, 1);
        let ground = new Ground(arrGround[2].cX + 215, 625)
        arrGround.push(ground)
    }
}


function update() {
    if (game == 'play') {
        updateArrGround();
        updateArrPipes();
        bird.cX = 100;
    }
    bird.update();
    medal.update();
}

const arrNumber = [
    { name: 0, sX: 1013, sY: 181, sW: 52, sH: 80, cW: 52, cH: 80 },
    { name: 1, sX: 1080, sY: 181, sW: 32, sH: 80, cW: 32, cH: 80 },
    { name: 2, sX: 1127, sY: 181, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 3, sX: 1184, sY: 181, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 4, sX: 1013, sY: 265, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 5, sX: 1070, sY: 265, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 6, sX: 1127, sY: 265, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 7, sX: 1184, sY: 265, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 8, sX: 1013, sY: 349, sW: 52, sH: 79, cW: 52, cH: 79 },
    { name: 9, sX: 1070, sY: 349, sW: 52, sH: 79, cW: 52, cH: 79 }
]


function random(min, max) {
    return Math.ceil(Math.random() * (max - min) + min)
}

class Score {
    constructor(value, cX, cY) {
        this.value = value;
        this.cX = cX;
        this.cY = cY;
    }
    draw() {
        if (this.value >= 10) {
            this.split = (this.value.toString()).split('');
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, canvas.width / 2 - 52, 60, number.cW, number.cH)
                }
                if (this.split[1] == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, canvas.width / 2 + 2, 60, number.cW, number.cH)
                }

            })
        } else {
            arrNumber.forEach(number => {
                if (this.value == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, canvas.width / 2 - 26, 60, number.cW, number.cH);
                }
            })

        }
    }
    drawSmall() {
        ctx.beginPath();
        if (this.value >= 10) {
            this.split = (this.value.toString()).split('');
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, this.cX, this.cY, number.cW / 3, number.cH / 3);
                }
                if (this.split[1] == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, this.cX + 18, this.cY, number.cW / 3, number.cH / 3);
                }
            })
        } else {
            this.split = this.value.toString();
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprites, number.sX, number.sY, number.sW, number.sH, this.cX + 18, this.cY, number.cW / 3, number.cH / 3);
                }
            })
        }
    }
}

let score = new Score(0, 330, 391);
let maxScore = new Score(0, 330, 443);
class Pipes {
    constructor(cX, cY, space) {
        this.cX = cX;
        this.cY = cY;
        this.cW = 82;
        this.cH = 710;
        this.space = space;
        this.sXt = 0;
        this.sYt = 0;
        this.sXb = 1261;
        this.sYb = 0;
        this.sW = 82;
        this.sH = 710;
        this.dx = -2;
    }
    draw() {
        ctx.beginPath();
        ctx.drawImage(sprites, this.sXt, this.sYt, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH);
        ctx.drawImage(sprites, this.sXb, this.sYb, this.sW, this.sH, this.cX, this.cY + this.space + this.sH, this.cW, this.cH)
    }
}

let arrPipes = [];

function newPipes() {
    for (let i = 1; i < 4; i++) {
        let pipes = new Pipes(random(530, 600) * i, random(-660, -300), 200);
        arrPipes.push(pipes);
    }
}

newPipes();

function drawArrPipes() {
    arrPipes.forEach(pipes => {
        pipes.draw();
    })

    if (arrPipes[0].cX <= -82) {
        arrPipes.slice(0, 1);
        if (score.value < 20) {
            let pipes = new Pipes(arrPipes[arrPipes.length - 1].cX + random(400, 500), random(-660, -300), random(150, 200));
            arrPipes.push(pipes);
        }
        if (score.value > 20 && score.value < 50) {
            let pipes = new Pipes(arrPipes[arrPipes.length - 1].cX + random(400, 500), random(-660, -400), random(100, 180));
            arrPipes.push(pipes);
        }
        if (score.value > 50) {
            let pipes = new Pipes(arrPipes[arrPipes.length - 1].cX + random(400, 500), random(-660, -300), random(80, 100));
            arrPipes.push(pipes);
        }


    }
}

function updateArrPipes() {

    arrPipes.forEach(pipes => {
        pipes.cX += pipes.dx;
    })

}
canvas.addEventListener('click', function(event) {
    switch (game) {
        case 'start':
            game = 'play';
            break
        case 'play':
            console.log('Chơi game');
            audioClick.play();
            bird.v = -7;
            break
        case 'end':
            console.log('End game');
            if (
                event.offsetX > canvas.width / 2 - 41.5 && // Điều kiện trái
                event.offsetX < canvas.width / 2 + 41.5 && // Điều kiện phải
                event.offsetY > 500 && // Điều kiện trên
                event.offsetY < 546 // Điều kiện dưới
            ) {
                score.value = 0; // Reset điểm về 0
                arrPipes = []; // Làm rỗng mảng arrPipes để render mảng mới
                newPipes();
                bird.v = 0; // Reset vận tốc của bird
                bird.cY = canvas.height / 2 - 12; // Đặt lại vị trí của bird
                bird.cX = 150;
                game = 'start';
            }
            break
    }
})

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 32) {
        switch (game) {
            case 'start':
                game = 'play';
                break;
            case 'play':
                console.log('Chơi game');
                audioClick.play();
                bird.v = -7;
                break;
            case 'end':
                console.log('End game');
                score.value = 0; // Reset điểm về 0
                arrPipes = []; // Làm rỗng mảng arrPipes để render mảng mới
                newPipes();
                bird.v = 0; // Reset vận tốc của bird
                bird.cY = canvas.height / 2 - 12; // Đặt lại vị trí của bird
                game = 'start';
                break;
        }
    }
})

function draw() {
    bg.draw();
    if (game == 'start') {
        start.draw();
    }
    if (game == 'play') {
        score.draw();
    }
    drawArrPipes();
    if (game == 'end') {
        end.draw();
        bird.cX = 180;
        score.drawSmall();
        maxScore.drawSmall();
        medal.draw();
    }
    drawArrGround();
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    draw();
    bird.draw();
    update();

}

animate();