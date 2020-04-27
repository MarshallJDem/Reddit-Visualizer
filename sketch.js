let table;
let points = [[-0.8696709454912034,0.47786372607980354,0.12376875965106386],[0.8696709454912034,-0.47786372607980354,-0.12376875965106386],[0.18647146190184805,-0.7582921079171366,0.6246770949592861],[0.7833454115640714,0.5597593082540336,-0.2702581784229317],[-0.3220945739798816,0.10601665503109509,0.9407526530755768],[0.04679381391076626,0.920617229144811,0.38765223639418706],[0.17794944149215752,0.49634351942785304,0.8496923602072703],[-0.04679381391076626,-0.920617229144811,-0.38765223639418706],[0.3220945739798816,-0.10601665503109509,-0.9407526530755768],[-0.9868197049678733,-0.10005459346775564,-0.12718470117558095],[-0.7364492733424768,0.4528278068413745,-0.5025827744208595],[0.7364492733424768,-0.4528278068413745,0.5025827744208595],[0.9868197049678733,0.10005459346775564,0.12718470117558095],[-0.8284988423286999,0.010118054952571787,0.5598993599067433],[-0.42339097418082683,0.9047005704343696,-0.04750748191533992],[0.42339097418082683,-0.9047005704343696,0.04750748191533992],[0.8284988423286999,-0.010118054952571787,-0.5598993599067433],[0.6995257186398103,0.1566309083432294,0.6972306128627974],[0.48028073646409086,-0.6310908966160564,-0.6091425895386501],[-0.2699990104783806,-0.9390532713166558,0.21278977412033248],[0.38547928929488895,0.5084116444742722,-0.7700151409470293],[-0.38547928929488895,-0.5084116444742722,0.7700151409470293],[0.2699990104783806,0.9390532713166558,-0.21278977412033248],[-0.48028073646409086,0.6310908966160564,0.6091425895386501],[0.23653995802540184,-0.20790778123284365,0.9491170648345636],[0.6416478261732749,0.6866747342489541,0.34171022301248033],[-0.6995257186398103,-0.1566309083432294,-0.6972306128627974],[-0.7833454115640714,-0.5597593082540336,0.2702581784229317],[-0.18647146190184805,0.7582921079171366,-0.6246770949592861],[-0.17794944149215752,-0.49634351942785304,-0.8496923602072703],[-0.6416478261732749,-0.6866747342489541,-0.34171022301248033],[-0.23653995802540184,0.20790778123284365,-0.9491170648345636]];

function preload(){
    table = loadJSON('upvoted.json');
}

var obj = [];
let backupImg;
let subDict = {};

function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch");
  frameRate(60);
    background(0);
    stroke(255);
    strokeWeight(1);
    backupImg = createImg("https://s3.amazonaws.com/iconbros/icons/icon_pngs/000/000/076/original/message-txt.png");    
    
    table = table.data.children;
    console.log(points);
    for(let i=0; i<table.length; i++){
        
        let img = createImg(table[i].data.thumbnail.replace("https", "http"));
        table[i].data.thumbnailImage = img;
        let sub = table[i].data.subreddit;
        if(subDict[sub] == null){
            subDict[sub] = 0;
        }
        subDict[sub] += 1;
    }
    console.log(table);
   
    for(let i =0; i<points.length; i++){
        let val = subDict[Object.keys(subDict)[i]];
        
        // Calculate color for this point
        var from = color(255, 0, 0);
        var to = color(0, 0, 255);
        let t = i/(points.length/3);
        if(t >= 0){
            from = color(255, 0, 0);
            to = color(255, 255, 0);
        }
        if(t >= 1){
            from = color(255, 255, 0);
            to = color(0, 255, 255);
        }
        if(t >= 2){
            from = color(0,255, 255);
            to = color(255, 0, 255);
        }
        let c = lerpColor(from, to, t%1.0);

        // Push new point
        obj.push(new Point(points[i][0],points[i][1],points[i][2],0,0, val, Object.keys(subDict)[i], i,c));
    }
    
    // Get neighbors
    // Check the distance between each combination of pairs of points
    for(let j=0; j<obj.length; j++){
        for(let i =0; i<obj.length; i++){
            let distance = createVector(points[j][0],points[j][1],points[j][2]).dist(createVector(points[i][0],points[i][1],points[i][2])); 
            // If the distance is less than 0.9, they neighbor. This is semi arbitrary
            if(distance < 0.9 && i != j){
                obj[j].neighbors.push(obj[i]);
            }
        }
    }
    
}
// draw() runs in a loop as many times as specified by frameRate() per second.

