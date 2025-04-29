async function main(id, updates) {
    const response = await fetch(`http://localhost:7500/items/update/${id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    const result = await response.json();
    console.log(result.message);
    console.log(result.item);
}

main();