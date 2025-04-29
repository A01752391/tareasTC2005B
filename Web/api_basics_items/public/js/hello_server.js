async function main(userData) {
    const response = await fetch('http://localhost:7500/users/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log(result.message);
    if (result.user) {
        console.log(result.user);
    }
}

main();