var lerpLength = 0.0;
var transition = 0;
let hasReceivedMouseOver = false;
let globalColor;
function draw(){
    let alpha = 255;
    if(superGamerMode){
        alpha = 50;
    }
    background(0,0,0,alpha);
    
    var from = color(255, 0, 0);
    var to = color(0, 0, 255);
    if(transition == 0){
        from = color(255, 0, 0);
        to = color(0, 0, 255);
    }
    if(transition == 1){
        from = color(0, 0, 255);
        to = color(0, 255, 0);
    }
    if(transition == 2){
        from = color(0, 255, 0);
        to = color(255, 0, 0);
    }
    globalColor = lerpColor(from, to, lerpLength);
    
    lerpLength += 0.1 / 60;
    if(lerpLength > 1){
        lerpLength = 0;
        transition++; if(transition > 2){transition = 0;}
    }
    
    
    
    //Apply transformations
    for(var y = 0; y < obj.length; y++){
        
        // Pulse in an out. Don't pulse if a point is selected and its not this one
        if(selectedPoint == null || (selectedPoint == obj[y])){
            obj[y].pulse();
        }
        // Run the point's animation. If none exists then nothing will happen (this is how we change how far point is from center)
        obj[y].animate();
        // Rotate the point around the center of the object
        obj[y].rotate();
    }
    
    
    // Check if we are hovering over anything
    hoveredPoint = null;
    hasReceivedMouseOver = false;
    for(let i=0; i<obj.length; i++){
        obj[i].checkMouseOver();
    }
    // Left bar for searching
    for(let i=0; i<obj.length; i++){
        let x = 50;
        let height = (windowHeight - 50)/obj.length
        let width = textWidth("r / " + obj[i].subreddit) + 20;
        let y =  25 + i * height;
        
        let c = obj[i].color;
        
        stroke(255);
        fill(255);
        console.log(selectedPoint);
        if(selectedPoint == obj[i]  || (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height)){
            fill(0);
            stroke(255);
            if(selectedPoint == obj[i]){
                stroke(obj[i].color);
            }
            rect(x,y,width,height,10,10,10,10);
            fill(255);
            stroke(255);
            if((mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height)){
                hoveredPoint = obj[i];
                
            }
            obj[i].displayTitle();
        }
        //let col = c.setAlpha(1);
        fill(c);
        stroke(c);
        if(selectedPoint != null && selectedPoint != obj[i]){
            
            fill(red(c), green(c), blue(c), 100);
            stroke(red(c), green(c), blue(c), 100);
        }
        
        text("r / " + obj[i].subreddit, x + 10, y + 16);
    }
    
    // Draw points
    for(var y = 0; y < obj.length; y++){
        obj[y].display()
    }
    
    selectedPost = null;
    // Side bar
    if(selectedPoint != null){
        let i = selectedPoint.index;
        let posts = [];
        for(let j =0; j<table.length; j++){
            if(table[j].data.subreddit == selectedPoint.subreddit){
                posts.push(table[j].data);
            }
        }
        for(let j =0; j<posts.length; j++){
            let current = "";
            for(let x = 0; x < posts[j].title.length; x++){
                if(textWidth(current + posts[j].title.charAt(x)) <= 200){
                    current += posts[j].title.charAt(x);
                }else{
                    current += "...";
                    break;
                }
            }
            stroke(255);
            fill(0);
            if(mouseX > windowWidth - 350 && mouseX < windowWidth - 50 && mouseY > 20 + 52*j && mouseY < 20 + 52*j + 50){
                stroke(selectedPoint.color);
                selectedPost = posts[j];
            }
            rect(windowWidth - 350, 20 + 52*j,300, 50,0,25,25,0);
            fill(255);
            text(current, windowWidth - 275, 50 + 52*j);
            if(posts[j].thumbnailImage.width != 0 && posts[j].thumbnailImage.height != 0 ){
                image(posts[j].thumbnailImage,windowWidth - 350,20 + 52*j, 50, 50);
            }else{
                fill(255);
                rect(windowWidth - 350, 20 + 52*j,50,50);
                image(backupImg,windowWidth - 350,20 + 52*j, 50, 50);
            }
        }
        stroke(255);
        fill(255);
        text("r / ", windowWidth/2 - textWidth("r / " +selectedPoint.subreddit)/2, 50)
        stroke(selectedPoint.color);
        fill(selectedPoint.color);
        text(selectedPoint.subreddit, windowWidth/2 - textWidth("r / "+ selectedPoint.subreddit)/2 + textWidth("r / ") , 50);
    }
    
    stroke(0);
    if(showAllTitles){
        fill(255);
    }else{
        fill(100);
    }
    text("Show All", windowWidth/2 - textWidth("Show All")/2, windowHeight-25);
    
}
let showAllTitles = false;
let selectedPost = null;

