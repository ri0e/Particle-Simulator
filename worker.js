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

function boundaryCheck(particle, width, height) {
    const speedAfterCollision = -0.5;
    if (particle.x < particle.radius) {
        particle.x = particle.radius;
        if (particle.vx < 0) particle.vx *= speedAfterCollision;
    } else if (particle.x > width - particle.radius) {
        particle.x = width - particle.radius;
        if (particle.vx > 0) particle.vx *= speedAfterCollision;
    }
    if (particle.y < particle.radius) {
        particle.y = particle.radius;
        if (particle.vy < 0) particle.vy *= speedAfterCollision;   
    } else if (particle.y > height - particle.radius) {
        particle.y = height - particle.radius;
        if (particle.vy > 0) particle.vy *= speedAfterCollision;
    }
}

function applyGravity(particle, gravity) {
    if (gravity > 0) {
        particle.vy += gravity;
    }
}

function collision(particles){
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const p1 = particles[a];
            const p2 = particles[b];
            
            const contact = p1.radius + p2.radius;
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.hypot(dx, dy);

            if (distance < contact) {
                const overlap = contact - distance;
                if (overlap > 0) {
                    const totalMass = p1.mass + p2.mass;
                    const separationX = (overlap * dx / distance);
                    const separationY = (overlap * dy / distance);
                    p1.x += separationX * (p2.mass / totalMass);
                    p1.y += separationY * (p2.mass / totalMass);
                    p2.x -= separationX * (p1.mass / totalMass);
                    p2.y -= separationY * (p1.mass / totalMass);
                }

                const angle = Math.atan2(dy, dx);
                const v1 = {
                    x: p1.vx * Math.cos(angle) + p1.vy * Math.sin(angle),
                    y: p1.vy * Math.cos(angle) - p1.vx * Math.sin(angle)
                };
                const v2 = {
                    x: p2.vx * Math.cos(angle) + p2.vy * Math.sin(angle),
                    y: p2.vy * Math.cos(angle) - p2.vx * Math.sin(angle)
                };

                const v1FinalX = ((p1.mass - p2.mass) * v1.x + 2 * p2.mass * v2.x) / (p1.mass + p2.mass);
                const v2FinalX = ((p2.mass - p1.mass) * v2.x + 2 * p1.mass * v1.x) / (p1.mass + p2.mass);

                p1.vx = v1FinalX * Math.cos(angle) - v1.y * Math.sin(angle);
                p1.vy = v1FinalX * Math.sin(angle) + v1.y * Math.cos(angle);
                p2.vx = v2FinalX * Math.cos(angle) - v2.y * Math.sin(angle);
                p2.vy = v2FinalX * Math.sin(angle) + v2.y * Math.cos(angle);
            }
        }
    }
}

self.onmessage = e => {
    const { particles, mouse, speed, gravity, width, height, collide, boundaryCheckOp, gravityOp} = e.data;

    particles.forEach(p => {
        if (!p.isBeingEdited) {
            if (boundaryCheckOp) boundaryCheck(p, width, height)
            if (gravityOp && collide) applyGravity(p, gravity);
            mouseInteraction(p, mouse);

            p.x += (p.vx * Math.abs(speed));
            p.y += (p.vy * Math.abs(speed));
        }
    });

    if (collide)
        collision(particles);

    self.postMessage(particles);
};
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