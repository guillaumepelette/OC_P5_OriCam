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

const div = document.createElement('div');
div.id = 'cameraDiv';

const cameraDescription = document.createElement('p');
cameraDescription.id = "cameraDescription";

const cameraPrice = document.createElement('p');

// Choix de lentille
const label = document.createElement('label')
label.textContent = "Type de lentille";

const cameraQuantity = document.createElement('select');
cameraQuantity.id = "cameraQuantity";
cameraQuantity.classList.add("form-select","form-select-sm");

const lensChoice = document.createElement('select');
lensChoice.id = "lensChoice";
lensChoice.classList.add("form-select","form-select-sm", "mb-3");

let lensType = [];

let quantityArray = Array.from({length: 10}, (_, i) => i + 1)
quantityArray.unshift("Quantité à ajouter au panier")
console.log(quantityArray);


cameraElement.appendChild(product);
product.appendChild(cameraImage);
product.appendChild(productInfo);
productInfo.appendChild(div);
div.appendChild(cameraName);
div.appendChild(cameraDescription);
div.appendChild(cameraPrice);
div.appendChild(lensChoice);
div.appendChild(cameraQuantity);

// le produit est affiché dès le chargement de la page
window.addEventListener('load', product);

// On ajoute les données récupérées par l'API avec la méthode GET
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


// Crée fonction injectHTML
cameraImage.src = data.imageUrl;
cameraName.textContent = data.name;
cameraDescription.textContent = data.description;
cameraPrice.textContent = `Prix :  ${data.price / 100} €`;
// Array.prototype.push.apply(lensType, data.lenses);
data.lenses.forEach(function(lens) {
    lensType.push(lens);
});
lensType.unshift("Type de lentille")


// On crée une boucle pour afficher la liste déroulante des options de personnalisation des lentilles de la caméra
function addOptions {
    for (let i = 0; i < lensType.length; i++) {
        let option = document.createElement('option');
        option.textContent = lensType[i];
        option.value = i;
        lensChoice.appendChild(option);
    };
}

// ==> ajouter nom de fonction
fetch(urlOrinoco + id, myInit)
    .then(response => {
        if (response.ok) {
            response => JSON.stringify(response)
            response.json().then(data => {

                // injectHTML()

            })
        } else {
            error => alert("Erreur : " + error);
        }
    })
    .catch(error => alert("Erreur : " + error));

console.log(typeof lensType);


// On crée une boucle pour sélectionner le nombre de produits à ajouter au panier
for (let i = 0; i < quantityArray.length; i++) {
    let option = document.createElement('option');
    option.textContent = quantityArray[i];
    option.value = i;
    cameraQuantity.appendChild(option);
};



// On ajoute les valeurs par défaut aux liste déroulantes
document.getElementById('cameraQuantity').getElementsByTagName('option')[0].selected = 'selected'
document.getElementById('lensChoice').getElementsByTagName('option')[0].selected = 'selected'