// windowResized() is called whenever the browser size changes.
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

let selectedPoint = null;
let hoveredPoint = null;

let superGamerMode = false;

function keyPressed() {
  if (keyCode === 32) {
    superGamerMode = !superGamerMode;
  }
}
function mousePressed(){
    if(selectedPost != null){
        window.open("http://www.reddit.com" + selectedPost.permalink);
        return;
    }
    if(hoveredPoint != null){
        selectedPoint = hoveredPoint;
        for(let i =0; i<obj.length; i++){
            if(obj[i] != selectedPoint){
                obj[i].animationStart = frameCount;
                obj[i].animationPos = obj[i].pos.copy().normalize().mult(75);
                obj[i].animationStartPos = obj[i].pos.copy();
                obj[i].animationLength = 15;
            }else{
                obj[i].animationStart = frameCount;
                obj[i].animationPos = obj[i].pos.copy().normalize().mult(obj[i].scaledVal);
                obj[i].animationStartPos = obj[i].pos.copy();
                obj[i].animationLength = 15;
            }
        }
        return;
    }
    
    let width = 100;
    let height = 20;
    if(mouseX > windowWidth/2 - width/2 && mouseX < windowWidth/2 + width/2 && mouseY > windowHeight - 50 && mouseY < windowHeight){
        showAllTitles = !showAllTitles;
        return;
    }
    for(let i =0; i<obj.length; i++){
        obj[i].animationStart = frameCount;
        obj[i].animationPos = obj[i].pos.copy().normalize().mult(obj[i].scaledVal);
        obj[i].animationStartPos = obj[i].pos.copy();
        obj[i].animationLength = 15;
    }
    selectedPoint = null;
}

