const scene = document.getElementById('scene');

const sceneWidth = scene.clientWidth;
const sceneHeight = scene.clientHeight;

function animate(opt) {
    const start = performance.now();
  
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / opt.duration;
        if (timeFraction > 1) timeFraction = 1;

        const progress = opt.timing(timeFraction);        
        opt.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

function makeEaseOut(timing) {
    return function(timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}

function bounce(timeFraction) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
        }
    }
}

function quad(timeFraction) {
    return Math.pow(timeFraction, 2);
}

function clearBall(identifier) {
    document.querySelector(`.ball-scene-${ identifier }`).remove();
}

scene.addEventListener('click', (event) => {
    let id = Date.now();
    // random speed
    const speed = Math.floor(Math.random() * 4000) + 800;
    // starting coordinates
    let posX = event.offsetX - 10;
    let posY = event.offsetY - 10;
    // add new ball
    let ballScene = document.createElement('div');
        ballScene.classList = `ball-scene ball-scene-${ id }`;
        ballScene.style.width = `${ sceneWidth - posX }px`;
        ballScene.style.height = `${ sceneHeight - posY }px`;

    scene.append(ballScene);

    let ball = document.createElement('div');
        ball.classList = `bouncy-ball ball-${ id }`;

    ballScene.append(ball);
    
    // animate current ball
    const cBall = document.querySelector(`.ball-${ id }`);

    animate({
        duration: speed,
        timing: makeEaseOut(bounce),
        draw: function(progress) {
            cBall.style.top = ((sceneHeight - posY) - 17) * progress + 'px';
        }
    });

    animate({
        duration: speed,
        timing: makeEaseOut(quad),
        draw: function(progress) {
            cBall.style.left = (sceneWidth - posX) * progress + 'px';
            (progress ==  1) ? clearBall(id) : null;
        }
    });

});