const TYPES = {
  single:   { name:'Nature Return Bottle',    short:'Single Use', badge:'🌱', color:'#E1F5EE', svgColor:'#9FE1CB', svgStroke:'#0F6E56', capColor:'#0F6E56',  sizes:[{label:'350ml',price:0.075},{label:'500ml',price:0.100},{label:'1L',price:0.145}],   note:'After use, place in agricultural soil — materials decompose and enrich the earth.', tagline:'Use it, then give it back to the earth.', tip:'🌾 After use, place in agricultural land — plant-based materials decompose and enrich the soil naturally.', desc:'<strong>Plant Adaptation Materials</strong> — made from compressed palm fibers and recycled paper. Designed for one use, but gives back to the earth when done.<br><br>Sizes: <strong>350ml · 500ml · 1L</strong>' },
  recycle:  { name:'Recycle & Return Bottle', short:'Recyclable',  badge:'♻️', color:'#E6F1FB', svgColor:'#85B7EB', svgStroke:'#185FA5', capColor:'#185FA5',  sizes:[{label:'250ml',price:0.050},{label:'500ml',price:0.085},{label:'800ml',price:0.097}], note:'Return used bottles to EcoCup for a discount on your next order.', tagline:'Use it multiple times, then bring it back.', tip:'🔄 Return used bottles to us and get a discount on your next order — the more you return, the bigger the reward.', desc:'<strong>Multi-use & recyclable</strong> — built for repeated use. Return it to EcoCup and we recycle it into a new bottle, plus reward you with a discount.<br><br>Sizes: <strong>250ml · 500ml · 800ml</strong>' },
  longlife: { name:'Long Life Bottle',        short:'Premium',     badge:'⭐', color:'#FAEEDA', svgColor:'#FAC775', svgStroke:'#854F0B', capColor:'#854F0B',  sizes:[{label:'350ml',price:0.190},{label:'500ml',price:0.200},{label:'950ml',price:0.325}], note:'Our most advanced bottle — built to be your lifelong sustainable companion.', tagline:'Built to last. Your forever bottle.', tip:'✨ Our most advanced bottle — premium natural materials with reinforced structure. Your lifelong companion.', desc:'<strong>Premium long-life construction</strong> — multi-layer natural materials with the highest-grade eco-coating for durability and longevity.<br><br>Sizes: <strong>350ml · 500ml · 950ml</strong>' }
};

// Pack discounts: pack of 8 = 10% off, 16 = 18% off, 32 = 28% off
const PACKS = [
  {qty:8,  label:'Pack of 8',  icon:'📦', discount:0.10},
  {qty:16, label:'Pack of 16', icon:'🗂️', discount:0.18},
  {qty:32, label:'Pack of 32', icon:'🏭', discount:0.28}
];

let currentMode = 'individual';
let selectedType=null, selectedSize=0, selectedFill='water';
let cart=[], cartDiscount=0;
// Per-card state for org mode
let cardState = { single:{pack:0,fill:'water'}, recycle:{pack:0,fill:'water'}, longlife:{pack:0,fill:'water'} };

function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='page-cart') renderCartPage();
}
document.getElementById('cart-nav-btn').onclick = () => { renderCartPage(); showPage('page-cart'); };

function setMode(mode) {
  currentMode = mode;
  document.getElementById('mode-individual').classList.toggle('active', mode==='individual');
  document.getElementById('mode-org').classList.toggle('active', mode==='org');
  renderTypeCards();
}

