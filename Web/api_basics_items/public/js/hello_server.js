async function loadPage (){

    console.log('Página cargada con éxito');

}

loadPage();

async function newItems (){

    const data = {
        id: 1,
        name: "Sword",
        type: "Weapon",
        effect: "Deals damage"
    };

    const response_r = await fetch('http://localhost:7500/newItems', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    console.log(response_r)
}

newItems();

async function obtainItems() {
    const response = await fetch('http://localhost:7500/items', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message); 
        return;
    }

    const items = await response.json();
    console.log(items); 
}

obtainItems();
