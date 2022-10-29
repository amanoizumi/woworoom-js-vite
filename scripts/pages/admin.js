import { apiPath, myPath, token } from '../config.js';

import { getAdminOrdersApi } from '../api/admin/orders.js';
import { deleteAdminOrderApi } from '../api/admin/orders.js';
import { deleteAdminAllOrdersApi } from '../api/admin/orders.js';
import { putAdminOrderApi } from '../api/admin/orders.js';

import { showSuccess, showError } from '../utilities.js';
import '../admin-animation.js';

// DOM
const orderBody = document.querySelector('.order-body');
const sortOrder = document.querySelector('#sortOrder');
const discardAllBtn = document.querySelector('.discardAllBtn');
const changeCategory = document.querySelector('#change-category');
const changeDetail = document.querySelector('#change-detail');
const sectionTitle = document.querySelector('.section-title');

let ordersData = [];
const colorsArr = ['#301E5F', '#5434A7', '#9D7FEA', '#DACBFF'];

// C3.js
const renderC3 = () => {
  const btnChange = document.querySelectorAll('.btn-change');
  if (ordersData.length === 0) {
    btnChange.forEach((item) => {
      item.classList.add('d-none');
    });
    sectionTitle.innerHTML = '';
    c3.generate({
      bindto: '#chart',
      data: {
        type: 'pie',
        columns: [['目前沒有訂單', 1]],
        colors: { 目前沒有訂單: '#888888' },
      },
    });
  } else {
    btnChange.forEach((item) => {
      item.classList.remove('d-none');
    });
    // 全產品類別營收比重
    showObjCategory();
  }
};

// 全產品類別營收比重
const showObjCategory = () => {
  sectionTitle.innerHTML = '全產品類別營收比重';
  changeDetail.classList.remove('active');
  changeCategory.classList.add('active');

  const objCategory = {
    收納: 0,
    床架: 0,
    窗簾: 0,
  };

  ordersData.forEach((order) => {
    order.products.forEach((product) => {
      objCategory[product.category] += product.quantity * product.price;
    });
  });

  const objCategoryKeys = Object.keys(objCategory);
  const objCategoryValues = Object.values(objCategory);
  const objCategoryArr = [];

  objCategoryKeys.forEach((item, idx) => {
    objCategoryArr.push([objCategoryKeys[idx], objCategoryValues[idx]]);
  });

  // 營收大排到小
  objCategoryArr.sort((a, b) => b[1] - a[1]);

  const objCategoryColors = {};
  objCategoryArr.forEach((item, idx) => {
    objCategoryColors[item[0]] = colorsArr[idx];
  });

  c3.generate({
    bindto: '#chart',
    data: {
      type: 'pie',
      columns: objCategoryArr,
      colors: objCategoryColors,
    },
  });
};

// 全品項營收比重
const showObjDetail = () => {
  sectionTitle.innerHTML = '全品項營收比重';
  changeCategory.classList.remove('active');
  changeDetail.classList.add('active');
  const objDetail = {};
  ordersData.forEach((order) => {
    order.products.forEach((product) => {
      if (objDetail[product.title] === undefined) {
        objDetail[product.title] = product.quantity * product.price;
      } else {
        objDetail[product.title] += product.quantity * product.price;
      }
    });
  });

  const objDetailKeys = Object.keys(objDetail);
  const objDetailValues = Object.values(objDetail);

  const objDetailArr = [];
  objDetailKeys.forEach((item, idx) => {
    objDetailArr.push([objDetailKeys[idx], objDetailValues[idx]]);
  });

  // 由最大排到最小
  objDetailArr.sort((a, b) => b[1] - a[1]);

  // 分配顏色
  const objDetailColors = {};
  const objDetailArrLen = objDetailArr.length;

  // 品項大於三個時，把除了營收前三高的，都歸類為「其他」
  if (objDetailArrLen > 3) {
    const arrSpliced = objDetailArr.splice(3);

    let another = 0;
    arrSpliced.forEach((item) => (another += item[1]));
    objDetailArr.push(['其他', another]);

    objDetailArr.forEach((item, idx) => {
      objDetailColors[item[0]] = colorsArr[idx];
    });
  } else if (objDetailArrLen <= 3) {
    objDetailArr.forEach((item, idx) => {
      objDetailColors[item[0]] = colorsArr[idx];
    });
  }

  c3.generate({
    bindto: '#chart',
    data: {
      type: 'pie',
      columns: objDetailArr,
      colors: objDetailColors,
    },
  });
};
// 切換顯示
changeCategory.addEventListener('click', showObjCategory);
changeDetail.addEventListener('click', showObjDetail);

