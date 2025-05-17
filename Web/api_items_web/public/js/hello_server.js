const resultBox = document.getElementById('api_result');

async function showResult(message, isError = false) {
    resultBox.textContent = message;
    if (isError) {
        resultBox.style.color = 'red';
    } else {
        resultBox.style.color = 'black';
    }
}

async function loadPage(){
    console.log('Página cargada con éxito');
    showResult('Page loaded!!');
}

async function newItem(){
    const itemData = {
        id: document.getElementById('newItemID').value,
        name: document.getElementById('itemName').value,
        type: document.getElementById('itemType').value,
        effect: document.getElementById('itemEffect').value
    };

    if (!itemData.id || !itemData.name || !itemData.type || !itemData.effect) {
        showResult('All fields are required', true);
        return;
    }
    try {
        const response = await fetch('http://localhost:7500/newItems', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(itemData)
        });
        const result = await response.json();
        console.log(result.message);
        showResult(result.message);
    } catch (error) {
        console.error('Error adding item:', error);
        showResult('Error adding item', true);
    }
}

async function obtainItems() {
    const resultBox = document.getElementById('api_result');

    try {
        const response = await fetch('http://localhost:7500/items', {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            showResult(errorData.message);
            return;
        }

        const items = await response.json();
        console.log('Items:', items);

        const itemsDetails = items.map(item => 
            `ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Effect: ${item.effect}`
        ).join('\n\n');
        
        showResult(`Items:\n${itemsDetails}`);

    } catch (error) {
        console.error('Error fetching items:', error);
        showResult('Error fetching items', true);
    }
}

async function obtainItemsID() {
    const itemData = {
        id: document.getElementById('obtainID').value,
    };

    if (!itemData.id) {
        obtainItems();
        return;
    }

    const response = await fetch(`http://localhost:7500/items/${itemData.id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(result.message);
        showResult(result.message, true);
        return;
    }
    
    const itemDetails = `ID ${result.id}, Name: ${result.name}, Type: ${result.type}, Effect: ${result.effect}`;
        
    showResult(`Items:\n${itemDetails}`);

    console.log(result);
}

async function deleteItem() {
    const itemData = {
        id: document.getElementById('deleteitemID').value,
    };

    if (!itemData.id) {
        showResult('ID is missing', true);
        return;
    }
    try {
        const response = await fetch(`http://localhost:7500/items/delete/${itemData.id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        console.log(result.message);
        
        showResult(result.message);
    } catch (error) {
        console.error('Error deleting item:', error);
        showResult(result.message);
    }
}

async function updateItem() {
    const id = document.getElementById('updateitemID').value;
    const name = document.getElementById('updateitemName').value;
    const type = document.getElementById('updateitemType').value;
    const effect = document.getElementById('updateitemEffect').value;

    if (!id) {
        showResult('ID is missing', true);
        return;
    }

    const updates = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (effect) updates.effect = effect;

    try {
        const response = await fetch(`http://localhost:7500/items/update/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        const result = await response.json();
        console.log(result.message);
        console.log(result.item);

        const itemDetails = `ID: ${result.id}, Name: ${result.name}, Type: ${result.type}, Effect: ${result.effect}`;
        showResult(`Item updated:\n${itemDetails}`);

    } catch (error) {
        console.error('Error updating item:', error);
        showResult(result.message);
    }
}

// Funciones para usuarios
async function addUser() {
    const userData = {
        id: document.getElementById('newuserID').value,
        username: document.getElementById('newuserName').value,
        email: document.getElementById('newuserEmail').value,
        items: [parseInt(document.getElementById('newuserItem').value)]
    }

    if (!userData.id || !userData.username || !userData.email || !userData.items) {
        showResult('All fields are required', true);
        return;
    }

    try {
        const response = await fetch('http://localhost:7500/users/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error adding user');
        }

        console.log(result.message);
        showResult(result.message);
    } catch (error) {
        console.error('Error adding user');
        showResult('Error adding user', true);
    }
}

async function obtainUsers() {
    try {
        const response = await fetch('http://localhost:7500/users');
        
        if (!response.ok) {
            const error = await response.json();
            showResult('No users found');
        }

        const users = await response.json();

        const usersList = users.map(user => {
            const itemsCount = Array.isArray(user.items) ? user.items.length : 0;
            const itemsList = Array.isArray(user.items) ? user.items.join(', ') : 'None';
            
            return `ID: ${user.id}\nName: ${user.username || user.nombre}\nEmail: ${user.email}\nItems (${itemsCount}): ${itemsList}`;
        }).join('\n\n');

        showResult(`Users:\n${usersList}`);
        console.log('Users data:', users);
    } catch (error) {
        console.error('Error fetching users:', error);
        showResult('Error fetching users:' + error.message, true);
    }
}

async function getUserID() {
    const users = document.getElementById('getUserID').value;
    
    if (!users) {
        obtainUsers();
        return;
    }

    try {
        const response = await fetch(`http://localhost:7500/users/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Error:', result.message);
            showResult(`Error: ${errorData.message}`, true);
            return;
        }
        
        console.log('User details:', result);
         const itemsList = user.items?.map(item => 
            `- ${item.name} (${item.type})`
        ).join('\n') || 'No items';

        const userDetails = `ID: ${user.id}, Nombre: ${user.nombre}, Email: ${user.email}\nItems:\n${itemsList}`;
        
        showResult(`User:\n${userDetails}`);
        
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

async function deleteUserID() {
    const userData = {
        id: document.getElementById('byeuserID').value,
    };

    if (!userData.id) {
        showResult('ID is missing', true);
        return;
    }

    try {
        const response = await fetch(`http://localhost:7500/users/delete/${userData.id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        console.log(result.message);
        showResult(result.message);
    } catch (error) {
        console.error('Error deleting user:', error);
        showResult(result.message);
    }
}

async function updateUserID() {
    const id = document.getElementById('updateuserID').value.trim();
    const updates = {
            username: document.getElementById('updateuserName').value,
            email: document.getElementById('updateuserEmail').value,
            items: document.getElementById('updateuserItems').value
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '')
                .map(Number)
                .filter(item => !isNaN(item))
        };
    
    if (!id) {
        showResult('ID is missing', true);
        return;
    } 
    
    const response = await fetch(`http://localhost:7500/users/update/${id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });

    const result = await response.json();

    if (!response.ok) {
        console.log('Updated failed');
    }

    console.log(result.message);
    console.log('Updated user:', result.user);

    const formattedUser = JSON.stringify(result, null, 2)
            .replace(/"([^"]+)":/g, '$1:')
            .replace(/"([^"]+)"/g, "'$1'");
        
    showResult(`${formattedUser}`);
}

async function main() {
    //const buttonLoadPage = document.getElementById("paginaCreada");
    // buttonLoadPage.addEventListener('click', loadPage);

    // For ITEMS
    const buttonNewItem = document.getElementById("newItem");
    // const buttonObtainItems = document.getElementById("obtainItems");
    const buttonObtainItemsID = document.getElementById("obtainItemsID");
    const buttonDeleteItemsID = document.getElementById("deleteItem");
    const buttonUpdateItemsID = document.getElementById("updateItem");

    buttonNewItem.addEventListener('click', newItem);
   // buttonObtainItems.addEventListener('click', obtainItems);
    buttonObtainItemsID.addEventListener('click', obtainItemsID);
    buttonDeleteItemsID.addEventListener('click', deleteItem);
    buttonUpdateItemsID.addEventListener('click', updateItem);

    // For USERS
    const buttonAddUser = document.getElementById("addUser");
    // const buttonObtainUser = document.getElementById("obtainUsers");
    const buttonGetUserID = document.getElementById("getUserID");
    const buttonDeleteUserID = document.getElementById("deleteUserID");
    const buttonUpdateUserID = document.getElementById("updateUserID");

    buttonAddUser.addEventListener('click', addUser);
    // buttonObtainUser.addEventListener('click', obtainUsers);
    buttonGetUserID.addEventListener('click', getUserID);
    buttonDeleteUserID.addEventListener('click', deleteUserID);
    buttonUpdateUserID.addEventListener('click', updateUserID);
}

main();