async function main() {
    const response_r = await fetch('http://localhost:7500/obtainItems', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response_r.ok) {
        throw new Error('Error al obtener los items: ' + response_r.statusText);
    }

    const items = await response_r.json(); 
    console.log(items);

    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; 

    if (!items || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay items disponibles o el item solicitado no existe.';
        itemList.appendChild(li);
        return; 
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `ID: ${item.id}, Nombre: ${item.name}, Tipo: ${item.type}, Efecto: ${item.effect}`;
        itemList.appendChild(li);
    });

} 

main();
