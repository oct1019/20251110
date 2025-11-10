let t = 0.0;
let vel = 0.02;
let num;
let paletteSelected;
let points = []

// 全域樣式變數（可由點擊改變）
let drawLineCount = 4;
let starPoints = 4;

// 如果工作區沒有定義 palettes，就提供一組預設調色盤
if (typeof palettes === 'undefined') {
	palettes = [
		["#355070","#6d597a","#b56576","#e56b6f","#eaac8b"],
		["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],
		["#f72585","#b5179e","#7209b7","#560bad","#480ca8"]
	];
}

// 限定為 10 個樣式（每個樣式包含 palette、drawLineCount、starPoints）
let styles = [];
let currentStyleIndex = 0;

function buildStyles() {
	// 如果 palettes 少於 10，會重複使用
	for (let i = 0; i < 10; i++) {
		let pal = palettes[i % palettes.length];
		styles.push({
			palette: pal,
			drawLineCount: floor(random(2, 6)),
			starPoints: floor(random(3, 7))
		});
	}
}

function applyStyle(idx) {
	let s = styles[idx % styles.length];
	paletteSelected = s.palette;
	drawLineCount = s.drawLineCount;
	starPoints = s.starPoints;
}

function setup() {
	// 讓畫布填滿整個視窗
	createCanvas(windowWidth, windowHeight);
	pixelDensity(2)
	rectMode(CENTER)
	angleMode(DEGREES);
	num = random(100000);
	// 建立並套用 10 個樣式，隨機選一個起始樣式
	buildStyles();
	currentStyleIndex = floor(random(0, styles.length));
	applyStyle(currentStyleIndex);
	noLoop();
}

function draw() {
	randomSeed(num);
	background("#f4f1de");
	stroke("#355070");
	t += vel;
	tile();
}

function randomCol() {
	let randoms = int(random(1, paletteSelected.length));
	return color(paletteSelected[randoms]);
}

function tile() {
	let count = 5;
	let w = width / count;
	let offset = w / 2;
	// 每次繪製 tiles 時重置 points，避免跨圖塊累積
	points = [];

	for (var j = 0; j < count; j++) {
		for (var i = 0; i < count; i++) {

			shape(offset + i * w, offset + j * w, w);
		}
	}
}

function shape(x, y, r) {
	push();
	translate(x, y);
	//rect(0, 0, r, r)
	let nums = 3;
	let w = r / nums;
	let offset = -r / 2 + w / 2
	for (var j = 0; j < nums; j++) {
		for (var i = 0; i < nums; i++) {
			let pointX = offset + i * w
			let pointY = offset + j * w
			//stroke(randomCol())
			//	fill(randomCol())
			//ellipse(pointX, pointY, 10);
			push();
			star(pointX, pointY, 10)
			pop();
			points.push({
				x: pointX,
				y: pointY,
				count: 0
			})
		}
	}
	// 使用全域 drawLineCount 決定每次連線數量
	let draw_line = drawLineCount;
	for (let i = 0; i < draw_line; i++) {
		let usable = points.filter(p => p.count < 2);
		if (usable.length < 2) break;

		let pointA = random(usable);
		let pointB = random(usable);
		while (pointA === pointB) {
			pointB = random(usable);
		}
		blendMode(MULTIPLY)
		strokeWeight(r * 0.2)
		stroke(randomCol())
		line(pointA.x, pointA.y, pointB.x, pointB.y);
		pointA.count++;
		pointB.count++;
	}
	pop();
}

function windowResized() {
	// 當視窗大小變更時調整畫布
	resizeCanvas(windowWidth, windowHeight);
	redraw();
}

function star(x, y, d) {


	push();
	fill(randomCol());
	noStroke();

	translate(x, y)
	// 星型頂點數（由樣式變數控制）
	let nums = starPoints;
	let r = d*random(0.2,0.9)
	let r2 = r * 0.3
	let angle = 360 / 4
	beginShape();
	for (let i = 0; i < nums + 3; i++) {
		let x = r * cos(i * (360 / nums))
		let y = r * sin(i * (360 / nums))
		curveVertex(x, y)
		let x2 = r2 * cos(i * (360 / nums) + angle * 0.5)
		let y2 = r2 * sin(i * (360 / nums) + angle * 0.5)
		curveVertex(x2, y2)
	}
	endShape();
	pop();

}

function mousePressed() {
	// 點擊切換到下一個預設樣式（共 10 種），然後重繪一次
	currentStyleIndex = (currentStyleIndex + 1) % styles.length;
	applyStyle(currentStyleIndex);
	num = random(100000);
	points = [];
	redraw();
}