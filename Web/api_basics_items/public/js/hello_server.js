async function main() {
    const response = await fetch('http://localhost:7500/items', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const items = await response.json();
    console.log(items);
}

main();