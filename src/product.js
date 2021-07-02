function loadBasket() {
    let basket = localStorage.getItem('basket');
    basket = JSON.stringify(basket);
    if (basket != null) {
        returnBasketQuantity(basket);
    } else {
        basket = [{}];
    }
    return basket;
}

let basket = loadBasket();

function returnBasketQuantity(data) {
    let totalQuantity = 0;
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        totalQuantity += Object.values(data[i])[2];
    }
    document.querySelector('.totalQuantity')
}

let basketQuantity = returnBasketQuantity(basket);


let params = new URLSearchParams(document.location.search);
let id = params.get("id");

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
    pushBasketButton();
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
                response => JSON.stringify(response)
                response.json().then(data => {
                    htmlInjectionIntoFetch(data);
                    addLensTypeOption();
                    addQuantityOption();
                    pushBasketButton(data);
                    createBasketAddition();
                })
            } else {
                error => alert("Erreur : " + error);
            }
        })
        .catch(error => alert("Erreur : " + error));
}

getSingleCameraProduct();

function pushBasketButton(data) {
    let addToBasketButton = document.getElementById('addToBasket');
    // addToBasketButton.addEventListener('click', updateBasket());
    addToBasketButton.addEventListener('click', function () {
        let cameraQuantity = document.getElementById('cameraQuantity').value;
        let lensType = document.getElementById('lensChoice');
        let lensTypeSelected = lensType.options[lensType.selectedIndex].textContent;
        alert('Vous avez ajouté ' + '\u00a0' + cameraQuantity + '\u00a0' + ' articles' + '\u00a0' + data.name + '\u00a0' +
            'avec une lentille' + '\u00a0' + lensTypeSelected + '\u00a0' + 'à votre panier');
    });
}

function createBasketAddition() {
    let lensType = document.getElementById('lensChoice').value;
    let cameraQuantity = document.getElementById('cameraQuantity').value;
    let basketAddition = {
        cameraId: id,
        lens: lensType,
        quantity: cameraQuantity,
    }
    return basketAddition;
};


// Mettre à jour le panier
// function updateBasket() {
//     let basketAddition = createBasketAddition();
//     if (Object.keys(basket[0]).length === 0 && basket[0].constructor === Object) {
//         basket = basketAddition;
//     } else {
//         basket +=  basketAddition;
//     }
//     // PARSE + STORE in LOCALSTORAGE
// }