function renderTypeCards() {
  const grid = document.getElementById('type-grid');
  grid.innerHTML = Object.entries(TYPES).map(([key,t], i) => {
    const badgeClass = key==='single'?'badge-single':key==='recycle'?'badge-recycle':'badge-longlife';
    const bottleSVG = makeBottleSVGLarge(t, true);
    if(currentMode === 'individual') {
      return `<div class="type-card" style="animation-delay:${i*0.1}s">
        <div class="type-header">
          <span class="type-badge ${badgeClass}">${t.badge} ${t.short}</span>
          <h2>${t.name}</h2>
          <p class="tagline">${t.tagline}</p>
        </div>
        <div class="bottle-visual" style="background:${t.color};">${bottleSVG}</div>
        <div class="eco-tip"><span style="font-size:14px;flex-shrink:0;">${t.tip.split(' ')[0]}</span><span>${t.tip.substring(t.tip.indexOf(' ')+1)}</span></div>
        <div class="type-desc">${t.desc}</div>
        <div style="padding:0 22px 20px;">
          <button class="select-type-btn" style="width:100%;" onclick="openConfig('${key}')">Choose this bottle &rarr;</button>
        </div>
      </div>`;
    } else {
      // Org mode — show pack selector inside card
      const st = cardState[key];
      return `<div class="type-card" style="animation-delay:${i*0.1}s">
        <div class="type-header">
          <span class="type-badge ${badgeClass}">${t.badge} ${t.short}</span>
          <h2>${t.name}</h2>
          <p class="tagline">${t.tagline}</p>
        </div>
        <div class="bottle-visual" style="background:${t.color};">${bottleSVG}</div>
        <div class="eco-tip"><span style="font-size:14px;flex-shrink:0;">${t.tip.split(' ')[0]}</span><span>${t.tip.substring(t.tip.indexOf(' ')+1)}</span></div>
        <div class="type-desc" style="font-size:12px;">${t.desc}</div>
        <div class="pack-section">
          <h4>🏢 Packaging for organizations</h4>
          <div class="option-label" style="margin-bottom:8px;font-size:12px;">Select pack size</div>
          <div class="pack-options">
            ${PACKS.map((p,pi) => {
              const unitPrice = t.sizes[0].price * (1 - p.discount);
              const total = unitPrice * p.qty;
              return `<div class="pack-opt${st.pack===pi?' active':''}" onclick="selectPack('${key}',${pi})">
                <span class="pack-icon">${p.icon}</span>
                <div class="pack-qty">${p.label}</div>
                <div class="pack-price">OMR ${total.toFixed(3)}</div>
                <div style="font-size:10px;color:#639922;margin-top:1px;">${Math.round(p.discount*100)}% off</div>
              </div>`;
            }).join('')}
          </div>
          <div class="option-label" style="margin-bottom:6px;font-size:12px;">Fill preference</div>
          <div class="fill-toggle-small">
            <div class="fill-s${st.fill==='water'?' active':''}" onclick="setCardFill('${key}','water')">💧 Filled with water</div>
            <div class="fill-s${st.fill==='empty'?' active':''}" onclick="setCardFill('${key}','empty')">🫙 Empty bottles</div>
          </div>
          <button class="pack-add-btn" onclick="addPackToCart('${key}')">Add Pack to Cart 🛒</button>
        </div>
      </div>`;
    }
  }).join('');
}

function selectPack(typeKey, packIdx) {
  cardState[typeKey].pack = packIdx;
  renderTypeCards();
}

function setCardFill(typeKey, fill) {
  cardState[typeKey].fill = fill;
  renderTypeCards();
}

function addPackToCart(typeKey) {
  const t = TYPES[typeKey];
  const st = cardState[typeKey];
  const pack = PACKS[st.pack];
  const basePrice = t.sizes[0].price;
  const fillExtra = st.fill==='water' ? 0.100 : 0;
  const unitPrice = (basePrice * (1 - pack.discount)) + fillExtra;
  const totalPrice = unitPrice * pack.qty;
  const item = {
    id: Date.now(),
    typeKey, typeName: t.name, badge: t.badge,
    size: t.sizes[0].label,
    fill: st.fill==='water'?'Filled':'Empty',
    price: totalPrice, qty: 1,
    svgColor: t.svgColor, svgStroke: t.svgStroke, capColor: t.capColor,
    label: pack.label + ' · ' + t.sizes[0].label,
    isPack: true, packQty: pack.qty
  };
  const ex = cart.find(c=>c.typeKey===typeKey&&c.isPack&&c.packQty===pack.qty&&c.fill===item.fill);
  if(ex){ex.qty++;}else{cart.push(item);}
  updateBadge();
  showToast(t.badge + ' ' + pack.label + ' of ' + t.name + ' added!');
}

