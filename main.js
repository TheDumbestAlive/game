const audioContext = new AudioContext();

const AnimationLoop = {
    vars: {
        menuV: 0
    },

    draw: [],

    createAnimation: function (execute, terminate) {
        if(!execute) return;
        this.draw.push(
            [execute, terminate]
        )
    },

    run: function () {
        for(let i = this.draw.length - 1; i >= 0; i--) {
            this.draw[i][0]();
            if(this.draw[i][1]) {
                if(this.draw[i][1]()) this.draw.splice(i, 1)
            }
        }
    }
};

const screens = {};

let bgs = {};

let screen = 'menu';

let imgs = ['Khan.png'];

let imgAssets = {};

let charts = {
    chug: {
        img: 'Khan.png',
        //Length in seconds
        len: 32,
        lanes: 4,
        notes: [
            [0,0.90517175,1.5517230000000004,2.844825500000001,3.749997250000001,4.655168999999999,5.560340749999997,6.724132999999997,7.758614999999994,9.698268749999992,10.862060999999988,11.637922499999986,12.413783999999984,13.57757624999998,14.482747999999978,15.387919749999975,16.034470999999975,17.58619399999997,18.36205549999997,19.52584774999997,21.724121999999966,22.241362999999964,23.663775749999964,25.60342949999996,27.67239349999996,29.741357499999957,30.905149749999957],
            [0.12931025000000002,1.0344820000000001,1.8103435000000005,3.1034460000000013,3.8793075000000012,4.913789499999998,5.689650999999998,6.982753499999996,8.017235499999993,9.95688924999999,10.991371249999988,11.767232749999986,12.931024999999982,13.70688649999998,14.999988999999976,15.646540249999974,16.551711999999974,17.84481449999997,18.620675999999968,19.913778499999967,21.853432249999965,22.499983499999963,24.051706499999963,25.86204999999996,27.93101399999996,29.999977999999956,31.293080499999956],
            [0.25862050000000003,1.2931025000000003,2.0689640000000007,3.3620665000000014,4.1379280000000005,5.1724099999999975,5.948271499999997,7.241373999999995,8.275855999999992,10.08619949999999,11.120681499999987,12.025853249999985,13.189645499999981,13.83619674999998,15.129299249999976,15.775850499999974,17.068952999999972,17.97412474999997,18.879296499999967,21.206880999999967,21.982742499999965,23.017224499999962,24.827567999999964,26.12067049999996,28.189634499999958,30.258598499999955,17905],
            [0.7758615000000001,1.4224127500000003,2.586205000000001,3.4913767500000015,4.3965485,5.431030499999997,6.206891999999996,7.499994499999994,9.568958499999992,10.34481999999999,11.379301999999987,12.155163499999984,13.318955749999981,13.96550699999998,15.258609499999976,15.905160749999974,17.32757349999997,18.23274524999997,19.137916999999966,21.465501499999966,22.112052749999965,23.27584499999996,25.344808999999962,27.41377299999996,29.482736999999958,30.517218999999955],
        ],
    },
    test2: {
        img: 'Khan.png',
        len: 32,
        lanes: 4,
        notes: [
            [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88],
            [0.5,2.5,4.5,6.5,8.5,10.5,12.5,14.5,16.5,18.5,20.5,22.5,24.5,26.5,28.5,30.5,32.5,34.5,36.5,38.5,40.5,42.5,44.5,46.5,48.5,50.5,52.5,54.5,56.5,58.5,60.5,62.5,64.5,66.5,68.5,70.5,72.5,74.5,76.5,78.5,80.5,82.5,84.5,86.5,88.5],
            [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89],
            [1.5,3.5,5.5,7.5,9.5,11.5,13.5,15.5,17.5,19.5,21.5,23.5,25.5,27.5,29.5,31.5,33.5,35.5,37.5,39.5,41.5,43.5,45.5,47.5,49.5,51.5,53.5,55.5,57.5,59.5,61.5,63.5,65.5,67.5,69.5,71.5,73.5,75.5,77.5,79.5,81.5,83.5,85.5,87.5,89.5],
        ],
    },
    test3: {
        img: 'Khan.png',
        len: 32,
        lanes: 4,
        notes: [
            [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88],
            [0.5,2.5,4.5,6.5,8.5,10.5,12.5,14.5,16.5,18.5,20.5,22.5,24.5,26.5,28.5,30.5,32.5,34.5,36.5,38.5,40.5,42.5,44.5,46.5,48.5,50.5,52.5,54.5,56.5,58.5,60.5,62.5,64.5,66.5,68.5,70.5,72.5,74.5,76.5,78.5,80.5,82.5,84.5,86.5,88.5],
            [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89],
            [1.5,3.5,5.5,7.5,9.5,11.5,13.5,15.5,17.5,19.5,21.5,23.5,25.5,27.5,29.5,31.5,33.5,35.5,37.5,39.5,41.5,43.5,45.5,47.5,49.5,51.5,53.5,55.5,57.5,59.5,61.5,63.5,65.5,67.5,69.5,71.5,73.5,75.5,77.5,79.5,81.5,83.5,85.5,87.5,89.5],
        ],
    },
    test4: {
        img: 'Khan.png',
        len: 32,
        lanes: 4,
        notes: [
            [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88],
            [0.5,2.5,4.5,6.5,8.5,10.5,12.5,14.5,16.5,18.5,20.5,22.5,24.5,26.5,28.5,30.5,32.5,34.5,36.5,38.5,40.5,42.5,44.5,46.5,48.5,50.5,52.5,54.5,56.5,58.5,60.5,62.5,64.5,66.5,68.5,70.5,72.5,74.5,76.5,78.5,80.5,82.5,84.5,86.5,88.5],
            [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89],
            [1.5,3.5,5.5,7.5,9.5,11.5,13.5,15.5,17.5,19.5,21.5,23.5,25.5,27.5,29.5,31.5,33.5,35.5,37.5,39.5,41.5,43.5,45.5,47.5,49.5,51.5,53.5,55.5,57.5,59.5,61.5,63.5,65.5,67.5,69.5,71.5,73.5,75.5,77.5,79.5,81.5,83.5,85.5,87.5,89.5],
        ],
    },
};

