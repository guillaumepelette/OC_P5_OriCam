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

// 1. Load basket
// 2. forEach basketProduct, get + add missingProductData
// 3. Return finalBasket
// 4. Show product cards on basket page


async function getMissingProductData() {
    const response = await fetch(urlOrinoco , myInit);
    if (!response.ok) {
        throw new Error("Erreur HTTP: " + response.status);
    }
    const data = await response.json();
    return data;
}

async function addMissingProductDataToBasket() {
    let basket = loadBasket();
    console.log(basket);
    let missingProductData = await getMissingProductData();
    function addMissingProductData(basket, missingProductData) {
        console.log(missingProductData);
        for (i=0;i<basket.length;i++) {
            console.log(basket[i].cameraId);
            let productIndex = missingProductData.findIndex(product => product._id === basket[i].cameraId)
            console.log(productIndex);
            basket[i].name = missingProductData[productIndex].name;
            basket[i].description = missingProductData[productIndex].description;
            basket[i].price = missingProductData[productIndex].price;
            basket[i].imageUrl = missingProductData[productIndex].imageUrl;
        }
        return basket;
    };
    basket = addMissingProductData(basket, missingProductData);
    console.log(basket);
    return basket;
}


async function createProductCard() {  
    let finalBasket = await addMissingProductDataToBasket();
    console.log(finalBasket);
    console.log(finalBasket[0]);
    console.log(finalBasket[0].cameraId);
    console.log(Object.keys(finalBasket[0]));
    console.log(JSON.stringify(finalBasket[0]));

    let totalQuantityValue = document.createElement('span');
    let totalQuantity = 0;
    let totalQuantityText = document.querySelector("#basket-payment-form>h6");
    totalQuantityText.append(totalQuantityValue);
    totalQuantityValue.id = "totalQuantity";

    let finalSubTotalValue = document.createElement('span');
    let finalSubTotal = 0;
    let finalSubTotalText = document.querySelector("#basket-payment-form>h6:nth-child(3)");
    finalSubTotalText.append(finalSubTotalValue);
    finalSubTotalValue.id = "finalSubTotal";

    let finalTotalValue = document.createElement('span');
    let finalTotalText = document.querySelector("#basket-payment-form>h6:nth-child(5)");
    finalTotalText.append(finalTotalValue);
    finalTotalValue.id = "finalTotal";

    for (i=0;i<finalBasket.length;i++) {

        const cameraCards = document.getElementById('basket-products-container');
        
        const productCard = document.createElement('div')
        productCard.classList = "card";
        productCard.style.display = "flex";
        productCard.style.flexFlow = "row nowrap";
        productCard.style.maxWidth = "100%";
        
        const productCardBody = document.createElement('div')
        productCardBody.classList = "card-body";
        productCardBody.style.display = "flex";
        productCardBody.style.flexFlow = "row nowrap";
        productCardBody.style.textAlign = "left";
        
        const product = document.createElement('div');
        product.id = 'productData';
        product.style.padding = "0 1rem 1rem 1rem";
        product.style.fontSize = "80%";

        const imageDiv = document.createElement('div')
        imageDiv.classList = "cameraImageDiv";
        imageDiv.style.padding = "0 1rem 1rem 1rem";
        
        const image = document.createElement('img');
        image.id = 'cameraImage';
        image.src = finalBasket[i].imageUrl;
        image.style.width = "100%";
        image.style.height = "auto";
        
        const cameraId = finalBasket[i].cameraId;

        const name = document.createElement('h3');
        name.textContent = finalBasket[i].name;
        name.id = "cameraName";
        name.style.marginBottom = "0px";
        
        const description = document.createElement('p');
        description.id = "cameraDescription";
        description.style.marginBottom = "0px";
        if (finalBasket[i].description.strlen < 100) {
        } else {
            description.textContent = finalBasket[i].description.substring(0,99)+"...";
        }
    
        const lens = document.createElement('p');
        lens.textContent = ` - Lentille :  ${finalBasket[i].lens}`;
        lens.style.marginTop = "0.2rem";
        let regexRule = /[^\w\d\\s]/gi;
        let modifiedLens = finalBasket[i].lens.replace(regexRule, "");
        
        const price = document.createElement('p');
        price.textContent = `Prix :  ${finalBasket[i].price/100} €`;
        price.style.marginTop = "0.5rem";
        price.style.textAlign = "left";
        price.style.marginBottom = "0px";
        
        const quantity = document.createElement('span');
        quantity.textContent = "Quantité: ";
        quantity.style.marginTop = "0.5rem";
        quantity.style.textAlign = "left";
        quantity.style.marginBottom = "0px";

        const quantityNumber = document.createElement('span');
        quantityNumber.id = 'quantityNumber'+ i.toString();
        console.log(quantityNumber.id);
        quantityNumber.textContent = finalBasket[i].quantity;
        quantityNumber.style.textAlign = "left";
        quantityNumber.style.marginBottom = "0px";

        console.log(typeof finalBasket[i].quantity);
        totalQuantity += Number(finalBasket[i].quantity);
        console.log(totalQuantity);

        finalSubTotal += Number(finalBasket[i].quantity) * finalBasket[i].price/100;
        console.log(finalSubTotal);
        
        const iconsDiv = document.createElement('div');
        iconsDiv.id = 'iconsDiv';
        iconsDiv.style.display = "flex";
        iconsDiv.style.flexFlow = "row nowrap";
        
        const plusIcon = document.createElement('span')
        plusIcon.classList.add(finalBasket[i].cameraId, modifiedLens);
        plusIcon.id = 'plusIcon';
        plusIcon.innerHTML = '<i class="fas fa-plus"></i>';
        
        const minusIcon = document.createElement('span')
        minusIcon.classList.add(finalBasket[i].cameraId, modifiedLens);
        minusIcon.id = 'minusIcon';
        minusIcon.innerHTML = '<i class="fas fa-minus"></i>';
        minusIcon.style.marginRight = "0.5rem";
        
        const div = document.createElement('div');
        div.id = 'cameraDiv';
        
        const link = document.createElement('a');
        link.class="link"
        link.id = 'linkId';
        link.href = 'product.html?id=' + cameraId;
        link.textContent = "Voir le produit";

        cameraCards.appendChild(productCard);
        productCard.appendChild(productCardBody);
        productCardBody.appendChild(imageDiv);
        imageDiv.appendChild(image);
        productCardBody.appendChild(product);
        product.appendChild(name);
        product.appendChild(div);
        div.appendChild(description);
        div.appendChild(lens);
        div.appendChild(price);
        div.appendChild(quantity);
        div.appendChild(quantityNumber);
        div.appendChild(iconsDiv);
        iconsDiv.appendChild(minusIcon);
        iconsDiv.appendChild(plusIcon);
    }

    computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);

    let quantityIcons = document.querySelectorAll('span>i.fas');
    console.log(quantityIcons);

    let minusIcon = document.querySelectorAll('#minusIcon');
    let plusIcon = document.querySelectorAll('#plusIcon');

    quantityIcons.forEach(icon => {
        icon.style.pointerEvents = "none";
    });

    for (let i=0; i < minusIcon.length; i++) {
        minusIcon[i].addEventListener("click", function(event) {
            let targetElement = event.target;
            console.log(targetElement);
            elementRelatedProduct = targetElement.classList.value.split(" ");
            console.log(elementRelatedProduct);
            let indexProductInBasket = finalBasket.findIndex(
                (product => product._id === elementRelatedProduct[0]) &&
                (product => product.uniqueLensId === elementRelatedProduct[1]));
            let basketProductAdded = decreaseBasketQuantity(indexProductInBasket, finalBasket, totalQuantity, finalSubTotal);
            console.log((basketProductAdded.price)/100);
            totalQuantity -=1;
            finalSubTotal -= (basketProductAdded.price)/100;
            computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
        });
    }

    for (let i=0; i < plusIcon.length; i++) {
        plusIcon[i].addEventListener("click", function(event) {
            let targetElement = event.target;
            console.log(targetElement);
            elementRelatedProduct = targetElement.classList.value.split(" ");
            console.log(elementRelatedProduct);
            let indexProductInBasket = finalBasket.findIndex(
                (product => product._id === elementRelatedProduct[0]) &&
                (product => product.uniqueLensId === elementRelatedProduct[1]));
            let basketProductAdded = increaseBasketQuantity(indexProductInBasket, finalBasket);
            console.log((basketProductAdded.price)/100);
            totalQuantity +=1;
            finalSubTotal += (basketProductAdded.price)/100;
            computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
        });
    }
}


function computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue) {
    totalQuantityValue.textContent = totalQuantity;
    finalSubTotalValue.textContent = finalSubTotal.toLocaleString() + " €";
    finalTotalValue.textContent = (finalSubTotal+10).toLocaleString() + " €";
}

function decreaseBasketQuantity(index, basket) {
    console.log(basket[index].quantity);
    basket[index].quantity -= 1;

    let quantityElement = document.getElementById('quantityNumber'+index.toString());
    quantityElement.textContent = basket[index].quantity;

    let stringBasket = JSON.stringify(basket);
    localStorage.setItem('basket', stringBasket);
    loadBasket();
    console.log(basket[index]);
    return basket[index];
}

function increaseBasketQuantity(index, basket) {
    console.log(basket[index].quantity);
    basket[index].quantity += 1;
    console.log(basket[index].quantity);
    
    let quantityElement = document.getElementById('quantityNumber'+index.toString());
    quantityElement.textContent = basket[index].quantity;
    
    let stringBasket = JSON.stringify(basket);
    localStorage.setItem('basket', stringBasket);
    loadBasket();
    console.log(basket[index]);
    return basket[index];
}

createProductCard();