function makeBottleSVGLarge(t, filled) {
  const f = filled;
  const water = f ? `<path d="M18 85 L62 85 L60 110 Q60 118 52 118 L28 118 Q20 118 18 110 Z" fill="${t.svgStroke}" opacity="0.2"/>` : '';
  return `<svg viewBox="0 0 80 130" fill="none" width="70" height="110">
    <path d="M28 20 Q26 15 26 10 L54 10 Q54 15 52 20 L56 30 Q62 40 62 60 L62 110 Q62 118 54 118 L26 118 Q18 118 18 110 L18 60 Q18 40 24 30 Z" fill="${f?t.svgColor:'none'}" stroke="${t.svgStroke}" stroke-width="1.8"/>
    ${water}
    <path d="M28 20 Q26 15 26 10 L54 10 Q54 15 52 20 Z" fill="${t.svgColor}" stroke="${t.svgStroke}" stroke-width="1.8"/>
    <rect x="26" y="6" width="28" height="6" rx="3" fill="${t.capColor}"/>
  </svg>`;
}

function openConfig(typeKey) {
  selectedType=typeKey; selectedSize=0; selectedFill='water';
  const t=TYPES[typeKey];
  document.getElementById('config-preview-bg').style.background=t.color;
  document.getElementById('config-type-title').textContent='Configure your '+t.name;
  document.getElementById('config-note').textContent=t.note;
  renderBottleSVG(); renderSizePills(); renderSummary();
  document.getElementById('fill-water').classList.add('active');
  document.getElementById('fill-empty').classList.remove('active');
  document.getElementById('fill-dot').className='fill-dot filled';
  document.getElementById('fill-label').textContent='Filled with water';
  showPage('page-config');
}

function renderBottleSVG() {
  const t=TYPES[selectedType], f=selectedFill==='water';
  const water=f?`<path d="M18 85 L62 85 L60 110 Q60 118 52 118 L28 118 Q20 118 18 110 Z" fill="${t.svgStroke}" opacity="0.2"/>`:'';
  document.getElementById('config-bottle-img').innerHTML=`<svg viewBox="0 0 80 130" fill="none" width="110" height="165" style="animation:float 3s ease-in-out infinite;">
    <path d="M28 20 Q26 15 26 10 L54 10 Q54 15 52 20 L56 30 Q62 40 62 60 L62 110 Q62 118 54 118 L26 118 Q18 118 18 110 L18 60 Q18 40 24 30 Z" fill="${f?t.svgColor:'none'}" stroke="${t.svgStroke}" stroke-width="1.8"/>
    ${water}
    <path d="M28 20 Q26 15 26 10 L54 10 Q54 15 52 20 Z" fill="${t.svgColor}" stroke="${t.svgStroke}" stroke-width="1.8"/>
    <rect x="26" y="6" width="28" height="6" rx="3" fill="${t.capColor}"/>
  </svg>`;
}

function renderSizePills() {
  document.getElementById('size-pills').innerHTML=TYPES[selectedType].sizes.map((s,i)=>
    `<div class="pill${i===selectedSize?' active':''}" onclick="selectSize(${i})">${s.label}</div>`).join('');
}

function selectSize(i) { selectedSize=i; renderSizePills(); renderSummary(); }

function setFill(type) {
  selectedFill=type;
  document.getElementById('fill-water').classList.toggle('active',type==='water');
  document.getElementById('fill-empty').classList.toggle('active',type==='empty');
  document.getElementById('fill-dot').className='fill-dot '+(type==='water'?'filled':'empty');
  document.getElementById('fill-label').textContent=type==='water'?'Filled with water':'Empty bottle';
  renderBottleSVG(); renderSummary();
}

