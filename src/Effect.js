class Particle {
    constructor(effect, index) {
        this.effect = effect;
        this.index = index;

        this.hovered = false;
        this.clicked = false;
        this.isBeingEdited = false;
        this.selectionBuffer = 10;

        this.maxRadius = 20;
        this.minRadius = 5;
        
        this.radius = 20;
        this.mass = Math.PI * this.radius ** 2;

        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);

        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
    }
    handleSelection() {
        if (this.effect.selection) {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
    
            this.hovered = distance <= (this.radius + this.selectionBuffer);
            this.clicked = this.effect.clickedParticles.includes(this);
        } else {
            this.hovered = false;
        }
    }
    updateRadius(radius){
        this.radius = radius;

        console.log(this.width);
        this.x = Math.max(this.radius, Math.min(this.x, this.effect.width - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, this.effect.height - this.radius));
    }
    updatePosition(attribute, value) {
        attribute = attribute.toUpperCase();
        if (attribute === 'X') {
            this.x = Math.max(this.radius, Math.min(value, this.effect.width - this.radius));
        } else if (attribute === 'Y') {
            this.y = Math.max(this.radius, Math.min(value, this.effect.height - this.radius));
        }
    }
    updateColor(color) {
        this.colorChosen = true;
        this.color = color;
    }
    draw(context) {
        this.handleSelection();
        if (this.hovered) {
            context.fillStyle = 'hsla(186, 100%, 50%, 0.30)';
            context.beginPath();
            context.arc(this.x, this.y, this.radius + this.selectionBuffer, 0, Math.PI * 2);
            context.fill();
        }
        if (this.clicked) {
            context.fillStyle = 'hsla(186, 100%, 50%, 0.60)';
            context.beginPath();
            context.arc(this.x, this.y, this.radius + this.selectionBuffer, 0, Math.PI * 2);
            context.fill();
        }  
        this.color = this.colorChosen ?  this.color : 'hsl(' + this.y / 2 + ', 70%, 50%)';
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

export class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.selection = true;
        this.clickedParticles = [];

        this.createParticles(50);

        //booleans
        this.constRadius = false;
        this.collide = true;
        this.connect = true;
        this.gravityOp = false;
        this.boundaryCheckOp = true;

        this.maxdistance = 150;
        this.speed = 1;
        this.radius = this.particles[0].maxRadius;
        this.gravity = 0.1;
        this.friction = 0.99;

        this.worker = new Worker('worker.js');
        this.worker.onmessage = e => {
            const updatedParticles = e.data;
            for (let i = 0; i < updatedParticles.length; i++) {
                this.particles[i].x = updatedParticles[i].x;
                this.particles[i].y = updatedParticles[i].y;
                this.particles[i].vx = updatedParticles[i].vx;
                this.particles[i].vy = updatedParticles[i].vy;
            }
        };

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            select: false,
            left: false,
            right: false,
            active: true,
            radius: 150,
            cursorRadius: 10,
            draw(context) {
                if (this.active){
                    context.fillStyle = 'hsla(180, 100%, 50%, 0.91)';
                    context.beginPath();
                    context.arc(this.x, this.y, this.cursorRadius, 0, Math.PI * 2);
                    context.fill();
                }
            }
        };

        window.addEventListener('mousemove', e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mousedown', e => {
            if (this.selection) 
                this.mouse.select = true;
            if (this.mouse.active)
                this.mouse.pressed = true;
            if (e.button === 0) {
                this.mouse.left = true;
            }
            if (e.button === 2) {
                this.mouse.right = true;
            }
        });
        window.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
            this.mouse.select = false;
            this.mouse.left = false;
            this.mouse.right = false;
        });

        // window.addEventListener('touchstart', e => {
        //     if (this.mouse.active && e.touches.length > 0) {
        //         this.mouse.pressed = true;
        //         this.mouse.left = true;
        //         this.mouse.x = e.touches[0].clientX;
        //         this.mouse.y = e.touches[0].clientY;
        //     }
        // });
        // window.addEventListener('touchmove', e => {
        //     if (this.mouse.active && this.mouse.pressed && e.touches.length > 0) {
        //         this.mouse.x = e.touches[0].clientX;
        //         this.mouse.y = e.touches[0].clientY;
        //     }
        // });
        // window.addEventListener('touchend', () => {
        //     if (this.mouse.active) {
        //         this.mouse.pressed = false;
        //         this.mouse.left = false;
        //     }
        // });

        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight);
        });
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
    }
    handleSelection(){
        if (this.mouse.left) {
            let clickedParticle = null;

            for (const particle of this.particles) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.hypot(dx, dy);

                if (distance <= particle.radius + particle.selectionBuffer) {
                    if (this.mouse.left) {
                        clickedParticle = particle;
                        break;
                    }
                }
            }

            if (clickedParticle) {
                this.clickedParticles.length = 0;
                this.clickedParticles.push(clickedParticle);
            } else {
                this.clickedParticles.length = 0;
            }
        }
    }
    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this, i));
        }
        this.numberOfParticles = this.particles.length;
    }
    addParticles(count) {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(this, this.particles.length + i);
            if (this.constRadius) {
                particle.radius = this.radius;
            } else {
                particle.radius = Math.floor(Math.random() * (this.radius) + particle.minRadius);
            }
            particle.mass = particle.mass = Math.PI * particle.radius ** 2;
            this.particles.push(particle);
            this.numberOfParticles = this.particles.length;
        }
    }
    removeParticles(count) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length) {
                this.particles.pop();
                this.numberOfParticles = this.particles.length;
            }
        }
    }
    updateNumberOfParticles(newCount) {
        const difference = newCount - this.numberOfParticles;
        if (difference > 0) {
            this.addParticles(Math.abs(difference));
        } else if (difference < 0) {
            this.removeParticles(Math.abs(difference));
        }
        this.numberOfParticles = this.particles.length;
    }
    updateRadius(bool) {
        this.particles.forEach(particle => {
            if (!bool) {
                particle.maxRadius = this.radius;
                particle.radius = this.radius;
            } else {
                particle.maxRadius = this.radius;
                particle.radius = Math.floor(Math.random() * (this.radius) + particle.minRadius);
            }

            particle.mass = Math.PI * particle.radius ** 2;
            particle.x = Math.max(particle.radius, Math.min(particle.x, this.width - particle.radius));
            particle.y = Math.max(particle.radius, Math.min(particle.y, this.height - particle.radius));
        });
    }
    handleParticles() {
        const workerParticles = this.particles.map(p => ({ x: p.x, y: p.y, vx: p.vx, vy: p.vy, radius: p.radius, mass: p.mass, isBeingEdited: p.isBeingEdited}));
        const workerMouse = { x: this.mouse.x, y: this.mouse.y, pressed: this.mouse.pressed, left: this.mouse.left, right: this.mouse.right, radius: this.mouse.radius,};
        this.worker.postMessage({
            particles: workerParticles,
            mouse: workerMouse,
            speed: this.speed,
            gravity: this.gravity,
            width: this.width,
            height: this.height,
            collide: this.collide,
            boundaryCheckOp: this.boundaryCheckOp,
            gravityOp: this.gravityOp
        });
    }
    drawParticles() {
        this.particles.forEach(particle => {
            particle.draw(this.context);
        });
    }
    drawMouse() {
        if (this.mouse.active){
            this.canvas.style.cursor = 'none';
            this.mouse.draw(this.context);
        } else{
            this.canvas.style.cursor = 'auto';
        }
    }
    animate = () => {
        if (this.selection) this.handleSelection();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.handleParticles();
        this.drawParticles();
        this.drawMouse();

        requestAnimationFrame(this.animate);
    };
}