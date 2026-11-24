import{a as t,A as e,b as s,i}from"./lit-element-BqsBd8Ys.js";import{a,b as n,l as o,r,c as l,D as c,n as d,d as h,f as p,s as u,g as m,h as _,j as b,C as g,m as $,p as v,k as f,R as y,o as x,E as k,q as w,u as S}from"./ksh-family-hub-card-UBHReqKW.js";import{l as j,i as A,t as N}from"./data-CIkehvI9.js";import"./virtual_card-version-DBhfHTym.js";const P="#3db6cc",C=[0,1,2,3,4],z=[5,6],R=(t=[],e=[])=>t.length===e.length&&t.every(t=>e.includes(t)),I=()=>({name:"",emoji:"✅",points:1,assignees:[],recurrence:{type:"daily"},start:a(),due_time:"",remind:!0,requires_approval:!0,notes:""});class D extends t{static properties={hass:{type:Object},modules:{type:Object},hubMode:{type:Boolean,attribute:"hub-mode"},_view:{state:!0},_people:{state:!0},_me:{state:!0},_state:{state:!0},_filter:{state:!0},_sheet:{state:!0},_draft:{state:!0},_toast:{state:!0},_loaded:{state:!0},_search:{state:!0},_pin:{state:!0},_acting:{state:!0},_seg:{state:!0},_agenda:{state:!0},_celFor:{state:!0}};constructor(){super(),this._view="today",this._people=[],this._me=null,this._state=null,this._filter="all",this._sheet=null,this._draft=null,this._toast=null,this._loaded=!1,this._search="",this._pin="",this._acting=null,this._seg=this._readSeg(),this._agenda=null,this._celFor=null,this._pin2="",this._initDone=!1}_readSeg(){try{return localStorage.getItem("ksh_chores_today")||"all"}catch{return"all"}}_setSeg(t){this._seg=t;try{localStorage.setItem("ksh_chores_today",t)}catch{}"calendar"!==t&&"all"!==t||this._loadAgenda()}setHubView(t){this._view=t,this._sheet=null,this.dispatchEvent(new CustomEvent("module-view-changed",{detail:{view:t},bubbles:!0,composed:!0}))}openAdd(){this.setHubView("chores"),this._sheet={type:"pick"}}connectedCallback(){super.connectedCallback(),this._tick=setInterval(()=>{this._state&&this._state.today!==a()&&this._load()},6e4),this._vis=()=>{!document.hidden&&this._initDone&&this._load()},document.addEventListener("visibilitychange",this._vis)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._tick),document.removeEventListener("visibilitychange",this._vis),this._unsub?.(),this._unsub=null,this._initDone=!1}updated(t){t.has("hass")&&this.hass&&!this._initDone&&(this._initDone=!0,this._init());const e=this.renderRoot.querySelector(".sheet");e&&!e._swipe&&(e._swipe=!0,n(e,()=>this._closeSheet()))}async _init(){await this._load();try{this._unsub=await this.hass.connection.subscribeMessage(()=>this._scheduleLoad(),{type:"ksh_chores/subscribe"})}catch{}}_scheduleLoad(){clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._load(),250)}async _load(){try{const[t,e]=await Promise.all([o(this.hass),this.hass.callWS({type:"ksh_chores/get_state",date:a()})]);this._people=t.people,this._me=t.me,this._state=e,this._resolveActing(),this._loaded=!0,"calendar"!==this._seg&&"all"!==this._seg||this._loadAgenda()}catch(t){this._loaded=!0,this._say(t?.message||"Could not load chores")}}_resolveActing(){this._acting=r(this.hass,this._people,this._me)}get _hasCalendar(){return!!this.modules?.calendar}async _loadAgenda(){if(this._hasCalendar)try{const t=a(),e=await j(this.hass,t,t,{acting:this._actor,modules:this.modules,msg:l(this.hass,this._acting)});this._agenda=e.events.filter(t=>"chore"!==t.kind)}catch{this._agenda=[]}else this._agenda=null}get _actor(){return this._people.find(t=>t.id===this._acting)||null}get _role(){return this._actor?.role||(this.hass?.user?.is_admin?"adult":null)}get _isAdult(){return"adult"===this._role}get _canSwitch(){return!!this.hass?.user?.is_admin||!this._me}_person(t){return this._people.find(e=>e.id===t)}_chore(t){return this._state?.chores.find(e=>e.id===t)}async _call(t,e={}){const s={type:`ksh_chores/${t}`,...e,...l(this.hass,this._acting)};try{return await this.hass.callWS(s)}catch(t){return"pin_required"===t?.code&&this._actor?.has_pin&&(this._sheet={type:"pin",person:this._actor,stay:!0},this._pin=""),this._say(t?.message||"That did not work"),null}finally{this._scheduleLoad()}}_patchState(t){this._state&&(this._state=t(this._state))}_say(t){this._toast=t,clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toast=null},3500)}_canDo(t){if("adult"===this._role)return!0;const e=t.assignees||[];return e.length?e.includes(this._acting):"child"===this._role}_visible(t){const e=t.assignees||[];return this._isAdult?"all"===this._filter||(!e.length||e.includes(this._filter)):e.length?e.includes(this._acting):"child"===this._role}_recurrenceText(t={}){const e=(t.days||[]).map(t=>c[t]).join(", ");if("weekly"===t.type)return e?`Weekly: ${e}`:"Weekly";if("once"===t.type)return`Once, ${t.date}`;if("custom"===t.type){const s={day:"day",week:"week",month:"month"}[t.unit]||"day";return`Every ${t.every>1?`${t.every} ${s}s`:s}${"week"===t.unit&&e?`: ${e}`:""}`}return"Daily"}_overdue(t,e){return!!["open","rejected"].includes(e.status)&&(e.date<a()||!(!t.due_time||e.date!==a())&&t.due_time<d())}_dayBefore(t){const[e,s,i]=t.split("-").map(Number);return A(new Date(e,s-1,i-1))}_dateLabel(t){return new Date(`${t}T12:00:00`).toLocaleDateString(this.hass.locale?.language||void 0,{weekday:"short",day:"numeric",month:"short"})}async _complete(t){const e=this._chore(t.chore_id),s=this._state.items.filter(t=>["open","rejected"].includes(t.status)&&this._chore(t.chore_id)&&this._visible(this._chore(t.chore_id))).length,i=this._isAdult?"approved":"done",a=e=>e.chore_id===t.chore_id&&e.date===t.date?{...e,status:i,done_by:this._acting}:e;this._patchState(e=>({...e,items:e.items.map(a),overdue:(e.overdue||[]).filter(e=>!(e.chore_id===t.chore_id&&e.date===t.date))}));const n=await this._call("complete",{chore_id:t.chore_id,date:t.date});n&&h(this,n.celebration,{big:s<=1}),n?.awarded?this._say(`+${e.points} ★  ${e.name}`):"done"===n?.status&&this._say("Done. Waiting for an adult to approve.")}async _undo(t){("approved"!==t.status||confirm("Undo this chore? The points are taken back."))&&await this._call("reopen",{chore_id:t.chore_id,date:t.date})}async _approve(t){const e=this._chore(t.chore_id),s=await this._call("approve",{chore_id:t.chore_id,date:t.date});s?.awarded&&this._say(`Approved. ${this._person(t.done_by)?.name||"They"} got +${e.points} ★`)}async _reject(t){const e=prompt("Send it back. What needs doing? (optional)","")??null;null!==e&&await this._call("reject",{chore_id:t.chore_id,date:t.date,note:e})}_closeSheet(){this._sheet=null,this._draft=null,this._search="",this._pin=""}_newChoreFrom(t){this._draft={...I(),...t?{name:t.name,emoji:t.emoji,points:t.points,recurrence:{...t.recurrence}}:{},start:a()},this._sheet={type:"chore"}}_editChore(t){this._draft={...I(),...JSON.parse(JSON.stringify(t)),due_time:t.due_time||"",start:t.start||a()},"once"===t.recurrence?.type&&(this._draft.start=t.recurrence.date),this._sheet={type:"chore",id:t.id}}_set(t,e){this._draft={...this._draft,[t]:e}}_setRec(t){this._draft={...this._draft,recurrence:{...this._draft.recurrence,...t}}}_toggleAssignee(t){const e=this._draft.assignees||[];this._set("assignees",e.includes(t)?e.filter(e=>e!==t):[...e,t])}_toggleDay(t){const e=this._draft.recurrence.days||[];this._setRec({days:e.includes(t)?e.filter(e=>e!==t):[...e,t].sort()})}_setRecType(t){const e={days:this._draft.recurrence.days||[]};this._draft="daily"===t||"once"===t?{...this._draft,recurrence:{type:t}}:"weekly"===t?{...this._draft,recurrence:{type:t,...e}}:{...this._draft,recurrence:{type:"custom",every:this._draft.recurrence.every||2,unit:this._draft.recurrence.unit||"day",start:this._draft.start||a(),...e}}}async _saveChore(){const t=this._draft;if(!t.name.trim())return void this._say("Give the chore a name");const e={...t.recurrence},s=t.start||a();"once"===e.type&&(e.date=s),"custom"===e.type&&(e.start=s),"weekly"!==e.type||(e.days||[]).length||(e.days=[p()]),"custom"!==e.type||"week"!==e.unit||(e.days||[]).length||(e.days=[p()]);const i={name:t.name.trim(),emoji:t.emoji,points:Number(t.points)||0,assignees:t.assignees,recurrence:e,start:s,due_time:t.due_time||null,remind:!!t.remind&&!!t.due_time,requires_approval:!!t.requires_approval,notes:t.notes||""},n=this._sheet?.id;await this._call(n?"chores/update":"chores/add",n?{chore_id:n,...i}:i)&&this._closeSheet()}async _deleteChore(){if(!confirm(`Delete “${this._draft.name}”? Points already earned are kept.`))return;await this._call("chores/delete",{chore_id:this._sheet.id})&&this._closeSheet()}_newRoutineFrom(t){this._draft={name:"",emoji:"☀️",kind:"custom",points:3,assignees:[],steps:[{text:"",emoji:"",days:[]}],...t?JSON.parse(JSON.stringify(t)):{}},this._sheet={type:"routine"}}_editRoutine(t){this._draft=JSON.parse(JSON.stringify(t)),this._sheet={type:"routine",id:t.id}}_setStep(t,e){const s=this._draft.steps.map((s,i)=>i===t?{...s,...e}:s);this._set("steps",s)}_moveStep(t,e){const s=[...this._draft.steps],i=t+e;i<0||i>=s.length||([s[t],s[i]]=[s[i],s[t]],this._set("steps",s))}async _saveRoutine(){const t=this._draft;if(!t.name.trim())return void this._say("Give the routine a name");const e=t.steps.filter(t=>t.text.trim()).map(t=>({...t,days:t.days||[]}));if(!e.length)return void this._say("Add at least one step");const s={name:t.name.trim(),emoji:t.emoji,kind:t.kind,points:Number(t.points)||0,assignees:t.assignees,steps:e},i=this._sheet?.id;await this._call(i?"routines/update":"routines/add",i?{routine_id:i,...s}:s)&&this._closeSheet()}async _deleteRoutine(){if(!confirm(`Delete the routine “${this._draft.name}”?`))return;await this._call("routines/delete",{routine_id:this._sheet.id})&&this._closeSheet()}get _meId(){return this._acting||`admin:${this.hass.user.id}`}_run(t,e=this._meId){return this._state.runs[`${t}:${e}`]||{steps:[],completed:!1}}async _toggleStep(t,e,s,i=this._meId){const a=`${t.id}:${i}`;this._patchState(t=>{const i=t.runs[a]||{steps:[],completed:!1},n=s?[...new Set([...i.steps,e])]:i.steps.filter(t=>t!==e);return{...t,runs:{...t.runs,[a]:{...i,steps:n}}}});const n=await this._call("routines/step",{routine_id:t.id,step_id:e,done:s,...i!==this._meId?{for_person:i}:{}});n?.awarded&&(this._sheet={type:"celebrate",routine:t},h(this,n.celebration,{big:!0}))}async _switchTo(t){if(t.has_pin)return this._sheet={type:"pin",person:t},void(this._pin="");this.hass.user?.is_admin||"adult"!==t.role?this._applySwitch(t):this._say(`${t.name} needs a PIN before this profile can be used on a shared login. An administrator can set one under Manage people.`)}_applySwitch(t,e=null){u(this.hass,t.id,e),this._acting=t.id,this._closeSheet(),this._filter="all",this._agenda=null,this._load()}async _checkPin(){const{person:t,stay:e}=this._sheet;try{const s=await this.hass.callWS({type:"ksh_family_hub/people/verify_pin",person_id:t.id,pin:this._pin});if(!s.ok)return this._pin="",void this._say("Wrong PIN");e?(m(this.hass,s.token),this._closeSheet(),this._load()):this._applySwitch(t,s.token)}catch(t){this._pin="",this._say(t?.message||"Could not check the PIN")}}_celebrationOf(t){return this._state?.celebrations?.[t]||_}async _chooseCelebration(t,e){"off"!==e&&h(this,e,{big:!0,force:!0}),this._state&&(this._state={...this._state,celebrations:{...this._state.celebrations||{},[t]:e}}),await this._call("celebration/set",{person_id:t,style:e})}_celebrationSection(){const t=this._actor;if(!t)return e;const i=this._isAdult&&this._people.find(t=>t.id===this._celFor)||t,a=this._celebrationOf(i.id);return s`
      <h3>Celebration</h3>
      ${this._isAdult&&this._people.length>1?s`
        <div class="chips" role="radiogroup" aria-label="Choose for">
          ${this._people.filter(t=>"guest"!==t.role).map(t=>s`<button class="chip ${t.id===i.id?"on":""}" @click=${()=>{this._celFor=t.id}}>${b(this.hass,t,22)}${t.name}</button>`)}
        </div>`:e}
      <div class="card cels" role="radiogroup" aria-label="Celebration for ${i.name}">
        ${g.map(t=>s`
          <button role="radio" aria-checked=${a===t.id?"true":"false"} class="cel ${a===t.id?"sel":""}" @click=${()=>this._chooseCelebration(i.id,t.id)}>
            <span class="ce">${t.icon}</span><b>${t.label}</b><small>${t.hint}</small>
          </button>`)}
        <button role="radio" aria-checked=${"off"===a?"true":"false"} class="cel ${"off"===a?"sel":""}" @click=${()=>this._chooseCelebration(i.id,"off")}>
          <span class="ce">🚫</span><b>Off</b><small>No animation</small>
        </button>
      </div>
      <p class="muted">Plays for ${i.name} when they finish a chore or routine: a short one for a chore, a bigger one for a whole routine or the last chore of the day.
        Tap one to choose it and see it.
        ${"off"!==a?s`<button class="link" @click=${()=>h(this,a,{big:!0,force:!0})}>Play again</button>`:e}
        It stays still on a device that asks for reduced motion.</p>`}async _copyKids(t){const e=`type: custom:ksh-family-hub-kids-card\nperson: ${t.name}`;try{await navigator.clipboard.writeText(e),this._say(`Copied. Paste it into a dashboard card for ${t.name}.`)}catch{this._say(e.replace("\n"," / "))}}async _copyKidsLink(t){const e=`${window.location.origin}/ksh-family-hub?kids=${encodeURIComponent(t.name)}`;try{await navigator.clipboard.writeText(e),this._say(`Copied the link for ${t.name}'s screen.`)}catch{this._say(e)}}_kidsSection(){if(!this._isAdult)return e;const t=this._people.filter(t=>"child"===t.role);return s`
      <h3>Kids screen</h3>
      <div class="card">
        ${t.length?t.map(t=>s`
          <div class="item">
            ${b(this.hass,t,38)}
            <span class="txt"><b>${t.name}</b><small>For ${t.name}'s bedside screen</small></span>
            <button class="mini" @click=${()=>this._copyKidsLink(t)}><ha-icon icon="mdi:link-variant"></ha-icon>Link</button>
            <button class="mini" @click=${()=>this._copyKids(t)}><ha-icon icon="mdi:content-copy"></ha-icon>Card</button>
          </div>`):s`<div class="item small"><span class="txt"><small>Add a child under People &amp; guests first.</small></span></div>`}
      </div>
      <p class="muted">A big, colourful chores, routines and points screen for one child, made for a bedside display (Kiosk Satellite, Fully Kiosk or a wall tablet).
        <b>Link</b> copies a web address that opens the screen full size: point the tablet's browser or Kiosk app at it, no dashboard needed.
        <b>Card</b> copies a dashboard card: add a <b>Manual</b> card and paste it.
        Add <code>style: galaxy</code> (or <code>candy</code>, <code>ocean</code>, <code>jungle</code>) to change the look.</p>`}_startPin(){this._pin="",this._pin2="",this._sheet={type:"setpin"}}async _savePin(t=!1){const e=this._actor;if(e){if(t){if(!confirm("Remove your PIN? Anyone using this device could switch to you."))return}else{if(!/^\d{4}$/.test(this._pin))return void this._say("A PIN is four digits");if(this._pin!==this._pin2)return void this._say("The two PINs are different")}try{const s=await this.hass.callWS({type:"ksh_family_hub/people/set_pin",person_id:e.id,pin:t?null:this._pin,...l(this.hass,this._acting)});m(this.hass,s.token),this._closeSheet(),this._say(t?"PIN removed":"PIN saved"),this._load()}catch(t){this._say(t?.message||"Could not save the PIN")}}}async _adjust(){const{person:t}=this._sheet,e=Number(this._draft.points);if(!e)return void this._say("Enter a number of points");await this._call("points/adjust",{person_id:t.id,points:e,reason:this._draft.reason||""})&&this._closeSheet()}render(){return this._loaded?this._state?this._actor||this.hass.user?.is_admin?s`
      <div class="scroll">
        <div class="page">
          ${this._header()}
          ${!this._people.length&&this._isAdult?s`
            <div class="card pad addfam"><b>Add your family</b>
              <p class="muted">Nobody is set up yet. People are never added automatically: add yourself, link your own login, then the children.</p>
              <button class="primary" @click=${()=>this.dispatchEvent(new CustomEvent("hub-sheet",{detail:{sheet:"people"},bubbles:!0,composed:!0}))}><ha-icon icon="mdi:account-multiple-plus-outline"></ha-icon>Add people</button></div>`:e}
          ${"today"===this._view?this._today():e}
          ${"chores"===this._view?this._choresList():e}
          ${"routines"===this._view?this._routines():e}
          ${"points"===this._view?this._points():e}
          ${"settings"===this._view?this._settings():e}
        </div>
      </div>
      ${this._sheet?this._renderSheet():e}
      ${this._toast?s`<div class="toast" role="status">${this._toast}</div>`:e}`:this._whoAreYou():s`<div class="center"><p class="muted">Chores could not be loaded.</p></div>`:s`<div class="center"><div class="spinner"></div></div>`}_whoAreYou(){return s`
      <div class="scroll"><div class="page">
        <h2 class="big">Who are you?</h2>
        <p class="muted">Pick your name to see your chores.</p>
        ${this._people.map(t=>this._personRow(t,()=>this._switchTo(t)))}
        ${this._people.length?e:s`<p class="muted">No people yet. An adult can add them from the menu.</p>`}
      </div></div>
      ${this._sheet?this._renderSheet():e}
      ${this._toast?s`<div class="toast">${this._toast}</div>`:e}`}_avatar(t,e=""){return b(this.hass,t||{color:P},"lg"===e?46:38)}_personRow(t,i,a=e){return s`
      <button class="row" @click=${i}>
        ${this._avatar(t)}
        <span class="txt"><b>${t.name}</b><small>${"adult"===t.role?"Adult":"child"===t.role?"Child":"Guest"}${t.has_pin?" · PIN":""}</small></span>
        ${a}
      </button>`}_header(){const t=this._actor,i=this._isAdult?this._state.pending.length:0;return s`
      <div class="who">
        <button class="chip-person" ?disabled=${!this._canSwitch} @click=${()=>{this._sheet={type:"switch"}}}
          aria-label="Switch person">
          ${t?this._avatar(t):s`<span class="avatar" style="--c:${P}">🙂</span>`}
          <span><b>${t?.name||this.hass.user?.name||"You"}</b><small>${t?{adult:"Adult",child:"Child",guest:"Guest"}[t.role]:"Adult"}${this._canSwitch?" · tap to switch":""}</small></span>
        </button>
        ${i?s`<span class="badge" title="Waiting for approval">${i} to approve</span>`:e}
      </div>`}_segments(){return[["all","All"],["chores","Chores"],["routines","Routines"],...this._hasCalendar?[["calendar","Calendar"]]:[]]}_today(){const t=this._state,i=this._segments().some(([t])=>t===this._seg)?this._seg:"all",a=t=>({...t,chore:this._chore(t.chore_id)}),n=t.items.map(a).filter(t=>t.chore&&this._visible(t.chore)),o=(t.overdue||[]).map(a).filter(t=>t.chore&&this._visible(t.chore)),r=n.filter(t=>["open","rejected"].includes(t.status)),l=n.filter(t=>["done","approved"].includes(t.status)),c=this._isAdult?t.pending.map(t=>({...t,chore:this._chore(t.chore_id)})).filter(t=>t.chore):[],d=(new Date).toLocaleDateString(this.hass.locale?.language||void 0,{weekday:"long",day:"numeric",month:"long"}),h="all"===i||"chores"===i,p=this._routineSlots({todayOnly:!0});return s`
      <p class="date">${d}</p>
      <div class="seg tabs" role="tablist" aria-label="Show">
        ${this._segments().map(([t,e])=>s`<button role="tab" aria-selected=${i===t?"true":"false"} class=${i===t?"on":""} @click=${()=>this._setSeg(t)}>${e}</button>`)}
      </div>

      ${h&&this._isAdult&&this._people.length>1?s`
        <div class="chips" role="radiogroup" aria-label="Show chores for">
          <button class="chip ${"all"===this._filter?"on":""}" @click=${()=>{this._filter="all"}}>Everyone</button>
          ${this._people.map(t=>s`<button class="chip ${this._filter===t.id?"on":""}" @click=${()=>{this._filter=t.id}}>${b(this.hass,t,22)}${t.name}</button>`)}
        </div>`:e}

      ${h&&c.length?s`
        <h3>Waiting for approval</h3>
        <div class="card">${c.map(e=>s`
          <div class="item">
            ${this._faces([this._person(e.done_by)].filter(Boolean))}
            <span class="emoji">${e.chore.emoji}</span>
            <span class="txt"><b>${e.chore.name}</b><small>${this._person(e.done_by)?.name||"Someone"} · ${e.date===t.today?"today":e.date} · +${e.chore.points} ★</small></span>
            <button class="mini ok" @click=${()=>this._approve(e)} aria-label="Approve"><ha-icon icon="mdi:check"></ha-icon>Approve</button>
            <button class="mini" @click=${()=>this._reject(e)} aria-label="Send back"><ha-icon icon="mdi:undo"></ha-icon></button>
          </div>`)}</div>`:e}

      ${h&&o.length?s`
        <h3 class="lateh">Overdue <span class="count late">${o.length}</span></h3>
        <div class="card">${o.map(t=>this._item(t))}</div>`:e}

      ${"routines"===i||"all"===i?p.length?s`
        <h3>Routines</h3>${this._routineGroups(p,{compact:!0})}`:"routines"===i?s`<div class="empty"><span>☀️</span><p>No routines for you today.</p></div>`:e:e}

      ${h?s`
        <h3>To do ${r.length?s`<span class="count">${r.length}</span>`:e}</h3>
        ${r.length?s`<div class="card">${r.map(t=>this._item(t))}</div>`:s`<div class="empty"><span>🎉</span><p>${n.length?"All done for today!":"No chores today."}</p></div>`}`:e}

      ${"calendar"===i||"all"===i?this._calendarToday("calendar"===i):e}

      ${h&&l.length?s`<h3>Done</h3><div class="card">${l.map(t=>this._item(t))}</div>`:e}`}_calendarToday(t){if(!this._hasCalendar)return e;const i=this._agenda;return i&&(i.length||t)?s`
      <h3>Calendar today</h3>
      ${i.length?s`<div class="card">${i.map(t=>s`
        <div class="item small">
          <span class="emoji" style="background:color-mix(in srgb, ${t.color} 22%, transparent)">${t.emoji}</span>
          <span class="txt"><b>${t.title}</b>
            <small>${N(t)}${t.location?` · ${t.location}`:""}</small></span>
          ${(t.people||[]).length?s`<span class="faces">${t.people.map(t=>this._person(t)).filter(Boolean).map(t=>b(this.hass,t,28))}</span>`:e}
        </div>`)}</div>`:s`<div class="empty"><span>🗓️</span><p>Nothing in the calendar today.</p></div>`}
      <button class="link" @click=${()=>this.dispatchEvent(new CustomEvent("hub-navigate",{detail:{id:"calendar"},bubbles:!0,composed:!0}))}>
        <ha-icon icon="mdi:calendar-month-outline"></ha-icon>Open the calendar</button>`:i&&!i.length?e:s`<h3>Calendar</h3><p class="muted">Loading…</p>`}_routineSlots({todayOnly:t=!1}={}){const e=this._person(this._acting)||{id:this._meId,name:this.hass.user?.name||"You",emoji:"🙂",color:P,role:"adult"},s=[];for(const i of this._state.routines){if(!1===i.active)continue;if(t&&!this._stepsToday(i).length)continue;const a=(i.assignees||[]).map(t=>this._person(t)).filter(Boolean);let n=a.length?a:[e];if(this._isAdult?"all"!==this._filter&&(n=n.filter(t=>t.id===this._filter)):n=n.filter(t=>t.id===e.id),a.length||this._isAdult||"guest"!==this._role)for(const t of n)s.push({r:i,p:t})}return s}_slotGroups(t){const e=this._people.map(t=>t.id),s=[];for(const e of t){let t=s.find(t=>t.p.id===e.p.id);t||(t={p:e.p,slots:[]},s.push(t)),t.slots.push(e)}return s.sort((t,s)=>e.indexOf(t.p.id)-e.indexOf(s.p.id)),s}_routineGroups(t,i){const a=this._slotGroups(t),n=a.length>1;return a.map(t=>s`
      ${n?s`<h4 class="pgroup">${b(this.hass,t.p,28)}<span>${t.p.name}</span></h4>`:e}
      ${t.slots.map(t=>this._routineCard(t.r,t.p,{...i,who:!n}))}`)}_stepsToday(t){return t.steps.filter(t=>!(t.days||[]).length||t.days.includes(p()))}_faces(t){return t.length?s`<span class="faces">${t.map(t=>b(this.hass,t,34))}</span>`:s`<span class="faces everyone" title="Anyone"><ha-icon icon="mdi:account-group-outline"></ha-icon></span>`}_item(t){const i=t.chore,n=(i.assignees||[]).map(t=>this._person(t)).filter(Boolean),o=this._overdue(i,t),r=["done","approved"].includes(t.status)?[this._person(t.done_by)].filter(Boolean):n,l=t.done_by===this._acting,c="done"===t.status?this._isAdult||l:"approved"===t.status&&this._isAdult;return s`
      <div class="item ${t.status} ${r.length?"has-who":""}" style="--who:${r[0]?.color||"transparent"}">
        ${this._faces(r)}
        <span class="emoji">${i.emoji}</span>
        <span class="txt">
          <b>${i.name}</b>
          <small>
            ${["done","approved"].includes(t.status)?s`${this._person(t.done_by)?.name||"Someone"} did it`:n.length?n.map(t=>t.name).join(", "):"Anyone"}
            ${t.date<a()?s` · <span class="late">${this._dateLabel(t.date)}</span>`:i.due_time?s` · <span class=${o?"late":""}>${o?"Was due":"Due"} ${i.due_time}</span>`:e}
            ${i.points?s` · +${i.points} ★`:e}
          </small>
          ${"rejected"===t.status&&t.note?s`<small class="late">Sent back: ${t.note}</small>`:e}
        </span>
        ${["open","rejected"].includes(t.status)?s`
          <button class="check" ?disabled=${!this._canDo(i)} @click=${()=>this._complete(t)} aria-label="Mark ${i.name} as done"
            title=${this._canDo(i)?"Done":"Not assigned to you"}><ha-icon icon="mdi:check"></ha-icon></button>`:"done"===t.status?s`
          <button class="pill wait" ?disabled=${!c} @click=${()=>this._undo(t)} title=${c?"Take it back":"Waiting for approval"}>Waiting</button>`:s`<button class="pill okp" ?disabled=${!c} @click=${()=>this._undo(t)} title=${c?"Undo":""}>✓ ${t.points?`+${t.points}`:"Done"}</button>`}
      </div>`}_choresList(){const t=this._state.chores;return s`
      <div class="head">
        <h3 class="inline">All chores</h3>
        ${this._isAdult?s`<button class="primary" @click=${()=>{this._sheet={type:"pick"}}}><ha-icon icon="mdi:plus"></ha-icon>Add chore</button>`:e}
      </div>
      ${t.length?s`<div class="card">${t.map(t=>{const i=(t.assignees||[]).map(t=>this._person(t)).filter(Boolean);return s`
          <button class="item btn ${i.length?"has-who":""}" style="--who:${i[0]?.color||"transparent"}" @click=${()=>this._isAdult&&this._editChore(t)} ?disabled=${!this._isAdult}>
            ${this._faces(i)}
            <span class="emoji">${t.emoji}</span>
            <span class="txt"><b>${t.name}</b>
              <small>${i.length?i.map(t=>t.name).join(", "):"Anyone"} · ${this._recurrenceText(t.recurrence)}${t.due_time?` · ${t.due_time}`:""}</small></span>
            <span class="pts">${t.points} ★</span>
            ${this._isAdult?s`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>`:e}
          </button>`})}</div>`:s`<div class="empty"><span>🧹</span><p>No chores yet.</p>${this._isAdult?s`<button class="primary" @click=${()=>{this._sheet={type:"pick"}}}>Add the first one</button>`:e}</div>`}
      ${this._isAdult?e:s`<p class="muted">Only an adult can add or change chores.</p>`}`}_routineCard(t,i,{compact:a=!1,who:n=!0}={}){const o=this._run(t.id,i.id),r=this._stepsToday(t),l=r.filter(t=>o.steps.includes(t.id)).length,c=this._isAdult||i.id===this._meId,d=!r.length;return s`
      <div class="card routine ${o.completed?"finished":""}" style="--who:${i.color}">
        <button class="rhead" @click=${()=>{this._sheet={type:"run",id:t.id,person:i.id}}} ?disabled=${!c||d}>
          ${n?b(this.hass,i,44):s`<span class="emoji big">${t.emoji}</span>`}
          <span class="txt"><b>${n?`${t.emoji} `:""}${t.name}</b>
            <small>${n?`${i.name} · `:""}${d?"No steps today":`${r.length} step${1===r.length?"":"s"} today`} · +${t.points} ★</small></span>
          <span class="pill ${o.completed?"okp":""}">${d?"—":o.completed?"✓ Done":l?`${l}/${r.length}`:"Start"}</span>
        </button>
        <div class="bar"><i style="width:${r.length?l/r.length*100:0}%"></i></div>
        ${this._isAdult&&!a?s`<button class="link" @click=${()=>this._editRoutine(t)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit routine</button>`:e}
      </div>`}_routines(){const t=this._routineSlots();return s`
      <div class="head">
        <h3 class="inline">Routines</h3>
        ${this._isAdult?s`<button class="primary" @click=${()=>{this._sheet={type:"routine-pick"}}}><ha-icon icon="mdi:plus"></ha-icon>Add routine</button>`:e}
      </div>
      ${this._isAdult&&this._people.length>1?s`
        <div class="chips" role="radiogroup" aria-label="Show routines for">
          <button class="chip ${"all"===this._filter?"on":""}" @click=${()=>{this._filter="all"}}>Everyone</button>
          ${this._people.map(t=>s`<button class="chip ${this._filter===t.id?"on":""}" @click=${()=>{this._filter=t.id}}>${b(this.hass,t,22)}${t.name}</button>`)}
        </div>`:e}
      ${t.length?this._routineGroups(t,{}):s`<div class="empty"><span>☀️</span><p>${this._isAdult?"No routines yet. Start from a morning or evening routine.":"No routines for you yet."}</p></div>`}`}_free(t){const e=(this._state.redemptions||[]).filter(e=>e.person_id===t&&"requested"===e.status).reduce((t,e)=>t+e.cost,0);return(this._state.balances[t]||0)-e}async _redeem(t){const e=await this._call("redeem",{reward_id:t.id});"approved"===e?.status?(this._say(`Enjoy! ${t.emoji} ${t.name}`),h(this,this._celebrationOf(this._acting),{big:!1})):"requested"===e?.status&&this._say("Asked! A grown-up will say yes.")}async _decide(t,e){await this._call(e?"redemptions/approve":"redemptions/decline",{redemption_id:t.id})&&e&&this._say(`${this._person(t.person_id)?.name||"They"} spent ${t.cost} ★ on ${t.name}`)}async _addStandard(t){for(const e of t)await this._call("rewards/add",{name:e.name,emoji:e.emoji,cost:e.cost})}_editReward(t){this._draft={...t},this._sheet={type:"reward",id:t.id}}_newReward(t){this._draft={name:t?.name||"",emoji:t?.emoji||"🎁",cost:t?.cost||20,active:!0},this._sheet={type:"reward"}}async _saveReward(){const t=this._draft;if(!t.name.trim())return void this._say("Give the reward a name");const e={name:t.name.trim(),emoji:t.emoji,cost:Number(t.cost)||0,active:!!t.active},s=this._sheet?.id;await this._call(s?"rewards/update":"rewards/add",s?{reward_id:s,...e}:e)&&this._closeSheet()}async _deleteReward(){if(!confirm(`Remove “${this._draft.name}”? Points already spent stay spent.`))return;await this._call("rewards/delete",{reward_id:this._sheet.id})&&this._closeSheet()}_startPocket(t){const e=this._state.pocket?.[t.id]||{};this._draft={enabled:e.enabled??!0,period:e.period||"week",points:e.points??20,amount:$(e.amount??500),account:e.account||"bank"},this._sheet={type:"pocket",person:t}}async _savePocket(){const t=this._draft,e=v(t.amount);if(Number.isNaN(e)||e<0)return void this._say("Enter the amount like 5 or 5.50");if(!(Number(t.points)>=1))return void this._say("Enter how many points they need");await this._call("pocket/set",{person_id:this._sheet.person.id,enabled:!!t.enabled,period:t.period,points:Number(t.points),amount:e,account:t.account})&&this._closeSheet()}_pocketText(t){const e="week"===t.period?"week":"month";return`${t.points} ★ a ${e} earns ${f(this.hass,t.amount)} into ${"cash"===t.account?"Cash":"Bank"}`}_pocketBar(t){const e=Math.min(100,t.points?t.earned/t.points*100:0),i=Math.max(0,t.points-t.earned);return s`
      <div class="bar"><i style="width:${e}%"></i></div>
      <small class="muted pocketnote">${t.starts_next?`Starts next ${t.period}.`:i?`${t.earned} of ${t.points} ★ this ${t.period}. ${i} more to earn ${f(this.hass,t.amount)}.`:`${t.earned} ★ this ${t.period}: ${f(this.hass,t.amount)} pocket money is on its way!`}</small>`}_rewardsSection(){const t=this._state,i=(t.rewards||[]).filter(t=>!1!==t.active),a=this._actor,n=a?this._free(a.id):0,o=this._isAdult?(t.redemptions||[]).filter(t=>"requested"===t.status):[],r=(t.redemptions||[]).filter(t=>t.person_id===this._acting).slice(-3).reverse();return s`
      <h3>Spend your points ${a?s`<span class="count">${n} ★ to spend</span>`:e}</h3>

      ${o.length?s`<div class="card">${o.map(t=>s`
        <div class="item">
          <span class="emoji">${t.emoji}</span>
          <span class="txt"><b>${t.name}</b><small>${this._person(t.person_id)?.name||"Someone"} · ${t.cost} ★</small></span>
          <button class="mini ok" @click=${()=>this._decide(t,!0)}><ha-icon icon="mdi:check"></ha-icon>Yes</button>
          <button class="mini" aria-label="Say no" @click=${()=>this._decide(t,!1)}><ha-icon icon="mdi:close"></ha-icon></button>
        </div>`)}</div><p class="muted">Waiting for a yes before the points are spent.</p>`:e}

      ${i.length?s`<div class="rewards">${i.map(t=>{const i=!!a&&n>=t.cost&&"guest"!==a.role;return s`
          <div class="reward ${i?"":"locked"}">
            ${this._isAdult?s`<button class="redit" aria-label="Edit ${t.name}" @click=${()=>this._editReward(t)}><ha-icon icon="mdi:pencil-outline"></ha-icon></button>`:e}
            <span class="re">${t.emoji}</span><b>${t.name}</b>
            <span class="cost">${t.cost} ★</span>
            <button class="mini ${i?"ok":""}" ?disabled=${!i} @click=${()=>this._redeem(t)}>${i?this._isAdult?"Spend":"Ask":t.cost-n+" more"}</button>
          </div>`})}</div>`:s`<div class="empty"><span>🎁</span><p>${this._isAdult?"Nothing to spend points on yet.":"No rewards yet. Ask a grown-up to add some!"}</p>
          ${this._isAdult?s`<button class="primary" @click=${()=>this._addStandard(y)}>Add the standard rewards</button>`:e}</div>`}

      ${this._isAdult?s`<div class="head"><span></span><button class="link" @click=${()=>{this._sheet={type:"reward-pick"}}}><ha-icon icon="mdi:plus"></ha-icon>Add a reward</button></div>`:e}

      ${r.length?s`<h4>Your requests</h4><div class="card">${r.map(t=>s`
        <div class="item small">
          <span class="emoji">${t.emoji}</span>
          <span class="txt"><b>${t.name}</b><small>${t.cost} ★ · ${{requested:"waiting for a yes",approved:"enjoy!",declined:"not this time"}[t.status]}</small></span>
          ${"requested"===t.status?s`<button class="mini" @click=${()=>this._call("redemptions/cancel",{redemption_id:t.id})}>Cancel</button>`:e}
        </div>`)}</div>`:e}`}_pocketSection(){const t=this._state.pocket||{},i=this._people.filter(t=>"child"===t.role),a=!!this.modules?.finance;if(!this._isAdult){const i=this._actor&&t[this._acting];return i?.enabled?s`<h3>Pocket money</h3><div class="card pad">${this._pocketBar(i)}
        <p class="muted">${this._pocketText(i)}.</p></div>${this._pocketHistory(this._acting)}`:e}return s`
      <h3>Pocket money</h3>
      <div class="card">${i.length?i.map(i=>{const a=t[i.id];return s`
          <div class="pk">
            <div class="item">
              ${this._avatar(i,"lg")}
              <span class="txt"><b>${i.name}</b><small>${a?.enabled?this._pocketText(a):"No pocket money set up"}</small></span>
              <button class="mini ${a?.enabled?"":"ok"}" @click=${()=>this._startPocket(i)}>${a?.enabled?"Change":"Set up"}</button>
            </div>
            ${a?.enabled?s`<div class="pkbar">${this._pocketBar(a)}</div>`:e}
          </div>`}):s`<p class="muted pad">Add children under Manage people first.</p>`}</div>
      <p class="muted">When a ${"week or month"} finishes, a child who earned enough points is paid into their ${a?"Finance account":"account"} automatically.
        Only chores and routines count (not bonuses), and an undone chore takes its points back.
        ${a?"":s`<b>The Finance part is switched off, so nothing is paid until you switch it on (under Settings → Menu).</b>`}</p>
      ${this._pocketHistory(null)}`}_pocketHistory(t){const i=(this._state.pocket_history||[]).filter(e=>!t||e.person_id===t).slice(-5).reverse();return i.length?s`<h4>Past ${t?"weeks":"weeks and months"}</h4><div class="card">${i.map(t=>{const e=this._person(t.person_id);return s`<div class="item small">${this._avatar(e)}
        <span class="txt"><b>${e?.name||"Someone"}: ${t.earned} of ${t.target} ★</b><small>${this._dateLabel(t.start)} – ${this._dateLabel(this._dayBefore(t.end))}</small></span>
        <span class="pill ${t.paid?"okp":""}">${t.paid?`+${f(this.hass,t.amount)}`:"Not this time"}</span></div>`})}</div>`:e}_points(){const t=this._state.balances,i=[...this._people].sort((e,s)=>(t[s.id]||0)-(t[e.id]||0));return s`
      <h3>Points</h3>
      <div class="card">${i.map(i=>s`
        <div class="item">
          ${this._avatar(i,"lg")}
          <span class="txt"><b>${i.name}</b><small>${"adult"===i.role?"Adult":"child"===i.role?"Child":"Guest"}</small></span>
          <span class="score">${t[i.id]||0} ★</span>
          ${this._isAdult?s`<button class="mini" aria-label="Adjust points for ${i.name}"
            @click=${()=>{this._draft={points:"",reason:""},this._sheet={type:"adjust",person:i}}}><ha-icon icon="mdi:plus-minus-variant"></ha-icon></button>`:e}
        </div>`)}</div>
      ${this._rewardsSection()}
      ${this._pocketSection()}
      <h3>Recent</h3>
      ${this._state.history.length?s`<div class="card">${this._state.history.map(t=>{const e=this._person(t.person_id);return s`
          <div class="item small">
            ${this._avatar(e)}
            <span class="txt"><b>${t.reason}</b><small>${e?.name||"Someone"} · ${new Date(t.at).toLocaleDateString(void 0,{day:"numeric",month:"short"})}</small></span>
            <span class="score ${t.points<0?"neg":""}">${t.points>0?"+":""}${t.points}</span>
          </div>`})}</div>`:s`<p class="muted">Points appear here once chores are approved.</p>`}`}_settings(){const t=this._actor;return s`
      ${t?s`
        <h3>Your PIN</h3>
        <div class="card">
          <div class="item">
            ${this._avatar(t,"lg")}
            <span class="txt"><b>${t.has_pin?"PIN is on":"No PIN yet"}</b>
              <small>${t.has_pin?`Needed to use ${t.name}'s profile on a shared login.`:`Set 4 digits so ${t.name} can sign in on any device.`}</small></span>
            <button class="mini ok" @click=${()=>this._startPin()}>${t.has_pin?"Change":"Set PIN"}</button>
            ${t.has_pin?s`<button class="mini" aria-label="Remove PIN" @click=${()=>this._savePin(!0)}><ha-icon icon="mdi:close"></ha-icon></button>`:e}
          </div>
        </div>
        <p class="muted">On a child's own device: tap your name at the top, pick yourself and type your PIN, then tick off your chores and routines.
          An adult can set or reset a child's PIN under <i>Manage people</i>.</p>`:s`
        <p class="muted">${this._canSwitch?"Tap the name at the top to say who is using this device.":"You are signed in as yourself, so chores are always done as you."}</p>`}

      ${this._celebrationSection()}
      ${this._kidsSection()}

      <h3>People</h3>
      <div class="card">
        ${this._people.map(t=>s`<div class="item small">${this._avatar(t)}<span class="txt"><b>${t.name}</b><small>${{adult:"Adult",child:"Child",guest:"Guest"}[t.role]}${t.user_id?"":" · no Home Assistant login"}${t.has_pin?" · PIN":""}</small></span></div>`)}
        ${this._isAdult?s`<button class="item btn" @click=${()=>this.dispatchEvent(new CustomEvent("hub-sheet",{detail:{sheet:"people"},bubbles:!0,composed:!0}))}>
          <span class="emoji"><ha-icon icon="mdi:account-multiple-plus-outline"></ha-icon></span>
          <span class="txt"><b>Manage people & guests</b><small>Add children and guests without a login, set roles and PINs</small></span>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`:e}
      </div>

      <h3>How it works</h3>
      <div class="card info">
        <p><b>Children</b> mark a chore done and an adult approves it. Points are paid once, when it is approved.</p>
        <p><b>Adults</b> can do a chore themselves, and it counts straight away.</p>
        <p><b>Late</b> means an earlier day that was not finished, or today after the due time. A chore is never late before its starting day.</p>
        <p><b>Reminders</b> go out at a chore's own due time. Set a phone to notify under <i>Manage people</i>, otherwise the reminder shows in Home Assistant's notifications.</p>
        <p><b>Routines</b> are step by step, each step on the days you choose, and pay into the same points once the last step of the day is done.</p>
      </div>`}_renderSheet(){const t=this._sheet.type;return s`
      <div class="scrim" @click=${()=>this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${t}>
        <div class="grabber"></div>
        ${"switch"===t?this._switchSheet():e}
        ${"pin"===t?this._pinSheet():e}
        ${"setpin"===t?this._setPinSheet():e}
        ${"pick"===t?this._pickSheet():e}
        ${"chore"===t?this._choreSheet():e}
        ${"routine-pick"===t?this._routinePick():e}
        ${"routine"===t?this._routineSheet():e}
        ${"run"===t?this._runSheet():e}
        ${"celebrate"===t?this._celebrate():e}
        ${"adjust"===t?this._adjustSheet():e}
        ${"reward-pick"===t?this._rewardPick():e}
        ${"reward"===t?this._rewardSheet():e}
        ${"pocket"===t?this._pocketSheet():e}
      </section>`}_title(t,i){return s`<div class="head2">${i?s`<button class="back" aria-label="Back" @click=${i}><ha-icon icon="mdi:arrow-left"></ha-icon></button>`:e}<h2>${t}</h2></div>`}_switchSheet(){return s`${this._title("Who is this?")}
      ${this._people.map(t=>this._personRow(t,()=>this._switchTo(t),t.id===this._acting?s`<ha-icon class="chev" icon="mdi:check-circle"></ha-icon>`:e))}`}_pinSheet(){const t=this._sheet.person;return s`${this._title(`${t.name}'s PIN`,this._sheet.stay?null:()=>{this._sheet={type:"switch"}})}
      <form class="form" @submit=${t=>{t.preventDefault(),this._checkPin()}}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${t=>{this._pin=t.target.value.replace(/\D/g,"")}}>
        <button class="primary" type="submit" ?disabled=${4!==this._pin.length}>Continue</button>
      </form>`}_setPinSheet(){return s`${this._title(this._actor?.has_pin?"Change your PIN":"Set your PIN")}
      <form class="form" @submit=${t=>{t.preventDefault(),this._savePin()}}>
        <label>New PIN (4 digits)
          <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
            .value=${this._pin} @input=${t=>{this._pin=t.target.value.replace(/\D/g,"")}}></label>
        <label>Type it again
          <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••"
            .value=${this._pin2} @input=${t=>{this._pin2=t.target.value.replace(/\D/g,"")}}></label>
        <button class="primary" type="submit" ?disabled=${4!==this._pin.length||4!==this._pin2.length}>Save PIN</button>
      </form>`}_rewardPick(){const t=new Set((this._state.rewards||[]).map(t=>t.name.toLowerCase()));return s`${this._title("Add a reward")}
      <button class="row" @click=${()=>this._newReward(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Name it, pick an emoji and the points it costs</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>
      <h3>Standard rewards</h3>
      ${y.map(e=>{const i=t.has(e.name.toLowerCase());return s`
          <button class="row" ?disabled=${i} @click=${()=>this._call("rewards/add",{name:e.name,emoji:e.emoji,cost:e.cost})}>
            <span class="ico">${e.emoji}</span><span class="txt"><b>${e.name}</b><small>${e.cost} ★</small></span>
            ${i?s`<ha-icon class="chev" icon="mdi:check-circle"></ha-icon>`:s`<ha-icon class="chev" icon="mdi:plus-circle-outline"></ha-icon>`}
          </button>`})}
      <p class="muted">Tap one to add it. You can change what it costs afterwards.</p>`}_rewardSheet(){const t=this._draft,i=!!this._sheet.id;return s`${this._title(i?"Edit reward":"New reward",i?null:()=>{this._sheet={type:"reward-pick"}})}
      <div class="form">
        <label>Name<input .value=${t.name} maxlength="60" placeholder="e.g. Ice cream treat" @input=${t=>this._set("name",t.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(t.emoji,t=>this._set("emoji",t))}
        <label>Costs
          <span class="stepper">
            <button type="button" @click=${()=>this._set("cost",Math.max(1,(Number(t.cost)||0)-5))}>−</button>
            <input type="number" min="1" .value=${String(t.cost)} @input=${t=>this._set("cost",t.target.value)}>
            <button type="button" @click=${()=>this._set("cost",(Number(t.cost)||0)+5)}>+</button>
            <span class="muted">★ points</span>
          </span></label>
        ${this._switchRow("Available to ask for",t.active,t=>this._set("active",t))}
        <div class="actions">
          ${i?s`<button class="danger" @click=${()=>this._deleteReward()}>Remove</button>`:e}
          <button class="primary grow" @click=${()=>this._saveReward()}>Save reward</button>
        </div>
      </div>`}_pocketSheet(){const t=this._draft,e=this._sheet.person;return s`${this._title(`Pocket money for ${e.name}`)}
      <div class="form">
        ${this._switchRow("Pay pocket money",t.enabled,t=>this._set("enabled",t))}
        <label>Paid every</label>
        <div class="seg">${[["week","Week"],["month","Month"]].map(([e,i])=>s`<button type="button" class="${t.period===e?"on":""}" @click=${()=>this._set("period",e)}>${i}</button>`)}</div>
        <label>Points they need to earn each ${t.period}
          <span class="stepper">
            <button type="button" @click=${()=>this._set("points",Math.max(1,(Number(t.points)||0)-5))}>−</button>
            <input type="number" min="1" .value=${String(t.points)} @input=${t=>this._set("points",t.target.value)}>
            <button type="button" @click=${()=>this._set("points",(Number(t.points)||0)+5)}>+</button>
            <span class="muted">★</span>
          </span></label>
        <label>Pocket money amount<input inputmode="decimal" .value=${t.amount} placeholder="5.00" @input=${t=>this._set("amount",t.target.value)}></label>
        <label>Pay it into</label>
        <div class="seg">${[["cash","💵 Cash"],["bank","🏦 Bank"]].map(([e,i])=>s`<button type="button" class="${t.account===e?"on":""}" @click=${()=>this._set("account",e)}>${i}</button>`)}</div>
        <small class="hint">It starts with the next full ${t.period}, so nothing is paid for the days already gone.
          Chores and routines count; bonuses do not.${this.modules?.finance?"":" The Finance part is off, so it is paid once you switch it on."}</small>
        <div class="actions"><button class="primary grow" @click=${()=>this._savePocket()}>Save</button></div>
      </div>`}_pickSheet(){const t=this._search.trim().toLowerCase(),i={};for(const e of x)t&&!e.name.toLowerCase().includes(t)||(i[e.group]||=[]).push(e);return s`${this._title("Add a chore")}
      <button class="row" @click=${()=>this._newChoreFrom(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Name it, pick an emoji and points</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      </button>
      <h3>Standard chores</h3>
      <input class="search" placeholder="Search chores" .value=${this._search} @input=${t=>{this._search=t.target.value}}>
      ${Object.entries(i).map(([t,e])=>s`
        <h4>${t}</h4>
        <div class="tiles">${e.map(t=>s`
          <button class="tile" @click=${()=>this._newChoreFrom(t)}><span>${t.emoji}</span><b>${t.name}</b><small>${t.points} ★</small></button>`)}</div>`)}
      ${Object.keys(i).length?e:s`<p class="muted">Nothing matches. Create your own instead.</p>`}`}_chips(t,e,i){return s`<div class="chips">
      <button class="chip ${t.length?"":"on"}" @click=${i}>Anyone</button>
      ${this._people.map(i=>s`<button class="chip ${t.includes(i.id)?"on":""}" @click=${()=>e(i.id)}>${b(this.hass,i,22)}${i.name}</button>`)}
    </div>`}_emojiPicker(t,e){return s`<ksh-emoji-picker .value=${t} .quick=${k} @emoji-pick=${t=>e(t.detail.emoji)}></ksh-emoji-picker>`}_choreSheet(){const t=this._draft,i=t.recurrence,n=!!this._sheet.id;return s`${this._title(n?"Edit chore":"New chore",n?null:()=>{this._sheet={type:"pick"}})}
      <div class="form">
        <label>Name<input .value=${t.name} maxlength="80" placeholder="e.g. Feed the dog" @input=${t=>this._set("name",t.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(t.emoji,t=>this._set("emoji",t))}
        <div class="two">
          <label>Points
            <span class="stepper">
              <button type="button" @click=${()=>this._set("points",Math.max(0,(Number(t.points)||0)-1))}>−</button>
              <input type="number" min="0" max="1000" .value=${String(t.points)} @input=${t=>this._set("points",t.target.value)}>
              <button type="button" @click=${()=>this._set("points",(Number(t.points)||0)+1)}>+</button>
            </span>
          </label>
        </div>

        <label>Who does it</label>
        ${this._chips(t.assignees,t=>this._toggleAssignee(t),()=>this._set("assignees",[]))}
        <small class="hint">${t.assignees.length?"Only these people can do it.":"Anyone in the family can do it."}</small>

        <label>${"once"===i.type?"Date":"Starts on"}
          <input type="date" .value=${t.start||a()} @input=${t=>this._set("start",t.target.value)}></label>
        <small class="hint">${"once"===i.type?"It only happens on this day.":(t.start||a())>a()?"It does not show up, or count as late, before this day.":"The first day it is due."}</small>

        <label>Repeats</label>
        <div class="seg">${[["daily","Daily"],["weekly","Weekly"],["custom","Custom"],["once","Once"]].map(([t,e])=>s`
          <button type="button" class="${i.type===t?"on":""}" @click=${()=>this._setRecType(t)}>${e}</button>`)}</div>
        ${"weekly"===i.type||"custom"===i.type&&"week"===i.unit?s`
          <div class="chips">${c.map((t,e)=>s`<button type="button" class="chip ${(i.days||[]).includes(e)?"on":""}" @click=${()=>this._toggleDay(e)}>${t}</button>`)}</div>`:e}
        ${"custom"===i.type?s`
          <div class="every">Every
            <input type="number" min="1" max="365" .value=${String(i.every||1)} @input=${t=>this._setRec({every:Number(t.target.value)||1})}>
            <select @change=${t=>this._setRec({unit:t.target.value})}>
              ${[["day","days"],["week","weeks"],["month","months"]].map(([t,e])=>s`<option value=${t} ?selected=${i.unit===t}>${e}</option>`)}
            </select>
          </div>
          <small class="hint">Counting from ${t.start||"today"}.</small>`:e}

        <label>Due time <small class="hint inl">(optional)</small></label>
        <div class="time">
          <input type="time" .value=${t.due_time} @input=${t=>this._set("due_time",t.target.value)}>
          ${t.due_time?s`<button type="button" class="link" @click=${()=>this._set("due_time","")}>Clear</button>`:e}
        </div>
        ${t.due_time?this._switchRow("Remind at this time",t.remind,t=>this._set("remind",t)):e}
        ${this._switchRow("An adult approves it before points are paid",t.requires_approval,t=>this._set("requires_approval",t))}

        <div class="actions">
          ${n?s`<button class="danger" @click=${()=>this._deleteChore()}>Delete</button>`:e}
          <button class="primary grow" @click=${()=>this._saveChore()}>Save chore</button>
        </div>
      </div>`}_switchRow(t,e,i){return s`<button type="button" class="switchrow" role="switch" aria-checked=${e?"true":"false"} @click=${()=>i(!e)}>
      <span>${t}</span><span class="switch ${e?"on":""}"><i></i></span></button>`}_routinePick(){return s`${this._title("Add a routine")}
      ${w.map(t=>s`
        <button class="row" @click=${()=>this._newRoutineFrom(t)}>
          <span class="ico">${t.emoji}</span><span class="txt"><b>${t.name}</b><small>${t.steps.length} steps · ${t.steps.map(t=>t.emoji).join(" ")}</small></span>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`)}
      <button class="row" @click=${()=>this._newRoutineFrom(null)}>
        <span class="ico">✏️</span><span class="txt"><b>Create your own</b><small>Your own steps</small></span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`}_routineSheet(){const t=this._draft,i=!!this._sheet.id;return s`${this._title(i?"Edit routine":"New routine",i?null:()=>{this._sheet={type:"routine-pick"}})}
      <div class="form">
        <label>Name<input .value=${t.name} maxlength="60" @input=${t=>this._set("name",t.target.value)}></label>
        <label>Emoji</label>${this._emojiPicker(t.emoji,t=>this._set("emoji",t))}
        <label>Kind</label>
        <div class="seg">${[["morning","Morning"],["evening","Evening"],["custom","Other"]].map(([e,i])=>s`
          <button type="button" class="${t.kind===e?"on":""}" @click=${()=>this._set("kind",e)}>${i}</button>`)}</div>
        <label>Points when finished
          <span class="stepper">
            <button type="button" @click=${()=>this._set("points",Math.max(0,(Number(t.points)||0)-1))}>−</button>
            <input type="number" min="0" .value=${String(t.points)} @input=${t=>this._set("points",t.target.value)}>
            <button type="button" @click=${()=>this._set("points",(Number(t.points)||0)+1)}>+</button>
          </span></label>
        <label>Who does it</label>
        ${this._chips(t.assignees,e=>this._set("assignees",t.assignees.includes(e)?t.assignees.filter(t=>t!==e):[...t.assignees,e]),()=>this._set("assignees",[]))}
        <label>Steps</label>
        <small class="hint">Each step can be for certain days, like packing the school bag on school days only.</small>
        ${t.steps.map((e,i)=>s`
          <div class="stepwrap">
          <div class="step">
            <ksh-emoji-picker compact .value=${e.emoji||""} .quick=${k} @emoji-pick=${t=>this._setStep(i,{emoji:t.detail.emoji})}></ksh-emoji-picker>
            <input class="st" maxlength="60" .value=${e.text} placeholder="Step ${i+1}" @input=${t=>this._setStep(i,{text:t.target.value})}>
            <button type="button" class="mini" @click=${()=>this._moveStep(i,-1)} aria-label="Move up"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="mini" @click=${()=>this._moveStep(i,1)} aria-label="Move down"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <button type="button" class="mini" @click=${()=>this._set("steps",t.steps.filter((t,e)=>e!==i))} aria-label="Remove step"><ha-icon icon="mdi:close"></ha-icon></button>
          </div>
          ${this._stepDays(e,i)}
          </div>`)}
        <button type="button" class="link" @click=${()=>this._set("steps",[...t.steps,{text:"",emoji:"",days:[]}])}><ha-icon icon="mdi:plus"></ha-icon>Add a step</button>
        <div class="actions">
          ${i?s`<button class="danger" @click=${()=>this._deleteRoutine()}>Delete</button>`:e}
          <button class="primary grow" @click=${()=>this._saveRoutine()}>Save routine</button>
        </div>
      </div>`}_daysLabel(t=[]){return t.length?R(t,C)?"Weekdays":R(t,z)?"Weekends":t.map(t=>c[t]).join(", "):"Every day"}_stepDays(t,i){const a=t.days||[],n=this._openStep===i,o=t=>this._setStep(i,{days:t});return s`
      <div class="stepdays">
        <button type="button" class="daybtn ${a.length?"some":""}" @click=${()=>{this._openStep=n?null:i,this.requestUpdate()}}
          aria-expanded=${n?"true":"false"}><ha-icon icon="mdi:calendar-week"></ha-icon>${this._daysLabel(a)}<ha-icon icon=${n?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon></button>
        ${n?s`
          <div class="chips">
            <button type="button" class="chip ${a.length?"":"on"}" @click=${()=>o([])}>Every day</button>
            <button type="button" class="chip ${R(a,C)?"on":""}" @click=${()=>o([...C])}>Weekdays</button>
            <button type="button" class="chip ${R(a,z)?"on":""}" @click=${()=>o([...z])}>Weekends</button>
          </div>
          <div class="chips">${c.map((t,e)=>s`
            <button type="button" class="chip ${a.includes(e)?"on":""}"
              @click=${()=>o(a.includes(e)?a.filter(t=>t!==e):[...a,e].sort())}>${t}</button>`)}</div>`:e}
      </div>`}_runSheet(){const t=this._state.routines.find(t=>t.id===this._sheet.id);if(!t)return e;const i=this._sheet.person||this._meId,a=this._person(i),n=this._run(t.id,i),o=this._stepsToday(t),r=o.find(t=>!n.steps.includes(t.id)),l=o.filter(t=>n.steps.includes(t.id)).length;return s`${this._title(`${t.emoji} ${t.name}${a&&i!==this._meId?` · ${a.name}`:""}`)}
      <div class="bar"><i style="width:${o.length?l/o.length*100:0}%"></i></div>
      ${r?s`
        <div class="focus">
          <div class="fe">${r.emoji||"👉"}</div>
          <div class="ft">${r.text}</div>
          <button class="primary huge" @click=${()=>this._toggleStep(t,r.id,!0,i)}><ha-icon icon="mdi:check"></ha-icon>Done</button>
        </div>`:s`<div class="focus"><div class="fe">🎉</div><div class="ft">All steps done!</div></div>`}
      <h4>Today's steps</h4>
      ${o.map(e=>s`
        <button class="step-row ${n.steps.includes(e.id)?"done":""}" @click=${()=>this._toggleStep(t,e.id,!n.steps.includes(e.id),i)}>
          <ha-icon icon=${n.steps.includes(e.id)?"mdi:check-circle":"mdi:circle-outline"}></ha-icon>
          <span>${e.emoji} ${e.text}</span>
        </button>`)}`}_celebrate(){const t=this._sheet.routine;return s`
      <div class="celebrate">
        <div class="fe">🎉</div>
        <h2>${t.name} done!</h2>
        <p class="score big">+${t.points} ★</p>
        <button class="primary" @click=${()=>this._closeSheet()}>Great</button>
      </div>`}_adjustSheet(){const t=this._sheet.person;return s`${this._title(`Points for ${t.name}`)}
      <div class="form">
        <p class="muted">Add points as a reward bonus, or take some away when they are spent. Use a minus sign to take points away.</p>
        <label>Points<input type="number" placeholder="e.g. 5 or -10" .value=${String(this._draft.points)} @input=${t=>{this._draft={...this._draft,points:t.target.value}}}></label>
        <label>Reason<input maxlength="60" placeholder="e.g. Ice cream" .value=${this._draft.reason} @input=${t=>{this._draft={...this._draft,reason:t.target.value}}}></label>
        <div class="actions"><button class="primary grow" @click=${()=>this._adjust()}>Save</button></div>
      </div>`}static styles=[S,i`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 820px; margin: 0 auto; padding: 6px 16px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: var(--hub-accent); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 6px 2px; }
    h2.big { margin: 20px 0 4px; }
    h3 { margin: 18px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); display: flex; align-items: center; gap: 8px; }
    h3.inline { margin: 0; }
    h4 { margin: 14px 4px 6px; font-size: 13px; color: var(--hub-muted); }
    .count { background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 1px 8px; font-size: 11px; }
    .date { margin: 6px 4px 2px; color: var(--hub-muted); font-size: 14px; }

    .who { display: flex; align-items: center; gap: 10px; margin: 6px 0 4px; }
    .chip-person { display: flex; align-items: center; gap: 10px; background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 999px; padding: 5px 16px 5px 6px; text-align: left; }
    .chip-person span:last-child { display: flex; flex-direction: column; line-height: 1.2; }
    .chip-person small, .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .badge { margin-left: auto; background: #f59a4d; color: #2a1503; border-radius: 999px; padding: 4px 12px; font-size: 12.5px; font-weight: 800; }
    .pgroup { display: flex; align-items: center; gap: 10px; margin: 16px 4px 6px; font-size: 15px; font-weight: 800; }
    .faces { display: inline-flex; flex: none; align-items: center; }
    .faces .av { margin-left: -9px; box-shadow: 0 0 0 2px var(--hub-surface); }
    .faces .av:first-child { margin-left: 0; }
    .faces.everyone { color: var(--hub-muted); --mdc-icon-size: 26px; width: 34px; justify-content: center; }
    .item.has-who { box-shadow: inset 4px 0 0 var(--who); }
    .avatar { width: 38px; height: 38px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center; font-size: 20px;
      background: color-mix(in srgb, var(--c) 28%, transparent); border: 2px solid var(--c); }
    .avatar.lg { width: 46px; height: 46px; font-size: 24px; }

    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 8px 0; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .card.info { padding: 6px 16px; }
    .card.info p { margin: 10px 0; font-size: 14px; line-height: 1.45; }
    .item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--hub-border); width: 100%; background: none; border-left: none; border-right: none; border-top: none; text-align: left; }
    .item:last-child { border-bottom: none; }
    .item.small { padding: 9px 14px; }
    .item.btn:hover:not([disabled]) { background: var(--hub-surface-2); }
    .item.done .txt b, .item.approved .txt b { text-decoration: line-through; opacity: .65; }
    .emoji { font-size: 28px; width: 42px; height: 42px; display: inline-flex; align-items: center; justify-content: center; border-radius: 14px; background: var(--hub-surface-2); flex: none; }
    .emoji.big { width: 50px; height: 50px; font-size: 32px; }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .txt b { font-size: 15.5px; font-weight: 700; }
    .late { color: #e8685a; }
    .pts, .score { font-weight: 800; color: #e2ac3f; white-space: nowrap; }
    .score.neg { color: #e8685a; }
    .score.big { font-size: 32px; margin: 4px 0 12px; }
    .check { width: 44px; height: 44px; border-radius: 50%; flex: none; border: 2px solid var(--hub-muted); background: transparent; color: var(--hub-muted); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 24px; }
    .check:hover:not([disabled]) { background: var(--hub-accent-2); border-color: var(--hub-accent-2); color: var(--hub-accent-2-ink); }
    .pill { border: 1px solid var(--hub-border); background: var(--hub-surface-2); color: var(--hub-muted); border-radius: 999px; padding: 6px 12px; font-size: 12.5px; font-weight: 800; white-space: nowrap; }
    .pill.wait { color: #f59a4d; border-color: rgba(245,154,77,.5); }
    .pill.okp { color: var(--hub-accent-2); border-color: color-mix(in srgb, var(--hub-accent-2) 55%, transparent); }
    .mini { display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 7px 12px; font-weight: 700; font-size: 13px; --mdc-icon-size: 18px; flex: none; }
    .mini.ok { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .chev { color: var(--hub-muted); --mdc-icon-size: 22px; flex: none; }
    .empty { text-align: center; padding: 26px 10px; color: var(--hub-muted); }
    .empty span { font-size: 44px; }
    .head { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
    .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 10px 18px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; justify-content: center; --mdc-icon-size: 20px; }
    .primary.huge { width: 100%; padding: 18px; font-size: 20px; border-radius: 22px; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; }
    .link { background: none; border: none; color: var(--hub-accent); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; padding: 8px 4px; --mdc-icon-size: 18px; }

    .routine { margin-bottom: 12px; }
    .rhead { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px; background: none; border: none; text-align: left; }
    .bar { height: 6px; background: var(--hub-surface-2); border-radius: 3px; margin: 0 14px 10px; overflow: hidden; }
    .bar i { display: block; height: 100%; background: var(--hub-accent-2); transition: width .25s; }
    .routine.finished .bar i { background: #4fd1a1; }
    .routine .link { margin: 0 10px 8px; }

    .toast { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); background: var(--hub-sheet); color: var(--hub-text); border: 1px solid var(--hub-border);
      border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 14px; box-shadow: var(--hub-shadow); z-index: 60; max-width: 92%; text-align: center; animation: pop .2s ease; }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, 10px); } }

    /* sheets */
    .scrim { position: absolute; inset: 0; background: rgba(4,12,20,.55); z-index: 40; animation: fade .18s ease; }
    .sheet { position: absolute; left: 0; right: 0; bottom: 0; z-index: 41; max-width: 600px; margin: 0 auto; max-height: 92%; overflow-y: auto; overscroll-behavior: contain;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px)); box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160,190,215,.55); margin: 2px auto 12px; }
    .head2 { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .head2 h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .back { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center; }
    .row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 6px; background: none; border: none; border-radius: 16px; text-align: left; }
    .row:hover { background: var(--hub-surface-2); }
    .ico { width: 42px; height: 42px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: var(--hub-surface-2); font-size: 22px; flex: none; }
    .search, .form input:not([type=checkbox]), .form select, .every input, .every select {
      width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .search:focus, .form input:focus { border-color: var(--hub-accent); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(108px, 1fr)); gap: 8px; }
    .tile { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 12px 6px; border: 1px solid var(--hub-border); background: var(--hub-surface); border-radius: 16px; text-align: center; }
    .tile:hover { border-color: var(--hub-accent); }
    .tile span { font-size: 30px; }
    .tile b { font-size: 13px; line-height: 1.2; }
    .tile small { color: #e2ac3f; font-weight: 700; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; }
    .hint.inl { margin-left: 4px; }
    .two { display: grid; gap: 8px; }
    .stepper { display: flex; align-items: center; gap: 8px; }
    .stepper input { text-align: center; width: 90px !important; }
    .stepper button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface-2); font-size: 20px; font-weight: 800; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .every { display: flex; align-items: center; gap: 8px; font-weight: 700; }
    .every input { width: 80px; } .every select { width: auto; }
    .time { display: flex; align-items: center; gap: 10px; }
    .time input { width: auto !important; }
    .switchrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 4px; background: none; border: none; text-align: left; font-weight: 600; font-size: 14px; }
    .switch { width: 46px; height: 28px; border-radius: 999px; background: rgba(150,170,190,.35); display: flex; align-items: center; padding: 3px; flex: none; transition: background .15s; }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; }
    .switch.on { background: var(--hub-accent); } .switch.on i { transform: translateX(18px); }
    .actions { display: flex; gap: 10px; margin-top: 10px; } .grow { flex: 1; }
    .emoji-row { display: grid; gap: 8px; }
    .emoji-input { width: 80px !important; text-align: center; font-size: 22px !important; }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .step { display: flex; gap: 6px; align-items: center; }
    .step ksh-emoji-picker { flex: none; }
    .step .st { flex: 1; min-width: 0; }
    .cels { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; padding: 12px; }
    .cel { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px; border-radius: 16px; text-align: center;
      border: 2px solid var(--hub-border); background: var(--hub-surface-2); }
    .cel.sel { border-color: var(--hub-accent); }
    .cel .ce { font-size: 34px; line-height: 1.1; } .cel b { font-size: 14px; } .cel small { color: var(--hub-muted); font-size: 12px; line-height: 1.25; }
    .pad { padding: 12px 16px; }
    .rewards { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .reward { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 10px 12px; text-align: center;
      background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 18px; }
    .reward .re { font-size: 34px; line-height: 1.1; } .reward b { font-size: 14px; line-height: 1.2; }
    .reward .cost { color: #e2ac3f; font-weight: 800; }
    .reward.locked { opacity: .8; }
    .redit { position: absolute; top: 6px; right: 6px; width: 30px; height: 30px; border-radius: 50%; border: none; background: transparent; color: var(--hub-muted); --mdc-icon-size: 18px; display: flex; align-items: center; justify-content: center; }
    .pk + .pk { border-top: 1px solid var(--hub-border); } .pk .item { border-bottom: none; } .pkbar { padding: 0 14px 12px; }
    .pkbar .bar, .card.pad .bar { margin: 0 0 6px; } .pocketnote { display: block; margin: 0; }
    .seg.tabs { margin: 10px 0 6px; } .seg.tabs button { padding: 10px 4px; }
    .lateh { color: #e8685a; } .count.late { background: #e8685a; color: #2a0a07; }
    .stepwrap { border: 1px solid var(--hub-border); border-radius: 16px; padding: 8px; display: grid; gap: 6px; background: var(--hub-surface-2); }
    .stepdays { padding: 0 2px; }
    .daybtn { display: inline-flex; align-items: center; gap: 6px; border: none; background: none; color: var(--hub-muted); font-weight: 700; font-size: 12.5px; padding: 4px 4px; --mdc-icon-size: 16px; }
    .daybtn.some { color: var(--hub-accent); }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .focus { text-align: center; padding: 18px 0 8px; }
    .fe { font-size: 72px; line-height: 1.1; }
    .ft { font-size: 26px; font-weight: 800; margin: 8px 0 18px; }
    .step-row { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 6px; background: none; border: none; text-align: left; font-size: 15px; font-weight: 600; --mdc-icon-size: 24px; border-radius: 12px; }
    .step-row ha-icon { color: var(--hub-muted); }
    .step-row.done { opacity: .6; text-decoration: line-through; } .step-row.done ha-icon { color: #4fd1a1; }
    .celebrate { text-align: center; padding: 10px 0 6px; } .celebrate h2 { margin: 4px 0; }
  `]}customElements.define("ksh-chores-module",D);