function renderSummary() {
  const t=TYPES[selectedType], s=t.sizes[selectedSize];
  const fe=selectedFill==='water'?0.100:0, p=s.price+fe;
  document.getElementById('summary-type-box').innerHTML=`<div style="width:36px;height:36px;border-radius:8px;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:18px;">${t.badge}</div><div><div style="font-size:14px;font-weight:500;">${t.name}</div><div style="font-size:12px;color:#555;">${t.short}</div></div>`;
  document.getElementById('summary-rows').innerHTML=`<div class="sum-row"><span>Size</span><span>${s.label}</span></div><div class="sum-row"><span>Fill</span><span>${selectedFill==='water'?'Filled with water':'Empty bottle'}</span></div><div class="sum-row"><span>Fill surcharge</span><span>${selectedFill==='water'?'+OMR 0.100':'—'}</span></div>`;
  document.getElementById('config-price').textContent='OMR '+p.toFixed(3);
}

function addConfigToCart() {
  const t=TYPES[selectedType], s=t.sizes[selectedSize];
  const fe=selectedFill==='water'?0.100:0, p=s.price+fe;
  const item={id:Date.now(),typeKey:selectedType,typeName:t.name,badge:t.badge,size:s.label,fill:selectedFill==='water'?'Filled':'Empty',price:p,qty:1,svgColor:t.svgColor,svgStroke:t.svgStroke,capColor:t.capColor,label:s.label,isPack:false};
  const ex=cart.find(c=>c.typeKey===selectedType&&c.size===s.label&&c.fill===item.fill&&!c.isPack);
  if(ex){ex.qty++;}else{cart.push(item);}
  updateBadge(); showToast(t.badge+' '+t.short+' '+s.label+' added to cart!'); showPage('page-products');
}

function updateBadge(){
  const total=cart.reduce((s,i)=>s+i.qty,0);
  const b=document.getElementById('cart-badge');
  b.textContent=total; b.classList.toggle('show',total>0);
}

function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

function getSubtotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0);}
function getTotal(){return Math.max(0,getSubtotal()-cartDiscount);}

function bottleSVGSmall(item){
  const f=item.fill==='Filled';
  const w=f?`<path d="M9 29 L31 29 L30 38 Q29 41 25 41 L15 41 Q11 41 10 38 Z" fill="${item.svgStroke}" opacity="0.2"/>`:'';
  return `<svg viewBox="0 0 40 46" fill="none" width="36" height="46"><path d="M13 8 Q12 6 12 4 L28 4 Q28 6 27 8 L29 12 Q31 16 31 24 L31 40 Q31 44 27 44 L13 44 Q9 44 9 40 L9 24 Q9 16 11 12 Z" fill="${f?item.svgColor:'none'}" stroke="${item.svgStroke}" stroke-width="1.5"/>${w}<path d="M13 8 Q12 6 12 4 L28 4 Q28 6 27 8 Z" fill="${item.svgColor}" stroke="${item.svgStroke}" stroke-width="1.5"/><rect x="12" y="2" width="16" height="3" rx="1.5" fill="${item.capColor}"/></svg>`;
}

function renderCartPage(){
  const list=document.getElementById('cart-items-list'), empty=document.getElementById('empty-cart');
  document.getElementById('cart-sub-label').textContent=cart.length+' item'+(cart.length!==1?'s':'');
  if(!cart.length){list.innerHTML='';empty.style.display='block';document.getElementById('checkout-btn').disabled=true;updateCartSummary();return;}
  empty.style.display='none'; document.getElementById('checkout-btn').disabled=false;
  list.innerHTML=cart.map((item,i)=>`<div class="cart-item" style="animation-delay:${i*0.07}s">
    <div class="cart-thumb">${bottleSVGSmall(item)}</div>
    <div class="cart-item-info">
      <h4>${item.badge} ${item.typeName}${item.isPack?' · '+item.label:''}</h4>
      <p>${item.isPack?'Pack of '+item.packQty+' · ':''}${item.size} · ${item.fill}</p>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="chQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="chQty(${item.id},1)">+</button>
        <button class="remove-btn" onclick="rmItem(${item.id})">Remove</button>
      </div>
    </div>
    <div class="item-price">OMR ${(item.price*item.qty).toFixed(3)}</div>
  </div>`).join('');
  updateCartSummary();
}

