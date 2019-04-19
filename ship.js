const SHIP_SIZE = 30; //высота корабля
const SHIP_THRUST = 5;//ACCELERATION
const SHIP_EXPLODE_DURATION = 0.3;//время взрыва
const LASER_EXPLODE_DURATION = 0.3;//время взрыва
const SHIP_ENV_DURATION = 3;//время когда корабль неуязвим
const LASER_DISTANCE = 0.6; //дальость полёта
const SHIP_BLINK_DURATION = 0.1;//время миганий во время неуязвимости
const FRICTION = 0.7;//СОПРОТИВЛЕНИЕ
const LASER_MAX = 10; //максимальное кол-во выстрелов
const LASER_SPEED = 500; //скорость в пикселях в секунду


function newShip() {
    return {
        x: canv.width / 2,
        y: canv.height / 2,
        r: SHIP_SIZE / 2,
        a: 90 / 180 * Math.PI,
        rot: 0,
        blinkTime: Math.ceil(SHIP_BLINK_DURATION * FPS),
        blinkNumber: Math.ceil(SHIP_ENV_DURATION / SHIP_BLINK_DURATION),
        explodeTime: 0,
        canShoot: true,
        lasers: [],
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    }
}

function thrustTheShip() {
    var blinkOn = ship.blinkNumber % 2 == 0;
    var exploding = ship.explodeTime > 0;
    //thrust the ship
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;

        if (!exploding && blinkOn) {
            //draw the flame
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = SHIP_SIZE / 10;
            ctx.beginPath();
            ctx.moveTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.4 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.4 * Math.cos(ship.a))
            );

            ctx.lineTo(
                ship.x - ship.r * 4 / 3 * Math.cos(ship.a),
                ship.y + ship.r * 4 / 3 * Math.sin(ship.a)
            );

            ctx.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.4 * Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.4 * Math.cos(ship.a))
            );

            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    } else {
        ship.thrust.x -= ship.thrust.x * FRICTION / FPS;
        ship.thrust.y -= ship.thrust.y * FRICTION / FPS;
    }
}

function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DURATION * FPS);
}

function shootLaser() {
    //create laser obj
    if (ship.canShoot && ship.lasers.length < LASER_MAX) {
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPEED * Math.cos(ship.a) / FPS,
            yv: -LASER_SPEED * Math.sin(ship.a) / FPS,
            dist: 0,
            explodeTime: 0
        })
    }
    //prevent shoot
    ship.canShoot = false;
}

function moveShip() {
    var exploding = ship.explodeTime > 0;
    if (!exploding) {
        if (ship.blinkNumber == 0) {
            //check asteroids collision
            for (var i = 0; i < roids.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                    explodeShip();
                    destroyAsteroid(i);
                    break;
                }
            }
        }

        //rotateship
        ship.a += ship.rot;

        //move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    } else {
        ship.explodeTime--;
        if (ship.explodeTime == 0) {
            ship = newShip();
        }
    }

    //handle edge of scren
    if (ship.x < 0 - ship.r) {
        ship.x = canv.width + ship.r;
    } else if (ship.x > canv.width + ship.r) {
        ship.x = -ship.r;
    }

    if (ship.y < 0 - ship.r) {
        ship.y = canv.height + ship.r;
    } else if (ship.y > canv.height + ship.r) {
        ship.y = -ship.r;
    }
}

function moveLaser() {
    // move the lasers
    for (var i = ship.lasers.length - 1; i >= 0; i--) {

        // check distance travelled
        if (ship.lasers[i].dist > LASER_DISTANCE * canv.width) {
            ship.lasers.splice(i, 1);
            continue;
        }

        // handle the explosion
        if (ship.lasers[i].explodeTime > 0) {
            ship.lasers[i].explodeTime--;

            // destroy the laser after the duration is up
            if (ship.lasers[i].explodeTime == 0) {
                ship.lasers.splice(i, 1);
                continue;
            }
        } else {
            // move the laser
            ship.lasers[i].x += ship.lasers[i].xv;
            ship.lasers[i].y += ship.lasers[i].yv;

            // calculate the distance travelled
            ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
        }

        // handle edge of screen
        if (ship.lasers[i].x < 0) {
            ship.lasers[i].x = canv.width;
        } else if (ship.lasers[i].x > canv.width) {
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y < 0) {
            ship.lasers[i].y = canv.height;
        } else if (ship.lasers[i].y > canv.height) {
            ship.lasers[i].y = 0;
        }

    }
}