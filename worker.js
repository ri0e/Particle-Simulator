function mouseInteraction(particle, mouse) {
    if (mouse.pressed) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
            if (mouse.left) {
                const pushForce = (1 - (distance / mouse.radius));
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * pushForce;
                particle.vy += Math.sin(angle) * pushForce;
            }
            if (mouse.right) {
                const pullForce = -0.05;
                const dampening = 0.75;

                particle.vx += dx * pullForce;
                particle.vy += dy * pullForce;

                particle.vx *= dampening;
                particle.vy *= dampening;
            }
        }
    }
}

function boundaryCheck(particle) {
    if (particle.x < particle.radius) {
        particle.x = particle.radius;
        if (particle.vx < 0) particle.vx *= -0.3;
    } else if (particle.x > particle.effect.width - particle.radius) {
        particle.x = particle.effect.width - particle.radius;
        if (particle.vx > 0) particle.vx *= -0.3;
    }
    if (particle.y < particle.radius) {
        particle.y = particle.radius;
        if (particle.vy < 0) particle.vy *= -0.3;
    } else if (particle.y > particle.effect.height - particle.radius) {
        particle.y = particle.effect.height - particle.radius;
        if (particle.vy > 0) particle.vy *= -0.3;
    }
}

function gravity(particle, gravity) {
    if (gravity > 0) {
        particle.vy += gravity;
    }
}

self.onmessage = e => {
    // particle array from effect.
    particles.forEach(p => {
        if (!p.isBeingEdited) {
            mouseInteraction(p, mouse);
            gravity(p);
        }
    });

    for (let i = 0; i < collisionIterations; i++) {
        resolveCollisions(particles);
    }
};
// 
// if (this.connect) {
//     if (distance < this.maxdistance) {
//         this.context.save();
//         const opacity = 1 - (distance / this.maxdistance);
//         this.context.globalAlpha = opacity;
//         this.context.beginPath();
//         this.context.moveTo(p1.x, p1.y);
//         this.context.lineTo(p2.x, p2.y);
//         this.context.stroke();
//         this.context.restore();
//     }
// }