import cart from './ShoppingCartAPI.js';

const url = 'https://dummyimage.com';
const items = [];
const uniqueItemCount = [];

const itemsForSale = document.getElementById('items-for-sale');
const cartBtn = document.querySelector('#cart-btn');
const itemsInCart = document.querySelector('#items-in-cart');
const shoppingCart = document.querySelector('#cart');
const cartTotal = document.querySelector('#total');
fetch('./items.json')
  .then(response => {
    return response.json();
  })
  .then(data => {
    data.forEach(data => {
      items.push(data);
    });
    if (itemsForSale != null) fillItemsForSale();
  });

document.addEventListener('DOMContentLoaded', e => {
  uniqueItemCount.push(...cart.getItems());
  if (uniqueItemCount.length > 0) {
    cartBtn.classList.remove('invisible');
  }
  itemsInCart.innerText = uniqueItemCount.length;
  fillShoppingCart();
});

document.addEventListener('click', e => {
  if (!e.target.matches('button')) return;

  if (e.target.parentNode.parentNode.dataset.id != null) {
    addToCart(e.target.parentNode.parentNode.dataset.id);
    itemsInCart.innerText = uniqueItemCount.length;
    fillShoppingCart();
  }
  if (e.target.matches('[data-remove-from-cart-button]')) {
    removeItemFromCart(e.target.dataset.removeFromCartButton);
  }
});

document.querySelector('#cart-btn').addEventListener('click', e => {
  document.querySelector('#cart-container').classList.toggle('invisible');
});

function fillItemsForSale() {
  console.log(items);
  items.forEach(item => {
    const itemElement = createChild('div', ['lg:w-1/4', 'md:w-1/2', 'p-4', 'w-full']);
    itemElement.dataset.id = item.id;
    const itemChild1 = createChild('div', ['block', 'relative', 'h-48', 'rounded', 'overflow-hidden']);
    itemChild1.append(
      createImage('ecomerce', `${url}/420x260/${item.imageColor}/${item.imageColor}`, 'object-cover', 'object-center', 'w-full', 'h-full', 'block')
    );
    const itemChild2 = createChild('div', ['mt-4', 'flex', 'items-end', 'justify-between']);
    const itemInfo = createChild('div');
    itemInfo.append(
      createChild('h3', ['text-gray-500', 'text-xs', 'tracking-widest', 'title-font', 'uppercase', 'mb-1'], `${item.category}`),
      createChild('h2', ['text-gray-900', 'title-font', 'text-lg', 'font-medium'], `${item.name}`),
      createChild('p', ['mt-1'], `\$${item.priceCents / 100}.00`)
    );
    itemChild2.append(
      itemInfo,
      createChild('button', ['text-white', 'py-2', 'px-4', 'text-xl', 'bg-blue-500', 'rounded', 'hover:bg-blue-700'], 'Add To Cart')
    );
    itemElement.append(itemChild1, itemChild2);
    itemsForSale.append(itemElement);
  });
}

function fillShoppingCart() {
  shoppingCart.innerHTML = '';
  uniqueItemCount.forEach(object => {
    const itemContainer = createChild('div', ['mb-6']);
    const imageContainer = createChild('div', ['block', 'relative', 'h-24', 'rounded', 'overflow-hidden']);
    const image = createImage(
      'ecommerce',
      `${url}/210x130/${object.item.imageColor}/${object.item.imageColor}`,
      'object-cover',
      'object-center',
      'w-full',
      'h-full',
      'block',
      'rounded'
    );
    const removeButton = createChild(
      'button',
      ['absolute', 'top-0', 'right-0', 'bg-black', 'rounded-tr', 'text-white', 'w-6', 'h-6', 'text-lg', 'flex', 'justify-center', 'items-center'],
      '&times;'
    );
    removeButton.setAttribute('data-remove-from-cart-button', `${object.item.id}`);
    imageContainer.append(image, removeButton);
    const priceAndQuantity = createChild('div', ['mt-2', 'flex', 'justify-between']);
    const itemInfo = createItemInfo(object);
    priceAndQuantity.append(itemInfo, createChild('div', [], `\$${(object.item.priceCents / 100) * object.count}.00`));
    itemContainer.append(imageContainer, priceAndQuantity);
    shoppingCart.append(itemContainer);
  });
  const total = uniqueItemCount.reduce((sum, object) => sum + object.item.priceCents * object.count, 0);
  cartTotal.innerText = `\$${total / 100}.00`;
}

function createItemInfo(object) {
  const itemInfo = createChild('div', ['flex', 'items-center', 'title-font']);
  itemInfo.append(createChild('h2', ['text-gray-900', 'text-lg', 'font-medium'], `${object.item.name}`));
  if (object.count > 1) {
    itemInfo.append(createChild('span', ['text-gray-600', 'text-sm', 'font-bold', 'ml-1'], `x${object.count}`));
  }
  return itemInfo;
}

function removeItemFromCart(id) {
  const index = uniqueItemCount.findIndex(object => object.item.id === Number(id));
  uniqueItemCount[index].count -= 1;
  if (uniqueItemCount[index].count < 1) {
    uniqueItemCount.splice(index, 1);
    itemsInCart.innerText = uniqueItemCount.length;
  }
  if (uniqueItemCount.length < 1) {
    cartBtn.classList.add('invisible');
    document.querySelector('#cart-container').classList.toggle('invisible');
  }
  cart.saveItem(uniqueItemCount);
  fillShoppingCart();
}

function createChild(element, classes = [], innerText = undefined) {
  const newElement = document.createElement(element);
  newElement.classList.add(...classes);
  if (innerText != undefined) {
    newElement.innerHTML = innerText;
  }

  return newElement;
}

function createImage(altnerate, source, ...classes) {
  const newImage = document.createElement('img');
  newImage.alt = altnerate;
  newImage.src = source;
  newImage.classList.add(...classes);

  return newImage;
}

function addToCart(id) {
  const data = items.find(item => {
    if (item.id === Number(id)) {
      return item;
    }
  });
  if (isNotUnique(Number(id))) return;
  uniqueItemCount.push({ item: data, count: 1 });

  cart.saveItem(uniqueItemCount);
  cartBtn.classList.remove('invisible');
}

function isNotUnique(id) {
  return uniqueItemCount.some(object => {
    if (object.item.id === id) {
      object.count++;
      cart.saveItem(uniqueItemCount);
      return true;
    }
  });
}
