/*
•⁠  ⁠Show text on the Canvas with specific parameters
*
•⁠  ⁠Miranda Urban Solano
* 
•⁠  ⁠9 de abril de 2025
*/

class TextLabel {
    constructor(position, font, color) {
        this.position = position;
        this.font = font;
        this.color = color;
    }

    // Draw text on the canvas
    draw(ctx, text){
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.position.x, this.position.y);
    }
}