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

let params = new URLSearchParams(document.location.search);
let id = params.get("id");
console.log(id);

// On crée les éléments HTML en javascript
const cameraElement = document.getElementById('single-product-container')

const product = document.createElement('div');
product.id = 'productList';

const productInfo = document.createElement('div');
productInfo.id = "productInfo";

const cameraName = document.createElement('h3');
cameraName.id = "cameraName";

const cameraImage = document.createElement('img');
cameraImage.id = 'cameraImage';

const smallCameraImage = document.createElement('img');
smallCameraImage.id = 'smallCameraImage';

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

let quantityArray = Array.from({ length: 10 }, (_, i) => i + 1)
quantityArray.unshift("Quantité à ajouter au panier")

function addSmallPictures() {
    let smallPictureElements = document.getElementsByClassName("additional-picture");
    Object.values(smallPictureElements).forEach(value => {
        value.appendChild(smallCameraImage);
    });
}

// le produit est affiché dès le chargement de la page
window.addEventListener('load', product);

// On crée une boucle pour afficher la liste déroulante des options de personnalisation des lentilles de la caméra
function addLensTypeOption() {
    for (let i = 0; i < lensType.length; i++) {
        let option = document.createElement('option');
        option.textContent = lensType[i];
        option.value = i;
        lensChoice.appendChild(option);
    };
}

// On crée une boucle pour sélectionner le nombre de produits à ajouter au panier
function addQuantityOption() {
    for (let i = 0; i < quantityArray.length; i++) {
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
    addSmallPictures();
    cameraImage.src = data.imageUrl;
    smallCameraImage.src = data.imageUrl;
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
                    console.log(data);
                    htmlInjectionIntoFetch(data);
                    addLensTypeOption();
                    addQuantityOption();
                    pushBasketButton(data);
            })
        } else {
            error => alert("Erreur : " + error);
        }
    })
    .catch(error => alert("Erreur : " + error));
}
    

function createBasketAddition() {
    let lensType = document.getElementById('lensChoice');
    let lensTypeSelected = lensType.options[lensType.selectedIndex].textContent;
    let cameraQuantity = document.getElementById('cameraQuantity');
    let cameraQuantitySelected = cameraQuantity.options[cameraQuantity.selectedIndex].textContent;
    let basketAddition = {
        cameraId: id,
        lens: lensTypeSelected,
        quantity: cameraQuantitySelected
    }
    console.log(basketAddition);
    return basketAddition;
};

function updateBasketQuantity(data) {
    let totalQuantity = 0;
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let quantityToAdd = data[i].quantity;
        totalQuantity += Number(quantityToAdd);
        console.log(totalQuantity);
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
    for (let i=0; i<basket.length; i++) {
        if ( (basketAddition.cameraId == basket[i].cameraId)
            && (basketAddition.lens == basket[i].lens) ) {
                basket[i].quantity = (Number(basket[i].quantity) + Number(basketAddition.quantity)).toString();
                alreadyExists = true;
            }
    }
    console.log(emptyBasket);
    console.log(alreadyExists);
    if ((basket.length > 0) && alreadyExists == false) {
        basket.push(basketAddition);
    } else if (emptyBasket == "yes") {
        basket.push(basketAddition);
    }
    console.log(basket);
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
        loadBasket();
    });
}


function toggleMenu() {
    const basketButton = document.querySelector('.basket-button');
    console.log(basketButton);
    const shoppingCart = document.querySelector('.shopping-cart-action');
    console.log(shoppingCart);
    
    basketButton.addEventListener('mouseover', function() {
        shoppingCart.classList.add('active');
    });
    
    shoppingCart.addEventListener('mouseover', function() {
        shoppingCart.classList.add('active');
    });
    
    basketButton.addEventListener('mouseout', function() {
        shoppingCart.classList.remove('active');
    });
    
    shoppingCart.addEventListener('mouseout', function() {
        shoppingCart.classList.remove('active');
    });
    
}

toggleMenu();
getSingleCameraProduct();