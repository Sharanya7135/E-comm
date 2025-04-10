// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyATRfBpWZ1DMneSbHlICmAOjrG3Xaidh7U",
    authDomain: "",
    databaseURL: "https://productdb-c518a-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "productdb-c518a",
    storageBucket: "",
    messagingSenderId: "227234885923",
    appId: "1:227234885923:web:a5726dfe2d07abad255c96"
};

// ✅ Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const productsRef = db.ref("products");

// ✅ Fetch Products & Display in Admin Panel
function fetchProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear old products

    productsRef.on("value", function (snapshot) {
        productList.innerHTML = ""; // Clear before updating
        snapshot.forEach(function (childSnapshot) {
            const product = childSnapshot.val();
            const productId = childSnapshot.key;

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.id = `product-${productId}`;
            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.title}">
                <p><strong>${product.title}</strong></p>
                <p><strong>Price:</strong> ₹${product.final_price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <button class="edit" onclick="editProduct('${productId}', '${product.title}', '${product.description}', ${product.final_price}, '${product.image_url}', ${product.stock})">Edit</button>
                <button onclick="deleteProduct('${productId}')">Delete</button>
            `;
            productList.appendChild(productCard);
        });
    });
}

// ✅ Add Product
document.getElementById("add-product-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const final_price = parseFloat(document.getElementById("final_price").value);
    const image_url = document.getElementById("image_url").value;
    const stock = parseInt(document.getElementById("stock").value);

    const newProductRef = productsRef.push();
    newProductRef.set({
        title, description, final_price, image_url, stock
    }).then(() => {
        alert("Product Added Successfully!");
        document.getElementById("add-product-form").reset();
    }).catch(error => console.error("Error adding product:", error));
});

// ✅ Delete Product
function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        productsRef.child(productId).remove()
            .then(() => alert("Product Deleted"))
            .catch(error => console.error("Error deleting product:", error));
    }
}

// ✅ Edit Product (Show Form with Existing Values)
function editProduct(productId, title, description, final_price, image_url, stock) {
    const productDiv = document.getElementById(`product-${productId}`);
    
    productDiv.innerHTML = `
        <input type="text" id="edit-title-${productId}" value="${title}">
        <input type="text" id="edit-description-${productId}" value="${description}">
        <input type="number" id="edit-price-${productId}" value="${final_price}">
        <input type="text" id="edit-image-${productId}" value="${image_url}">
        <input type="number" id="edit-stock-${productId}" value="${stock}">
        <button class="update" onclick="updateProduct('${productId}')">Update</button>
        <button class="cancel" onclick="fetchProducts()">Cancel</button>
    `;
}

// ✅ Update Product
function updateProduct(productId) {
    const title = document.getElementById(`edit-title-${productId}`).value.trim();
    const description = document.getElementById(`edit-description-${productId}`).value.trim();
    const final_price = parseFloat(document.getElementById(`edit-price-${productId}`).value);
    const image_url = document.getElementById(`edit-image-${productId}`).value.trim();
    const stock = parseInt(document.getElementById(`edit-stock-${productId}`).value);

    if (!title || !description || !image_url || isNaN(final_price) || isNaN(stock)) {
        alert("Please fill all fields correctly!");
        return;
    }

    productsRef.child(productId).update({ title, description, final_price, image_url, stock })
        .then(() => {
            alert("Product Updated Successfully!");
            fetchProducts(); // Reload updated products
        })
        .catch(error => console.error("Error updating product:", error));
}
// ✅ Product Search Function
document.getElementById("search-box").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        const title = product.querySelector("p strong").innerText.toLowerCase();
        product.style.display = title.includes(searchText) ? "block" : "none";
    });
});

// ✅ Fetch products when the admin page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
