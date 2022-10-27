import { apiPath, myPath } from './config.js';
import { showSuccess, showError } from './utilities.js';
import { currency } from './utilities.js';
import './index-animation.js';

// DOM
const productSelect = document.querySelector('.productSelect');
const productWrap = document.querySelector('.productWrap');
const shoppingCart = document.querySelector('.shoppingCart');
const formEl = document.querySelector('.orderInfo-form');
const submit = document.querySelector('.orderInfo-btn');

// 暫存資料
let productsData = [];
let cartsData = {};

const init = () => {
  getProducts();
  getCarts();
};

// 取得產品列表
const getProducts = () => {
  axios
    .get(`${apiPath}/customer/${myPath}/products`)
    .then((res) => {
      productsData = res.data.products;
      renderProducts();
    })
    .catch((err) => {
      showError(err);
    });
};

// 產品篩選
const productsFilter = (e) => {
  const category = e.target.value;
  if (category === '全部') {
    renderProducts();
  } else {
    const filteredData = productsData.filter((product) => product.category === category);
    renderProducts(filteredData);
  }
};
productSelect.addEventListener('change', productsFilter);

// 渲染產品列表
const renderProducts = (data = productsData) => {
  let template = '';

  data.forEach((product) => {
    template += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${product.images}"
      alt="${product.title}"
    />
    <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
    <h3>${product.title}</h3>
    <del class="originPrice">NT${currency(product.origin_price)}</del>
    <p class="nowPrice">NT${currency(product.price)}</p>
  </li>`;
  });
  productWrap.innerHTML = template;
};

// 取得購物車資料
const getCarts = () => {
  axios
    .get(`${apiPath}/customer/${myPath}/carts`)
    .then((res) => {
      cartsData = res.data;
      renderCarts();
    })
    .catch((err) => {
      showError(err);
    });
};

// 加入商品到購物車
const addProductToCart = (e) => {
  e.preventDefault();

  if (e.target.nodeName !== 'A') return;
  const { id } = e.target.dataset;

  // 檢查購物車內是否有某商品存在
  let check = true;
  cartsData.carts.forEach((item) => {
    if (item.product.id === id) {
      check = false;
    }
  });

  // 如果沒有該商品，就加到購物車
  if (check) {
    const obj = {
      data: {
        productId: id,
        quantity: 1,
      },
    };
    axios
      .post(`${apiPath}/customer/${myPath}/carts`, obj)
      .then((res) => {
        cartsData = res.data;
        renderCarts();
        showSuccess('成功加入商品至購物車！');
      })
      .catch((err) => {
        showError(err);
      });
  } else {
    Swal.fire({
      title: '購物車內已有該商品！',
      icon: 'warning',
    });
  }
};
productWrap.addEventListener('click', addProductToCart);

// 渲染購物車
const renderCarts = (data = cartsData) => {
  // 購物車有東西就渲染出來
  if (data.carts.length > 0) {
    let template = '';
    data.carts.forEach((item) => {
      template += `
      <tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="" />
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT${currency(item.product.price)}</td>

      <td>
        <div class="addRemoveBtn">
          <button type="button" ${item.quantity === 1 ? 'disabled' : ''} class="cart-btn ${
        item.quantity === 1 ? '' : 'hover'
      } material-icons" data-js="remove" data-id="${item.id}"> remove </button>
          ${item.quantity}
          <button type="button" class="cart-btn hover material-icons" data-js="add" data-id="${
            item.id
          }"> add </button>
        </div>
      </td>

      <td>NT${currency(item.product.price * item.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-js="deleteItem" data-id="${item.id}"> clear </a>
      </td>
    </tr>`;
    });

    shoppingCart.innerHTML = cartsTemplate(template, data.finalTotal);
    // 假如購物車有內容的話就綁上監聽
    const shoppingCartTable = document.querySelector('.shoppingCart-table');
    shoppingCartTable.addEventListener('click', cartsEventsHandler);
  } else if (data.carts.length === 0) {
    shoppingCart.innerHTML = `<h3 class="noneitem">購物車現在沒有東西~趕快去購物吧！</h3>`;
  }
};

// 購物車模板
const cartsTemplate = (productsStr, totalCost) => {
  return ` <h3 class="section-title">我的購物車</h3>
  <div class="overflowWrap">
    <table class="shoppingCart-table">
      <thead>
        <tr>
          <th width="40%">品項</th>
          <th width="15%">單價</th>
          <th width="15%">數量</th>
          <th width="15%">金額</th>
          <th width="15%"></th>
        </tr>
      </thead>
      <tbody>
      ${productsStr}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <a href="#" class="discardAllBtn"  data-js="deleteAllCarts">刪除所有品項</a>
          </td>
          <td></td>
          <td></td>
          <td>
            <p>總金額</p>
          </td>
          <td>NT${currency(totalCost)}</td>
        </tr>
      </tfoot>
    </table>
  </div>`;
};

// 監聽購物車行為
const cartsEventsHandler = (e) => {
  e.preventDefault();
  const doSomething = e.target.dataset.js;
  console.log(doSomething);
  if (doSomething === undefined) return;

  if (doSomething === 'deleteAllCarts') {
    deleteAllCart();
  } else if (doSomething === 'deleteItem') {
    const { id } = e.target.dataset;
    deleteCartItem(id);
  } else if (doSomething === 'add' || doSomething === 'remove') {
    const { id } = e.target.dataset;
    editItemNum(id, doSomething);
  }
};
// 刪除購物車全部品項
const deleteAllCart = () => {
  Swal.fire({
    title: '確定要清空購物車嗎？',
    confirmButtonColor: '#6A33F8',
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    showCancelButton: true,
    icon: 'warning',
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${apiPath}/customer/${myPath}/carts`)
        .then((res) => {
          cartsData = res.data;
          renderCarts();
          showSuccess('已清空購物車！');
        })
        .catch((err) => {
          showError(err);
        });
    }
  });
};
// 刪除購物車單一品項
const deleteCartItem = (id) => {
  axios
    .delete(`${apiPath}/customer/${myPath}/carts/${id}`)
    .then((res) => {
      cartsData = res.data;
      renderCarts();
    })
    .catch((err) => {
      showError(err);
    });
};

