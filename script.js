class Particle {
    constructor(effect, index){
        this.effect = effect;
        this.index = index;

        this.radius = Math.random() * 12 + 1;
        this.mass = Math.PI * this.radius ** 2;

        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);

        this.vx = (Math.random() * 2 - 1);
        this.vy = (Math.random() * 2 - 1);

        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.95;
    }
    draw(context){
        context.fillStyle = 'hsl(' + 250 + ', 50%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
    update(){
        if (this.effect.mouse.pressed){
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = (this.effect.mouse.radius / distance);

            if(distance < this.effect.mouse.radius){
                const angle = Math.atan2(dy, dx);
                this.pushX += Math.cos(angle) * force;
                this.pushY += Math.sin(angle) * force;
            }
        }

        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction) + this.vy;
        
        if (this.x < this.radius){
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius) {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }
        if (this.y < this.radius){
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius;
            this.vy *= -1;
        }
    }
}

class Effect {
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'white';

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 500;
        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: 150
        };

        window.addEventListener('resize', () => {
            effect.resize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });

        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this, i));
        }
    }
    handleParticles(){
        this.collision();
        // this.connectParticles(30);
        this.particles.forEach(particle => {
            particle.draw(this.context);
            particle.update();
        });
    }
    connectParticles(maxdistance){
        this.context.strokeStyle = 'white';
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxdistance){
                    this.context.beginPath();
                    this.context.moveTo(this.particles[a].x, this.particles[a].y);
                    this.context.lineTo(this.particles[b].x, this.particles[b].y);
                    this.context.stroke();
                }
            }
        }
    }
    collision(){
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                
                const p1 = this.particles[a];
                const p2 = this.particles[b];

                const contact = p1.radius + p2.radius;
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.hypot(dx, dy);

                if (distance < contact){
                    // Line of impact (normal vector)
                    const nx = dx / distance;
                    const ny = dy / distance;

                    // Relative velocity
                    const rvx = p1.vx - p2.vx;
                    const rvy = p1.vy - p2.vy;

                    // Velocity along normal (dot product)
                    const vn = rvx * nx + rvy * ny;

                    if (vn < 0) {
                        const impulse = (2 * vn) / (p1.mass + p2.mass); // Change in momentum

                        p1.vx -= impulse * p2.mass * nx;
                        p1.vy -= impulse * p2.mass * ny;
                        p2.vx += impulse * p1.mass * nx;
                        p2.vy += impulse * p1.mass * ny;

                        const overlap = contact - distance;
                        if (overlap > 0){
                            const totalMass = p1.mass + p2.mass;
                            p1.x -= (overlap * nx) * (p2.mass / totalMass);
                            p1.y -= (overlap * ny) * (p2.mass / totalMass);
                            p2.x += (overlap * nx) * (p1.mass / totalMass);
                            p2.y += (overlap * ny) * (p1.mass / totalMass);
                        }
                    }
                }
            }
        }
    }
    animate = () => {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.handleParticles(this.context);
        requestAnimationFrame(this.animate);
    }
}

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const effect = new Effect(canvas);
effect.animate();