function updateCartSummary(){
  document.getElementById('cart-subtotal').textContent='OMR '+getSubtotal().toFixed(3);
  document.getElementById('cart-total').textContent='OMR '+getTotal().toFixed(3);
  const dr=document.getElementById('discount-row');
  if(cartDiscount>0){dr.style.display='flex';document.getElementById('discount-val').textContent='−OMR '+cartDiscount.toFixed(3);}
  else{dr.style.display='none';}
}

function chQty(id,d){const i=cart.find(c=>c.id===id);if(!i)return;i.qty=Math.max(0,i.qty+d);if(!i.qty)cart=cart.filter(c=>c.id!==id);updateBadge();renderCartPage();}
function rmItem(id){cart=cart.filter(c=>c.id!==id);updateBadge();renderCartPage();}

function applyPromo(){
  const code=document.getElementById('promo-input').value.trim().toUpperCase();
  const msg=document.getElementById('promo-msg');
  if(code==='ECO10'){cartDiscount=getSubtotal()*0.1;msg.style.color='#3B6D11';msg.textContent='10% discount applied!';}
  else if(code==='OMAN'){cartDiscount=0.500;msg.style.color='#3B6D11';msg.textContent='OMR 0.075 discount applied!';}
  else{cartDiscount=0;msg.style.color='#E24B4A';msg.textContent='Invalid promo code.';}
  updateCartSummary();
}

function renderMiniCart(){
  document.getElementById('mini-items').innerHTML=cart.map(item=>`<div class="mi">
    <div class="mi-thumb">${bottleSVGSmall(item)}</div>
    <div><div class="mi-name">${item.typeName}${item.isPack?' ('+item.label+')':''}</div><div class="mi-sub">${item.size} · ${item.fill} × ${item.qty}</div></div>
    <div class="mi-price">OMR ${(item.price*item.qty).toFixed(3)}</div>
  </div>`).join('');
  document.getElementById('co-sub').textContent='OMR '+getSubtotal().toFixed(3);
  document.getElementById('co-total').textContent='OMR '+getTotal().toFixed(3);
}

