import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ============================================================
// SETUP
// ============================================================

const canvas = document.getElementById("game");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b9df);
scene.fog = new THREE.Fog(0x87b9df, 70, 180);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    300
);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// ============================================================
// LIGHTING
// ============================================================

const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x35552d,
    2
);

scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(40, 70, 30);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);

// ============================================================
// FOOTBALL FIELD
// ============================================================

const fieldMaterial = new THREE.MeshStandardMaterial({
    color: 0x277a38
});

const field = new THREE.Mesh(
    new THREE.BoxGeometry(54, 0.5, 100),
    fieldMaterial
);

field.position.y = -0.25;
field.receiveShadow = true;

scene.add(field);

// Field lines

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

function createLine(width, depth, x, y, z) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.04, depth),
        lineMaterial
    );

    line.position.set(x, y, z);

    scene.add(line);

    return line;
}

// Sidelines
createLine(0.2, 100, -27, 0.03, 0);
createLine(0.2, 100, 27, 0.03, 0);

// End lines
createLine(54, 0.2, 0, 0.03, -50);
createLine(54, 0.2, 0, 0.03, 50);

// Yard lines
for (let z = -40; z <= 40; z += 10) {
    createLine(54, 0.15, 0, 0.03, z);
}

// ============================================================
// END ZONES
// ============================================================

const endZoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x174a9e
});

const endZone1 = new THREE.Mesh(
    new THREE.BoxGeometry(53.5, 0.03, 10),
    endZoneMaterial
);

endZone1.position.set(0, 0.04, -45);

scene.add(endZone1);

const endZone2 = new THREE.Mesh(
    new THREE.BoxGeometry(53.5, 0.03, 10),
    endZoneMaterial
);

endZone2.position.set(0, 0.04, 45);

scene.add(endZone2);

// ============================================================
// GOAL POSTS
// ============================================================

function createGoalPost(z) {

    const material = new THREE.MeshStandardMaterial({
        color: 0xffd23f
    });

    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 8, 16),
        material
    );

    pole.position.set(0, 4, z);

    scene.add(pole);

    const left = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 10, 12),
        material
    );

    left.rotation.z = Math.PI / 2;
    left.position.set(-5, 8, z);

    scene.add(left);

    const right = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 10, 12),
        material
    );

    right.rotation.z = Math.PI / 2;
    right.position.set(5, 8, z);

    scene.add(right);
}

createGoalPost(-50);
createGoalPost(50);

// ============================================================
// BIKE
// ============================================================

const bike = new THREE.Group();

scene.add(bike);

const bikeBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xd62828,
    metalness: 0.3,
    roughness: 0.5
});

const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7
});

// Main body
const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.45, 2.1),
    bikeBodyMaterial
);

body.position.y = 0.75;
body.castShadow = true;

bike.add(body);

// Seat
const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.15, 0.65),
    blackMaterial
);

seat.position.set(0, 1.05, 0.25);
seat.castShadow = true;

bike.add(seat);

// Wheels
const wheelGeometry = new THREE.CylinderGeometry(
    0.48,
    0.48,
    0.18,
    24
);

wheelGeometry.rotateZ(Math.PI / 2);

function createWheel(z) {

    const wheel = new THREE.Mesh(
        wheelGeometry,
        blackMaterial
    );

    wheel.position.set(0, 0.48, z);
    wheel.castShadow = true;

    bike.add(wheel);

    return wheel;
}

const frontWheel = createWheel(-0.75);
const rearWheel = createWheel(0.75);

// Handlebars
const handlebars = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.12, 0.12),
    bikeBodyMaterial
);

handlebars.position.set(0, 1.15, -0.78);

bike.add(handlebars);

// Rider
const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0b58d
});

const riderHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 12),
    skinMaterial
);

riderHead.position.set(0, 1.85, 0.15);
riderHead.castShadow = true;

bike.add(riderHead);

// Helmet
const helmetMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d3557
});

const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 16, 12),
    helmetMaterial
);

helmet.scale.y = 0.75;
helmet.position.set(0, 2.03, 0.15);

bike.add(helmet);

// Rider body
const riderBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.7, 0.4),
    bikeBodyMaterial
);

riderBody.position.set(0, 1.45, 0.15);
riderBody.castShadow = true;

bike.add(riderBody);

// Starting position
bike.position.set(0, 0, 30);

// ============================================================
// FOOTBALL
// ============================================================

const footballGroup = new THREE.Group();
scene.add(footballGroup);

const footballMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8
});

const football = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 10),
    footballMaterial
);

football.scale.set(1.35, 0.8, 0.8);
football.castShadow = true;

footballGroup.add(football);

// Starting position of football
footballGroup.position.set(0, 0.35, 24);

