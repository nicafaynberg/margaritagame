let objects = [];
let smashed = [];
let backgroundImg;
let hammerCursor;
let score = 0;
let assetsLoaded = 0;
const totalAssets = 6;

let vaseImg, lampImg, candlesImg, pianoImg;
let gameState = "playing";
let playAgainButton;

function preload() {
    console.log("Starting asset loading...");
    backgroundImg = loadImage('apartment.png', assetLoaded);
    hammerCursor = loadImage('hammer.png', assetLoaded);

    vaseImg = loadImage('vase_nobg.png', assetLoaded);
    lampImg = loadImage('lamp_nobg.png', assetLoaded);
    candlesImg = loadImage('candles_nobg.png', assetLoaded);
    pianoImg = loadImage('piano_nobg.png', assetLoaded);
}

function assetLoaded() {
    assetsLoaded++;
    console.log(`Asset loaded. Current count: ${assetsLoaded}/${totalAssets}`);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noCursor();

    resetGame();

    // Create the "Play Again" button (hidden initially)
    playAgainButton = createButton("Еще раз");
    playAgainButton.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
    playAgainButton.style("font-size", "16px");
    playAgainButton.style("padding", "10px 20px");
    playAgainButton.style("background-color", "#28a745");
    playAgainButton.style("color", "#fff");
    playAgainButton.style("border", "none");
    playAgainButton.style("border-radius", "5px");
    playAgainButton.hide();

    playAgainButton.mousePressed(() => {
        resetGame();
        gameState = "playing";
        playAgainButton.hide();
        document.getElementById("instructions").style.visibility = "visible";
        loop();
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetGame(); // Recalculate object positions for new dimensions
}

function resetGame() {
    objects = [];
    smashed = [];
    score = 0;

    const scale = min(windowWidth / 800, windowHeight / 600); // Dynamic scaling factor

    objects.push({ img: vaseImg, x: 150 * scale, y: 200 * scale, w: 120 * scale, h: 120 * scale, points: 10 });
    objects.push({ img: lampImg, x: 400 * scale, y: 300 * scale, w: 60 * scale, h: 100 * scale, points: 15 });
    objects.push({ img: candlesImg, x: 600 * scale, y: 100 * scale, w: 140 * scale, h: 180 * scale, points: 20 });

    // Ensure only one piano
    objects.push({ img: pianoImg, x: 600 * scale, y: 300 * scale, w: 200 * scale, h: 200 * scale, points: 50 });

    for (let i = 0; i < 5; i++) objects.push(generateObject(vaseImg, 10, scale));
    for (let i = 0; i < 3; i++) objects.push(generateObject(lampImg, 15, scale));
    for (let i = 0; i < 7; i++) objects.push(generateObject(candlesImg, 20, scale));
}

function generateObject(img, points, scale) {
    let x, y, overlap;
    do {
        x = random(50 * scale, windowWidth - 150 * scale);
        y = random(50 * scale, windowHeight - 200 * scale);
        overlap = objects.some(obj => dist(obj.x, obj.y, x, y) < 100 * scale);
    } while (overlap);
    return { img, x, y, w: 100 * scale, h: 100 * scale, points }; // Scaled dimensions
}

function draw() {
    if (assetsLoaded < totalAssets) {
        // Loading screen
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(`Loading... ${Math.round((assetsLoaded / totalAssets) * 100)}%`, width / 2, height / 2);
        return;
    }

    if (gameState === "game over") {
        // Hide top instructions
        document.getElementById("instructions").style.visibility = "hidden";

        // Game over screen
        background(0);
        fill(0, 0, 255); // Blue text color
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Невидима и свободна!", width / 2, height / 2 - 20);
        noLoop();

        // Show the "Play Again" button
        playAgainButton.show();
        return;
    }

    if (gameState === "playing") {
        // Draw background
        imageMode(CORNER);
        image(backgroundImg, 0, 0, width, height); // Ensure it fills the canvas

        // Draw objects
        imageMode(CENTER); // Ensure objects maintain their aspect ratio
        for (let obj of objects) {
            if (!smashed.includes(obj)) {
                image(obj.img, obj.x, obj.y, obj.w, obj.h);
            }
        }

        // Check if all objects are smashed
        if (smashed.length === objects.length) gameState = "game over";

        // Draw score
        fill(255);
        textSize(24);
        text(`Score: ${score}`, 20, 40);

        // Draw custom cursor
        imageMode(CORNER);
        image(hammerCursor, mouseX - 15, mouseY - 15, 130, 130); // Adjust size for mobile
    }
}

function mousePressed() {
    if (gameState === "playing") {
        handleSmash(mouseX, mouseY);
    }
}

function touchStarted() {
    if (gameState === "playing") {
        handleSmash(touches[0].x, touches[0].y);
    }
}

function handleSmash(x, y) {
    for (let obj of objects) {
        if (!smashed.includes(obj) && isOverObject(obj, x, y)) {
            smashed.push(obj);
            score += obj.points;
        }
    }
}

function isOverObject(obj, x, y) {
    return x > obj.x - obj.w / 2 && x < obj.x + obj.w / 2 && y > obj.y - obj.h / 2 && y < obj.y + obj.h / 2;
}
