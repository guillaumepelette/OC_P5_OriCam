function loadBasket() {
    let basket = localStorage.getItem('basket');
    basket = JSON.parse(basket);

    if (!Array.isArray(basket)) {
        basket = [];
        document.querySelector('.totalQuantity').textContent = 0;
    } else {
        let totalQuantity = 0;
        for (let i = 0; i < basket.length; i++) {
            totalQuantity += Number(basket[i].quantity);
        }
        document.querySelector('.totalQuantity').textContent = totalQuantity;
    }
    return basket;
}

document.onload = loadBasket();

let params = new URLSearchParams(document.location.search);
let id = params.get("id");

function addProductNametoTitle(data) {
    let pageTitle = document.getElementsByTagName('title')[0];
    let productName = data.name;
    pageTitle.textContent = `Oricam - ${productName}`
}

// On crée les éléments HTML en javascript
const cameraElement = document.getElementById('single-product-container')

const product = document.createElement('div');
product.id = 'productList';

const productInfo = document.createElement('div');
productInfo.id = "productInfo";

const cameraName = document.createElement('p');
cameraName.id = "cameraNameShoppingCart";

const cameraImage = document.createElement('img');
cameraImage.id = 'cameraImage';

const cameraDiv = document.createElement('div');
cameraDiv.id = 'cameraDiv';

const cameraDescription = document.createElement('p');
cameraDescription.id = "cameraDescription";

const cameraPrice = document.createElement('p');

// Choix de lentille
const label = document.createElement('label')
label.textContent = "Type de lentille";

const cameraQuantity = document.createElement('select');
cameraQuantity.id = "cameraQuantity";
cameraQuantity.classList.add("form-select", "form-select-sm");

const lensChoice = document.createElement('select');
lensChoice.id = "lensChoice";
lensChoice.classList.add("form-select", "form-select-sm", "mb-3");

let lensType = [];

let quantityArray = Array.from({ length: 10 }, (_, i) => i + 1);
quantityArray.unshift("Quantité à ajouter au panier");

// le produit est affiché dès le chargement de la page
window.addEventListener('load', product);

// On crée une boucle pour afficher la liste déroulante des options de personnalisation des lentilles de la caméra
function addLensTypeOption() {
    let option_1 = document.createElement('option');
    option_1.textContent = lensType[0];
    option_1.value = 0;
    option_1.setAttribute('selected', 'selected');
    lensChoice.appendChild(option_1);

    let option_2 = document.createElement('option');
    option_2.textContent = lensType[1];
    option_2.value = 1;
    lensChoice.appendChild(option_2);

    for (let i = 2; i < lensType.length; i++) {
        let option = document.createElement('option');
        option.textContent = lensType[i];
        option.value = i;
        lensChoice.appendChild(option);
    };
}

// On crée une boucle pour sélectionner le nombre de produits à ajouter au panier
function addQuantityOption() {
    let option_1 = document.createElement('option');
    option_1.textContent = quantityArray[0];
    option_1.value = 0;
    option_1.setAttribute('selected', 'selected');
    cameraQuantity.appendChild(option_1);

    let option_2 = document.createElement('option');
    option_2.textContent = quantityArray[1];
    option_2.value = 1;
    cameraQuantity.appendChild(option_2);

    for (let i = 2; i < quantityArray.length; i++) {
        let option = document.createElement('option');
        option.textContent = quantityArray[i];
        option.value = i;
        cameraQuantity.appendChild(option);
    };
}

// On ajoute les données issues de l'API à l'HTML
function htmlInjectionIntoFetch(data) {
    cameraElement.appendChild(product);
    product.appendChild(cameraDiv);
    cameraDiv.appendChild(cameraImage);
    product.appendChild(productInfo);
    productInfo.appendChild(cameraName);
    productInfo.appendChild(cameraDescription);
    productInfo.appendChild(cameraPrice);
    productInfo.appendChild(lensChoice);
    productInfo.appendChild(cameraQuantity);
    cameraImage.src = data.imageUrl;
    cameraName.textContent = data.name;
    cameraDescription.textContent = data.description;
    cameraPrice.textContent = `Prix :  ${data.price / 100} €`;
    data.lenses.forEach(function (lens) {
        lensType.push(lens);
    });
    lensType.unshift("Type de lentille");
}


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

