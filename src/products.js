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

const urlOrinoco = 'http://localhost:3000/api/cameras';

const myHeaders = new Headers({
  "Content-Type": "application/json",
});

const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'cors',
  credentials: "same-origin",
  cache: 'default'
};

async function getProductData(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error("Erreur HTTP: " + response.status);
  }
  const data = await response.json();
  return data;
}


async function addCameraCards() {

  const cameraDivElement = document.getElementById('products-container');

  let cameraData = await getProductData(urlOrinoco, myInit);

  cameraData.forEach(function (camera) {
    const cardDiv = document.createElement('div');
    cardDiv.id = 'cameraCardDiv';
    cardDiv.classList.add('productCard', 'card');

    const cardDivBody = document.createElement('div');
    cardDivBody.id = 'cameraCardBodyDiv';
    cardDivBody.classList.add('card-body');

    const product = document.createElement('div');
    product.id = 'productData';

    const image = document.createElement('img');
    image.id = 'cameraImage';
    image.src = camera.imageUrl;

    const div = document.createElement('div');
    div.id = 'cameraDiv';

    const name = document.createElement('h3');
    name.textContent = camera.name;
    name.id = "cameraName";

    const description = document.createElement('p');
    description.textContent = camera.description;
    description.id = "cameraDescription";

    const price = document.createElement('p');
    price.textContent = `Prix :  ${camera.price / 100} €`;

    const cameraId = camera._id;

    const link = document.createElement('a');
    link.class = "link";
    link.id = 'linkId';
    link.href = 'product.html?id=' + cameraId;
    link.textContent = "Voir le produit";

    var button = document.createElement("button");
    button.setAttribute("class", "btn btn-light");
    button.appendChild(link);

    cameraDivElement.appendChild(cardDiv);
    cardDiv.appendChild(cardDivBody);
    cardDivBody.appendChild(product);
    product.appendChild(name);
    product.appendChild(image);
    product.appendChild(div);
    div.appendChild(description);
    div.appendChild(price);
    div.appendChild(button);
  });
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
  let missingProductData = await getProductData(urlOrinoco, myInit);
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

async function toggleMenu() {
  await showBasketProductsinToggleMenu();
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

addCameraCards();
toggleMenu();