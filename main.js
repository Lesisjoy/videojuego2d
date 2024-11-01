// Al hacer clic en el botón, recargar la página
document.getElementById("startButton").addEventListener("click", function() {
    location.reload();  // Recarga la página
});

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

// Carga de imágenes
const images = [];
const numImages = 4; // Número de imágenes a usar
for (let i = 0; i < numImages; i++) {
    const img = new Image();
    img.src = `assets/img/zombie${i + 1}.png`;
    images.push(img);
}

// Cargar imagen de fondo
const backgroundImg = new Image();
backgroundImg.src = 'assets/img/FondoZombie.png'; 

class MovingImage {
    constructor(x, y, width, height, speed, image) {
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;
    }

    draw(context) {
        context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }

    update() {
        this.posX -= this.speed; // Mover hacia la izquierda
        if (this.posX + this.width < 0) {
            this.posX = window_width; // Reiniciar en el borde derecho
        }
    }

    isPointInside(x, y) {
        return x > this.posX && x < this.posX + this.width &&
               y > this.posY && y < this.posY + this.height;
    }
}

// Crear un array para almacenar imágenes en movimiento
let movingImages = [];
let score = 0;

// Función para generar imágenes aleatorias que se muevan de derecha a izquierda
function generateImages(n) {
    for (let i = 0; i < n; i++) {
        const width = 140; // Ancho de las imágenes
        const height = 140; // Alto de las imágenes
        const x = window_width + Math.random() * 100; // Comenzar fuera de la pantalla a la derecha
        const y = Math.random() * (window_height - height); // Posición vertical aleatoria
        const speed = Math.random() * 4 + 2; // Velocidad entre 2 y 4
        const image = images[Math.floor(Math.random() * numImages)]; // Seleccionar imagen aleatoria

        const newImage = new MovingImage(x, y, width, height, speed, image);
        movingImages.push(newImage);
    }
}

// Función para animar las imágenes
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas

    // Dibujar imagen de fondo
    ctx.drawImage(backgroundImg, 0, 0, window_width, window_height); // Dibuja la imagen de fondo

    movingImages.forEach((img) => {
        img.update(); // Actualizar cada imagen
        img.draw(ctx); // Dibujar cada imagen

        // Reiniciar imagen si sale del canvas
        if (img.posX + img.width < 0) {
            img.posX = window_width; // Reiniciar en el borde derecho
        }
    });

    // Actualizar el puntaje en el div
    document.getElementById('score').innerText = `Puntaje: ${score}`;

    requestAnimationFrame(animate); // Repetir la animación
}

// Detectar el clic del mouse y eliminar imágenes
canvas.addEventListener('click', function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Filtrar imágenes de forma más eficiente
    movingImages = movingImages.filter(img => {
        if (img.isPointInside(mouseX, mouseY)) {
            score++; // Aumentar puntaje si se hace clic en la imagen
            
            // Verificar si el puntaje es 25 para mostrar el mensaje de "Ganaste el juego"
            if (score === 25) {
                alert("¡Ganaste el juego!"); // Mostrar mensaje de victoria
            }

            return false; // Eliminar la imagen
        }
        return true; // Mantener la imagen
    });
});

// Generar imágenes y comenzar la animación
generateImages(25); // Cambia el número de imágenes según sea necesario
animate();
