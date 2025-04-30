async function main(id, updates) {
    const response = await fetch(`http://localhost:7500/users/update/${id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(result.message);
        document.getElementById('errorMessage').innerText = result.message;
        return;
    }

    console.log(result.message);
    console.log(result.user);
    document.getElementById('userDetails').innerText = `Actualizado: ${result.user.username}`;
}

main();