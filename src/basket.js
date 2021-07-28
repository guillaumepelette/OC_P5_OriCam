function loadBasket() {
    let basket = localStorage.getItem('basket');
    basket = JSON.parse(basket);

    if (!Array.isArray(basket)) {
        basket = [];
        document.querySelector('.totalQuantity').textContent = 0;
    }
    else {
        let totalQuantity = 0;
        for (let i = 0; i < basket.length; i++) {
            totalQuantity += Number(basket[i].quantity);
        }
        document.querySelector('.totalQuantity').textContent = totalQuantity;
    }
    return basket;
}

function checkIfBasketIsEmpty() {
    let basket = loadBasket();
    if (basket.length == 0) {
        const emptyBasketMessageDivElement = document.getElementById('basket-products-container');
        const emptyBasketMessageParagraph = document.createElement('p');
        emptyBasketMessageParagraph.textContent = "Votre panier est actuellement vide.";
        emptyBasketMessageParagraph.id = "emptyBasketMessageParagraph";
        emptyBasketMessageDivElement.appendChild(emptyBasketMessageParagraph);
        let deliveryCosts = document.querySelector('h6.mb-3');
        deliveryCosts.textContent = "Livraison: ";
        const paymentForm = document.getElementById('basket-payment-form');
        paymentForm.style.display = "none";
    }
}

document.onload = loadBasket();
checkIfBasketIsEmpty();

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
        basket[i].description = missingProductData[productIndex].description;
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


