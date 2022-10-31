(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();const d="https://livejs-api.hexschool.io/api/livejs/v1",u="woworoomx",A=()=>axios.get(`${d}/customer/${u}/products`),j=()=>axios.get(`${d}/customer/${u}/carts`),B=t=>axios.post(`${d}/customer/${u}/carts`,t),F=t=>axios.delete(`${d}/customer/${u}/carts/${t}`),P=()=>axios.delete(`${d}/customer/${u}/carts`),L=t=>axios.patch(`${d}/customer/${u}/carts`,t),M=t=>axios.post(`${d}/customer/${u}/orders`,t),i=t=>{(t.response.status===400||t.response.status===403||t.response.status===404)&&Swal.fire({title:`${t.response.data.message}`,icon:"error",confirmButtonText:"\u78BA\u5B9A"})},f=t=>{Swal.fire({icon:"success",showConfirmButton:!1,timer:1500,title:t})},h=t=>"$"+t.toString().replace(new RegExp("\\B(?<!\\.\\d*)(?=(\\d{3})+(?!\\d))","g"),",");(function(){document.addEventListener("DOMContentLoaded",function(){const s=document.querySelector(".recommendation-wall");s.style.cursor="grab";let c={top:0,left:0,x:0,y:0};const x=function(m){s.style.cursor="grabbing",s.style.userSelect="none",c={left:s.scrollLeft,top:s.scrollTop,x:m.clientX,y:m.clientY},document.addEventListener("mousemove",$),document.addEventListener("mouseup",C)},$=function(m){const T=m.clientX-c.x,q=m.clientY-c.y;s.scrollTop=c.top-q,s.scrollLeft=c.left-T},C=function(){s.style.cursor="grab",s.style.removeProperty("user-select"),document.removeEventListener("mousemove",$),document.removeEventListener("mouseup",C)};s.addEventListener("mousedown",x)});let t=document.querySelector(".menuToggle"),e=document.querySelectorAll(".topBar-menu a"),r=document.querySelector(".topBar-menu");t.addEventListener("click",n),e.forEach(s=>{s.addEventListener("click",o)});function n(){r.classList.contains("openMenu")?r.classList.remove("openMenu"):r.classList.add("openMenu")}function o(){r.classList.remove("openMenu")}})();const N=document.querySelector(".productSelect"),w=document.querySelector(".productWrap"),E=document.querySelector(".shoppingCart"),p=document.querySelectorAll("#orderForm input[type=text],#orderForm input[type=tel],#orderForm input[type=email],#orderForm select"),v=document.querySelector(".orderInfo-form"),O=document.querySelector(".orderInfo-btn"),k={\u59D3\u540D:{presence:{message:"\u5FC5\u586B\uFF01"}},\u96FB\u8A71:{presence:{message:"\u5FC5\u586B\uFF01"},format:{pattern:"^09[0-9]{8}$",message:"\u9700\u7B26\u5408\u624B\u6A5F\u7684\u683C\u5F0F\uFF01"}},Email:{presence:{message:"\u5FC5\u586B\uFF01"},email:{message:"\u9700\u7B26\u5408\u96FB\u5B50\u4FE1\u7BB1\u7684\u683C\u5F0F\uFF01"}},\u5BC4\u9001\u5730\u5740:{presence:{message:"\u5FC5\u586B\uFF01"}},\u4EA4\u6613\u65B9\u5F0F:{presence:{message:"\u5FC5\u586B\uFF01"}}};let b=[],a={},g=!1;const I=()=>{D(),W()},D=()=>{A().then(t=>{b=t.data.products,y()}).catch(t=>{i(t)})},H=t=>{const e=t.target.value;if(e==="\u5168\u90E8")y();else{const r=b.filter(n=>n.category===e);y(r)}};N.addEventListener("change",H);const y=(t=b)=>{let e="";t.forEach(r=>{e+=`<li class="productCard">
    <h4 class="productType">\u65B0\u54C1</h4>
    <img
      src="${r.images}"
      alt="${r.title}"
    />
    <a href="#" class="addCardBtn" data-id="${r.id}">\u52A0\u5165\u8CFC\u7269\u8ECA</a>
    <h3>${r.title}</h3>
    <del class="originPrice">NT${h(r.origin_price)}</del>
    <p class="nowPrice">NT${h(r.price)}</p>
  </li>`}),w.innerHTML=e},W=()=>{j().then(t=>{a=t.data,l()}).catch(t=>{i(t)})},X=t=>{if(t.preventDefault(),t.target.nodeName!=="A")return;const{id:e}=t.target.dataset;let r=!0;a.carts.forEach(n=>{n.product.id===e&&(r=!1)}),r?B({data:{productId:e,quantity:1}}).then(o=>{a=o.data,l(),f("\u6210\u529F\u52A0\u5165\u5546\u54C1\u81F3\u8CFC\u7269\u8ECA\uFF01")}).catch(o=>{i(o)}):Swal.fire({title:"\u8CFC\u7269\u8ECA\u5167\u5DF2\u6709\u8A72\u5546\u54C1\uFF01",icon:"warning"})};w.addEventListener("click",X);const l=(t=a)=>{if(t.carts.length>0){let e="";t.carts.forEach(n=>{e+=`
      <tr>
      <td>
        <div class="cardItem-title">
          <img src="${n.product.images}" alt="" />
          <p>${n.product.title}</p>
        </div>
      </td>
      <td>NT${h(n.product.price)}</td>

      <td>
        <div class="addRemoveBtn">
          <button type="button" ${n.quantity===1?"disabled":""} class="cart-btn ${n.quantity===1?"":"hover"} material-icons" data-js="remove" data-id="${n.id}"> remove </button>
          ${n.quantity}
          <button type="button" class="cart-btn hover material-icons" data-js="add" data-id="${n.id}"> add </button>
        </div>
      </td>

      <td>NT${h(n.product.price*n.quantity)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-js="deleteItem" data-id="${n.id}"> clear </a>
      </td>
    </tr>`}),E.innerHTML=Y(e,t.finalTotal),document.querySelector(".shoppingCart-table").addEventListener("click",K)}else t.carts.length===0&&(E.innerHTML='<h3 class="noneitem">\u8CFC\u7269\u8ECA\u73FE\u5728\u6C92\u6709\u6771\u897F~\u8D95\u5FEB\u53BB\u8CFC\u7269\u5427\uFF01</h3>')},Y=(t,e)=>` <h3 class="section-title">\u6211\u7684\u8CFC\u7269\u8ECA</h3>
  <div class="overflowWrap">
    <table class="shoppingCart-table">
      <thead>
        <tr>
          <th width="40%">\u54C1\u9805</th>
          <th width="15%">\u55AE\u50F9</th>
          <th width="15%">\u6578\u91CF</th>
          <th width="15%">\u91D1\u984D</th>
          <th width="15%"></th>
        </tr>
      </thead>
      <tbody>
      ${t}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <a href="#" class="discardAllBtn"  data-js="deleteAllCarts">\u522A\u9664\u6240\u6709\u54C1\u9805</a>
          </td>
          <td></td>
          <td></td>
          <td>
            <p>\u7E3D\u91D1\u984D</p>
          </td>
          <td>NT${h(e)}</td>
        </tr>
      </tfoot>
    </table>
  </div>`,K=t=>{t.preventDefault();const e=t.target.dataset.js;if(e!==void 0){if(e==="deleteAllCarts")R();else if(e==="deleteItem"){const{id:r}=t.target.dataset;U(r)}else if(e==="add"||e==="remove"){const{id:r}=t.target.dataset;V(r,e)}}},R=()=>{Swal.fire({title:"\u78BA\u5B9A\u8981\u6E05\u7A7A\u8CFC\u7269\u8ECA\u55CE\uFF1F",confirmButtonColor:"#6A33F8",confirmButtonText:"\u78BA\u8A8D",cancelButtonText:"\u53D6\u6D88",showCancelButton:!0,icon:"warning"}).then(t=>{t.isConfirmed&&P().then(e=>{a=e.data,l(),f("\u5DF2\u6E05\u7A7A\u8CFC\u7269\u8ECA\uFF01")}).catch(e=>{i(e)})})},U=t=>{F(t).then(e=>{a=e.data,l()}).catch(e=>{i(e)})},V=(t,e)=>{let r=0;a.carts.forEach(n=>{n.id===t&&(r=n.quantity)}),e==="add"?(r+=1,L({data:{id:t,quantity:r}}).then(o=>{a=o.data,l(),f("\u6210\u529F\u66F4\u6539\u8CFC\u7269\u8ECA\u7522\u54C1\u6578\u91CF\uFF01")}).catch(o=>{i(o)})):e==="remove"&&r>1&&(r-=1,L({data:{id:t,quantity:r}}).then(o=>{a=o.data,l(),f("\u6210\u529F\u66F4\u6539\u8CFC\u7269\u8ECA\u7522\u54C1\u6578\u91CF\uFF01")}).catch(o=>{i(o)}))},S=()=>{const t=[...p];t.pop(),t.forEach(r=>{r.nextElementSibling.textContent=""});const e=validate(v,k);if(e){const r=Object.keys(e),n=Object.values(e);r.forEach((o,s)=>{document.querySelector(`[data-message="${o}"]`).textContent=n[s]}),g=!1}else g=!0};v.addEventListener("change",S);const _=()=>{if(!g){S();return}if(a.carts.length===0){Swal.fire({title:"\u8CFC\u7269\u8ECA\u5167\u76EE\u524D\u6C92\u6709\u5546\u54C1\u5594\uFF01",icon:"warning",confirmButtonText:"\u78BA\u5B9A"});return}const t={data:{user:{name:p[0].value,tel:p[1].value,email:p[2].value,address:p[3].value,payment:p[4].value}}};M(t).then(e=>{f("\u6210\u529F\u9001\u51FA\u8A02\u55AE"),v.reset(),a={carts:[]},l()}).catch(e=>{i(e)})};O.addEventListener("click",_);I();
