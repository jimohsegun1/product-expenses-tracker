let products = JSON.parse(localStorage.getItem('products')) || [];
let totalBudget = parseFloat(localStorage.getItem('totalBudget')) || 100000;
let editIndex = null;

document.getElementById('total-budget').value = totalBudget;

document.getElementById('add-product').addEventListener('click', function() {
    const productName = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    if (productName && price && quantity) {
        if (editIndex !== null) {
            // Edit the product
            products[editIndex] = { productName, price, quantity };
            editIndex = null;
        } else {
            // Add new product
            products.push({ productName, price, quantity });
        }
        saveToLocalStorage();
        updateProductTable();
        updateExpenses();
        clearForm();
    }
});

function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('totalBudget', totalBudget);
}

function updateProductTable() {
    const productTable = document.getElementById('product-table').querySelector('tbody');
    productTable.innerHTML = '';

    products.forEach((product, index) => {
        const row = productTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerText = `${product.productName} (${product.quantity}x${product.price})`;
        cell2.innerText = (product.price * product.quantity).toFixed(2);
        cell3.innerHTML = `
            <div class="actions">
                <button class="edit" onclick="editProduct(${index})">✏️</button>
                <button class="delete" onclick="deleteProduct(${index})">🗑️</button>
            </div>
        `;
    });
}

function editProduct(index) {
    const product = products[index];
    document.getElementById('product-name').value = product.productName;
    document.getElementById('price').value = product.price;
    document.getElementById('product-quantity').value = product.quantity;
    editIndex = index;
}

function deleteProduct(index) {
    products.splice(index, 1);
    saveToLocalStorage();
    updateProductTable();
    updateExpenses();
}

function updateExpenses() {
    const totalExpenses = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    totalBudget = parseFloat(document.getElementById('total-budget').value);
    document.getElementById('remaining-budget').innerText = (totalBudget - totalExpenses).toFixed(2);
    document.getElementById('display-total-budget').innerText = totalBudget.toFixed(2);
    saveToLocalStorage();
}

function clearForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('product-quantity').value = '';
}

// Initialize the UI on page load
updateProductTable();
updateExpenses();