// 編輯購物車產品數量
const editItemNum = (id, doSomething) => {
  let num = 0;
  cartsData.carts.forEach((item) => {
    if (item.id === id) {
      num = item.quantity;
    }
  });

  if (doSomething === 'add') {
    num += 1;
    const obj = {
      data: {
        id,
        quantity: num,
      },
    };

    axios
      .patch(`${apiPath}/customer/${myPath}/carts`, obj)
      .then((res) => {
        cartsData = res.data;
        renderCarts();
        showSuccess('成功更改購物車產品數量！');
      })
      .catch((err) => {
        showError(err);
      });
  } else if (doSomething === 'remove' && num > 1) {
    num -= 1;
    const obj = {
      data: {
        id,
        quantity: num,
      },
    };
    axios
      .patch(`${apiPath}/customer/${myPath}/carts`, obj)
      .then((res) => {
        cartsData = res.data;
        renderCarts();
        showSuccess('成功更改購物車產品數量！');
      })
      .catch((err) => {
        showError(err);
      });
  }
};

// 訂單驗證
const formCheck = () => {
  const formObj = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    tradeWay: '',
  };
  const formElDom = [...formEl];
  formElDom.pop();
  formElDom.forEach((el) => {
    formObj[el.id] = el.value.trim();
  });

  const objKeys = Object.keys(formObj);
  const objValues = Object.values(formObj);

  // 如果資料有誤就賦值 false
  let formIsOK = true;

  // 空白驗證
  for (let i = 0; i < objKeys.length - 1; i++) {
    const megDOM = document.querySelector(`#${objKeys[i]}`);
    if (objValues[i] === '') {
      megDOM.nextElementSibling.textContent = '必填';
      formIsOK = false;
    } else {
      megDOM.nextElementSibling.textContent = '';
    }
  }
  // 電話驗證(手機 10 碼)
  const phoneRex = /^(09)[0-9]{8}$/;
  const phoneStr = formObj.customerPhone;
  const phoneMsg = document.querySelector('#customerPhone').nextElementSibling;

  if (!phoneRex.test(phoneStr) && phoneStr !== '') {
    phoneMsg.textContent = '不符合手機格式';
    formIsOK = false;
  } else if (phoneRex.test(phoneStr)) {
    phoneMsg.textContent = '';
  }

  // Email
  const emailRex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  const emailStr = formObj.customerEmail;
  const emailMsg = document.querySelector('#customerEmail').nextElementSibling;

  if (!emailRex.test(emailStr) && emailStr !== '') {
    emailMsg.textContent = '不符合Email格式';
    formIsOK = false;
  } else if (emailRex.test(emailStr)) {
    emailMsg.textContent = '';
  }

  if (formIsOK) return formObj;
};

formEl.addEventListener('change', formCheck);

// 送出訂單
const submitOrder = () => {
  if (cartsData.carts.length === 0) {
    Swal.fire({
      title: `購物車內目前沒有商品喔！`,
      icon: 'warning',
      confirmButtonText: '確定',
    });
  } else {
    const formData = formCheck();
    if (formData !== undefined) {
      const obj = {
        data: {
          user: {
            name: formData.customerName,
            tel: formData.customerPhone,
            email: formData.customerEmail,
            address: formData.customerAddress,
            payment: formData.tradeWay,
          },
        },
      };
      axios
        .post(`${apiPath}/customer/${myPath}/orders`, obj)
        .then((res) => {
          showSuccess('成功送出訂單');
          formEl.reset();
          cartsData = {
            carts: [],
          };
          renderCarts();
        })
        .catch((err) => {
          showError(err);
        });
    }
  }
};

submit.addEventListener('click', submitOrder);

init();
