function loadBasket() {
    let basket = localStorage.getItem('basket');
    basket = JSON.parse(basket);
    console.log(basket);

    if (!Array.isArray(basket)) {
        basket = [];
        document.querySelector('.totalQuantity').textContent = 0;
    } else {
        let totalQuantity = 0;
        for (let i = 0; i < basket.length; i++) {
            totalQuantity += Number(basket[i].quantity);
            console.log(totalQuantity);
        }
        document.querySelector('.totalQuantity').textContent = totalQuantity;
    }
    return basket;
}

document.onload = loadBasket();

// On récupère les données depuis l'API avec la méthode GET
const urlOrinoco = 'http://localhost:3000/api/cameras/';

var myHeaders = new Headers({
    "Content-Type": "application/json",
});

var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    credentials: "same-origin",
    cache: 'default'
};

function getMissingProductData(id) {
    fetch(urlOrinoco + id, myInit)
        .then(response => {
            if (response.ok) {
                response => JSON.parse(response)
                response.json().then(productData => {
                    missingProductData = productData;
                    addProductInfo(productData)
                })
            } else {
                error => alert("Erreur : " + error);
            }
        });
    console.log(missingProductData);
    return missingProductData;
}

function addProductInfo() {
    let basket = loadBasket();
    console.log(basket);
    basket.forEach(basketProduct => {
        
        console.log(basket);
    });
    return basket;
}

function createProductCard() {    
    let basket = addProductInfo();
    basket.forEach(basketProduct => {

        const cameraCards = document.getElementById('basket-products-container');
        
        const productCard = document.createElement('div')
        productCard.class = "card";
        
        const productCardBody = document.createElement('div')
        productCardBody.class = "card-body";
        
        const product = document.createElement('div');
        product.id = 'productData';
        
        const image = document.createElement('img');
        image.id = 'cameraImage';
        image.src = basketProduct.imageUrl;
        
        const cameraId = basketProduct.cameraId;

        const name = document.createElement('h3');
        name.textContent = basketProduct.name;
        name.id = "cameraName";
        
        const description = document.createElement('p');
        description.textContent = basketProduct.description;
        description.id = "cameraDescription";
        
        const price = document.createElement('p');
        price.textContent = `Prix :  ${basketProduct.price/100} €`;

        const div = document.createElement('div');
        div.id = 'cameraDiv';
        
        const link = document.createElement('a');
        link.class="link"
        link.id = 'linkId';
        link.href = 'product.html?id=' + cameraId;
        link.textContent = "Voir le produit";
        
        cameraCards.appendChild(productCard);
        productCard.appendChild(productCardBody);
        productCardBody.appendChild(product);
        product.appendChild(name);
        product.appendChild(image);
        product.appendChild(div);
        div.appendChild(description);
        div.appendChild(price);
    });
}

createProductCard();