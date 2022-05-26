const LOCAL_STORAGE_KEY = 'shopping-cart-items';

export default class ShoppingCartAPI {
  static saveItem(item) {
    save(item);

    return item;
  }

  static getItems() {
    return read();
  }

  static deleteItem(item) {
    const items = read();

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        items.remove(item);
        break;
      }
    }
    save(items);

    return item;
  }
}

function read() {
  const data = sessionStorage.getItem(LOCAL_STORAGE_KEY);

  if (data == null) {
    return [];
  }
  return JSON.parse(data);
}

function save(data) {
  sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}