let allCharts = Object.keys(charts);

for(let i in charts) {
    charts[i].noteCount = 0;
    for(let k = 0; k < charts[i].notes.length; k++) {
        charts[i].noteCount += charts[i].notes[k].length;
    }
}

const menuCtx = {
    interactable: true,
    targetFps: 60,
    keybinds: {
        6: ['s', 'd', 'f', 'j', 'k', 'l'],
        4: ['d', 'f', 'j', 'k'],
        2: ['d', 'k'],
    },
    songSelect: 0,//Math.floor(allCharts.length / 2),
    titleCardOffset: 0,
};

const gameCtx = {
    ctxOffset: 0,

    vanish: {
        originX: 0,
        originY: 0,
        x: 0,
        y: 0,
    },

    scrollSpeed: 8,

    chart: {},

    grades: ['Perfect', 'Great', 'Good', 'Bad'],

    gradeThresholds: [1000, 750, 500, 0],

    perfect: 1000,

    mercy: 0.005,

    score: 0,

};

//SETUP
//==============================================
async function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(0, 0, 0);
    gameCtx.vanish.originX = width / 2;
    gameCtx.vanish.originY = -50;

    gameCtx.vanish.x = gameCtx.vanish.originX;
    gameCtx.vanish.y = gameCtx.vanish.originY;

    colorMode(RGB)

    textFont('monospace')

    frameRate(menuCtx.targetFps);

    for(let i = 0; i < imgs.length; i++) {
        imgAssets[imgs[i]] = await loadImage(imgs[i]);
    }
}

function loadGameChart (name) {
    if(!allCharts.includes(name)) {
        return;
    }
    
    gameCtx.chart = structuredClone(charts[name])
    gameCtx.keybinds = menuCtx.keybinds[gameCtx.chart.lanes]
    gameCtx.ctxOffset = audioContext.currentTime;
}

