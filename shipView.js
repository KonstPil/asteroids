function drawShip() {
    var blinkOn = ship.blinkNumber % 2 == 0;
    var exploding = ship.explodeTime > 0;
    if (!exploding) {
        if (blinkOn) {
            //draw ship
            ctx.strokeStyle = 'white';
            ctx.lineWidth = SHIP_SIZE / 20;
            ctx.beginPath();
            ctx.moveTo(
                ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
            );

            ctx.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
            );

            ctx.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
            );

            ctx.closePath();
            ctx.stroke();
        }
        //handle blinking


        if (ship.blinkNumber > 0) {
            ship.blinkTime--;
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DURATION * FPS);
                ship.blinkNumber--;
            }
        }
    } else {
        var grd = ctx.createRadialGradient(ship.x, ship.y, 0, ship.x, ship.y, ship.r * 1.5);
        grd.addColorStop(0, "white");
        grd.addColorStop(0.2, "yellow");
        grd.addColorStop(0.5, "orange");
        grd.addColorStop(0.8, "red");
        grd.addColorStop(1, "darkred");

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false);
        ctx.fill();
    }

    if (SHOW_BOUNDING) {
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }
}

function drawLasers() {
    for (var i = 0; i < ship.lasers.length; i++) {
        if(ship.lasers[i].explodeTime == 0) {
            ctx.fillStyle = 'salmon';
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
            ctx.fill();
        } else {
            //draw The Explosions
            var grd = ctx.createRadialGradient(ship.lasers[i].x, ship.lasers[i].y, 0, ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75);
            grd.addColorStop(0, "white");
            grd.addColorStop(0.2, "yellow");
            grd.addColorStop(0.5, "orange");
            grd.addColorStop(0.8, "red");
            grd.addColorStop(1, "darkred");

            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }
}