function getSingleCameraProduct() {
    fetch(urlOrinoco + id, myInit)
        .then(response => {
            if (response.ok) {
                response => JSON.parse(response)
                response.json().then(data => {
                    addProductNametoTitle(data);
                    htmlInjectionIntoFetch(data);
                    addLensTypeOption();
                    addQuantityOption();
                    enableBasketButton();
                    pushBasketButton(data);
                    showBasketProductsinToggleMenu(data);
                })
            } else {
                error => alert("Erreur : " + error);
            }
        })
        .catch(error => alert("Erreur : " + error));
}

function enableBasketButton() {
    let lensType = document.getElementById('lensChoice');
    let lensTypeSelected = lensType.options[lensType.selectedIndex].value;
    const cameraQuantity = document.getElementById('cameraQuantity');
    const basketButton = document.getElementById('addToBasket');

    lensType.addEventListener("change", function(event) {
        let input = event.target.value;
        if (input != 0) {
            event.target.classList.add("valid");
        } else { event.target.classList.remove("valid") }
        if (lensType.classList.contains("valid")
        && cameraQuantity.classList.contains("valid")) {
            basketButton.disabled = false;
        } else {basketButton.disabled = true; }
    })

    cameraQuantity.addEventListener("change", function(event) {
        let input = event.target.value;
        if (input != 0) {
            event.target.classList.add("valid");
        } else { event.target.classList.remove("valid") }
        if (lensType.classList.contains("valid")
        && cameraQuantity.classList.contains("valid")) {
            basketButton.disabled = false;
        } else {basketButton.disabled = true; }
    });
}


function createBasketAddition() {
    let lensType = document.getElementById('lensChoice');
    let lensTypeSelected = lensType.options[lensType.selectedIndex].textContent;
    let regexRule = /[^\w\d\\s]/gi;
    let modifiedLens = lensTypeSelected.replace(regexRule, "");

    let cameraQuantity = document.getElementById('cameraQuantity');
    let cameraQuantitySelected = cameraQuantity.options[cameraQuantity.selectedIndex].textContent;
    let basketAddition = {
        cameraId: id,
        lens: lensTypeSelected,
        uniqueLensId: modifiedLens,
        quantity: cameraQuantitySelected,
    }
    return basketAddition;
};

function updateBasketQuantity(data) {
    let totalQuantity = 0;
    for (let i = 0; i < data.length; i++) {
        let quantityToAdd = data[i].quantity;
        totalQuantity += Number(quantityToAdd);
    }
    document.querySelector('.totalQuantity').innerHTML = totalQuantity;
}

// Mettre à jour le panier
function updateBasket() {
    let basket = loadBasket();
    let basketAddition = createBasketAddition();
    let emptyBasket = "no";
    let alreadyExists = false;

    if (Array.isArray(basket) && basket.length == 0) {
        emptyBasket = "yes";
    }
    for (let i = 0; i < basket.length; i++) {
        if ((basketAddition.cameraId == basket[i].cameraId)
            && (basketAddition.lens == basket[i].lens)) {
            basket[i].quantity = (Number(basket[i].quantity) + Number(basketAddition.quantity)).toString();
            alreadyExists = true;
        }
    }
    if ((basket.length > 0) && alreadyExists == false) {
        basket.push(basketAddition);
    } else if (emptyBasket == "yes") {
        basket.push(basketAddition);
    }
    updateBasketQuantity(basket);

    basket = JSON.stringify(basket);
    localStorage.setItem('basket', basket);
}