function gradient (c1, c2, x, y, w, h) {
  rectMode(CORNER)
  let scl = h / 255;
  scl = max(scl, 1);
  noStroke();
  for(let i = 0; i < h; i += scl) {
    fill(lerpColor(c1, c2, (i / scl) / 255));
    rect(x, y + i, w + scl, scl * 1.5);
  }
  return get(x, y, w, h);
}

function drawStats () {
    textAlign(LEFT)
    textSize(20);
    text(`Framerate: ${Math.round(frameRate())}fps`, 10, 30)
    text(`Time: ${Math.trunc(audioContext.currentTime * 100) / 100}s`, 10, 60)
}

function timeStamp (s) {
    let seconds = s % 60;
    let mins = Math.floor(s / 60);
    if(seconds < 10) {
        seconds = '0' + seconds;
    }
    return mins + ':' + seconds;
}

//Menu code
function drawTitleCard (x, y, s, img, title, subtext, subtext2,) {
    rectMode(CENTER)
    imageMode(CENTER)
    push()
    translate(x, y)
    scale(s)
    noStroke()
    fill(255, 255, 255)
    rect(0, 0, 100, 100)
    image(img, 0, 0, 100, 100)

    stroke(0, 0, 0)
    strokeWeight(8)
    noFill();

    rect(0, 0, 100, 100)

    noStroke()
    textAlign(CENTER)
    textSize(30)
    fill(255, 255, 255)
    text(title, 0, 80)

    textSize(20);
    fill(255, 255, 255, 150)
    text(subtext, 0, 100)

    textSize(15);
    fill(255, 255, 255, 150)
    text(subtext2, 0, 117)
    pop()
}

function menu () {
    if(audioContext.state === 'running') {
        audioContext.suspend();
    }
    imageMode(CORNER)
    if(!bgs.menuGradient) {
        bgs.menuGradient = gradient(color(100, 10, 100), color(0, 10, 70), 0, 0, width, height);
    }
    else {
        image(bgs.menuGradient, 0, 0)
    }

    fill(255, 255, 255)
    //drawTitleCard(width * 0.5, height * 0.5, 1, imgAssets['Khan.png'], 'test', 'subtest', 'subtest2')
    for(let i = 0; i < allCharts.length; i++) {
        let chartName = allCharts[i];
        let currChart = charts[allCharts[i]];
        let currImg = imgAssets[currChart.img];
        if(menuCtx.songSelect === i) {
            noStroke();
            fill(255, 255, 255, 2)
            for(let k = 325; k > 0; k--) {
                ellipse(375, (i - menuCtx.songSelect + 1) * 320 + 100 + menuCtx.titleCardOffset, 325 - k, 325 - k)
            }
            drawTitleCard(375, (i - menuCtx.songSelect + 1) * 320 + 100 + menuCtx.titleCardOffset, 2.25, currImg, chartName, timeStamp(currChart.len), `${currChart.noteCount} notes`)
        }
        else {
            drawTitleCard(150, (i - menuCtx.songSelect + 1) * 320 + 100 + menuCtx.titleCardOffset, 1.5, currImg, chartName, '', '')
        }
    }
    let chartName = allCharts[menuCtx.songSelect];
        let currChart = charts[allCharts[menuCtx.songSelect]];
        let currImg = imgAssets[currChart.img];
    drawTitleCard(width * 0.75, 330, 4.5, currImg, chartName, timeStamp(currChart.len), `${currChart.noteCount} notes`)

    //drawStats();
}

//Game code
//#region

function calcGrade (diff) {
    const error = Math.abs(diff);
    if(error <= 0.033) return [1000, 'Perfect', diff]
    if(error <= 0.13) return [750, 'Great', diff]
    if(error <= 0.2) return [500, 'Good', diff]
    if(error > 0.5) return [0, 'Awful', diff]
    if(error > 0.2) return [200, 'Bad', diff]
    return [0, '???', diff]
}