// 取得訂單列表
const getOrderList = () => {
  getAdminOrdersApi()
    .then((res) => {
      ordersData = res.data.orders;
      renderC3();
      renderOrder();
    })
    .catch((err) => {
      showError(err);
    });
};

// 渲染訂單
const renderOrder = (data = ordersData) => {
  if (data.length === 0) {
    orderBody.innerHTML = '<tr><td colspan="8" class="text-center">當前項目沒有訂單</td></tr>';
  } else {
    sortOrders(data);
    let template = '';
    data.forEach((item) => {
      let productsStr = '';
      item.products.forEach((product) => {
        productsStr += `<li>${product.title} X ${product.quantity}</li>`;
      });

      template += `<tr>
      <td>${item.createdAt}</td>
      <td>
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
      </td>
      <td>${item.user.address}</td>
      <td>${item.user.email}</td>
      <td>
        <ul>${productsStr}</ul>
      </td>
      <td>${calcOrderDay(item.createdAt)}</td>
      <td class="orderStatus">
        <a href="#" data-id="${item.id}" data-js="edit" data-paid="${item.paid}">${
        item.paid ? '已處理' : '未處理'
      }</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-order="${
          item.createdAt
        }" data-js="delete" data-id="${item.id}"/>
      </td>
    </tr>`;
    });
    orderBody.innerHTML = template;
  }
};

// 按照時間先後排列訂單，最舊的優先處理
const sortOrders = (data = ordersData) => {
  data.sort((a, b) => a.createdAt - b.createdAt);
};

// 秒轉換成日期字串
const calcOrderDay = (num) => {
  // 秒轉成毫秒
  num = num * 1000;
  const date = new Date(num);

  const yearStr = date.getFullYear();
  let monthStr = date.getMonth() + 1;
  let dateStr = date.getDate();

  if (monthStr < 10) {
    monthStr = '0' + monthStr;
  }
  if (dateStr < 10) {
    dateStr = '0' + dateStr;
  }

  const str = `${yearStr}/${monthStr}/${dateStr}`;
  return str;
};

// 篩選訂單
const orderSelect = (e) => {
  const str = e.target.value;
  if (str === '全部') {
    renderOrder();
  } else if (str === '未處理') {
    const renderData = ordersData.filter((item) => !item.paid);
    renderOrder(renderData);
  } else if (str === '已處理') {
    const renderData = ordersData.filter((item) => item.paid);
    renderOrder(renderData);
  }
};
sortOrder.addEventListener('change', orderSelect);

// 監聽訂單行為
const orderHandler = (e) => {
  e.preventDefault();
  const doSomething = e.target.dataset.js;
  if (doSomething === undefined) return;
  else if (doSomething === 'edit') {
    editOrder(e);
  } else if (doSomething === 'delete') {
    deleteOrder(e);
  }
};

// 刪除單一筆訂單
const deleteOrder = (e) => {
  const { id } = e.target.dataset;
  const { order } = e.target.dataset;
  Swal.fire({
    title: `確定要刪除訂單 ${order} 嗎？`,
    confirmButtonColor: '#6A33F8',
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    showCancelButton: true,
    icon: 'warning',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAdminOrderApi(id)
        .then((res) => {
          res.data.orders;
          ordersData = res.data.orders;
          renderOrder();
          renderC3();
          sortOrder.value = '全部';
          showSuccess(`成功刪除訂單 ${order}！`);
        })
        .catch((err) => {
          showError(err);
        });
    }
  });
};

// 編輯訂單
const editOrder = (e) => {
  const { id } = e.target.dataset;
  let { paid } = e.target.dataset;
  if (paid === 'false') {
    paid = false;
  } else if (paid === 'true') {
    paid = true;
  }
  const obj = {
    data: {
      id,
      paid: !paid,
    },
  };
  putAdminOrderApi(obj)
    .then((res) => {
      ordersData = res.data.orders;
      renderOrder();
      renderC3();
      sortOrder.value = '全部';
      showSuccess('訂單狀態修改完成');
    })
    .catch((err) => {
      showError(err);
    });
};
orderBody.addEventListener('click', orderHandler);

// 刪除全部訂單
const deleteAllOrders = () => {
  if (ordersData.length === 0) {
    Swal.fire({
      title: '目前沒有任何訂單',
      icon: 'warning',
    });
  } else {
    Swal.fire({
      title: '確定要刪除所有訂單嗎？',
      confirmButtonColor: '#6A33F8',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAdminAllOrdersApi()
          .then((res) => {
            ordersData = res.data.orders;
            sortOrder.value = '全部';
            renderOrder();
            renderC3();
            showSuccess('已刪除所有訂單！');
          })
          .catch((err) => {
            showError(err);
          });
      }
    });
  }
};
discardAllBtn.addEventListener('click', deleteAllOrders);

getOrderList();
