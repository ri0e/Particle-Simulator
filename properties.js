import { effect } from "./script.js";
import { hslToHex } from "./src/functions.js";

let particle = null;
let edit = null;

//#region Properties Panel
const particleCanvas = document.getElementById('canvas2');
particleCanvas.width = 200;
particleCanvas.height = 200;
const context = particleCanvas.getContext('2d');

const particleIndex = document.getElementById('index');
const particleX = document.getElementById('X');
particleX.addEventListener('change', () => {
    if (edit) {
        particle.updatePosition('X',parseFloat(particleX.value));
        updateProperties();
    }
});

const particleY = document.getElementById('Y');
particleY.addEventListener('change', () => {
    if (edit) {
        particle.updatePosition('Y',parseFloat(particleY.value));
        updateProperties();
    }
});

const particleRadius = document.getElementById('Pradius');
particleRadius.addEventListener('change', (e) => {
    if (edit) {
        particle.updateRadius(parseFloat(particleRadius.value));
        updateProperties();
    }
});

const particleMass = document.getElementById('mass');
particleMass.addEventListener('change', () => {
    if (edit) {
        particle.mass = parseFloat(particleMass.value);
        updateProperties();
    }
});

const particleVX = document.getElementById('vx');
particleVX.addEventListener('change', () => {
    if (edit) {
        particle.vx = parseFloat(particleVX.value);
        updateProperties();
    }
});

const particleVY = document.getElementById('vy');
particleVY.addEventListener('change', () => {
    if (edit) {
        particle.vy = parseFloat(particleVY.value);
        updateProperties();
    }
});

const basedOnColor = document.getElementById('color-based');
basedOnColor.addEventListener('input', () => {
    if (edit) {
        particle.colorChosen = basedOnColor.checked;
    }
});

const particleColor = document.getElementById('colour');
particleColor.addEventListener('input', () => {
    if (edit) {
        particle.updateColor(particleColor.value);
        updateProperties();
    }
});

const editViewButton = document.getElementById('edit');
editViewButton.addEventListener('click', () => {
    edit = editViewButton.textContent === 'Edit';
    if (edit) {
        particleX.disabled = false;
        particleY.disabled = false;
        particleRadius.disabled = false;
        particleMass.disabled = false;
        particleVX.disabled = false;
        particleVY.disabled = false;
        basedOnColor.disabled = false;
        particleColor.disabled = false;
        editViewButton.style.backgroundColor = '#2977f4';
        editViewButton.textContent = 'View';
    } else {
        particleX.disabled = true;
        particleY.disabled = true;
        particleRadius.disabled = true;
        particleMass.disabled = true;
        particleVX.disabled = true;
        particleVY.disabled = true;
        basedOnColor.disabled = true;
        particleColor.disabled = true;
        editViewButton.style.backgroundColor = '#2ea44f';
        editViewButton.textContent = 'Edit';
    }
});

function updateProperties() {
    particleIndex.textContent = `Particle #${particle.index}`;
    particleX.value = particle.x;
    particleY.value = particle.y;
    particleRadius.value = particle.radius;
    particleMass.value = particle.mass;
    particleVX.value = particle.vx;
    particleVY.value = particle.vy;
    basedOnColor.checked = particle.colorChosen;
    particleColor.value = particle.colorChosen ? particle.color : hslToHex(particle.color);
}

function particleProperties() {
    if (effect.clickedParticles.length > 0) {
        particle = effect.clickedParticles[0];
        if (edit) {
            particle.isBeingEdited = true;
        } else {
            particle.isBeingEdited = false;
        }
        if (!particle.isBeingEdited) { 
            updateProperties();
        }
    } else {
        particleIndex.textContent = `Particle #null`;
        particleX.value = null;
        particleY.value = null;
        particleRadius.value = null;
        particleMass.value = null;
        particleVX.value = null;
        particleVY.value = null;
        particleColor.value = '#ffffff';
    }

    context.fillStyle = particleColor.value;
    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 2);
    context.fill();
    requestAnimationFrame(particleProperties);
}
particleProperties();
//#endregions