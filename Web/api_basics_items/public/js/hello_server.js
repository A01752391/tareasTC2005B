async function main() {
    const response = await fetch('http://localhost:7500/users');
    const data = await response.json();

    console.log(data);
}

main();