function selPay(el,type){
  document.querySelectorAll('.pay-opt').forEach(p=>p.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('card-fields').style.display=type==='card'?'block':'none';
  document.getElementById('cod-fields').style.display=type==='cod'?'block':'none';
  document.getElementById('thawani-fields').style.display=type==='thawani'?'block':'none';
}
function fmtCard(el){let v=el.value.replace(/\D/g,'').substring(0,16);el.value=v.replace(/(.{4})/g,'$1 ').trim();}
function fmtExp(el){let v=el.value.replace(/\D/g,'').substring(0,4);if(v.length>=2)v=v.substring(0,2)+' / '+v.substring(2);el.value=v;}

function placeOrder(){
  const ref='ECO-'+Math.floor(10000+Math.random()*90000);
  document.getElementById('order-ref').textContent='Order #'+ref;
  cart=[];cartDiscount=0;updateBadge();showPage('page-success');
}

function resetAll(){cartDiscount=0;showPage('page-home');}

function updateCalc(){
  const m=parseInt(document.getElementById('monthly').value), y=parseInt(document.getElementById('years').value);
  document.getElementById('monthly-val').textContent=m;
  document.getElementById('years-val').textContent=y;
  const total=m*y*12;
  document.getElementById('bottles-saved').textContent=total.toLocaleString();
  document.getElementById('kg-saved').textContent=(total*0.02).toFixed(1)+' kg';
}


// ── SCROLL CARD STATE ──
const cardFills = {
  single: ['water','water','water'],
  recycle: ['water','water','water'],
  longlife: ['water','water','water']
};

const BOTTLE_SIZES = {
  single:   [{label:'350ml',price:0.075},{label:'500ml',price:0.100},{label:'1L',price:0.145}],
  recycle:  [{label:'250ml',price:0.050},{label:'500ml',price:0.085},{label:'800ml',price:0.097}],
  longlife: [{label:'350ml',price:0.190},{label:'500ml',price:0.200},{label:'950ml',price:0.325}]
};

const ORG_PACKS = [
  {qty:8, discount:0.10}, {qty:16, discount:0.18}, {qty:32, discount:0.28}
];

function selectBottleCard(typeKey, idx) {
  // highlight selected
  [0,1,2].forEach(i => {
    const el = document.getElementById(typeKey+'-'+i);
    if(el) el.classList.toggle('selected', i===idx);
  });
}

function setBFill(typeKey, idx, fill) {
  cardFills[typeKey][idx] = fill;
  const row = document.getElementById(typeKey+'-fill-'+idx);
  if(row) {
    row.querySelectorAll('.fill-chip').forEach((chip,i) => {
      chip.classList.toggle('active', (i===0&&fill==='water')||(i===1&&fill==='empty'));
    });
  }
}

function addBottleCardToCart(typeKey, idx) {
  const t = TYPES[typeKey];
  const s = BOTTLE_SIZES[typeKey][idx];
  const fill = cardFills[typeKey][idx];
  const fillExtra = fill==='water' ? 0.100 : 0;
  const price = s.price + fillExtra;
  const item = {
    id: Date.now(),
    typeKey, typeName: t.name, badge: t.badge,
    size: s.label, fill: fill==='water'?'Filled':'Empty',
    price, qty:1,
    svgColor: t.svgColor, svgStroke: t.svgStroke, capColor: t.capColor,
    label: s.label, isPack: false
  };
  const ex = cart.find(c=>c.typeKey===typeKey&&c.size===s.label&&c.fill===item.fill&&!c.isPack);
  if(ex){ex.qty++;}else{cart.push(item);}
  updateBadge();
  selectBottleCard(typeKey, idx);
  showToast(t.badge+' '+s.label+' '+t.short+' added to cart!');
}

function addOrgPack(typeKey, packIdx) {
  const t = TYPES[typeKey];
  const pack = ORG_PACKS[packIdx];
  const baseSize = BOTTLE_SIZES[typeKey][0];
  const unitPrice = baseSize.price * (1 - pack.discount);
  const totalPrice = unitPrice * pack.qty;
  const item = {
    id: Date.now(),
    typeKey, typeName: t.name, badge: t.badge,
    size: baseSize.label, fill: 'Filled',
    price: totalPrice, qty:1,
    svgColor: t.svgColor, svgStroke: t.svgStroke, capColor: t.capColor,
    label: 'Pack of '+pack.qty+' · '+baseSize.label,
    isPack: true, packQty: pack.qty
  };
  cart.push(item);
  updateBadge();
  showToast(t.badge+' Pack of '+pack.qty+' '+t.name+' added!');
}

function setMode(mode) {
  currentMode = mode;
  document.getElementById('mode-individual').classList.toggle('active', mode==='individual');
  document.getElementById('mode-org').classList.toggle('active', mode==='org');
  ['single','recycle','longlife'].forEach(key => {
    const orgRow = document.getElementById('org-'+key);
    if(orgRow) orgRow.style.display = mode==='org' ? 'block' : 'none';
  });
}

// Init


function addOrgPackFull(typeKey, packIdx, qty, priceStr) {
  const t = TYPES[typeKey];
  const price = parseFloat(priceStr);
  const item = {
    id: Date.now(),
    typeKey, typeName: t.name, badge: t.badge,
    size: BOTTLE_SIZES[typeKey][packIdx] ? BOTTLE_SIZES[typeKey][packIdx].label : BOTTLE_SIZES[typeKey][0].label,
    fill: 'Filled',
    price, qty: 1,
    svgColor: t.svgColor, svgStroke: t.svgStroke, capColor: t.capColor,
    label: 'Pack of ' + qty,
    isPack: true, packQty: parseInt(qty)
  };
  cart.push(item);
  updateBadge();
  showToast(t.badge + ' Pack of ' + qty + ' · ' + t.name + ' added!');
}



// ── BEFORE & AFTER SLIDER ──
(function() {
  var container, handle, afterEl;
  var dragging = false;

  function init() {
    container = document.getElementById('baContainer');
    handle    = document.getElementById('baHandle');
    afterEl   = container ? container.querySelector('.ba-after') : null;
    if (!container || !handle || !afterEl) return;

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, {passive:true});
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, {passive:false});
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    container.addEventListener('click', onContainerClick);
  }

  function getX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function setPos(px) {
    var rect = container.getBoundingClientRect();
    var pct  = Math.min(Math.max((px - rect.left) / rect.width * 100, 2), 98);
    afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    handle.style.left = pct + '%';
  }

  function startDrag(e) { dragging = true; e.preventDefault && e.preventDefault(); }
  function stopDrag()   { dragging = false; }
  function onDrag(e) {
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    setPos(getX(e));
  }
  function onContainerClick(e) { setPos(e.clientX); }

  // Animate on scroll into view
  var observed = false;
  var sliderObs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !observed) {
      observed = true;
      var start = Date.now(), dur = 1200, from = 50, to = 25;
      function tick() {
        var t = Math.min((Date.now() - start) / dur, 1);
        var ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        var pct = from + (to - from) * ease;
        if (container && afterEl) {
          afterEl.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
          handle.style.left = pct + '%';
        }
        if (t < 1) requestAnimationFrame(tick);
        else {
          // bounce back to center
          var start2 = Date.now(), dur2 = 800;
          function tick2() {
            var t2 = Math.min((Date.now() - start2) / dur2, 1);
            var ease2 = t2 < 0.5 ? 2*t2*t2 : -1+(4-2*t2)*t2;
            var pct2 = to + (50 - to) * ease2;
            if (container && afterEl) {
              afterEl.style.clipPath = 'inset(0 ' + (100 - pct2) + '% 0 0)';
              handle.style.left = pct2 + '%';
            }
            if (t2 < 1) requestAnimationFrame(tick2);
          }
          setTimeout(function(){ requestAnimationFrame(tick2); }, 300);
        }
      }
      requestAnimationFrame(tick);
    }
  }, {threshold: 0.4});

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); if(container) sliderObs.observe(container); });
  } else {
    init();
    if (container) sliderObs.observe(container);
  }
})();