async function createProductCard() {
    let finalBasket = await addMissingProductDataToBasket();

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

    for (i = 0; i < finalBasket.length; i++) {

        const cameraCards = document.getElementById('basket-products-container');

        const productCard = document.createElement('div')
        productCard.classList.add("card", "productCard");
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
            description.textContent = finalBasket[i].description.substring(0, 99) + "...";
        }

        const lens = document.createElement('p');
        lens.textContent = ` - Lentille :  ${finalBasket[i].lens}`;
        lens.style.marginTop = "0.2rem";
        lens.style.marginBottom = "0px";
        let regexRule = /[^\w\d\\s]/gi;
        let modifiedLens = finalBasket[i].lens.replace(regexRule, "");

        const price = document.createElement('p');
        price.textContent = `Prix :  ${finalBasket[i].price / 100} €`;
        price.style.marginTop = "0.2rem";
        price.style.textAlign = "left";
        price.style.marginBottom = "0px";

        const quantity = document.createElement('span');
        quantity.id = 'quantityText';
        quantity.textContent = "Quantité: ";

        const quantityNumber = document.createElement('span');
        quantityNumber.id = 'quantityNumber' + i.toString();
        quantityNumber.textContent = finalBasket[i].quantity;
        quantityNumber.style.textAlign = "left";
        quantityNumber.style.marginBottom = "0px";

        totalQuantity += Number(finalBasket[i].quantity);

        finalSubTotal += Number(finalBasket[i].quantity) * finalBasket[i].price / 100;

        const iconsDiv = document.createElement('div');
        iconsDiv.id = 'iconsDiv';
        iconsDiv.style.display = "flex";
        iconsDiv.style.flexFlow = "row nowrap";

        const minusIcon = document.createElement('span')
        minusIcon.classList.add(finalBasket[i].cameraId, modifiedLens);
        minusIcon.id = 'minusIcon';
        minusIcon.innerHTML = '<i class="fas fa-minus"></i>';
        minusIcon.style.marginRight = "0.5rem";

        const plusIcon = document.createElement('span')
        plusIcon.classList.add(finalBasket[i].cameraId, modifiedLens);
        plusIcon.id = 'plusIcon';
        plusIcon.innerHTML = '<i class="fas fa-plus"></i>';
        plusIcon.style.marginRight = "0.5rem";

        const trashIcon = document.createElement('span');
        trashIcon.classList.add(finalBasket[i].cameraId, modifiedLens);
        trashIcon.id = 'trashIcon';
        trashIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';

        const div = document.createElement('div');
        div.id = 'cameraDiv';

        const link = document.createElement('a');
        link.class = "link"
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
        iconsDiv.appendChild(trashIcon);
    }

    computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);

    let productModificationIcons = document.querySelectorAll('span>i.fas');

    let minusIcons = document.querySelectorAll('#minusIcon');
    let plusIcons = document.querySelectorAll('#plusIcon');
    let trashIcons = document.querySelectorAll('#trashIcon');

    productModificationIcons.forEach(icon => {
        icon.style.pointerEvents = "none";
        let hoverableSpan = icon.parentElement;
        hoverableSpan.addEventListener('mouseenter', function (event) {
            let span = event.target
            span.style.cursor = 'pointer';
        })
        hoverableSpan.addEventListener('mouseleave', function (event) {
            let span = event.target
            span.style.cursor = 'auto';
        })
    });

    for (let i = 0; i < minusIcons.length; i++) {
        minusIcons[i].addEventListener("click", function (event) {
            let targetElement = event.target;
            elementRelatedProduct = targetElement.classList.value.split(" ");
            let indexProductInBasket = finalBasket.findIndex(
                (product => product._id === elementRelatedProduct[0]) &&
                (product => product.uniqueLensId === elementRelatedProduct[1]));
            if (finalBasket[indexProductInBasket].quantity == 1) {
                let deleteConfirmation = window.confirm("Vous ne pouvez pas réduire la quantité de cet article à 0.\nEtes-vous sûr(e) de vouloir supprimer cet article?");
                if (deleteConfirmation) {
                    totalQuantity -= finalBasket[indexProductInBasket].quantity;
                    finalSubTotal -= finalBasket[indexProductInBasket].quantity * ((finalBasket[indexProductInBasket].price) / 100);
                    deleteProductFromBasket(indexProductInBasket, finalBasket, totalQuantity, finalSubTotal);
                    computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
                    location.reload();
                }
            } else {
                let basketProductRemoved = decreaseBasketQuantity(indexProductInBasket, finalBasket);
                totalQuantity -= 1;
                finalSubTotal -= (basketProductRemoved.price) / 100;
                computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
            }
        });
    }

    for (let i = 0; i < plusIcons.length; i++) {
        plusIcons[i].addEventListener("click", function (event) {
            let targetElement = event.target;
            elementRelatedProduct = targetElement.classList.value.split(" ");
            let indexProductInBasket = finalBasket.findIndex(
                (product => product._id === elementRelatedProduct[0]) &&
                (product => product.uniqueLensId === elementRelatedProduct[1]));
            let basketProductAdded = increaseBasketQuantity(indexProductInBasket, finalBasket);
            totalQuantity += 1;
            finalSubTotal += (basketProductAdded.price) / 100;
            computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
            location.reload();
        });
    }

    for (let i = 0; i < trashIcons.length; i++) {
        trashIcons[i].addEventListener("click", function (event) {
            let targetElement = event.target;
            elementRelatedProduct = targetElement.classList.value.split(" ");
            let indexProductInBasket = finalBasket.findIndex(
                (product => product._id === elementRelatedProduct[0]) &&
                (product => product.uniqueLensId === elementRelatedProduct[1]));
            let deleteConfirmation = window.confirm("Etes-vous sûr(e) de vouloir supprimer cet article?");
            if (deleteConfirmation) {
                totalQuantity -= finalBasket[indexProductInBasket].quantity;
                finalSubTotal -= finalBasket[indexProductInBasket].quantity * ((finalBasket[indexProductInBasket].price) / 100);
                deleteProductFromBasket(indexProductInBasket, finalBasket, totalQuantity, finalSubTotal);
                computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue);
                location.reload();
            }
        });
    }
}


function computeBasketValue(totalQuantityValue, totalQuantity, finalSubTotalValue, finalSubTotal, finalTotalValue) {
    totalQuantityValue.textContent = totalQuantity;
    finalSubTotalValue.textContent = finalSubTotal.toLocaleString() + " €";
    finalTotalValue.textContent = (finalSubTotal + 10).toLocaleString() + " €";
}

