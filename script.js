const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';

class Particle {
    constructor(effect){
        this.effect = effect;
        this.radius = Math.random() * 30;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
    draw(context){
        context.fillStyle = 'hsl(' + this.x / 2 + ', 100%, 50%)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
    update(){
        let signx = (Math.random() *  2) - 1;
        let signy = (Math.random() *  2) - 1;
        console.log(signx);
        let pwrx = Math.random() * 40;
        let pwry = Math.random() * 40;
        this.x += Math.random()* pwrx * signy;
        this.y -= Math.random()* pwry * signx;
        this.x++;
    }
}

class Effect {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.createParticles();
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context){
        this.particles.forEach(function(particle){
            particle.draw(context);
            particle.update();
        });
    }
}
const effect = new Effect(canvas);

function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();