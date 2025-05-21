const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const w = canvas.width, h = canvas.height;

const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const demons = [];
const mapW = map[0].length, mapH = map.length;
let posX = 3.5, posY = 3.5, dir = 0; // Player position and direction

class Demon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 0.02;
    }

    moveTowardsPlayer(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x * 40, this.y * 40, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnDemons() {
    demons.push(new Demon(5, 5));
    demons.push(new Demon(2, 2));
}

function render() {
    ctx.clearRect(0, 0, w, h);
    for (let x = 0; x < w; x++) {
        const cameraX = 2 * x / w - 1;
        const rayDir = dir + cameraX * Math.PI / 4;
        let rayX = Math.cos(rayDir), rayY = Math.sin(rayDir);
        let mapX = Math.floor(posX), mapY = Math.floor(posY);
        let sideDistX, sideDistY;
        const deltaDistX = Math.abs(1 / rayX);
        const deltaDistY = Math.abs(1 / rayY);
        let stepX, stepY;
        let hit = 0, side;
        if (rayX < 0) { stepX = -1; sideDistX = (posX - mapX) * deltaDistX; }
        else { stepX = 1; sideDistX = (mapX + 1.0 - posX) * deltaDistX; }
        if (rayY < 0) { stepY = -1; sideDistY = (posY - mapY) * deltaDistY; }
        else { stepY = 1; sideDistY = (mapY + 1.0 - posY) * deltaDistY; }
        while (!hit) {
            if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
            else { sideDistY += deltaDistY; mapY += stepY; side = 1; }
            if (map[mapY][mapX] > 0) hit = 1;
        }
        let perpWallDist;
        if (side === 0) perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayX;
        else perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayY;
        const lineHeight = Math.floor(h / perpWallDist);
        const drawStart = Math.max(0, -lineHeight / 2 + h / 2);
        const drawEnd = Math.min(h, lineHeight / 2 + h / 2);
        ctx.strokeStyle = side ? "#888" : "#fff";
        ctx.beginPath();
        ctx.moveTo(x, drawStart);
        ctx.lineTo(x, drawEnd);
        ctx.stroke();
    }

    demons.forEach(demon => {
        demon.moveTowardsPlayer(posX, posY);
        demon.draw();
    });
}

function move(forward, turn) {
    dir += turn;
    const moveX = Math.cos(dir) * forward;
    const moveY = Math.sin(dir) * forward;
    if (map[Math.floor(posY)][Math.floor(posX + moveX)] === 0) posX += moveX;
    if (map[Math.floor(posY + moveY)][Math.floor(posX)] === 0) posY += moveY;
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') move(0.1, 0);
    if (e.key === 'ArrowDown') move(-0.1, 0);
    if (e.key === 'ArrowLeft') move(0, -0.1);
    if (e.key === 'ArrowRight') move(0, 0.1);
});

function loop() {
    render();
    requestAnimationFrame(loop);
}

spawnDemons();
loop();
