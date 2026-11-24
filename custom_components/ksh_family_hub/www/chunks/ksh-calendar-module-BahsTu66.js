import{a as e,b as t,A as i,i as a}from"./lit-element-BqsBd8Ys.js";import{a as s,b as n,l as o,r,c as l,g as d,d as h,j as c,v as p,u}from"./ksh-family-hub-card-UBHReqKW.js";import{p as m,f as g,m as _,i as b,a as v,l as f,c as x,t as y,C as w,E as $,R as k}from"./data-CIkehvI9.js";import"./virtual_card-version-DBhfHTym.js";const S="ksh_calendar_card_pos",j=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],z=[["right","Right"],["left","Left"],["bottom","Bottom"],["top","Top"]],D="ksh_calendar_chore_views",C=[["day","Day"],["week","Week"],["agenda","Agenda"],["month","Month"]],R="ksh_calendar_face_side",A=(e,t={})=>({title:"",emoji:"📌",category:"other",people:[],date:e,end_date:"",all_day:!0,start_time:"09:00",end_time:"",repeat:{type:"none"},location:"",notes:"",remind:null,...t});class E extends e{static properties={hass:{type:Object},modules:{type:Object},hubMode:{type:Boolean,attribute:"hub-mode"},_view:{state:!0},_cursor:{state:!0},_sel:{state:!0},_events:{state:!0},_settings:{state:!0},_people:{state:!0},_me:{state:!0},_acting:{state:!0},_who:{state:!0},_wide:{state:!0},_pos:{state:!0},_choreViews:{state:!0},_faceSide:{state:!0},_sheet:{state:!0},_draft:{state:!0},_toast:{state:!0},_loaded:{state:!0},_pin:{state:!0}};constructor(){super(),this._view="month",this._cursor=s(),this._sel=s(),this._events=[],this._settings={ha_calendars:[],show_chores:!0},this._people=[],this._me=null,this._acting=null,this._who="all",this._wide=!1,this._pos=(()=>{try{return localStorage.getItem(S)||"right"}catch{return"right"}})(),this._choreViews=(()=>{try{const e=JSON.parse(localStorage.getItem(D)||"null");if(Array.isArray(e))return e}catch{}return["day","week","agenda","month"]})(),this._faceSide=(()=>{try{return"right"===localStorage.getItem(R)?"right":"left"}catch{return"left"}})(),this._sheet=null,this._draft=null,this._toast=null,this._loaded=!1,this._pin="",this._initDone=!1,this._key=""}setHubView(e){this._view=e,this._sheet=null,this.dispatchEvent(new CustomEvent("module-view-changed",{detail:{view:e},bubbles:!0,composed:!0})),"settings"!==e&&this._loadRange()}openAdd(e="event"){"settings"===this._view&&this.setHubView("month");const t="month"===this._view?this._sel:this._cursor,i={event:{},reminders:{category:"reminder",emoji:"🔔",all_day:!1,start_time:`${m(Math.min((new Date).getHours()+1,23))}:00`,remind:0},birthdays:{category:"birthday",emoji:"🎂",all_day:!0,repeat:{type:"yearly"}}}[e]||{};this._startEvent(A(t,i))}connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(e=>{const t=e[0]?.contentRect?.width??0;t&&(this._wide=t>=700)}),this._ro.observe(this),this._vis=()=>{!document.hidden&&this._initDone&&this._loadRange(!0)},document.addEventListener("visibilitychange",this._vis),this._tick=setInterval(()=>{this._today!==s()&&(this._today=s(),this.requestUpdate())},6e4),this._today=s()}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),clearInterval(this._tick),document.removeEventListener("visibilitychange",this._vis),this._unsub?.(),this._unsub=null,this._initDone=!1}updated(e){e.has("hass")&&this.hass&&!this._initDone&&(this._initDone=!0,this._init());const t=this.renderRoot.querySelector(".sheet");t&&!t._swipe&&(t._swipe=!0,n(t,()=>this._closeSheet()))}async _init(){await this._loadPeople(),await this._loadRange(!0),this._loaded=!0;try{this._unsub=await this.hass.connection.subscribeMessage(()=>this._scheduleLoad(),{type:"ksh_calendar/subscribe"})}catch{}}async _loadPeople(){try{const e=await o(this.hass);this._people=e.people,this._me=e.me,this._acting=r(this.hass,this._people,this._me)}catch{}}_scheduleLoad(){clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._loadRange(!0),250)}get _actor(){return this._people.find(e=>e.id===this._acting)||null}get _isAdult(){return this._actor?"adult"===this._actor.role:!!this.hass?.user?.is_admin}_person(e){return this._people.find(t=>t.id===e)}_range(){const e=g(this._cursor);if("week"===this._view){const t=_(e);return[b(t),b(v(t,6))]}if("day"===this._view)return[this._cursor,this._cursor];if("agenda"===this._view)return[s(),b(v(g(s()),44))];const t=_(new Date(e.getFullYear(),e.getMonth(),1));return[b(t),b(v(t,41))]}async _loadRange(e=!1){if("settings"===this._view&&!e)return;const[t,i]=this._range(),a=`${t}|${i}|${this._acting}`;if(e||a!==this._key){this._key=a;try{const e=await f(this.hass,t,i,{acting:this._actor,modules:this.modules,msg:l(this.hass,this._acting)});if(a!==this._key)return;this._events=e.events,this._settings=e.settings}catch(e){this._say(e?.message||"Could not load the calendar")}this._loaded=!0}}async _call(e,t={}){const i={type:`ksh_calendar/${e}`,...t,...l(this.hass,this._acting)};try{return await this.hass.callWS(i)}catch(e){return"pin_required"===e?.code&&this._actor?.has_pin&&(this._sheet={type:"pin"},this._pin=""),this._say(e?.message||"That did not work"),null}finally{this._loadRange(!0)}}_say(e){this._toast=e,clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toast=null},3500)}async _checkPin(){try{const e=await this.hass.callWS({type:"ksh_family_hub/people/verify_pin",person_id:this._acting,pin:this._pin});if(!e.ok)return this._pin="",void this._say("Wrong PIN");d(this.hass,e.token),this._closeSheet(),this._loadRange(!0)}catch(e){this._pin="",this._say(e?.message||"Could not check the PIN")}}_go(e){const t=g(this._cursor);let i;i="month"===this._view?new Date(t.getFullYear(),t.getMonth()+e,1):"week"===this._view?v(t,7*e):v(t,e),this._cursor=b(i),"month"===this._view&&(this._sel=b(i)),this._loadRange()}_goToday(){this._cursor=s(),this._sel=s(),this._loadRange()}_openDay(e){this._cursor=e,this._sel=e,this.setHubView("day")}_period(){const e=this.hass.locale?.language||void 0,t=g(this._cursor);if("month"===this._view)return t.toLocaleDateString(e,{month:"long",year:"numeric"});if("week"===this._view){const i=_(t),a=v(i,6);return`${i.toLocaleDateString(e,{day:"numeric",month:i.getMonth()===a.getMonth()?void 0:"short"})} – ${a.toLocaleDateString(e,{day:"numeric",month:"short"})}`}return"day"===this._view?t.toLocaleDateString(e,{weekday:"long",day:"numeric",month:"long"}):"Coming up"}_dayLabel(e,t={weekday:"long",day:"numeric",month:"long"}){return g(e).toLocaleDateString(this.hass.locale?.language||void 0,t)}_shown(){const e=this._who;return this._events.filter(t=>"all"===e||"ha"===t.kind||!(t.people||[]).length||t.people.includes(e))}_onDay(e,t=this._shown()){return t.filter(t=>t.date===e)}_forView(e,t){return this._choreViews.includes(t)?e:e.filter(e=>"chore"!==e.kind)}_setFaceSide(e){this._faceSide=e;try{localStorage.setItem(R,e)}catch{}}_setChoreView(e,t){this._choreViews=t?[...new Set([...this._choreViews,e])]:this._choreViews.filter(t=>t!==e);try{localStorage.setItem(D,JSON.stringify(this._choreViews))}catch{}}_canDoChore(e){if(e.status&&"open"!==e.status&&"rejected"!==e.status)return!1;const t=this._actor;return t?"adult"===t.role||((e.people||[]).length?e.people.includes(t.id):"child"===t.role):!!this.hass?.user?.is_admin}async _tickChore(e){const t={type:"ksh_chores/complete",chore_id:e.key.split(":")[1],date:e.date,...l(this.hass,this._acting)};try{const i=await this.hass.callWS(t);h(this,i?.celebration),this._say(i?.awarded?`+${e.points} ★  ${e.title}`:"Done. Waiting for an adult to approve.")}catch(e){"pin_required"===e?.code&&this._actor?.has_pin&&(this._sheet={type:"pin"},this._pin=""),this._say(e?.message||"That did not work")}this._loadRange(!0)}_startEvent(e,t=null){this._isAdult?(this._draft=e,this._sheet={type:"edit",id:t}):this._say("Only an adult can add or change events")}_editEvent(e){const t=e.repeat||{type:"none"};this._startEvent(A(e.date,{title:e.title,emoji:e.emoji,category:e.category,people:[...e.people||[]],date:e.date,end_date:e.end_date||"",all_day:!!e.all_day,start_time:e.start_time||"09:00",end_time:e.end_time||"",repeat:{...t},location:e.location||"",notes:e.notes||"",remind:e.remind??null}),e.event_id)}_set(e,t){this._draft={...this._draft,[e]:t}}_setRep(e){this._draft={...this._draft,repeat:{...this._draft.repeat,...e}}}_pickCategory(e){const t=x(this._draft.category),i=this._draft.emoji!==t.emoji&&"📌"!==this._draft.emoji;this._draft={...this._draft,category:e.id,emoji:i?this._draft.emoji:e.emoji},"birthday"===e.id&&"none"===this._draft.repeat.type&&this._setRep({type:"yearly"})}_repeatKind(e){return"custom"===e.type&&"month"===e.unit&&1===e.every?"monthly":e.type||"none"}_setRepeatKind(e){const t=this._draft.repeat.until,i=this._draft.repeat.days,a={none:{type:"none"},daily:{type:"daily"},yearly:{type:"yearly"},weekly:{type:"weekly",days:i||[(g(this._draft.date).getDay()+6)%7]},monthly:{type:"custom",every:1,unit:"month"},custom:{type:"custom",every:2,unit:"week",days:i||[(g(this._draft.date).getDay()+6)%7]}}[e];this._draft={...this._draft,repeat:"none"===e?a:{...a,...t?{until:t}:{}}}}async _saveEvent(){const e=this._draft;if(!e.title.trim())return void this._say("Give it a title");if(!e.all_day&&!e.start_time)return void this._say("Pick a start time, or make it an all day event");const t={...e.repeat};t.until||delete t.until,"weekly"!==t.type&&("custom"!==t.type||"week"!==t.unit)||(t.days||[]).length||(t.days=[(g(e.date).getDay()+6)%7]);const i={title:e.title.trim(),emoji:e.emoji,category:e.category,people:e.people,date:e.date,end_date:"none"===t.type&&e.end_date&&e.end_date>e.date?e.end_date:null,all_day:e.all_day,start_time:e.all_day?null:e.start_time,end_time:e.all_day?null:e.end_time||null,repeat:t,location:e.location,notes:e.notes,remind:e.remind},a=this._sheet?.id;await this._call(a?"events/update":"events/add",a?{event_id:a,...i}:i)&&(this._sel=e.date,this._cursor=e.date,this._closeSheet())}async _deleteEvent(){const e="none"!==this._draft.repeat?.type;if(!confirm(e?`Delete “${this._draft.title}”? Every repeat of it is removed.`:`Delete “${this._draft.title}”?`))return;await this._call("events/delete",{event_id:this._sheet.id})&&this._closeSheet()}_closeSheet(){this._sheet=null,this._draft=null,this._pin=""}_open(e){"event"===e.kind&&this._isAdult?this._editEvent(e):this._sheet={type:"detail",event:e}}_setPos(e){this._pos=e;try{localStorage.setItem(S,e)}catch{}}get _haCalendars(){return Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("calendar.")).map(e=>({id:e,name:this.hass.states[e].attributes?.friendly_name||e})).sort((e,t)=>e.name.localeCompare(t.name))}async _toggleHa(e,t){const i=this._settings.ha_calendars||[],a=t?[...new Set([...i,e])]:i.filter(t=>t!==e);this._settings={...this._settings,ha_calendars:a},await this._call("settings/set",{ha_calendars:a})}async _toggleChores(e){this._settings={...this._settings,show_chores:e},await this._call("settings/set",{show_chores:e})}render(){return this._loaded||this._events.length?t`
      <div class="scroll">
        <div class="page v-${this._view}">
          ${"settings"===this._view?this._settingsView():t`
            ${this._toolbar()}
            ${"month"===this._view?this._month():i}
            ${"week"===this._view?this._week():i}
            ${"day"===this._view?this._dayView():i}
            ${"agenda"===this._view?this._agenda():i}`}
        </div>
      </div>
      ${this._sheet?this._renderSheet():i}
      ${this._toast?t`<div class="toast" role="status">${this._toast}</div>`:i}`:t`<div class="center"><div class="spinner"></div></div>`}_toolbar(){const e=this._people.filter(e=>"guest"!==e.role);return t`
      <h2 class="period" aria-live="polite">${this._period()}</h2>
      <div class="toolbar">
        ${"agenda"!==this._view?t`
          <button class="nav" aria-label="Previous" @click=${()=>this._go(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
          <button class="nav" aria-label="Next" @click=${()=>this._go(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
          <button class="today" @click=${()=>this._goToday()}>Today</button>`:i}
        <span class="grow"></span>
        ${this._isAdult?t`<button class="add" @click=${()=>this.openAdd("event")}><ha-icon icon="mdi:plus"></ha-icon><span>Add</span></button>`:i}
      </div>
      ${e.length>1?t`
        <div class="chips" role="radiogroup" aria-label="Show events for">
          <button class="chip ${"all"===this._who?"on":""}" @click=${()=>{this._who="all"}}>Everyone</button>
          ${e.map(e=>t`<button class="chip ${this._who===e.id?"on":""}" @click=${()=>{this._who=e.id}}>${c(this.hass,e,22)}${e.name}</button>`)}
        </div>`:i}`}_face(e){return t`<span class="face" style="--p:${e.color}" title=${e.name}>${p(this.hass,e)}</span>`}_avatars(e){const a=(e.people||[]).map(e=>this._person(e)).filter(Boolean);return a.length?t`<span class="faces" aria-label=${a.map(e=>e.name).join(", ")}>${a.map(e=>this._face(e))}</span>`:"ha"===e.kind?i:t`<span class="faces everyone" title="Everyone"><ha-icon icon="mdi:account-group-outline"></ha-icon></span>`}_stripe(e){const t=(e.people||[]).map(e=>this._person(e)?.color).filter(Boolean);if(!t.length)return`--bar:${e.color};--who:${e.color}`;const i=100/t.length;return`--bar:${1===t.length?t[0]:`linear-gradient(to bottom, ${t.map((e,t)=>`${e} ${t*i}% ${(t+1)*i}%`).join(", ")})`};--who:${t[0]}`}_eventRow(e,{tick:a=!1,noTick:s=!1}={}){const n="chore"===e.kind&&["done","approved"].includes(e.status);if(a&&"chore"===e.kind){const i=this._canDoChore(e);return t`
        <div class="tickrow">
          ${this._eventRow(e,{noTick:!0})}
          ${n?t`<span class="check done" aria-label="Done"><ha-icon icon="mdi:check"></ha-icon></span>`:t`<button class="check" ?disabled=${!i} aria-label="Mark ${e.title} as done" title=${i?"Done":"Not for you"}
                @click=${()=>this._tickChore(e)}><ha-icon icon="mdi:check"></ha-icon></button>`}
        </div>`}return t`
      <button class="ev ${e.kind} ${n?"finished":""} face-${this._faceSide}" style="--c:${e.color};${this._stripe(e)}" @click=${()=>this._open(e)}>
        <span class="bar"></span>
        ${"left"===this._faceSide?this._avatars(e):i}
        <span class="em">${e.emoji}</span>
        <span class="txt"><b>${e.title}</b>
          <small>${y(e)}${"chore"===e.kind?" · chore":""}${e.location?` · ${e.location}`:""}${e.calendar?` · ${e.calendar}`:""}</small></span>
        ${"right"===this._faceSide?this._avatars(e):i}
        ${n&&!s?t`<ha-icon class="tick" icon="mdi:check-circle"></ha-icon>`:i}
      </button>`}_dayList(e,i){const a=this._onDay(e,i);return a.length?t`<div class="evlist">${a.map(e=>this._eventRow(e))}</div>`:t`<p class="none">Nothing planned.</p>`}_month(){const e=g(this._cursor),a=_(new Date(e.getFullYear(),e.getMonth(),1)),n=Array.from({length:42},(e,t)=>v(a,t)),o=n[35].getMonth()!==e.getMonth()&&n[28].getMonth()!==e.getMonth()?5:6,r=this._shown(),l=this._wide?this._pos:"top"===this._pos?"top":"bottom",d=s(),h={};for(const e of r)(h[e.date]||=[]).push(e);return t`
      <div class="monthwrap pos-${l}">
        <div class="grid" style="--rows:${o}">
          ${j.map(e=>t`<div class="dow">${this._wide?e:e[0]}</div>`)}
          ${n.slice(0,7*o).map(a=>{const s=b(a),n=this._forView(h[s]||[],"month"),o=n.filter(e=>"chore"!==e.kind),r=n.filter(e=>"chore"===e.kind),l=a.getMonth()!==e.getMonth();return t`
              <button class="cell ${l?"other":""} ${s===d?"today":""} ${s===this._sel?"sel":""}"
                aria-label=${this._dayLabel(s)} aria-pressed=${s===this._sel?"true":"false"}
                @click=${()=>{this._sel=s}} @dblclick=${()=>this._openDay(s)}>
                <span class="num">${a.getDate()}</span>
                ${this._wide?t`
                  <span class="chipcol">${o.slice(0,2).map(e=>t`<span class="mini" style="--c:${e.color}">${e.emoji} ${e.title}</span>`)}
                    ${o.length>2?t`<span class="more">+${o.length-2} more</span>`:i}
                    ${r.length?t`<span class="mini chore" style="--c:#3db6cc" title="${r.length} chore${1===r.length?"":"s"}">✅ ${r.length}</span>`:i}</span>`:t`<span class="emo">${o.slice(0,2).map(e=>t`<span style="--c:${e.color}">${e.emoji}</span>`)}${r.length?t`<span class="cn" title="${r.length} chore${1===r.length?"":"s"}">✓${r.length}</span>`:i}${o.length>2?t`<span class="cn">+${o.length-2}</span>`:i}</span>`}
              </button>`})}
        </div>
        <aside class="daycard" aria-label="Selected day">
          <div class="dchead">
            <h3>${this._dayLabel(this._sel)}</h3>
            <span class="grow"></span>
            <button class="mini-btn" @click=${()=>this._openDay(this._sel)}>Day</button>
            ${this._isAdult?t`<button class="mini-btn on" aria-label="Add an event" @click=${()=>this.openAdd("event")}><ha-icon icon="mdi:plus"></ha-icon></button>`:i}
          </div>
          ${this._dayList(this._sel,r)}
        </aside>
      </div>`}_week(){const e=_(g(this._cursor)),i=this._forView(this._shown(),"week"),a=s();return t`
      <div class="week">
        ${Array.from({length:7},(s,n)=>{const o=v(e,n),r=b(o);return t`
            <section class="wday ${r===a?"today":""}">
              <button class="wh" @click=${()=>this._openDay(r)}>
                <span>${this._dayLabel(r,{weekday:"short"})}</span><b>${o.getDate()}</b>
              </button>
              ${this._dayList(r,i)}
            </section>`})}
      </div>`}_dayView(){const e=this._forView(this._onDay(this._cursor,this._shown()),"day"),a=e.filter(e=>e.all_day&&"chore"!==e.kind),s=e.filter(e=>!e.all_day),n=e.filter(e=>"chore"===e.kind&&e.all_day),o=e.filter(e=>"chore"===e.kind&&["open","rejected"].includes(e.status)).length;return t`
      <div class="dayview">
        ${e.length?i:t`<div class="empty"><span>🗓️</span><p>Nothing planned for this day.</p>
          ${this._isAdult?t`<button class="primary" @click=${()=>this.openAdd("event")}>Add something</button>`:i}</div>`}
        ${a.length?t`<h3>All day</h3><div class="evlist">${a.map(e=>this._eventRow(e))}</div>`:i}
        ${s.length?t`<h3>Timetable</h3>
          <div class="timeline">${s.map(e=>t`
            <div class="trow"><span class="t">${e.start_time}</span>${this._eventRow(e,{tick:!0})}</div>`)}</div>`:i}
        ${n.length?t`<h3>Chores${o?t` <span class="count">${o} to do</span>`:i}</h3>
          <div class="evlist">${n.map(e=>this._eventRow(e,{tick:!0}))}</div>`:i}
        ${!this._choreViews.includes("day")&&this._settings.show_chores&&this.modules?.chores?t`<p class="muted">Chores are switched off for this view. Turn them on under Calendar settings.</p>`:i}
      </div>`}_agenda(){const e=this._forView(this._shown(),"agenda"),i=[...new Set(e.map(e=>e.date))].sort();return t`
      <div class="dayview">
        ${i.length?i.map(i=>t`
          <h3>${i===s()?"Today":this._dayLabel(i,{weekday:"long",day:"numeric",month:"short"})}</h3>
          <div class="evlist">${this._onDay(i,e).map(e=>this._eventRow(e))}</div>`):t`<div class="empty"><span>🗓️</span><p>Nothing coming up in the next six weeks.</p></div>`}
      </div>`}_settingsView(){const e=this._haCalendars,a=this._settings.ha_calendars||[];return t`
      <div class="pair ${this._wide?"wide":""}">
      <div>
      <h3>Month view</h3>
      <div class="card pad">
        <label class="lbl">Where the day card goes (this device)</label>
        <div class="seg">${z.map(([e,i])=>t`<button class="${this._pos===e?"on":""}" @click=${()=>this._setPos(e)}>${i}</button>`)}</div>
        <p class="muted">The card next to the month lists the chores and events of the day you tap. On a narrow phone it sits below (or above) the month.</p>
      </div>
      </div>

      <div>
      <h3>Who it belongs to</h3>
      <div class="card pad">
        <label class="lbl">Side of each card for the faces (this device)</label>
        <div class="seg">${[["left","Left"],["right","Right"]].map(([e,i])=>t`<button class="${this._faceSide===e?"on":""}" @click=${()=>this._setFaceSide(e)}>${i}</button>`)}</div>
        <p class="muted">Each event and chore shows the face (picture or emoji) of the people it is for, in their colour. The coloured stripe always stays on the left edge.</p>
      </div>
      </div>
      </div>

      <h3>Show in the calendar</h3>
      <div class="card">
        ${this.modules?.chores?t`
          <button class="switchrow" role="switch" aria-checked=${this._settings.show_chores?"true":"false"} ?disabled=${!this._isAdult}
            @click=${()=>this._toggleChores(!this._settings.show_chores)}>
            <span class="swtxt"><b>Chores</b><small>Chores on the days they are due. An adult turns this on or off for everyone.</small></span>
            <span class="switch ${this._settings.show_chores?"on":""}"><i></i></span></button>`:i}
        ${this.modules?.chores&&this._settings.show_chores?t`
          <div class="switchrow static col">
            <span class="swtxt"><b>Show chores in these views</b><small>Just on this device. The Day view is a quick look at today and lets you tick chores off.</small></span>
            <div class="chips">${C.map(([e,i])=>t`
              <button class="chip ${this._choreViews.includes(e)?"on":""}" aria-pressed=${this._choreViews.includes(e)?"true":"false"}
                @click=${()=>this._setChoreView(e,!this._choreViews.includes(e))}>${i}</button>`)}</div>
          </div>`:i}
        <div class="switchrow static"><span class="swtxt"><b>Family events</b><small>School, sport, appointments, reminders and birthdays added here</small></span><span class="pill">Always</span></div>
      </div>

      <h3>Home Assistant calendars</h3>
      <div class="card">
        ${e.length?e.map(e=>{const i=a.includes(e.id);return t`
            <button class="switchrow" role="switch" aria-checked=${i?"true":"false"} ?disabled=${!this._isAdult} @click=${()=>this._toggleHa(e.id,!i)}>
              <span class="swtxt"><b>${e.name}</b><small>${e.id}</small></span><span class="switch ${i?"on":""}"><i></i></span></button>`}):t`<p class="muted pad">No calendars found in Home Assistant yet.</p>`}
      </div>
      <p class="muted">${this._isAdult?"Calendars you switch on appear next to the family events, read only.":"Only an adult can choose which calendars are shown."}
        To add more (Google, a school calendar link, a local calendar) set them up in Home Assistant under
        <i>Settings → Devices & services → Add integration</i>; they show up in this list.</p>

      <h3>Event types</h3>
      <div class="card pad legend">${w.map(e=>t`<span class="lg" style="--c:${e.color}"><i></i>${e.emoji} ${e.label}</span>`)}
        <span class="lg" style="--c:#3db6cc"><i></i>✅ Chore</span><span class="lg" style="--c:#7fa6c0"><i></i>🗓️ Home Assistant</span></div>`}_renderSheet(){const e=this._sheet.type;return t`
      <div class="scrim" @click=${()=>this._closeSheet()}></div>
      <section class="sheet" role="dialog" aria-label=${e}>
        <div class="grabber"></div>
        ${"edit"===e?this._editSheet():i}
        ${"detail"===e?this._detailSheet():i}
        ${"pin"===e?this._pinSheet():i}
      </section>`}_title(e){return t`<div class="head2"><h2>${e}</h2></div>`}_pinSheet(){const e=this._actor;return t`${this._title(`${e?.name||"Your"} PIN`)}
      <form class="form" @submit=${e=>{e.preventDefault(),this._checkPin()}}>
        <input class="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" autofocus
          .value=${this._pin} @input=${e=>{this._pin=e.target.value.replace(/\D/g,"")}}>
        <button class="primary" type="submit" ?disabled=${4!==this._pin.length}>Continue</button>
      </form>`}_detailSheet(){const e=this._sheet.event,a=(e.people||[]).map(e=>this._person(e)).filter(Boolean);return t`
      <div class="detail" style="--c:${e.color}">
        <div class="dh"><span class="em big">${e.emoji}</span>
          <div><h2>${e.title}</h2><p class="muted">${this._dayLabel(e.date)}</p></div></div>
        <div class="facts">
          <div><ha-icon icon="mdi:clock-outline"></ha-icon>${y(e)}</div>
          ${e.location?t`<div><ha-icon icon="mdi:map-marker-outline"></ha-icon>${e.location}</div>`:i}
          ${a.length?t`<div><ha-icon icon="mdi:account-multiple-outline"></ha-icon>${a.map(e=>e.name).join(", ")}</div>`:i}
          ${e.calendar?t`<div><ha-icon icon="mdi:calendar-sync-outline"></ha-icon>${e.calendar}</div>`:i}
          ${"chore"===e.kind?t`<div><ha-icon icon="mdi:check-circle-outline"></ha-icon>Chore${e.points?` · +${e.points} ★`:""}${e.status&&"open"!==e.status?` · ${"approved"===e.status?"done":e.status}`:""}</div>`:i}
          ${e.notes?t`<div class="notes"><ha-icon icon="mdi:text"></ha-icon>${e.notes}</div>`:i}
        </div>
        ${"chore"===e.kind?t`<button class="primary" @click=${()=>{this._closeSheet(),this.dispatchEvent(new CustomEvent("hub-navigate",{detail:{id:"chores"},bubbles:!0,composed:!0}))}}>Open chores</button>`:i}
        ${"ha"===e.kind?t`<p class="muted">This comes from a Home Assistant calendar, so it is changed there.</p>`:i}
      </div>`}_chips(e,i,a){return t`<div class="chips">
      <button type="button" class="chip ${e.length?"":"on"}" @click=${a}>Everyone</button>
      ${this._people.filter(e=>"guest"!==e.role||!0).map(a=>t`<button type="button" class="chip ${e.includes(a.id)?"on":""}" @click=${()=>i(a.id)}>${c(this.hass,a,22)}${a.name}</button>`)}
    </div>`}_editSheet(){const e=this._draft,a=!!this._sheet.id,s=this._repeatKind(e.repeat),n=e.repeat,o="weekly"===s||"custom"===s&&"week"===n.unit;return t`${this._title(a?"Edit event":"New event")}
      <div class="form">
        <label>Title<input .value=${e.title} maxlength="80" placeholder="e.g. Swimming lessons" @input=${e=>this._set("title",e.target.value)}></label>

        <label>Type</label>
        <div class="chips">${w.map(i=>t`
          <button type="button" class="chip ${e.category===i.id?"on":""}" @click=${()=>this._pickCategory(i)}>${i.emoji} ${i.label}</button>`)}</div>

        <label>Picture</label>
        <ksh-emoji-picker .value=${e.emoji} .quick=${$} @emoji-pick=${e=>this._set("emoji",e.detail.emoji)}></ksh-emoji-picker>

        <label>Who is it for</label>
        ${this._chips(e.people,t=>this._set("people",e.people.includes(t)?e.people.filter(e=>e!==t):[...e.people,t]),()=>this._set("people",[]))}

        <button type="button" class="switchrow" role="switch" aria-checked=${e.all_day?"true":"false"} @click=${()=>this._set("all_day",!e.all_day)}>
          <span>All day</span><span class="switch ${e.all_day?"on":""}"><i></i></span></button>

        <label>${"none"===s&&e.all_day?"Starts":"Date"}<input type="date" .value=${e.date} @input=${e=>this._set("date",e.target.value)}></label>
        ${"none"===s&&e.all_day?t`
          <label>Ends <small class="hint inl">(optional, for a trip or camp)</small>
            <input type="date" .value=${e.end_date||""} min=${e.date} @input=${e=>this._set("end_date",e.target.value)}></label>`:i}
        ${e.all_day?i:t`
          <div class="two">
            <label>From<input type="time" .value=${e.start_time} @input=${e=>this._set("start_time",e.target.value)}></label>
            <label>To <small class="hint inl">(optional)</small><input type="time" .value=${e.end_time} @input=${e=>this._set("end_time",e.target.value)}></label>
          </div>`}

        <label>Repeats
          <select @change=${e=>this._setRepeatKind(e.target.value)}>
            ${[["none","Doesn't repeat"],["daily","Every day"],["weekly","Every week"],["monthly","Every month"],["yearly","Every year"],["custom","Custom"]].map(([e,i])=>t`<option value=${e} ?selected=${s===e}>${i}</option>`)}
          </select></label>
        ${"custom"===s?t`
          <div class="every">Every
            <input type="number" min="1" max="365" .value=${String(n.every||1)} @input=${e=>this._setRep({every:Number(e.target.value)||1})}>
            <select @change=${e=>this._setRep({unit:e.target.value})}>
              ${[["day","days"],["week","weeks"],["month","months"]].map(([e,i])=>t`<option value=${e} ?selected=${n.unit===e}>${i}</option>`)}
            </select></div>`:i}
        ${o?t`
          <div class="chips">${j.map((e,i)=>t`
            <button type="button" class="chip ${(n.days||[]).includes(i)?"on":""}"
              @click=${()=>this._setRep({days:(n.days||[]).includes(i)?n.days.filter(e=>e!==i):[...n.days||[],i].sort()})}>${e}</button>`)}</div>`:i}
        ${"none"!==s?t`
          <label>Repeats until <small class="hint inl">(optional, like the end of the term)</small>
            <input type="date" .value=${n.until||""} min=${e.date} @input=${e=>this._setRep({until:e.target.value})}></label>`:i}

        <label>Location <small class="hint inl">(optional)</small><input .value=${e.location} maxlength="100" @input=${e=>this._set("location",e.target.value)}></label>
        <label>Notes <small class="hint inl">(optional)</small><input .value=${e.notes} maxlength="300" placeholder="What to bring" @input=${e=>this._set("notes",e.target.value)}></label>

        <label>Remind
          <select @change=${e=>this._set("remind",""===e.target.value?null:Number(e.target.value))}>
            ${k.map(i=>t`<option value=${i.value??""} ?selected=${e.remind===i.value}>${i.label}</option>`)}
          </select></label>
        ${null!==e.remind?t`<small class="hint">${e.all_day?"An all day event reminds you at 8am.":"Goes to the phone set for each person, otherwise it shows in Home Assistant's notifications."}</small>`:i}
        ${"none"!==s&&a?t`<small class="hint">Changes apply to every repeat of this event.</small>`:i}

        <div class="actions">
          ${a?t`<button class="danger" @click=${()=>this._deleteEvent()}>Delete</button>`:i}
          <button class="primary grow" @click=${()=>this._saveEvent()}>Save event</button>
        </div>
      </div>`}static styles=[u,a`
    :host { display: block; position: relative; overflow: hidden; color: var(--hub-text); --cal: var(--hub-accent); }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    button { cursor: pointer; }
    button[disabled] { cursor: default; opacity: .55; }
    .scroll { height: 100%; overflow-y: auto; }
    .page { max-width: 1100px; margin: 0 auto; padding: 4px 14px 28px; }
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border); border-top-color: var(--cal); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .muted { color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; margin: 8px 2px; }
    .pad { padding: 14px 16px; }
    h3 { margin: 16px 4px 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .grow { flex: 1; }

    .toolbar { display: flex; align-items: center; gap: 8px; margin: 6px 0 8px; }
    .period { margin: 8px 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -.01em; }
    .nav { width: 38px; height: 38px; border-radius: 50%; flex: none; border: 1px solid var(--hub-border); background: var(--hub-surface); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 22px; }
    .today { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 7px 14px; font-weight: 700; font-size: 13px; }
    .add, .primary { border: none; background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 9px 16px; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; justify-content: center; --mdc-icon-size: 20px; }
    @media (max-width: 420px) { .add span { display: none; } .add { padding: 9px 11px; } .period { font-size: 22px; } }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    /* month */
    .monthwrap { display: flex; gap: 12px; align-items: flex-start; }
    .monthwrap.pos-right { flex-direction: row; }
    .monthwrap.pos-left { flex-direction: row-reverse; }
    .monthwrap.pos-bottom { flex-direction: column; }
    .monthwrap.pos-top { flex-direction: column-reverse; }
    .monthwrap.pos-right .grid, .monthwrap.pos-left .grid { flex: 1; min-width: 0; }
    .monthwrap.pos-right .daycard, .monthwrap.pos-left .daycard { width: 320px; flex: none; position: sticky; top: 4px; }
    .monthwrap.pos-bottom .grid, .monthwrap.pos-top .grid, .monthwrap.pos-bottom .daycard, .monthwrap.pos-top .daycard { width: 100%; }
    .grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
    .dow { text-align: center; font-size: 11.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--hub-muted); padding: 4px 0; }
    .cell { min-height: 54px; border-radius: 12px; border: 1px solid var(--hub-border); background: var(--hub-surface); padding: 5px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: left; overflow: hidden; }
    .pos-right .cell, .pos-left .cell { min-height: 92px; align-items: stretch; padding: 6px; }
    .cell.other { opacity: .45; }
    .cell.today .num { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .cell.sel { border-color: var(--cal); box-shadow: 0 0 0 2px color-mix(in srgb, var(--cal) 45%, transparent); }
    .num { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex: none; }
    .emo { display: flex; gap: 1px 2px; flex-wrap: wrap; justify-content: center; font-size: 12px; line-height: 1.15; min-height: 14px; }
    .emo > span { border-bottom: 2px solid var(--c, transparent); }
    .emo .cn { font-size: 10px; font-weight: 800; color: var(--hub-muted); border: none; }
    .dots { display: flex; gap: 3px; flex-wrap: wrap; justify-content: center; min-height: 7px; }
    .dots i { width: 7px; height: 7px; border-radius: 50%; display: block; }
    .dots i.ch { background: transparent; border: 1.5px solid var(--hub-accent-2); }
    .mini.chore { background: transparent; border-left-style: dashed; color: var(--hub-muted); }
    .chipcol { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .mini { display: block; background: color-mix(in srgb, var(--c) 24%, transparent); border-left: 3px solid var(--c); border-radius: 5px; padding: 1px 5px; font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .more { font-size: 11px; color: var(--hub-muted); font-weight: 700; padding-left: 4px; }
    .daycard { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; padding: 12px; }
    .dchead { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
    .dchead h3 { margin: 0 4px; font-size: 15px; text-transform: none; letter-spacing: 0; color: var(--hub-text); font-weight: 800; }
    .mini-btn { border: 1px solid var(--hub-border); background: var(--hub-surface-2); border-radius: 999px; padding: 5px 12px; font-weight: 700; font-size: 12.5px; display: inline-flex; align-items: center; --mdc-icon-size: 18px; }
    .mini-btn.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .none { color: var(--hub-muted); font-size: 13.5px; margin: 8px 4px; }

    /* events */
    .evlist { display: grid; gap: 6px; }
    .ev { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; border: 1px solid var(--hub-border); border-radius: 14px; padding: 8px 10px 8px 0; background: var(--hub-surface-2); overflow: hidden; }
    .ev .bar { align-self: stretch; width: 6px; background: var(--bar, var(--c)); flex: none; border-radius: 0 3px 3px 0; }
    .ev .em { font-size: 21px; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; flex: none; border-radius: 11px; background: color-mix(in srgb, var(--c) 20%, transparent); }
    .ev .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ev b { font-size: 14.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; }
    .ev small { color: var(--hub-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .faces { display: inline-flex; flex: none; padding-left: 8px; }
    .ev.face-left .faces { padding-left: 0; margin-left: 8px; margin-right: 4px; }
    .ev.face-left .faces.everyone { margin-left: 4px; }
    .face { width: 30px; height: 30px; border-radius: 50%; margin-left: -8px; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; overflow: hidden;
      background: color-mix(in srgb, var(--p) 30%, var(--hub-surface-2)); border: 2px solid var(--p); box-shadow: 0 0 0 2px var(--hub-surface-2); }
    .face img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .faces.everyone { color: var(--hub-muted); align-items: center; --mdc-icon-size: 22px; padding-left: 0; }
    .ev.finished b { text-decoration: line-through; opacity: .6; }
    .ev .tick { color: #4fd1a1; --mdc-icon-size: 20px; flex: none; }
    .ev.chore { background: transparent; border-style: dashed; }
    .tickrow { display: flex; align-items: center; gap: 8px; } .tickrow .ev { flex: 1; min-width: 0; }
    .check { width: 42px; height: 42px; border-radius: 50%; flex: none; border: 2px solid var(--hub-muted); background: transparent; color: var(--hub-muted); display: flex; align-items: center; justify-content: center; --mdc-icon-size: 22px; }
    .check:hover:not([disabled]) { background: var(--hub-accent-2); border-color: var(--hub-accent-2); color: var(--hub-accent-2-ink); }
    .check.done { background: #4fd1a1; border-color: #4fd1a1; color: #06222a; }
    .count { background: var(--hub-accent); color: var(--hub-accent-ink); border-radius: 999px; padding: 1px 8px; font-size: 11px; text-transform: none; letter-spacing: 0; margin-left: 6px; }
    .switchrow.col { flex-direction: column; align-items: stretch; gap: 6px; }
    .switchrow.col .chips { margin: 2px 0 0; }

    /* week, day, agenda */
    .week { display: grid; grid-template-columns: 1fr; gap: 10px; }
    @media (min-width: 700px) { .week { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; align-items: start; } }
    .wday { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 18px; padding: 8px; min-width: 0; }
    .wday.today { border-color: var(--cal); }
    .wh { display: flex; align-items: baseline; gap: 8px; background: none; border: none; padding: 2px 4px 8px; width: 100%; font-weight: 700; color: var(--hub-muted); }
    .wh b { font-size: 20px; color: var(--hub-text); }
    .wday.today .wh b { color: var(--cal); }
    @media (min-width: 700px) {
      .wday .ev { flex-wrap: wrap; gap: 2px 6px; padding: 6px 8px; border-left: 4px solid var(--who, var(--c)); align-items: center; }
      .wday .ev .bar { display: none; }
      .wday .ev .em { width: auto; font-size: 18px; }
      .wday .ev .txt { flex-basis: 100%; order: 3; }
      .wday .ev.face-right .faces, .wday .ev .tick { margin-left: auto; }
      .wday .ev b { white-space: normal; font-size: 13.5px; }
      .wday .ev small { white-space: normal; }
    }
    .dayview { max-width: 640px; margin: 0 auto; }
    .timeline { display: grid; gap: 8px; }
    .trow { display: grid; grid-template-columns: 52px 1fr; gap: 8px; align-items: center; }
    .trow .t { font-weight: 800; color: var(--hub-muted); font-size: 13.5px; text-align: right; }
    .empty { text-align: center; padding: 30px 10px; color: var(--hub-muted); } .empty span { font-size: 44px; }

    /* settings */
    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .pair.wide { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; align-items: start; }
    .pair .seg button { padding: 8px 6px; }
    .lbl { display: block; font-weight: 700; font-size: 13.5px; margin-bottom: 8px; }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .switchrow { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 12px 16px; background: none; border: none; border-bottom: 1px solid var(--hub-border); text-align: left; font-weight: 600; font-size: 14px; }
    .card .switchrow:last-child { border-bottom: none; }
    .swtxt { display: flex; flex-direction: column; gap: 2px; min-width: 0; } .swtxt small { color: var(--hub-muted); font-weight: 500; font-size: 12.5px; }
    .form .switchrow { padding: 10px 4px; border: none; }
    .switch { width: 46px; height: 28px; border-radius: 999px; background: rgba(150,170,190,.35); display: flex; align-items: center; padding: 3px; flex: none; transition: background .15s; }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; }
    .switch.on { background: var(--hub-accent); } .switch.on i { transform: translateX(18px); }
    .pill { border: 1px solid var(--hub-border); background: var(--hub-surface-2); color: var(--hub-muted); border-radius: 999px; padding: 5px 12px; font-size: 12.5px; font-weight: 800; }
    .legend { display: flex; flex-wrap: wrap; gap: 8px 16px; }
    .lg { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600; } .lg i { width: 10px; height: 10px; border-radius: 3px; background: var(--c); display: block; }

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
    .head2 { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; } .head2 h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .form { display: grid; gap: 8px; }
    .form label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 6px; }
    .form input:not([type=checkbox]), .form select, .every input, .every select { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .form input:focus, .form select:focus { border-color: var(--hub-accent); }
    .hint { color: var(--hub-muted); font-size: 12.5px; font-weight: 500; } .hint.inl { margin-left: 4px; }
    .two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .every { display: flex; align-items: center; gap: 8px; font-weight: 700; } .every input { width: 80px; } .every select { width: auto; }
    .emoji-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .emoji-list button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); }
    .emoji-list button.on { border-color: var(--hub-accent); }
    .actions { display: flex; gap: 10px; margin-top: 10px; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 10px 18px; font-weight: 700; }
    .pin { text-align: center; font-size: 28px !important; letter-spacing: .4em; }
    .detail .dh { display: flex; align-items: center; gap: 12px; } .detail h2 { margin: 0; font-size: 20px; }
    .em.big { font-size: 40px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 18px; background: color-mix(in srgb, var(--c) 22%, transparent); }
    .facts { display: grid; gap: 10px; margin: 14px 0; } .facts div { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; --mdc-icon-size: 20px; } .facts ha-icon { color: var(--hub-muted); flex: none; }
  `]}customElements.define("ksh-calendar-module",E);
