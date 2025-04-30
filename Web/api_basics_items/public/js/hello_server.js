async function loadPage (){

    console.log('Página cargada con éxito');

}

loadPage()

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

newItems()