import { Effect } from "./Effect.js";

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.oncontextmenu = (e) => {
    e.preventDefault();
};

const effect = new Effect(canvas);
let appeared = false;
let appeared2 = false;
effect.animate();

const numberOfParticles = document.getElementById('nop');
numberOfParticles.value = effect.numberOfParticles;
numberOfParticles.addEventListener('input' , () => {
    let proceed;
    if (numberOfParticles.value > 100 && !appeared){
        proceed = confirm('You seem to have chosen a very large number for your particles.\n Do you wish to proceed?');
        if (proceed) appeared = true;
        else return;
    }
    effect.updateParticles(numberOfParticles.value);
});

const simulationSpeed = document.getElementById('speed');
simulationSpeed.value = effect.speed;
simulationSpeed.addEventListener('input' , () => {
    let proceed2;
    if (simulationSpeed.value > 100 && !appeared2){
        proceed2 = confirm('Are you sure you want your particle going so fast? (you might not be able to see them)');
        if (proceed2) appeared2 = true;
        else return;
    }
    effect.speed = simulationSpeed.value;
});

const collisionCheck = document.getElementById('collision');
effect.collide = collisionCheck.checked;
collisionCheck.addEventListener('input', () => {
    effect.collide = collisionCheck.checked;
});

const connectCheck = document.getElementById('connect');
effect.connect = connectCheck.checked;
connectCheck.addEventListener('input', () => {
    effect.connect = connectCheck.checked;
    connectDistance.parentElement.hidden = !effect.connect;
});

const connectDistance = document.getElementById('connectDistance');
connectDistance.value = effect.maxdistance;
connectDistance.parentElement.hidden = connectCheck.value;
connectDistance.addEventListener('input', () => {
    effect.maxdistance = connectDistance.value;
});

const mouseInteractionCheck = document.getElementById('mouse');
mouseInteractionCheck.checked = effect.mouse.active;
let mouseWasChecked = mouseInteractionCheck.checked;
mouseInteractionCheck.addEventListener('input', () => {
    effect.mouse.active = mouseInteractionCheck.checked;
    mouseRadius.parentElement.hidden = !effect.mouse.active;
    mouseWasChecked = mouseInteractionCheck.checked;
});

const mouseRadius = document.getElementById('mouseRadius');
mouseRadius.value = effect.mouse.radius;
mouseRadius.parentElement.hidden = !mouseRadius.value;
mouseRadius.addEventListener('input', () => {
    effect.mouse.radius = mouseRadius.value;
});

const randomRadiusCheck = document.getElementById('randomRadius');
effect.constRadius = !randomRadiusCheck.checked;
randomRadiusCheck.addEventListener('input', () => {
    effect.constRadius = !randomRadiusCheck.checked;
});

const radius = document.getElementById('radius');
radius.value = effect.particles[0].maxRadius;
radius.addEventListener('input', () => {
    const value = Number(radius.value);
    if (value > 0){
        effect.constRadius = !randomRadiusCheck.checked;
        effect.radius = value;
        effect.updateRadius(randomRadiusCheck.checked);
    }
});

const controlContainers = Array.from(document.getElementsByClassName('control-container'));
console.log(controlContainers);
controlContainers.forEach((controlContainer) => {
    controlContainer.addEventListener('mouseenter' ,() => {
        mouseWasChecked = effect.mouse.active;
        effect.mouse.active = false;
    });
    controlContainer.addEventListener('mouseleave' , () => {
        effect.mouse.active = mouseWasChecked;
    });
});

const controlPanels = Array.from(document.getElementsByClassName('control-panel'));
const collapseButtons = Array.from(document.getElementsByClassName('collapse-btn'));
const arrows = ['<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 124 124" fill="none"><path d="M86 14 L40 62 L86 110" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>', // 0: Left
                '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 124 124" fill="none"><path d="M38 110 L84 62 L38 14" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>', // 1: Right
                '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 124 124" fill="none"><path d="M14 86 L62 40 L110 86" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>', // 2: Up
                '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 124 124" fill="none"><path d="M14 38 L62 84 L110 38" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' // 3: Down
                ];

for (let i = 0; i < controlPanels.length; i++) {
    collapseButtons[i].innerHTML = arrows[i % 4];
    controlPanels[i].hidden = false;
    collapseButtons[i].addEventListener('click', () => {
        if (!controlPanels[i].hidden){
            collapseButtons[i].innerHTML = arrows[(i ^ 1) % 4];
            controlPanels[i].hidden = true;
            collapseButtons[i].style.opacity = 0.3;
            effect.mouse.active = mouseWasChecked;
        }
        else {
            collapseButtons[i].innerHTML = arrows[i % 4];
            controlPanels[i].hidden = false;
            collapseButtons[i].style.opacity = 1;
            effect.mouse.active = mouseWasChecked;
        }
    });
}