const coreContainer = document.getElementById("core-content");

const manager = new Hammer.Manager(coreContainer);

const Pan = new Hammer.Pan();
const Pinch = new Hammer.Pinch();
const Tap = new Hammer.Tap();

manager.add(Pan);
manager.add(Pinch);
manager.add(Tap);

let deltaX = 0;
let currentRotation = 0.1;
let rotationSensibility = 0.1;
let currentFov = 0.1;
let liveScale = 0;

const cancelOnTouch = true;
const enableGesture = true;

function setRotationSensibility(sensibility) {
    rotationSensibility = sensibility;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function getRelativeRotation(dX) {
    return toRadians(currentRotation + dX) * rotationSensibility;
}

manager.on("panmove", function (e) {
    const dX = deltaX + e.deltaX;
    const rotation = getRelativeRotation(dX);
    core.setRotation(rotation);
});

manager.on("panend", function (e) {
    deltaX += e.deltaX;
    currentRotation = getRelativeRotation(deltaX);
});

function getRelativeScale(scale) {
    return currentFov / scale;
}

function insideZoomLimits(scale) {
    return (
        scale >= cameraYPositionBounds.min && scale <= cameraYPositionBounds.max
    );
}

const cameraYPositionBounds = {
    min: 0.1,
    max: 5,
};

manager.on("pinchmove", function (e) {
    if (enableGesture) {
        const scale = getRelativeScale(e.scale);

        if (insideZoomLimits(scale)) {
            console.log("Scale", scale);
            core.setCameraPosition({ y: scale, z: scale / 8 }, 1);

            liveScale = scale;
            currentFov = scale;
        }
    }
});