function decreaseBasketQuantity(index, basket) {
    basket[index].quantity -= 1;

    let quantityElement = document.getElementById('quantityNumber' + index.toString());
    quantityElement.textContent = basket[index].quantity;

    let stringBasket = JSON.stringify(basket);
    localStorage.setItem('basket', stringBasket);
    loadBasket();
    return basket[index];
}

function increaseBasketQuantity(index, basket) {
    basket[index].quantity = Number(basket[index].quantity);
    basket[index].quantity += 1;

    let quantityElement = document.getElementById('quantityNumber' + index.toString());
    quantityElement.textContent = basket[index].quantity;

    let stringBasket = JSON.stringify(basket);
    localStorage.setItem('basket', stringBasket);
    loadBasket();
    return basket[index];
}

function deleteProductFromBasket(index, basket) {
    basket.splice(index, 1);

    let stringBasket = JSON.stringify(basket);
    localStorage.setItem('basket', stringBasket);
    loadBasket();
    return basket[index];
}

class FormValidator {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
    }

    initialize() {
        this.validateOnSubmit();
        this.validateOnEntry();
    }

    validateFullForm() {
        const submitButton = document.getElementById('order-form-submit-button');

        let errorCount = 0;
        let form = this.form;
        for (let i = 0; i < (form.length) - 2; i++) {
            if (!form[i].classList.contains("valid")) { errorCount += 1 }
        }
        if (errorCount == 0) {
            submitButton.disabled = false;
        } else { submitButton.disabled = true;}
    }

    validateOnSubmit() {
        let self = this;

        this.form.addEventListener('submit', e => {
            e.preventDefault()
            self.fields.forEach(field => {
                const input = document.querySelector(`#${field}`)
                self.validateFields(input)
            })
        })
    }

    validateOnEntry() {
        let self = this;
        self.fields.forEach(function (field) {
            const input = document.querySelector(`#${field}`);
            input.addEventListener('input', function (event) {
                self.validateField(input);
                self.validateFullForm();
            })
            input.addEventListener('keydown', function (event) {
                let key = event.keyCode || event.charCode;
                if (key == 8 || key == 46 ) {
                    self.validateField(input);
                    self.validateFullForm();
                }
            })
        })
    }

    validateField(field) {

        // On vérifie que des valeurs on été rentrées
        if (field.value.trim() === "") {
            this.setStatus(field, `${field.previousElementSibling.innerText} ne peut pas être vide`, "error")
        } else {
            this.setStatus(field, null, "success")
        }

        // On vérifie que l'adresse mail a le bon format
        if (field.type === "email") {
            const regexRule = /\S+@\S+\.\S+/;
            if (regexRule.test(field.value) && field.checkValidity()) {
                this.setStatus(field, null, "success");
            } else {
                this.setStatus(field, "Veuillez saisir une adresse e-mail valide.", "error");
            }
        }

        // On vérifie que les champs de texte ne comportent que des caractères 
        if (field.value.trim() != "" && field.type === "text") {
            const regexRule = /[^a-zA-Z àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ'-]/i;
            if (regexRule.test(field.value)) {
                this.setStatus(field, "Veuillez saisir uniquement du texte.", "error");
            } else {
                this.setStatus(field, null, "success");
            }
        }
    }

    setStatus(field, message, status) {
        const successIcon = field.parentElement.querySelector('.icon-success');
        const errorIcon = field.parentElement.querySelector('.icon-error');
        const errorMessage = field.parentNode.lastChild.previousElementSibling;
        
        if (status === "success") {
            if (errorIcon) { errorIcon.classList.add('hidden') }
            if (errorMessage) { errorMessage.innerText = "" }
            successIcon.classList.remove('hidden');
            field.classList.remove('input-error');
            field.classList.add('valid');
        }

        if (status === "error") {
            if (successIcon) { successIcon.classList.add('hidden') }
            field.parentElement.querySelector('.error-message').innerText = message;
            errorIcon.classList.remove('hidden');
            field.classList.add('input-error');
            field.classList.remove('valid');
        }
    }
}


