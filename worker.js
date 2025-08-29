if (this.connect) {
    if (distance < this.maxdistance) {
        this.context.save();
        const opacity = 1 - (distance / this.maxdistance);
        this.context.globalAlpha = opacity;
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.stroke();
        this.context.restore();
    }
}