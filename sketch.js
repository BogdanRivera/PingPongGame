let anchoCanvas = 800;
let altoCanvas = 400;

let jugadorY;
let alturaRaqueta = 100;
let anchoRaqueta = 10;
let velocidadRaqueta = 10;

let computadoraY;
let velocidadComputadora = 5;

let pelotaX, pelotaY;
let diametroPelota = 20;
let velocidadPelotaX = 5;
let velocidadPelotaY = 3;

let grosorMarco = 10; // Grosor de los marcos superior e inferior

// Variables de puntaje
let puntajeJugador = 0;
let puntajeComputadora = 0;

let fondo; // Variable para almacenar la imagen de fondo
let imagenRaquetaJugador; // Variable para almacenar la imagen de la raqueta del jugador
let imagenRaquetaComputadora; // Variable para almacenar la imagen de la raqueta de la computadora
let imagenPelota; // Variable para almacenar la imagen de la pelota

let anguloPelota = 0; // Ángulo de rotación de la pelota
let sonidoRebote; // Variable para almacenar el sonido de rebote

function preload() {
    // Cargar las imágenes
    fondo = loadImage('fondo1.png');
    imagenRaquetaJugador = loadImage('barra1.png');
    imagenRaquetaComputadora = loadImage('barra2.png');
    imagenPelota = loadImage('bola.png');

    // Cargar el sonido de rebote
    sonidoRebote = loadSound('bounce.wav');
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    jugadorY = (altoCanvas - alturaRaqueta) / 2;
    computadoraY = (altoCanvas - alturaRaqueta) / 2;
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
}

function draw() {
    // Dibujar la imagen de fondo
    background(fondo);

    // Dibujar marcos superior e inferior
    fill("#283FD6");
    rect(0, 0, anchoCanvas, grosorMarco); // Marco superior
    rect(0, altoCanvas - grosorMarco, anchoCanvas, grosorMarco); // Marco inferior

    // Dibujar raquetas utilizando las imágenes
    image(imagenRaquetaJugador, 10, jugadorY, anchoRaqueta, alturaRaqueta);
    image(imagenRaquetaComputadora, anchoCanvas - 20, computadoraY, anchoRaqueta, alturaRaqueta);

    // Dibujar y rotar la pelota
    push(); // Guardar el estado de la transformación actual
    translate(pelotaX, pelotaY); // Mover el origen al centro de la pelota
    rotate(anguloPelota); // Rotar la pelota
    imageMode(CENTER); // Dibujar la imagen desde el centro
    image(imagenPelota, 0, 0, diametroPelota, diametroPelota);
    pop(); // Restaurar el estado de la transformación

    // Dibujar los puntajes
    textSize(32);
    textAlign(CENTER, TOP);
    fill("#283FD6");
    text(puntajeJugador, anchoCanvas / 4, 10);
    text(puntajeComputadora, 3 * anchoCanvas / 4, 10);

    // Mover la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Calcular la velocidad total de la pelota
    let velocidadTotal = sqrt(sq(velocidadPelotaX) + sq(velocidadPelotaY));

    // Ajustar el ángulo de rotación en función de la velocidad de la pelota
    anguloPelota += velocidadTotal * 0.1; // Ajusta el factor de multiplicación para controlar la velocidad de giro

    // Rebote en los marcos superior e inferior
    if (pelotaY < grosorMarco || pelotaY > altoCanvas - grosorMarco) {
        velocidadPelotaY *= -1;
    }

    // Rebote en la raqueta del jugador
    if (pelotaX < 20 && pelotaX > 10 && pelotaY > jugadorY && pelotaY < jugadorY + alturaRaqueta) {
        velocidadPelotaX *= -1;
        ajustarAngulo(jugadorY);
        velocidadPelotaX *= 1.05;
        velocidadPelotaY *= 1.05;
        
        // Reproducir sonido de rebote
        sonidoRebote.play();
    }

    // Rebote en la raqueta de la computadora
    if (pelotaX > anchoCanvas - 30 && pelotaX < anchoCanvas - 20 && pelotaY > computadoraY && pelotaY < computadoraY + alturaRaqueta) {
        velocidadPelotaX *= -1;
        ajustarAngulo(computadoraY);
        velocidadPelotaX *= 1.05;
        velocidadPelotaY *= 1.05;

        // Reproducir sonido de rebote
        sonidoRebote.play();
    }

    // Mover la raqueta del jugador
    if (keyIsDown(UP_ARROW)) {
        jugadorY -= velocidadRaqueta;
    }

    if (keyIsDown(DOWN_ARROW)) {
        jugadorY += velocidadRaqueta;
    }

    // Limitar la raqueta del jugador dentro del canvas
    jugadorY = constrain(jugadorY, grosorMarco, altoCanvas - alturaRaqueta - grosorMarco);

    // Mover la raqueta de la computadora
    if (pelotaY > computadoraY + alturaRaqueta / 2) {
        computadoraY += velocidadComputadora;
    } else {
        computadoraY -= velocidadComputadora;
    }

    // Limitar la raqueta de la computadora dentro del canvas
    computadoraY = constrain(computadoraY, grosorMarco, altoCanvas - alturaRaqueta - grosorMarco);

    // Verificar si la pelota sale por la izquierda o derecha
    if (pelotaX < 0) {
        puntajeComputadora++;
        reiniciarPelota();
    } else if (pelotaX > anchoCanvas) {
        puntajeJugador++;
        reiniciarPelota();
    }
}

// Función para ajustar el ángulo de la pelota al rebotar en una raqueta
function ajustarAngulo(raquetaY) {
    let impacto = pelotaY - raquetaY;
    let porcentajeImpacto = impacto / alturaRaqueta;
    let anguloMax = 75; // Grados
    let angulo = map(porcentajeImpacto, 0, 1, -anguloMax, anguloMax);

    velocidadPelotaY = velocidadPelotaX * tan(radians(angulo));
}

// Función para reiniciar la pelota después de un gol
function reiniciarPelota() {
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    velocidadPelotaX = random(4, 6) * (velocidadPelotaX > 0 ? 1 : -1);
    velocidadPelotaY = random(3, 5) * (velocidadPelotaY > 0 ? 1 : -1);
    anguloPelota = 0; // Reiniciar el ángulo de rotación de la pelota
}