function drawLane (x1, x2, y, notes) {
    beginShape();
        vertex(gameCtx.vanish.x, gameCtx.vanish.y);
        vertex(x1, y);
        vertex(x2, y);
    endShape(CLOSE);

    let X = gameCtx.vanish.x;
    let Y = gameCtx.vanish.y;
    
    let m1 = (y - Y) / (x1 - X + Number.EPSILON)
    let b1 = y - x1 * m1;
    //b = y - x * m
    let m2 = (y - Y) / (x2 - X + Number.EPSILON)
    let b2 = y - x2 * m2;

    //x = y / m - b
    fill(0, 255, 255)
    for(let i = 0; i < notes.length; i++) {
        let yPos = height - (notes[i] - audioContext.currentTime) * gameCtx.scrollSpeed * menuCtx.targetFps;
        
        let topLeftX = (yPos - b1) / m1;
        let topRightX = (yPos - b2) / m2;

        let noteW = topRightX - topLeftX;

        let noteH = noteW / 14;
        
        let bottomY = noteH + yPos;
        beginShape();
        //Top left
        vertex(topLeftX, yPos);
        //Top right
        vertex(topRightX, yPos);
        //Bottom right
        vertex((bottomY - b2) / m2, bottomY);
        //Bottom left
        vertex((bottomY - b1) / m1, bottomY);
        endShape(CLOSE);
        fill(255, 255, 255, 10)
        noStroke();
        for(let i = 0; i < 8; i++) {
            beginShape();
            //Top left
            vertex(topLeftX - i, yPos - i);
            //Top right
            vertex(topRightX + i, yPos - i);
            //Bottom right
            vertex((bottomY - b2) / m2 + i, bottomY + i);
            //Bottom left
            vertex((bottomY - b1) / m1 - i, bottomY + i);
            endShape(CLOSE);
        }
    }
    
}

function drawLanes () {
    if(!gameCtx.chart.lanes) return;
    let laneCount = gameCtx.chart.lanes;
    let laneW = gameCtx.laneW;

    for(let i = 0; i < laneCount; i ++) {
        fill(144, 144, 144, 100)
        stroke(0, 0, 0)
        drawLane(i * laneW, i * laneW + laneW, height, gameCtx.chart.notes[i])
    }
}

function toggleVanish (speed) {
    if(keyIsPressed) {
        if(key === 'ArrowLeft') {
            gameCtx.vanish.x -= speed;
        }
        if(key === 'ArrowRight') {
            gameCtx.vanish.x += speed;
        }
        if(key === 'ArrowUp') {
            gameCtx.vanish.y -= speed;
        }
        if(key === 'ArrowDown') {
            gameCtx.vanish.y += speed;
        }
        if(key === 'Enter') {
            gameCtx.vanish.x = gameCtx.vanish.originX;
            gameCtx.vanish.y = gameCtx.vanish.originY;
        }
    }
}

//loadGameChart('test')

function game () {
    if(!gameCtx.laneW) {
        gameCtx.laneW = width / gameCtx.chart.lanes;
    }
    //toggleVanish(5);
    background(0, 0, 0);
    imageMode(CORNER)
    if(!bgs.gameGradient) {
        bgs.gameGradient = gradient(color(10, 10, 40), color(0, 28, 138), 0, 0, width, height);
    }
    else {
        image(bgs.gameGradient, 0, 0)
    }
    stroke(0, 0, 0)

    for(let i = 0; i < gameCtx.chart.notes.length; i++) {
        while(gameCtx.chart.notes[i][0] - audioContext.currentTime < -0.1) {
            gameCtx.chart.notes[i].shift();
            AnimationLoop.vars['miss'] = 255;
            AnimationLoop.createAnimation(() => {
                noStroke();
                fill(255, 0, 0, AnimationLoop.vars['miss'])
                textAlign(CENTER)
                textSize(40)
                text('Miss', width * 0.5, height * 0.75)
                AnimationLoop.vars['miss'] -=5;

            }, () => {
                return AnimationLoop.vars['miss'] <= 0 || screen !== 'game';
            })
        }
    }

    drawLanes();
    fill(255, 255, 255)
    drawStats();
}
//#endregion

