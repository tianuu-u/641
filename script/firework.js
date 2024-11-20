function getStyle(ele, attr) {
    if (window.getComputedStyle) {
        return getComputedStyle(ele, null)[attr];
    } else {
        return ele.currentStyle[attr];
    }
}

// 创建一个固定的容器来装所有烟花元素
function createFireworkContainer() {
    if (!document.getElementById('firework-container')) {
        const container = document.createElement('div');
        container.id = 'firework-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);
    }
    return document.getElementById('firework-container');
}

function Boom(x, y) {
    const container = createFireworkContainer();
    var mDiv = document.createElement("div");
    mDiv.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background: ${randomColor()};
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        will-change: transform;
        transform: translate3d(0, 0, 0);
    `;
    container.appendChild(mDiv);
    this.ele = mDiv;
    this.xSpeed = (Math.random() > 0.5 ? 1 : -1) * parseInt(Math.random() * 20);
    this.ySpeed = (Math.random() > 0.5 ? 1 : -1) * parseInt(Math.random() * 20);
    this.x = x;
    this.y = y;
}

Boom.prototype.mDrop = function() {
    var self = this;
    let currentX = self.x;
    let currentY = self.y;
    
    var timer = setInterval(function() {
        self.ySpeed++;
        currentX += self.xSpeed;
        currentY += self.ySpeed;
        
        self.ele.style.transform = `translate3d(${currentX - self.x}px, ${currentY - self.y}px, 0)`;
        
        if (currentY > window.innerHeight || 
            currentX < 0 || 
            currentX > window.innerWidth) {
            clearInterval(timer);
            self.ele.parentNode.removeChild(self.ele);
        }
    }, 60);
}

function randomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function createFirework(x, y) {
    const container = createFireworkContainer();
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        width: 10px;
        height: 22px;
        background: white;
        pointer-events: none;
        will-change: transform;
        transform: translate3d(${x}px, ${window.innerHeight}px, 0);
    `;
    container.appendChild(box);
    
    let startY = window.innerHeight;
    let s = startY - y;
    
    const timer = setInterval(function() {
        let speed = Math.ceil(s / 10);
        s = s - speed;
        startY -= speed;
        
        box.style.transform = `translate3d(${x}px, ${startY}px, 0)`;
        
        if (speed == 0) {
            clearInterval(timer);
            box.parentNode.removeChild(box);
            
            for (let i = 0; i < parseInt(Math.random() * 50) + 30; i++) {
                const b = new Boom(x, y);
                b.mDrop();
            }
        }
    }, 30);
} 