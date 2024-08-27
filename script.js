const containerProducts = document.querySelector("#container-products");
const loader = document.querySelector("#loader");
const form = document.querySelector("#form-items");
const formWrapper = document.querySelector("#form-wrapper");

const getProducts = value => {
  // добавили loader
  loader.classList.toggle("loader-hide");
  // искусственно чуть замедлили появление карточек
  setTimeout(() => {
    fetch(`https://fakestoreapi.com/products?limit=${value}`)
      .then(res => res.json())
      .then(data => {
        data.map(product => {
          const card = document.createElement("div");
          card.classList.add("product-card");
          const heading = document.createElement("h4");
          heading.textContent = product.title;
          const price = document.createElement("p");
          price.textContent = `Price: ${Math.floor(product.price)} €`;
          const img = document.createElement("img");
          img.src = product.image;
          img.classList.add("card-img");
          card.append(heading, price, img);
          containerProducts.append(card);
        });
        loader.classList.toggle("loader-hide");
      })
      .catch(error => {
        loader.classList.toggle("loader-hide");

        const serverError = document.createElement("p");
        serverError.classList.add("error-message");
        serverError.style.color = "red";
        if (error.message === 'Failed to fetch') {
          serverError.textContent = `Server error: не получилось отправить запрос 😞`;
        } else {
          serverError.textContent = `Server error: ${error.message} 😞`;
        }
        formWrapper.append(serverError);
      });
  }, 1000);
};

const cleanItems = () => {
  while (containerProducts.firstChild) {
    containerProducts.removeChild(containerProducts.firstChild);
  }
};

form.addEventListener("submit", e => {
  e.preventDefault();
  const amount = e.target.amount.value;
  const error = document.querySelector(".error-message");
  if (error) {
    error.remove();
  }
  if (amount > 0 && amount <= 20) {
    e.target.amount.value = "";
    cleanItems();
    getProducts(amount);
  } else {
    cleanItems();
    const error = document.createElement("p");
    error.classList.add("error-message");
    error.style.color = "orange";
    error.textContent = `"${amount}" не подходит! Укажите число от 1 до 20`;
    formWrapper.append(error);
  }
});