function pushBasketButton(data) {
    let addToBasketButton = document.getElementById('addToBasket');
    addToBasketButton.addEventListener('click', function () {
        let lensType = document.getElementById('lensChoice');
        let lensTypeSelected = lensType.options[lensType.selectedIndex].textContent;
        let cameraQuantity = document.getElementById('cameraQuantity').value;
        alert('Vous avez ajouté ' + '\u00a0' + cameraQuantity + '\u00a0' + ' articles' + '\u00a0' + data.name + '\u00a0' +
            'avec une lentille' + '\u00a0' + lensTypeSelected + '\u00a0' + 'à votre panier');
        updateBasket(data);
        location.reload();
    });
}


function toggleMenu() {
    const basketButton = document.querySelector('.basket-button');
    const shoppingCart = document.querySelector('.shopping-cart-action');

    basketButton.addEventListener('mouseover', function () {
        shoppingCart.classList.add('active');
    });

    shoppingCart.addEventListener('mouseover', function () {
        shoppingCart.classList.add('active');
    });

    basketButton.addEventListener('mouseout', function () {
        shoppingCart.classList.remove('active');
    });

    shoppingCart.addEventListener('mouseout', function () {
        shoppingCart.classList.remove('active');
    });
}


async function getMissingProductData() {
    const response = await fetch(urlOrinoco, myInit);
    if (!response.ok) {
        throw new Error("Erreur HTTP: " + response.status);
    }
    const data = await response.json();
    return data;
}


function addMissingProductData(basket, missingProductData) {
    for (i = 0; i < basket.length; i++) {
        let productIndex = missingProductData.findIndex(product => product._id === basket[i].cameraId)
        basket[i].name = missingProductData[productIndex].name;
        basket[i].price = missingProductData[productIndex].price;
        basket[i].imageUrl = missingProductData[productIndex].imageUrl;
    }
    return basket;
};

async function addMissingProductDataToBasket() {
    let basket = loadBasket();
    let missingProductData = await getMissingProductData();
    basket = addMissingProductData(basket, missingProductData);
    return basket;
}

async function showBasketProductsinToggleMenu() {
    let basket = await addMissingProductDataToBasket();

    let menuProductsElement = document.getElementById('shopping-cart-products');

    for (i = 0; i < basket.length; i++) {
        const product = document.createElement('div');
        product.id = 'productData';
        product.style.padding = "0 1rem 1rem 1rem";
        product.style.fontSize = "80%";

        const div = document.createElement('div');
        div.id = 'cameraThumbnailDiv';

        const imageDiv = document.createElement('div')
        imageDiv.classList = "cameraImageThumbnailDiv";
        imageDiv.style.padding = "0 1rem 1rem 1rem";

        const image = document.createElement('img');
        image.id = 'cameraImageThumbnail';
        image.src = basket[i].imageUrl;
        image.style.width = "100%";
        image.style.height = "auto";

        const name = document.createElement('h6');
        name.textContent = (i + 1) + ". " + basket[i].name;
        name.id = "cameraNameSmall";
        name.style.marginBottom = "0px";
        name.style.fontWeight = 900;

        const lens = document.createElement('p');
        lens.textContent = ` - Lentille :  ${basket[i].lens}`;
        lens.style.marginTop = "0.2rem";
        lens.style.marginBottom = "0px";

        const price = document.createElement('p');
        price.textContent = `Prix :  ${basket[i].price / 100} €`;
        price.style.marginTop = "0.2rem";
        price.style.textAlign = "left";
        price.style.marginBottom = "0px";

        const quantity = document.createElement('span');
        quantity.id = 'quantityText';
        quantity.textContent = "Quantité: ";

        const quantityNumber = document.createElement('span');
        quantityNumber.id = 'quantityNumber' + i.toString();
        quantityNumber.textContent = basket[i].quantity;
        quantityNumber.style.textAlign = "left";
        quantityNumber.style.marginBottom = "0px";

        menuProductsElement.appendChild(product);
        product.appendChild(name);
        product.appendChild(div);
        div.appendChild(lens);
        div.appendChild(price);
        div.appendChild(quantity);
        div.appendChild(quantityNumber);
    }
}


getSingleCameraProduct();
toggleMenu();