let hasFootball = false;
let footballThrown = false;

const footballVelocity = new THREE.Vector3();

const footballGravity = 18;

// ============================================================
// CONTROLS
// ============================================================

const keys = {};

window.addEventListener("keydown", (event) => {

    if (
        event.code === "Space" ||
        event.code === "KeyW" ||
        event.code === "KeyA" ||
        event.code === "KeyS" ||
        event.code === "KeyD" ||
        event.code === "KeyF" ||
event.code === "KeyE" ||
event.code === "KeyR"
    ) {
        event.preventDefault();
    }

    keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {

    keys[event.code] = false;
});

// ============================================================
// MOUSE LOOK
// ============================================================

let cameraYaw = 0;
let cameraPitch = -0.12;

canvas.addEventListener("click", () => {

    if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
    }

});

document.addEventListener("mousemove", (event) => {

    if (document.pointerLockElement !== canvas) {
        return;
    }

    cameraYaw -= event.movementX * 0.0025;
    cameraPitch -= event.movementY * 0.0018;

    cameraPitch = Math.max(
        -0.65,
        Math.min(0.35, cameraPitch)
    );

});

// ============================================================
// PLAYER PHYSICS
// ============================================================

let velocityY = 0;
let jumping = false;

let jumpCharge = 0;

let currentSpeed = 0;

const normalMaxSpeed = 14;
const wheelieMaxSpeed = 21;

const acceleration = 18;
const braking = 22;

const gravity = 25;

const jumpPower = 11;

// ============================================================
// POSITION / ROLE
// ============================================================

let position = "QB";

const positionElement = document.getElementById("position");

document.addEventListener("keydown", (event) => {

    if (event.code === "Digit1") {
        position = "QB";
    }

    if (event.code === "Digit2") {
        position = "RB";
    }

    if (event.code === "Digit3") {
        position = "WR";
    }

    if (event.code === "Digit4") {
        position = "TE";
    }

    if (positionElement) {
        positionElement.textContent = position;
    }

});

// ============================================================
// JUMP
// ============================================================

function updateJump(dt) {

    // Hold space to charge
    if (keys.Space && !jumping) {

        jumpCharge += dt;

        jumpCharge = Math.min(jumpCharge, 1.5);

    }

    // Gravity
    if (jumping) {

        velocityY -= gravity * dt;

        bike.position.y += velocityY * dt;

        if (bike.position.y <= 0) {

            bike.position.y = 0;
            velocityY = 0;
            jumping = false;

        }

    }

}

// When space is released, jump
window.addEventListener("keyup", (event) => {

    if (event.code !== "Space") {
        return;
    }

    if (jumping) {
        return;
    }

    if (jumpCharge <= 0) {
        return;
    }

    const power = jumpCharge / 1.5;

    velocityY = jumpPower * (0.65 + power * 0.8);

    jumping = true;

    jumpCharge = 0;

});

// ============================================================
// MOVEMENT
// ============================================================

function updateMovement(dt) {

    const wheelie = keys.KeyF;

    const maxSpeed = wheelie
        ? wheelieMaxSpeed
        : normalMaxSpeed;

    // W = accelerate
    if (keys.KeyW) {

        currentSpeed += acceleration * dt;

    }
    else if (keys.KeyS) {

        currentSpeed -= braking * dt;

    }
    else {

        currentSpeed *= Math.pow(0.1, dt);

    }

    currentSpeed = THREE.MathUtils.clamp(
        currentSpeed,
        -6,
        maxSpeed
    );

    // Steering is disabled while wheelieing
    if (!wheelie) {

        if (keys.KeyA) {
            bike.rotation.y += 2.5 * dt;
        }

        if (keys.KeyD) {
            bike.rotation.y -= 2.5 * dt;
        }

    }

    // Move bike forward
    const direction = new THREE.Vector3(
        0,
        0,
        -1
    );

    direction.applyQuaternion(bike.quaternion);

    bike.position.addScaledVector(
        direction,
        currentSpeed * dt
    );

    // Keep bike on field
    bike.position.x = THREE.MathUtils.clamp(
        bike.position.x,
        -25,
        25
    );

    bike.position.z = THREE.MathUtils.clamp(
        bike.position.z,
        -48,
        48
    );

    // Wheelie visual
    const targetTilt = wheelie ? -0.3 : 0;

    bike.rotation.x = THREE.MathUtils.lerp(
        bike.rotation.x,
        targetTilt,
        8 * dt
    );

}

// ============================================================
// FOOTBALL UPDATE
// ============================================================

