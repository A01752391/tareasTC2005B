async function getUser(id) {
    const response = await fetch(`http://localhost:7500/users/${id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(result.message);
        document.getElementById('errorMessage').innerText = result.message;
        return;
    }

    console.log(result);
    document.getElementById('userDetails').innerText = `ID: ${result.id}, Nombre: ${result.username}, Items: ${result.items.map(i => i.name).join(", ")}`;
}

getUser();