function intializeValidator() {
    const form = document.querySelector('.order-form');
    const fields = ['order-form-email_address', 'order-form-first_name', 'order-form-last_name',
        'order-form-street_number', 'order-form-street_name', 'order-form-city', 'order-form-country'];

    const validator = new FormValidator(form, fields);
    validator.initialize();
}

function getContactInfo() {
    let formEmailAddress = document.getElementById('order-form-email_address').value;
    let formFirstName = document.getElementById('order-form-first_name').value;
    let formLastName = document.getElementById('order-form-last_name').value;
    let formStreetNumber = document.getElementById('order-form-street_number').value;
    let formStreetName = document.getElementById('order-form-street_name').value;
    let formCity = document.getElementById('order-form-city').value;
    let formFullAddress = formStreetNumber + " " + formStreetName;
    let contact = {
        firstName: formFirstName,
        lastName: formLastName,
        address: formFullAddress,
        city: formCity,
        email: formEmailAddress
    }
    return (contact);
}


async function sendOrderInfo(contact, products) {
    let orderFinalObject = {
        contact,
        products,
    }
    let orderFinalObjectJson = JSON.stringify(orderFinalObject);
    const response = await fetch(urlOrinoco + 'order',
        {
            method: 'POST',
            headers: myHeaders,
            body: orderFinalObjectJson,
            mode: 'cors',
            credentials: "same-origin",
            cache: 'default'
        });
    if (!response.ok) {
        throw new Error("Erreur HTTP: " + response.status);
    }
    const content = await response.json();
    return content;
}


function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
}

function closeModal(modal, button) {
    button.addEventListener('click', function () {
        if (modal == null) return;
        modal.classList.remove('active');
    })
}


async function showOrderIdInModal(orderId, event) {
    let openButton = event.target;
    const modal = document.querySelector('#final-order_modal');
    openModal(modal);

    const finalOrderModalElement = document.querySelector('div.modal .modal-body');
    let orderIdParagraph = document.createElement('p');
    orderIdParagraph.innerHTML = orderId;
    finalOrderModalElement.appendChild(orderIdParagraph);

    let closeButton = document.querySelector('[data-close-button]');
    closeModal(modal, closeButton);
}


async function createOrder() {
    let orderInfoSubmitButton = document.querySelector('form.order-form button')
    orderInfoSubmitButton.addEventListener('click', async function (event) {
        event.preventDefault();
        let contact = getContactInfo();
        let products = localStorage.getItem('basket');
        products = JSON.parse(products);
        let idProductsArray = products.map(array => array.cameraId);
        let postResponse = await sendOrderInfo(contact, idProductsArray);
        let orderId = postResponse.orderId;
        showOrderIdInModal(orderId, event);
    });
}


async function addMissingProductDataToBasket() {
    let basket = loadBasket();
    let missingProductData = await getMissingProductData();
    basket = addMissingProductData(basket, missingProductData);
    return basket;
}

async function showBasketProductsinToggleMenu() {
    let basket = await addMissingProductDataToBasket();

    let menuProductsElement = document.getElementById('shopping-cart-products');
    menuProductsElement.innerHTML = '';

    // menuProductsElement ==> clear HTML

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

        const quantityNumberinBasket = document.createElement('span');
        quantityNumberinBasket.textContent = basket[i].quantity;
        quantityNumberinBasket.style.textAlign = "left";
        quantityNumberinBasket.style.marginBottom = "0px";

        menuProductsElement.appendChild(product);
        product.appendChild(name);
        product.appendChild(div);
        div.appendChild(lens);
        div.appendChild(price);
        div.appendChild(quantity);
        div.appendChild(quantityNumberinBasket);
    }
}

function toggleMenu() {
    const basketButton = document.querySelector('.basket-button');
    const shoppingCart = document.querySelector('.shopping-cart-action');

    basketButton.addEventListener('mouseover', function () {
        showBasketProductsinToggleMenu();
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


createProductCard();
intializeValidator();
createOrder();
toggleMenu();