class Point {
    constructor(x, y, z, cX, cZ, val, subreddit, i, color)
    {
        this.unitPos = createVector(x,y,z);
        this.val = val;
        this.scaledVal = (75 + 6 * val);
        this.pos = createVector(x*75,y*75,z*75);
        this.centerX = cX;
        this.centerZ = cZ;
        this.distance = sqrt((this.centerX - x)*(this.centerX - x) + (this.centerZ - z)*(this.centerZ - z));
        this.rotation = atan((this.centerZ - z)/(this.centerX - x));
        if(x < this.centerX){
            this.rotation += PI;
        }
        this.neighbors = [];
        this.subreddit = subreddit;
        this.index = i;
        this.animationStart = 0;
        this.animationPos = p5.Vector.mult(this.unitPos, this.scaledVal);
        this.animationStartPos = this.pos;
        this.animationLength = 120;
        this.color = color;
        
    }
    animate(){
        let start = this.animationStart;
        let startPos = this.animationStartPos;
        let length = this.animationLength;
        let targetPos = this.animationPos;
        if(start != null){
            if(frameCount - start<length){
                let progress = map(frameCount - start, 0, length, 0.0, 1.0);
                this.pos = p5.Vector.lerp(startPos, targetPos, progress);
            }else{
                this.pos = targetPos;
                this.animationStart = null;
                this.animationLength = null;
                this.animationPos = null;
                this.animationStartPos = null;
            }
        }
    }
    pulse(){
        // Don't pulse if we are animating to a new pos
        if(this.animationPos != null){
            return;
        }
        let sinMod = createVector(this.pos.x, this.pos.y, this.pos.z).normalize();
        let amplitude = 0.1;
        let cycle = 120; // The number of frames for a full cycle
        if(selectedPoint == this){
            amplitude = 0.5;
            cycle = 60;
        }
        if(superGamerMode){
            amplitude = 2;
            cycle = 60;
        }
        sinMod.mult(amplitude * sin(TWO_PI * ((frameCount + 10 * this.index)%cycle)/cycle));
        this.pos.add(sinMod);
    }
    display(){
        fill(255);
        stroke(globalColor);
        this.checkSelected();
        this.calcScreenPos(PI/4, 1000, 1000);
        
        if(hoveredPoint != null){
            if(hoveredPoint == this){
                fill(this.color);
                stroke(this.color);
            }else{
                fill(100);
                stroke(50);
            }
        }
        if(showAllTitles){
            this.displayTitle();
            let alpha = 50;
            if(selectedPoint == this || hoveredPoint == this){
                alpha = 255;
            }
            stroke(red(this.color), green(this.color), blue(this.color), alpha);
        }
        this.displayTesselations();
        // Draw point
        ellipse(this.screenX, this.screenY, 10);
    }
    checkSelected(){ 
        if(selectedPoint != null ){
            if(this == selectedPoint){
                this.displayTitle();
                fill(this.color);
                stroke(this.color);
                
            }else{
                fill(100);
                stroke(50);
            }
        }
    }
    displayTesselations(){
        
        // Draw Tesselations
        for(let i =0; i<this.neighbors.length; i++ ){
            // Don't tesselate to the selected point or hovered point
            if(selectedPoint != this.neighbors[i] && hoveredPoint != this.neighbors[i]){
                line(this.screenX, this.screenY,this.neighbors[i].screenX, this.neighbors[i].screenY);
            }
        }
    }
    displayTitle(){
        stroke(0);
       // fill(150,150,150);
        fill(this.color);
        text(this.subreddit,this.screenX- textWidth(this.subreddit)/2,this.screenY - 25);
        
    }
    checkMouseOver(){
        if(createVector(this.screenX,this.screenY).dist(createVector(mouseX, mouseY)) < 10 && !hasReceivedMouseOver){
            hasReceivedMouseOver = true;
            hoveredPoint = this;
            this.displayTitle();
        }
    }
    checkMouseClicked(){
        if(createVector(this.screenX,this.screenY).dist(createVector(mouseX, mouseY)) < 10){
            return true;
        }
        return false;
    }
    
    calcScreenPos(degrees, screenW, screenH){
        
        this.screenX = screenW*(this.pos.x)*2/(screenW + 2*((this.pos.z) * tan(degrees)));
        this.screenX += windowWidth/2;
        this.screenY = screenH*(this.pos.y)*2/(screenH + 2*((this.pos.z) * tan(degrees)));
        this.screenY += windowHeight/2;
        this.screenY = windowHeight - this.screenY;
    }
    rotate(){
        this.distance = sqrt((this.centerX - this.pos.x)*(this.centerX - this.pos.x) + (this.centerZ - this.pos.z)*(this.centerZ - this.pos.z));
        let rotationRate = 0.2;
        if(superGamerMode){
            rotationRate = 10;
        }
        this.rotation += rotationRate * PI / 360;
        this.pos.x += this.distance*cos(this.rotation) - this.pos.x;
        this.pos.z += this.distance*sin(this.rotation) - this.pos.z;
    }
}