screens.menu = menu;
screens.game = game;

function keyPressed () {
    if(screen === 'game') {
        if(gameCtx.keybinds.includes(key)) {
            let lane = gameCtx.keybinds.indexOf(key)
            let clr = [255, 255, 255]
            //Hit animation and score calc
            AnimationLoop.vars['effectTimer' + lane] = 150;
            if(height - (gameCtx.chart.notes[lane][0] - audioContext.currentTime) * gameCtx.scrollSpeed * menuCtx.targetFps > 0) {
                clr = [255, 215, 0]
                
                let hit = calcGrade(gameCtx.chart.notes[lane][0] - audioContext.currentTime);
                gameCtx.score += Math.round(hit[0]);
                AnimationLoop.vars['effectTimer' + hit[1]] = 255;
                AnimationLoop.createAnimation(() => {
                    noStroke();
                    fill(255, 255, 0, AnimationLoop.vars['effectTimer' + hit[1]])
                    textAlign(CENTER)
                    textSize(40)
                    text(hit[1], width * 0.5, height * 0.75)
                    textSize(20)
                    text(`(${Math.trunc(hit[2] * 1000)})ms`, width * 0.5, height * 0.75 + 20)
                    AnimationLoop.vars['effectTimer' + hit[1]] -=5;

                }, () => {
                    return AnimationLoop.vars['effectTimer' + hit[1]] <= 0 || screen !== 'game';
                })
                gameCtx.chart.notes[lane].shift();
            }
            AnimationLoop.createAnimation(() => {
                noStroke();
                fill(clr[0], clr[1], clr[2], AnimationLoop.vars['effectTimer' + lane])
                stroke(0, 0, 0)
                drawLane(lane * gameCtx.laneW, lane * gameCtx.laneW + gameCtx.laneW, height, [])
                AnimationLoop.vars['effectTimer' + lane] -=5;
            }, () => {
                return AnimationLoop.vars['effectTimer' + lane] <= 0 || screen !== 'game';
            })
            
            
        }
    }

    if(screen === 'menu' && menuCtx.interactable) {
        if(key === 'ArrowDown') {
            if(menuCtx.songSelect < allCharts.length - 1) {
                menuCtx.songSelect ++;
                menuCtx.titleCardOffset = 300;
                AnimationLoop.vars.menuDir = 1;
                AnimationLoop.createAnimation (() => {
                    AnimationLoop.vars.menuV += 2 * AnimationLoop.vars.menuDir;
                    menuCtx.titleCardOffset -= AnimationLoop.vars.menuV;
                }, () => {
                    if(menuCtx.titleCardOffset <= 0 && AnimationLoop.vars.menuDir === 1) {
                        AnimationLoop.vars.menuV = 0;
                    }
                    return menuCtx.titleCardOffset <= 0 || AnimationLoop.vars.menuDir !== 1;
                });
            }
        }
        if(key === 'ArrowUp') {
            if(menuCtx.songSelect > 0) {
                menuCtx.songSelect --;
                menuCtx.titleCardOffset = -300;
                AnimationLoop.vars.menuDir = -1;
                AnimationLoop.createAnimation (() => {
                    AnimationLoop.vars.menuV += 2 * AnimationLoop.vars.menuDir;
                    menuCtx.titleCardOffset -= AnimationLoop.vars.menuV;
                }, () => {
                    if(menuCtx.titleCardOffset >= 0 && AnimationLoop.vars.menuDir === -1) {
                        AnimationLoop.vars.menuV = 0;
                    }
                    return menuCtx.titleCardOffset >= 0 || AnimationLoop.vars.menuDir !== -1;
                });
            }
        }
    }
}

function mouseClicked () {
    if(audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function draw () {
    if(screens[screen]) {
        screens[screen]();
    }
    AnimationLoop.run();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
