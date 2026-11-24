import{A as e,r as t,i,a as s,b as a}from"./lit-element-BqsBd8Ys.js";import{C as o}from"./virtual_card-version-DBhfHTym.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n={CHILD:2},r=e=>(...t)=>({_$litDirective$:e,values:t});let h=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l={},d=r(class extends h{constructor(){super(...arguments),this.key=e}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(((e,t=l)=>{e._$AH=t;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(e),this.key=t),i}});function c(e,t,{handle:i=".grabber, .head"}={}){let s=0,a=0,o=!1;const n=t=>{a=Math.max(0,t-s),e.style.transition="none",e.style.transform=a>0?`translateY(${a}px)`:""},r=()=>{o&&(o=!1,e.style.transition="transform .18s ease",a>80?(e.style.transform="translateY(110%)",setTimeout(()=>{e.style.transition="",e.style.transform="",t()},160)):(e.style.transform="",setTimeout(()=>{e.style.transition=""},200)),a=0)};e.addEventListener("touchstart",t=>{1!==t.touches.length||t.target.closest?.("input, select, textarea")?o=!1:(o=e.scrollTop<=0,s=t.touches[0].clientY,a=0)},{passive:!0}),e.addEventListener("touchmove",e=>{if(!o)return;const t=e.touches[0].clientY;t-s<=0&&0===a||(e.cancelable&&e.preventDefault(),n(t))},{passive:!1}),e.addEventListener("touchend",r),e.addEventListener("touchcancel",r),e.addEventListener("pointerdown",e=>{if("mouse"!==e.pointerType||!e.target.closest?.(i))return;o=!0,s=e.clientY;const t=e=>n(e.clientY),a=()=>{window.removeEventListener("pointermove",t),window.removeEventListener("pointerup",a),r()};window.addEventListener("pointermove",t),window.addEventListener("pointerup",a)})}const p=[{id:"home",label:"Home",icon:"mdi:home-outline",color:"#7fe3c8",home:!0},{id:"shopping",label:"Shopping",icon:"mdi:cart-outline",color:"#2fb585",module:"shopping"},{id:"meals",label:"Meals",icon:"mdi:silverware-fork-knife",color:"#f0903f",module:"recipes"},{id:"chores",label:"Chores",icon:"mdi:check-circle-outline",color:"#3db6cc",module:"chores"},{id:"calendar",label:"Calendar",icon:"mdi:calendar-month-outline",color:"#8f7cf0",module:"calendar"},{id:"finance",label:"Finance",icon:"mdi:piggy-bank-outline",color:"#4a86f0",module:"finance"},{id:"wishlist",label:"Wishlist",icon:"mdi:heart-outline",color:"#e8639f",soon:!0},{id:"medicine",label:"Medicine",icon:"mdi:bottle-tonic-plus-outline",color:"#33b98a",soon:!0},{id:"reminders",label:"Reminders",icon:"mdi:bell-outline",color:"#6f80f2",soon:!0},{id:"birthdays",label:"Birthdays",icon:"mdi:cake-variant-outline",color:"#cf6fb6",soon:!0},{id:"expiry",label:"Expiry",icon:"mdi:archive-outline",color:"#e46d5e",soon:!0},{id:"cards",label:"Cards",icon:"mdi:credit-card-outline",color:"#7069f2",module:"shopping"},{id:"timetables",label:"Timetables",icon:"mdi:view-week-outline",color:"#7388d8",soon:!0},{id:"chat",label:"Chat",icon:"mdi:forum-outline",color:"#6272dc",soon:!0},{id:"location",label:"Location",icon:"mdi:map-marker-outline",color:"#e5755f",soon:!0}],u={finance:[{view:"overview",label:"Overview",icon:"mdi:piggy-bank-outline"},{view:"history",label:"History",icon:"mdi:history"}],calendar:[{view:"month",label:"Month",icon:"mdi:calendar-month"},{view:"week",label:"Week",icon:"mdi:calendar-week"},{view:"day",label:"Day",icon:"mdi:calendar-today"},{view:"agenda",label:"Agenda",icon:"mdi:format-list-bulleted"},{view:"settings",label:"Settings",icon:"mdi:cog-outline"}],chores:[{view:"today",label:"Today",icon:"mdi:calendar-check-outline"},{view:"chores",label:"Chores",icon:"mdi:format-list-checks"},{view:"routines",label:"Routines",icon:"mdi:weather-sunny"},{view:"points",label:"Points",icon:"mdi:star-outline"},{view:"settings",label:"Settings",icon:"mdi:cog-outline"}],shopping:[{view:"shopping",label:"Shopping",icon:"mdi:cart-outline"},{view:"lists",label:"Lists",icon:"mdi:format-list-bulleted"},{view:"settings",label:"Settings",icon:"mdi:cog-outline"}],meals:[{view:"grid",label:"Recipes",icon:"mdi:book-open-variant"},{view:"planner",label:"Planner",icon:"mdi:calendar-week"},{view:"timers",label:"Timers",icon:"mdi:timer-outline"},{view:"settings",label:"Settings",icon:"mdi:cog-outline"}]};function b(e,t=[]){return p.filter(i=>i.home||(!i.module||e?.[i.module])&&!t.includes(i.id))}function m(e,t=[]){const i=e=>{const i=t.indexOf(e);return i<0?1/0:i},s=e.filter(e=>e.home),a=e.filter(e=>!e.home).map((e,t)=>({i:e,n:t})).sort((e,t)=>i(e.i.id)-i(t.i.id)||e.n-t.n);return[...s,...a.map(e=>e.i)]}const g=e=>p.find(t=>t.id===e),f=e=>`ksh_hub_person_${e?.user?.id||""}`,_=e=>`ksh_hub_pin_token_${e?.user?.id||""}`,x="ksh-acting-changed",v=e=>{try{return localStorage.getItem(e)||null}catch{return null}};function y(e){return v(f(e))}function w(e,t,i=null){try{t?localStorage.setItem(f(e),t):localStorage.removeItem(f(e)),t&&i?localStorage.setItem(_(e),JSON.stringify({person:t,token:i})):localStorage.removeItem(_(e))}catch{}window.dispatchEvent(new CustomEvent(x))}function k(e,t){const i=y(e);try{i&&t&&localStorage.setItem(_(e),JSON.stringify({person:i,token:t}))}catch{}}function $(e,t,i){const s=!!e?.user?.is_admin,a=y(e);return!s&&i?i:(o=a)&&t.some(e=>e.id===o)?a:i||null;var o}function F(e,t){const i={};if(t){i.as_person=t;const s=function(e){try{const t=JSON.parse(v(_(e))||"null");return t&&t.person===y(e)?t.token:null}catch{return null}}(e);s&&(i.pin_token=s)}return i}const E="fintech",C=[{id:"graphite",label:"Graphite",note:"Cool grays and a soft black that let the content speak.",swatch:["#121212","#E7E7EC"]},{id:"fintech",label:"Fintech blue and green",note:"Blue for trust and green for balances and successful transactions.",swatch:["#101215","#659FFF"]},{id:"indigo",label:"Indigo calendar",note:"Serene indigo with a mint accent for events.",swatch:["#101116","#7595FF"]},{id:"fresh",label:"Fresh food green",note:"For grocery, recipe or nutrition apps.",swatch:["#101210","#6DBA71"]},{id:"wellness",label:"Health and wellness",note:"Calm; for doctor appointments, habits or tracking.",swatch:["#101212","#71B3A9"]},{id:"delivery",label:"Delivery orange",note:"Orange makes order buttons and promotions stand out.",swatch:["#14110F","#F87B50"]},{id:"coral",label:"Coral dating",note:"A warm coral that invites you to swipe.",swatch:["#151010","#F26869"]},{id:"social",label:"Social pink and purple",note:"For social networks, dating or content creators.",swatch:["#141012","#EE75B2"]},{id:"cafe",label:"Roasted café",note:"Warm browns and cream, like a good coffee.",swatch:["#121111","#BD9D88"]},{id:"lavender",label:"Lavender meditation",note:"Soft and calm; for sleep, meditation or journaling.",swatch:["#111114","#8D7FCE"]}],S={midnight:E,slate:"graphite",forest:"fresh",dusk:"lavender"},j=i`${t(':host { --hub-bg: #101215; --hub-surface: #1C1E23; --hub-surface-2: #2A2C32; --hub-nav: #1C1E23; --hub-sheet: #1C1E23;\n    --hub-text: #E6EBF6; --hub-muted: #8C9098; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #659FFF; --hub-accent-ink: #FFFFFF; --hub-accent-2: #42C090; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #101215; color: var(--hub-text); }\n:host([data-mode="light"]) { --hub-bg: #F7F9FC; --hub-surface: #FFFFFF; --hub-surface-2: #E3EAF5; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #0B1B3F; --hub-muted: #757F94; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #2563EB; --hub-accent-ink: #FFFFFF; --hub-accent-2: #00C48C; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #F7F9FC; }\n:host([data-theme="graphite"]) { --hub-bg: #121212; --hub-surface: #1E1E1E; --hub-surface-2: #2C2C2C; --hub-nav: #1E1E1E; --hub-sheet: #1E1E1E;\n    --hub-text: #EBEBEB; --hub-muted: #909090; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #E7E7EC; --hub-accent-ink: #141416; --hub-accent-2: #E7E7EC; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #121212; }\n:host([data-theme="graphite"][data-mode="light"]) { --hub-bg: #FAFAFA; --hub-surface: #FFFFFF; --hub-surface-2: #F0F0F1; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #09090B; --hub-muted: #757577; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #18181B; --hub-accent-ink: #FFFFFF; --hub-accent-2: #18181B; --hub-accent-2-ink: #FFFFFF;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FAFAFA; }\n:host([data-theme="fintech"]) { --hub-bg: #101215; --hub-surface: #1C1E23; --hub-surface-2: #2A2C32; --hub-nav: #1C1E23; --hub-sheet: #1C1E23;\n    --hub-text: #E6EBF6; --hub-muted: #8C9098; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #659FFF; --hub-accent-ink: #FFFFFF; --hub-accent-2: #42C090; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #101215; }\n:host([data-theme="fintech"][data-mode="light"]) { --hub-bg: #F7F9FC; --hub-surface: #FFFFFF; --hub-surface-2: #E3EAF5; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #0B1B3F; --hub-muted: #757F94; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #2563EB; --hub-accent-ink: #FFFFFF; --hub-accent-2: #00C48C; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #F7F9FC; }\n:host([data-theme="indigo"]) { --hub-bg: #101116; --hub-surface: #1C1E24; --hub-surface-2: #2A2C33; --hub-nav: #1C1E24; --hub-sheet: #1C1E24;\n    --hub-text: #E7EBF7; --hub-muted: #8D8F99; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #7595FF; --hub-accent-ink: #FFFFFF; --hub-accent-2: #67CEC3; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #101116; }\n:host([data-theme="indigo"][data-mode="light"]) { --hub-bg: #F8F9FE; --hub-surface: #FFFFFF; --hub-surface-2: #E8EBFA; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #141A3C; --hub-muted: #7B7E93; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #4353FF; --hub-accent-ink: #FFFFFF; --hub-accent-2: #4FD1C5; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #F8F9FE; }\n:host([data-theme="fresh"]) { --hub-bg: #101210; --hub-surface: #1C1F1C; --hub-surface-2: #2A2D2A; --hub-nav: #1C1F1C; --hub-sheet: #1C1F1C;\n    --hub-text: #E7EDE7; --hub-muted: #8D918D; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #6DBA71; --hub-accent-ink: #141416; --hub-accent-2: #ACD481; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #101210; }\n:host([data-theme="fresh"][data-mode="light"]) { --hub-bg: #FFFFFF; --hub-surface: #FFFFFF; --hub-surface-2: #EFF8E8; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #1E3A1F; --hub-muted: #839384; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #2F8F3A; --hub-accent-ink: #FFFFFF; --hub-accent-2: #A8D672; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FFFFFF; }\n:host([data-theme="wellness"]) { --hub-bg: #101212; --hub-surface: #1C1F1E; --hub-surface-2: #2A2D2C; --hub-nav: #1C1F1E; --hub-sheet: #1C1F1E;\n    --hub-text: #E7ECEB; --hub-muted: #8D9090; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #71B3A9; --hub-accent-ink: #141416; --hub-accent-2: #6EC5B0; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #101212; }\n:host([data-theme="wellness"][data-mode="light"]) { --hub-bg: #F7FBFA; --hub-surface: #FFFFFF; --hub-surface-2: #DDF3EE; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #17363A; --hub-muted: #7C8F90; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #2A7F75; --hub-accent-ink: #FFFFFF; --hub-accent-2: #5CC8B0; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #F7FBFA; }\n:host([data-theme="delivery"]) { --hub-bg: #14110F; --hub-surface: #221D1B; --hub-surface-2: #312B29; --hub-nav: #221D1B; --hub-sheet: #221D1B;\n    --hub-text: #F4E8E5; --hub-muted: #968E8B; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #F87B50; --hub-accent-ink: #FFFFFF; --hub-accent-2: #F38339; --hub-accent-2-ink: #FFFFFF;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #14110F; }\n:host([data-theme="delivery"][data-mode="light"]) { --hub-bg: #FFFFFF; --hub-surface: #FFFFFF; --hub-surface-2: #FFF1E6; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #1F1F1F; --hub-muted: #848484; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #E04E0C; --hub-accent-ink: #FFFFFF; --hub-accent-2: #FF7A00; --hub-accent-2-ink: #FFFFFF;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FFFFFF; }\n:host([data-theme="coral"]) { --hub-bg: #151010; --hub-surface: #221C1C; --hub-surface-2: #312A2A; --hub-nav: #221C1C; --hub-sheet: #221C1C;\n    --hub-text: #F5E8E7; --hub-muted: #978D8D; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #F26869; --hub-accent-ink: #FFFFFF; --hub-accent-2: #F8B8A8; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #151010; }\n:host([data-theme="coral"][data-mode="light"]) { --hub-bg: #FFF7F5; --hub-surface: #FFFFFF; --hub-surface-2: #FFE3DC; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #2D1716; --hub-muted: #8C7C7A; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #FF5A5F; --hub-accent-ink: #FFFFFF; --hub-accent-2: #FFB4A2; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FFF7F5; }\n:host([data-theme="social"]) { --hub-bg: #141012; --hub-surface: #211C1F; --hub-surface-2: #302A2D; --hub-nav: #211C1F; --hub-sheet: #211C1F;\n    --hub-text: #F3E8EC; --hub-muted: #958D90; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #EE75B2; --hub-accent-ink: #FFFFFF; --hub-accent-2: #F47AA5; --hub-accent-2-ink: #FFFFFF;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #141012; }\n:host([data-theme="social"][data-mode="light"]) { --hub-bg: #FFF0F6; --hub-surface: #FFFFFF; --hub-surface-2: #FBDDEA; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #1C1530; --hub-muted: #827889; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #C13584; --hub-accent-ink: #FFFFFF; --hub-accent-2: #FF6FA5; --hub-accent-2-ink: #FFFFFF;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FFF0F6; }\n:host([data-theme="cafe"]) { --hub-bg: #121111; --hub-surface: #1F1E1D; --hub-surface-2: #2D2C2B; --hub-nav: #1F1E1D; --hub-sheet: #1F1E1D;\n    --hub-text: #EDEAE9; --hub-muted: #918F8E; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #BD9D88; --hub-accent-ink: #141416; --hub-accent-2: #D3A272; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #121111; }\n:host([data-theme="cafe"][data-mode="light"]) { --hub-bg: #FBF7F2; --hub-surface: #FFFFFF; --hub-surface-2: #F1E6D8; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #2B1D14; --hub-muted: #897F78; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #6F4E37; --hub-accent-ink: #FFFFFF; --hub-accent-2: #D9A066; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FBF7F2; }\n:host([data-theme="lavender"]) { --hub-bg: #111114; --hub-surface: #1E1E21; --hub-surface-2: #2C2C30; --hub-nav: #1E1E21; --hub-sheet: #1E1E21;\n    --hub-text: #EBEAF1; --hub-muted: #8F8F94; --hub-border: rgba(255, 255, 255, 0.10);\n    --hub-accent: #8D7FCE; --hub-accent-ink: #FFFFFF; --hub-accent-2: #C8BEEC; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); --hub-m-main: #111114; }\n:host([data-theme="lavender"][data-mode="light"]) { --hub-bg: #FBF9FF; --hub-surface: #FFFFFF; --hub-surface-2: #ECE6FB; --hub-nav: #FFFFFF; --hub-sheet: #FFFFFF;\n    --hub-text: #3D3566; --hub-muted: #938DAB; --hub-border: rgba(20, 20, 30, 0.10);\n    --hub-accent: #8E7CD9; --hub-accent-ink: #FFFFFF; --hub-accent-2: #C9BDF2; --hub-accent-2-ink: #141416;\n    --hub-shadow: 0 10px 30px rgba(20, 30, 50, 0.16); --hub-m-main: #FBF9FF; }\n')}`;function A(e,t,i){if(!e||!t)return!0;if(e.connection!==t.connection||e.language!==t.language||e.selectedLanguage!==t.selectedLanguage)return!0;if(e.locale?.language!==t.locale?.language||e.themes?.darkMode!==t.themes?.darkMode||e.selectedTheme!==t.selectedTheme)return!0;if(e.config?.currency!==t.config?.currency||e.config?.unit_system!==t.config?.unit_system)return!0;const s=e.user,a=t.user;if(s!==a&&(s?.id!==a?.id||s?.is_admin!==a?.is_admin||s?.name!==a?.name))return!0;const o=Date.now();if(o-(i.at||0)<5e3)return!1;i.at=o;const n=function(e){const t=e?.states||{};let i="";for(const e in t)e.startsWith("person.")?i+=`${e}=${t[e].attributes?.entity_picture||""};`:e.startsWith("calendar.")&&(i+=`${e};`);return i}(t);return n!==i.sig&&(i.sig=n,!0)}const z="ksh_photo_",M=new Map,P=e=>{if(M.has(e))return M.get(e);try{const t=localStorage.getItem(z+e);if(t)return M.set(e,t),t}catch{}return null},R=(e,t)=>{M.set(e,t);try{localStorage.setItem(z+e,t)}catch{}};async function I(e){const t=await e.callWS({type:"ksh_family_hub/people/list"}),i=[...new Set(t.people.map(e=>e.photo).filter(e=>e?.startsWith("h:")&&!P(e)))];if(i.length)try{const{photos:t}=await e.callWS({type:"ksh_family_hub/people/photos",hashes:i});for(const[e,i]of Object.entries(t||{}))R(e,i)}catch{}return{...t,people:t.people.map(e=>e.photo?.startsWith("h:")?{...e,photo:P(e.photo)}:e)}}let B;function D(e){B=e||void 0}function T(e=new Date){const t=new Intl.DateTimeFormat("en-CA",{timeZone:B,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1,weekday:"short"}),i=Object.fromEntries(t.formatToParts(e).map(e=>[e.type,e.value]));return{y:i.year,m:i.month,d:i.day,h:"24"===i.hour?"00":i.hour,min:i.minute,wd:i.weekday}}const O=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];function q(e){const t=T(e);return`${t.y}-${t.m}-${t.d}`}function H(e){return O.indexOf(T(e).wd)}function L(e){const t=T(e);return`${t.h}:${t.min}`}const N=["breakfast","lunch","dinner","snack","dessert"],W=()=>{const e=new Date,t=e=>String(e).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`};class V extends s{static properties={hass:{type:Object},modules:{type:Object},hidden:{type:Array},dark:{type:Boolean},panel:{type:Boolean},_shopping:{state:!0},_chores:{state:!0},_meals:{state:!0},_loaded:{state:!0}};constructor(){super(),this._shopping=null,this._meals=null,this._chores=null,this._loaded=!1,this._requested=!1}willUpdate(e){(e.has("hass")||e.has("modules"))&&this.hass&&this.modules&&!this._requested&&(this._requested=!0,this._load())}async _load(){const e=[];this.modules.shopping&&e.push(this._loadShopping()),this.modules.recipes&&e.push(this._loadMeals()),this.modules.chores&&e.push(this._loadChores()),await Promise.allSettled(e),this._loaded=!0}async _loadShopping(){try{const{lists:e=[]}=await this.hass.callWS({type:"ksh_shopping/lists/get_all"}),t=e.find(e=>e.active)||e[0];if(!t)return void(this._shopping={list:null,open:0});const{items:i=[]}=await this.hass.callWS({type:"ksh_shopping/items/get",list_id:t.id});this._shopping={list:t,open:i.filter(e=>!e.checked).length}}catch{this._shopping=null}}async _loadChores(){try{const e=await this.hass.callWS({type:"ksh_chores/get_state",date:W()});this._chores={open:e.items.filter(e=>["open","rejected"].includes(e.status)).length,done:e.items.filter(e=>["done","approved"].includes(e.status)).length,waiting:e.pending.length}}catch{this._chores=null}}async _loadMeals(){try{const{entries:e=[]}=await this.hass.callWS({type:"ksh_recipes/meal_plan/get"}),t=W();this._meals=e.filter(e=>e.date===t).sort((e,t)=>N.indexOf(e.meal_type)-N.indexOf(t.meal_type))}catch{this._meals=null}}_go(e){this.dispatchEvent(new CustomEvent("hub-navigate",{detail:{id:e},bubbles:!0,composed:!0}))}get _greeting(){const e=(new Date).getHours(),t=e<5?"Good evening":e<12?"Good morning":e<18?"Good afternoon":"Good evening",i=(this.hass?.user?.name||"").split(" ")[0];return i?`${t}, ${i}`:t}render(){const t=(new Date).toLocaleDateString(this.hass?.locale?.language||void 0,{weekday:"long",day:"numeric",month:"long"}),i=b(this.modules,this.hidden).filter(e=>!e.home);return a`
      <div class="page">
        <header>
          <div class="greet">
            <h1>${this._greeting}</h1>
            <p class="date">${t}</p>
          </div>
        </header>

        <div class="cards">
          ${this.modules?.shopping?this._shoppingCard():e}
          ${this.modules?.recipes?this._mealsCard():e}
          ${this.modules?.chores?this._choresCard():e}
          ${this.modules?.shopping||this.modules?.recipes||this.modules?.chores?e:a`
            <section class="card wide">
              <h2>Nothing switched on</h2>
              <p class="muted">Turn on Shopping or Recipes in the hub settings to get started.</p>
            </section>`}
        </div>

        <h3 class="section">Your hub</h3>
        <div class="grid">
          ${i.map(e=>a`
            <button class="grid-item" @click=${()=>this._go(e.id)}>
              <span class="tile" style="--c:${e.color}">
                <ha-icon icon=${e.icon}></ha-icon>
              </span>
              <span class="label">${e.label}</span>
            </button>`)}
        </div>
      </div>`}_shoppingCard(){const e=this._shopping,t=p.find(e=>"shopping"===e.id).color;return a`
      <section class="card" style="--c:${t}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:cart-outline"></ha-icon></span><h2>Shopping</h2></div>
        ${this._loaded||e?e?e.list?a`
            <p class="big">${e.open}<span> ${1===e.open?"item":"items"} to buy</span></p>
            <p class="muted">${e.list.name}</p>`:a`<p class="muted">Add your shopping list to get started.</p>`:a`<p class="muted">Couldn't load your lists.</p>`:a`<p class="muted">Loading…</p>`}
        <button class="link" @click=${()=>this._go("shopping")}>Open shopping <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`}_choresCard(){const e=this._chores,t=p.find(e=>"chores"===e.id).color;return a`
      <section class="card" style="--c:${t}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span><h2>Chores today</h2></div>
        ${this._loaded||e?e?a`<p class="big">${e.open}<span> to do</span></p>
              <p class="muted">${e.done} done${e.waiting?` · ${e.waiting} waiting for approval`:""}</p>`:a`<p class="muted">Couldn't load the chores.</p>`:a`<p class="muted">Loading…</p>`}
        <button class="link" @click=${()=>this._go("chores")}>Open chores <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`}_mealsCard(){const e=this._meals,t=p.find(e=>"meals"===e.id).color;return a`
      <section class="card" style="--c:${t}">
        <div class="card-head"><span class="dot"><ha-icon icon="mdi:silverware-fork-knife"></ha-icon></span><h2>Today's meals</h2></div>
        ${this._loaded||e?e?e.length?a`<ul>${e.map(e=>a`
              <li><span class="kind">${e.meal_type}</span><span class="name">${e.recipe_name||"Recipe"}</span></li>`)}</ul>`:a`<p class="muted">Nothing planned for today.</p>`:a`<p class="muted">Couldn't load the meal plan.</p>`:a`<p class="muted">Loading…</p>`}
        <button class="link" @click=${()=>this._go("meals")}>Open meals <ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </section>`}static styles=[i`
    :host { display: block; flex: 1; min-height: 0; overflow-y: auto; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; }
    .page { max-width: 980px; margin: 0 auto; padding: 22px 18px 28px; }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.01em; }
    .date { margin: 4px 0 0; color: var(--hub-muted); font-size: 14px; }
    .gear {
      width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center;
    }
    .greet { flex: 1; min-width: 0; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 20px; }
    .card {
      padding: 18px; border-radius: 22px; background: var(--hub-surface); border: 1px solid var(--hub-border);
      display: flex; flex-direction: column; gap: 6px; min-height: 150px;
    }
    .card.wide { grid-column: 1 / -1; }
    .card-head { display: flex; align-items: center; gap: 10px; }
    .card h2 { margin: 0; font-size: 15px; font-weight: 700; }
    .dot {
      width: 34px; height: 34px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center;
      background: var(--hub-surface-2); color: var(--hub-muted); --mdc-icon-size: 20px;
    }
    .big { margin: 8px 0 0; font-size: 34px; font-weight: 800; line-height: 1; }
    .big span { font-size: 15px; font-weight: 600; color: var(--hub-muted); }
    .muted { margin: 4px 0 0; color: var(--hub-muted); font-size: 14px; }
    ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; }
    li { display: flex; gap: 10px; align-items: baseline; font-size: 14.5px; }
    .kind { width: 74px; flex: none; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--hub-muted); }
    .name { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link {
      margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; background: none; border: none;
      cursor: pointer; padding: 6px 0 0; font-weight: 700; font-size: 13.5px; color: var(--hub-accent);
    }
    .link ha-icon { --mdc-icon-size: 18px; }
    .section { margin: 28px 2px 12px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 20px 6px; }
    .grid-item { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0; }
    .tile {
      position: relative; width: 54px; height: 54px; border-radius: 17px; display: inline-flex; align-items: center; justify-content: center;
      background: var(--hub-surface); color: var(--hub-muted); border: 1px solid var(--hub-border); --mdc-icon-size: 28px;
      transition: background .15s, color .15s;
    }
    .grid-item:hover .tile { background: color-mix(in srgb, var(--hub-accent) 16%, var(--hub-surface)); color: var(--hub-accent); }
    .label { font-size: 12.5px; font-weight: 700; }
  `]}function U(e,t){if(!t?.user_id)return null;const i=Object.values(e?.states||{}).find(e=>e.entity_id?.startsWith("person.")&&e.attributes?.user_id===t.user_id);return i?.attributes?.entity_picture||null}function K(e,t){const i=function(e,t){return t?.photo?t.photo.startsWith("data:")?t.photo:"ha"===t.photo?U(e,t):null:null}(e,t);return i?a`<img src=${i} alt=${t?.name||""} draggable="false">`:t?.emoji||"🙂"}function G(e,t,i=28){return a`<span class="av" style="--p:${t?.color||"#4fd1a1"};--sz:${i}px" title=${t?.name||""}>${K(e,t)}</span>`}customElements.define("ksh-hub-home",V);const Y=i`
  .av { width: var(--sz, 28px); height: var(--sz, 28px); border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center;
    font-size: calc(var(--sz, 28px) * 0.55); line-height: 1; overflow: hidden; vertical-align: middle;
    background: color-mix(in srgb, var(--p) 28%, transparent); border: 2px solid var(--p); box-sizing: border-box; }
  .av img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .chip:has(.av) { display: inline-flex; align-items: center; gap: 7px; padding-left: 5px; }
`;async function J(e,t=160){const i=URL.createObjectURL(e);try{const e=await new Promise((e,t)=>{const s=new Image;s.onload=()=>e(s),s.onerror=()=>t(new Error("That does not look like a picture")),s.src=i}),s=Math.min(e.naturalWidth,e.naturalHeight),a=document.createElement("canvas");return a.width=a.height=t,a.getContext("2d").drawImage(e,(e.naturalWidth-s)/2,(e.naturalHeight-s)/2,s,s,0,0,t,t),a.toDataURL("image/jpeg",.82)}finally{URL.revokeObjectURL(i)}}const Q=["shopping","meals","chores","calendar","finance"],X={chores:"Chores, routines and points for the family",finance:"Pocket money: a Cash and a Bank account for each child",calendar:"Family calendar, school, sport, appointments and your Home Assistant calendars",shopping:"Lists, product catalogue and supermarkets",meals:"Recipe book, meal planner and cooking timers",cards:"Loyalty cards (needs Shopping)"};class Z extends s{static properties={hass:{type:Object},info:{type:Object},theme:{type:String},palette:{type:String},cardVersion:{type:String},prefs:{type:Object},people:{type:Array},order:{type:Array},applying:{type:Boolean},applyError:{type:String},_error:{state:!0},_who:{state:!0}};constructor(){super(),this._error=null,this._who=null}get _isAdmin(){return!!this.hass?.user?.is_admin}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_isOn(e){const t=this.info?.hidden||[];return!(e.module&&!this.info?.modules?.[e.module])&&(!!Q.includes(e.id)||!t.includes(e.id))}_toggle(e,t){this._error=null;const i=this.info?.modules||{};if(Q.includes(e.id)){const s=e.module,a=Object.entries(i).filter(([e])=>e!==s);return!t&&a.every(([,e])=>!e)?void(this._error="Keep at least one of Shopping, Meals, Chores, Calendar and Finance switched on."):void this._emit("hub-config",{modules:{[s]:t}})}this._emit("hub-config",{items:{[e.id]:t}})}_sorted(){return m(p.filter(e=>!e.home),this.prefs?.order||[])}_move(e,t){const i=this._sorted().map(e=>e.id),s=i.indexOf(e),a=s+t;s<0||a<0||a>=i.length||([i[s],i[a]]=[i[a],i[s]],this._emit("hub-order",{order:i}))}_access(){const t=this.people||[];if(!t.length)return e;const i=t.find(e=>e.id===this._who)||t[0],s=this.prefs?.blocked?.[i.id]||[],o=p.filter(e=>!e.home&&!e.soon&&(!e.module||this.info?.modules?.[e.module])),n=(e,t)=>this._emit("hub-access",{person:i.id,hidden:t?s.filter(t=>t!==e.id):[...new Set([...s,e.id])]});return a`
      <h3>Who can see what</h3>
      <section class="card">
        <div class="chips">
          ${t.map(e=>a`<button class="chip ${e.id===i.id?"on":""}" @click=${()=>{this._who=e.id}}>${G(this.hass,e,22)}${e.name}</button>`)}
        </div>
        ${o.map(e=>{const t=!s.includes(e.id);return a`
            <div class="row slim ${t?"on":""}">
              <span class="dot sm"><ha-icon icon=${e.icon}></ha-icon></span>
              <div class="txt"><div class="name">${e.label}</div></div>
              <button class="switch ${t?"on":""}" role="switch" aria-checked=${t?"true":"false"}
                aria-label="${i.name} can see ${e.label}" @click=${()=>n(e,!t)}><i></i></button>
            </div>`})}
      </section>
      <p class="note">Hides these entries from ${i.name}'s menu wherever they use the hub, including a shared tablet
        while ${i.name} is picked. It keeps the menu tidy; it is not a lock, so someone who knows Home Assistant can still reach the data.</p>`}render(){const t=this._isAdmin,i=this._sorted();return a`
      <div class="page">
        <header>
          <button class="back" @click=${()=>this._emit("hub-back")} aria-label="Back"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
          <h1>Settings</h1>
          ${this.applying?a`<span class="spin" title="Saving"></span>`:e}
        </header>

        <h3>Menu</h3>
        <section class="card">${i.map((e,i,s)=>{const o=e.module&&!this.info?.modules?.[e.module]&&!Q.includes(e.id),n=this._isOn(e);return a`
        <div class="row ${n?"on":""}">
          <span class="dot"><ha-icon icon=${e.icon}></ha-icon></span>
          <div class="txt">
            <div class="name">${e.label}</div>
            <div class="desc">${X[e.id]||"Coming soon"}</div>
          </div>
          <button class="mv" ?disabled=${0===i} aria-label="Move ${e.label} up" @click=${()=>this._move(e.id,-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="mv" ?disabled=${i===s.length-1} aria-label="Move ${e.label} down" @click=${()=>this._move(e.id,1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="switch ${n?"on":""}" role="switch" aria-checked=${n?"true":"false"}
            aria-label=${e.label} ?disabled=${!t||o}
            @click=${()=>this._toggle(e,!n)}><i></i></button>
        </div>`})}</section>
        ${t?e:a`<p class="note">Only a Home Assistant administrator can switch parts on or off.</p>`}
        ${this._error||this.applyError?a`<p class="note err">${this._error||this.applyError}</p>`:e}
        <p class="note">Use the arrows to put the menu in the order you like (Home is always first). On a phone the first three go in the bottom bar and the rest are under More.
          Your order is kept for your login, on every device.
          <button class="linkbtn" @click=${()=>this._emit("hub-order",{order:[]})}>Back to the standard order</button></p>
        <p class="note">The switches turn things on or off for everyone. Shopping, Meals, Chores, Calendar and Finance load or unload that part of the integration (this takes a few seconds in the background).
          The other entries only show or hide their menu item. Nothing is ever deleted: switching a part back on restores everything.</p>

        ${t?this._access():e}

        <h3>Appearance</h3>
        <section class="card">
          <div class="seg" role="radiogroup" aria-label="Colour mode">
            ${[["dark","Dark"],["light","Light"],["auto","Match Home Assistant"]].map(([e,t])=>a`
              <button role="radio" aria-checked=${this.theme===e?"true":"false"}
                class=${this.theme===e?"sel":""} @click=${()=>this._emit("hub-theme",{theme:e})}>${t}</button>`)}
          </div>
        </section>
        <h3>Theme</h3>
        <section class="card themes" role="radiogroup" aria-label="Theme">
          ${C.map(e=>a`
            <button role="radio" aria-checked=${this.palette===e.id?"true":"false"} class="theme ${this.palette===e.id?"sel":""}"
              @click=${()=>this._emit("hub-palette",{palette:e.id})}>
              <span class="sw" style="background:linear-gradient(135deg, ${e.swatch[0]} 0 55%, ${e.swatch[1]} 55% 100%)"></span>
              <span>${e.label}</span>
            </button>`)}
        </section>
        <p class="note">Each theme has a light and a dark version. Dark or Light above (or Match Home Assistant) decides which one you see.</p>

        <h3>About</h3>
        <section class="card about">
          <div><span>Integration</span><b>${this.info?.version??"—"}</b></div>
          <div><span>Card</span><b>${this.cardVersion??"—"}</b></div>
          ${Object.entries(this.info?.imported||{}).map(([e,t])=>a`
            <div><span>Imported ${"recipes"===e?"recipes":"shopping"} data</span><b>${t.length?`${t.length} file${1===t.length?"":"s"}`:"none found"}</b></div>`)}
        </section>
        <p class="note">On first start the hub copies your existing Recipe Manager and Shopping List Manager data.
          The originals are left untouched, so the standalone integrations keep working side by side.</p>
      </div>`}static styles=[Y,i`
    .chips { display: flex; gap: 6px; flex-wrap: wrap; padding: 12px 12px 6px; }
    .chip { border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 6px 14px; font-weight: 600; font-size: 13.5px; cursor: pointer; }
    .chip.on { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .row.slim { padding: 8px 14px; }
    .dot.sm { width: 34px; height: 34px; border-radius: 11px; --mdc-icon-size: 19px; }
    .row .mv { margin-right: -4px; }
    .mv { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface-2); cursor: pointer; display: flex; align-items: center; justify-content: center; --mdc-icon-size: 19px; flex: none; }
    .mv[disabled] { opacity: .35; cursor: default; }
    .linkbtn { background: none; border: none; color: var(--hub-accent); font-weight: 700; cursor: pointer; padding: 0 0 0 6px; }
    .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; padding: 12px; }
    .theme { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px; border-radius: 16px; cursor: pointer;
      border: 2px solid var(--hub-border); background: var(--hub-surface-2); font: inherit; font-weight: 700; color: var(--hub-text); }
    .theme.sel { border-color: var(--hub-accent); }
    .theme .sw { width: 56px; height: 56px; border-radius: 16px; border: 1px solid var(--hub-border); }
    :host { display: block; flex: 1; min-height: 0; overflow-y: auto; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; }
    .page { max-width: 640px; margin: 0 auto; padding: 18px 18px 32px; }
    header { display: flex; align-items: center; gap: 10px; }
    h1 { margin: 0; font-size: 22px; font-weight: 800; }
    .back {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); display: flex; align-items: center; justify-content: center;
    }
    h3 { margin: 26px 2px 10px; font-size: 12.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .card { background: var(--hub-surface); border: 1px solid var(--hub-border); border-radius: 20px; overflow: hidden; }
    .row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
    .row + .row { border-top: 1px solid var(--hub-border); }
    .dot {
      width: 40px; height: 40px; border-radius: 13px; flex: none; display: inline-flex; align-items: center; justify-content: center;
      background: var(--hub-surface-2); color: var(--hub-muted); --mdc-icon-size: 22px; transition: background .15s, color .15s;
    }
    .row.on .dot { background: color-mix(in srgb, var(--hub-accent) 18%, transparent); color: var(--hub-accent); }
    .txt { flex: 1; min-width: 0; }
    .name { font-weight: 700; font-size: 15px; }
    .desc { color: var(--hub-muted); font-size: 12.5px; margin-top: 2px; }
    .switch {
      width: 48px; height: 28px; border-radius: 999px; border: none; padding: 3px; cursor: pointer; flex: none;
      background: rgba(150, 170, 190, .35); transition: background .15s; display: flex; align-items: center;
    }
    .switch i { width: 22px; height: 22px; border-radius: 50%; background: #fff; transition: transform .15s; box-shadow: 0 1px 3px rgba(0,0,0,.35); }
    .switch.on { background: var(--hub-accent); }
    .switch.on i { transform: translateX(20px); }
    .switch:disabled { opacity: .5; cursor: default; }
    .spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--hub-border); border-top-color: var(--hub-accent); animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .note { margin: 8px 4px 0; font-size: 12.5px; color: var(--hub-muted); }
    .note.err { color: #f0a050; }
    .seg { display: flex; gap: 6px; padding: 8px; }
    .seg button {
      flex: 1; border: none; border-radius: 13px; padding: 10px 6px; cursor: pointer; font-weight: 700; font-size: 13px;
      background: transparent; color: var(--hub-muted);
    }
    .seg button.sel { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .about div { display: flex; justify-content: space-between; padding: 13px 16px; font-size: 14px; }
    .about div + div { border-top: 1px solid var(--hub-border); }
    .about span { color: var(--hub-muted); }
  `]}customElements.define("ksh-hub-settings",Z);class ee extends s{static properties={item:{type:Object}};render(){const e=this.item;return e?a`
      <div class="wrap" style="--c:${e.color}">
        <span class="tile"><ha-icon icon=${e.icon}></ha-icon></span>
        <h2>${e.label}</h2>
        <p>This part of the hub is coming soon.</p>
        <button @click=${()=>this.dispatchEvent(new CustomEvent("hub-navigate",{detail:{id:"home"},bubbles:!0,composed:!0}))}>
          Back to Home
        </button>
      </div>`:a``}static styles=[i`
    :host { display: flex; flex: 1; min-height: 0; align-items: center; justify-content: center; }
    .wrap { text-align: center; padding: 24px; max-width: 360px; display: grid; gap: 10px; justify-items: center; }
    .tile {
      width: 76px; height: 76px; border-radius: 24px; display: flex; align-items: center; justify-content: center;
      background: var(--hub-surface-2); color: var(--hub-muted); --mdc-icon-size: 40px;
    }
    h2 { margin: 8px 0 0; font-size: 22px; }
    p { margin: 0; color: var(--hub-muted); font-size: 14.5px; }
    button {
      margin-top: 10px; border: none; border-radius: 999px; padding: 10px 22px; cursor: pointer; font: inherit; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
  `]}customElements.define("ksh-hub-placeholder",ee);const te={type:"daily"},ie=(...e)=>({type:"weekly",days:e}),se=ie(5),ae=[{name:"Make bed",emoji:"🛏️",points:1,recurrence:te,group:"Bedroom"},{name:"Tidy bedroom",emoji:"🧸",points:2,recurrence:te,group:"Bedroom"},{name:"Put away clothes",emoji:"👕",points:1,recurrence:te,group:"Bedroom"},{name:"Change bedsheets",emoji:"🛏️",points:3,recurrence:se,group:"Bedroom"},{name:"Brush teeth",emoji:"🪥",points:1,recurrence:te,group:"Self care"},{name:"Pack school bag",emoji:"🎒",points:1,recurrence:ie(0,1,2,3,4),group:"Self care"},{name:"Homework",emoji:"📚",points:2,recurrence:ie(0,1,2,3),group:"Self care"},{name:"Practise instrument",emoji:"🎹",points:2,recurrence:te,group:"Self care"},{name:"Set the table",emoji:"🍽️",points:1,recurrence:te,group:"Kitchen"},{name:"Clear the table",emoji:"🥣",points:1,recurrence:te,group:"Kitchen"},{name:"Load the dishwasher",emoji:"🫧",points:2,recurrence:te,group:"Kitchen"},{name:"Unload the dishwasher",emoji:"🍴",points:2,recurrence:te,group:"Kitchen"},{name:"Wash the dishes",emoji:"🧼",points:2,recurrence:te,group:"Kitchen"},{name:"Wipe the benches",emoji:"🧽",points:1,recurrence:te,group:"Kitchen"},{name:"Help cook dinner",emoji:"🍳",points:3,recurrence:ie(2,4),group:"Kitchen"},{name:"Take out the rubbish",emoji:"🗑️",points:2,recurrence:ie(1,4),group:"Around the house"},{name:"Put the bins out",emoji:"♻️",points:2,recurrence:ie(1),group:"Around the house"},{name:"Vacuum",emoji:"🧹",points:3,recurrence:se,group:"Around the house"},{name:"Mop the floors",emoji:"🪣",points:3,recurrence:se,group:"Around the house"},{name:"Tidy the living room",emoji:"🛋️",points:2,recurrence:te,group:"Around the house"},{name:"Clean the bathroom",emoji:"🛁",points:5,recurrence:se,group:"Around the house"},{name:"Do the laundry",emoji:"🧺",points:3,recurrence:ie(0,3),group:"Laundry"},{name:"Fold the laundry",emoji:"👚",points:2,recurrence:ie(0,3),group:"Laundry"},{name:"Feed the pets",emoji:"🐶",points:1,recurrence:te,group:"Pets & garden"},{name:"Walk the dog",emoji:"🦮",points:3,recurrence:te,group:"Pets & garden"},{name:"Clean the litter tray",emoji:"🐱",points:2,recurrence:te,group:"Pets & garden"},{name:"Water the plants",emoji:"🪴",points:1,recurrence:ie(1,4),group:"Pets & garden"},{name:"Mow the lawn",emoji:"🌱",points:5,recurrence:se,group:"Pets & garden"},{name:"Weed the garden",emoji:"🌼",points:3,recurrence:se,group:"Pets & garden"},{name:"Wash the car",emoji:"🚗",points:4,recurrence:se,group:"Pets & garden"}],oe=[{name:"Morning routine",emoji:"☀️",kind:"morning",points:3,steps:[{text:"Get dressed",emoji:"👕"},{text:"Eat breakfast",emoji:"🥣"},{text:"Brush teeth",emoji:"🪥"},{text:"Pack school bag",emoji:"🎒",days:[0,1,2,3,4]},{text:"Shoes on",emoji:"👟"}]},{name:"Evening routine",emoji:"🌙",kind:"evening",points:3,steps:[{text:"Tidy toys away",emoji:"🧸"},{text:"Dishes to the bench",emoji:"🍽️"},{text:"Bath or shower",emoji:"🛁"},{text:"Put school bag by the door",emoji:"🎒",days:[0,1,2,3,6]},{text:"Pyjamas on",emoji:"🩳"},{text:"Brush teeth",emoji:"🪥"},{text:"Read a book",emoji:"📖"}]}],ne=[{name:"Extra screen time (30 minutes)",emoji:"📺",cost:15},{name:"Pick the family game",emoji:"🎲",cost:10},{name:"Stay up 30 minutes later",emoji:"🌙",cost:20},{name:"Choose what is for dinner",emoji:"🍽️",cost:20},{name:"Pick the movie night film",emoji:"🎬",cost:20},{name:"Ice cream treat",emoji:"🍦",cost:25},{name:"Trip to the park",emoji:"🛝",cost:25},{name:"Friend over to play",emoji:"🧸",cost:40},{name:"Takeaway night pick",emoji:"🍕",cost:50},{name:"Sleepover with a friend",emoji:"🛏️",cost:60},{name:"Choose a family outing",emoji:"🎳",cost:80},{name:"New small toy or book",emoji:"🧩",cost:100}],re=["✅","🧹","🧺","🍽️","🗑️","🛏️","🪥","📚","🐶","🐱","🌱","🚗","🧸","🎒","🍳","🪴","🛁","👕","🦖","🦄","🚀","⭐","🙂","😎","🦊","🐼","🐯","🦋"],he=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],le="ksh_emoji_recent";let de=null;class ce extends s{static properties={value:{type:String},quick:{type:Array},compact:{type:Boolean},_browse:{state:!0},_open:{state:!0},_q:{state:!0},_group:{state:!0},_data:{state:!0},_recent:{state:!0}};constructor(){super(),this.value="",this.quick=[],this.compact=!1,this._browse=!1,this._open=!1,this._q="",this._group=0,this._data=null,this._recent=(()=>{try{const e=JSON.parse(localStorage.getItem(le)||"[]");return Array.isArray(e)?e:[]}catch{return[]}})()}async _ensureData(){if(!this._data)try{this._data=await(de||=import("./emoji-data-Cr94LOp5.js"))}catch{this._data={GROUPS:[],EMOJI:[]}}}_pick(e){this._recent=[e,...this._recent.filter(t=>t!==e)].slice(0,18),(e=>{try{localStorage.setItem(le,JSON.stringify(e.slice(0,18)))}catch{}})(this._recent),this.dispatchEvent(new CustomEvent("emoji-pick",{detail:{emoji:e},bubbles:!0,composed:!0})),this._browse=!1,this._open=!1,this._q=""}_typed(e){this.dispatchEvent(new CustomEvent("emoji-pick",{detail:{emoji:e.target.value},bubbles:!0,composed:!0}))}async _search(e){this._q=e.target.value,this._q&&await this._ensureData()}async _openBrowse(){this._browse=!0,await this._ensureData()}get _results(){const e=this._q.trim().toLowerCase();if(!e||!this._data)return null;const t=e.split(/\s+/),i=this._data.EMOJI.filter(([,e])=>t.every(t=>e.includes(t))),s=e=>new RegExp(`(^| )${e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}( |$)`);return i.sort((e,i)=>t.filter(e=>s(e).test(i[1])).length-t.filter(t=>s(t).test(e[1])).length),i.slice(0,120).map(e=>e[0])}_grid(e){return a`<div class="grid">${e.map(e=>a`
      <button type="button" class=${e===this.value?"on":""} @click=${()=>this._pick(e)} aria-label=${`Choose ${e}`}>${e}</button>`)}</div>`}_searchBox(){return a`<input class="q" type="search" placeholder="Search emoji, e.g. swim, dentist, bins" .value=${this._q} @input=${this._search} aria-label="Search emoji">`}_panel({withSearch:t=!0}={}){const i=this._results,s=this._data,o=s?s.EMOJI.filter(([,,e])=>e===this._group).map(e=>e[0]):[];return a`
      ${t?a`<div class="search">${this._searchBox()}</div>`:e}
      ${i?i.length?this._grid(i):a`<p class="none">No emoji found. Try another word.</p>`:a`
        ${s?a`
          <div class="tabs" role="tablist">${s.GROUPS.map(([e,t],i)=>a`
            <button type="button" role="tab" aria-selected=${this._group===i?"true":"false"} class=${this._group===i?"on":""} title=${t} @click=${()=>{this._group=i}}>${e}</button>`)}</div>
          <div class="scroll">${this._grid(o)}</div>`:a`<p class="none">Loading…</p>`}`}`}_suggestions(){const e=this._recent.filter(e=>!this.quick.includes(e)).slice(0,8),t=[...e,...this.quick];return a`
      ${this._grid(t)}
      <button type="button" class="more" @click=${this._openBrowse}>Browse all emojis</button>`}render(){if(this.compact)return a`
        <button type="button" class="pickbtn" @click=${async()=>{this._open=!0,this._browse=!0,await this._ensureData()}} aria-label="Choose an emoji">${this.value||"🙂"}</button>
        ${this._open?a`
          <div class="overlay" @click=${e=>{e.target===e.currentTarget&&(this._open=!1)}}>
            <div class="box" role="dialog" aria-label="Choose an emoji">
              <button type="button" class="x" aria-label="Close" @click=${()=>{this._open=!1}}>✕</button>
              ${this._panel()}
            </div>
          </div>`:e}`;const t=this._browse||this._q;return a`
      <div class="row">
        <input class="cur" maxlength="8" .value=${this.value||""} @input=${this._typed} aria-label="Emoji">
        ${this._searchBox()}
      </div>
      ${t?a`
        <div class="panel">${this._panel({withSearch:!1})}
          <button type="button" class="more" @click=${()=>{this._browse=!1,this._q=""}}>Close</button></div>`:this._suggestions()}`}static styles=i`
    :host { display: block; color: var(--hub-text); }
    * { box-sizing: border-box; }
    .row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .cur { width: 76px; text-align: center; font-size: 24px; padding: 6px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; }
    .cur:focus { border-color: var(--hub-accent); }
    .q, .search input { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); font-size: 15px; outline: none; }
    .q:focus, .search input:focus { border-color: var(--hub-accent); }
    .row .q { flex: 1; min-width: 0; }
    .grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .grid button, .tabs button { width: 40px; height: 40px; font-size: 22px; line-height: 1; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); cursor: pointer; padding: 0; }
    .grid button:hover, .tabs button:hover { background: var(--hub-surface-2); }
    .grid button.on, .tabs button.on { border-color: var(--hub-accent); }
    .tabs { display: flex; gap: 4px; margin: 10px 0 8px; overflow-x: auto; scrollbar-width: none; }
    .tabs button { flex: none; }
    .tabs button.on { background: var(--hub-surface-2); }
    .scroll { max-height: 236px; overflow-y: auto; overscroll-behavior: contain; }
    .panel { display: grid; gap: 6px; }
    .panel > .grid { max-height: 280px; overflow-y: auto; margin-top: 8px; align-content: flex-start; }
    .more { margin-top: 8px; border: 1px solid var(--hub-border); background: transparent; color: var(--hub-muted); border-radius: 999px; padding: 7px 14px; font-weight: 700; font-size: 13px; cursor: pointer; }
    .row .more { margin: 0; }
    .more:hover { color: var(--hub-text); }
    .none { margin: 12px 4px; color: var(--hub-muted); font-size: 14px; }
    .pickbtn { width: 44px; height: 44px; font-size: 24px; line-height: 1; border-radius: 12px; border: 1px solid var(--hub-border); background: var(--hub-surface); cursor: pointer; padding: 0; color: inherit; }
    .overlay { position: fixed; inset: 0; z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, .5); }
    .box { position: relative; width: min(440px, 100%); max-height: 86vh; overflow: auto; padding: 16px 14px 14px; border-radius: 22px; background: var(--hub-sheet); border: 1px solid var(--hub-border); box-shadow: var(--hub-shadow); }
    .box .search { padding-right: 40px; }
    .x { position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; border: none; background: var(--hub-surface-2); color: var(--hub-text); cursor: pointer; }
  `}customElements.get("ksh-emoji-picker")||customElements.define("ksh-emoji-picker",ce);const pe=[["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["pt","Português"],["nl","Nederlands"],["it","Italiano"]],ue=[{id:"shopping",label:"Shopping List",icon:"mdi:cart-outline",color:"#4fd1a1",module:"shopping"},{id:"meals",label:"Recipes",icon:"mdi:silverware-fork-knife",color:"#f59a4d",module:"recipes"},{id:"chores",label:"Chores",icon:"mdi:check-circle-outline",color:"#3db6cc",module:"chores"},{id:"event",label:"Event",icon:"mdi:calendar-plus",color:"#8f7cf0",module:"calendar"},{id:"reminders",label:"Reminders",icon:"mdi:bell-outline",color:"#6f80f2",module:"calendar"},{id:"birthdays",label:"Birthdays",icon:"mdi:cake-variant-outline",color:"#cf6fb6",module:"calendar"}];class be extends s{static properties={hass:{type:Object},sheet:{type:String,reflect:!0},households:{type:Array},activeId:{type:String},modules:{type:Object},hidden:{type:Array},panel:{type:Boolean},language:{type:String},_switcher:{state:!0},_newName:{state:!0},_busy:{state:!0},_error:{state:!0},_quick:{state:!0},_itemName:{state:!0},_toast:{state:!0},_regions:{state:!0},_country:{state:!0},_people:{state:!0},_logins:{state:!0},_me:{state:!0},_edit:{state:!0},_form:{state:!0}};constructor(){super(),this.households=[],this._switcher=!1,this._newName="",this._busy=!1,this._error=null,this._quick=null,this._itemName="",this._toast=null,this._regions=null,this._country="",this._people=[],this._logins=[],this._me=null,this._edit=null,this._form=null}get _active(){return this.households.find(e=>e.id===this.activeId)||this.households[0]}get _haPeople(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id.startsWith("person.")&&e.attributes?.user_id).map(e=>({user_id:e.attributes.user_id,name:e.attributes.friendly_name||e.entity_id}))}_emit(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_close(){this._emit("hub-close")}_open(e){this._error=null,this._emit("hub-sheet",{sheet:e})}updated(e){e.has("sheet")&&(this._error=null,this._quick=null,this._itemName="",this._toast=null,"menu"===this.sheet&&(this._switcher=!1),"region"!==this.sheet||this._regions||this._loadRegions(),"people"===this.sheet&&(this._edit=null,this._loadPeople()));const t=this.renderRoot.querySelector(".sheet");t&&!t._swipe&&(t._swipe=!0,c(t,()=>this._close())),"shopping"===this._quick&&e.has("_quick")&&this.renderRoot.querySelector(".field input")?.focus()}async _ws(e){this._busy=!0,this._error=null;try{return await this.hass.callWS(e)}catch(e){return this._error=e?.message||"Something went wrong",null}finally{this._busy=!1}}async _createHousehold(){const e=this._newName.trim();if(!e)return;const t=await this._ws({type:"ksh_family_hub/households/create",name:e});t&&(this._newName="",this._emit("hub-households-changed",{select:t.household.id}),this._switcher=!1)}async _addMember(e){const t=this._active;await this._ws({type:"ksh_family_hub/households/add_member",household_id:t.id,user_id:e})&&this._emit("hub-households-changed",{})}async _removeMember(e){const t=this._active;await this._ws({type:"ksh_family_hub/households/remove_member",household_id:t.id,user_id:e})&&this._emit("hub-households-changed",{})}async _deleteHousehold(){const e=this._active;if(!confirm(`Delete the household "${e.name}"? Its members lose access to it.`))return;await this._ws({type:"ksh_family_hub/households/delete",household_id:e.id})&&(this._emit("hub-households-changed",{}),this._open("menu"))}async _renameHousehold(){const e=this._active,t=prompt("Household name",e.name);if(!t||!t.trim()||t.trim()===e.name)return;await this._ws({type:"ksh_family_hub/households/update",household_id:e.id,name:t.trim()})&&this._emit("hub-households-changed",{})}async _addShoppingItem(e){e?.preventDefault();const t=this._itemName.trim();if(!t)return;const i=await this._ws({type:"ksh_shopping/lists/get_all"});if(!i)return;const s=i.lists||[],a=s.find(e=>e.active)||s[0];if(!a)return void(this._error="Create a shopping list first.");await this._ws({type:"ksh_shopping/items/add",list_id:a.id,name:t,category_id:"other"})&&(this._toast=`Added “${t}” to ${a.name}`,this._itemName="",this.renderRoot.querySelector(".field input")?.focus())}_pickQuick(e){e.soon||("shopping"!==e.id?this._emit("hub-quick",{id:e.id}):this._quick="shopping")}async _loadPeople(){try{const e=await I(this.hass);this._people=e.people,this._me=e.me}catch(e){this._error=e?.message||"Could not load people"}this._loadLogins()}async _loadLogins(){try{const e=$(this.hass,this._people,this._me);this._logins=(await this.hass.callWS({type:"ksh_family_hub/people/users",...F(this.hass,e)})).users}catch{this._logins=[]}}get _iAmAdult(){const e=this._people.find(e=>e.id===$(this.hass,this._people,this._me));return e?"adult"===e.role:!!this.hass?.user?.is_admin}_startPerson(e){this._edit=e?e.id:"new",this._form=e?{name:e.full_name||e.name,preferred:e.preferred_name||"",photo:e.photo||null,photoOrig:e.photo||null,role:e.role,emoji:e.emoji,pin:"",clearPin:!1,notify:e.notify||"",user_id:e.user_id||""}:{name:"",preferred:"",photo:null,role:"child",emoji:"🙂",pin:"",clearPin:!1,notify:"",user_id:""},this._error=null}async _savePerson(){const e=this._form;if(!e.name.trim())return void(this._error="Give them a name");if(e.pin&&!/^\d{4}$/.test(e.pin))return void(this._error="A PIN is four digits");const t=$(this.hass,this._people,this._me),i={name:e.name.trim(),preferred_name:e.preferred.trim()||null,role:e.role,emoji:e.emoji||"🙂",..."new"===this._edit?e.photo?{photo:e.photo}:{}:e.photo!==e.photoOrig?{photo:e.photo||null}:{},notify:e.notify.trim()||null,user_id:e.user_id||null,...F(this.hass,t)};let s;s="new"===this._edit?await this._ws({type:"ksh_family_hub/people/add",...i,...e.pin?{pin:e.pin}:{}}):await this._ws({type:"ksh_family_hub/people/update",person_id:this._edit,...i,...e.pin?{pin:e.pin}:e.clearPin?{pin:null}:{}}),s&&(this._edit=null,this._form=null,this._loadPeople())}async _deletePerson(){const e=this._people.find(e=>e.id===this._edit);if(!confirm(`Remove ${e.name}? ${e.user_id?"Their Home Assistant login is not touched. ":""}Points they earned stay in the history.`))return;const t=$(this.hass,this._people,this._me);await this._ws({type:"ksh_family_hub/people/delete",person_id:e.id,...F(this.hass,t)})&&(this._edit=null,this._form=null,this._loadPeople())}async _loadRegions(){if(this.modules?.shopping)try{const e=await this.hass.callWS({type:"ksh_shopping/get_integration_settings"}),t=Object.fromEntries(Object.entries(e.custom_regions||{}).map(([e,t])=>[e,"string"==typeof t?t:t?.name||e]));this._regions={...e.available_countries||{},...t},this._country=e.country||""}catch(e){this._regions={},this._error="Could not load the regions."}else this._regions={}}async _setRegion(e){if(!e||e===this._country)return;const t=this._regions[e]||e;if(!confirm(`Switch the shopping catalogue to ${t}?\n\nThe built-in products are replaced with ${t} products. Products you created yourself are kept.`))return void this.requestUpdate();const i=await this._ws({type:"ksh_shopping/set_country",country:e});i&&(this._country=i.country,this._toast=`Region set to ${t}`,this._emit("hub-region-changed",{country:i.country}))}render(){return this.sheet?a`
      <div class="scrim" @click=${this._close}></div>
      <section class="sheet" role="dialog" aria-label=${this._label}
  >
        <div class="grabber"></div>
        ${"menu"===this.sheet?this._menu():e}
        ${"quick"===this.sheet?this._quickSheet():e}
        ${"invite"===this.sheet?this._invite():e}
        ${"region"===this.sheet?this._region():e}
        ${"people"===this.sheet?this._peopleSheet():e}
      </section>`:e}get _label(){return{menu:"Menu",quick:"Quick add",invite:"Invite member",region:"Region and language",people:"People and guests"}[this.sheet]||""}_head(t,i,s){return a`
      <div class="head">
        ${i||s?a`<button class="back" aria-label="Back" @click=${s||(()=>this._open("menu"))}><ha-icon icon="mdi:arrow-left"></ha-icon></button>`:e}
        <h2>${t}</h2>
      </div>`}_row(t,i,s,{sub:o="",color:n="var(--hub-accent)",chevron:r=!1,disabled:h=!1,pill:l=""}={}){return a`
      <button class="row" ?disabled=${h} @click=${s} style="--c:${n}">
        <span class="ico"><ha-icon icon=${t}></ha-icon></span>
        <span class="txt"><b>${i}</b>${o?a`<small>${o}</small>`:e}</span>
        ${l?a`<span class="pill">${l}</span>`:e}
        ${r?a`<ha-icon class="chev" icon=${!0===r?"mdi:chevron-right":r}></ha-icon>`:e}
      </button>`}_menu(){const t=this._active,i=this.households.length>1;return a`
      ${this._row("mdi:home-heart",t?.name||"Household",()=>{this._switcher=!this._switcher},{sub:t?.everyone?"Everyone on this Home Assistant":`${t?.members?.length??0} member${1===t?.members?.length?"":"s"}`,chevron:this._switcher?"mdi:chevron-up":"mdi:chevron-down",color:"var(--hub-accent)"})}
      ${this._switcher?a`
        <div class="switcher">
          ${this.households.map(e=>a`
            <button class="opt ${e.id===t?.id?"on":""}" @click=${()=>{this._emit("hub-household-select",{id:e.id}),this._switcher=!1}}>
              <ha-icon icon=${e.id===t?.id?"mdi:check-circle":"mdi:circle-outline"}></ha-icon>
              <span>${e.name}</span>
            </button>`)}
          <form class="new" @submit=${e=>{e.preventDefault(),this._createHousehold()}}>
            <input placeholder="New household name" .value=${this._newName} maxlength="60"
              @input=${e=>{this._newName=e.target.value}}>
            <button type="submit" ?disabled=${!this._newName.trim()||this._busy}>Create</button>
          </form>
          ${i?e:a`<p class="hint">Make another household to share with a flat, friends or other family.</p>`}
        </div>`:e}
      ${this._error?a`<p class="err">${this._error}</p>`:e}
      <div class="divider"></div>
      ${this._row("mdi:account-plus-outline","Invite member",()=>this._open("invite"),{color:"#6f80f2"})}
      ${this._row("mdi:account-child-outline","People & guests",()=>this._open("people"),{color:"#e2ac3f"})}
      ${this._row("mdi:cog-outline","Settings",()=>this._emit("hub-open-settings"),{color:"#9fb2c5"})}
      ${this._row("mdi:translate","Change Region/Language",()=>this._open("region"),{color:"#4a86f0"})}
      ${this.panel?a`
        <div class="divider"></div>
        ${this._row("mdi:menu","Home Assistant menu",()=>{this._close(),this._emit("hass-toggle-menu")},{color:"#9fb2c5"})}`:e}`}_quickSheet(){if("shopping"===this._quick)return a`
        ${this._head("Add to shopping list",!0)}
        <form class="field" @submit=${this._addShoppingItem}>
          <input placeholder="e.g. Milk" .value=${this._itemName} @input=${e=>{this._itemName=e.target.value}} enterkeyhint="done">
          <button type="submit" ?disabled=${!this._itemName.trim()||this._busy}>Add</button>
        </form>
        ${this._toast?a`<p class="ok"><ha-icon icon="mdi:check-circle"></ha-icon>${this._toast}</p>`:e}
        ${this._error?a`<p class="err">${this._error}</p>`:e}`;const t=this.hidden||[],i=ue.filter(e=>(!e.module||this.modules?.[e.module])&&!t.includes(e.id));return a`
      ${this._head("Quick add")}
      ${i.map(e=>this._row(e.icon,e.label,()=>this._pickQuick(e),{color:e.color,disabled:!!e.soon,pill:e.soon?"Soon":"",chevron:!e.soon}))}`}_invite(){const t=this._active;if(!t)return a`${this._head("Invite member",!0)}<p class="hint">No household yet.</p>`;const i=this._haPeople,s=i.filter(e=>!t.members.includes(e.user_id));return a`
      ${this._head(`Invite to ${t.name}`,!0)}
      ${t.everyone?a`
        <p class="hint">Everyone who has a login on this Home Assistant is already in <b>${t.name}</b>.
          To share with only some people (a flat, friends, grandparents), make a separate household and invite them to it.</p>
        ${this._row("mdi:plus-circle-outline","New household",()=>{this._open("menu"),this._switcher=!0},{color:"#4fd1a1",chevron:!0})}`:a`
        <h3>Members</h3>
        ${t.members.map(s=>a`
          <div class="member">
            <span class="ico"><ha-icon icon="mdi:account-outline"></ha-icon></span>
            <span class="txt"><b>${(e=>i.find(t=>t.user_id===e)?.name||"Unknown user")(s)}</b>${s===t.owner_id?a`<small>Owner</small>`:e}</span>
            ${t.can_manage&&s!==t.owner_id?a`
              <button class="mini" @click=${()=>this._removeMember(s)} ?disabled=${this._busy}>Remove</button>`:e}
          </div>`)}
        ${t.can_manage?a`
          <h3>Add someone</h3>
          ${s.length?s.map(e=>a`
            <div class="member">
              <span class="ico"><ha-icon icon="mdi:account-plus-outline"></ha-icon></span>
              <span class="txt"><b>${e.name}</b></span>
              <button class="mini add" @click=${()=>this._addMember(e.user_id)} ?disabled=${this._busy}>Add</button>
            </div>`):a`<p class="hint">Everyone with a login is already a member.
              People need their own Home Assistant login (and a Person) before they can be added.</p>`}
          <div class="divider"></div>
          ${this._row("mdi:pencil-outline","Rename household",()=>this._renameHousehold(),{color:"#9fb2c5"})}
          ${this._row("mdi:trash-can-outline","Delete household",()=>this._deleteHousehold(),{color:"#e46d5e"})}`:a`<p class="hint">Only the owner can add people.</p>`}`}
      ${this._row("mdi:account-child-outline","Add someone without a login",()=>this._open("people"),{color:"#e2ac3f",sub:"Children and guests",chevron:!0})}
      ${this._error?a`<p class="err">${this._error}</p>`:e}`}_peopleSheet(){const t={adult:"Adult",child:"Child",guest:"Guest"};if(this._edit){const i=this._form,s=this._people.find(e=>e.id===this._edit),o=e=>{this._form={...this._form,...e}};return a`
        ${this._head("new"===this._edit?"Add a person":`Edit ${s?.name||""}`,!1,()=>{this._edit=null,this._error=null})}
        <div class="pform">
          <label>Name<input maxlength="40" .value=${i.name} @input=${e=>o({name:e.target.value})} placeholder="e.g. Leo Smith"></label>
          <label>Preferred name <small>(optional)</small>
            <input maxlength="40" .value=${i.preferred} @input=${e=>o({preferred:e.target.value})} placeholder="e.g. Leo"></label>
          <p class="hint">${i.preferred.trim()?`${i.preferred.trim()} is shown everywhere in the hub.`:"Shown everywhere in the hub. Leave it blank to use the name above. It is never taken from the Home Assistant login."}</p>
          <label>Role</label>
          <div class="seg">${Object.entries(t).map(([e,t])=>a`<button type="button" class=${i.role===e?"on":""} @click=${()=>o({role:e})}>${t}</button>`)}</div>
          <p class="hint">${{adult:"Adults manage chores, approve them and look after people.",child:"Children do chores and routines. An adult approves them.",guest:"Guests only see chores that are assigned to them."}[i.role]}</p>
          <label>Home Assistant login <small>(optional)</small>
            <select .value=${i.user_id} @change=${e=>o({user_id:e.target.value})}>
              <option value="" ?selected=${!i.user_id}>No login (picked on a shared tablet)</option>
              ${this._logins.filter(e=>!e.linked_to||e.linked_to===s?.id).map(e=>a`
                <option value=${e.id} ?selected=${i.user_id===e.id}>${e.name}${e.is_admin?" (administrator)":""}</option>`)}
            </select></label>
          <p class="hint">${i.user_id?`That login is always ${i.name.trim()||"this person"}: chores are done as them on any device they sign in to, with no PIN needed.`:"Children, grandparents and guests do not need a login. Pick one only if this person has their own Home Assistant account."}</p>
          <label>Picture</label>
          ${this._pictureEditor(i,o)}
          <label>PIN <small>(4 digits)</small>
            <input type="password" inputmode="numeric" maxlength="4" autocomplete="off" .value=${i.pin} placeholder=${s?.has_pin?"Type a new PIN to change it":"4 digits"}
              @input=${e=>o({pin:e.target.value.replace(/\D/g,""),clearPin:!1})}></label>
          ${s?.has_pin?a`<button type="button" class="linkbtn" @click=${()=>o({pin:"",clearPin:!i.clearPin})}>${i.clearPin?"The PIN will be removed. Undo":"Remove the PIN"}</button>`:e}
          <p class="hint">With a PIN, ${i.name.trim()||"they"} can pick their own name on any device and tick off their own chores and routines by typing it.
            It also stops someone else switching to this profile. On a shared login, adults must have a PIN.</p>
          <label>Phone notifications <small>(optional)</small>
            <input .value=${i.notify} placeholder="notify.mobile_app_their_phone" @input=${e=>o({notify:e.target.value})}></label>
          <p class="hint">The notify service of their phone in Home Assistant, used for chore reminders.</p>
          ${this._error?a`<p class="err">${this._error}</p>`:e}
          <div class="actions">
            ${"new"!==this._edit?a`<button class="danger" @click=${()=>this._deletePerson()} ?disabled=${this._busy}>Remove</button>`:e}
            <button class="save" @click=${()=>this._savePerson()} ?disabled=${this._busy}>Save</button>
          </div>
        </div>`}return a`
      ${this._head("People & guests",!0)}
      <p class="hint">Everyone who uses the hub. Nobody is added for you: an adult adds each person here, and can link them to a Home Assistant login
        if they have one. Children and guests do not need a login; they are picked on a shared tablet.</p>
      ${this._people.length?e:a`<p class="hint"><b>Start by adding yourself</b> and link your own login, then the children.</p>`}
      ${this._people.map(i=>a`
        <button class="row" ?disabled=${!this._iAmAdult} @click=${()=>this._startPerson(i)} style="--c:${i.color}">
          <span class="pic">${G(this.hass,i,42)}</span>
          <span class="txt"><b>${i.name}</b><small>${t[i.role]}${i.user_id?` · ${this._logins.find(e=>e.id===i.user_id)?.name||"has a login"}`:" · no login"}${i.has_pin?" · PIN":""}</small></span>
          ${this._iAmAdult?a`<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>`:e}
        </button>`)}
      ${this._iAmAdult?this._row("mdi:account-plus-outline","Add a person",()=>this._startPerson(null),{color:"#4fd1a1"}):a`<p class="hint">Only an adult can add or change people.</p>`}
      ${this._error?a`<p class="err">${this._error}</p>`:e}`}_pictureEditor(t,i){const s=t.photo?"ha"===t.photo?"ha":"own":"emoji",o={...t,name:t.preferred.trim()||t.name,color:this._people.find(e=>e.id===this._edit)?.color},n=U(this.hass,{user_id:t.user_id});return a`
      <div class="picrow">${G(this.hass,o,64)}
        <div class="seg">
          <button type="button" class=${"emoji"===s?"on":""} @click=${()=>i({photo:null})}>Emoji</button>
          <button type="button" class=${"ha"===s?"on":""} ?disabled=${!t.user_id} @click=${()=>i({photo:"ha"})}>HA picture</button>
          <button type="button" class=${"own"===s?"on":""} @click=${()=>this.renderRoot.querySelector("#photo-in")?.click()}>My own</button>
        </div>
        <input id="photo-in" type="file" accept="image/*" hidden @change=${async e=>{const t=e.target.files?.[0];if(t)try{i({photo:await J(t)}),this._error=null}catch(e){this._error=e.message}}}>
      </div>
      ${"ha"!==s||n?e:a`<p class="hint">Home Assistant has no picture for that login yet. Add one to the person in Settings → People, or choose another option.</p>`}
      ${t.user_id||"own"===s?e:a`<p class="hint">The Home Assistant picture needs a linked login.</p>`}
      ${"own"===s?a`<button type="button" class="linkbtn" @click=${()=>i({photo:null})}>Remove the picture</button>`:e}
      ${"emoji"===s?a`
        <ksh-emoji-picker .value=${t.emoji} .quick=${re} @emoji-pick=${e=>i({emoji:e.detail.emoji})}></ksh-emoji-picker>`:e}`}_region(){const t=this._regions;return a`
      ${this._head("Region & language",!0)}
      <label class="sel">
        <span>Language</span>
        <select @change=${e=>this._emit("hub-set-language",{code:e.target.value})}>
          ${pe.map(([e,t])=>a`<option value=${e} ?selected=${e===(this.language||"en")}>${t}</option>`)}
        </select>
      </label>
      <p class="hint">Applies to the recipe book. More of the hub will be translated later.</p>
      ${this.modules?.shopping?a`
        <label class="sel">
          <span>Region</span>
          <select @change=${e=>this._setRegion(e.target.value)} ?disabled=${!t||this._busy}>
            ${t?Object.entries(t).map(([e,t])=>a`<option value=${e} ?selected=${e===this._country}>${t}</option>`):a`<option>Loading…</option>`}
          </select>
        </label>
        <p class="hint">Sets the shopping catalogue, currency and supermarkets.</p>`:e}
      ${this._toast?a`<p class="ok"><ha-icon icon="mdi:check-circle"></ha-icon>${this._toast}</p>`:e}
      ${this._error?a`<p class="err">${this._error}</p>`:e}`}static styles=[Y,i`
    :host { position: absolute; inset: 0; z-index: 30; pointer-events: none; display: block; }
    :host([sheet]) { pointer-events: auto; }
    * { box-sizing: border-box; }
    button, input, select { font: inherit; color: inherit; }
    .scrim { position: absolute; inset: 0; background: rgba(4, 12, 20, 0.55); animation: fade .18s ease; }
    .sheet {
      position: absolute; left: 0; right: 0; bottom: 0; max-height: 88%; overflow-y: auto; overscroll-behavior: contain;
      max-width: 560px; margin: 0 auto;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
      box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1); color: var(--hub-text);
    }
    @media (min-width: 700px) { .sheet { bottom: 12px; border-radius: 28px; } }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160, 190, 215, .55); margin: 2px auto 14px; }
    .head { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; }
    .head h2 { margin: 0; font-size: 18px; font-weight: 800; }
    .back { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--hub-border); background: var(--hub-surface); cursor: pointer;
      display: flex; align-items: center; justify-content: center; color: var(--hub-muted); }
    h3 { margin: 16px 4px 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: var(--hub-muted); }
    .row {
      width: 100%; display: flex; align-items: center; gap: 14px; padding: 11px 8px; border: none; background: none; cursor: pointer;
      border-radius: 16px; text-align: left; -webkit-tap-highlight-color: transparent;
    }
    .row:hover:not([disabled]) { background: var(--hub-surface-2); }
    .row[disabled] { cursor: default; opacity: .6; }
    .ico {
      width: 42px; height: 42px; border-radius: 14px; flex: none; display: inline-flex; align-items: center; justify-content: center;
      background: var(--hub-surface-2); color: var(--hub-muted); --mdc-icon-size: 24px;
    }
    .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .txt b { font-size: 15.5px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .txt small { color: var(--hub-muted); font-size: 12.5px; }
    .chev { color: var(--hub-muted); --mdc-icon-size: 22px; }
    .pill { font-size: 11px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px;
      background: var(--hub-surface-2); color: var(--hub-muted); }
    .divider { height: 1px; background: var(--hub-border); margin: 6px 8px; }
    .switcher { margin: 2px 8px 6px 64px; display: grid; gap: 2px; }
    .opt { display: flex; align-items: center; gap: 10px; padding: 8px 6px; border: none; background: none; cursor: pointer; border-radius: 12px; text-align: left; font-weight: 600; }
    .opt:hover { background: var(--hub-surface-2); }
    .opt ha-icon { --mdc-icon-size: 20px; color: var(--hub-muted); }
    .opt.on ha-icon { color: var(--hub-accent); }
    .new, .field { display: flex; gap: 8px; margin-top: 6px; }
    .field { margin: 8px 4px 0; }
    .new input, .field input, .sel select {
      flex: 1; min-width: 0; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border);
      background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px;
    }
    .new input:focus, .field input:focus, .sel select:focus { border-color: var(--hub-accent); }
    .new button, .field button, .mini {
      border: none; border-radius: 999px; padding: 0 18px; cursor: pointer; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
    .new button, .field button { min-height: 42px; }
    .new button[disabled], .field button[disabled], .mini[disabled] { opacity: .45; cursor: default; }
    .member { display: flex; align-items: center; gap: 12px; padding: 7px 8px; }
    .member .ico { width: 38px; height: 38px; border-radius: 12px; --c: var(--hub-muted); }
    .mini { padding: 7px 14px; font-size: 13px; background: var(--hub-surface-2); color: var(--hub-text); border: 1px solid var(--hub-border); }
    .mini.add { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .sel { display: flex; align-items: center; gap: 12px; margin: 10px 4px 0; }
    .sel span { width: 84px; font-weight: 700; flex: none; }
    .hint { margin: 8px 6px 0; color: var(--hub-muted); font-size: 13.5px; line-height: 1.45; }
    .err { margin: 8px 6px 0; color: #e8685a; font-size: 13.5px; }
    .ok { margin: 10px 6px 0; display: flex; align-items: center; gap: 6px; color: var(--hub-accent); font-size: 14px; font-weight: 600; }
    .ok ha-icon { --mdc-icon-size: 18px; }
    .pform { display: grid; gap: 8px; }
    .pform label { display: grid; gap: 6px; font-weight: 700; font-size: 13.5px; margin-top: 4px; }
    .pform label small { color: var(--hub-muted); font-weight: 500; }
    .pform input { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .pform select { width: 100%; padding: 11px 14px; border-radius: 14px; border: 1px solid var(--hub-border); background: var(--hub-surface); color: var(--hub-text); outline: none; font-size: 15px; }
    .pform input:focus, .pform select:focus { border-color: var(--hub-accent); }
    .seg { display: flex; border: 1px solid var(--hub-border); border-radius: 999px; overflow: hidden; }
    .seg button { flex: 1; background: transparent; border: none; padding: 9px 6px; font-weight: 700; color: var(--hub-muted); cursor: pointer; }
    .seg button.on { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .picrow { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .picrow .seg { flex: 1; min-width: 220px; }
    .pic { flex: none; display: inline-flex; }
    .emojis { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
    .emojis button { width: 38px; height: 38px; font-size: 20px; border-radius: 12px; border: 1px solid transparent; background: var(--hub-surface); cursor: pointer; }
    .emojis button.on { border-color: var(--hub-accent); }
    .emoji-in { width: 64px !important; text-align: center; font-size: 22px !important; padding: 6px !important; }
    .linkbtn { background: none; border: none; color: var(--hub-accent); font-weight: 700; text-align: left; padding: 2px 0; cursor: pointer; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    .save { flex: 1; border: none; border-radius: 999px; padding: 11px 18px; font-weight: 800; background: var(--hub-accent); color: var(--hub-accent-ink); cursor: pointer; }
    .danger { border: 1px solid rgba(232,104,90,.5); background: transparent; color: #e8685a; border-radius: 999px; padding: 11px 18px; font-weight: 700; cursor: pointer; }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }
  `]}customElements.define("ksh-hub-sheets",be);const me=[{id:"tape",label:"Ticker tape",icon:"🎊",hint:"Streamers and confetti fall from the top"},{id:"fireworks",label:"Fireworks",icon:"🎆",hint:"Rockets burst across the sky"},{id:"balloons",label:"Balloons",icon:"🎈",hint:"Colourful balloons float up"},{id:"stars",label:"Star shower",icon:"🌟",hint:"Golden stars twinkle down"}],ge="tape",fe=["#ff5d73","#ffb020","#ffe14d","#4fd1a1","#3db6cc","#6f80f2","#cf6fb6","#ffffff"],_e=(e,t)=>e+Math.random()*(t-e),xe=e=>e[Math.floor(Math.random()*e.length)];function ve(e,t=ge,{big:i=!1,force:s=!1}={}){if(!e||"off"===t||!we[t])return;if(!s&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;const a=e.renderRoot||e.shadowRoot||e,o=e.getBoundingClientRect(),n=Math.max(o.width,200),r=Math.max(o.height,200),h=Math.min(window.devicePixelRatio||1,2),l=document.createElement("canvas");l.width=n*h,l.height=r*h,l.setAttribute("aria-hidden","true"),l.style.cssText="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:120;",a.appendChild(l);const d=l.getContext("2d");d.scale(h,h);const c=we[t](n,r,i),p=performance.now();let u=p;const b=e=>{const t=Math.min(.05,(e-u)/1e3);u=e,d.clearRect(0,0,n,r),d.globalCompositeOperation="source-over";c.step(d,t,(e-p)/1e3)&&e-p<(c.max||5500)?requestAnimationFrame(b):l.remove()};requestAnimationFrame(b)}function ye(e,t,i,s,a){e.beginPath();for(let o=0;o<10;o++){const n=a+o*Math.PI/5-Math.PI/2,r=o%2?.45*s:s;0===o?e.moveTo(t+Math.cos(n)*r,i+Math.sin(n)*r):e.lineTo(t+Math.cos(n)*r,i+Math.sin(n)*r)}e.closePath(),e.fill()}const we={tape:function(e,t,i){const s=i?240:120,a=i?1.4:.8,o=Array.from({length:s},()=>({ribbon:Math.random()<.3,at:_e(0,a),x:_e(0,e),y:_e(-30,-10),vy:t*_e(.3,.58),sway:_e(10,40),f:_e(1.5,4),ph:_e(0,6.3),rot:_e(0,6.3),vr:_e(-6,6),c:xe(fe),len:_e(40,90),sz:_e(6,11)}));return{step(e,i,s){let a=!1;for(const n of o){if(s<n.at){a=!0;continue}n.y+=n.vy*i,n.rot+=n.vr*i;const o=n.x+Math.sin(s*n.f+n.ph)*n.sway;if(!(n.y>t+100))if(a=!0,e.fillStyle=e.strokeStyle=n.c,n.ribbon){e.lineWidth=4,e.lineCap="round",e.beginPath();for(let t=0;t<=8;t++){const i=n.y-t*(n.len/8),a=o+7*Math.sin(5*s+n.ph+.8*t);0===t?e.moveTo(a,i):e.lineTo(a,i)}e.stroke()}else e.save(),e.translate(o,n.y),e.rotate(n.rot),e.scale(1,Math.cos(s*n.f*2+n.ph)),e.fillRect(-n.sz/2,.7*-n.sz,n.sz,1.4*n.sz),e.restore()}return a}}},fireworks:function(e,t,i){const s=Math.max(Math.min(e,t),380),a=i?11:5,o=i?.27:.42,n=Array.from({length:a},(i,a)=>{const n=_e(.12*e,.88*e);return{at:a*o+_e(0,.18),x0:n,bx:n+_e(-50,50),by:_e(.12*t,.5*t),dur:_e(.55,.75),state:"wait",kind:xe(["peony","peony","ring","willow"]),c:xe(fe.slice(0,7)),c2:xe(fe.slice(0,7)),R:s*_e(.34,.5),sparks:[],flash:0}}),r=n[a-1].at+.8+2.4;return{max:7e3,step(s,a,o){const h=.34*Math.min(1,o/.3)*Math.min(1,Math.max(0,(r-o)/.7));s.fillStyle=`rgba(3,8,18,${h})`,s.fillRect(0,0,e,t),s.globalCompositeOperation="lighter";let l=o<r;for(const e of n){if("done"===e.state)continue;if(o<e.at)continue;const n=(o-e.at)/e.dur;if(n<1){const i=e=>1-(1-e)*(1-e),a=e.x0+(e.bx-e.x0)*n,o=t+(e.by-t)*i(n),r=Math.max(0,n-.12),h=e.x0+(e.bx-e.x0)*r,l=t+(e.by-t)*i(r);s.lineCap="round",s.strokeStyle="rgba(255,226,150,.9)",s.lineWidth=3.2,s.beginPath(),s.moveTo(h,l),s.lineTo(a,o),s.stroke(),s.fillStyle="#fff6d8",s.beginPath(),s.arc(a,o,3.4,0,2*Math.PI),s.fill(),e.state="fly";continue}if("burst"!==e.state){e.state="burst",e.flash=1;const t="ring"===e.kind?90:"willow"===e.kind?110:i?210:170;e.sparks=Array.from({length:t},(i,s)=>{const a="ring"===e.kind?s/t*Math.PI*2:Math.random()*Math.PI*2;let o;o="ring"===e.kind?1.6*e.R:"willow"===e.kind?e.R*_e(.5,1.3):1.7*e.R*Math.sqrt(Math.random());const n="peony"===e.kind&&o<.8*e.R;return{x:e.bx,y:e.by,vx:Math.cos(a)*o,vy:Math.sin(a)*o,age:0,trail:[],life:"willow"===e.kind?_e(1.9,2.6):_e(1.3,2.1),c:"willow"===e.kind?"#ffcf5a":n?e.c2:e.c,glitter:Math.random()<.35,grav:"willow"===e.kind?190:120}})}if(e.flash>0){const t=s.createRadialGradient(e.bx,e.by,0,e.bx,e.by,.7*e.R);t.addColorStop(0,`rgba(255,250,235,${.85*e.flash})`),t.addColorStop(1,"rgba(255,250,235,0)"),s.fillStyle=t,s.beginPath(),s.arc(e.bx,e.by,.7*e.R,0,2*Math.PI),s.fill(),e.flash=Math.max(0,e.flash-5*a)}let r=!1;for(const t of e.sparks){if(t.age+=a,t.age>t.life)continue;r=!0;const e=Math.exp(-1.6*a);t.vx*=e,t.vy=t.vy*e+t.grav*a,t.x+=t.vx*a,t.y+=t.vy*a,t.trail.push(t.x,t.y),t.trail.length>14&&t.trail.splice(0,2);const i=Math.max(0,1-t.age/t.life),o=t.glitter&&t.age>.5*t.life&&Math.random()<.5?.25:1;s.globalAlpha=Math.min(1,1.4*i)*o,s.strokeStyle=t.c,s.lineWidth=3*(.5+.6*i),s.lineCap="round",s.beginPath(),s.moveTo(t.trail[0],t.trail[1]);for(let e=2;e<t.trail.length;e+=2)s.lineTo(t.trail[e],t.trail[e+1]);s.stroke(),s.fillStyle="#fff",s.globalAlpha*=.85,s.beginPath(),s.arc(t.x,t.y,1.6+1.2*i,0,2*Math.PI),s.fill()}s.globalAlpha=1,r||(e.state="done")}return l||n.some(e=>"done"!==e.state&&o>=e.at)}}},balloons:function(e,t,i){const s=i?30:14,a=Array.from({length:s},()=>({at:_e(0,i?1.4:.8),x:_e(20,e-20),y:t+80,vy:t*_e(.3,.5),r:_e(20,32),c:xe(fe.slice(0,7)),f:_e(1,2.4),ph:_e(0,6.3),sway:_e(14,34)}));return{step(e,t,i){let s=!1;for(const o of a){if(i<o.at){s=!0;continue}if(o.y-=o.vy*t,o.y<-120)continue;s=!0;const a=o.x+Math.sin(i*o.f+o.ph)*o.sway,n=1.25*o.r;e.strokeStyle="rgba(255,255,255,.55)",e.lineWidth=1.4,e.beginPath(),e.moveTo(a,o.y+n),e.bezierCurveTo(a-8,o.y+n+18,a+8,o.y+n+34,a,o.y+n+52),e.stroke(),e.fillStyle=o.c,e.beginPath(),e.ellipse(a,o.y,o.r,n,0,0,2*Math.PI),e.fill(),e.beginPath(),e.moveTo(a,o.y+n-1),e.lineTo(a-5,o.y+n+7),e.lineTo(a+5,o.y+n+7),e.closePath(),e.fill(),e.fillStyle="rgba(255,255,255,.38)",e.beginPath(),e.ellipse(a-.35*o.r,o.y-.35*n,.2*o.r,.32*n,-.5,0,2*Math.PI),e.fill()}return s}}},stars:function(e,t,i){const s=i?100:50,a=Array.from({length:s},()=>({at:_e(0,i?1.4:.8),x:_e(0,e),y:-20,vy:t*_e(.28,.5),r:_e(7,17),rot:_e(0,6.3),vr:_e(-2,2),tw:_e(4,9),ph:_e(0,6.3),c:xe(["#ffd54a","#ffe98a","#ffffff","#ffb020","#ffd54a"]),sway:_e(6,24)}));return{step(e,i,s){e.globalCompositeOperation="lighter";let o=!1;for(const n of a){if(s<n.at){o=!0;continue}if(n.y+=n.vy*i,n.rot+=n.vr*i,n.y>t+40)continue;o=!0;const a=n.x+Math.sin(1.6*s+n.ph)*n.sway,r=.6+.4*Math.sin(s*n.tw+n.ph);e.fillStyle=n.c,e.globalAlpha=.16*r,e.beginPath(),e.arc(a,n.y,1.9*n.r,0,2*Math.PI),e.fill(),e.globalAlpha=.5+.5*r,ye(e,a,n.y,n.r*(.85+.15*r),n.rot),e.globalAlpha=.35*r,e.fillRect(a-.7,n.y-2.4*n.r,1.4,1.8*n.r)}return e.globalAlpha=1,o}}}};function ke(e){return e?.config?.currency||"NZD"}function $e(e,t,{sign:i=!1}={}){const s=(Number(t)||0)/100;let a;try{a=new Intl.NumberFormat(e?.locale?.language||void 0,{style:"currency",currency:ke(e)}).format(Math.abs(s))}catch{a=`${Math.abs(s).toFixed(2)}`}return s<0?`−${a}`:i&&s>0?`+${a}`:a}function Fe(e){const t=String(e??"").replace(/[^\d.,-]/g,"").replace(",",".");if(!t)return 0;const i=Number(t);return Number.isFinite(i)?Math.round(100*i):NaN}const Ee=e=>e?(e/100).toFixed(2).replace(/\.00$/,""):"",Ce=e=>`ksh_kids_token_${e}`,Se={galaxy:{a:"#7c5cff",b:"#ff5db1",bg:"#120a30"},candy:{a:"#ff5db1",b:"#ffb020",bg:"#2b0f2b"},ocean:{a:"#22c1d9",b:"#4f7cff",bg:"#07213a"},jungle:{a:"#3ed17e",b:"#e8d93a",bg:"#082a1c"}},je=[["chores","🧹","Chores"],["routines","☀️","Routines"],["points","⭐","Points"]];class Ae extends s{static properties={hass:{attribute:!1},_config:{state:!0},_people:{state:!0},_state:{state:!0},_tab:{state:!0},_run:{state:!0},_pin:{state:!0},_error:{state:!0},_toast:{state:!0},_busy:{state:!0}};constructor(){super(),this._config={},this._people=[],this._state=null,this._tab="chores",this._run=null,this._pin=null,this._error=null,this._toast=null,this._busy=!1,this._day=q()}static getStubConfig(){return{person:""}}setConfig(e){if(!e||!e.person)throw new Error('Set "person" to the name of the child');this._config={...e},e.height&&this.style.setProperty("--kids-height",String(e.height)),this.hass&&this._load()}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this._tick=setInterval(()=>{const e=q();e!==this._day&&(this._day=e,this._load()),this.requestUpdate()},6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._tick),clearTimeout(this._debounce),this._unsub?.(),this._unsub=null,this._started=!1}shouldUpdate(e){return 1!==e.size||!e.has("hass")||!this._started||A(e.get("hass"),this.hass,this._hassMemo||={})}updated(e){e.has("hass")&&this.hass&&(D(this.hass.config?.time_zone),this._started||(this._day=q())),e.has("hass")&&this.hass&&!this._started&&(this._started=!0,this._start())}async _start(){await this._load();try{this._unsub=await this.hass.connection.subscribeMessage(()=>{clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._load(),250)},{type:"ksh_chores/subscribe"})}catch{}}async _load(){try{const[e,t]=await Promise.all([I(this.hass),this.hass.callWS({type:"ksh_chores/get_state",date:this._day})]);this._people=e.people,this._state=t,this._error=this._me?null:`I cannot find “${this._config.person}”. Add them under People & guests, then check the name.`}catch(e){this._error=e?.message||"Could not load"}}get _me(){const e=String(this._config.person||"").trim().toLowerCase();return this._people.find(e=>e.id===this._config.person)||this._people.find(t=>t.name.toLowerCase()===e||(t.full_name||"").toLowerCase()===e)||null}_msg(e={}){const t=this._me,i=t?(e=>{try{return localStorage.getItem(Ce(e))||null}catch{return null}})(t.id):null;return{...e,as_person:t?.id,...i?{pin_token:i}:{}}}async _call(e,t={}){try{return await this.hass.callWS({type:`ksh_chores/${e}`,...this._msg(t)})}catch(e){return"pin_required"===e?.code?(this._pin={text:"",wrong:!1},null):(this._say("unauthorized"===e?.code?"This screen is not allowed to do that":e?.message||"That did not work"),null)}finally{clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._load(),250)}}_say(e){this._toast=e,clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toast=null},3500)}get _style(){return Se[this._config.style]||null}get _color(){return this._style?.a||this._me?.color||Se.galaxy.a}_mine(e){const t=e.assignees||[];return!t.length||t.includes(this._me?.id)}_chore(e){return this._state?.chores.find(t=>t.id===e)}get _chores(){const e=this._state,t=e=>({...e,chore:this._chore(e.chore_id)}),i=e=>e.chore&&this._mine(e.chore),s=(e?.items||[]).map(t).filter(i);return{todo:[...(e?.overdue||[]).map(t).filter(i).map(e=>({...e,late:!0})),...s.filter(e=>["open","rejected"].includes(e.status))],done:s.filter(e=>["done","approved"].includes(e.status))}}get _balance(){return this._state?.balances?.[this._me?.id]||0}get _free(){const e=(this._state?.redemptions||[]).filter(e=>e.person_id===this._me?.id&&"requested"===e.status).reduce((e,t)=>e+t.cost,0);return this._balance-e}_steps(e){return e.steps.filter(e=>!(e.days||[]).length||e.days.includes(H()))}get _routines(){return(this._state?.routines||[]).filter(e=>!1!==e.active&&(!(e.assignees||[]).length||e.assignees.includes(this._me?.id))&&this._steps(e).length)}_prog(e){const t=this._state?.runs?.[`${e.id}:${this._me?.id}`]||{steps:[],completed:!1},i=this._steps(e);return{run:t,steps:i,done:i.filter(e=>t.steps.includes(e.id)).length}}async _complete(e){if(this._busy)return;this._busy=!0;const t=this._chores.todo.length;this._state={...this._state,items:this._state.items.map(t=>t.chore_id===e.chore_id&&t.date===e.date?{...t,status:"done",done_by:this._me.id}:t),overdue:(this._state.overdue||[]).filter(t=>!(t.chore_id===e.chore_id&&t.date===e.date))};const i=await this._call("complete",{chore_id:e.chore_id,date:e.date});this._busy=!1,i&&(ve(this,i.celebration||ge,{big:t<=1}),this._say(i.awarded?`+${e.chore.points} ⭐  Amazing!`:"Done! A grown-up will check it ✨"))}async _undo(e){await this._call("reopen",{chore_id:e.chore_id,date:e.date})}async _step(e,t,i){const s=`${e.id}:${this._me.id}`,a=this._state.runs?.[s]||{steps:[],completed:!1},o=i?[...new Set([...a.steps,t])]:a.steps.filter(e=>e!==t);this._state={...this._state,runs:{...this._state.runs,[s]:{...a,steps:o}}};const n=await this._call("routines/step",{routine_id:e.id,step_id:t,done:i});n?.awarded&&(ve(this,n.celebration||ge,{big:!0}),this._say(`${e.name} done! +${e.points} ⭐`))}async _redeem(e){const t=await this._call("redeem",{reward_id:e.id});"approved"===t?.status?(ve(this,this._state?.celebrations?.[this._me?.id],{big:!1}),this._say(`Enjoy! ${e.emoji} ${e.name}`)):t&&this._say("Asked! Now wait for a yes 🤞")}async _submitPin(){const e=this._me,t=this._pin?.text||"";if(e&&!(t.length<4))try{const i=await this.hass.callWS({type:"ksh_family_hub/people/verify_pin",person_id:e.id,pin:t});if(!i.ok)return void(this._pin={text:"",wrong:!0});((e,t)=>{try{t?localStorage.setItem(Ce(e),t):localStorage.removeItem(Ce(e))}catch{}})(e.id,i.token),this._pin=null,this._load()}catch(e){this._pin={text:"",wrong:!0,message:e?.message}}}_key(e){const t=this._pin?.text||"",i="back"===e?t.slice(0,-1):(t+e).slice(0,4);this._pin={text:i,wrong:!1},4===i.length&&this._submitPin()}_greeting(){const e=(new Date).getHours();return`${e<5?"Sleepy time":e<12?"Good morning":e<17?"Hello":e<21?"Good evening":"Sleepy time"}, ${this._me?.name||""}!`}render(){const t=this._me,i=this._style,s=`--k:${this._color};--k2:${i?.b||`color-mix(in srgb, ${this._color} 55%, #ffb020)`};--bg:${i?.bg||`color-mix(in srgb, ${this._color} 18%, #0c0a22)`}`;if(this._error||!this._state||!t)return a`<div class="root" style=${s}><div class="sky"></div>
        <div class="msg"><div class="big">${this._error?"🙈":"✨"}</div><p>${this._error||"Getting ready…"}</p></div></div>`;const{todo:o,done:n}=this._chores,r=o.length+n.length;return a`
      <div class="root" style=${s}>
        <div class="sky"></div>
        <header>
          <div class="who">${G(this.hass,t,76)}</div>
          <div class="hello"><h1>${this._greeting()}</h1>
            <p>${r?o.length?`${o.length} to go today`:"All done today! 🎉":"No chores today 🎈"}</p></div>
          <div class="stars" title="Your stars"><span class="s">⭐</span><b>${this._balance}</b></div>
        </header>
        <main>
          ${"chores"===this._tab?this._choresView(o,n):e}
          ${"routines"===this._tab?this._routinesView():e}
          ${"points"===this._tab?this._pointsView():e}
        </main>
        <nav>${je.map(([t,i,s])=>a`
          <button class=${this._tab===t?"on":""} @click=${()=>{this._tab=t,this._run=null}}><span>${i}</span>${s}
            ${"chores"===t&&o.length?a`<i>${o.length}</i>`:e}</button>`)}</nav>
        ${this._run?this._runView():e}
        ${this._pin?this._pinView():e}
        ${this._toast?a`<div class="toast">${this._toast}</div>`:e}
      </div>`}_choresView(t,i){return t.length||i.length?a`
      ${t.length?a`<div class="grid">${t.map(t=>a`
        <button class="tile ${t.late?"late":""}" ?disabled=${this._busy} @click=${()=>this._complete(t)} aria-label="Done: ${t.chore.name}">
          <span class="em">${t.chore.emoji}</span>
          <b>${t.chore.name}</b>
          <small>${t.late?"Still to do!":t.chore.due_time?`by ${t.chore.due_time}`:""}</small>
          ${t.chore.points?a`<span class="pts">+${t.chore.points} ⭐</span>`:e}
          ${"rejected"===t.status?a`<small class="back">Try again 💪</small>`:e}
        </button>`)}</div>`:a`<div class="empty"><div class="big">🎉</div><p>Everything is done. You are a star!</p></div>`}
      ${i.length?a`<h2>Done ✔</h2>
        <div class="grid small">${i.map(e=>a`
          <button class="tile done" @click=${()=>"done"===e.status&&e.done_by===this._me.id&&this._undo(e)}
            title=${"done"===e.status?"Waiting for a grown-up":"Approved"}>
            <span class="em">${e.chore.emoji}</span>
            <b>${e.chore.name}</b>
            <small>${"approved"===e.status?`+${e.points??e.chore.points} ⭐ earned`:"A grown-up will check ✨"}</small>
          </button>`)}</div>`:e}`:a`<div class="empty"><div class="big">🎈</div><p>No chores today. Go and play!</p></div>`}_routinesView(){const e=this._routines;return e.length?a`<div class="routines">${e.map(e=>{const{run:t,steps:i,done:s}=this._prog(e);return a`
        <button class="routine ${t.completed?"complete":""}" @click=${()=>{this._run=e.id}}>
          <span class="em">${e.emoji}</span>
          <span class="rt"><b>${e.name}</b>
            <span class="dots">${i.map(e=>a`<i class=${t.steps.includes(e.id)?"on":""}></i>`)}</span></span>
          <span class="go">${t.completed?"🏆":s?`${s}/${i.length}`:"Start!"}</span>
        </button>`})}</div>`:a`<div class="empty"><div class="big">☀️</div><p>No routines today.</p></div>`}_runView(){const t=(this._state.routines||[]).find(e=>e.id===this._run);if(!t)return this._run=null,e;const{run:i,steps:s,done:o}=this._prog(t),n=s.find(e=>!i.steps.includes(e.id));return a`
      <div class="overlay" @click=${e=>{e.target===e.currentTarget&&(this._run=null)}}>
        <div class="panel">
          <button class="close" aria-label="Close" @click=${()=>{this._run=null}}>✕</button>
          <h2>${t.emoji} ${t.name}</h2>
          <div class="dots big">${s.map(e=>a`<i class=${i.steps.includes(e.id)?"on":""}></i>`)}</div>
          ${n?a`
            <div class="focus"><div class="fe">${n.emoji||"👉"}</div><div class="ft">${n.text}</div></div>
            <button class="donebtn" @click=${()=>this._step(t,n.id,!0)}>✔ Done!</button>`:a`<div class="focus"><div class="fe">🏆</div><div class="ft">All finished!</div></div>
              <button class="donebtn alt" @click=${()=>{this._run=null}}>Yay!</button>`}
          <div class="steplist">${s.map(e=>a`
            <button class=${i.steps.includes(e.id)?"on":""} @click=${()=>this._step(t,e.id,!i.steps.includes(e.id))}>
              <span>${i.steps.includes(e.id)?"✅":"⭕"}</span>${e.emoji||""} ${e.text}</button>`)}</div>
          <small class="count">${o} of ${s.length} done</small>
        </div>
      </div>`}_pointsView(){const t=this._state,i=this._me,s=t.pocket?.[i.id],o=(t.rewards||[]).filter(e=>!1!==e.active),n=(t.history||[]).filter(e=>e.person_id===i.id).slice(0,5),r=(t.redemptions||[]).filter(e=>e.person_id===i.id&&"requested"===e.status),h=this._free;return a`
      <div class="bank"><div class="bigstar">⭐</div><div><b>${this._balance}</b><span>stars</span></div></div>
      ${s?.enabled?a`<div class="pocket">
        <h3>💰 Pocket money</h3>
        <div class="meter"><i style="width:${Math.min(100,s.points?s.earned/s.points*100:0)}%"></i></div>
        <p>${s.starts_next?`Starts next ${s.period}!`:s.earned>=s.points?`${$e(this.hass,s.amount)} is on its way! 🎉`:`${s.earned} of ${s.points} ⭐ this ${s.period}. ${s.points-s.earned} more for ${$e(this.hass,s.amount)}`}</p></div>`:e}
      ${o.length?a`<h2>Spend your stars</h2>
        <div class="grid small">${o.map(e=>{const t=h>=e.cost,i=Math.min(100,e.cost?h/e.cost*100:100);return a`<button class="tile reward ${t?"":"locked"}" ?disabled=${!t} @click=${()=>this._redeem(e)}>
            <span class="em">${e.emoji}</span><b>${e.name}</b>
            <span class="pts">${e.cost} ⭐</span>
            <span class="mini"><i style="width:${i}%"></i></span>
            <small>${t?"Ask for it!":e.cost-h+" more to go"}</small></button>`})}</div>`:e}
      ${r.length?a`<p class="note">⏳ Waiting for a yes: ${r.map(e=>`${e.emoji} ${e.name}`).join(", ")}</p>`:e}
      ${n.length?a`<h2>Lately</h2><div class="lately">${n.map(e=>a`
        <div><span>${e.points>0?"⭐":"🎁"}</span><b>${e.reason}</b><em>${e.points>0?"+":""}${e.points}</em></div>`)}</div>`:e}`}_pinView(){const t=this._me,i=this._pin;return a`
      <div class="overlay">
        <div class="panel pin">
          <button class="close" aria-label="Close" @click=${()=>{this._pin=null}}>✕</button>
          <div class="who">${G(this.hass,t,64)}</div>
          <h2>${t.name}'s secret number</h2>
          <div class="pins ${i.wrong?"wrong":""}">${[0,1,2,3].map(e=>a`<i class=${e<i.text.length?"on":""}></i>`)}</div>
          ${i.wrong?a`<small class="count">${i.message||"Not quite. Try again!"}</small>`:e}
          <div class="keys">${["1","2","3","4","5","6","7","8","9"].map(e=>a`<button @click=${()=>this._key(e)}>${e}</button>`)}
            <span></span><button @click=${()=>this._key("0")}>0</button><button @click=${()=>this._key("back")} aria-label="Back">⌫</button></div>
        </div>
      </div>`}static styles=[Y,i`
    :host { display: block; position: relative; overflow: hidden; border-radius: var(--ha-card-border-radius, 24px);
      font-family: ui-rounded, 'SF Pro Rounded', 'Nunito', 'Quicksand', 'Segoe UI', system-ui, sans-serif; }
    * { box-sizing: border-box; }
    button { font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    .root { position: relative; display: flex; flex-direction: column; min-height: 480px; height: var(--kids-height, calc(100dvh - var(--header-height, 56px) - 16px)); color: #fff; padding: 18px 18px 14px;
      background: radial-gradient(120% 90% at 15% 0%, color-mix(in srgb, var(--k) 42%, var(--bg)) 0%, var(--bg) 62%); overflow: hidden; }
    .sky { position: absolute; inset: 0; pointer-events: none; opacity: .9;
      background:
        radial-gradient(2px 2px at 12% 18%, #fff 50%, transparent 52%), radial-gradient(2px 2px at 78% 12%, #fff 50%, transparent 52%),
        radial-gradient(3px 3px at 88% 44%, #ffe9a8 50%, transparent 52%), radial-gradient(2px 2px at 30% 62%, #fff 50%, transparent 52%),
        radial-gradient(3px 3px at 6% 80%, #ffe9a8 50%, transparent 52%), radial-gradient(2px 2px at 60% 88%, #fff 50%, transparent 52%),
        radial-gradient(2px 2px at 46% 30%, #fff 50%, transparent 52%), radial-gradient(3px 3px at 94% 90%, #fff 50%, transparent 52%);
      animation: twinkle 4s ease-in-out infinite alternate; }
    @keyframes twinkle { from { opacity: .35; } to { opacity: 1; } }
    header, main, nav { position: relative; z-index: 1; }
    main { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 2px 2px 14px; margin: 0 -2px; scrollbar-width: none; }
    main::-webkit-scrollbar { display: none; }
    header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .who { flex: none; display: inline-flex; filter: drop-shadow(0 0 14px var(--k)); }
    .who .av { border-width: 4px; }
    .hello { flex: 1; min-width: 0; }
    h1 { margin: 0; font-size: clamp(22px, 5vw, 38px); font-weight: 900; line-height: 1.1; text-shadow: 0 2px 12px rgba(0,0,0,.35); }
    .hello p { margin: 4px 0 0; font-size: clamp(14px, 2.6vw, 19px); opacity: .85; font-weight: 700; }
    .stars { flex: none; display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 999px; font-size: clamp(22px, 4.5vw, 34px); font-weight: 900;
      background: linear-gradient(135deg, #ffcf4a, #ff9f1c); color: #4a2b00; box-shadow: 0 6px 20px rgba(255,170,30,.45); }
    .stars .s { animation: spin 5s ease-in-out infinite; }
    @keyframes spin { 0%, 80%, 100% { transform: rotate(0) scale(1); } 90% { transform: rotate(20deg) scale(1.25); } }
    h2 { margin: 20px 4px 10px; font-size: clamp(18px, 3.4vw, 24px); font-weight: 900; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
    .grid.small { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
    .tile { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center;
      min-height: 150px; padding: 14px 10px; border-radius: 28px; border: 2px solid color-mix(in srgb, var(--k) 60%, transparent);
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 30%, rgba(255,255,255,.06)), rgba(255,255,255,.07));
      box-shadow: 0 8px 24px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.18); transition: transform .12s; }
    .tile:active:not([disabled]) { transform: scale(.94) rotate(-1deg); }
    .tile .em { font-size: clamp(44px, 9vw, 64px); line-height: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,.3)); }
    .tile b { font-size: clamp(15px, 2.8vw, 19px); font-weight: 800; line-height: 1.15; overflow-wrap: anywhere; }
    .tile.reward b { font-size: 15px; }
    .tile small { opacity: .8; font-size: 13px; font-weight: 700; }
    .pts { margin-top: 2px; padding: 3px 12px; border-radius: 999px; background: rgba(0,0,0,.28); font-weight: 900; font-size: 15px; }
    .tile.late { border-color: #ff6b6b; animation: wiggle 2.4s ease-in-out infinite; }
    .tile.late small { color: #ffb4b4; opacity: 1; }
    @keyframes wiggle { 0%, 88%, 100% { transform: rotate(0); } 92% { transform: rotate(-2.5deg); } 96% { transform: rotate(2.5deg); } }
    .tile .back { color: #ffe08a; opacity: 1; }
    .tile.done { min-height: 110px; border-color: #3ed17e; background: linear-gradient(160deg, rgba(62,209,126,.35), rgba(255,255,255,.05)); }
    .tile.done .em { font-size: 38px; }
    .tile.done::after { content: '✔'; position: absolute; top: 8px; right: 12px; font-size: 20px; color: #7dffb0; font-weight: 900; }
    .tile.locked { opacity: .78; }
    .tile.reward { min-height: 170px; }
    .mini { width: 86%; height: 8px; border-radius: 99px; background: rgba(0,0,0,.3); overflow: hidden; margin-top: 4px; }
    .mini i, .meter i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, #ffcf4a, #ff7eb3); }

    .routines { display: grid; gap: 14px; }
    .routine { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 30px; text-align: left; width: 100%;
      border: 2px solid color-mix(in srgb, var(--k) 60%, transparent);
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 28%, rgba(255,255,255,.06)), rgba(255,255,255,.07)); box-shadow: 0 8px 24px rgba(0,0,0,.28); }
    .routine .em { font-size: 54px; line-height: 1; }
    .routine .rt { flex: 1; min-width: 0; display: grid; gap: 8px; }
    .routine b { font-size: clamp(18px, 3.4vw, 26px); font-weight: 900; }
    .routine .go { flex: none; padding: 10px 20px; border-radius: 999px; font-weight: 900; font-size: 18px; background: linear-gradient(135deg, var(--k), var(--k2)); box-shadow: 0 4px 14px rgba(0,0,0,.3); }
    .routine.complete { border-color: #3ed17e; }
    .dots { display: flex; gap: 6px; flex-wrap: wrap; }
    .dots i { width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,.22); transition: background .2s, transform .2s; }
    .dots i.on { background: #ffcf4a; box-shadow: 0 0 10px #ffcf4a; transform: scale(1.15); }
    .dots.big { justify-content: center; margin: 6px 0 10px; } .dots.big i { width: 18px; height: 18px; }

    .bank { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 22px; border-radius: 32px; margin-bottom: 14px;
      background: linear-gradient(135deg, rgba(255,207,74,.28), rgba(255,126,179,.22)); border: 2px solid rgba(255,207,74,.5); }
    .bigstar { font-size: clamp(60px, 14vw, 96px); line-height: 1; animation: spin 5s ease-in-out infinite; filter: drop-shadow(0 6px 14px rgba(255,170,30,.6)); }
    .bank b { display: block; font-size: clamp(48px, 11vw, 84px); font-weight: 900; line-height: 1; }
    .bank span { font-size: 20px; font-weight: 800; opacity: .85; }
    .pocket { padding: 16px 20px; border-radius: 26px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.14); margin-bottom: 8px; }
    .pocket h3 { margin: 0 0 10px; font-size: 20px; font-weight: 900; }
    .meter { height: 20px; border-radius: 99px; background: rgba(0,0,0,.35); overflow: hidden; }
    .pocket p { margin: 10px 0 0; font-weight: 800; }
    .note { margin: 12px 4px; font-weight: 800; opacity: .9; }
    .lately { display: grid; gap: 6px; }
    .lately div { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 18px; background: rgba(255,255,255,.07); font-weight: 700; }
    .lately b { flex: 1; font-weight: 700; } .lately em { font-style: normal; font-weight: 900; color: #ffcf4a; }

    nav { flex: none; z-index: 5; display: flex; gap: 8px; padding: 8px; border-radius: 999px;
      background: rgba(10,8,30,.72); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.14); }
    nav button { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 8px; border: none; border-radius: 999px;
      background: transparent; font-weight: 900; font-size: clamp(14px, 2.8vw, 19px); opacity: .75; }
    nav button span { font-size: 24px; }
    nav button.on { opacity: 1; background: linear-gradient(135deg, var(--k), var(--k2)); box-shadow: 0 4px 16px rgba(0,0,0,.35); }
    @media (max-width: 480px) { nav { padding: 6px; gap: 4px; } nav button { gap: 4px; padding: 10px 4px; font-size: 14px; } nav button span { font-size: 20px; } }
    nav i { font-style: normal; min-width: 22px; padding: 1px 6px; border-radius: 999px; background: #ff5d73; font-size: 13px; }

    .empty, .msg { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; padding: 50px 20px; position: relative; z-index: 1; }
    .big { font-size: 72px; } .empty p, .msg p { margin: 0; font-size: 20px; font-weight: 800; max-width: 30ch; }

    .overlay { position: absolute; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(6,4,24,.7); backdrop-filter: blur(6px); }
    .panel { position: relative; width: min(560px, 100%); max-height: 100%; overflow: auto; padding: 22px 20px 20px; border-radius: 34px; text-align: center;
      background: linear-gradient(160deg, color-mix(in srgb, var(--k) 34%, #1a1346), #161038); border: 2px solid color-mix(in srgb, var(--k) 70%, transparent); box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .panel h2 { margin: 0 0 6px; }
    .close { position: absolute; top: 12px; right: 14px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,.14); font-size: 18px; }
    .focus { padding: 10px 0 14px; } .fe { font-size: clamp(80px, 22vw, 130px); line-height: 1.05; animation: bob 2.2s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .ft { font-size: clamp(24px, 6vw, 34px); font-weight: 900; }
    .donebtn { width: 100%; padding: 20px; border: none; border-radius: 28px; font-size: 28px; font-weight: 900; color: #06361c;
      background: linear-gradient(135deg, #7dffb0, #3ed17e); box-shadow: 0 8px 22px rgba(62,209,126,.45); }
    .donebtn:active { transform: scale(.97); } .donebtn.alt { color: #4a2b00; background: linear-gradient(135deg, #ffe08a, #ffb020); }
    .steplist { display: grid; gap: 6px; margin-top: 16px; text-align: left; }
    .steplist button { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 18px; border: none; background: rgba(255,255,255,.08); font-size: 17px; font-weight: 700; }
    .steplist button.on { opacity: .6; text-decoration: line-through; }
    .count { display: block; margin-top: 10px; opacity: .8; font-weight: 700; }
    .pins { display: flex; gap: 14px; justify-content: center; margin: 14px 0; }
    .pins i { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,.22); } .pins i.on { background: #ffcf4a; box-shadow: 0 0 12px #ffcf4a; }
    .pins.wrong { animation: shake .4s; } @keyframes shake { 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
    .keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 320px; margin: 14px auto 0; }
    .keys button { padding: 16px 0; border: none; border-radius: 22px; background: rgba(255,255,255,.12); font-size: 28px; font-weight: 900; }
    .keys button:active { background: var(--k); }
    .toast { position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 40; padding: 14px 26px; border-radius: 999px; font-size: 19px; font-weight: 900;
      background: #fff; color: #2a1a60; box-shadow: 0 10px 30px rgba(0,0,0,.4); animation: pop .3s cubic-bezier(.2,1.6,.4,1); white-space: nowrap; max-width: 92%; overflow: hidden; text-overflow: ellipsis; }
    @keyframes pop { from { transform: translateX(-50%) scale(.6); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
  `]}customElements.get("ksh-family-hub-kids-core")||customElements.define("ksh-family-hub-kids-core",Ae);const ze={shopping:()=>import("./shopping-list-manager-card-Blp0KQiT.js"),recipes:()=>import("./recipe-manager-card-ByywAceY.js"),chores:()=>import("./ksh-chores-module-6FDmruz_.js"),calendar:()=>import("./ksh-calendar-module-BahsTu66.js"),finance:()=>import("./ksh-finance-module-DwqPv4Os.js")},Me={shopping:"shopping",cards:"shopping",meals:"recipes",chores:"chores",calendar:"calendar",finance:"finance"},Pe=new Map;function Re(e){return ze[e]?(Pe.has(e)||Pe.set(e,ze[e]().catch(t=>{Pe.delete(e),console.warn("KSH Family Hub: could not load",e,t)})),Pe.get(e)):Promise.resolve()}const Ie="ksh_hub_route",Be="ksh_hub_theme",De="ksh_hub_palette",Te="ksh_hub_household",Oe=`/ksh_family_hub/static/ksh-logo.png?v=${o}`,qe={shopping:"ksh-shopping-module",cards:"ksh-shopping-module",meals:"ksh-recipes-module",chores:"ksh-chores-module",calendar:"ksh-calendar-module",finance:"ksh-finance-module"},He={shopping:"shopping",meals:"grid",chores:"today",calendar:"month",finance:"overview"},Le={meals:["detail","add"]},Ne={get(e){try{return localStorage.getItem(e)}catch{return null}},set(e,t){try{localStorage.setItem(e,t)}catch{}}};class We extends s{static properties={hass:{type:Object},narrow:{type:Boolean},_config:{state:!0},_info:{state:!0},_error:{state:!0},_route:{state:!0},_rail:{state:!0},_moreOpen:{state:!0},_theme:{state:!0},_palette:{state:!0},_households:{state:!0},_householdId:{state:!0},_sheet:{state:!0},_language:{state:!0},_subView:{state:!0},_prefs:{state:!0},_people:{state:!0},_actingId:{state:!0},_gen:{state:!0},_applying:{state:!0},_applyError:{state:!0}};constructor(){var e;super(),this._config={},this._info=null,this._error=null,this._route=Ne.get(Ie)||"home",this._rail=!1,this._moreOpen=!1,this._theme=Ne.get(Be)||"dark",this._palette=(e=Ne.get(De),C.some(t=>t.id===e)?e:S[e]||E),this._households=[],this._householdId=null,this._sheet=null,this._language=this._readLanguage(),this._subView={},this._prefs={order:[],blocked:{}},this._people=[],this._me=null,this._actingId=null,this._gen=0,this._visited=new Set,["home","settings"].includes(this._route)||this._visited.add("cards"===this._route?"shopping":this._route),this._infoRequested=!1,this._pending=null,this._applying=!1,this._applyError=null,this._isPanel=!1}setConfig(e){this._config=e||{}}getCardSize(){return 10}static getStubConfig(){return{}}connectedCallback(){super.connectedCallback(),this.setAttribute("data-theme",this._palette),this._ro=new ResizeObserver(e=>{const t=e[0]?.contentRect?.width??0;t&&(this._rail=t>=700)}),this._ro.observe(this),this._onKey=e=>{"Escape"===e.key&&this._moreOpen&&(this._moreOpen=!1)},window.addEventListener("keydown",this._onKey),this._onActing=()=>this._refreshActing(),window.addEventListener(x,this._onActing),this._onVisible=()=>{!document.hidden&&this._infoRequested&&this._loadPrefs()},document.addEventListener("visibilitychange",this._onVisible),this._onResize=()=>this._updateHeight(),window.addEventListener("resize",this._onResize),window.visualViewport?.addEventListener("resize",this._onResize),this._isPanel="ksh-family-hub-panel"===this.localName,this._updateHeight(),Me[this._route]&&Re(Me[this._route])}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),window.removeEventListener("keydown",this._onKey),window.removeEventListener(x,this._onActing),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("resize",this._onResize),window.visualViewport?.removeEventListener("resize",this._onResize)}_updateHeight(){this._isPanel||requestAnimationFrame(()=>requestAnimationFrame(()=>{const e=this.getBoundingClientRect().top,t=window.innerHeight-Math.max(e,0);t>200&&(this.style.height=`${t}px`)}))}shouldUpdate(e){return 1!==e.size||!e.has("hass")||!this._infoRequested||A(e.get("hass"),this.hass,this._hassMemo||={})}willUpdate(e){e.has("hass")&&this.hass&&D(this.hass.config?.time_zone),e.has("hass")&&this.hass&&!this._infoRequested&&(this._infoRequested=!0,this._loadInfo(),this._loadHouseholds(),this._loadPrefs())}_prefetchModules(){const e=navigator.connection;if(e&&(e.saveData||/(^|-)[23]g$/.test(e.effectiveType||"")))return;(window.requestIdleCallback||(e=>setTimeout(e,1500)))(async()=>{for(const e of["chores","calendar","finance"])this._info?.modules?.[e]&&await Re(e)})}updated(e){const t=this.renderRoot.querySelector(".sheet");t&&!t._swipe&&(t._swipe=!0,c(t,()=>{this._moreOpen=!1})),(e.has("_theme")||e.has("hass"))&&this._applyMode(),e.has("_palette")&&this.setAttribute("data-theme",this._palette),(e.has("_route")||e.has("_gen")||e.has("_info"))&&this._syncShoppingView(),e.has("_info")&&this._info&&!this._prefetched&&(this._prefetched=!0,this._prefetchModules())}_syncShoppingView(){const e=this.renderRoot?.querySelector("#mod-shopping");e&&("cards"===this._route&&"loyalty"!==e.currentView?e.currentView="loyalty":"shopping"===this._route&&"loyalty"===e.currentView&&(e.currentView="shopping"))}async _loadInfo(){try{const e=await this.hass.callWS({type:"ksh_family_hub/get_info"});if(this._pending)return;this._info=e,this._error=null,this._available(this._route)||this._setRoute("home")}catch(e){this._error=e?.message||"unknown_error"}}async _loadPrefs(){try{const[e,t]=await Promise.all([this.hass.callWS({type:"ksh_family_hub/prefs/get"}),I(this.hass)]);this._prefs={order:e.order||[],blocked:e.blocked||{}},this._people=t.people,this._me=t.me,this._refreshActing()}catch{}}_refreshActing(){this._actingId=$(this.hass,this._people,this._me),this._info&&!this._available(this._route)&&this._setRoute("home")}get _blocked(){return this._prefs.blocked[this._actingId]||[]}get _hiddenAll(){return[...new Set([...this._info?.hidden||[],...this._blocked])]}get _menuItems(){return m(b(this._info?.modules,this._hiddenAll),this._prefs.order)}async _saveOrder(e){this._prefs={...this._prefs,order:e};try{await this.hass.callWS({type:"ksh_family_hub/prefs/set_order",order:e})}catch{}}async _saveAccess(e,t){const i=this._prefs.blocked;if(this._prefs={...this._prefs,blocked:{...i,[e]:t}},!t.length){const{[e]:t,...i}=this._prefs.blocked;this._prefs={...this._prefs,blocked:i}}try{await this.hass.callWS({type:"ksh_family_hub/prefs/set_access",person_id:e,hidden:t})}catch{this._prefs={...this._prefs,blocked:i}}}_applyConfig(e){const t=this._info;let i=t.hidden||[];if(e.items){const t=new Set(i);for(const[i,s]of Object.entries(e.items))s?t.delete(i):t.add(i);i=[...t]}const s={...t,modules:{...t.modules,...e.modules||{}},hidden:i},a=Object.keys(e.modules||{}).some(i=>!!e.modules[i]!=!!t.modules[i]);this._info=s,a&&(this._gen+=1,this._visited=new Set),this._available(this._route)||this._setRoute("home");const o={...e.modules||{}};e.items&&(o.hidden=i),this._pending={...this._pending||{},...o},this._applying||this._flush()}async _flush(){this._applying=!0,this._applyError=null;try{for(;this._pending;){const e=this._pending;this._pending=null;const t=await this.hass.callWS({type:"ksh_family_hub/set_modules",...e});["recipes","shopping","chores","calendar","finance"].some(t=>t in e)&&await this._waitForModules(t.modules)}this._pending||await this._loadInfo()}catch(e){this._applyError=e?.message||"Could not save",await this._loadInfo()}this._applying=!1,this.requestUpdate()}async _waitForModules(e){for(let t=0;t<25;t++){await new Promise(e=>setTimeout(e,800));try{const t=await this.hass.callWS({type:"ksh_family_hub/get_info"});if(Object.entries(e).every(([e,i])=>!!t.modules?.[e]==!!i))return}catch{}}}_available(e){return"settings"===e||b(this._info?.modules,this._hiddenAll).some(t=>t.id===e)}_setRoute(e){if(Me[e]&&Re(Me[e]),"settings"===e)return this._route="settings",void(this._moreOpen=!1);this._route=e,this._moreOpen=!1,"home"!==e&&this._visited.add("cards"===e?"shopping":e),Ne.set(Ie,e)}_onNavigate(e){this._setRoute(e.detail.id)}_setTheme(e){this._theme=e,Ne.set(Be,e)}get _dark(){if("light"===this._theme)return!1;if("dark"===this._theme)return!0;const e=this.hass?.themes?.darkMode;return"boolean"==typeof e?e:window.matchMedia?.("(prefers-color-scheme: dark)").matches??!0}_applyMode(){this.setAttribute("data-mode",this._dark?"dark":"light")}_tabSelect(e){const t=this.renderRoot.querySelector(`#mod-${this._route}`);this._subView={...this._subView,[this._route]:e},t&&("shopping"===this._route?t.currentView=e:["meals","chores","calendar","finance"].includes(this._route)&&t.setHubView(e))}async _loadHouseholds(e){try{const{households:t}=await this.hass.callWS({type:"ksh_family_hub/households/list"});this._households=t;const i=`${Te}_${this.hass.user?.id||""}`,s=e||this._householdId||Ne.get(i);this._householdId=(t.find(e=>e.id===s)||t[0])?.id||null,this._householdId&&Ne.set(i,this._householdId)}catch{}}get _household(){return this._households.find(e=>e.id===this._householdId)||this._households[0]}_selectHousehold(e){this._householdId=e,Ne.set(`${Te}_${this.hass.user?.id||""}`,e)}_readLanguage(){try{return JSON.parse(localStorage.getItem("rm_settings")||"{}").language||"en"}catch{return"en"}}async _setLanguage(e){if(this._language=e,this._info?.modules?.recipes)this._visited.add("meals"),this.requestUpdate(),await this.updateComplete,this.renderRoot.querySelector("#mod-meals")?.setLanguage?.(e);else try{localStorage.setItem("rm_settings",JSON.stringify({...JSON.parse(localStorage.getItem("rm_settings")||"{}"),language:e}))}catch{}}async _quickRecipe(){this._sheet=null,this._setRoute("meals");for(let e=0;e<20;e++){await this.updateComplete;const e=this.renderRoot.querySelector("#mod-meals");if(e?.setHubView)return e.setHubView("add"),void(this._subView={...this._subView,meals:"add"});await new Promise(e=>setTimeout(e,100))}}async _quickChore(){this._sheet=null,this._setRoute("chores");for(let e=0;e<20;e++){await this.updateComplete;const e=this.renderRoot.querySelector("#mod-chores");if(e?.openAdd)return e.openAdd(),void(this._subView={...this._subView,chores:"chores"});await new Promise(e=>setTimeout(e,100))}}async _quickEvent(e){this._sheet=null,this._setRoute("calendar");for(let t=0;t<20;t++){await this.updateComplete;const t=this.renderRoot.querySelector("#mod-calendar");if(t?.openAdd)return void t.openAdd(e);await new Promise(e=>setTimeout(e,100))}}_topbar(){const e=this._route,t="home"===e,i=t?this._household?.name||"Home":"settings"===e?"Settings":g(e)?.label||"";return a`
      <header class="topbar">
        <button class="logo" title="KSH Family Hub" aria-label="KSH Family Hub, go to Home" @click=${()=>this._setRoute("home")}>
          <img src=${Oe} alt="KSH" draggable="false">
        </button>
        ${t?a`
          <button class="who" @click=${()=>{this._sheet="menu"}} aria-label="Household: ${i}">
            <span class="page-title">${i}</span>
          </button>`:a`<h1 class="page-title">${i}</h1>`}
        <span class="spacer"></span>
        <button class="icon-btn" title="Quick add" aria-label="Quick add" @click=${()=>{this._sheet="quick"}}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button class="icon-btn" title="Menu" aria-label="Menu" aria-haspopup="dialog" @click=${()=>{this._sheet="menu"}}>
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>
      </header>`}_onModuleView(e,t){this._subView={...this._subView,[e]:t.detail.view}}render(){if(this._error)return this._renderError();if(!this._info)return a`<div class="center"><div class="spinner"></div></div>`;const t=this._menuItems;return a`
      <div class="shell">
        ${this._topbar()}
        <div class="body ${this._rail?"rail-layout":"bar-layout"}">
          ${this._rail?this._renderRail(t):e}
          <main class="stage">
            ${this._renderStage()}
          </main>
          ${this._rail?e:this._renderBar(t)}
        </div>
      </div>
      ${this._moreOpen?this._renderMore(t):e}
      <ksh-hub-sheets .hass=${this.hass} .sheet=${this._sheet} .households=${this._households} .activeId=${this._householdId}
        .modules=${this._info.modules} .hidden=${this._hiddenAll} .panel=${this._isPanel} .language=${this._language}
        @hub-close=${()=>{this._sheet=null}}
        @hub-sheet=${e=>{this._sheet=e.detail.sheet}}
        @hub-household-select=${e=>this._selectHousehold(e.detail.id)}
        @hub-households-changed=${e=>this._loadHouseholds(e.detail.select)}
        @hub-open-settings=${()=>{this._sheet=null,this._setRoute("settings")}}
        @hub-set-language=${e=>this._setLanguage(e.detail.code)}
        @hub-quick=${e=>{const t=e.detail.id;"meals"===t?this._quickRecipe():"chores"===t?this._quickChore():["event","reminders","birthdays"].includes(t)&&this._quickEvent(t)}}
        @hub-region-changed=${()=>{this._gen++}}
        @hass-toggle-menu=${()=>{this._sheet=null}}></ksh-hub-sheets>
    `}_renderError(){return a`
      <div class="center">
        <div class="error-card">
          <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
          <h3>KSH Family Hub isn't ready</h3>
          <p>The integration did not answer. Check that <b>KSH Family Hub</b> is added under
             Settings → Devices &amp; services, then refresh this page.</p>
          <code>${this._error}</code>
          <button class="btn" @click=${()=>{this._infoRequested=!1,this._error=null,this.requestUpdate()}}>Retry</button>
        </div>
      </div>
    `}_renderStage(){const t=this._route,i=qe[t],s=u[t],n=this._subView[t]||He[t],r=s&&!(Le[t]||[]).includes(n),h=this._dark,l="compact";return a`
      ${"home"===t?a`
        <ksh-hub-home .hass=${this.hass} .modules=${this._info.modules} .hidden=${this._hiddenAll} .dark=${h} .panel=${this._isPanel}
          @hub-navigate=${this._onNavigate}
          @hub-open-settings=${()=>this._setRoute("settings")}></ksh-hub-home>`:e}

      ${"settings"===t?a`
        <ksh-hub-settings .hass=${this.hass} .info=${this._info} .theme=${this._theme} .palette=${this._palette}
          .cardVersion=${o} .applying=${this._applying} .applyError=${this._applyError}
          .prefs=${this._prefs} .people=${this._people} .order=${this._menuItems.map(e=>e.id)}
          @hub-order=${e=>this._saveOrder(e.detail.order)}
          @hub-access=${e=>this._saveAccess(e.detail.person,e.detail.hidden)}
          @hub-theme=${e=>this._setTheme(e.detail.theme)}
          @hub-palette=${e=>{this._palette=e.detail.palette,Ne.set(De,this._palette)}}
          @hub-config=${e=>this._applyConfig(e.detail)}
          @hub-back=${()=>this._setRoute("home")}></ksh-hub-settings>`:e}

      ${i||"home"===t||"settings"===t?e:a`
        <ksh-hub-placeholder .item=${g(t)}
          @hub-navigate=${this._onNavigate}></ksh-hub-placeholder>`}

      ${r?a`
        <nav class="subtabs" aria-label="Sections">
          <div class="subtab-list">
            ${s.filter(e=>"settings"!==e.view).map(e=>a`
              <button class="subtab ${n===e.view?"active":""}" @click=${()=>this._tabSelect(e.view)}>
                <ha-icon icon=${e.icon}></ha-icon><span>${e.label}</span>
              </button>`)}
          </div>
          ${s.some(e=>"settings"===e.view)?a`
            <button class="subtab gear ${"settings"===n?"active":""}" title="Settings" aria-label="Settings"
              @click=${()=>this._tabSelect("settings")}><ha-icon icon="mdi:cog-outline"></ha-icon></button>`:e}
        </nav>`:e}

      ${d(this._gen,a`
        ${this._visited.has("shopping")&&this._info.modules.shopping?a`
          <div class="module" ?hidden=${"shopping"!==t&&"cards"!==t}>
            <ksh-shopping-module id="mod-shopping" hub-mode
              .hass=${this.hass} .hostUi=${l} .hostDark=${h}
              @module-view-changed=${e=>this._onModuleView("shopping",e)}></ksh-shopping-module>
          </div>`:e}
        ${this._visited.has("meals")&&this._info.modules.recipes?a`
          <div class="module" ?hidden=${"meals"!==t}>
            <ksh-recipes-module id="mod-meals" hub-mode
              .hass=${this.hass} .hostUi=${l} .hostDark=${h}
              @module-view-changed=${e=>this._onModuleView("meals",e)}></ksh-recipes-module>
          </div>`:e}
        ${this._visited.has("chores")&&this._info.modules.chores?a`
          <div class="module" ?hidden=${"chores"!==t}>
            <ksh-chores-module id="mod-chores" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @hub-sheet=${e=>{this._sheet=e.detail.sheet}}
              @hub-navigate=${this._onNavigate}
              @module-view-changed=${e=>this._onModuleView("chores",e)}></ksh-chores-module>
          </div>`:e}
        ${this._visited.has("calendar")&&this._info.modules.calendar?a`
          <div class="module" ?hidden=${"calendar"!==t}>
            <ksh-calendar-module id="mod-calendar" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @hub-sheet=${e=>{this._sheet=e.detail.sheet}}
              @hub-navigate=${this._onNavigate}
              @module-view-changed=${e=>this._onModuleView("calendar",e)}></ksh-calendar-module>
          </div>`:e}
        ${this._visited.has("finance")&&this._info.modules.finance?a`
          <div class="module" ?hidden=${"finance"!==t}>
            <ksh-finance-module id="mod-finance" hub-mode .hass=${this.hass} .modules=${this._info.modules}
              @module-view-changed=${e=>this._onModuleView("finance",e)}></ksh-finance-module>
          </div>`:e}
      `)}
    `}_tile(e,{active:t=!1,size:i=""}={}){return a`
      <span class="tile ${t?"active":""} ${i}" style="--c:${e.color}">
        <ha-icon icon=${e.icon}></ha-icon>
      </span>`}_renderBar(e){const t=[...e.filter(e=>e.home),...e.filter(e=>!e.home).slice(0,3)],i=!t.some(e=>e.id===this._route)&&"settings"!==this._route;return a`
      <nav class="bar" aria-label="Main">
        ${t.map(e=>a`
          <button class="bar-item ${this._route===e.id?"active":""}" @click=${()=>this._setRoute(e.id)}
            aria-current=${this._route===e.id?"page":"false"}>
            ${this._tile(e,{active:this._route===e.id})}
            <span class="label">${e.label}</span>
          </button>`)}
        <button class="bar-item ${i||this._moreOpen?"active":""}" @click=${()=>{this._moreOpen=!this._moreOpen}}
          aria-haspopup="dialog" aria-expanded=${this._moreOpen?"true":"false"}>
          <span class="tile more ${i?"active":""}"><ha-icon icon="mdi:dots-grid"></ha-icon></span>
          <span class="label">More</span>
        </button>
      </nav>`}_renderRail(t){return a`
      <nav class="rail" aria-label="Main">
        ${t.map(t=>a`
          <button class="rail-item ${this._route===t.id?"active":""}" title=${t.label}
            @click=${()=>this._setRoute(t.id)} aria-label=${t.label}
            aria-current=${this._route===t.id?"page":"false"}>
            ${this._tile(t,{active:this._route===t.id})}
            ${this._route===t.id?a`<span class="label">${t.label}</span>`:e}
          </button>`)}
      </nav>`}_renderMore(e){const t=e.filter(e=>!e.home);return a`
      <div class="scrim" @click=${()=>{this._moreOpen=!1}}></div>
      <section class="sheet" role="dialog" aria-label="All sections"
>
        <div class="grabber"></div>
        <div class="grid">
          ${t.map(e=>a`
            <button class="grid-item" @click=${()=>this._setRoute(e.id)}>
              ${this._tile(e,{size:"lg"})}
              <span class="label">${e.label}</span>
            </button>`)}
        </div>
      </section>`}static styles=[j,i`
    :host {
      display: block;
      height: 100%;
      min-height: 420px;
      position: relative;
      overflow: hidden;
      background: var(--hub-bg);
      font-family: var(--paper-font-body1_-_font-family, 'Roboto', system-ui, sans-serif);
      box-sizing: border-box;
      border-radius: var(--ha-card-border-radius, 12px);
    }
    :host(.panel), :host([panel]) { border-radius: 0; }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button { font: inherit; color: inherit; }

    .shell { height: 100%; display: flex; flex-direction: column; min-height: 0; }
    .body { flex: 1; min-height: 0; display: flex; }
    .body.bar-layout { flex-direction: column; }
    .body.rail-layout { flex-direction: row; }
    .stage { flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column; position: relative; }
    .module { flex: 1; min-height: 0; display: block; position: relative; }
    .module > * { display: block; height: 100%; }

    /* ---- top bar: logo (phone), page title, settings gear ---- */
    .topbar { flex: none; display: flex; align-items: center; gap: 10px; padding: 10px 14px 4px 10px; min-height: 70px; }
    .page-title { min-width: 0; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--hub-text); }
    .spacer { flex: 1; }
    .who { min-width: 0; display: flex; align-items: center; background: none; border: none; color: inherit;
      padding: 4px 8px; margin-left: -4px; cursor: pointer; border-radius: 10px; text-align: left; }
    .who:hover { background: var(--hub-surface-2); }
    .who .page-title { max-width: 100%; }
    .icon-btn {
      flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--hub-border); cursor: pointer;
      background: var(--hub-surface); color: var(--hub-muted); display: flex; align-items: center; justify-content: center;
      --mdc-icon-size: 22px; transition: background .15s, color .15s;
    }
    .icon-btn:hover { color: var(--hub-text); }
    .icon-btn.active { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }
    .logo { flex: none; width: 58px; height: 58px; padding: 0; border: none; background: none; cursor: pointer; border-radius: 17px; line-height: 0; }
    .logo img { width: 100%; height: 100%; display: block; border-radius: 17px; }

    /* ---- sub tabs ---- */
    .subtabs { display: flex; align-items: center; gap: 8px; padding: 6px 12px; flex: none; }
    .subtab-list { flex: 1; min-width: 0; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
    .subtab-list::-webkit-scrollbar { display: none; }
    @media (max-width: 460px) { .subtab:not(.gear) ha-icon { display: none; } .subtab { padding: 7px 12px; } }
    .subtab.gear { padding: 0; width: 38px; height: 38px; justify-content: center; border-radius: 50%; }
    .subtab.gear ha-icon { --mdc-icon-size: 22px; }
    .subtab {
      display: inline-flex; align-items: center; gap: 6px; flex: none;
      padding: 7px 14px; border-radius: 999px; border: 1px solid var(--hub-border);
      background: transparent; color: var(--hub-muted); cursor: pointer; font-size: 13.5px; font-weight: 600;
    }
    .subtab ha-icon { --mdc-icon-size: 18px; }
    .subtab.active { background: var(--hub-accent); color: var(--hub-accent-ink); border-color: transparent; }

    /* ---- tiles (shared by bar, rail and sheet) ---- */
    .tile {
      position: relative; display: inline-flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; border-radius: 14px; flex: none;
      background: var(--hub-surface-2);
      color: var(--hub-muted);
      transition: background .15s, color .15s, transform .15s;
      --mdc-icon-size: 24px;
    }
    .tile.lg { width: 54px; height: 54px; border-radius: 17px; --mdc-icon-size: 28px; }
    .tile.active { background: var(--hub-accent); color: var(--hub-accent-ink); }
    :host([data-mode="light"]) .tile.more { background: rgba(60, 80, 100, 0.1); }
    .tile.more.active { background: var(--hub-accent); color: var(--hub-accent-ink); }
    .label { font-size: 12px; font-weight: 600; color: var(--hub-muted); line-height: 1.15; }

    /* ---- bottom bar (phone) ---- */
    .bar {
      flex: none; display: flex; justify-content: space-around; align-items: flex-start;
      margin: 6px 10px calc(10px + env(safe-area-inset-bottom, 0px)); padding: 10px 6px 9px;
      background: var(--hub-nav); border: 1px solid var(--hub-border); border-radius: 28px;
      box-shadow: var(--hub-shadow); backdrop-filter: blur(14px);
    }
    .bar-item {
      flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 0; -webkit-tap-highlight-color: transparent;
    }
    .bar-item.active .label { color: var(--hub-text); font-weight: 800; }
    .bar-item:active .tile { transform: scale(.94); }

    /* ---- rail (tablet) ---- */
    .rail {
      flex: none; width: 76px; margin: 4px 0 10px 10px; padding: 12px 0;
      display: flex; flex-direction: column; align-items: center; gap: 6px; overflow-y: auto; scrollbar-width: none;
      background: var(--hub-nav); border: 1px solid var(--hub-border); border-radius: 28px; box-shadow: var(--hub-shadow);
    }
    .rail::-webkit-scrollbar { display: none; }
    .rail-item {
      background: none; border: none; cursor: pointer; padding: 3px 0; width: 100%;
      display: flex; flex-direction: column; align-items: center; gap: 3px;
    }
    .rail-item.active .label { color: var(--hub-text); font-weight: 800; }
    .rail-item:hover .tile:not(.active) { background: color-mix(in srgb, var(--hub-accent) 16%, var(--hub-surface-2)); color: var(--hub-text); }

    /* ---- more sheet ---- */
    .scrim { position: absolute; inset: 0; background: rgba(4, 12, 20, 0.55); z-index: 20; animation: fade .18s ease; }
    .sheet {
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 21; max-height: 88%; overflow-y: auto;
      background: var(--hub-sheet); border-radius: 30px 30px 0 0; padding: 12px 16px calc(28px + env(safe-area-inset-bottom, 0px));
      box-shadow: var(--hub-shadow); animation: rise .24s cubic-bezier(.2,.8,.2,1);
      overscroll-behavior: contain;
    }
    .grabber { width: 44px; height: 5px; border-radius: 3px; background: rgba(160, 190, 215, .55); margin: 2px auto 22px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px 4px; }
    .grid-item {
      background: none; border: none; cursor: pointer; padding: 0;
      display: flex; flex-direction: column; align-items: center; gap: 9px; min-width: 0;
    }
    .grid-item .label { color: var(--hub-text); font-weight: 700; font-size: 12.5px; }
    @keyframes rise { from { transform: translateY(40px); opacity: 0; } }
    @keyframes fade { from { opacity: 0; } }

    /* ---- states ---- */
    .center { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .spinner {
      width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--hub-border);
      border-top-color: var(--hub-accent); animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-card {
      max-width: 420px; text-align: center; padding: 28px; border-radius: 22px;
      background: var(--hub-surface); border: 1px solid var(--hub-border); display: grid; gap: 10px; justify-items: center;
    }
    .error-card ha-icon { --mdc-icon-size: 40px; color: #e8a04a; }
    .error-card h3 { margin: 0; }
    .error-card p { margin: 0; color: var(--hub-muted); font-size: 14px; }
    .error-card code { font-size: 12px; color: var(--hub-muted); }
    .btn {
      border: none; border-radius: 999px; padding: 9px 20px; cursor: pointer; font-weight: 700;
      background: var(--hub-accent); color: var(--hub-accent-ink);
    }
  `]}customElements.get("ksh-family-hub-core")||customElements.define("ksh-family-hub-core",We),customElements.get("ksh-family-hub-panel")||customElements.define("ksh-family-hub-panel",class extends We{connectedCallback(){this.setAttribute("panel",""),super.connectedCallback()}render(){const e=new URLSearchParams(window.location.search),t=e.get("kids");return t?(this._kidsEl&&this._kidsFor===t||(this._kidsFor=t,this._kidsEl=document.createElement("ksh-family-hub-kids-core"),this._kidsEl.setConfig({person:t,style:e.get("style")||void 0,height:"100dvh"})),this._kidsEl.hass=this.hass,a`${this._kidsEl}`):super.render()}});export{me as C,he as D,re as E,We as K,ne as R,q as a,c as b,F as c,ve as d,r as e,H as f,k as g,ge as h,h as i,G as j,$e as k,I as l,Ee as m,L as n,ae as o,Fe as p,oe as q,$ as r,w as s,n as t,Y as u,K as v};
