const TURN_SPEED = 360; //deg per sec
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    switch (e.keyCode) {
        case 37://left
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 32://space bar
            shootLaser();
            break;
        case 38://up
            ship.thrusting = true;

            break;
        case 39://right
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            break
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 32://spac
            ship.canShoot = true;
            break;
        case 37://left
            ship.rot = 0;
            break;
        case 38://up
            ship.thrusting = false;
            break;
        case 39://right
            ship.rot = 0;
            break;
    }
}