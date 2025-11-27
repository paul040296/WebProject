import products from "./products.js";
const iconCartSpan = document.querySelector('.icon-cart span');
const cart = () => {

    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cart = [];

    // Open/Close cart
    iconCart.addEventListener('click', () => body.classList.toggle('activeTabCart'));
    closeCart.addEventListener('click', () => body.classList.toggle('activeTabCart'));

    // =================================================
    //  SET PRODUCT IN CART (FIXED VERSION)
    // =================================================
    const setProductInCart = (idProduct, quantity) => {

        let position = cart.findIndex(item => item.product_id == idProduct);

        if (position === -1) {
            // NEW item
            cart.push({
                product_id: idProduct,
                quantity: quantity
            });
        } else {
            // Update quantity
            if (quantity <= 0) {
                cart.splice(position, 1);  // remove item
            } else {
                cart[position].quantity = quantity;
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartHTML();
    };

    // =================================================
    //  UPDATE CART UI (ONLY ONE FUNCTION)
    // =================================================
   const updateCartHTML = () => {
    listCartHTML.innerHTML = "";
    let totalQuantity = 0;

    cart.forEach(item => {
        totalQuantity += item.quantity;
        let productInfo = products.find(p => p.id == item.product_id);
        if (!productInfo) return;

        let newItem = document.createElement("div");
        newItem.classList.add("item");

        newItem.innerHTML = `
            <div class="image">
                <img src="${productInfo.image}">
            </div>
            <div class="name">${productInfo.name}</div>
            <div class="totalPrice">$${productInfo.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus" data-id="${productInfo.id}">-</span>
                <span>${item.quantity}</span>
                <span class="plus" data-id="${productInfo.id}">+</span>
            </div>
        `;

        listCartHTML.appendChild(newItem);
    });

    // 🔥 FIXED: always show 0 when empty
       
// Set cart count, 0 if empty
        iconCartSpan.innerText = cart.length > 0 ? cart.length : 0;
};

    // =================================================
    //  EVENT LISTENER FOR BUTTONS
    // =================================================
    document.addEventListener("click", event => {
        let btn = event.target;
        let id = btn.dataset.id;

        if (!id) return;

        let itemIndex = cart.findIndex(i => i.product_id == id);

        if (btn.classList.contains("addCart")) {
            let qty = (itemIndex === -1) ? 1 : cart[itemIndex].quantity + 1;
            setProductInCart(id, qty);
        }

        if (btn.classList.contains("minus")) {
            if (itemIndex !== -1) {
                setProductInCart(id, cart[itemIndex].quantity - 1);
            }
        }

        if (btn.classList.contains("plus")) {
            if (itemIndex !== -1) {
                setProductInCart(id, cart[itemIndex].quantity + 1);
            }
        }
    });

    // =================================================
    //  INIT — LOAD LOCALSTORAGE
    // =================================================
    const initApp = () => {
        if (!localStorage.getItem("cart")) { localStorage.setItem("cart", JSON.stringify([])); }
        updateCartHTML();
    };

    initApp();
};

export default cart;