// ── TEAM SECTION ANIMATION ──
const teamObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      teamObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.anim-team').forEach(el => teamObserver.observe(el));

// ── VISION & MISSION ANIMATIONS ──
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const vmObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // trigger counters
      entry.target.querySelectorAll && entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      vmObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.anim-vm').forEach(el => vmObserver.observe(el));
document.querySelectorAll('.vm-stats').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      el.querySelectorAll('[data-target]').forEach(animateCounter);
      obs.disconnect();
    }
  }, {threshold:0.3});
  obs.observe(el);
});
// ── HAMBURGER MOBILE MENU ──
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ── CART ABANDONMENT HOOK ──
let hookShown = false;
function showCartHook() {
  if (hookShown) return;
  hookShown = true;
  setTimeout(() => {
    document.getElementById('cartHookOverlay').classList.add('show');
  }, 600);
}
function closeCartHook(e) {
  if (e.target === document.getElementById('cartHookOverlay')) closeCartHookBtn();
}
function closeCartHookBtn() {
  document.getElementById('cartHookOverlay').classList.remove('show');
}

// Patch addBottleCardToCart and addOrgPackFull to trigger hook
const _origAddBottle = addBottleCardToCart;
window.addBottleCardToCart = function(typeKey, idx) {
  _origAddBottle(typeKey, idx);
  hookShown = false; // allow re-show each time for demo
  showCartHook();
};
const _origAddOrgPack = addOrgPackFull;
window.addOrgPackFull = function(typeKey, packIdx, qty, priceStr) {
  _origAddOrgPack(typeKey, packIdx, qty, priceStr);
  hookShown = false;
  showCartHook();
};

