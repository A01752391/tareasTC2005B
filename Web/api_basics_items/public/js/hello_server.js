async function main(id) {
    const response = await fetch(`http://localhost:7500/users/delete/${id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(result.message);
        document.getElementById('errorMessage').innerText = result.message;
        return;
    }

    console.log(result.message);
    document.getElementById('userDeleted').innerText = `Usuario eliminado: ${result.user.username}`;
}

main();