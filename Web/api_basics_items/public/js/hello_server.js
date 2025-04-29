async function main() {
    const response = await fetch('http://localhost:7500/items', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message); // Aquí ves "No hay items disponibles."
        return;
    }

    const items = await response.json();
    console.log(items); // Aquí ves el array si sí hay items
}

main();
