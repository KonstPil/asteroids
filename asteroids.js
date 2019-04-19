const ROIDS_NUM = 3; //start num
const ROIDS_JUG = 0.4; //неровности(0-отсутствие. 1 много)
const ROIDS_SIZE = 100;//start size
const ROIDS_SPD = 50;//SPEED
const ROIDS_VERT = 10;//vertices


function createAsteroidBelt() {
    roids = [];
    var x, y;
    for (var i = 0; i < ROIDS_NUM; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/2)));
    }
    return roids;
}

function destroyAsteroid(index){
    var x = roids[index].x;
    var y = roids[index].y;
    var r = roids[index].r;

    //split in two
    if(r == Math.ceil(ROIDS_SIZE/2)){
        roids.push(newAsteroid(x, y, ROIDS_SIZE/4));
        roids.push(newAsteroid(x, y, ROIDS_SIZE/4));
    } else if(r == Math.ceil(ROIDS_SIZE/4)){
        roids.push(newAsteroid(x, y, ROIDS_SIZE/8));
        roids.push(newAsteroid(x, y, ROIDS_SIZE/8));
    }

    roids.splice(index,1);
}
function newAsteroid(x, y, r) {
    var roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPD / FPS * (Math.random() > 0.5 ? 1 : -1),
        xy: Math.random() * ROIDS_SPD / FPS * (Math.random() > 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2,//in radians
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
        offs: []
    };
    // создаем массив неровностей
    for (var i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * ROIDS_JUG * 2 + 1 - ROIDS_JUG);
    }
    return roid;
}

function drawAsteroids() {
    var x, y, r, a, vert, offs;
    for (var i = 0; i < roids.length; i++) {
        //draw asteroids
        ctx.strokeStyle = 'red';
        ctx.lineWidth = SHIP_SIZE / 20;
        //get the asteroids propert
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;
        offs = roids[i].offs;

        //draw a path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );
        //draw the polygon
        for (var j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            )
        }
        ctx.closePath();
        ctx.stroke();

        if (SHOW_BOUNDING) {
            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.arc(roids[i].x, roids[i].y, roids[i].r, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }
}

function moveAsteroids(){
    for (var i = 0; i < roids.length; i++) {
        //move the asteroids
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].xy;
        //handle edge of screen
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = canv.width + roids[i].r;
        } else if (roids[i].x > canv.width + roids[i].r) {
            roids[i].x = -roids[i].r;
        }

        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canv.height + roids[i].r;
        } else if (roids[i].y > canv.height + roids[i].r) {
            roids[i].y = -roids[i].r;
        }
    }
}