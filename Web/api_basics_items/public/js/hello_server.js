async function main(id) {
    const response = await fetch(`http://localhost:7500/items/${id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const result = await response.json();
        console.log(result.message);  
        document.getElementById('errorMessage').innerText = result.message; 
        return;
    }

    const item = await response.json();
    console.log(item);
    document.getElementById('itemDetails').innerText = `ID: ${item.id}, Nombre: ${item.name}, Tipo: ${item.type}, Efecto: ${item.effect}`; // Muestra los detalles en el HTML
}

main();