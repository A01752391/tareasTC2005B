# Breakout Game

## Descripción

Este es un juego de Breakout implementado en JavaScript donde controlas un paddle para rebotar una pelota y destruir bloques. Es posible recolectar monedas animadas para ganar vidas extra. El objetivo es destruir todos los bloques, 60 en total, para ganar el juego.

## Requisitos

- Un navegador web moderno que soporte HTML5 y JavaScript.
- Asegúrate de tener acceso a la carpeta `assets` donde se encuentran la imagen de `coin_gold.png`.

## Instrucciones para correr el juego

1. Abre el archivo HTML en el navegador
2. Asegúrate de que la carpeta `assets` con las imágenes esté correctamente ubicada en el mismo directorio que el archivo HTML.
3. El juego se inicializa al presionar la barra espaciadora.

Una alternativa a esto es acceder al juego a través de este [link](https://a01752391.github.io/tareasTC2005B/Videojuegos/Breakout/breakout.html).

## Controles del Juego

- **A** para mover el paddle hacia la izquierda.
- **S** para mover el paddle hacia la derecha.
- **Barra espaciadora** para iniciar el juego/lanzar la pelota.

## Lógica del Juego

1. Controlas un paddle en la parte inferior de la pantalla
2. La pelota rebota destruyendo bloques de colores
3. Monedas animadas aparecen aleatoriamente en el área de juego
4. Mecánicas principales:
   - Cada bloque destruido suma 1 punto (60 bloques en total)
   - Cada moneda recolectada otorga 1 vida extra
   - Pierdes 1 vida cuando la pelota cae al fondo
   - La velocidad aumenta cada 10 bloques destruidos
5. Condiciones de victoria/derrota:
   - Ganas al destruir todos los bloques (60 puntos)
   - Pierdes al quedarte sin vidas (comienzas con 3)
