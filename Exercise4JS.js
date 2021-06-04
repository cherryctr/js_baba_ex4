const ItemCtrl = (function () {
  const Item = function (id, namaProduk, hargaProduk, kategoriProduk) {
    this.id = id;
    this.namaProduk = namaProduk;
    this.hargaProduk = hargaProduk;
    this.kategoriProduk = kategoriProduk;
  }

  const data = {
    items: [],
    currentItem: null,
    totalHarga: 0
  }

  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (namaProduk, hargaProduk, kategoriProduk) {
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 1;
      }
      hargaProduk = parseInt(hargaProduk);
      newItem = new Item(id, namaProduk, hargaProduk, kategoriProduk);
      data.items.push(newItem);
      return newItem;
    },
    getTotalHarga: function () {
      let total = 0;
      data.items.forEach(item => {
        total += item.hargaProduk;
      });
      data.totalHarga = total;
      return data.totalHarga;
    },
    getItemId: function (id) {
      let findItemById = null;
      data.items.forEach(item => {
        if (item.id === id) {
          findItemById = item;
        }
      });
      return findItemById;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (namaProduk, hargaProduk, kategoriProduk) {
      hargaProduk = parseInt(hargaProduk);
      let findItemById = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.namaProduk = namaProduk;
          item.hargaProduk = hargaProduk;
          item.kategoriProduk = kategoriProduk;
          findItemById = item;
        }
      });
      return findItemById;
    }

  }
})();

const UICtrl = (function () {
  const UISelector = {
    tableDataProduk: '#tableDataProduk',
    namaProduk: '#namaProduk',
    hargaProduk: '#hargaProduk',
    kategoriProduk: '#kategoriProduk',
    totalHarga: '.totalHarga',
    btnSubmit: '.btn-submit',
    btnUpdate: '.btn-update',
    listtableDataProduk: '#tableDataProduk tr'
  }

  return {
    populatetableDataProduk: function (items) {
      let html = '';
      items.forEach(item => {
        html +=
          `
        <tr>
        <td>${item.id}</td>
        <td>${item.namaProduk}</td>
        <td>${item.hargaProduk}</td>
        <td>${item.kategoriProduk}</td>
        <td><a class='delete' style='cursor:pointer'>delete</a>&nbsp;<a class='edit'  style='cursor:pointer'>edit</a></td>
        </tr>
        `;
      });
      document.querySelector(UISelector.tableDataProduk).innerHTML = html;
    },
    getUISelector: function () {
      return UISelector;
    },
    getItemInput: function () {
      return {
        namaProduk: document.querySelector(UISelector.namaProduk).value,
        hargaProduk: document.querySelector(UISelector.hargaProduk).value,
        kategoriProduk: document.querySelector(UISelector.kategoriProduk).value
      }
    },
    addTableDataProduk: function (item) {
      const tr = document.createElement('tr');
      // Ini yang di tambahkan
      tr.setAttribute("id", `item-${item.id}`);
      tr.innerHTML =
        `
      <td'>${item.id}</td>
      <td>${item.namaProduk}</td>
      <td>${item.hargaProduk}</td>
      <td>${item.kategoriProduk}</td>
      <td><a class='delete' style='cursor:pointer'>delete</a>&nbsp;<a class='edit'  style='cursor:pointer'>edit</a></td>
      `;
      document.querySelector(UISelector.tableDataProduk).appendChild(tr);
    },
    clearHistoryInput: function () {
      document.querySelector(UISelector.namaProduk).value = '',
        document.querySelector(UISelector.hargaProduk).value = '',
        document.querySelector(UISelector.kategoriProduk).value = ''
    },
    showTotalHarga: function (totalHarga) {
      document.querySelector(UISelector.totalHarga).innerHTML = totalHarga;
    },
    getItemEditIntoForm: function () {
      document.querySelector(UISelector.namaProduk).value = ItemCtrl.getCurrentItem().namaProduk,
        document.querySelector(UISelector.hargaProduk).value = ItemCtrl.getCurrentItem().hargaProduk,
        document.querySelector(UISelector.kategoriProduk).value = ItemCtrl.getCurrentItem().kategoriProduk
      UICtrl.showEditStatus();
    },
    clearEditStatus: function () {
      UICtrl.clearHistoryInput();
      document.querySelector(UISelector.btnUpdate).style.display = 'none';
      document.querySelector(UISelector.btnSubmit).style.display = 'inline';
    },
    showEditStatus: function () {
      document.querySelector(UISelector.btnUpdate).style.display = 'inline';
      document.querySelector(UISelector.btnSubmit).style.display = 'none';
    },
    updatelisttableDataProduk: function (item) {
      let listtableDataProduk = document.querySelectorAll(UISelector.listtableDataProduk)

      // Bagian dissini yang di tambahkan
      listtableDataProduk.forEach(listtableDataProduks => {
        const itemID = listtableDataProduks.getAttribute('id');
        console.log(itemID);
        if (itemID === `item-${item.id}`) {
          
          document.querySelector(`#${itemID}`).innerHTML =
            `
         
          <td>${item.id}</td>
          <td>${item.namaProduk}</td>
          <td>${item.hargaProduk}</td>
          <td>${item.kategoriProduk}</td>
          <td><a class='delete' style='cursor:pointer'>delete</a>&nbsp;<a class='edit'  style='cursor:pointer'>edit</a></td>
        
        `;
        }
      });
    }
  }
})();

const App = (function (ItemCtrl, UICtrl) {
  const loadEventListener = function () {
    const UISelector = UICtrl.getUISelector();
    document.querySelector(UISelector.btnSubmit).addEventListener('click', itemSubmit);
    document.querySelector(UISelector.tableDataProduk).addEventListener('click', itemEdit);
    document.querySelector(UISelector.btnUpdate).addEventListener('click', itemUpdate);
  }
  const itemSubmit = function (e) {
    const input = UICtrl.getItemInput();
    if (input.namaProduk !== '' && input.hargaProduk !== '' && input.kategoriProduk !== '') {
      const newItem = ItemCtrl.addItem(input.namaProduk, input.hargaProduk, input.kategoriProduk);
      console.log(newItem);
      UICtrl.addTableDataProduk(newItem);
      const totalHarga = ItemCtrl.getTotalHarga();
      UICtrl.showTotalHarga(totalHarga);
      UICtrl.clearHistoryInput();
    }
    e.preventDefault();
  }
  const itemEdit = function (e) {
    if (e.target.classList.contains('edit')) {
      const listId = e.target.parentElement.parentElement.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemId(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.getItemEditIntoForm();
    }
  }
  const itemUpdate = function (e) {
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.namaProduk, input.hargaProduk, input.kategoriProduk);
    console.log(updatedItem);
    UICtrl.updatelisttableDataProduk(updatedItem);
    const totalHarga = ItemCtrl.getTotalHarga();
    UICtrl.showTotalHarga(totalHarga);
    UICtrl.clearEditStatus();
    e.preventDefault();
  }
  return {
    init: function () {
      UICtrl.clearEditStatus();
      const items = ItemCtrl.getItems();
      UICtrl.populatetableDataProduk(items);
      loadEventListener();
    }
  }
})(ItemCtrl, UICtrl);

App.init();