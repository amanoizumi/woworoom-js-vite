import { getFrontProductsApi } from '../api/front/products.js';

import { getFrontCartsApi } from '../api/front/carts.js';
import { deleteFrontAllCartsApi } from '../api/front/carts.js';
import { deleteFrontCartsApi } from '../api/front/carts.js';
import { patchFrontCartsProductNumApi } from '../api/front/carts.js';
import { postFrontCartsApi } from '../api/front/carts.js';

import { postFrontOrderApi } from '../api/front/orders.js';

import { showSuccess, showError } from '../utilities.js';

import { currency } from '../utilities.js';
import '../index-animation.js';

// DOM
const productSelect = document.querySelector('.productSelect');
const productWrap = document.querySelector('.productWrap');
const shoppingCart = document.querySelector('.shoppingCart');

const inputs = document.querySelectorAll(
  '#orderForm input[type=text],#orderForm input[type=tel],#orderForm input[type=email],#orderForm select'
);
const formEl = document.querySelector('.orderInfo-form');
const submit = document.querySelector('.orderInfo-btn');

// 驗證表單用的物件
const constraints = {
  姓名: {
    presence: {
      message: '必填！',
    },
  },

  電話: {
    presence: {
      message: '必填！',
    },
    format: {
      pattern: '^09[0-9]{8}$',
      message: '需符合手機的格式！',
    },
  },
  Email: {
    presence: {
      message: '必填！',
    },
    email: {
      message: '需符合電子信箱的格式！',
    },
  },
  寄送地址: {
    presence: {
      message: '必填！',
    },
  },
  交易方式: {
    presence: {
      message: '必填！',
    },
  },
};

// 暫存資料
let productsData = [];
let cartsData = {};
let canSubmit = false;

// 初始化：取得產品列表、取得購物車內容
const init = () => {
  getProducts();
  getCarts();
};

// 取得產品列表
const getProducts = () => {
  getFrontProductsApi()
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
  getFrontCartsApi()
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

    postFrontCartsApi(obj)
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
  // 購物車有產品就渲染到畫面
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
  if (doSomething === undefined) return;

  if (doSomething === 'deleteAllCarts') {
    deleteAllCart();
  } else if (doSomething === 'deleteItem') {
    const { id } = e.target.dataset;
    deleteCartItem(id);
  } else if (doSomething === 'add' || doSomething === 'remove') {
    const { id } = e.target.dataset;
    editCartsProductNum(id, doSomething);
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
      deleteFrontAllCartsApi()
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
  deleteFrontCartsApi(id)
    .then((res) => {
      cartsData = res.data;
      renderCarts();
    })
    .catch((err) => {
      showError(err);
    });
};

// 編輯購物車產品數量
const editCartsProductNum = (id, doSomething) => {
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

    patchFrontCartsProductNumApi(obj)
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
    patchFrontCartsProductNumApi(obj)
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
const formValidate = () => {
  const inputsArr = [...inputs];
  inputsArr.pop();

  inputsArr.forEach((item) => {
    item.nextElementSibling.textContent = '';
  });

  const errors = validate(formEl, constraints);
  if (errors) {
    const keys = Object.keys(errors);
    const values = Object.values(errors);

    keys.forEach((item, idx) => {
      document.querySelector(`[data-message="${item}"]`).textContent = values[idx];
    });
    canSubmit = false;
  } else {
    canSubmit = true;
  }
};

formEl.addEventListener('change', formValidate);

// 送出訂單
const submitOrder = () => {
  // 如果表單仍未通過驗證，按下 submit 按鈕後會重新驗證表單，不送出訂單
  if (!canSubmit) {
    formValidate();
    return;
  }

  // 購物車沒商品也不能送出表單
  if (cartsData.carts.length === 0) {
    Swal.fire({
      title: `購物車內目前沒有商品喔！`,
      icon: 'warning',
      confirmButtonText: '確定',
    });
    return;
  }

  const obj = {
    data: {
      user: {
        name: inputs[0].value,
        tel: inputs[1].value,
        email: inputs[2].value,
        address: inputs[3].value,
        payment: inputs[4].value,
      },
    },
  };

  postFrontOrderApi(obj)
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
};

submit.addEventListener('click', submitOrder);

init();
