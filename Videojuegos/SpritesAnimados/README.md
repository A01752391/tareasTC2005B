# Práctica de sprites y animaciones 2D

## Descripción

Este es un juego, en JavaScript, cuya dinámica gira alrededor de recojer monedas. El jugador controla un personaje que debe moverse por la pantalla para recoger monedas. El objetivo es recoger 5 monedas para ganar y reiniciar el juego.

## Requisitos

- Un navegador web moderno que soporte HTML5 y JavaScript.
- Asegúrate de tener acceso a la carpeta `assets` donde se encuentran las imágenes necesarias para el juego, como `coin_gold.png` y `blordrough_quartermaster-NESW.png`.

## Instrucciones para correr el juego

1. Abre el archivo HTML en el navegador
2. Asegúrate de que la carpeta `assets` con las imágenes esté correctamente ubicada en el mismo directorio que el archivo HTML.
3. El juego se inicializa automáticamente al cargar la página.

Una alternativa a esto es acceder al juego a través de este [link](https://a01752391.github.io/tareasTC2005B/Videojuegos/SpritesAnimados/spritesAnimados.html)

## Controles del Juego

- **Teclas WASD** para mover al jugador:
  - **W** para mover hacia arriba.
  - **S** para mover hacia abajo.
  - **A** para mover hacia la izquierda.
  - **D** para mover hacia la derecha.

## Lógica del Juego

1. El jugador se mueve usando las teclas **WASD**.
2. El objetivo es recoger 5 monedas esparcidas aleatoriamente por la pantalla.
3. Cada vez que se recoge una moneda, el puntaje aumenta en 1.
4. Al alcanzar 5 monedas, el juego se reinicia automáticamente.