function updateFootball(dt) {

    // --------------------------------------------------------
    // PICK UP FOOTBALL
    // --------------------------------------------------------

    if (
        keys.KeyE &&
        !hasFootball &&
        !footballThrown
    ) {

        const distance = bike.position.distanceTo(
            footballGroup.position
        );

        if (distance < 2.5) {

            hasFootball = true;

            footballThrown = false;

            footballVelocity.set(0, 0, 0);
        }
    }

    // --------------------------------------------------------
    // CARRY FOOTBALL
    // --------------------------------------------------------

    if (hasFootball) {

        const carryPosition = new THREE.Vector3(
            0.7,
            1.0,
            -0.8
        );

        carryPosition.applyQuaternion(
            bike.quaternion
        );

        footballGroup.position.copy(
            bike.position
        ).add(carryPosition);

        footballGroup.rotation.copy(
            bike.rotation
        );

        // ----------------------------------------------------
        // THROW
        // ----------------------------------------------------

        if (keys.KeyR) {

            hasFootball = false;
            footballThrown = true;

            // Camera direction
            const throwDirection = new THREE.Vector3(
                0,
                0,
                -1
            );

            const cameraRotation = new THREE.Euler(
                cameraPitch,
                cameraYaw,
                0,
                "YXZ"
            );

            throwDirection.applyEuler(
                cameraRotation
            );

            throwDirection.normalize();

            // Throw speed
            footballVelocity.copy(
                throwDirection.multiplyScalar(24)
            );

            // Extra upward force
            footballVelocity.y += 6;

            // Move ball slightly away from bike
            footballGroup.position.addScaledVector(
                throwDirection,
                1.0
            );
        }
    }

    // --------------------------------------------------------
    // BALL IN FLIGHT
    // --------------------------------------------------------

    if (footballThrown) {

        footballVelocity.y -= footballGravity * dt;

        footballGroup.position.addScaledVector(
            footballVelocity,
            dt
        );

        // Spin the football
        footballGroup.rotation.x += 8 * dt;
        footballGroup.rotation.z += 5 * dt;

        // --------------------------------------------------------
// KEEP FOOTBALL INSIDE FIELD
// --------------------------------------------------------

const fieldLimitX = 26;
const fieldLimitZ = 49;

if (footballGroup.position.x < -fieldLimitX) {
    footballGroup.position.x = -fieldLimitX;
    footballVelocity.x = Math.abs(footballVelocity.x) * 0.65;
}

if (footballGroup.position.x > fieldLimitX) {
    footballGroup.position.x = fieldLimitX;
    footballVelocity.x = -Math.abs(footballVelocity.x) * 0.65;
}

if (footballGroup.position.z < -fieldLimitZ) {
    footballGroup.position.z = -fieldLimitZ;
    footballVelocity.z = Math.abs(footballVelocity.z) * 0.65;
}

if (footballGroup.position.z > fieldLimitZ) {
    footballGroup.position.z = fieldLimitZ;
    footballVelocity.z = -Math.abs(footballVelocity.z) * 0.65;
}

        // Ground collision
        if (footballGroup.position.y < 0.35) {

            footballGroup.position.y = 0.35;

            footballVelocity.y *= -0.45;

            footballVelocity.x *= 0.82;
            footballVelocity.z *= 0.82;

            // Stop bouncing when slow
            if (
                Math.abs(footballVelocity.y) < 1 &&
                footballVelocity.length() < 2
            ) {
                footballVelocity.set(0, 0, 0);
            }
        }

        // Pick the ball back up
        const distanceToBike =
            bike.position.distanceTo(
                footballGroup.position
            );

        if (
            distanceToBike < 2.5 &&
            keys.KeyE
        ) {

            hasFootball = true;
            footballThrown = false;

            footballVelocity.set(0, 0, 0);
        }
    }
}

// ============================================================
// CAMERA
// ============================================================

function updateCamera(dt) {

    const distance = 8;
    const height = 4;

    const offset = new THREE.Vector3(
        0,
        height,
        distance
    );

    const rotation = new THREE.Euler(
        cameraPitch,
        cameraYaw,
        0,
        "YXZ"
    );

    offset.applyEuler(rotation);

    const target = bike.position.clone();

    target.y += 1.3;

    const desiredCameraPosition =
        target.clone().add(offset);

    camera.position.lerp(
        desiredCameraPosition,
        1 - Math.pow(0.001, dt)
    );

    camera.lookAt(target);

}

// ============================================================
// RESIZE
// ============================================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ============================================================
// GAME LOOP
// ============================================================

let lastTime = performance.now();

function gameLoop(time) {

    requestAnimationFrame(gameLoop);

    const dt = Math.min(
        (time - lastTime) / 1000,
        0.033
    );

    lastTime = time;

    updateMovement(dt);
updateJump(dt);
updateFootball(dt);
updateCamera(dt);

    renderer.render(
        scene,
        camera
    );
}

gameLoop(performance.now());
