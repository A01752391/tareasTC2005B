async function deleteItem(id) {
    const response = await fetch(`http://localhost:7500/items/delete/${id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    console.log(result.message);
}