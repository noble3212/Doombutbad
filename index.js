class Demon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
        this.speed = 0.02;
        this.direction = Math.random() * 2 * Math.PI; // Random initial direction
    }

    move() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    changeDirection() {
        this.direction += (Math.random() - 0.5) * Math.PI / 4; // Randomly change direction
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Logic for when the demon dies (e.g., remove from game)
    }
}

const demons = [];

function spawnDemon(x, y) {
    const demon = new Demon(x, y);
    demons.push(demon);
}

function updateDemons() {
    demons.forEach(demon => {
        demon.move();
        demon.changeDirection();
    });
}

export { Demon, spawnDemon, updateDemons, demons };
