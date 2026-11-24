import{a as t,A as e,b as i,i as s}from"./lit-element-BqsBd8Ys.js";import{b as a,l as o,r as n,c as r,k as h,g as l,p as c,m as d,v as p,j as u,u as m}from"./ksh-family-hub-card-DCYZ5q-K.js";import"./virtual_card-version-D30GrU5s.js";const b=["🛍️","🧸","🧱","🎮","📚","🍬","🎁","👕","⚽","🎧","🎨","🍦"],_=[["cash","💵","Cash"],["bank","🏦","Bank"]];class v extends t{static properties={hass:{type:Object},modules:{type:Object},hubMode:{type:Boolean,attribute:"hub-mode"},_view:{state:!0},_people:{state:!0},_me:{state:!0},_acting:{state:!0},_data:{state:!0},_pocket:{state:!0},_who:{state:!0},_sheet:{state:!0},_draft:{state:!0},_toast:{state:!0},_loaded:{state:!0},_pin:{state:!0}};constructor(){super(),this._view="overview",this._people=[],this._me=null,this._acting=null,this._data={balances:{},transactions:[]},this._pocket={},this._who="all",this._sheet=null,this._draft=null,this._toast=null,this._loaded=!1,this._pin="",this._initDone=!1}setHubView(t){this._view=t,this._sheet=null,this.dispatchEvent(new CustomEvent("module-view-changed",{detail:{view:t},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),this._vis=()=>{!document.hidden&&this._initDone&&this._load()},document.addEventListener("visibilitychange",this._vis)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._vis),this._unsub?.(),this._unsub=null,this._initDone=!1}updated(t){t.has("hass")&&this.hass&&!this._initDone&&(this._initDone=!0,this._init());const e=this.renderRoot.querySelector(".sheet");e&&!e._swipe&&(e._swipe=!0,a(e,()=>this._closeSheet()))}async _init(){await this._load();try{this._unsub=await this.hass.connection.subscribeMessage(()=>this._scheduleLoad(),{type:"ksh_finance/subscribe"})}catch{}}_scheduleLoad(){clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._load(),250)}async _load(){try{const t=await o(this.hass);if(this._people=t.people,this._me=t.me,this._acting=n(this.hass,this._people,this._me),this._data=await this.hass.callWS({type:"ksh_finance/get_state",...r(this.hass,this._acting)}),this.modules?.chores)try{this._pocket=(await this.hass.callWS({type:"ksh_chores/get_state"})).pocket||{}}catch{this._pocket={}}}catch(t){"pin_required"===t?.code&&this._actor?.has_pin?(this._sheet={type:"pin"},this._pin=""):this._say(t?.message||"Could not load the money")}this._loaded=!0}get _actor(){return this._people.find(t=>t.id===this._acting)||null}get _isAdult(){return this._actor?"adult"===this._actor.role:!!this.hass?.user?.is_admin}_person(t){return this._people.find(e=>e.id===t)}_bal(t){return this._data.balances[t]||{cash:0,bank:0}}_m(t,e){return h(this.hass,t,e)}get _owners(){const t=this._people.filter(t=>"guest"!==t.role&&("child"===t.role||this._data.balances[t.id]));return this._isAdult?t:t.filter(t=>t.id===this._acting)}get _kids(){return this._people.filter(t=>"child"===t.role)}async _call(t,e={}){try{return await this.hass.callWS({type:`ksh_finance/${t}`,...e,...r(this.hass,this._acting)})}catch(t){return"pin_required"===t?.code&&this._actor?.has_pin&&(this._sheet={type:"pin"},this._pin=""),this._say(t?.message||"That did not work"),null}finally{this._load()}}_say(t){this._toast=t,clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toast=null},3500)}async _checkPin(){try{const t=await this.hass.callWS({type:"ksh_family_hub/people/verify_pin",person_id:this._acting,pin:this._pin});if(!t.ok)return this._pin="",void this._say("Wrong PIN");l(this.hass,t.token),this._closeSheet(),this._load()}catch(t){this._pin="",this._say(t?.message||"Could not check the PIN")}}_closeSheet(){this._sheet=null,this._draft=null,this._pin=""}_set(t,e){this._draft={...this._draft,[t]:e}}_open(t,e){if(!this._isAdult)return;const i=e||this._kids[0]?.id;if(!i)return void this._say("Add a child under Chores → Manage people first");const s={person:i};"money"===t&&(this._draft={...s,account:"bank",amount:"",note:""}),"spend"===t&&(this._draft={...s,note:"",emoji:"🛍️",price:"",cash:"",bank:""}),"move"===t&&(this._draft={...s,from:"cash",amount:""}),this._sheet={type:t}}async _saveMoney(){const t=this._draft,e=c(t.amount);if(!(e>0))return void this._say("Enter an amount like 5 or 5.50");await this._call("deposit",{person_id:t.person,account:t.account,amount:e,note:t.note})&&(this._say(`${this._m(e)} added to ${this._person(t.person)?.name}'s ${"cash"===t.account?"Cash":"Bank"}`),this._closeSheet())}_autoSplit(t){const e=this._draft,i=c(e.price);if(!(i>0))return void this._say("Enter the price first");const s=this._bal(e.person);let a=0;a="cash"===t?i:"bank"===t?0:Math.min(s.cash,i),this._draft={...e,cash:d(a),bank:d(i-a)}}async _saveSpend(){const t=this._draft,e=c(t.cash),i=c(t.bank);if(Number.isNaN(e)||Number.isNaN(i))return void this._say("Check the amounts");if(!t.note.trim())return void this._say("Say what it was spent on");if(e+i<=0)return void this._say("Enter how much came out of Cash and Bank");await this._call("spend",{person_id:t.person,cash:e,bank:i,note:t.note.trim(),emoji:t.emoji})&&(this._say(`${t.emoji} ${t.note.trim()}: ${this._m(e+i)}`),this._closeSheet())}async _saveMove(){const t=this._draft,e=c(t.amount);if(!(e>0))return void this._say("Enter an amount");const i="cash"===t.from?"bank":"cash";await this._call("transfer",{person_id:t.person,from:t.from,to:i,amount:e})&&this._closeSheet()}async _void(t){if(!confirm(`Undo “${t.note}”? The money goes back to where it was.`))return;await this._call("void",{tx_id:t.tx[0].id})&&this._closeSheet()}_entries(t){const e=new Map;for(const i of this._data.transactions)t&&i.person_id!==t||(e.has(i.group)||e.set(i.group,{id:i.group,person_id:i.person_id,kind:i.kind,note:i.note,emoji:i.emoji,at:i.at,void:i.void,by:i.by,tx:[]}),e.get(i.group).tx.push(i));return[...e.values()]}_entryAmount(t){if("transfer"===t.kind)return e;const s=t.tx.reduce((t,e)=>t+e.amount,0);return i`<span class="amt ${s<0?"out":"in"}">${this._m(s,{sign:!0})}</span>`}_entryParts(t){if("transfer"===t.kind){const e=t.tx.find(t=>t.amount<0),i=t.tx.find(t=>t.amount>0);return`${"cash"===e.account?"Cash":"Bank"} → ${"cash"===i.account?"Cash":"Bank"} · ${this._m(i.amount)}`}return t.tx.map(t=>`${"cash"===t.account?"💵 Cash":"🏦 Bank"} ${this._m(t.amount)}`).join(" + ")}_when(t){return new Date(t).toLocaleDateString(this.hass.locale?.language||void 0,{day:"numeric",month:"short",year:"numeric"})}render(){return this._loaded?i`
      <div class="scroll"><div class="page">
        ${"history"===this._view?this._history():this._overview()}
      </div></div>
      ${this._sheet?this._renderSheet():e}
      ${this._toast?i`<div class="toast" role="status">${this._toast}</div>`:e}`:i`<div class="center"><div class="spinner"></div></div>`}_face(t){return i`<span class="face" style="--p:${t.color}">${p(this.hass,t)}</span>`}_overview(){const t=this._owners;return t.length?i`
      ${this._isAdult?i`
        <div class="actions top">
          <button class="primary" @click=${()=>this._open("money")}><ha-icon icon="mdi:plus"></ha-icon>Add money</button>
          <button class="primary alt" @click=${()=>this._open("spend")}><ha-icon icon="mdi:shopping-outline"></ha-icon>Spent</button>
          <button class="primary alt" @click=${()=>this._open("move")}><ha-icon icon="mdi:swap-horizontal"></ha-icon>Move</button>
        </div>`:e}
      ${t.map(t=>this._card(t))}`:i`<div class="empty"><span>🐷</span><p>${this._isAdult?"No children to show yet. Add them under Chores → Manage people.":"There is nothing here for you yet."}</p></div>`}_card(t){const s=this._bal(t.id),a=s.cash+s.bank,o=this._entries(t.id).slice(0,3),n=this._pocket[t.id];return i`
      <section class="kid" style="--p:${t.color}">
        <header>
          ${this._face(t)}
          <div class="who"><b>${t.name}</b><small>${this._isAdult&&t.id!==this._acting?"Has":"You have"}</small></div>
          <div class="total">${this._m(a)}</div>
        </header>
        <div class="accts">
          <div class="acct"><span class="ai">💵</span><small>Cash</small><b>${this._m(s.cash)}</b></div>
          <div class="acct"><span class="ai">🏦</span><small>Bank</small><b>${this._m(s.bank)}</b></div>
        </div>
        ${n?.enabled?i`
          <div class="pk"><div class="pkbar"><i style="width:${Math.min(100,n.points?n.earned/n.points*100:0)}%"></i></div>
            <small>${n.starts_next?`Pocket money starts next ${n.period}`:`Pocket money: ${n.earned} of ${n.points} ★ this ${n.period} → ${this._m(n.amount)}`}</small></div>`:e}
        <h4>Recent</h4>
        ${o.length?i`<div class="list">${o.map(t=>this._row(t))}</div>`:i`<p class="none">Nothing yet.</p>`}
        ${this._isAdult?i`
          <div class="mini-actions">
            <button @click=${()=>this._open("money",t.id)}>+ Money</button>
            <button @click=${()=>this._open("spend",t.id)}>Spent</button>
            <button @click=${()=>this._open("move",t.id)}>Move</button>
          </div>`:e}
      </section>`}_row(t,{withWho:e=!1}={}){const s=e?this._person(t.person_id):null;return i`
      <button class="row ${t.void?"void":""}" @click=${()=>{this._sheet={type:"detail",entry:t}}}>
        <span class="em">${t.emoji||"💰"}</span>
        <span class="txt"><b>${t.note}</b><small>${s?`${s.name} · `:""}${this._when(t.at)} · ${this._entryParts(t)}</small></span>
        ${t.void?i`<span class="pill">Undone</span>`:this._entryAmount(t)}
      </button>`}_history(){const t=this._owners,s=this._isAdult&&"all"!==this._who?this._who:null,a=this._entries(s);return i`
      <h3 class="first">History</h3>
      ${this._isAdult&&t.length>1?i`
        <div class="chips" role="radiogroup" aria-label="Show for">
          <button class="chip ${"all"===this._who?"on":""}" @click=${()=>{this._who="all"}}>Everyone</button>
          ${t.map(t=>i`<button class="chip ${this._who===t.id?"on":""}" @click=${()=>{this._who=t.id}}>${u(this.hass,t,22)}${t.name}</button>`)}
        </div>`:e}
      ${a.length?i`<div class="list">${a.map(t=>this._row(t,{withWho:this._isAdult&&!s}))}</div>`:i`<div class="empty"><span>🧾</span><p>No money in or out yet.</p></div>`}`}_renderSheet(){const t=this._sheet.type;return i`
      <div class="scrim" @click=${()=>this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${t}>
        <div class="grabber"></div>
        ${"money"===t?this._moneySheet():e}
        ${"spend"===t?this._spendSheet():e}
        ${"move"===t?this._moveSheet():e}
        ${"detail"===t?this._detailSheet():e}
        ${"pin"===t?this._pinSheet():e}
      </section>`}_title(t){return i`<div class="head2"><h2>${t}</h2></div>`}_whoChips(t){return i`<div class="chips">${this._kids.map(e=>i`
      <button type="button" class="chip ${t===e.id?"on":""}" @click=${()=>this._set("person",e.id)}>${u(this.hass,e,22)}${e.name}</button>`)}</div>`}_acctSeg(t,e){return i`<div class="seg">${_.map(([s,a,o])=>i`<button type="button" class="${t===s?"on":""}" @click=${()=>this._set(e,s)}>${a} ${o}</button>`)}</div>`}_moneySheet(){const t=this._draft;return i`${this._title("Add money")}
      <div class="form">
        <label>For</label>${this._whoChips(t.person)}
        <label>Into</label>${this._acctSeg(t.account,"account")}
        <label>Amount<input inputmode="decimal" .value=${t.amount} placeholder="5.00" @input=${t=>this._set("amount",t.target.value)}></label>
        <label>What is it for <small class="hint inl">(optional)</small><input .value=${t.note} maxlength="80" placeholder="Birthday money" @input=${t=>this._set("note",t.target.value)}></label>
        <div class="actions"><button class="primary grow" @click=${()=>this._saveMoney()}>Add</button></div>
      </div>`}_spendSheet(){const t=this._draft,e=this._bal(t.person),s=c(t.cash)||0,a=c(t.bank)||0,o=s>e.cash||a>e.bank;return i`${this._title("Spent")}
      <div class="form">
        <label>Whose money</label>${this._whoChips(t.person)}
        <label>What was it spent on<input .value=${t.note} maxlength="80" placeholder="Lego set" @input=${t=>this._set("note",t.target.value)}></label>
        <ksh-emoji-picker .value=${t.emoji} .quick=${b} @emoji-pick=${t=>this._set("emoji",t.detail.emoji)}></ksh-emoji-picker>
        <label>Price<input inputmode="decimal" .value=${t.price} placeholder="40.00" @input=${t=>this._set("price",t.target.value)}></label>
        <div class="chips">
          <button type="button" class="chip" @click=${()=>this._autoSplit("cash")}>All from Cash</button>
          <button type="button" class="chip" @click=${()=>this._autoSplit("bank")}>All from Bank</button>
          <button type="button" class="chip" @click=${()=>this._autoSplit("mix")}>Cash first, then Bank</button>
        </div>
        <div class="two">
          <label>💵 From Cash <small class="hint inl">has ${this._m(e.cash)}</small>
            <input inputmode="decimal" .value=${t.cash} placeholder="0" @input=${t=>this._set("cash",t.target.value)}></label>
          <label>🏦 From Bank <small class="hint inl">has ${this._m(e.bank)}</small>
            <input inputmode="decimal" .value=${t.bank} placeholder="0" @input=${t=>this._set("bank",t.target.value)}></label>
        </div>
        <p class="${o?"warn":"hint"}">${o?"That is more than they have in one of the accounts.":`Comes to ${this._m(s+a)}. Left afterwards: Cash ${this._m(e.cash-s)}, Bank ${this._m(e.bank-a)}.`}</p>
        <div class="actions"><button class="primary grow" ?disabled=${o} @click=${()=>this._saveSpend()}>Save</button></div>
      </div>`}_moveSheet(){const t=this._draft,e=this._bal(t.person),s="cash"===t.from?"bank":"cash";return i`${this._title("Move money")}
      <div class="form">
        <label>For</label>${this._whoChips(t.person)}
        <label>Move from</label>${this._acctSeg(t.from,"from")}
        <p class="hint">${"cash"===t.from?"Cash":"Bank"} has ${this._m(e[t.from])}. It goes into ${"cash"===s?"Cash":"Bank"}.</p>
        <label>Amount<input inputmode="decimal" .value=${t.amount} placeholder="10.00" @input=${t=>this._set("amount",t.target.value)}></label>
        <div class="actions"><button class="primary grow" @click=${()=>this._saveMove()}>Move</button></div>
      </div>`}_detailSheet(){const t=this._sheet.entry,s=this._person(t.person_id),a=this._person(t.by);return i`
      <div class="detail">
        <div class="dh"><span class="em big">${t.emoji||"💰"}</span><div><h2>${t.note}</h2><p class="muted">${s?.name||""} · ${this._when(t.at)}</p></div></div>
        <div class="facts">
          ${t.tx.map(t=>i`<div class="fact"><span>${"cash"===t.account?"💵 Cash":"🏦 Bank"}</span><b class="${t.amount<0?"out":"in"}">${this._m(t.amount,{sign:!0})}</b></div>`)}
          ${a?i`<div class="fact"><span>Entered by</span><b>${a.name}</b></div>`:"system"===t.by?i`<div class="fact"><span>Entered by</span><b>Pocket money</b></div>`:e}
        </div>
        ${t.void?i`<p class="muted">This was undone, so it does not count.</p>`:this._isAdult?i`<button class="danger" @click=${()=>this._void(t)}>Undo this entry</button>`:e}
      </div>`}_pinSheet(){const t=this._actor;return i`${this._title(`${t?.name||"Your"} PIN`)}
      <form class="form" @submit=${t=>{t.preventDefault(),this._checkPin()}}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${t=>{this._pin=t.target.value.replace(/\D/g,"")}}>
        <button class="primary" type="submit" ?disabled=${4!==this._pin.length}>Continue</button>
      </form>`}static styles=[m,s`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); --fin: var(--hub-accent); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 760px; margin: 0 auto; padding: 6px 16px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: var(--fin); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 4px 2px; }
    h3 { margin: 18px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    h3.first { margin-top: 10px; }
    h4 { margin: 14px 4px 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .empty { text-align: center; padding: 40px 10px; color: var(--hub-muted); } .empty span { font-size: 48px; }
    .none { color: var(--hub-muted); font-size: 13.5px; margin: 6px 4px; }

    .actions { display: flex; gap: 10px; margin-top: 10px; }
    .actions.top { margin: 8px 0 12px; flex-wrap: wrap; }
    .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 10px 18px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; justify-content: center; --mdc-icon-size: 20px; }
    .primary.alt { background: var(--hub-surface); color: var(--hub-text); border: 1px solid var(--hub-border); }
    .grow { flex: 1; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; width: 100%; }

    .kid { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 24px; padding: 14px; margin-bottom: 14px; border-top: 5px solid var(--p); }
    .kid header { display: flex; align-items: center; gap: 12px; }
    .face { width: 52px; height: 52px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; overflow: hidden;
      background: color-mix(in srgb, var(--p) 30%, var(--hub-surface-2)); border: 3px solid var(--p); }
    .face img { width: 100%; height: 100%; object-fit: cover; }
    .who { flex: 1; min-width: 0; display: flex; flex-direction: column; } .who b { font-size: 18px; } .who small { color: var(--hub-muted); }
    .total { font-size: 28px; font-weight: 800; letter-spacing: -.01em; white-space: nowrap; }
    .accts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 12px 0 4px; }
    .acct { background: var(--hub-surface-2); border-radius: 18px; padding: 12px; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 0 10px; }
    .acct .ai { font-size: 26px; grid-row: span 2; } .acct small { color: var(--hub-muted); font-weight: 700; } .acct b { font-size: 20px; }
    .pk { margin: 10px 2px 0; } .pk small { color: var(--hub-muted); font-size: 12.5px; }
    .pkbar { height: 6px; border-radius: 3px; background: var(--hub-surface-2); overflow: hidden; margin-bottom: 5px; } .pkbar i { display: block; height: 100%; background: #e2ac3f; }
    .mini-actions { display: flex; gap: 8px; margin-top: 12px; }
    .mini-actions button { flex: 1; border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 8px; font-weight: 700; font-size: 13px; }

    .list { display: grid; gap: 6px; }
    .row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 9px 10px; border: 1px solid var(--hub-border); border-radius: 14px; background: var(--hub-surface-2); }
    .row.void { opacity: .55; } .row.void b { text-decoration: line-through; }
    .row .em { font-size: 22px; width: 36px; height: 36px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--fin) 18%, transparent); flex: none; }
    .row .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; } .row .txt b { font-size: 14.5px; } .row .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .amt { font-weight: 800; white-space: nowrap; } .amt.out, .out { color: #e8685a; } .amt.in, .in { color: #4fd1a1; }
    .pill { border: 1px solid var(--hub-border); border-radius: 999px; padding: 3px 10px; font-size: 12px; font-weight: 800; color: var(--hub-muted); }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    .toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); background: var(--hub-sheet); color: var(--hub-text); border: 1px solid var(--hub-border);
      border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 14px; box-shadow: var(--hub-shadow); z-index: 60; max-width: 92%; text-align: center; animation: pop .2s ease; }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, 10px); } }

    .scrim { position: absolute; inset: 0; background: rgba(4,12,20,.55); z-index: 40; animation: fade .18s ease; }
    .sheet { position: absolute; left: 0; right: 0; bottom: 0; z-index: 41; max-width: 600px; margin: 0 auto; max-height: 92%; overflow-y: auto; overscroll-behavior: contain;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px)); box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } } @keyframes fade { from { opacity: 0; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160,190,215,.55); margin: 2px auto 12px; }
    .head2 h2 { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .form input:not([type=checkbox]) { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .form input:focus { border-color: var(--hub-accent); }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; margin: 0; } .hint.inl { margin-left: 4px; }
    .warn { color: #e8a04a; font-size: 13px; font-weight: 600; margin: 0; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .detail .dh { display: flex; align-items: center; gap: 12px; } .detail h2 { margin: 0; font-size: 20px; }
    .em.big { font-size: 38px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; background: color-mix(in srgb, var(--fin) 20%, transparent); }
    .facts { display: grid; gap: 8px; margin: 14px 0; } .fact { display: flex; justify-content: space-between; padding: 10px 12px; background: var(--hub-surface-2); border-radius: 12px; }
  `]}customElements.define("ksh-finance-module",v);