// ── OMAN IMPACT VISUALIZER ──
let impactTab = 'wadis';
function setImpactTab(tab) {
  impactTab = tab;
  document.getElementById('tab-wadis').classList.toggle('active', tab === 'wadis');
  document.getElementById('tab-turtle').classList.toggle('active', tab === 'turtle');
  renderImpactVisual();
}

function renderImpactVisual() {
  const m = parseInt(document.getElementById('monthly').value) || 30;
  const y = parseInt(document.getElementById('years').value) || 2;
  const totalBottles = m * y * 12;
  const kg = totalBottles * 0.02;

  const box = document.getElementById('impact-emojis');
  const desc = document.getElementById('impact-desc');
  const sub = document.getElementById('impact-sub');

  if (impactTab === 'wadis') {
    // 1 wadi trip ≈ 6 water bottles saved per person
    const wadis = Math.round(totalBottles / 6);
    const icons = Math.min(wadis, 30);
    box.textContent = '🏞️'.repeat(Math.max(1, icons));
    desc.textContent = `= ${wadis.toLocaleString()} wadi trip water bottles saved`;
    sub.textContent = `Every 🏞️ represents ~6 plastic bottles kept out of Oman's wadis`;
  } else {
    // 1 green turtle hatchling weighs ~25g, saved plastic = less entanglement risk
    // symbolic: every 0.5 kg plastic avoided = 1 hatchling's journey protected
    const hatchlings = Math.round(kg / 0.5);
    const icons = Math.min(hatchlings, 30);
    box.textContent = '🐢'.repeat(Math.max(1, icons));
    desc.textContent = `= ${hatchlings.toLocaleString()} green turtle hatchlings protected`;
    sub.textContent = `${kg.toFixed(1)} kg of plastic avoided = safer nesting beaches in Oman`;
  }
}

// Override updateCalc to also update impact visual
const _origUpdateCalc = updateCalc;
window.updateCalc = function() {
  _origUpdateCalc();
  renderImpactVisual();
};

// Init on load
document.addEventListener('DOMContentLoaded', function() {
  renderImpactVisual();
});
if (document.readyState !== 'loading') {
  setTimeout(renderImpactVisual, 100);
}

// ── FAQ SLIDER ──
(function() {
  let current = 0;
  const total = 7;

  function initFaq() {
    // Build dots
    const dotsEl = document.getElementById('faqDots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'faq-dot' + (i === 0 ? ' active' : '');
      dot.onclick = (function(idx) { return function() { goToFaq(idx); }; })(i);
      dotsEl.appendChild(dot);
    }
    updateFaq();
  }

  function goToFaq(idx) {
    current = Math.max(0, Math.min(total - 1, idx));
    updateFaq();
  }

  function updateFaq() {
    const track = document.getElementById('faqTrack');
    const prev = document.getElementById('faqPrev');
    const next = document.getElementById('faqNext');
    const counter = document.getElementById('faqCounter');
    const dots = document.querySelectorAll('.faq-dot');
    if (!track) return;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === total - 1;
    if (counter) counter.textContent = (current + 1) + ' / ' + total;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  window.faqNav = function(dir) { goToFaq(current + dir); };

  // Touch swipe support for FAQ
  let touchStartX = 0;
  document.addEventListener('DOMContentLoaded', function() {
    const outer = document.querySelector('.faq-track-outer');
    if (!outer) return;
    outer.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, {passive:true});
    outer.addEventListener('touchend', function(e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToFaq(current + (diff > 0 ? 1 : -1));
    });
    initFaq();
  });
  if (document.readyState !== 'loading') {
    setTimeout(initFaq, 100);
  }
})();

// ── CONTACT FORM → EMAIL ──
function sendContactEmail() {
  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill in your name, email and message.');
    return;
  }

  const mailSubject = encodeURIComponent(subject || 'EcoCup Enquiry from ' + name);
  const mailBody = encodeURIComponent(
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Subject: ' + (subject || '—') + '\n\n' +
    message
  );

  window.location.href = 'mailto:ecocupoman@gmail.com?subject=' + mailSubject + '&body=' + mailBody;
  showToast('✅ Opening your email app — thank you, ' + name + '!');
}
