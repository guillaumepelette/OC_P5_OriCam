function loadBasket() {
  let basket = localStorage.getItem('basket');
  if (basket != null) {
      showBasket(basket);
  } else {
      basket = [{}];
  }
}

loadBasket();


function ajaxRequest(url) {
    const p = new Promise((resolved, rejected) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function () {
        if (this.readyState === 4 && this.status === 200) { // retour HTTP OK
          resolved(JSON.parse(this.responseText));
        } else { // ereeur retour HTTP
          rejected(`Erreur HTTP n°: ${this.status}: ${this.statusText}`);
        }
      };
      request.send();
    });
    return p;
  }
  
const urlOrinoco = 'http://localhost:3000/api/cameras';
  
// on lance le protocole AJAX pour récupérer les données de l'API
var cameras = ajaxRequest(urlOrinoco);

const cameraElements = document.getElementsByClassName('card-body');
console.log(cameraElements);

cameras.then((data) => {
    console.log(data);
    
    let counter = 0;
    data.forEach(function(camera) {
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
      price.textContent = `Prix :  ${camera.price/100} €`;
  
      let cameraId = camera._id;
  
      const link = document.createElement('a');
      link.id = 'linkId';
      link.href = 'product.html?id=' + cameraId;
      link.textContent = "Voir le produit";

      var button = document.createElement("button");
      button.setAttribute("class", "btn btn-light");
      button.appendChild(link);
  
      cameraElements[counter].appendChild(product);
      product.appendChild(name);
      product.appendChild(image);
      product.appendChild(div);
      div.appendChild(description);
      div.appendChild(price);
      div.appendChild(button);

      counter += 1;
    });
  });