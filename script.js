class Particle {
    constructor(effect, index){
        this.effect = effect;
        this.index = index;

        this.radius = Math.random() * 20;
        this.mass = 3 * Math.floor(this.radius ** 2); //approximation of the area.

        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = (Math.random() * 10 - 5);
        this.vy = (Math.random() * 10 - 5);
    }
    draw(context){
        context.fillStyle = 'hsl(' + this.x / 2 + ', 100%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
    update(){
        this.x = Math.max(this.radius, Math.min(this.effect.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.effect.height - this.radius, this.y));
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius|| this.x < this.radius) this.vx *= -1;
        this.y += this.vy;
        if (this.y > this.effect.height - this.radius|| this.y < this.radius) this.vy *= -1;
    }
}

class Effect {
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 5;
        this.createParticles();

        window.addEventListener('resize', () => {
            effect.resize(window.innerWidth, window.innerHeight);
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
        this.particles.forEach(particle => {
            particle.draw(this.context);
            particle.update();
        });
    }
    connectParticles(maxdistance){
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
                    //Line of impact (normal vector)
                    const nx = dx / distance;
                    const ny = dy / distance;

                    //Relative velocity
                    const rvx = p1.vx - p2.vx;
                    const rvy = p1.vy - p2.vy;

                    //Velocity along normal (dot product)
                    const vn = rvx * nx + rvy * ny;

                    if (vn < 0) {
                        const impulse = (2 * vn) / (p1.mass + p2.mass); //Change in momentum

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