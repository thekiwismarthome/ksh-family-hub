import{a as e,b as t,i,A as r,E as a}from"./lit-element-BqsBd8Ys.js";import{L as s,c as o,m as n,s as c}from"./runtime-B3VjoScI.js";import{e as l,i as d,t as p}from"./ksh-family-hub-card-UBHReqKW.js";import"./virtual_card-version-DBhfHTym.js";
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class h{constructor(e){this.__litLocalizeEventHandler=e=>{"ready"===e.detail.status&&this.host.requestUpdate()},this.host=e}hostConnected(){window.addEventListener(s,this.__litLocalizeEventHandler)}hostDisconnected(){window.removeEventListener(s,this.__litLocalizeEventHandler)}}const m=e=>e.addController(new h(e)),u=/^[½¼¾⅓⅔⅛⅜⅝⅞\d][\d.,/½¼¾⅓⅔⅛⅜⅝⅞\s]*\s*(?:tsp|tbsp|tablespoons?|teaspoons?|cups?|oz|lbs?|g|kg|ml|cl|dl|L|(?:milli|centi|deci)?lit(?:re|er)s?|kilo(?:gramme|gram)s?|(?:gramme|gram)s?|pints?|quarts?|gallons?|fl\.?\s*oz|cans?|bunches?|heads?|cloves?|slices?|pieces?|sheets?|pinch(?:es)?|dash(?:es)?|handfuls?|sprigs?|stalks?)\s*/i;function g(e){if(e.amount||e.unit)return e.name;return e.name.replace(u,"").trim()||e.name}function b(e,t,i){return`[RM] ${e} — ${function(e,t){return e.amount||e.unit?[e.amount,e.unit,t].filter(Boolean).join(" "):e.name}(t,i)}`}function v(e){if(!e)return 1;const t={"½":.5,"¼":.25,"¾":.75,"⅓":1/3,"⅔":2/3,"⅛":.125,"⅜":.375,"⅝":.625,"⅞":.875};let i=String(e).trim();for(const[e,r]of Object.entries(t))i=i.replace(e,String(r));const r=i.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(r)return parseInt(r[1])+parseInt(r[2])/parseInt(r[3]);const a=i.match(/^(\d+)\/(\d+)$/);return a?parseInt(a[1])/parseInt(a[2]):parseFloat(i)||1}class f{constructor(e){this.hass=e}subscribe(e){return this.hass.connection.subscribeMessage(e,{type:"ksh_recipes/subscribe"})}async getAllRecipes(){return this.hass.callWS({type:"ksh_recipes/recipes/get_all"})}async getRecipe(e){return this.hass.callWS({type:"ksh_recipes/recipes/get",recipe_id:e})}async scrapeRecipe(e){return this.hass.callWS({type:"ksh_recipes/recipes/scrape",url:e})}async addRecipe(e){return this.hass.callWS({type:"ksh_recipes/recipes/add",...e})}async updateRecipe(e,t){return this.hass.callWS({type:"ksh_recipes/recipes/update",recipe_id:e,...t})}async deleteRecipe(e){return this.hass.callWS({type:"ksh_recipes/recipes/delete",recipe_id:e})}async toggleFavourite(e){return this.hass.callWS({type:"ksh_recipes/recipes/toggle_favourite",recipe_id:e})}async downloadRecipeImage(e,t){return this.hass.callWS({type:"ksh_recipes/recipes/download_image",recipe_id:e,image_url:t})}async getTags(){return this.hass.callWS({type:"ksh_recipes/tags/get_all"})}async getMealPlan(e){const t={type:"ksh_recipes/meal_plan/get"};return e&&(t.week_start=e),this.hass.callWS(t)}async addToMealPlan(e,t,i,r=1,a=null){const s={type:"ksh_recipes/meal_plan/add",recipe_id:e,date:t,meal_type:i,servings:r};return a&&(s.notes=a),this.hass.callWS(s)}async removeFromMealPlan(e){return this.hass.callWS({type:"ksh_recipes/meal_plan/remove",entry_id:e})}async clearMealPlanWeek(e){return this.hass.callWS({type:"ksh_recipes/meal_plan/clear",week_start:e})}async addIngredientsToShoppingList(e,t,i=null){let r=[];try{const t=await this.getSlmItems(e);r=(t?.items??[]).filter(e=>!e.checked)}catch{}const a=[];for(const s of t)try{const t=g(s),o=s.product_name??t,n=i?b(i,s,t):null,c=r.find(e=>e.name.toLowerCase().trim()===o.toLowerCase().trim());if(c&&n){const e=c.note?`${c.note}\n${n}`:n;await this.hass.callWS({type:"ksh_shopping/items/update",item_id:c.id,note:e}),a.push({success:!0,name:o,merged:!0})}else{const t={type:"ksh_shopping/items/add",list_id:e,name:o,quantity:v(s.amount),unit:s.unit||null};s.product_id&&(t.product_id=s.product_id),s.category_id&&(t.category_id=s.category_id),n&&(t.note=n),await this.hass.callWS(t),a.push({success:!0,name:o})}}catch(e){a.push({success:!1,name:s.name,error:e.message})}return a}async updateSlmItem(e,t){return this.hass.callWS({type:"ksh_shopping/items/update",item_id:e,...t})}async getShoppingLists(){return this.hass.callWS({type:"ksh_shopping/lists/get_all"})}async getSlmItems(e){return this.hass.callWS({type:"ksh_shopping/items/get",list_id:e})}async checkSlmItem(e,t){return this.hass.callWS({type:"ksh_shopping/items/check",item_id:e,checked:t})}async clearSlmChecked(e){return this.hass.callWS({type:"ksh_shopping/items/clear_checked",list_id:e})}async deleteSlmItem(e){return this.hass.callWS({type:"ksh_shopping/items/delete",item_id:e})}async addSlmItem(e,t){return this.hass.callWS({type:"ksh_shopping/items/add",list_id:e,...t})}async getSlmCategories(){return this.hass.callWS({type:"ksh_shopping/categories/get_all"})}async getSlmProductsByIds(e){return this.hass.callWS({type:"ksh_shopping/products/get_by_ids",product_ids:e})}async getSlmProductSuggestions(e=20){return this.hass.callWS({type:"ksh_shopping/products/suggestions",limit:e})}async searchSlmProducts(e,t=5){return this.hass.callWS({type:"ksh_shopping/products/search",query:e,limit:t})}async getGlobalTimers(){return this.hass.callWS({type:"ksh_recipes/global_timers/get"})}async addGlobalTimer(e){return this.hass.callWS({type:"ksh_recipes/global_timers/add",...e})}async updateGlobalTimer(e,t){return this.hass.callWS({type:"ksh_recipes/global_timers/update",timer_id:e,...t})}async deleteGlobalTimer(e){return this.hass.callWS({type:"ksh_recipes/global_timers/delete",timer_id:e})}async importRecipeKeeper(e){return this.hass.callWS({type:"ksh_recipes/import/recipe_keeper",html_content:e})}async uploadRecipeImage(e,t){return this.hass.callWS({type:"ksh_recipes/recipes/upload_image",recipe_id:e,image_data:t})}}const x=["de","es","fr","it","nl","pt"],_=["de","en","es","fr","it","nl","pt"],{getLocale:y,setLocale:w}=o({sourceLocale:"en",targetLocales:x,loadLocale:e=>import(`./locales/${e}.js`)});async function k(e){const t=_.includes(e)?e:"en";t!==y()&&await w(t)}const $=new Set,S=new Set;let z=null;function T(){return"undefined"!=typeof navigator&&"wakeLock"in navigator}function F(){const e=!!z;S.forEach(t=>t(e))}async function I(){if(T()&&!z&&("undefined"==typeof document||"visible"===document.visibilityState))try{z=await navigator.wakeLock.request("screen"),z.addEventListener("release",()=>{z=null,F()}),F()}catch(e){console.warn("[RM] Wake Lock request failed:",e)}}async function C(){$.size>0?await I():await async function(){if(z){try{await z.release()}catch{}z=null,F()}}()}async function A(e){$.add(e),await C()}async function R(e){$.delete(e),await C()}"undefined"!=typeof document&&document.addEventListener("visibilitychange",()=>{"visible"===document.visibilityState&&$.size>0&&I()});const M={"--rm-radius":"22px","--rm-radius-sm":"14px","--rm-radius-card":"22px"},D={"--rm-radius":"18px","--rm-radius-sm":"12px","--rm-radius-card":"18px"},E={fresh:{light:{"--rm-h1":"#0F7B5A","--rm-h2":"#2A5DA8","--rm-h3":"#9A5A0B","--rm-h4":"#6A3FA8","--rm-h5":"#0E6B7A","--rm-h6":"#B03A6E",...M,"--rm-bg-main":"#F3F6F4","--rm-bg-surface":"#FFFFFF","--rm-bg-elevated":"#E8EEEA","--rm-text":"#12201B","--rm-text-secondary":"#5A6B64","--rm-text-muted":"#5A6B64","--rm-accent":"#0F7B5A","--rm-accent-soft":"#DDF1E8","--rm-accent-text":"#0B6048","--rm-ink":"#FFFFFF","--rm-border":"#E3EAE6","--rm-line":"#EEF2EF","--rm-warn":"#9A5A0B","--rm-danger":"#A32B2B","--rm-shadow":"0 1px 3px rgba(18,32,27,0.10)","--rm-shadow-float":"0 10px 30px rgba(18,32,27,0.14)"},dark:{"--rm-h1":"#5BD6A4","--rm-h2":"#6CB6FF","--rm-h3":"#FFB454","--rm-h4":"#C79BFF","--rm-h5":"#5CCBDC","--rm-h6":"#FF8FB8",...M,"--rm-bg-main":"#0F1714","--rm-bg-surface":"#18231E","--rm-bg-elevated":"#1F2D26","--rm-text":"#E8F1EC","--rm-text-secondary":"#9DB0A7","--rm-text-muted":"#9DB0A7","--rm-accent":"#3FBF92","--rm-accent-soft":"#1B3A2F","--rm-accent-text":"#7FE0BC","--rm-ink":"#0B1A14","--rm-border":"#26352E","--rm-line":"#202D27","--rm-warn":"#FFB454","--rm-danger":"#FF8F8F","--rm-shadow":"0 1px 3px rgba(0,0,0,0.4)","--rm-shadow-float":"0 10px 30px rgba(0,0,0,0.5)"}},compact:{light:{"--rm-h1":"#0F7B5A","--rm-h2":"#2A5DA8","--rm-h3":"#9A5A0B","--rm-h4":"#6A3FA8","--rm-h5":"#0E6B7A","--rm-h6":"#B03A6E",...D,"--rm-bg-main":"#F4F5F8","--rm-bg-surface":"#FFFFFF","--rm-bg-elevated":"#ECEEF3","--rm-text":"#14161C","--rm-text-secondary":"#5B6270","--rm-text-muted":"#5B6270","--rm-accent":"#4F5FD6","--rm-accent-soft":"#E3E6FA","--rm-accent-text":"#3A47B0","--rm-ink":"#FFFFFF","--rm-border":"#E1E4EB","--rm-line":"#EDEFF4","--rm-warn":"#9A5A0B","--rm-danger":"#A32B2B","--rm-shadow":"0 1px 3px rgba(18,32,27,0.10)","--rm-shadow-float":"0 20px 50px rgba(20,22,28,0.18)"},dark:{"--rm-h1":"#5BD6A4","--rm-h2":"#6CB6FF","--rm-h3":"#FFB454","--rm-h4":"#C79BFF","--rm-h5":"#5CCBDC","--rm-h6":"#FF8FB8",...D,"--rm-bg-main":"#0E1014","--rm-bg-surface":"#171A20","--rm-bg-elevated":"#1F232B","--rm-text":"#ECEFF4","--rm-text-secondary":"#9AA3B2","--rm-text-muted":"#9AA3B2","--rm-accent":"#8B9BFF","--rm-accent-soft":"#232B52","--rm-accent-text":"#B4BEFF","--rm-ink":"#0E1014","--rm-border":"#2A2F39","--rm-line":"#1E222A","--rm-warn":"#FFB454","--rm-danger":"#FF8F8F","--rm-shadow":"0 1px 3px rgba(0,0,0,0.4)","--rm-shadow-float":"0 20px 50px rgba(0,0,0,0.5)"}}},P=["fresh","compact","classic"];function L(e){return P.includes(e)?e:"fresh"}const B=[{id:"meadow",name:"Meadow",preview:{light:{bg:"#F3F6F4",a:"#0F7B5A",s:"#DDF1E8"},dark:{bg:"#1F2D26",a:"#3FBF92",s:"#1B3A2F"}},fresh:{light:null,dark:null},compact:{light:{a:"#0F7B5A",i:"#FFFFFF",s:"#DDF1E8",t:"#0B6048"},dark:{a:"#3FBF92",i:"#0B1A14",s:"#1B3A2F",t:"#7FE0BC"}}},{id:"slate",name:"Slate",preview:{light:{bg:"#E9ECF4",a:"#3B4BA8",s:"#D5DAF2"},dark:{bg:"#1F232B",a:"#8B9BFF",s:"#232B52"}},fresh:{light:{a:"#3B4BA8",i:"#FFFFFF",s:"#E1E5F7",t:"#2E3A8A"},dark:{a:"#8B9BFF",i:"#0E1230",s:"#232B52",t:"#B4BEFF"}},compact:{light:null,dark:null}},{id:"sunset",name:"Sunset",preview:{light:{bg:"#F8EDE6",a:"#B8481F",s:"#F4D5C6"},dark:{bg:"#2A1D18",a:"#FF8A5B",s:"#3F2218"}},fresh:{light:{a:"#B8481F",i:"#FFFFFF",s:"#FBE3D8",t:"#8F3512"},dark:{a:"#FF8A5B",i:"#2A0F05",s:"#3F2218",t:"#FFB291"}},compact:{light:{a:"#B8481F",i:"#FFFFFF",s:"#FBE3D8",t:"#8F3512"},dark:{a:"#FF8A5B",i:"#2A0F05",s:"#3F2218",t:"#FFB291"}}}],j={fresh:"meadow",compact:"slate"};function O(e,t){return B.find(e=>e.id===t)||B.find(t=>t.id===(j[e]||"meadow"))}function N(e,t,i){const r=O(e,t)?.[e];return r&&(i?r.dark:r.light)||null}function W(e,t,i){const r=E[e];if(!r)return null;const a={...t?r.dark:r.light},s=N(e,i,t);return s&&(a["--rm-accent"]=s.a,a["--rm-ink"]=s.i,a["--rm-accent-soft"]=s.s,a["--rm-accent-text"]=s.t),{...a,"--rm-bg":a["--rm-bg-main"],"--rm-surface":a["--rm-bg-surface"],"--rm-success":a["--rm-accent"]}}const U={dark:{"--rm-bg-main":"var(--hub-m-main, #111f2f)","--rm-bg-surface":"var(--hub-surface, #162b41)","--rm-bg-elevated":"var(--hub-surface-2, #1c354e)","--rm-border":"rgba(255,255,255,0.09)","--rm-line":"rgba(255,255,255,0.06)","--rm-accent":"var(--hub-accent)","--rm-accent-soft":"color-mix(in srgb, var(--hub-accent) 18%, transparent)","--rm-accent-text":"var(--hub-accent)","--rm-ink":"var(--hub-accent-ink)"},light:{"--rm-bg-main":"var(--hub-m-main, #eef3f7)","--rm-bg-surface":"var(--hub-surface, #ffffff)","--rm-bg-elevated":"var(--hub-surface-2, #f3f7fa)","--rm-border":"rgba(20,40,60,0.10)","--rm-line":"rgba(20,40,60,0.07)","--rm-accent":"var(--hub-accent)","--rm-accent-soft":"color-mix(in srgb, var(--hub-accent) 14%, transparent)","--rm-accent-text":"var(--hub-accent)","--rm-ink":"var(--hub-accent-ink)"}};class q extends e{static properties={recipes:{type:Array},allRecipes:{type:Array},tags:{type:Array},searchQuery:{type:String},activeTag:{type:String},columns:{type:Number},viewMode:{type:String},hubMode:{type:Boolean},showFavourites:{type:Boolean},hideSidebar:{type:Boolean},scrollPos:{type:Number},recentRecipes:{type:Array},recentCount:{type:Number},uiStyle:{type:String,attribute:"ui-style",reflect:!0},weekPlan:{type:Array},showPlanner:{type:Boolean},_collapsed:{type:Object},_filterMode:{type:String},_starFilter:{type:Number},_sortByRating:{type:Boolean},_showRatingMenu:{type:Boolean},_sort:{type:String},_showSheet:{type:Boolean},_selectedCourses:{type:Object},_selectedCategories:{type:Object},_selectedCollections:{type:Object},filterPreset:{type:Object}};constructor(){super(),m(this),this.recipes=[],this.allRecipes=[],this.tags=[],this.searchQuery="",this.activeTag=null,this.columns=3,this.showFavourites=!0,this.hideSidebar=!1,this.scrollPos=0,this.recentRecipes=[],this.recentCount=12,this.uiStyle="classic",this.weekPlan=[],this.showPlanner=!0,this._collapsed={},this._filterMode="all",this._starFilter=0,this._sortByRating=!1,this._showRatingMenu=!1,this._sort="default",this._showSheet=!1,this._selectedCourses=new Set,this._selectedCategories=new Set,this._selectedCollections=new Set,this._lastScrollPos=0,this._hasRestoredScroll=!1,this.filterPreset=null}_toggleChip(e,t){const i="courses"===e?"_selectedCourses":"categories"===e?"_selectedCategories":"_selectedCollections",r=new Set(this[i]);r.has(t)?r.delete(t):r.add(t),this[i]=r}updated(e){if(e.has("_showSheet")&&this.dispatchEvent(new CustomEvent("rm-overlay",{detail:{open:this._showSheet},bubbles:!0,composed:!0})),e.has("filterPreset")&&this.filterPreset){const{filterMode:e,selectedValues:t}=this.filterPreset;this._filterMode=e,this._selectedCourses=new Set,this._selectedCategories=new Set,this._selectedCollections=new Set,"courses"===e&&(this._selectedCourses=new Set(t)),"categories"===e&&(this._selectedCategories=new Set(t)),"collections"===e&&(this._selectedCollections=new Set(t))}e.has("scrollPos")&&(this._hasRestoredScroll=!1),null==this.scrollPos||this._hasRestoredScroll||(this._hasRestoredScroll=!0,this.updateComplete.then(()=>{requestAnimationFrame(()=>{const e=this.shadowRoot?.querySelector(".grid-scroll");e&&(e.scrollTop=this.scrollPos)})}))}_handleSearchInput(e){this.dispatchEvent(new CustomEvent("rm-search",{detail:{query:e.target.value},bubbles:!0,composed:!0}))}_handleClearSearch(){this.dispatchEvent(new CustomEvent("rm-search",{detail:{query:""},bubbles:!0,composed:!0}))}_handleTagClick(e){this.dispatchEvent(new CustomEvent("rm-tag-filter",{detail:{tag:e},bubbles:!0,composed:!0}))}_handleOpenRecipe(e){this.dispatchEvent(new CustomEvent("rm-open-recipe",{detail:{recipe:e},bubbles:!0,composed:!0}))}_handleToggleFavourite(e,t){e.stopPropagation(),this.dispatchEvent(new CustomEvent("rm-toggle-favourite",{detail:{recipeId:t.id},bubbles:!0,composed:!0}))}_recipeMatchesTag(e,t){return!t||(e.tags?.includes(t)||e.courses?.includes(t)||e.categories?.includes(t)||e.collections?.includes(t))}_recipeMatchesSearch(e,t){const i=(t||"").trim().toLowerCase();return!i||(e.name?.toLowerCase().includes(i)||e.description?.toLowerCase().includes(i)||e.tags?.some(e=>e.toLowerCase().includes(i)))}_formatTime(e){if(!e)return null;if(e<60)return`${e}m`;const t=Math.floor(e/60),i=e%60;return i?`${t}h ${i}m`:`${t}h`}_getFilteredList(){const e=this._selectedCourses.size>0,t=this._selectedCategories.size>0,i=this._selectedCollections.size>0,r=e||t||i;let a;switch(a=r?this.allRecipes.filter(r=>{const a=!e||(r.courses||[]).some(e=>this._selectedCourses.has(e)),s=!t||(r.categories||[]).some(e=>this._selectedCategories.has(e)),o=!i||(r.collections||[]).some(e=>this._selectedCollections.has(e));return a&&s&&o&&this._recipeMatchesSearch(r,this.searchQuery)}):this.recipes,this._filterMode){case"favourites":a=this.allRecipes.filter(e=>e.is_favourite).filter(e=>!r||a.some(t=>t.id===e.id));break;case"recent":a=this.recentRecipes.slice(0,this.recentCount).filter(e=>!r||a.some(t=>t.id===e.id))}if(this._starFilter>0&&(a=a.filter(e=>(e.rating||0)>=this._starFilter)),this._sortByRating||"rating"===this._sort)a=[...a].sort((e,t)=>(t.rating||0)-(e.rating||0));else if("time"===this._sort){const e=e=>e.total_time||(e.prep_time||0)+(e.cook_time||0)||9999;a=[...a].sort((t,i)=>e(t)-e(i))}else"name"===this._sort&&(a=[...a].sort((e,t)=>(e.name||"").localeCompare(t.name||"")));return a}get _allCourses(){const e=new Set;return this.allRecipes.forEach(t=>(t.courses||[]).forEach(t=>e.add(t))),[...e].sort()}get _coursecounts(){const e={};return this.allRecipes.forEach(t=>(t.courses||[]).forEach(t=>{e[t]=(e[t]||0)+1})),e}get _allCategories(){const e=new Set;return this.allRecipes.forEach(t=>(t.categories||[]).forEach(t=>e.add(t))),[...e].sort()}get _categorycounts(){const e={};return this.allRecipes.forEach(t=>(t.categories||[]).forEach(t=>{e[t]=(e[t]||0)+1})),e}get _allCollections(){const e=new Set;return this.allRecipes.forEach(t=>(t.collections||[]).forEach(t=>e.add(t))),[...e].sort()}get _collectioncounts(){const e={};return this.allRecipes.forEach(t=>(t.collections||[]).forEach(t=>{e[t]=(e[t]||0)+1})),e}get _styled(){return"fresh"===this.uiStyle||"compact"===this.uiStyle}_todayISO(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}_renderHero(){const e=this.weekPlan||[],i=this._todayISO(),r=new Set(e.filter(e=>"dinner"===e.meal_type).map(e=>e.date)),a=e.find(e=>e.date===i&&"dinner"===e.meal_type),s=a?this.allRecipes.find(e=>e.id===a.recipe_id):null,o=s&&(s.total_time||(s.prep_time||0)+(s.cook_time||0))||null,l=(new Date).toLocaleDateString(y(),{weekday:"long"}),d=r.size;return t`
      <section class="hero" aria-label="${n("Tonight")}">
        <div class="hero-row">
          <span class="hero-label">${n(c`Tonight · ${l}`)}</span>
          <span class="hero-label">${n(c`${d} of 7 dinners planned`)}</span>
        </div>
        <div class="hero-row">
          <div class="hero-main">
            ${s?t`
              <div class="hero-big">${s.name}</div>
              <div class="hero-sub">${[o?this._formatTime(o):null,s.servings?n(c`serves ${s.servings}`):null].filter(Boolean).join(" · ")}</div>
            `:t`
              <div class="hero-big">${n("Nothing planned")}</div>
              <div class="hero-sub">${n("Pick a recipe for tonight")}</div>
            `}
          </div>
          ${s?t`
            <button class="hero-cta" @click=${()=>this._handleOpenRecipe(s)}>
              <ha-icon icon="mdi:play"></ha-icon>${n("Cook")}
            </button>
          `:t`
            <button class="hero-cta" @click=${()=>this.dispatchEvent(new CustomEvent("rm-open-planner",{bubbles:!0,composed:!0}))}>
              ${n("Plan")}
            </button>
          `}
        </div>
        <div class="hero-progress"><i style="width:${Math.round(d/7*100)}%"></i></div>
      </section>
    `}_renderRecipeRow(e){const i=e.total_time||(e.prep_time||0)+(e.cook_time||0)||null,r=e.courses?.[0]||e.category||"";return t`
      <div class="recipe-row" role="button" tabindex="0"
        @click=${()=>this._handleOpenRecipe(e)}
        @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._handleOpenRecipe(e))}}>
        <div class="row-thumb">
          ${e.image_url?t`<img src="${e.image_url}" alt="" loading="lazy" />`:t`<ha-icon icon="mdi:food"></ha-icon>`}
        </div>
        <div class="row-body">
          <div class="row-name">${e.name}</div>
          <div class="row-meta">
            ${[r,i?this._formatTime(i):null].filter(Boolean).map((e,i)=>t`${i?t`<span>·</span>`:""}<span>${e}</span>`)}
            ${e.rating?t`<span>·</span><span class="row-rating"><ha-icon icon="mdi:star"></ha-icon>${e.rating.toFixed?e.rating.toFixed(1):e.rating}</span>`:""}
          </div>
        </div>
        <button class="row-fav ${e.is_favourite?"active":""}"
          @click=${t=>this._handleToggleFavourite(t,e)}
          title="${e.is_favourite?n("Remove from favourites"):n("Add to favourites")}"
          aria-pressed="${e.is_favourite?"true":"false"}">
          <ha-icon icon="${e.is_favourite?"mdi:heart":"mdi:heart-outline"}"></ha-icon>
        </button>
      </div>
    `}_renderSection(e,i,r,a){const s="compact"===this.uiStyle&&"tiles"!==this.viewMode;if(s&&!i)return t`<div class="recipe-rows">${r.map(e=>this._renderRecipeRow(e))}</div>`;if(s){const a=!this._collapsed[e];return t`
        <button class="sec-head" aria-expanded="${a?"true":"false"}"
          @click=${()=>{this._collapsed={...this._collapsed,[e]:a}}}>
          <span>${i}</span><span class="sec-count">${r.length}</span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </button>
        ${a?t`<div class="recipe-rows">${r.map(e=>this._renderRecipeRow(e))}</div>`:""}
      `}return t`
      ${i?t`<div class="section-label"><span>${i}</span>${this._styled?t`<span class="sec-count">${r.length}</span>`:""}</div>`:""}
      <div class="recipe-grid" style=${a}>${r.map(e=>this._renderRecipeCard(e))}</div>
    `}_renderStars(e){const i=e||0;return t`
      <div class="card-stars">
        ${[1,2,3,4,5].map(e=>t`<span class="card-star ${e<=i?"filled":""}">${e<=i?"★":"☆"}</span>`)}
      </div>
    `}_renderRecipeCard(e){const i=e.total_time||(e.prep_time||0)+(e.cook_time||0)||null;if(this._styled){const r=e.courses?.[0]||e.category||"";return t`
        <div class="recipe-card" role="button" tabindex="0"
          @click=${()=>this._handleOpenRecipe(e)}
          @keydown=${t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._handleOpenRecipe(e))}}>
          <div class="recipe-thumb">
            ${e.image_url?t`<img src="${e.image_url}" alt="${e.name}" loading="lazy" />`:t`
              <div class="recipe-thumb-placeholder"><span class="plate"><ha-icon icon="mdi:food"></ha-icon></span></div>
            `}
            <button class="fav-btn ${e.is_favourite?"active":""}"
              @click=${t=>this._handleToggleFavourite(t,e)}
              title="${e.is_favourite?n("Remove from favourites"):n("Add to favourites")}"
              aria-pressed="${e.is_favourite?"true":"false"}">
              <span><ha-icon icon="${e.is_favourite?"mdi:heart":"mdi:heart-outline"}"></ha-icon></span>
            </button>
          </div>
          <div class="recipe-info">
            ${r?t`<div class="eyebrow">${r}</div>`:""}
            <h3 class="recipe-name">${e.name}</h3>
            <div class="recipe-meta">
              ${i?t`<span class="meta-chip"><ha-icon icon="mdi:clock-outline"></ha-icon>${this._formatTime(i)}</span>`:""}
              ${e.servings?t`<span class="meta-chip"><ha-icon icon="mdi:account-group-outline"></ha-icon>${e.servings}</span>`:""}
              ${e.rating?t`<span class="meta-chip rating"><ha-icon icon="mdi:star"></ha-icon>${e.rating.toFixed?e.rating.toFixed(1):e.rating}</span>`:""}
            </div>
          </div>
        </div>
      `}return t`
      <div class="recipe-card" @click=${()=>this._handleOpenRecipe(e)}>
        <div class="recipe-thumb">
          ${e.image_url?t`
            <img src="${e.image_url}" alt="${e.name}" loading="lazy" />
          `:t`
            <div class="recipe-thumb-placeholder">
              <ha-icon icon="mdi:food"></ha-icon>
            </div>
          `}
          <button
            class="fav-btn ${e.is_favourite?"active":""}"
            @click=${t=>this._handleToggleFavourite(t,e)}
            title="${e.is_favourite?n("Remove from favourites"):n("Add to favourites")}"
          >
            <ha-icon icon="${e.is_favourite?"mdi:heart":"mdi:heart-outline"}"></ha-icon>
          </button>
        </div>
        <div class="recipe-info">
          <h3 class="recipe-name">${e.name}</h3>
          ${this._renderStars(e.rating)}
          <div class="recipe-meta">
            ${i?t`
              <span class="meta-chip">
                <ha-icon icon="mdi:clock-outline"></ha-icon>
                ${this._formatTime(i)}
              </span>
            `:""}
            ${e.servings?t`
              <span class="meta-chip">
                <ha-icon icon="mdi:account-group-outline"></ha-icon>
                ${e.servings}
              </span>
            `:""}
            ${e.tags?.length?t`
              <span class="meta-chip tag-chip">${e.tags[0]}</span>
            `:""}
          </div>
        </div>
      </div>
    `}_renderRatingMenu(){return t`
      <div class="rating-menu" @click=${e=>e.stopPropagation()}>
        <div class="rating-menu-section">${n("Filter by rating")}</div>
        ${[0,1,2,3,4,5].map(e=>t`
          <button class="rating-menu-item ${this._starFilter===e?"active":""}"
            @click=${()=>{this._starFilter=e,this._showRatingMenu=!1}}>
            ${n(0===e?"All ratings":c`${"★".repeat(e)}${"☆".repeat(5-e)} ${e}+`)}
          </button>
        `)}
        <div class="rating-menu-section" style="margin-top:6px">${n("Sort")}</div>
        <button class="rating-menu-item ${this._sortByRating?"active":""}"
          @click=${()=>{this._sortByRating=!this._sortByRating,this._showRatingMenu=!1}}>
          ${n(c`${this._sortByRating?"✓ ":""}Sort by rating`)}
        </button>
      </div>
    `}render(){const e=this._getFilteredList(),i="all"===this._filterMode&&this.showFavourites&&!this.activeTag&&!this.searchQuery&&!this._starFilter&&!this._sortByRating&&"default"===this._sort,r=i?e.filter(e=>e.is_favourite):[],a=i&&r.length?e.filter(e=>!e.is_favourite):e,s=this.hubMode?"grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));":`grid-template-columns: var(--rm-grid-columns, repeat(${this.columns}, minmax(0, 1fr)));`,o=this._starFilter>0||this._sortByRating||"default"!==this._sort,l=("fresh"===this.uiStyle||this.hubMode)&&this.showPlanner&&"all"===this._filterMode&&!this.activeTag&&!this.searchQuery&&!o;return t`
      <div class="grid-container" @click=${()=>{this._showRatingMenu&&(this._showRatingMenu=!1)}}>
        <!-- Search bar — only shown on narrow (sidebar-less) view -->
        ${this.hideSidebar?"":t`
          <div class="search-row">
            <div class="search-wrap">
              <ha-icon icon="mdi:magnify" class="search-icon"></ha-icon>
              <input
                type="text"
                class="search-input"
                placeholder="${n("Search recipes…")}"
                .value=${this.searchQuery}
                @input=${this._handleSearchInput}
                @keydown=${e=>{"Escape"===e.key&&this.searchQuery&&this._handleClearSearch()}}
              />
              ${this.searchQuery?t`
                <button class="clear-btn" title="${n("Clear search")}" aria-label="${n("Clear search")}" @click=${this._handleClearSearch}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              `:""}
            </div>
          </div>
        `}

        <!-- Filter tabs + rating filter button (wide view) -->
        ${this.hideSidebar||this._styled?t`
          <div class="filter-tabs-row">
            <div class="filter-tabs">
              ${[["all","mdi:view-grid",n("All"),null],["courses","mdi:silverware-fork-knife",n("Courses"),"_selectedCourses"],["categories","mdi:tag-multiple-outline",n("Categories"),"_selectedCategories"],["collections","mdi:folder-multiple-outline",n("Collections"),"_selectedCollections"],["favourites","mdi:heart-outline",n("Favourites"),null],["recent","mdi:history",n("Recent"),null]].map(([e,i,r,a])=>t`
                <button
                  class="filter-tab ${this._filterMode===e?"active":""}"
                  @click=${()=>{this._filterMode=e,"all"===e&&(this._selectedCourses=new Set,this._selectedCategories=new Set,this._selectedCollections=new Set)}}
                >
                  <ha-icon icon="${i}"></ha-icon>
                  <span>${r}</span>
                  ${a&&this[a]?.size>0?t`<span class="tab-badge"></span>`:""}
                </button>
              `)}
            </div>
            <!-- Rating filter button -->
            <div class="rating-filter-wrap">
              <button
                class="rating-filter-btn ${o?"active":""}"
                @click=${e=>{e.stopPropagation(),this._styled?this._showSheet=!0:this._showRatingMenu=!this._showRatingMenu}}
                title="${this._styled?n("Filter and sort"):n("Filter/sort by rating")}"
                aria-label="${this._styled?n("Filter and sort"):n("Filter/sort by rating")}"
              >
                <ha-icon icon="${this._styled?"mdi:tune-variant":"mdi:filter-menu-outline"}"></ha-icon>
                ${o?t`<span class="rating-filter-badge"></span>`:""}
              </button>
              ${this._showRatingMenu&&!this._styled?this._renderRatingMenu():""}
            </div>
          </div>
        `:""}

        <!-- Sub-filter chips for Courses / Categories / Collections (multi-select) -->
        ${(this.hideSidebar||this._styled)&&"courses"===this._filterMode&&this._allCourses.length?t`
          <div class="sub-filter-row">
            <button class="sub-chip ${this._selectedCourses.size?"":"active"}"
              @click=${()=>{this._selectedCourses=new Set}}>${n("All")}</button>
            ${this._allCourses.map(e=>t`
              <button
                class="sub-chip ${this._selectedCourses.has(e)?"active":""}"
                @click=${()=>this._toggleChip("courses",e)}
              >${e}<span class="sub-chip-count">${this._coursecounts[e]||0}</span></button>
            `)}
          </div>
        `:""}
        ${(this.hideSidebar||this._styled)&&"categories"===this._filterMode&&this._allCategories.length?t`
          <div class="sub-filter-row">
            <button class="sub-chip ${this._selectedCategories.size?"":"active"}"
              @click=${()=>{this._selectedCategories=new Set}}>${n("All")}</button>
            ${this._allCategories.map(e=>t`
              <button
                class="sub-chip ${this._selectedCategories.has(e)?"active":""}"
                @click=${()=>this._toggleChip("categories",e)}
              >${e}<span class="sub-chip-count">${this._categorycounts[e]||0}</span></button>
            `)}
          </div>
        `:""}
        ${(this.hideSidebar||this._styled)&&"collections"===this._filterMode&&this._allCollections.length?t`
          <div class="sub-filter-row">
            <button class="sub-chip ${this._selectedCollections.size?"":"active"}"
              @click=${()=>{this._selectedCollections=new Set}}>${n("All")}</button>
            ${this._allCollections.map(e=>t`
              <button
                class="sub-chip ${this._selectedCollections.has(e)?"active":""}"
                @click=${()=>this._toggleChip("collections",e)}
              >${e}<span class="sub-chip-count">${this._collectioncounts[e]||0}</span></button>
            `)}
          </div>
        `:""}

        <!-- Tag chips (narrow view only) -->
        ${!this.hideSidebar&&this.tags.length?t`
          <div class="tags-row">
            ${this.tags.map(e=>t`
              <button
                class="tag-btn ${this.activeTag===e?"active":""}"
                @click=${()=>this._handleTagClick(e)}
              >${e}</button>
            `)}
          </div>
        `:""}

        <!-- Active filter hint -->
        ${o?t`
          <div class="active-filter-bar">
            ${this._starFilter>0?t`<span>${n(c`⭐ ${this._starFilter}+ stars`)}</span>`:""}
            ${this._sortByRating?t`<span>${n("Sorted by rating")}</span>`:""}
            <button class="clear-filter-btn" @click=${()=>{this._starFilter=0,this._sortByRating=!1}}>
              <ha-icon icon="mdi:close"></ha-icon> ${n("Clear")}
            </button>
          </div>
        `:""}

        <!-- Recipe content -->
        <div class="grid-scroll" @scroll=${e=>{this._lastScrollPos=e.target.scrollTop}}>
          ${0===e.length?t`
            <div class="empty-state">
              <ha-icon icon="mdi:pot-steam-outline"></ha-icon>
              <p>${this.searchQuery||this.activeTag?n("No matching recipes"):this._starFilter>0?n(c`No recipes with ${this._starFilter}+ stars`):"favourites"===this._filterMode?n("No favourites yet — heart a recipe!"):"recent"===this._filterMode?n("No recently viewed recipes yet."):n("No recipes yet — add one!")}</p>
            </div>
          `:t`
            ${l?this._renderHero():""}
            ${i&&r.length?this._renderSection("fav",n("Favourites"),r,s):""}
            ${a.length?this._renderSection("all",i&&r.length||this._styled&&"all"===this._filterMode?n("All Recipes"):"",a,s):""}
          `}
        </div>
        ${this._showSheet?this._renderSheet():""}
      </div>
    `}_renderSheet(){const e=this.allRecipes,i=e.filter(e=>e.is_favourite).length,r=e=>this._filterMode===e&&!this._selectedCourses.size&&!this._selectedCategories.size&&!this._selectedCollections.size,a=e=>{this._filterMode=e,this._selectedCourses=new Set,this._selectedCategories=new Set,this._selectedCollections=new Set},s=(e,t)=>{a(e);this["courses"===e?"_selectedCourses":"categories"===e?"_selectedCategories":"_selectedCollections"]=new Set([t])},o=(e,i,r,a,o)=>r.length?t`
      <div class="sheet-label">${e}</div>
      <div class="sheet-opts">
        ${r.map(e=>t`
          <button class="sheet-opt" aria-pressed="${a.has(e)?"true":"false"}" @click=${()=>s(i,e)}>
            ${e}<span class="so-count">${o[e]||0}</span>
          </button>`)}
      </div>`:"",l=(e,i,r,a="")=>t`
      <button class="sheet-opt" aria-pressed="${i?"true":"false"}" @click=${r}>
        ${e}${a}${i?t`<ha-icon class="so-ok" icon="mdi:check"></ha-icon>`:""}
      </button>`;return t`
      <div class="sheet-layer ${this.hideSidebar?"modal":""}" @click=${e=>e.stopPropagation()}>
        <div class="sheet-scrim" @click=${()=>{this._showSheet=!1}}></div>
        <div class="sheet" role="dialog" aria-modal="true" aria-label="${n("Filter and sort")}">
          <div class="sheet-grab"></div>
          <div class="sheet-head">
            <h2>${n("Filter and sort")}</h2>
            <button class="sheet-done" @click=${()=>{this._showSheet=!1}}>${n("Done")}</button>
          </div>

          <div class="sheet-label">${n("Show")}</div>
          <div class="sheet-opts">
            ${l(n("All recipes"),r("all"),()=>a("all"),t`<span class="so-count">${e.length}</span>`)}
            ${l(n("Favourites"),r("favourites"),()=>a("favourites"),t`<span class="so-count">${i}</span>`)}
            ${l(n("Recent"),r("recent"),()=>a("recent"),t`<span class="so-count">${Math.min(this.recentRecipes.length,this.recentCount)}</span>`)}
          </div>
          ${o(n("Course"),"courses",this._allCourses,this._selectedCourses,this._coursecounts)}
          ${o(n("Category"),"categories",this._allCategories,this._selectedCategories,this._categorycounts)}
          ${o(n("Collection"),"collections",this._allCollections,this._selectedCollections,this._collectioncounts)}

          <div class="sheet-label">${n("Sort by")}</div>
          <div class="sheet-opts">
            ${[["default",n("Favourites first")],["rating",n("Highest rated")],["time",n("Quickest")],["name",n("A to Z")]].map(([e,t])=>l(t,this._sort===e&&!("default"===e&&this._sortByRating),()=>{this._sort=e,this._sortByRating=!1}))}
          </div>

          <div class="sheet-label">${n("Minimum rating")}</div>
          <div class="sheet-opts">
            ${l(n("Any rating"),0===this._starFilter,()=>{this._starFilter=0})}
            ${[5,4,3,2,1].map(e=>t`
              <button class="sheet-opt" aria-pressed="${this._starFilter===e?"true":"false"}" @click=${()=>{this._starFilter=e}}
                aria-label="${n(c`${e} stars and up`)}">
                <span class="so-stars" aria-hidden="true">${[1,2,3,4,5].map(i=>t`<ha-icon icon="${i<=e?"mdi:star":"mdi:star-outline"}"></ha-icon>`)}</span>
                ${e<5?t`<span class="so-plus">${e}+</span>`:""}
                ${this._starFilter===e?t`<ha-icon class="so-ok" icon="mdi:check"></ha-icon>`:""}
              </button>`)}
          </div>

          ${d=this,"all"!==d._filterMode||"default"!==d._sort||d._sortByRating||d._starFilter>0||d._selectedCourses.size>0||d._selectedCategories.size>0||d._selectedCollections.size>0?t`<button class="sheet-reset" @click=${()=>{a("all"),this._sort="default",this._sortByRating=!1,this._starFilter=0}}>${n("Reset filters")}</button>`:""}
        </div>
      </div>
    `;var d}static styles=i`
    :host { display: block; height: 100%; position: relative; }

    .grid-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    /* Search (narrow only) */
    .search-row {
      padding: 10px 14px 6px;
      flex-shrink: 0;
    }
    .search-wrap {
      display: flex;
      align-items: center;
      background: var(--rm-bg-elevated, #2c2c2e);
      border-radius: 10px;
      padding: 0 10px;
      gap: 8px;
    }
    .search-icon { color: var(--rm-text-secondary, #8e8e93); --mdc-icon-size: 18px; }
    .search-input {
      flex: 1; background: none; border: none; outline: none;
      color: var(--rm-text, #e5e5ea); font-size: 14px; padding: 9px 0;
    }
    .search-input::placeholder { color: var(--rm-text-secondary, #8e8e93); }
    .clear-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93); padding: 2px; display: flex; align-items: center;
    }
    .clear-btn ha-icon { --mdc-icon-size: 16px; }

    /* Filter tabs row (wide view) */
    .filter-tabs-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px 4px;
      flex-shrink: 0;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
    }

    .filter-tabs {
      display: flex;
      gap: 2px;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .filter-tabs::-webkit-scrollbar { display: none; }

    .filter-tab {
      display: flex; align-items: center; gap: 5px;
      background: none; border: none; border-radius: 8px;
      padding: 6px 12px; font-size: 13px; font-weight: 500;
      color: var(--rm-text-secondary, #8e8e93);
      cursor: pointer; white-space: nowrap;
      transition: background 0.12s, color 0.12s;
    }
    .filter-tab ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }
    .filter-tab:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .filter-tab { position: relative; }
    .tab-badge {
      position: absolute; top: 4px; right: 4px;
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--rm-accent);
    }
    .filter-tab.active {
      background: var(--rm-accent-soft);
      color: var(--rm-accent); font-weight: 600;
    }

    /* Rating filter button */
    .rating-filter-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .rating-filter-btn {
      background: none; border: 1px solid var(--rm-border);
      border-radius: 8px; padding: 6px 10px; cursor: pointer;
      color: var(--rm-text-secondary); display: flex; align-items: center;
      gap: 4px; position: relative; transition: background 0.12s, color 0.12s;
    }
    .rating-filter-btn ha-icon { --mdc-icon-size: 18px; }
    .rating-filter-btn:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .rating-filter-btn.active { color: var(--rm-accent); border-color: var(--rm-accent); background: var(--rm-accent-soft); }
    .rating-filter-badge {
      position: absolute; top: 4px; right: 4px;
      width: 7px; height: 7px;
      background: var(--rm-accent); border-radius: 50%;
    }

    .rating-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--rm-bg-surface);
      border: 1px solid var(--rm-border);
      border-radius: 10px;
      box-shadow: var(--rm-shadow, 0 4px 12px rgba(0,0,0,0.2));
      min-width: 170px;
      z-index: 50;
      overflow: hidden;
      padding: 4px 0;
    }
    .rating-menu-section {
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--rm-text-muted); padding: 8px 14px 4px;
    }
    .rating-menu-item {
      display: block; width: 100%;
      background: none; border: none; text-align: left;
      padding: 8px 14px; font-size: 13px; cursor: pointer;
      color: var(--rm-text-secondary); transition: background 0.12s;
    }
    .rating-menu-item:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .rating-menu-item.active { color: var(--rm-accent); font-weight: 600; }

    /* Active filter hint bar */
    .active-filter-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 14px;
      font-size: 12px; color: var(--rm-accent);
      background: var(--rm-accent-soft);
      flex-shrink: 0;
    }
    .clear-filter-btn {
      margin-left: auto; background: none; border: none;
      display: flex; align-items: center; gap: 3px;
      color: var(--rm-text-secondary); font-size: 12px; cursor: pointer;
    }
    .clear-filter-btn ha-icon { --mdc-icon-size: 14px; }

    /* Sub-filter chips */
    .sub-filter-row {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 14px;
      flex-shrink: 0; max-height: 88px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border) transparent;
    }
    .sub-filter-row::-webkit-scrollbar { width: 4px; }
    .sub-filter-row::-webkit-scrollbar-track { background: transparent; }
    .sub-filter-row::-webkit-scrollbar-thumb { background: var(--rm-border); border-radius: 4px; }
    .sub-chip {
      display: inline-flex; align-items: center; gap: 5px;
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 20px; color: var(--rm-text-secondary);
      font-size: 12px; padding: 4px 8px 4px 12px; cursor: pointer;
      white-space: nowrap; transition: all 0.15s;
    }
    .sub-chip.active {
      background: var(--rm-accent-soft); border-color: var(--rm-accent); color: var(--rm-accent);
    }
    .sub-chip-count {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--rm-accent); color: var(--rm-ink, #fff);
      border-radius: 10px; font-size: 10px; font-weight: 700;
      padding: 1px 5px; min-width: 16px; line-height: 1.4;
    }

    /* Tags (narrow view) */
    .tags-row {
      display: flex; gap: 6px; padding: 4px 14px 8px;
      overflow-x: auto; flex-shrink: 0; scrollbar-width: none;
    }
    .tags-row::-webkit-scrollbar { display: none; }
    .tag-btn {
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 20px; color: var(--rm-text-secondary);
      font-size: 12px; padding: 4px 10px; cursor: pointer;
      white-space: nowrap; transition: all 0.15s;
    }
    .tag-btn.active {
      background: var(--rm-accent-soft); border-color: var(--rm-accent); color: var(--rm-accent);
    }

    /* Grid scroll area */
    .grid-scroll {
      flex: 1; overflow-y: auto;
      padding: 4px 14px 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border) transparent;
    }

    .section-label {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--rm-text-secondary);
      margin: 8px 0 6px;
    }

    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    /* Recipe card */
    .recipe-card {
      background: var(--rm-bg-surface); border-radius: var(--rm-radius, 12px);
      overflow: hidden; cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      border: 1px solid var(--rm-border);
    }
    .recipe-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--rm-shadow);
    }

    .recipe-thumb {
      position: relative; aspect-ratio: 4/3;
      background: var(--rm-border); overflow: hidden;
    }
    .recipe-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .recipe-thumb-placeholder {
      width: 100%; height: 100%; display: flex;
      align-items: center; justify-content: center;
      color: var(--rm-text-secondary);
    }
    .recipe-thumb-placeholder ha-icon { --mdc-icon-size: 36px; }

    .fav-btn {
      position: absolute; top: 6px; right: 6px;
      background: rgba(0,0,0,0.5); border: none; border-radius: 50%;
      width: 28px; height: 28px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.7); transition: color 0.15s; padding: 0;
    }
    .fav-btn ha-icon { --mdc-icon-size: 16px; }
    .fav-btn.active { color: var(--error-color, #cf6679); }

    .recipe-info { padding: 8px 10px 10px; }
    .recipe-name {
      margin: 0 0 4px; font-size: 14px; font-weight: 600;
      color: var(--rm-text); overflow: hidden; text-overflow: ellipsis;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }

    /* Star rating on cards */
    .card-stars {
      display: flex; gap: 1px; margin-bottom: 5px;
    }
    .card-star {
      font-size: 14px; line-height: 1;
      color: var(--rm-border, rgba(200,150,0,0.25));
      -webkit-text-stroke: 1px rgba(200,150,0,0.5);
    }
    .card-star.filled {
      color: #f5a623;
      -webkit-text-stroke: 1px #c47f0a;
    }

    .recipe-meta { display: flex; flex-wrap: wrap; gap: 4px; }
    .meta-chip {
      display: inline-flex; align-items: center; gap: 3px;
      font-size: 11px; color: var(--rm-text-secondary);
      background: rgba(128,128,128,0.08); border-radius: 6px; padding: 2px 6px;
    }
    .meta-chip ha-icon { --mdc-icon-size: 12px; }
    .tag-chip { background: var(--rm-accent-soft); color: var(--rm-accent); }

    /* Empty state */
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 60px 20px; gap: 12px;
      color: var(--rm-text-secondary); text-align: center;
    }
    .empty-state ha-icon { --mdc-icon-size: 56px; opacity: 0.4; }
    .empty-state p { margin: 0; font-size: 15px; }

    /* ═══ Fresh + Compact ═══════════════════════════════════════════ */

    /* Search field: pill */
    :host([ui-style="fresh"]) .search-row,
    :host([ui-style="compact"]) .search-row { padding: 12px 20px 0; }
    :host([ui-style="fresh"]) .search-wrap,
    :host([ui-style="compact"]) .search-wrap {
      height: 48px; padding: 0 8px 0 16px; border-radius: 999px;
      background: var(--rm-bg-surface); border: 1px solid var(--rm-border);
    }
    :host([ui-style="compact"]) .search-wrap { border-radius: 14px; border-color: transparent; background: var(--rm-bg-elevated); }
    :host([ui-style="fresh"]) .search-wrap:focus-within,
    :host([ui-style="compact"]) .search-wrap:focus-within { outline: 2px solid var(--rm-accent); outline-offset: 1px; }
    :host([ui-style="fresh"]) .search-input,
    :host([ui-style="compact"]) .search-input { font-size: 15px; padding: 0; }
    :host([ui-style="fresh"]) .clear-btn,
    :host([ui-style="compact"]) .clear-btn { width: 36px; height: 36px; justify-content: center; border-radius: 50%; background: var(--rm-bg-elevated); color: var(--rm-text); }

    /* Filter tabs: pill chips */
    :host([ui-style="fresh"]) .filter-tabs-row,
    :host([ui-style="compact"]) .filter-tabs-row { border-bottom: none; padding: 14px 20px 0; gap: 8px; }
    :host([ui-style="fresh"]) .filter-tabs,
    :host([ui-style="compact"]) .filter-tabs { gap: 8px; }
    :host([ui-style="fresh"]) .filter-tab,
    :host([ui-style="compact"]) .filter-tab {
      min-height: 40px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 600;
      border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .filter-tab { border-radius: 12px; }
    :host([ui-style="fresh"]) .filter-tab ha-icon,
    :host([ui-style="compact"]) .filter-tab ha-icon { display: none; }
    :host([ui-style="fresh"]) .filter-tab:hover,
    :host([ui-style="compact"]) .filter-tab:hover { background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([ui-style="fresh"]) .filter-tab.active,
    :host([ui-style="compact"]) .filter-tab.active {
      background: var(--rm-text); border-color: var(--rm-text); color: var(--rm-bg-main); font-weight: 700;
    }
    :host([ui-style="fresh"]) .tab-badge,
    :host([ui-style="compact"]) .tab-badge { top: 8px; right: 8px; }
    :host([ui-style="fresh"]) .rating-filter-btn,
    :host([ui-style="compact"]) .rating-filter-btn {
      width: 44px; height: 44px; padding: 0; justify-content: center; border-radius: 50%;
      background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .rating-filter-btn { border-radius: 12px; border-color: transparent; background: var(--rm-bg-elevated); }
    :host([ui-style="fresh"]) .rating-filter-btn.active,
    :host([ui-style="compact"]) .rating-filter-btn.active { color: var(--rm-accent-text); border-color: var(--rm-accent); background: var(--rm-accent-soft); }
    :host([ui-style="fresh"]) .rating-menu,
    :host([ui-style="compact"]) .rating-menu { border-radius: 20px; padding: 8px; box-shadow: var(--rm-shadow-float); }
    :host([ui-style="fresh"]) .rating-menu-item,
    :host([ui-style="compact"]) .rating-menu-item { border-radius: 12px; min-height: 40px; }
    :host([ui-style="fresh"]) .rating-menu-item.active,
    :host([ui-style="compact"]) .rating-menu-item.active { color: var(--rm-accent-text); background: var(--rm-accent-soft); }

    /* Sub-filter + tag chips */
    :host([ui-style="fresh"]) .sub-filter-row,
    :host([ui-style="compact"]) .sub-filter-row { padding: 10px 20px 0; }
    :host([ui-style="fresh"]) .tags-row,
    :host([ui-style="compact"]) .tags-row { padding: 10px 20px 0; }
    :host([ui-style="fresh"]) .sub-chip,
    :host([ui-style="fresh"]) .tag-btn,
    :host([ui-style="compact"]) .sub-chip,
    :host([ui-style="compact"]) .tag-btn {
      min-height: 36px; padding: 0 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
      background: var(--rm-bg-surface); color: var(--rm-text); display: inline-flex; align-items: center;
    }
    :host([ui-style="compact"]) .sub-chip, :host([ui-style="compact"]) .tag-btn { border-radius: 12px; }
    :host([ui-style="fresh"]) .sub-chip, :host([ui-style="compact"]) .sub-chip { padding-right: 8px; }
    :host([ui-style="fresh"]) .sub-chip.active, :host([ui-style="fresh"]) .tag-btn.active,
    :host([ui-style="compact"]) .sub-chip.active, :host([ui-style="compact"]) .tag-btn.active {
      background: var(--rm-accent-soft); border-color: var(--rm-accent); color: var(--rm-accent-text);
    }
    :host([ui-style="fresh"]) .sub-chip-count,
    :host([ui-style="compact"]) .sub-chip-count { color: var(--rm-ink); }
    :host([ui-style="fresh"]) .active-filter-bar,
    :host([ui-style="compact"]) .active-filter-bar { margin: 10px 20px 0; padding: 8px 14px; border-radius: 12px; color: var(--rm-accent-text); }

    /* Scroll area + section labels */
    :host([ui-style="fresh"]) .grid-scroll,
    :host([ui-style="compact"]) .grid-scroll { padding: 4px 20px 24px; }
    :host([ui-style="fresh"]) .section-label,
    :host([ui-style="compact"]) .section-label {
      display: flex; align-items: center; gap: 8px; margin: 18px 4px 10px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; color: var(--rm-text-secondary);
    }
    .sec-count { font-weight: 600; }

    /* Hero (Fresh) */
    .hero {
      display: grid; gap: 12px; margin: 16px 0 0; padding: 18px 20px;
      border-radius: 24px; background: var(--rm-accent); color: var(--rm-ink);
    }
    .hero-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .hero-label { font-size: 13px; font-weight: 600; }
    .hero-main { min-width: 0; }
    .hero-big { font-size: 26px; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; overflow-wrap: anywhere; }
    .hero-sub { font-size: 13px; font-weight: 600; margin-top: 4px; }
    .hero-cta {
      flex: none; display: flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 18px 0 14px;
      border: none; border-radius: 999px; background: var(--rm-ink); color: var(--rm-accent);
      font-size: 14px; font-weight: 700; cursor: pointer;
    }
    .hero-cta ha-icon { --mdc-icon-size: 18px; }
    .hero-progress { height: 8px; border-radius: 99px; overflow: hidden; background: color-mix(in srgb, var(--rm-ink) 28%, transparent); }
    .hero-progress i { display: block; height: 100%; border-radius: 99px; background: var(--rm-ink); }

    /* Cards (Fresh + Compact when the grid is used) */
    :host([ui-style="fresh"]) .recipe-grid,
    :host([ui-style="compact"]) .recipe-grid { gap: 14px; margin-bottom: 8px; }
    :host([ui-style="fresh"]) .recipe-card,
    :host([ui-style="compact"]) .recipe-card {
      border-radius: var(--rm-radius-card); box-shadow: none; transform: none;
    }
    :host([ui-style="fresh"]) .recipe-card:hover { border-color: var(--rm-accent); box-shadow: none; transform: none; }
    :host([ui-style="fresh"]) .recipe-card:focus-visible,
    :host([ui-style="compact"]) .recipe-card:focus-visible,
    :host([ui-style="compact"]) .recipe-row:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }
    :host([ui-style="fresh"]) .recipe-thumb-placeholder {
      background: linear-gradient(135deg, var(--rm-accent-soft), var(--rm-bg-elevated));
    }
    :host([ui-style="fresh"]) .plate {
      display: flex; align-items: center; justify-content: center;
      width: 56%; aspect-ratio: 1; border-radius: 50%;
      background: var(--rm-bg-surface); color: var(--rm-accent-text);
      box-shadow: 0 0 0 7px color-mix(in srgb, var(--rm-bg-surface) 45%, transparent);
    }
    :host([ui-style="fresh"]) .plate ha-icon { --mdc-icon-size: 32px; }
    :host([ui-style="fresh"]) .fav-btn {
      top: 2px; right: 2px; width: 44px; height: 44px; background: none; color: #12201B;
    }
    :host([ui-style="fresh"]) .fav-btn > span {
      width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.94);
      display: flex; align-items: center; justify-content: center;
    }
    :host([ui-style="fresh"]) .fav-btn ha-icon { --mdc-icon-size: 18px; }
    :host([ui-style="fresh"]) .fav-btn.active { color: #A32B2B; }
    :host([ui-style="fresh"]) .recipe-info { padding: 12px 14px 14px; display: grid; gap: 6px; }
    .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rm-text-secondary); }
    :host([ui-style="fresh"]) .recipe-name { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.25; min-height: 2.5em; }
    :host([ui-style="fresh"]) .recipe-meta { flex-wrap: nowrap; gap: 10px; align-items: center; }
    :host([ui-style="fresh"]) .meta-chip {
      background: none; padding: 0; border-radius: 0; font-size: 12.5px; font-weight: 500; gap: 4px; white-space: nowrap;
    }
    :host([ui-style="fresh"]) .meta-chip ha-icon { --mdc-icon-size: 15px; }
    :host([ui-style="fresh"]) .meta-chip.rating { margin-left: auto; color: var(--rm-warn); font-weight: 700; }

    /* Rows (Compact) */
    :host([ui-style="compact"]) .sec-head {
      display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px;
      margin-top: 8px; padding: 10px 4px 4px; border: none; background: transparent; text-align: left;
      font: inherit; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--rm-text-secondary); cursor: pointer;
    }
    :host([ui-style="compact"]) .sec-head .sec-count { flex: 1; }
    :host([ui-style="compact"]) .sec-head ha-icon { --mdc-icon-size: 18px; transition: transform 0.15s; }
    :host([ui-style="compact"]) .sec-head[aria-expanded="false"] ha-icon { transform: rotate(-90deg); }
    .recipe-rows { display: block; }
    .recipe-row {
      display: flex; align-items: center; gap: 12px; padding: 10px 0;
      border-bottom: 1px solid var(--rm-line); cursor: pointer;
    }
    .recipe-row:last-child { border-bottom: none; }
    .row-thumb {
      flex: none; width: 56px; height: 56px; border-radius: 14px; overflow: hidden;
      background: linear-gradient(135deg, var(--rm-accent-soft), var(--rm-bg-elevated));
      display: flex; align-items: center; justify-content: center; color: var(--rm-accent-text);
    }
    .row-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .row-thumb ha-icon { --mdc-icon-size: 26px; }
    .row-body { flex: 1; min-width: 0; }
    .row-name { font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row-meta { display: flex; align-items: center; gap: 6px; margin-top: 2px; font-size: 12.5px; font-weight: 500; color: var(--rm-text-secondary); white-space: nowrap; }
    .row-rating { display: inline-flex; align-items: center; gap: 2px; color: var(--rm-warn); font-weight: 700; }
    .row-rating ha-icon { --mdc-icon-size: 14px; }
    .row-fav {
      flex: none; width: 44px; height: 44px; padding: 0; border: none; background: transparent;
      color: var(--rm-text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer;
    }
    .row-fav.active { color: var(--rm-danger); }
    :host([ui-style="compact"]) .empty-state ha-icon,
    :host([ui-style="fresh"]) .empty-state ha-icon { color: var(--rm-accent-text); opacity: 0.6; }

    /* ── Filter + sort sheet ── */
    .sheet-layer { position: absolute; inset: 0; z-index: 300; }
    .sheet-scrim { position: absolute; inset: 0; background: rgba(10,16,13,0.5); }
    .sheet {
      position: absolute; left: 0; right: 0; bottom: 0; max-height: 90%; overflow-y: auto; box-sizing: border-box;
      padding: 10px 20px 28px; border-radius: 32px 32px 0 0; background: var(--rm-bg-main); color: var(--rm-text);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.22);
    }
    .sheet-layer.modal .sheet { left: 50%; right: auto; bottom: auto; top: 50%; transform: translate(-50%, -50%); width: min(480px, 92%); max-height: 86%; border-radius: 28px; }
    .sheet-grab { width: 40px; height: 5px; border-radius: 99px; margin: 0 auto 8px; background: var(--rm-border); }
    .sheet-layer.modal .sheet-grab { display: none; }
    .sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 4px 6px; }
    .sheet-head h2 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
    .sheet-done { flex: none; min-height: 44px; padding: 0 20px; border: none; border-radius: 999px; background: var(--rm-accent); color: var(--rm-ink, #fff); font-weight: 700; font-size: 14px; cursor: pointer; }
    .sheet-label { padding: 14px 4px 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--rm-text-secondary); }
    .sheet-opts { border-radius: 22px; border: 1px solid var(--rm-border); background: var(--rm-bg-surface); padding: 0 14px; }
    :host([ui-style="compact"]) .sheet-opts { border-color: transparent; border-radius: 18px; }
    .sheet-opt {
      display: flex; align-items: center; gap: 10px; width: 100%; min-height: 52px; padding: 0;
      border: none; border-bottom: 1px solid var(--rm-line); background: transparent; text-align: left;
      font: inherit; font-size: 15px; font-weight: 600; color: var(--rm-text); cursor: pointer;
    }
    .sheet-opts > .sheet-opt:last-child { border-bottom: none; }
    .sheet-opt[aria-pressed="true"] { color: var(--rm-accent-text); font-weight: 700; }
    .sheet-opt:focus-visible, .sheet-done:focus-visible, .sheet-reset:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }
    .so-count { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--rm-text-secondary); }
    .so-ok { margin-left: auto; --mdc-icon-size: 20px; color: var(--rm-accent-text); }
    .so-count + .so-ok { margin-left: 8px; }
    .so-stars { display: inline-flex; color: var(--rm-warn); }
    .so-stars ha-icon { --mdc-icon-size: 20px; }
    .so-plus { font-size: 13px; font-weight: 700; color: var(--rm-text-secondary); }
    .sheet-reset { display: block; width: 100%; margin-top: 16px; min-height: 48px; border: 1px solid var(--rm-border); border-radius: 999px; background: var(--rm-bg-surface); color: var(--rm-text); font: inherit; font-weight: 700; cursor: pointer; }
  `}try{customElements.define("ksh-rm-recipe-grid",q)}catch{}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class V extends d{constructor(e){if(super(e),this.it=r,e.type!==p.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===r||null==e)return this._t=void 0,this.it=e;if(e===a)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}V.directiveName="unsafeHTML",V.resultType=1;const H=l(V),Q="recipe-detail";function G(e){return(t=e,t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")).replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');var t}function K(e){if(!e)return"";const t=e.split("\n"),i=[];let r=null;const a=()=>{r&&(i.push(`</${r}>`),r=null)};for(const e of t){const t=e.match(/^###\s+(.+)/);if(t){a(),i.push(`<h3>${G(t[1])}</h3>`);continue}const s=e.match(/^##\s+(.+)/);if(s){a(),i.push(`<h2>${G(s[1])}</h2>`);continue}const o=e.match(/^#\s+(.+)/);if(o){a(),i.push(`<h1>${G(o[1])}</h1>`);continue}const n=e.match(/^[-*]\s+(.+)/);if(n){"ul"!==r&&(a(),i.push("<ul>"),r="ul"),i.push(`<li>${G(n[1])}</li>`);continue}const c=e.match(/^\d+\.\s+(.+)/);if(c){"ol"!==r&&(a(),i.push("<ol>"),r="ol"),i.push(`<li>${G(c[1])}</li>`);continue}e.match(/^---+$/)?(a(),i.push("<hr>")):(a(),""===e.trim()?i.push('<p class="md-gap"></p>'):i.push(`<p>${G(e)}</p>`))}return a(),i.join("")}const X=[{key:"calories",label:n("Calories"),unit:"kcal",bold:!0},{key:"fat",label:n("Total Fat"),unit:"g"},{key:"saturated_fat",label:n("Saturated Fat"),unit:"g",indent:!0},{key:"cholesterol",label:n("Cholesterol"),unit:"mg"},{key:"sodium",label:n("Sodium"),unit:"mg"},{key:"carbohydrates",label:n("Total Carbohydrate"),unit:"g"},{key:"fiber",label:n("Dietary Fiber"),unit:"g",indent:!0},{key:"sugar",label:n("Total Sugars"),unit:"g",indent:!0},{key:"protein",label:n("Protein"),unit:"g"}],J=/(\d+\s*(?:hours?|hrs?)\s*(?:and\s*)?\d*\s*(?:minutes?|mins?)?|\d+\s*(?:minutes?|mins?|seconds?|secs?|hours?|hrs?))/gi;function Z(e){const t=e.toLowerCase();let i=0;const r=t.match(/(\d+)\s*h(?:ours?|rs?)?/);r&&(i+=3600*parseInt(r[1]));const a=t.match(/(\d+)\s*m(?:in(?:utes?)?)?(?!\s*l)/);a&&(i+=60*parseInt(a[1]));const s=t.match(/(\d+)\s*s(?:ec(?:onds?)?)?/);if(s&&(i+=parseInt(s[1])),!i){const e=t.match(/^(\d+)$/);e&&(i=60*parseInt(e[1]))}return i||0}const Y={calories:{label:n("Calories"),val:2e3,unit:"kcal"},fat:{label:n("Total Fat"),val:65,unit:"g"},saturated_fat:{label:n("Saturated Fat"),val:20,unit:"g"},cholesterol:{label:n("Cholesterol"),val:300,unit:"mg"},sodium:{label:n("Sodium"),val:2300,unit:"mg"},carbohydrates:{label:n("Total Carbohydrate"),val:300,unit:"g"},fiber:{label:n("Dietary Fiber"),val:28,unit:"g"},sugar:{label:n("Added Sugars"),val:50,unit:"g"},protein:{label:n("Protein"),val:50,unit:"g"}},ee={oz:{factor:28.3495,to:"g",toFull:"g"},lb:{factor:453.592,to:"g",toFull:"g",thresholdKg:500},cup:{factor:250,to:"ml",toFull:"ml"},cups:{factor:250,to:"ml",toFull:"ml"},"fl oz":{factor:29.5735,to:"ml",toFull:"ml"},pt:{factor:473.176,to:"ml",toFull:"ml"},qt:{factor:946.353,to:"ml",toFull:"ml"}};class te extends e{static properties={uiStyle:{type:String,attribute:"ui-style",reflect:!0},recipe:{type:Object},api:{type:Object},shoppingLists:{type:Array},slmAvailable:{type:Boolean},hideShopping:{type:Boolean,reflect:!0,attribute:"hide-shopping"},settings:{type:Object},wide:{type:Boolean},_editing:{type:Boolean},_editData:{type:Object},_servingMult:{type:Number},_activeTab:{type:String},_showShoppingPicker:{type:Boolean},_selectedListId:{type:String},_checkedIngredients:{type:Object},_shoppingAdding:{type:Boolean},_shoppingResult:{type:String},_shoppingReview:{type:Array},_confirmDelete:{type:Boolean},_downloading:{type:Boolean},_photoUrlInput:{type:String},_addingPhotoUrl:{type:Boolean},_metricMode:{type:Boolean},_wakeActive:{type:Boolean},_completedSteps:{type:Object},_editIngInput:{type:String},_editStepInput:{type:String},_nutritionExpanded:{type:Boolean},_dragIngOver:{type:Number},_dragStepOver:{type:Number},_editImageUploading:{type:Boolean},_slideIdx:{type:Number},allTags:{type:Array},allCourses:{type:Array},allCategories:{type:Array},allCollections:{type:Array},_tagPickerField:{type:String},_tagPickerInput:{type:String},_editIngEdit:{type:Object}};constructor(){super(),m(this),this.recipe=null,this.api=null,this.shoppingLists=[],this.slmAvailable=!1,this.settings={},this.wide=!1,this._editing=!1,this._editData={},this._servingMult=1,this._activeTab="ingredients",this._showShoppingPicker=!1,this._selectedListId="",this._checkedIngredients=null,this._shoppingAdding=!1,this._shoppingResult=null,this._shoppingReview=null,this._confirmDelete=!1,this._downloading=!1,this._photoUrlInput="",this._addingPhotoUrl=!1,this._metricMode="metric"===this.settings?.unitSystem,this._wakeActive=!1,this._completedSteps=new Set,this._editIngInput="",this._editStepInput="",this._nutritionExpanded=!1,this._dragIngOver=-1,this._dragStepOver=-1,this._dragIngFrom=-1,this._dragStepFrom=-1,this._editImageUploading=!1,this._slideIdx=0,this.allTags=[],this.allCourses=[],this.allCategories=[],this.allCollections=[],this._tagPickerField=null,this._tagPickerInput="",this._editIngEdit=null,this._slideTimer=null,this._slideTouchStartX=null,this._wakeLockTimeout=null,this._wakeLockUnsubscribeFn=null}connectedCallback(){var e;super.connectedCallback(),this._wakeLockUnsubscribeFn=(e=e=>{this._wakeActive=e},S.add(e),()=>S.delete(e))}disconnectedCallback(){super.disconnectedCallback(),this._releaseWakeLock(),this._wakeLockUnsubscribeFn?.(),this._wakeLockUnsubscribeFn=null,this._stopSlideTimer()}async _requestWakeLock(){this._wakeLockTimeout&&(clearTimeout(this._wakeLockTimeout),this._wakeLockTimeout=null),await A(Q);const e=this.settings?.wakeLockDuration??60;this._wakeLockTimeout=setTimeout(()=>this._releaseWakeLock(),6e4*e)}async _releaseWakeLock(){this._wakeLockTimeout&&(clearTimeout(this._wakeLockTimeout),this._wakeLockTimeout=null),await R(Q)}updated(e){if(e.has("recipe")&&this.recipe){const t=e.get("recipe"),i=!t||t.id!==this.recipe.id;this._servingMult=1,i&&(this._editing=!1,this._confirmDelete=!1,this._shoppingResult=null,this._shoppingReview=null,this._showShoppingPicker=!1,this._checkedIngredients=null,this._photoUrlInput="",this._metricMode="metric"===this.settings?.unitSystem,this._completedSteps=new Set),this._slideIdx=0,this._startSlideTimer()}e.has("settings")&&this._startSlideTimer(),(e.has("recipe")||e.has("settings"))&&this.recipe&&(this.settings?.keepScreenOn?this._requestWakeLock():this._releaseWakeLock()),e.has("recipe")&&!this.recipe&&this._releaseWakeLock(),e.has("shoppingLists")&&this.shoppingLists.length&&!this._selectedListId&&(this._selectedListId=this.shoppingLists[0]?.id??"")}_formatTime(e){if(!e)return null;if(e<60)return n(c`${e} min`);const t=Math.floor(e/60),i=e%60;return n(i?c`${t}h ${i}m`:c`${t}h`)}_scaleAmount(e){if(!e||isNaN(parseFloat(e)))return e;const t=parseFloat(e)*this._servingMult;return Number.isInteger(t)?String(t):t.toFixed(1).replace(/\.0$/,"")}_startEdit(){const e=this.recipe.nutrition||{};this._editData={name:this.recipe.name||"",description:this.recipe.description||"",source_url:this.recipe.source_url||"",servings:this.recipe.servings||"",prep_time:this.recipe.prep_time||"",cook_time:this.recipe.cook_time||"",tags:[...this.recipe.tags||[]],courses:[...this.recipe.courses||[]],categories:[...this.recipe.categories||[]],collections:[...this.recipe.collections||[]],notes:this.recipe.notes||"",rating:this.recipe.rating||0,image_url:this.recipe.image_url||"",photos:[...this.recipe.photos||[]],ingredients:[...this.recipe.ingredients||[]],instructions:[...this.recipe.instructions||[]],cal:e.calories||"",fat:e.fat||"",satf:e.saturated_fat||"",chol:e.cholesterol||"",sod:e.sodium||"",carb:e.carbohydrates||"",fib:e.fiber||"",sug:e.sugar||"",prot:e.protein||""},this._editing=!0}_cancelEdit(){this._editing=!1,this._editData={}}_handleEditField(e,t){this._editData={...this._editData,[e]:t}}_renderListPicker(e,i,r){const a=this._editData[e]||[],s=this._tagPickerField===e,o=(r||[]).filter(e=>!a.includes(e)),l=s?this._tagPickerInput:"";return t`
      <div class="edit-field list-picker-field">
        <label>${i}</label>
        <div class="list-picker-wrap">
          <!-- Selected chips -->
          <div class="list-picker-chips">
            ${a.map(i=>t`
              <span class="list-chip selected">
                ${i}
                <button class="list-chip-remove" @click=${()=>this._toggleListValue(e,i)} title="${n("Remove")}">×</button>
              </span>
            `)}
            <button class="list-chip-add-btn" @click=${()=>{this._tagPickerField=s?null:e,this._tagPickerInput=""}} title="${n(c`Add ${i.toLowerCase()}`)}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
          <!-- Picker dropdown -->
          ${s?t`
            <div class="list-picker-dropdown">
              ${o.length?t`
                <div class="list-picker-existing">
                  ${o.map(i=>t`
                    <span class="list-chip available" @click=${()=>{this._toggleListValue(e,i)}}>
                      ${i}
                    </span>
                  `)}
                </div>
              `:""}
              <div class="list-picker-new-row">
                <input class="list-picker-input" type="text" placeholder="${n(c`New ${i.toLowerCase()}…`)}"
                  .value=${l}
                  @input=${e=>{this._tagPickerInput=e.target.value}}
                  @keydown=${t=>{"Enter"===t.key&&(t.preventDefault(),this._addListValue(e,this._tagPickerInput)),"Escape"===t.key&&(this._tagPickerField=null)}}
                />
                <button class="list-picker-new-btn" @click=${()=>this._addListValue(e,this._tagPickerInput)}
                  ?disabled=${!this._tagPickerInput.trim()}>
                  ${n("Add")}
                </button>
              </div>
            </div>
          `:""}
        </div>
      </div>
    `}_toggleListValue(e,t){const i=this._editData[e]||[],r=i.includes(t)?i.filter(e=>e!==t):[...i,t];this._editData={...this._editData,[e]:r}}_addListValue(e,t){const i=(t||"").trim();if(!i)return;const r=this._editData[e]||[];r.includes(i)||(this._editData={...this._editData,[e]:[...r,i]}),this._tagPickerInput="",this._tagPickerField=null}_startEditIngredient(e){const t=(this._editData.ingredients||[])[e];if(t)if(t.is_heading||t.name?.startsWith("#")){const i=t.name?.startsWith("#")?t.name.slice(1).trim():t.name;this._editIngEdit={idx:e,heading:!0,name:i}}else this._editIngEdit={idx:e,heading:!1,amount:t.amount||"",unit:t.unit||"",name:t.name||""}}_saveEditIngredient(){const e=this._editIngEdit;if(!e)return;const t=[...this._editData.ingredients||[]];e.heading?t[e.idx]={name:`# ${e.name}`,is_heading:!0}:t[e.idx]={amount:e.amount,unit:e.unit,name:e.name},this._editData={...this._editData,ingredients:t},this._editIngEdit=null}_cancelEditIngredient(){this._editIngEdit=null}_editAddIngredient(){const e=this._editIngInput.trim();if(!e)return;let t;if(e.startsWith("#"))t={name:e,is_heading:!0};else{const i=e.split(/\s+/);let r="",a="",s="";i.length>=3&&!isNaN(parseFloat(i[0]))?(r=i[0],a=i[1],s=i.slice(2).join(" ")):2!==i.length||isNaN(parseFloat(i[0]))?s=e:(r=i[0],s=i[1]),t={amount:r,unit:a,name:s}}this._editData={...this._editData,ingredients:[...this._editData.ingredients||[],t]},this._editIngInput=""}_editRemoveIngredient(e){this._editData={...this._editData,ingredients:(this._editData.ingredients||[]).filter((t,i)=>i!==e)}}_editMoveIngredient(e,t){const i=[...this._editData.ingredients||[]],r=e+t;r<0||r>=i.length||([i[e],i[r]]=[i[r],i[e]],this._editData={...this._editData,ingredients:i})}_editMoveStep(e,t){const i=[...this._editData.instructions||[]],r=e+t;r<0||r>=i.length||([i[e],i[r]]=[i[r],i[e]],this._editData={...this._editData,instructions:i})}_editDropIngredient(e,t){if(e===t||e<0||t<0)return;const i=[...this._editData.ingredients||[]],[r]=i.splice(e,1);i.splice(t,0,r),this._editData={...this._editData,ingredients:i},this._dragIngOver=-1,this._dragIngFrom=-1}_editDropStep(e,t){if(e===t||e<0||t<0)return;const i=[...this._editData.instructions||[]],[r]=i.splice(e,1);i.splice(t,0,r),this._editData={...this._editData,instructions:i},this._dragStepOver=-1,this._dragStepFrom=-1}_editAddStep(e){e.trim()&&(this._editData={...this._editData,instructions:[...this._editData.instructions||[],e.trim()]})}_editRemoveStep(e){this._editData={...this._editData,instructions:(this._editData.instructions||[]).filter((t,i)=>i!==e)}}async _editUploadImage(e){if(!e||!this.recipe?.id)return;this._editImageUploading=!0;const t=new FileReader;t.onload=async e=>{const t=e.target.result.split(",")[1];try{const e=await this.api.uploadRecipeImage(this.recipe.id,t),i=e?.image_url||e?.local_url;i&&(this._editData={...this._editData,image_url:this._editData.image_url||i,photos:[...new Set([...this._editData.photos||[],i])]})}catch(e){console.warn("Image upload failed:",e)}finally{this._editImageUploading=!1}},t.readAsDataURL(e)}async _saveEdit(){const e=this._editData,t={},i={cal:"calories",fat:"fat",satf:"saturated_fat",chol:"cholesterol",sod:"sodium",carb:"carbohydrates",fib:"fiber",sug:"sugar",prot:"protein"};let r=!1;for(const[a,s]of Object.entries(i))""!==e[a]&&null!=e[a]&&(t[s]=e[a],r=!0);const a={name:e.name,description:e.description,source_url:e.source_url,image_url:e.image_url||null,servings:parseInt(e.servings)||null,prep_time:parseInt(e.prep_time)||null,cook_time:parseInt(e.cook_time)||null,tags:Array.isArray(e.tags)?e.tags:[],courses:Array.isArray(e.courses)?e.courses:[],categories:Array.isArray(e.categories)?e.categories:[],collections:Array.isArray(e.collections)?e.collections:[],notes:e.notes,rating:e.rating||null,photos:e.photos||[],ingredients:e.ingredients||[],instructions:e.instructions||[],nutrition:r?t:null};this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:a},bubbles:!0,composed:!0})),this._editing=!1}_handleToggleFav(){this.dispatchEvent(new CustomEvent("rm-toggle-favourite",{detail:{recipeId:this.recipe.id},bubbles:!0,composed:!0}))}async _handleDownloadImage(){if(this.recipe.image_url){this._downloading=!0;try{const e=await this.api.downloadRecipeImage(this.recipe.id,this.recipe.image_url);e?.local_url&&this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:{image_url:e.local_url}},bubbles:!0,composed:!0}))}catch(e){console.warn("Image download failed:",e)}finally{this._downloading=!1}}}_handleDeleteRecipe(){if(!this._confirmDelete)return this._confirmDelete=!0,void setTimeout(()=>{this._confirmDelete=!1},3e3);this.dispatchEvent(new CustomEvent("rm-delete-recipe",{detail:{recipeId:this.recipe.id},bubbles:!0,composed:!0}))}_openShoppingPicker(){this._checkedIngredients=new Set,this._showShoppingPicker=!0}_toggleIngredient(e){const t=new Set(this._checkedIngredients);t.has(e)?t.delete(e):t.add(e),this._checkedIngredients=t}_selectAllIngredients(){const e=this.recipe?.ingredients?.length??0;this._checkedIngredients=new Set([...Array(e).keys()])}_clearAllIngredients(){this._checkedIngredients=new Set}async _handleAddToShopping(){const e=this._checkedIngredients;if(!e?.size)return;const t=(this.recipe.ingredients||[]).filter((t,i)=>e.has(i)&&!this.recipe.ingredients[i]?.is_heading&&!this.recipe.ingredients[i]?.name?.startsWith("#")).map(e=>({...e,amount:this._scaleAmount(e.amount)}));if(!this.slmAvailable||!this._selectedListId)return void await this._dispatchShoppingAdd(t.map(e=>({ing:e,selectedId:null,products:[]})));this._shoppingAdding=!0;const i=await Promise.all(t.map(async e=>{try{const t=await this.api.searchSlmProducts(e.name,4),i=t?.products??[],r=i.find(t=>t.name.toLowerCase()===e.name.toLowerCase());return{ing:e,products:i,selectedId:r?.id??null}}catch{return{ing:e,products:[],selectedId:null}}}));this._shoppingAdding=!1,this._shoppingReview=i}_selectReviewMatch(e,t){this._shoppingReview=this._shoppingReview.map((i,r)=>r===e?{...i,selectedId:t}:i)}async _confirmShoppingReview(){await this._dispatchShoppingAdd(this._shoppingReview)}async _dispatchShoppingAdd(e){const t=e.map(({ing:e,selectedId:t,products:i})=>{const r=i?.find(e=>e.id===t);return{...e,product_id:r?.id??null,product_name:r?.name??null,category_id:r?.category_id??null}});this._shoppingAdding=!0,this._shoppingResult=null,this.dispatchEvent(new CustomEvent("rm-add-to-shopping",{detail:{ingredients:t,listId:this._selectedListId||null,recipeName:this.recipe.name},bubbles:!0,composed:!0})),await new Promise(e=>setTimeout(e,600)),this._shoppingAdding=!1,this._shoppingResult="success",this._shoppingReview=null,this._showShoppingPicker=!1,setTimeout(()=>{this._shoppingResult=null},2500)}_renderShoppingReview(){const e=this._shoppingReview;return e?t`
      <div class="shopping-review-panel">
        <div class="review-title">${n("Match Items to Products")}</div>
        <div class="review-list">
          ${e.map((e,i)=>t`
            <div class="review-row">
              <div class="review-ing">
                ${e.ing.amount?t`<span class="review-qty">${e.ing.amount}${e.ing.unit?` ${e.ing.unit}`:""}</span>`:""}
                <span class="review-ing-name">${e.ing.name}</span>
              </div>
              <div class="review-chips">
                ${e.products.slice(0,3).map(r=>t`
                  <button class="review-chip ${e.selectedId===r.id?"selected":""}"
                    @click=${()=>this._selectReviewMatch(i,r.id)}>
                    ${e.selectedId===r.id?t`<ha-icon icon="mdi:check"></ha-icon>`:""}${r.name}
                  </button>
                `)}
                <button class="review-chip manual ${null===e.selectedId?"selected":""}"
                  @click=${()=>this._selectReviewMatch(i,null)}>
                  ${null===e.selectedId?t`<ha-icon icon="mdi:check"></ha-icon>`:""}${n("Add manually")}
                </button>
              </div>
            </div>
          `)}
        </div>
        <div class="picker-btns review-btns">
          <button class="action-btn" @click=${()=>{this._shoppingReview=null}}>${n("Back")}</button>
          <button class="action-btn primary"
            ?disabled=${this._shoppingAdding}
            @click=${this._confirmShoppingReview}>
            ${this._shoppingAdding?t`<ha-circular-progress active size="tiny"></ha-circular-progress>`:n(c`Confirm & Add ${e.length}`)}
          </button>
        </div>
      </div>
    `:t``}_handleQuickRate(e){const t=this.recipe.rating===e?null:e;this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:{rating:t}},bubbles:!0,composed:!0}))}_handleShowPlanner(){this.dispatchEvent(new CustomEvent("rm-show-planner",{bubbles:!0,composed:!0}))}_handleChipNav(e,t){this.dispatchEvent(new CustomEvent("rm-chip-nav",{detail:{filterMode:e,value:t},bubbles:!0,composed:!0}))}_fireTimer(e,t){const i=this.recipe?.name,r=i?n(c`${i} — ${t}`):t;this.dispatchEvent(new CustomEvent("rm-start-timer",{detail:{seconds:e,label:r},bubbles:!0,composed:!0}))}async _handleAddPhotoUrl(){const e=this._photoUrlInput.trim();if(e){this._addingPhotoUrl=!0;try{const t=this.recipe.photos||[],i={photos:[...t,e]};this.recipe.image_url||(i.image_url=e),this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:i},bubbles:!0,composed:!0})),this._photoUrlInput=""}finally{this._addingPhotoUrl=!1}}}_handleCameraCapture(e){const t=e.target.files?.[0];if(!t)return;const i=new FileReader;i.onload=async e=>{const t=e.target.result.split(",")[1];try{await this.api.uploadRecipeImage(this.recipe.id,t)}catch(e){console.warn("Camera upload failed:",e)}},i.readAsDataURL(t)}_setMainPhoto(e){this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:{image_url:e}},bubbles:!0,composed:!0}))}_removePhoto(e){const t=(this.recipe.photos||[]).filter(t=>t!==e),i={photos:t};this.recipe.image_url===e&&(i.image_url=t[0]||null),this.dispatchEvent(new CustomEvent("rm-update-recipe",{detail:{recipeId:this.recipe.id,data:i},bubbles:!0,composed:!0}))}_getSlideImages(){const e=this.recipe;if(!e)return[];const t=[e.image_url,...e.photos||[]].filter(Boolean);return[...new Set(t)]}_prevSlide(){const e=this._getSlideImages();e.length<2||(this._slideIdx=(this._slideIdx-1+e.length)%e.length,this._startSlideTimer())}_nextSlide(){const e=this._getSlideImages();e.length<2||(this._slideIdx=(this._slideIdx+1)%e.length,this._startSlideTimer())}_startSlideTimer(){this._stopSlideTimer();const e=this.settings?.slideshowInterval??5;if(e<=0)return;this._getSlideImages().length<2||(this._slideTimer=setInterval(()=>{this._slideIdx=(this._slideIdx+1)%this._getSlideImages().length},1e3*e))}_stopSlideTimer(){this._slideTimer&&(clearInterval(this._slideTimer),this._slideTimer=null)}_slideTouchStart(e){this._slideTouchStartX=e.touches[0]?.clientX??null}_slideTouchEnd(e){if(null==this._slideTouchStartX)return;const t=(e.changedTouches[0]?.clientX??0)-this._slideTouchStartX;this._slideTouchStartX=null,Math.abs(t)<50||(t<0?this._nextSlide():this._prevSlide())}_renderSlideshow(e){const i=this._getSlideImages(),r=Math.min(this._slideIdx,i.length-1),a=i.length>1,s=i[r]||null;return t`
      <div class="wide-image-square"
        @touchstart=${a?this._slideTouchStart:null}
        @touchend=${a?this._slideTouchEnd:null}>
        ${s?t`<img src="${s}" alt="${e.name}" />`:t`
          <div class="hero-placeholder">
            <ha-icon icon="mdi:food"></ha-icon>
          </div>
        `}
        ${a?t`
          <button class="slide-btn slide-prev" @click=${this._prevSlide} title="${n("Previous")}">
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button class="slide-btn slide-next" @click=${this._nextSlide} title="${n("Next")}">
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <div class="slide-dots">
            ${i.map((e,i)=>t`<span class="slide-dot ${i===r?"active":""}"></span>`)}
          </div>
        `:""}
      </div>
    `}_renderChipGroup(e,i,r){return i?.length?t`
      <div class="chip-group">
        <span class="chip-group-label">${e}:</span>
        ${i.map(e=>t`<span class="chip ${r}">${e}</span>`)}
      </div>
    `:""}_renderChipGroups(e){const i=e.courses||[],r=e.categories||[],a=e.collections||[];return i.length||r.length||a.length?t`
      <div class="chips-area">
        ${i.length?t`
          <div class="chip-group-row">
            <span class="chip chip-label">${n("Course:")}</span>
            ${i.map(e=>t`<button class="chip chip-course chip-nav" @click=${()=>this._handleChipNav("courses",e)} title="${n(c`Filter by course: ${e}`)}">${e}</button>`)}
          </div>`:""}
        ${r.length?t`
          <div class="chip-group-row">
            <span class="chip chip-label">${n("Category:")}</span>
            ${r.map(e=>t`<button class="chip chip-category chip-nav" @click=${()=>this._handleChipNav("categories",e)} title="${n(c`Filter by category: ${e}`)}">${e}</button>`)}
          </div>`:""}
        ${a.length?t`
          <div class="chip-group-row">
            <span class="chip chip-label">${n("Collection:")}</span>
            ${a.map(e=>t`<button class="chip chip-collection chip-nav" @click=${()=>this._handleChipNav("collections",e)} title="${n(c`Filter by collection: ${e}`)}">${e}</button>`)}
          </div>`:""}
      </div>
    `:""}_renderMetaRow(e){if(!(e.servings||e.prep_time||e.cook_time||e.total_time))return"";const i=e.total_time||(e.prep_time||0)+(e.cook_time||0)||null,r=(e.prep_time||0)+(e.cook_time||0),a=i&&i!==r;return t`
      <div class="meta-chips">
        ${e.servings?t`
          <span class="meta-chip-icon">
            <ha-icon icon="mdi:silverware-fork-knife"></ha-icon>
            ${e.servings_text||e.servings}
          </span>
        `:""}
        ${e.prep_time?t`
          <span class="meta-chip-icon">
            <ha-icon icon="mdi:pencil-outline"></ha-icon>
            ${this._formatTime(e.prep_time)}
          </span>
        `:""}
        ${e.cook_time?t`
          <span class="meta-chip-icon">
            <ha-icon icon="mdi:pot-steam-outline"></ha-icon>
            ${this._formatTime(e.cook_time)}
          </span>
        `:""}
        ${a?t`
          <span class="meta-chip-icon">
            <ha-icon icon="mdi:clock-outline"></ha-icon>
            ${this._formatTime(i)}
          </span>
        `:""}
      </div>
    `}_renderQuickRating(e){const i=e.rating||0;return t`
      <div class="quick-rating">
        ${[1,2,3,4,5].map(e=>t`
          <span class="qr-star ${e<=i?"filled":""}"
            @click=${()=>this._handleQuickRate(e)}>★</span>
        `)}
      </div>
    `}_renderActionButtons(e){return t`
      <div class="action-btns-row">
        <button class="action-icon-btn ${e.is_favourite?"fav-active":""}"
          @click=${this._handleToggleFav}
          title="${e.is_favourite?n("Remove from favourites"):n("Add to favourites")}">
          <span class="btn-icon"><ha-icon icon="${e.is_favourite?"mdi:heart":"mdi:heart-outline"}"></ha-icon></span>
          <span>${n("Favourite")}</span>
        </button>
        <button class="action-icon-btn" @click=${this._handleShowPlanner} title="${n("Add to meal plan")}">
          <span class="btn-icon"><ha-icon icon="mdi:calendar-plus"></ha-icon></span>
          <span>${n("Plan")}</span>
        </button>
        ${e.source_url?t`
          <a class="action-icon-btn" href="${e.source_url}" target="_blank" rel="noopener" title="${n("Open source")}">
            <span class="btn-icon"><ha-icon icon="mdi:open-in-new"></ha-icon></span>
            <span>${n("Source")}</span>
          </a>
        `:""}
        <button class="action-icon-btn" @click=${this._startEdit} title="${n("Edit recipe")}">
          <span class="btn-icon"><ha-icon icon="mdi:pencil-outline"></ha-icon></span>
          <span>${n("Edit")}</span>
        </button>
      </div>
    `}_renderScaler(){const e=this.recipe;return e?.servings?t`
      <div class="scaler-row">
        <ha-icon class="scaler-icon" icon="mdi:silverware-fork-knife"></ha-icon>
        <div class="scaler-ctrl">
          <button class="scaler-btn" @click=${()=>{this._servingMult>.25&&(this._servingMult=Math.round(4*(this._servingMult-.25))/4)}}>
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <span class="scaler-val">×${this._servingMult}</span>
          <button class="scaler-btn" @click=${()=>{this._servingMult=Math.round(4*(this._servingMult+.25))/4}}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `:""}_renderWakeLock(){return this.settings?.keepScreenOn?T()?t`
      <div class="wakelock-row">
        <button class="wakelock-btn ${this._wakeActive?"active":""}"
          @click=${()=>this._wakeActive?this._releaseWakeLock():this._requestWakeLock()}
          title="${this._wakeActive?n("Release screen lock"):n("Keep screen on")}">
          <ha-icon icon="${this._wakeActive?"mdi:eye":"mdi:eye-off-outline"}"></ha-icon>
          ${this._wakeActive?n("Screen on"):n("Keep screen on")}
        </button>
      </div>
    `:t`
        <div class="wakelock-row">
          <span class="wakelock-unsupported"
            title="${n("Requires a secure (HTTPS) connection and a browser that supports the Wake Lock API")}">
            <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            ${n("Screen lock unavailable")}
          </span>
        </div>
      `:""}render(){if(!this.recipe)return t``;const e=this.recipe;return this.wide?this._renderWide(e):this._renderNarrow(e)}_renderWide(e){const i=this._groupIngredients(e.ingredients),r=this._showShoppingPicker,a=this._checkedIngredients,s=a?.size??0;return t`
      <div class="detail-container wide">
        <!--
          CSS grid: 2 cols (1fr 2fr) × auto rows
          [image]   [info card]
          [ings]    [directions]
          Whole card scrolls — no independent column scrolling
        -->
        <div class="wide-layout">

          <!-- row 1: image (1/3) + info card (2/3) -->
          <div class="wide-row">

          <!-- col 1: square image card (padding-top:100% inner wrapper forces square) -->
          <div class="wide-image-card">
            ${this._renderSlideshow(e)}
          </div>

          <!-- col 2: info card -->
          <div class="wide-info-card">
            <h1 class="wide-title">${e.name}</h1>
            ${this._renderActionButtons(e)}
            ${e.description?t`<div class="wide-desc md-content">${H(K(e.description))}</div>`:""}
            ${this._renderMetaRow(e)}
            ${this._renderChipGroups(e)}
          </div>

          </div><!-- end wide-row 1 -->

          <!-- row 2: ingredients (1/3) + directions (2/3) -->
          <div class="wide-row">

          <!-- col 1: ingredients column -->
          <div class="wide-ing-col">
            <!-- ingredients controls: scaler left, cart right — above ingredients only -->
            <div class="wide-ing-controls">
              ${this._renderScaler()}
              ${"success"===this._shoppingResult?t`
                <span class="ing-shop-success"><ha-icon icon="mdi:check-circle-outline"></ha-icon></span>
              `:t`
                <button class="ing-shop-btn ${r?"active":""}"
                  @click=${r?()=>{this._showShoppingPicker=!1}:this._openShoppingPicker}
                  title="${n(r?"Cancel":"Add to shopping list")}">
                  <ha-icon icon="${r?"mdi:close":"mdi:cart-plus"}"></ha-icon>
                </button>
              `}
            </div>

            <!-- shopping picker / review (shown inline when picking) -->
            ${r?this._shoppingReview?t`
              <div class="wide-section-card">${this._renderShoppingReview()}</div>
            `:t`
              <div class="wide-section-card shopping-picker-panel">
                <div class="picker-select-row">
                  <button class="picker-sel-btn" @click=${this._selectAllIngredients}>${n("Select All")}</button>
                  <button class="picker-sel-btn" @click=${this._clearAllIngredients}>${n("Clear All")}</button>
                  ${this.slmAvailable&&this.shoppingLists.length?t`
                    <select class="list-select" .value=${this._selectedListId}
                      @change=${e=>{this._selectedListId=e.target.value}}>
                      ${this.shoppingLists.map(e=>t`
                        <option value="${e.id}" ?selected=${e.id===this._selectedListId}>${e.name}</option>
                      `)}
                    </select>
                  `:""}
                </div>
                <div class="picker-btns">
                  <button class="action-btn" @click=${()=>{this._showShoppingPicker=!1}}>${n("Cancel")}</button>
                  <button class="action-btn primary"
                    ?disabled=${this._shoppingAdding||!s}
                    @click=${this._handleAddToShopping}>
                    ${this._shoppingAdding?t`<ha-circular-progress active size="tiny"></ha-circular-progress>`:n(s?c`Add (${s})`:"Add")}
                  </button>
                </div>
              </div>
            `:""}

            ${i.map(i=>t`
              <div class="wide-section-card">
                ${i.header?t`<div class="wide-section-title">${i.header}</div>`:""}
                ${i.items.length?t`
                  <ul class="ingredient-list">
                    ${i.items.map(i=>{const s=(e.ingredients||[]).indexOf(i),{amount:o,unit:n}=this._getDisplayAmount(i);return t`
                        <li class="ingredient-item ${r?"selectable":""}"
                          @click=${r?()=>this._toggleIngredient(s):void 0}>
                          ${r?t`
                            <span class="ing-check ${a?.has(s)?"checked":""}">
                              ${a?.has(s)?t`<ha-icon icon="mdi:check"></ha-icon>`:""}
                            </span>
                          `:""}
                          <span class="ing-amount">${o} ${n}</span>
                          <span class="ing-name">${i.name}${i.notes?t` <em class="ing-notes">(${i.notes})</em>`:""}</span>
                        </li>
                      `})}
                  </ul>
                `:""}
              </div>
            `)}

            <div class="wide-section-card">
              ${this._renderNutritionRing(e)}
            </div>
          </div>

          <!-- col 2: directions column, each step its own card -->
          <div class="wide-dir-col">
            <div class="wide-dir-spacer"></div>
            ${this._renderWakeLock()}
            ${(e.instructions||[]).length?(e.instructions||[]).map((e,i)=>{const r=this._completedSteps.has(i);return t`
                <div class="wide-section-card wide-step-card ${r?"step-done":""}">
                  <span class="step-num ${r?"done":""}"
                    @click=${e=>{e.stopPropagation(),this._toggleStepComplete(i)}}
                    title="${n(r?"Mark incomplete":"Mark complete")}"
                  >${r?t`<ha-icon icon="mdi:check"></ha-icon>`:i+1}</span>
                  <span class="step-text">${this._renderStepWithTimers(e)}</span>
                </div>
              `}):t`<p class="empty-tab">${n("No directions listed.")}</p>`}
            ${e.notes?t`
              <div class="wide-section-card">
                <div class="wide-section-title">${n("Notes")}</div>
                <div class="notes-text md-content">${H(K(e.notes))}</div>
              </div>
            `:""}
          </div>

          </div><!-- end wide-row 2 -->

        </div>

        <!-- Edit overlay -->
        ${this._editing?this._renderEditPanel():""}
      </div>
    `}_renderNarrow(e){const i=e.total_time||(e.prep_time||0)+(e.cook_time||0)||null;return t`
      <div class="detail-container">
        <!-- Hero image -->
        <div class="hero ${e.image_url?"":"no-image"}">
          ${e.image_url?t`
            <img src="${e.image_url}" alt="${e.name}" />
            <div class="hero-overlay"></div>
          `:t`
            <div class="hero-placeholder">
              <ha-icon icon="mdi:food"></ha-icon>
            </div>
          `}
          <div class="hero-actions">
            <button class="hero-btn ${e.is_favourite?"fav-active":""}" @click=${this._handleToggleFav}
              title="${e.is_favourite?n("Remove from favourites"):n("Add to favourites")}">
              <ha-icon icon="${e.is_favourite?"mdi:heart":"mdi:heart-outline"}"></ha-icon>
            </button>
            ${e.source_url?t`
              <a class="hero-btn" href="${e.source_url}" target="_blank" rel="noopener" title="${n("Open source")}">
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </a>
            `:""}
          </div>
        </div>

        <div class="detail-scroll">
          <!-- Recipe meta -->
          <div class="detail-head">
            <h2 class="recipe-title">${e.name}</h2>
            ${this._renderActionButtons(e)}
            ${e.description?t`<div class="detail-desc md-content">${H(K(e.description))}</div>`:""}

            <div class="meta-row">
              ${e.prep_time?t`
                <div class="meta-item">
                  <span class="meta-label">${n("Prep")}</span>
                  <span class="meta-val">${this._formatTime(e.prep_time)}</span>
                </div>
              `:""}
              ${e.cook_time?t`
                <div class="meta-item">
                  <span class="meta-label">${n("Cook")}</span>
                  <span class="meta-val">${this._formatTime(e.cook_time)}</span>
                </div>
              `:""}
              ${i?t`
                <div class="meta-item">
                  <span class="meta-label">${n("Total")}</span>
                  <span class="meta-val">${this._formatTime(i)}</span>
                </div>
              `:""}
              ${e.servings?t`
                <div class="meta-item">
                  <span class="meta-label">${n("Serves")}</span>
                  <span class="meta-val">${e.servings_text||e.servings}</span>
                </div>
              `:""}
            </div>

            ${this._renderChipGroups(e)}
          </div>

          <!-- Serving scaler -->
          ${this._renderScaler()}

          <!-- Tabs -->
          <div class="tabs-row">
            ${[["ingredients",n("Ingredients")],["directions",n("Directions")],["notes",n("Notes")],["nutrition",n("Nutrition")],["photos",n("Photos")]].map(([e,i])=>t`
              <button
                class="tab-btn ${this._activeTab===e?"active":""}"
                @click=${()=>{this._activeTab=e}}
              >${i}</button>
            `)}
          </div>

          <!-- Wake lock button (shown when setting enabled) -->
          ${this._renderWakeLock()}

          <!-- Tab content -->
          <div class="tab-content">
            ${"ingredients"===this._activeTab?this._renderIngredients(e):""}
            ${"directions"===this._activeTab?this._renderDirections(e):""}
            ${"notes"===this._activeTab?this._renderNotes(e):""}
            ${"nutrition"===this._activeTab?this._renderNutritionRing(e):""}
            ${"photos"===this._activeTab?this._renderPhotos(e):""}
          </div>
        </div>

        <!-- Edit panel (inline overlay) -->
        ${this._editing?this._renderEditPanel():""}
      </div>
    `}_getDisplayAmount(e){if(this._metricMode){const t=function(e,t){if(!e||!t)return null;const i=parseFloat(e);if(isNaN(i))return null;const r=t.toLowerCase().trim(),a=ee[r];if(!a)return null;let s=i*a.factor,o=a.to;"lb"===r&&s>=500&&(s/=1e3,o="kg"),"ml"===o&&s>=1e3&&(s/=1e3,o="L");const n=s>=10?Math.round(s):Math.round(10*s)/10;return{amount:String(n),unit:o}}(this._scaleAmount(e.amount),e.unit);if(t)return t}return{amount:this._scaleAmount(e.amount)||"",unit:e.unit||""}}_groupIngredients(e){const t=[];let i={header:null,items:[]};for(const r of e||[])if(r.is_heading||r.name?.startsWith("#")){(i.items.length>0||null!==i.header)&&t.push(i);i={header:(r.name?.startsWith("#")?r.name.slice(1).trim():r.name)||"",items:[]}}else i.items.push(r);return(i.items.length>0||null!==i.header)&&t.push(i),t.length?t:[{header:null,items:e||[]}]}_renderIngredients(e){const i=this._showShoppingPicker,r=this._checkedIngredients,a=r?.size??0,s=(e.ingredients||[]).some(e=>e.unit&&ee[e.unit.toLowerCase().trim()]);return t`
      ${this.settings?.showUnitConversion&&s?t`
        <div class="metric-toggle-row">
          <button class="metric-btn ${this._metricMode?"active":""}"
            @click=${()=>{this._metricMode=!this._metricMode}}>
            <ha-icon icon="mdi:swap-horizontal"></ha-icon>
            ${this._metricMode?n("Showing metric"):n("Convert to metric")}
          </button>
        </div>
      `:""}

      ${e.ingredients?.length?t`
        <ul class="ingredient-list">
          ${e.ingredients.map((e,a)=>{if(e.is_heading||e.name?.startsWith("#")){const i=e.name?.startsWith("#")?e.name.slice(1).trim():e.name;return t`<li class="ing-heading">${i}</li>`}const{amount:s,unit:o}=this._getDisplayAmount(e);return t`
              <li class="ingredient-item ${i?"selectable":""}"
                @click=${i?()=>this._toggleIngredient(a):void 0}>
                ${i?t`
                  <span class="ing-check ${r?.has(a)?"checked":""}">
                    ${r?.has(a)?t`<ha-icon icon="mdi:check"></ha-icon>`:""}
                  </span>
                `:""}
                <span class="ing-amount">${s} ${o}</span>
                <span class="ing-name">${e.name}${e.notes?t` <em class="ing-notes">(${e.notes})</em>`:""}</span>
              </li>
            `})}
        </ul>
      `:t`<p class="empty-tab">${n("No ingredients listed.")}</p>`}

      <!-- Shopping section (always shown) -->
      <div class="shopping-section">
        ${"success"===this._shoppingResult?t`
          <div class="shopping-success">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${n("Added to shopping list!")}
          </div>
        `:i&&this._shoppingReview?this._renderShoppingReview():i?t`
          <div class="shopping-picker-panel">
            <div class="picker-select-row">
              <button class="picker-sel-btn" @click=${this._selectAllIngredients}>${n("Select All")}</button>
              <button class="picker-sel-btn" @click=${this._clearAllIngredients}>${n("Clear All")}</button>
              ${this.slmAvailable&&this.shoppingLists.length?t`
                <select class="list-select" .value=${this._selectedListId}
                  @change=${e=>{this._selectedListId=e.target.value}}>
                  ${this.shoppingLists.map(e=>t`
                    <option value="${e.id}" ?selected=${e.id===this._selectedListId}>${e.name}</option>
                  `)}
                </select>
              `:this.slmAvailable?t`
                <span class="shopping-note">${n("No lists found in Shopping List Manager")}</span>
              `:""}
            </div>
            <div class="picker-btns">
              <button class="action-btn" @click=${()=>{this._showShoppingPicker=!1}}>${n("Cancel")}</button>
              <button class="action-btn primary"
                ?disabled=${this._shoppingAdding||!a}
                @click=${this._handleAddToShopping}>
                ${this._shoppingAdding?t`<ha-circular-progress active size="tiny"></ha-circular-progress>`:n(a?c`Add (${a})`:"Add")}
              </button>
            </div>
          </div>
        `:t`
          <button class="action-btn primary shopping-btn" @click=${this._openShoppingPicker}>
            <ha-icon icon="mdi:cart-plus"></ha-icon>
            ${n("Add to Shopping List")}
          </button>
        `}
      </div>
    `}_toggleStepComplete(e){const t=new Set(this._completedSteps);t.has(e)?t.delete(e):t.add(e),this._completedSteps=t}_renderDirections(e){return e.instructions?.length?t`
      <ol class="steps-list">
        ${e.instructions.map((e,i)=>{const r=this._completedSteps.has(i);return t`
            <li class="step-item ${r?"step-done":""}">
              <span class="step-num ${r?"done":""}"
                @click=${e=>{e.stopPropagation(),this._toggleStepComplete(i)}}
                title="${n(r?"Mark incomplete":"Mark complete")}"
              >${r?t`<ha-icon icon="mdi:check"></ha-icon>`:i+1}</span>
              <span class="step-text">${this._renderStepWithTimers(e)}</span>
            </li>
          `})}
      </ol>
    `:t`<p class="empty-tab">${n("No directions listed.")}</p>`}_renderStepWithTimers(e){const i=[];let r,a=0;for(J.lastIndex=0;null!==(r=J.exec(e));){r.index>a&&i.push(e.slice(a,r.index));const s=r[0],o=Z(s);o>0?i.push(t`<button class="time-chip" @click=${e=>{e.stopPropagation(),this._fireTimer(o,s)}} title="${n(c`Start timer for ${s}`)}">
          <ha-icon icon="mdi:timer-outline"></ha-icon>${s}
        </button>`):i.push(s),a=r.index+r[0].length}return a<e.length&&i.push(e.slice(a)),i}_renderNotes(e){return t`
      ${e.notes?t`<div class="notes-text md-content">${H(K(e.notes))}</div>`:t`<p class="empty-tab">${n("No notes.")}</p>`}
    `}_renderNutrition(e){const i=e.nutrition||{};if(!X.some(e=>null!=i[e.key]&&""!==i[e.key]))return t`
        <div class="empty-tab">
          <p>${n("No nutrition info. Add it via the edit panel.")}</p>
        </div>
      `;const r=e.servings?n(c`Per serving (${e.servings_text||e.servings})`):n("Per serving");return t`
      <div class="nutrition-panel">
        <div class="nutr-header">${n("Nutrition Facts")}</div>
        <div class="nutr-sub">${r}</div>
        <div class="nutr-divider thick"></div>
        ${X.map(e=>{const r=i[e.key];return null==r||""===r?"":t`
            <div class="nutr-row ${e.bold?"nutr-bold":""} ${e.indent?"nutr-indent":""}">
              <span class="nutr-label">${e.label}</span>
              <span class="nutr-val">${r}${"kcal"!==e.unit?t`<em> ${e.unit}</em>`:""}</span>
            </div>
            <div class="nutr-divider"></div>
          `})}
      </div>
    `}_renderNutritionRing(e){const i=e?.nutrition||{},r=parseFloat(i.calories)||0,a=parseFloat(i.fat)||0,s=parseFloat(i.carbohydrates)||0,o=parseFloat(i.protein)||0,l=9*a,d=4*s,p=4*o,h=l+d+p;if(!(h>0||r>0))return t`
        <div class="nutr-card">
          <p class="empty-tab" style="margin:0;padding:8px 0;text-align:center">${n("No nutritional information available.")}</p>
        </div>`;const m=[{label:n("Carbs"),val:s,cal:d,color:"#f59e0b"},{label:n("Total fat"),val:a,cal:l,color:"#3b82f6"},{label:n("Protein"),val:o,cal:p,color:"#22c55e"}],u=50,g=50,b=2*Math.PI*42,v=7+4*b/360,f=h>0?Math.max(0,d/h*b-v):0,x=h>0?Math.max(0,l/h*b-v):0,_=h>0?Math.max(0,p/h*b-v):0,y=(h>0?d/h*360:0)-90,w=y+(h>0?l/h*360:0),k=r>0?Math.round(r):h>0?Math.round(h):null,$=Object.entries(Y).filter(([e])=>parseFloat(i[e])>0).map(([e,t])=>{const r=parseFloat(i[e]),a=Math.min(Math.round(r/t.val*100),999);return{key:e,label:t.label,val:r,unit:t.unit,pct:a}});return t`
      <div class="nutr-card">
        <!-- Top row: donut ring + macro columns -->
        <div class="nutr-top">
          <div class="nutr-ring-wrap">
            <svg width="90" height="90" viewBox="0 0 100 100" style="display:block">
              <!-- Background track — always visible -->
              <circle cx="${u}" cy="${g}" r="${42}" fill="none"
                stroke="var(--rm-border)" stroke-width="7"/>
              <!-- Colored arcs: all 3 inline in the same html template so they
                   inherit SVG namespace from the parser. Hidden via opacity when
                   there's no data. Dynamic values are attributes, not new elements. -->
              <circle cx="${u}" cy="${g}" r="${42}" fill="none"
                stroke="#f59e0b" stroke-width="7" stroke-linecap="round"
                stroke-dasharray="${f} ${b}"
                transform="rotate(${-90} ${u} ${g})"
                opacity="${h>0&&f>0?.95:0}"/>
              <circle cx="${u}" cy="${g}" r="${42}" fill="none"
                stroke="#3b82f6" stroke-width="7" stroke-linecap="round"
                stroke-dasharray="${x} ${b}"
                transform="rotate(${y} ${u} ${g})"
                opacity="${h>0&&x>0?.95:0}"/>
              <circle cx="${u}" cy="${g}" r="${42}" fill="none"
                stroke="#22c55e" stroke-width="7" stroke-linecap="round"
                stroke-dasharray="${_} ${b}"
                transform="rotate(${w} ${u} ${g})"
                opacity="${h>0&&_>0?.95:0}"/>
              <text x="${u}" y="${48}" text-anchor="middle"
                fill="var(--rm-text)" font-size="16" font-weight="700" font-family="inherit">
                ${k??"–"}
              </text>
              <text x="${u}" y="${62}" text-anchor="middle"
                fill="var(--rm-text-secondary)" font-size="9" font-family="inherit">${n("cals")}</text>
            </svg>
          </div>

          <div class="nutr-macro-cols">
            ${m.map(e=>{const i=h>0?Math.round(e.cal/h*100):0;return t`
                <div class="nutr-macro-col">
                  <span class="nutr-mcol-num" style="color:${e.color}">${e.val>0?`${e.val} g`:"—"}</span>
                  <span class="nutr-mcol-label">${e.label}</span>
                  ${i>0?t`<span class="nutr-mcol-pct" style="color:${e.color}">${i}% cals</span>`:""}
                </div>
              `})}
          </div>
        </div>

        ${e?.servings?t`
          <div class="nutr-serving-note">
            ${e.servings_text?n(c`Per ${e.servings_text}`):1===e.servings?n(c`Per ${e.servings} serving`):n(c`Per ${e.servings} servings`)}
          </div>
        `:""}

        <!-- Daily RDA collapsible -->
        ${$.length?t`
          <button class="nutr-rda-toggle" @click=${()=>{this._nutritionExpanded=!this._nutritionExpanded}}>
            <span class="nutr-rda-title">${n("Daily RDA Nutrition")}</span>
            <span class="nutr-rda-count">${$.length}</span>
            <ha-icon icon="${this._nutritionExpanded?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
          </button>
          ${this._nutritionExpanded?t`
            <div class="nutr-rda-rows">
              ${$.map(e=>t`
                <div class="nutr-rda-row">
                  <span class="nutr-rda-label">${e.label}</span>
                  <span class="nutr-rda-val">${e.val} ${e.unit}</span>
                  <span class="nutr-rda-pct">${e.pct}%</span>
                  <div class="nutr-rda-bar-wrap">
                    <div class="nutr-rda-bar ${e.pct>100?"over":""}" style="width:${Math.min(e.pct,100)}%"></div>
                  </div>
                </div>
              `)}
            </div>
          `:""}
        `:""}
      </div>
    `}_renderPhotos(e){const i=e.photos||[],r=e.image_url,a=r?[r,...i.filter(e=>e!==r)]:i;return t`
      <div class="photos-tab">
        ${a.length?t`
          <div class="photos-grid">
            ${a.map(e=>t`
              <div class="photo-item ${e===r?"main-photo":""}">
                <img src="${e}" alt="${n("Recipe photo")}" loading="lazy" />
                ${e===r?t`<span class="photo-badge">${n("Main")}</span>`:t`
                  <button class="photo-action set-main" @click=${()=>this._setMainPhoto(e)} title="${n("Set as main photo")}">
                    <ha-icon icon="mdi:star-outline"></ha-icon>
                  </button>
                `}
                <button class="photo-action remove-photo" @click=${()=>this._removePhoto(e)} title="${n("Remove photo")}">
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        `:t`
          <div class="empty-tab">
            <ha-icon icon="mdi:image-off-outline"></ha-icon>
            <p>${n("No photos yet.")}</p>
          </div>
        `}

        <div class="photo-add-section">
          <div class="photo-add-label">${n("Add a photo")}</div>
          <div class="photo-url-row">
            <input
              type="url"
              class="photo-url-input"
              placeholder="${n("Paste image URL…")}"
              .value=${this._photoUrlInput}
              @input=${e=>{this._photoUrlInput=e.target.value}}
              @keydown=${e=>{"Enter"===e.key&&this._handleAddPhotoUrl()}}
            />
            <button class="action-btn primary" ?disabled=${!this._photoUrlInput.trim()||this._addingPhotoUrl}
              @click=${this._handleAddPhotoUrl}>
              ${n("Add")}
            </button>
          </div>
          <div class="camera-btns">
            <label class="camera-btn-split">
              <ha-icon icon="mdi:camera"></ha-icon>
              <span>${n("Take Photo")}</span>
              <input type="file" accept="image/*" capture="environment" class="camera-input"
                @change=${this._handleCameraCapture} />
            </label>
            <label class="camera-btn-split">
              <ha-icon icon="mdi:image-multiple-outline"></ha-icon>
              <span>${n("Choose from Library")}</span>
              <input type="file" accept="image/*" class="camera-input"
                @change=${this._handleCameraCapture} />
            </label>
          </div>
        </div>
      </div>
    `}_renderEditPanel(){const e=this._editData;return t`
      <div class="edit-overlay" @click=${e=>{e.target===e.currentTarget&&this._cancelEdit()}}>
        <div class="edit-panel">
          <div class="edit-header">
            <span>${n("Edit Recipe")}</span>
            <button class="icon-btn" @click=${this._cancelEdit}><ha-icon icon="mdi:close"></ha-icon></button>
          </div>
          <div class="edit-body">

            ${this._renderField(n("Name"),"name","text")}

            <!-- Image section -->
            <div class="edit-section-label">${n("Image")}</div>
            <div class="edit-photo-row">
              ${(()=>{const i=[...new Set([e.image_url,...e.photos||[]].filter(Boolean))];return t`
                  ${i.map(i=>t`
                    <div class="edit-photo-thumb ${i===e.image_url?"selected":""}"
                      @click=${()=>this._handleEditField("image_url",i)}
                      title="${n("Set as main image")}">
                      <img src="${i}" alt="" />
                      ${i===e.image_url?t`<span class="edit-thumb-badge"><ha-icon icon="mdi:check"></ha-icon></span>`:""}
                    </div>
                  `)}
                  <label class="edit-photo-add ${this._editImageUploading?"loading":""}" title="${n("Upload photo")}">
                    <input type="file" accept="image/*" style="display:none"
                      @change=${e=>{const t=e.target.files?.[0];t&&this._editUploadImage(t),e.target.value=""}} />
                    <ha-icon icon="${this._editImageUploading?"mdi:loading":"mdi:plus"}"></ha-icon>
                  </label>
                `})()}
            </div>
            <div class="edit-field">
              <label>${n("Or paste image URL")}</label>
              <input type="url" .value=${e.image_url??""}
                @input=${e=>this._handleEditField("image_url",e.target.value)}
                placeholder="https://…" />
            </div>

            ${this._renderField(n("Description"),"description","textarea")}
            ${this._renderField(n("Source URL"),"source_url","url")}

            <div class="edit-row-3">
              ${this._renderField(n("Prep (min)"),"prep_time","number")}
              ${this._renderField(n("Cook (min)"),"cook_time","number")}
              ${this._renderField(n("Servings"),"servings","number")}
            </div>

            <!-- Star rating picker -->
            <div class="edit-field">
              <label>${n("Rating")}</label>
              <div class="edit-stars">
                ${[1,2,3,4,5].map(i=>t`
                  <span class="edit-star ${i<=(e.rating||0)?"filled":""}"
                    @click=${()=>this._handleEditField("rating",e.rating===i?0:i)}
                  >★</span>
                `)}
              </div>
            </div>

            ${this._renderListPicker("tags",n("Tags"),this.allTags)}
            ${this._renderListPicker("courses",n("Courses"),this.allCourses)}
            ${this._renderListPicker("categories",n("Categories"),this.allCategories)}
            ${this._renderListPicker("collections",n("Collections"),this.allCollections)}
            ${this._renderField(n("Notes"),"notes","textarea")}

            <!-- Ingredients editor -->
            <div class="edit-section-label">${n(c`Ingredients (${(e.ingredients||[]).length})`)}</div>
            ${(e.ingredients||[]).length?t`
              <ul class="edit-ing-list">
                ${(e.ingredients||[]).map((i,r)=>{const a=this._editIngEdit?.idx===r,s=i.is_heading||i.name?.startsWith("#");if(a){const e=this._editIngEdit;return t`
                      <li class="edit-ing-inline-edit ${s?"edit-ing-heading":""}">
                        ${e.heading?t`
                          <input class="ing-inline-input ing-inline-name" type="text" placeholder="${n("Section header")}"
                            .value=${e.name}
                            @input=${t=>{this._editIngEdit={...e,name:t.target.value}}}
                            @keydown=${e=>{"Enter"===e.key&&this._saveEditIngredient(),"Escape"===e.key&&this._cancelEditIngredient()}}
                          />
                        `:t`
                          <input class="ing-inline-input ing-inline-amt" type="text" placeholder="${n("Amt")}"
                            .value=${e.amount}
                            @input=${t=>{this._editIngEdit={...e,amount:t.target.value}}}
                            @keydown=${e=>{"Enter"===e.key&&this._saveEditIngredient(),"Escape"===e.key&&this._cancelEditIngredient()}}
                          />
                          <input class="ing-inline-input ing-inline-unit" type="text" placeholder="${n("Unit")}"
                            .value=${e.unit}
                            @input=${t=>{this._editIngEdit={...e,unit:t.target.value}}}
                            @keydown=${e=>{"Enter"===e.key&&this._saveEditIngredient(),"Escape"===e.key&&this._cancelEditIngredient()}}
                          />
                          <input class="ing-inline-input ing-inline-name" type="text" placeholder="${n("Ingredient")}"
                            .value=${e.name}
                            @input=${t=>{this._editIngEdit={...e,name:t.target.value}}}
                            @keydown=${e=>{"Enter"===e.key&&this._saveEditIngredient(),"Escape"===e.key&&this._cancelEditIngredient()}}
                          />
                        `}
                        <button class="ing-inline-save" @click=${this._saveEditIngredient} title="${n("Save")}">
                          <ha-icon icon="mdi:check"></ha-icon>
                        </button>
                        <button class="ing-inline-cancel" @click=${this._cancelEditIngredient} title="${n("Cancel")}">
                          <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                      </li>
                    `}return t`
                    <li
                      draggable="true"
                      class="${s?"edit-ing-heading":""} ${this._dragIngOver===r?"drag-over":""}"
                      @dragstart=${e=>{this._dragIngFrom=r,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(r))}}
                      @dragover=${e=>{e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragIngOver!==r&&(this._dragIngOver=r)}}
                      @dragleave=${()=>{this._dragIngOver===r&&(this._dragIngOver=-1)}}
                      @drop=${e=>{e.preventDefault(),this._editDropIngredient(this._dragIngFrom,r)}}
                      @dragend=${()=>{this._dragIngOver=-1,this._dragIngFrom=-1}}
                    >
                      <ha-icon icon="mdi:drag-vertical" class="drag-handle"></ha-icon>
                      <span class="edit-ing-text" @click=${()=>this._startEditIngredient(r)} title="${n("Click to edit")}">
                        ${s?t`<strong>${i.name?.startsWith("#")?i.name.slice(1).trim():i.name}</strong>`:t`${i.amount?`${i.amount}${i.unit?" "+i.unit:""} `:""}${i.name}`}
                      </span>
                      <div class="edit-reorder-btns">
                        <button class="edit-move-btn" ?disabled=${0===r} @click=${()=>this._editMoveIngredient(r,-1)} title="${n("Move up")}">
                          <ha-icon icon="mdi:chevron-up"></ha-icon>
                        </button>
                        <button class="edit-move-btn" ?disabled=${r===e.ingredients.length-1} @click=${()=>this._editMoveIngredient(r,1)} title="${n("Move down")}">
                          <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </button>
                      </div>
                      <button class="edit-remove-btn" @click=${()=>this._editRemoveIngredient(r)}>
                        <ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    </li>
                  `})}
              </ul>
            `:""}
            <div class="edit-add-row">
              <input
                type="text"
                .value=${this._editIngInput}
                @input=${e=>{this._editIngInput=e.target.value}}
                @keydown=${e=>{"Enter"===e.key&&this._editAddIngredient()}}
                placeholder="${n('e.g. "2 cups flour" or "# Section Header"')}"
              />
              <button class="edit-add-btn" @click=${this._editAddIngredient}>${n("Add")}</button>
            </div>

            <!-- Instructions editor -->
            <div class="edit-section-label">${n(c`Directions (${(e.instructions||[]).length} steps)`)}</div>
            ${(e.instructions||[]).length?t`
              <ol class="edit-steps-list">
                ${(e.instructions||[]).map((i,r)=>t`
                  <li
                    draggable="true"
                    class="${this._dragStepOver===r?"drag-over":""}"
                    @dragstart=${e=>{this._dragStepFrom=r,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",String(r))}}
                    @dragover=${e=>{e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragStepOver!==r&&(this._dragStepOver=r)}}
                    @dragleave=${()=>{this._dragStepOver===r&&(this._dragStepOver=-1)}}
                    @drop=${e=>{e.preventDefault(),this._editDropStep(this._dragStepFrom,r)}}
                    @dragend=${()=>{this._dragStepOver=-1,this._dragStepFrom=-1}}
                  >
                    <ha-icon icon="mdi:drag-vertical" class="drag-handle"></ha-icon>
                    <span class="edit-ing-text">${i}</span>
                    <div class="edit-reorder-btns">
                      <button class="edit-move-btn" ?disabled=${0===r} @click=${()=>this._editMoveStep(r,-1)} title="${n("Move up")}">
                        <ha-icon icon="mdi:chevron-up"></ha-icon>
                      </button>
                      <button class="edit-move-btn" ?disabled=${r===e.instructions.length-1} @click=${()=>this._editMoveStep(r,1)} title="${n("Move down")}">
                        <ha-icon icon="mdi:chevron-down"></ha-icon>
                      </button>
                    </div>
                    <button class="edit-remove-btn" @click=${()=>this._editRemoveStep(r)}>
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </li>
                `)}
              </ol>
            `:""}
            <div class="edit-add-row">
              <textarea
                rows="2"
                .value=${this._editStepInput}
                @input=${e=>{this._editStepInput=e.target.value}}
                @keydown=${e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),this._editAddStep(this._editStepInput),this._editStepInput="")}}
                placeholder="${n("Type a step, press Enter to add…")}"
              ></textarea>
              <button class="edit-add-btn" @click=${()=>{this._editAddStep(this._editStepInput),this._editStepInput=""}}>${n("Add")}</button>
            </div>

            <!-- Nutrition section -->
            <div class="edit-section-label">${n("Nutrition Facts (per serving)")}</div>
            <div class="edit-row-3">
              ${this._renderField(n("Calories (kcal)"),"cal","number")}
              ${this._renderField(n("Protein (g)"),"prot","number")}
              ${this._renderField(n("Fat (g)"),"fat","number")}
            </div>
            <div class="edit-row-3">
              ${this._renderField(n("Saturated Fat (g)"),"satf","number")}
              ${this._renderField(n("Carbs (g)"),"carb","number")}
              ${this._renderField(n("Fiber (g)"),"fib","number")}
            </div>
            <div class="edit-row-3">
              ${this._renderField(n("Sugar (g)"),"sug","number")}
              ${this._renderField(n("Sodium (mg)"),"sod","number")}
              ${this._renderField(n("Cholesterol (mg)"),"chol","number")}
            </div>

          </div>
          <div class="edit-footer">
            <button class="action-btn danger-outline" @click=${this._handleDeleteRecipe}
              title="${this._confirmDelete?n("Click again to confirm delete"):n("Delete recipe")}">
              <ha-icon icon="${this._confirmDelete?"mdi:alert":"mdi:trash-can-outline"}"></ha-icon>
              ${this._confirmDelete?n("Confirm?"):n("Delete")}
            </button>
            <div class="edit-footer-right">
              <button class="action-btn" @click=${this._cancelEdit}>${n("Cancel")}</button>
              <button class="action-btn primary" @click=${this._saveEdit}>${n("Save")}</button>
            </div>
          </div>
        </div>
      </div>
    `}_renderField(e,i,r){const a=this._editData[i]??"";return"textarea"===r?t`
        <div class="edit-field">
          <label>${e}</label>
          <textarea
            .value=${a}
            @input=${e=>this._handleEditField(i,e.target.value)}
            rows="3"
          ></textarea>
        </div>
      `:t`
      <div class="edit-field">
        <label>${e}</label>
        <input
          type="${r}"
          .value=${String(a)}
          @input=${e=>this._handleEditField(i,e.target.value)}
        />
      </div>
    `}static styles=i`
    :host([hide-shopping]) .ing-shop-btn, :host([hide-shopping]) .shopping-btn { display: none !important; }
    :host { display: block; height: 100%; }

    .detail-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    /* Wide two-column layout */
    .detail-container.wide { flex-direction: row; }
    .detail-left {
      width: 320px; flex-shrink: 0; display: flex; flex-direction: column;
      border-right: 1px solid var(--rm-border); overflow: hidden;
    }
    .detail-left .hero-img {
      height: 240px; flex-shrink: 0; position: relative; overflow: hidden;
      background: var(--rm-bg-elevated);
    }
    .detail-left .hero-img img { width: 100%; height: 100%; object-fit: cover; }
    .detail-left .hero-img .hero-placeholder {
      width: 100%; height: 100%; display: flex; align-items: center;
      justify-content: center; color: var(--rm-text-secondary);
    }
    .detail-left .hero-img .hero-placeholder ha-icon { --mdc-icon-size: 64px; opacity: 0.3; }
    .detail-left-scroll {
      flex: 1; overflow-y: auto; padding: 12px 14px 16px;
      scrollbar-width: thin; scrollbar-color: var(--rm-border) transparent;
    }
    .detail-right { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .detail-right-header { padding: 16px 16px 0; flex-shrink: 0; }
    .detail-right-scroll {
      flex: 1; overflow-y: auto; padding: 6px 16px 24px;
      scrollbar-width: thin; scrollbar-color: var(--rm-border) transparent;
    }
    .notes-section { margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--rm-border); }
    .notes-section h3 { margin: 0 0 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--rm-text-secondary); }

    /* Recipe title */
    .recipe-title {
      margin: 0 0 6px; font-size: 20px; font-weight: 700;
      color: var(--rm-text); line-height: 1.2;
    }
    .recipe-title.wide-centered { text-align: center; font-size: 22px; }
    .detail-desc.wide-centered { text-align: center; }
    .detail-right-header .quick-rating { justify-content: center; }
    .detail-right-header .action-btns-row { justify-content: center; }

    /* Quick rating */
    .quick-rating { display: flex; gap: 2px; margin: 0 0 8px; }
    .qr-star { font-size: 20px; cursor: pointer; color: var(--rm-border); -webkit-text-stroke: 1px rgba(200,150,0,0.4); transition: color 0.15s; }
    .qr-star.filled { color: #f5a623; -webkit-text-stroke: 1px #c47f0a; }
    .qr-star:hover { color: #f5a623; }

    /* Action buttons row */
    .action-btns-row {
      display: flex; gap: 16px; flex-wrap: wrap; margin: 6px 0 10px; justify-content: center;
    }
    .action-icon-btn {
      display: flex; flex-direction: column; align-items: center; gap: 5px;
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary); font-size: 10px; font-weight: 600;
      transition: color 0.15s; text-decoration: none; width: 56px;
    }
    .action-icon-btn .btn-icon {
      width: 46px; height: 46px; border-radius: 50%;
      background: var(--rm-accent-soft, rgba(255,107,53,0.12));
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s; flex-shrink: 0;
    }
    .action-icon-btn ha-icon { --mdc-icon-size: 22px; }
    .action-icon-btn:hover .btn-icon { background: rgba(255,107,53,0.25); }
    .action-icon-btn:hover { color: var(--rm-accent, #ff6b35); }
    .action-icon-btn.fav-active .btn-icon { background: rgba(207,102,121,0.15); }
    .action-icon-btn.fav-active { color: var(--error-color, #cf6679); }
    .action-icon-btn.danger .btn-icon { background: var(--error-color, #cf6679); }
    .action-icon-btn.danger { color: #fff; }

    /* Meta chips (wide layout) */
    .meta-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; justify-content: center; }
    .meta-chip-icon {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 20px; padding: 5px 12px; font-size: 12px;
      color: var(--rm-text-secondary); font-weight: 600;
    }
    .meta-chip-icon ha-icon { --mdc-icon-size: 14px; }

    /* Chip groups: column of rows, each row = label chip + value chips */
    .chips-area { display: flex; flex-direction: column; gap: 5px; }
    .chip-group-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
    .chip-label {
      background: var(--rm-bg); border: 1px solid var(--rm-border);
      color: var(--rm-text-secondary); font-weight: 600; cursor: default;
    }

    /* Hero */
    .hero {
      flex-shrink: 0;
      height: 180px;
      position: relative;
      background: var(--rm-surface, #2c2c2e);
      overflow: hidden;
    }
    .hero.no-image { height: 80px; }
    .hero img { width: 100%; height: 100%; object-fit: cover; }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%);
    }
    .hero-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--rm-text-secondary, #8e8e93);
    }
    .hero-placeholder ha-icon { --mdc-icon-size: 48px; opacity: 0.4; }

    .hero-actions {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 6px;
    }
    .hero-btn {
      background: rgba(0,0,0,0.55);
      border: none;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      padding: 0;
    }
    .hero-btn ha-icon { --mdc-icon-size: 18px; }
    .hero-btn:hover { background: rgba(0,0,0,0.75); }
    .hero-btn.fav-active { color: var(--error-color, #cf6679); }
    .hero-btn.delete-btn.confirm { background: var(--error-color, #cf6679); color: #fff; }

    /* Scroll area */
    .detail-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px 24px;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border, rgba(255,255,255,0.08)) transparent;
    }

    .detail-head { margin-bottom: 12px; }
    .detail-desc {
      margin: 0 0 8px;
      font-size: 14px;
      color: var(--rm-text-secondary, #8e8e93);
      line-height: 1.5;
    }

    .meta-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--rm-bg-elevated, #2c2c2e);
      border-radius: 8px;
      padding: 6px 12px;
      min-width: 60px;
    }
    .meta-label { font-size: 10px; color: var(--rm-text-secondary, #8e8e93); text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-val { font-size: 14px; font-weight: 600; color: var(--rm-text, #e5e5ea); }

    .tags-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
    .tag-chip {
      background: var(--rm-accent-soft, rgba(255,107,53,0.15));
      color: var(--rm-accent, #ff6b35);
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 12px;
    }

    /* Chip groups (courses, categories, collections) */
    .chip-group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 5px;
    }
    .chip-group-label {
      font-size: 11px;
      color: var(--rm-text-secondary, #8e8e93);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .chip {
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 12px;
      border: none;
      cursor: default;
    }
    .chip-nav {
      cursor: pointer;
      transition: filter 0.15s, opacity 0.15s;
    }
    .chip-nav:hover { filter: brightness(1.25); opacity: 0.9; }
    .chip-course    { background: rgba(88,166,255,0.15); color: #58a6ff; }
    .chip-category  { background: rgba(63,185,80,0.15);  color: #3fb950; }
    .chip-collection{ background: rgba(210,153,34,0.15); color: #d2a01e; }
    .chip-tag { background: var(--rm-accent-soft); color: var(--rm-accent); }

    /* Scaler */
    .scaler-row { display: flex; align-items: center; gap: 8px; }
    .scaler-icon { --mdc-icon-size: 18px; color: var(--rm-text-secondary); flex-shrink: 0; }
    .scaler-ctrl { display: flex; align-items: center; gap: 6px; }
    .scaler-btn {
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 50%;
      width: 34px; height: 34px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--rm-text-secondary); padding: 0; transition: all 0.15s;
    }
    .scaler-btn:hover { background: var(--rm-accent-soft); color: var(--rm-accent); border-color: var(--rm-accent); }
    .scaler-btn ha-icon { --mdc-icon-size: 18px; }
    .scaler-val {
      font-size: 13px; font-weight: 600; color: var(--rm-text);
      min-width: 34px; height: 34px; text-align: center;
      display: flex; align-items: center; justify-content: center;
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 8px;
    }

    /* Tabs */
    .tabs-row {
      display: flex;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      margin-bottom: 14px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs-row::-webkit-scrollbar { display: none; }
    .tab-btn {
      flex-shrink: 0;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      padding: 11px 14px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: var(--rm-text-secondary, #8e8e93);
      transition: color 0.15s, border-color 0.15s;
      white-space: nowrap;
    }
    .tab-btn.active {
      color: var(--rm-accent, #ff6b35);
      border-bottom-color: var(--rm-accent, #ff6b35);
    }

    /* Wake lock button */
    .wakelock-row {
      display: flex;
      justify-content: flex-end;
      padding: 4px 0 10px;
    }
    .wakelock-btn {
      display: inline-flex; align-items: center; gap: 5px;
      background: none; border: 1px solid var(--rm-border);
      border-radius: 20px; padding: 4px 12px;
      font-size: 12px; cursor: pointer;
      color: var(--rm-text-secondary);
      transition: all 0.15s;
    }
    .wakelock-btn ha-icon { --mdc-icon-size: 14px; }
    .wakelock-btn.active {
      background: var(--rm-accent-soft); color: var(--rm-accent);
      border-color: var(--rm-accent);
    }
    .wakelock-unsupported {
      display: inline-flex; align-items: center; gap: 5px;
      border: 1px dashed var(--rm-border);
      border-radius: 20px; padding: 4px 12px;
      font-size: 12px; color: var(--rm-text-muted); opacity: 0.8;
    }
    .wakelock-unsupported ha-icon { --mdc-icon-size: 14px; }

    /* Metric toggle */
    .metric-toggle-row {
      display: flex;
      justify-content: flex-end;
      padding: 0 0 8px;
    }
    .metric-btn {
      display: inline-flex; align-items: center; gap: 5px;
      background: none; border: 1px solid var(--rm-border);
      border-radius: 20px; padding: 4px 12px;
      font-size: 12px; cursor: pointer;
      color: var(--rm-text-secondary);
      transition: all 0.15s;
    }
    .metric-btn ha-icon { --mdc-icon-size: 14px; }
    .metric-btn.active {
      background: var(--rm-accent-soft); color: var(--rm-accent);
      border-color: var(--rm-accent);
    }

    /* Ingredient section heading */
    .ing-heading {
      list-style: none;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--rm-accent); padding: 10px 0 4px;
      margin-top: 6px;
    }

    /* Ingredients */
    .ingredient-list { list-style: none; padding: 0; margin: 0 0 16px; }
    .ingredient-item {
      display: flex;
      gap: 10px;
      align-items: baseline;
      padding: 10px 0;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.06));
    }
    .ingredient-item:last-child { border-bottom: none; }
    .ing-amount {
      font-size: 14px;
      font-weight: 700;
      color: var(--rm-accent, #ff6b35);
      min-width: 70px;
      flex-shrink: 0;
    }
    .ing-name { font-size: 15px; color: var(--rm-text, #e5e5ea); }
    .ing-notes { font-size: 13px; color: var(--rm-text-secondary, #8e8e93); font-style: italic; }

    /* Ingredient checkbox selection */
    .ingredient-item.selectable { cursor: pointer; border-radius: 6px; padding-left: 4px; }
    .ingredient-item.selectable:hover { background: var(--rm-accent-soft, rgba(255,107,53,0.1)); }
    .ing-check {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid var(--rm-border, rgba(255,255,255,0.15));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
    }
    .ing-check.checked {
      background: var(--rm-accent, #ff6b35);
      border-color: var(--rm-accent, #ff6b35);
      color: var(--rm-ink, #fff);
    }
    .ing-check ha-icon { --mdc-icon-size: 12px; }

    /* Shopping */
    .shopping-section { margin-top: 12px; }
    .shopping-btn { width: 100%; justify-content: center; gap: 6px; }
    .shopping-btn ha-icon { --mdc-icon-size: 18px; }
    .shopping-picker-panel {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 10px;
      padding: 10px;
    }
    .picker-select-row {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .picker-sel-btn {
      background: none;
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 6px;
      color: var(--rm-text-secondary, #8e8e93);
      padding: 4px 10px;
      cursor: pointer;
      font-size: 12px;
    }
    .picker-sel-btn:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .picker-btns { display: flex; gap: 8px; justify-content: flex-end; }
    .shopping-note { font-size: 12px; color: var(--rm-text-secondary, #8e8e93); }
    .list-select {
      flex: 1;
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 10px;
      font-size: 14px;
      min-width: 120px;
    }
    .shopping-success {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--success-color, #4caf50);
      font-size: 14px;
      padding: 8px 0;
    }
    .shopping-success ha-icon { --mdc-icon-size: 20px; }

    /* Directions */
    .steps-list { list-style: none; padding: 0; margin: 0; }
    .step-item {
      display: flex;
      gap: 14px;
      margin-bottom: 20px;
      align-items: flex-start;
    }
    .step-num {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      background: var(--rm-accent, #ff6b35);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: var(--rm-ink, #fff);
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      user-select: none;
    }
    .step-num:hover { opacity: 0.8; }
    .step-num.done {
      background: transparent;
      border: 2px solid var(--rm-border, rgba(255,255,255,0.2));
      color: var(--rm-text-muted);
    }
    .step-num.done ha-icon { --mdc-icon-size: 16px; }
    .step-item.step-done .step-text {
      opacity: 0.45;
      text-decoration: line-through;
      text-decoration-color: var(--rm-border);
    }
    .step-text { font-size: 15px; color: var(--rm-text, #e5e5ea); line-height: 1.7; transition: opacity 0.2s; }

    /* Timer chip in directions */
    .time-chip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: var(--rm-accent-soft, rgba(255,107,53,0.15));
      color: var(--rm-accent, #ff6b35);
      border: 1px solid var(--rm-accent, #ff6b35);
      border-radius: 12px;
      padding: 1px 7px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      vertical-align: middle;
    }
    .time-chip ha-icon { --mdc-icon-size: 12px; }
    .time-chip:hover { background: var(--rm-accent, #ff6b35); color: var(--rm-ink, #fff); }

    /* Notes */
    .notes-text { font-size: 14px; color: var(--rm-text, #e5e5ea); line-height: 1.6; }
    .empty-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--rm-text-secondary, #8e8e93);
      text-align: center;
      padding: 20px 0;
      margin: 0;
    }
    .empty-tab ha-icon { --mdc-icon-size: 40px; opacity: 0.35; }
    .empty-tab p { margin: 0; }

    /* Nutrition (legacy table) */
    .nutrition-panel {
      max-width: 340px;
      border: 2px solid var(--rm-text, #e5e5ea);
      border-radius: 4px;
      padding: 8px 12px;
      margin: 0 auto;
    }
    .nutr-header {
      font-size: 28px;
      font-weight: 900;
      color: var(--rm-text, #e5e5ea);
      line-height: 1;
      margin-bottom: 2px;
    }
    .nutr-sub {
      font-size: 11px;
      color: var(--rm-text-secondary, #8e8e93);
      margin-bottom: 6px;
    }
    .nutr-divider { border-top: 1px solid var(--rm-border, rgba(255,255,255,0.15)); margin: 2px 0; }
    .nutr-divider.thick { border-top: 6px solid var(--rm-text, #e5e5ea); margin: 4px 0; }
    .nutr-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 2px 0;
      font-size: 13px;
      color: var(--rm-text, #e5e5ea);
    }
    .nutr-bold { font-weight: 700; font-size: 15px; }
    .nutr-indent { padding-left: 14px; font-size: 12px; }
    .nutr-val { font-weight: 600; white-space: nowrap; }
    .nutr-val em { font-style: normal; font-size: 11px; color: var(--rm-text-secondary, #8e8e93); }

    /* Nutrition card */
    .nutr-card { display: flex; flex-direction: column; gap: 10px; }
    .nutr-top { display: flex; align-items: center; gap: 14px; }
    .nutr-ring-wrap { flex-shrink: 0; width: 90px; height: 90px; }
    .nutr-macro-cols { display: flex; gap: 10px; flex: 1; justify-content: space-around; }
    .nutr-macro-col { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .nutr-mcol-num { font-size: 17px; font-weight: 700; line-height: 1; }
    .nutr-mcol-label { font-size: 11px; color: var(--rm-text-secondary); font-weight: 500; }
    .nutr-mcol-pct { font-size: 10px; font-weight: 600; }
    .nutr-serving-note {
      font-size: 11px; color: var(--rm-text-muted); text-align: center; margin-top: -4px;
    }
    /* Daily RDA expandable */
    .nutr-rda-toggle {
      display: flex; align-items: center; gap: 6px;
      background: none; border: none; border-top: 1px solid var(--rm-border);
      padding: 10px 0 0; cursor: pointer; color: var(--rm-text); font-size: 13px; font-weight: 600;
      width: 100%; text-align: left;
    }
    .nutr-rda-title { flex: 1; }
    .nutr-rda-count {
      font-size: 12px; font-weight: 700; color: var(--rm-text-secondary);
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 10px; padding: 1px 7px;
    }
    .nutr-rda-toggle ha-icon { --mdc-icon-size: 18px; color: var(--rm-text-secondary); }
    .nutr-rda-rows { display: flex; flex-direction: column; gap: 6px; padding-top: 6px; }
    .nutr-rda-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      grid-template-rows: auto 4px;
      column-gap: 8px;
      row-gap: 4px;
      font-size: 12px;
    }
    .nutr-rda-label { color: var(--rm-text-secondary); grid-column: 1; grid-row: 1; }
    .nutr-rda-val { color: var(--rm-text); font-weight: 600; grid-column: 2; grid-row: 1; white-space: nowrap; }
    .nutr-rda-pct { color: var(--rm-text-muted); grid-column: 3; grid-row: 1; white-space: nowrap; min-width: 36px; text-align: right; }
    .nutr-rda-bar-wrap { grid-column: 1 / -1; grid-row: 2; background: var(--rm-border); border-radius: 2px; height: 4px; overflow: hidden; }
    .nutr-rda-bar { height: 100%; background: var(--rm-accent); border-radius: 2px; transition: width 0.3s; }
    .nutr-rda-bar.over { background: var(--error-color, #cf6679); }

    /* Photos tab */
    .photos-tab { display: flex; flex-direction: column; gap: 16px; }
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
    }
    .photo-item {
      position: relative;
      aspect-ratio: 4/3;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;
    }
    .photo-item.main-photo { border-color: var(--rm-accent, #ff6b35); }
    .photo-item img { width: 100%; height: 100%; object-fit: cover; }
    .photo-badge {
      position: absolute;
      bottom: 4px;
      left: 4px;
      background: var(--rm-accent, #ff6b35);
      color: var(--rm-ink, #fff);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .photo-action {
      position: absolute;
      background: rgba(0,0,0,0.6);
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      padding: 0;
      transition: background 0.15s;
    }
    .photo-action ha-icon { --mdc-icon-size: 14px; }
    .photo-action:hover { background: rgba(0,0,0,0.85); }
    .remove-photo { top: 4px; right: 4px; }
    .set-main { bottom: 4px; left: 4px; }

    .photo-add-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-top: 8px;
      border-top: 1px solid var(--rm-border, rgba(255,255,255,0.08));
    }
    .photo-add-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--rm-text-secondary, #8e8e93);
    }
    .photo-url-row { display: flex; gap: 8px; }
    .photo-url-input {
      flex: 1;
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 10px;
      font-size: 13px;
    }
    .photo-url-input:focus { outline: none; border-color: var(--rm-accent, #ff6b35); }
    .camera-btns {
      display: flex;
      gap: 10px;
    }
    .camera-btn-split {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 2px solid var(--rm-accent, #ff6b35);
      border-radius: 10px;
      color: var(--rm-text, #e5e5ea);
      padding: 16px 8px;
      cursor: pointer;
      font-size: 12px;
      text-align: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .camera-btn-split:hover { background: var(--rm-accent-soft, rgba(255,107,53,0.12)); }
    .camera-btn-split ha-icon { --mdc-icon-size: 28px; color: var(--rm-accent, #ff6b35); }
    .camera-input { display: none; }

    /* Buttons */
    .action-btn {
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 14px;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .action-btn.primary {
      background: var(--rm-accent, #ff6b35);
      border-color: var(--rm-accent, #ff6b35);
      color: var(--rm-ink, #fff);
    }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93);
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }

    /* Edit overlay */
    .edit-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: flex-end;
      z-index: 10;
    }
    .edit-panel {
      background: var(--rm-bg-surface, #1c1c1e);
      border-radius: var(--rm-radius, 12px) var(--rm-radius, 12px) 0 0;
      width: 100%;
      max-height: 82vh;
      display: flex;
      flex-direction: column;
    }
    .edit-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      font-weight: 600;
      font-size: 16px;
      color: var(--rm-text, #e5e5ea);
      flex-shrink: 0;
    }
    .edit-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .edit-section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--rm-text-muted, #8e8e93);
      margin-top: 4px;
      padding-top: 8px;
      border-top: 1px solid var(--rm-border, rgba(255,255,255,0.08));
    }
    .edit-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .edit-field { display: flex; flex-direction: column; gap: 4px; }
    .edit-field label { font-size: 11px; color: var(--rm-text-secondary, #8e8e93); text-transform: uppercase; letter-spacing: 0.05em; }
    .edit-field input, .edit-field textarea {
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 10px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
    }
    .edit-field input:focus, .edit-field textarea:focus {
      outline: none;
      border-color: var(--rm-accent, #ff6b35);
    }
    .edit-photo-row {
      display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start;
    }
    .edit-photo-thumb {
      position: relative; width: 144px; height: 144px;
      border-radius: 8px; overflow: hidden; cursor: pointer; flex-shrink: 0;
      border: 2px solid transparent; transition: border-color 0.15s;
    }
    .edit-photo-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .edit-photo-thumb.selected { border-color: var(--rm-accent, #ff6b35); }
    .edit-thumb-badge {
      position: absolute; bottom: 6px; right: 6px;
      background: var(--rm-accent, #ff6b35); border-radius: 50%;
      width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    }
    .edit-thumb-badge ha-icon { --mdc-icon-size: 16px; color: #fff; }
    .edit-photo-add {
      width: 144px; height: 144px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--rm-accent-soft, rgba(255,107,53,0.12));
      border: 2px dashed var(--rm-accent, #ff6b35);
      cursor: pointer; color: var(--rm-accent, #ff6b35);
      transition: background 0.15s;
    }
    .edit-photo-add:hover { background: rgba(255,107,53,0.22); }
    .edit-photo-add.loading { opacity: 0.6; cursor: not-allowed; }
    .edit-photo-add ha-icon { --mdc-icon-size: 40px; }
    .edit-stars {
      display: flex;
      gap: 4px;
      padding: 4px 0;
    }
    .edit-star {
      font-size: 32px;
      color: var(--rm-border, rgba(255,255,255,0.3));
      cursor: pointer;
      transition: color 0.12s;
      line-height: 1;
      -webkit-text-stroke: 1px rgba(200,150,50,0.5);
    }
    .edit-star.filled { color: #f5a623; -webkit-text-stroke: 1px #d4881b; }
    .edit-star:hover { color: #f5a623; }
    .edit-footer {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      flex-shrink: 0;
    }
    .edit-footer-right { display: flex; gap: 8px; }

    /* Edit ingredient/step lists */
    .edit-ing-list, .edit-steps-list {
      list-style: none; padding: 0; margin: 0 0 6px;
    }
    .edit-ing-list li, .edit-steps-list li {
      display: flex; align-items: flex-start; gap: 8px;
      padding: 5px 0; border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.06));
      font-size: 13px; color: var(--rm-text, #e5e5ea);
    }
    .edit-ing-heading { font-weight: 700; color: var(--rm-accent) !important; }
    .edit-ing-text { flex: 1; line-height: 1.4; }
    .drag-handle {
      flex-shrink: 0; cursor: grab; color: var(--rm-text-muted, #636366);
      --mdc-icon-size: 18px; touch-action: none;
    }
    .drag-handle:active { cursor: grabbing; }
    .edit-ing-list li.drag-over,
    .edit-steps-list li.drag-over {
      border-top: 2px solid var(--rm-accent); margin-top: -1px;
    }
    .edit-reorder-btns { display: flex; flex-direction: column; flex-shrink: 0; gap: 0; }
    .edit-move-btn {
      background: none; border: none; cursor: pointer; padding: 0; line-height: 1;
      color: var(--rm-text-secondary, #8e8e93); --mdc-icon-size: 14px;
    }
    .edit-move-btn:disabled { opacity: 0.2; cursor: default; }
    .edit-remove-btn {
      background: none; border: none; cursor: pointer; flex-shrink: 0;
      color: var(--rm-text-secondary, #8e8e93); padding: 2px; margin-top: 1px;
    }
    .edit-remove-btn ha-icon { --mdc-icon-size: 14px; }
    .edit-add-row {
      display: flex; gap: 8px; align-items: flex-end; margin-bottom: 4px;
    }
    .edit-add-row input, .edit-add-row textarea {
      flex: 1; background: var(--rm-bg-elevated, #232833);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px; color: var(--rm-text, #e5e5ea);
      padding: 7px 10px; font-size: 13px; font-family: inherit; resize: none;
    }
    .edit-add-row input:focus, .edit-add-row textarea:focus {
      outline: none; border-color: var(--rm-accent, #9fa8da);
    }
    .edit-add-btn {
      background: var(--rm-accent, #9fa8da); border: none; border-radius: 8px;
      color: var(--rm-ink, #fff); padding: 7px 12px; cursor: pointer; font-size: 13px;
      white-space: nowrap; flex-shrink: 0;
    }

    /* Danger outline button */
    .action-btn.danger-outline {
      color: var(--error-color, #cf6679);
      border-color: var(--error-color, #cf6679);
    }
    .action-btn.danger-outline:hover {
      background: var(--error-color, #cf6679); color: #fff;
    }

    /* ── Wide grid layout (2 cols × auto rows) ─────────────── */
    /* Whole card scrolls — no independent column scrolling */
    .detail-container.wide {
      overflow-x: hidden;
      overflow-y: auto;
    }

    .wide-layout {
      --ion-grid-columns: 12;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      width: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    /* Each row is a flex container — no gap (columns are exact % fractions summing to 100%).
       align-items:stretch makes both columns the same height.
       Column spacing uses margin-left + reduced width on col-2 items. */
    .wide-row {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      width: 100%;
      box-sizing: border-box;
    }

    /* Col 1 — image card: exact Ionic 4/12 column; aspect-ratio:1/1 makes height = width */
    .wide-image-card {
      flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      min-width: 0;
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
    }
    .wide-image-square {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .wide-image-square img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .wide-image-square .hero-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      color: var(--rm-text-secondary);
    }
    .wide-image-square .hero-placeholder ha-icon { --mdc-icon-size: 64px; opacity: 0.3; }
    .slide-btn {
      position: absolute; top: 50%; transform: translateY(-50%);
      background: rgba(0,0,0,0.45); border: none; color: #fff; cursor: pointer;
      border-radius: 50%; width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center; padding: 0;
      z-index: 2; transition: background 0.15s;
    }
    .slide-btn:hover { background: rgba(0,0,0,0.7); }
    .slide-btn ha-icon { --mdc-icon-size: 20px; }
    .slide-prev { left: 6px; }
    .slide-next { right: 6px; }
    .slide-dots {
      position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 5px; z-index: 2;
    }
    .slide-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(255,255,255,0.45); transition: background 0.15s;
    }
    .slide-dot.active { background: #fff; }

    /* Col 2 — info card: 8/12 minus the 14px gap, with margin-left for the gap */
    .wide-info-card {
      flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      min-width: 0;
      box-sizing: border-box;
      margin-left: 14px;
      border-radius: 16px;
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .wide-title {
      margin: 0 0 4px; font-size: 22px; font-weight: 700;
      color: var(--rm-text); line-height: 1.2; text-align: center;
    }
    .wide-desc {
      text-align: center; margin: 6px 0;
      font-size: 13px; color: var(--rm-text-secondary); line-height: 1.5;
    }
    .wide-info-card .quick-rating { justify-content: center; margin-bottom: 6px; }
    .wide-info-card .action-btns-row { justify-content: center; flex-wrap: wrap; width: 100%; }
    .wide-info-card .meta-chips { justify-content: center; margin-top: 6px; }
    /* Chips pushed to bottom-left of info card */
    .wide-info-card .chips-area { align-self: flex-start; margin-top: auto; padding-top: 10px; }

    /* Row 2, Col 1 — ingredients column: exact Ionic 4/12, aligns with image above */
    .wide-ing-col {
      flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Row 2, Col 2 — directions column: 8/12 minus gap, margin-left for spacing */
    .wide-dir-col {
      flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100% - 14px);
      min-width: 0;
      margin-left: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Ingredients column controls: scaler left, cart right — above ingredients only */
    .wide-ing-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 2px;
      min-height: 42px;
    }
    .wide-dir-spacer { min-height: 42px; }
    .ing-shop-btn {
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 50%; width: 34px; height: 34px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--rm-text-secondary); padding: 0; transition: all 0.15s;
    }
    .ing-shop-btn ha-icon { --mdc-icon-size: 18px; }
    .ing-shop-btn:hover { background: var(--rm-accent-soft); color: var(--rm-accent); border-color: var(--rm-accent); }
    .ing-shop-btn.active { background: var(--rm-accent-soft); color: var(--rm-accent); border-color: var(--rm-accent); }
    .ing-shop-success { color: var(--success-color, #4caf50); display: flex; align-items: center; }
    .ing-shop-success ha-icon { --mdc-icon-size: 22px; }
    .shopping-review-panel {
      display: flex; flex-direction: column; gap: 10px;
      background: var(--rm-bg-elevated, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 10px; padding: 12px;
    }
    .review-title {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.05em; color: var(--rm-text-secondary, #8e8e93);
    }
    .review-list {
      display: flex; flex-direction: column; gap: 10px;
      max-height: 300px; overflow-y: auto;
    }
    .review-row { display: flex; flex-direction: column; gap: 4px; }
    .review-ing { display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap; }
    .review-qty { font-size: 0.8rem; color: var(--rm-text-secondary, #8e8e93); flex-shrink: 0; }
    .review-ing-name { font-size: 0.9rem; font-weight: 500; }
    .review-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .review-chip {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 4px 10px; border-radius: 999px;
      border: 1.5px solid var(--rm-border, rgba(255,255,255,0.12));
      background: none; cursor: pointer;
      font-size: 12px; color: var(--rm-text, #e5e5ea);
      font-family: inherit; transition: all 0.15s; white-space: nowrap;
    }
    .review-chip ha-icon { --mdc-icon-size: 13px; }
    .review-chip.selected {
      border-color: var(--rm-accent, #ff6b35);
      background: var(--rm-accent-soft, rgba(255,107,53,0.12));
      color: var(--rm-accent, #ff6b35); font-weight: 600;
    }
    .review-chip.manual { border-style: dashed; }
    .review-btns { margin-top: 2px; }

    /* Section cards (ingredients, nutrition, notes) */
    .wide-section-card {
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 14px;
      padding: 12px 14px;
    }
    .wide-section-title {
      font-size: 14px; font-weight: 700; color: var(--rm-text);
      margin-bottom: 10px; padding-bottom: 6px;
      border-bottom: 1px solid var(--rm-border);
    }

    /* Per-step direction cards in wide layout */
    .wide-step-card {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .wide-step-card .step-num { flex-shrink: 0; }
    .wide-step-card .step-text { flex: 1; }
    .wide-step-card.step-done .step-text {
      opacity: 0.45;
      text-decoration: line-through;
      text-decoration-color: var(--rm-border);
    }

    /* ── Markdown content ─────────────────────────────── */
    .md-content { font-size: 14px; line-height: 1.65; }
    .md-content p { margin: 0 0 6px; }
    .md-content p.md-gap { margin: 0 0 10px; }
    .md-content h1 { font-size: 18px; font-weight: 700; margin: 10px 0 4px; }
    .md-content h2 { font-size: 16px; font-weight: 700; margin: 8px 0 4px; }
    .md-content h3 { font-size: 14px; font-weight: 700; margin: 6px 0 3px; }
    .md-content ul, .md-content ol { padding-left: 20px; margin: 4px 0 8px; }
    .md-content li { margin: 2px 0; }
    .md-content strong { font-weight: 700; }
    .md-content em { font-style: italic; }
    .md-content code { font-family: monospace; font-size: 12px; background: var(--rm-bg-elevated); padding: 1px 4px; border-radius: 3px; }
    .md-content a { color: var(--rm-accent); text-decoration: none; }
    .md-content a:hover { text-decoration: underline; }
    .md-content hr { border: none; border-top: 1px solid var(--rm-border); margin: 8px 0; }

    /* ── List picker (tags / courses / categories / collections) ─── */
    .list-picker-field { position: relative; }
    .list-picker-wrap { display: flex; flex-direction: column; gap: 6px; }
    .list-picker-chips { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; min-height: 28px; }
    .list-chip {
      display: inline-flex; align-items: center; gap: 3px;
      padding: 3px 8px; border-radius: 14px; font-size: 12px;
      border: 1px solid var(--rm-border); background: var(--rm-bg-elevated);
      color: var(--rm-text); cursor: default; transition: all 0.12s;
    }
    .list-chip.selected { background: var(--rm-accent-soft); border-color: var(--rm-accent); color: var(--rm-accent); }
    .list-chip.available { cursor: pointer; color: var(--rm-text-muted); }
    .list-chip.available:hover { border-color: var(--rm-accent); color: var(--rm-accent); background: var(--rm-accent-soft); }
    .list-chip-remove {
      background: none; border: none; padding: 0 0 0 2px; cursor: pointer;
      color: inherit; font-size: 14px; line-height: 1; opacity: 0.7;
    }
    .list-chip-remove:hover { opacity: 1; }
    .list-chip-add-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; border-radius: 50%; border: 1px dashed var(--rm-border);
      background: none; cursor: pointer; color: var(--rm-text-muted); transition: all 0.12s;
    }
    .list-chip-add-btn:hover { border-color: var(--rm-accent); color: var(--rm-accent); }
    .list-chip-add-btn ha-icon { --mdc-icon-size: 14px; }
    .list-picker-dropdown {
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    }
    .list-picker-existing { display: flex; flex-wrap: wrap; gap: 5px; }
    .list-picker-new-row { display: flex; gap: 6px; }
    .list-picker-input {
      flex: 1; background: var(--rm-bg-surface, var(--rm-bg)); border: 1px solid var(--rm-border);
      border-radius: 7px; color: var(--rm-text); padding: 5px 9px; font-size: 13px;
      font-family: inherit; min-width: 0;
    }
    .list-picker-input:focus { outline: none; border-color: var(--rm-accent); }
    .list-picker-new-btn {
      padding: 5px 12px; border-radius: 7px; border: 1px solid var(--rm-accent);
      background: var(--rm-accent); color: var(--rm-ink, #fff); cursor: pointer; font-size: 13px; font-family: inherit;
    }
    .list-picker-new-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    /* ── Inline ingredient edit ──────────────────────── */
    .edit-ing-text { cursor: pointer; flex: 1; }
    .edit-ing-text:hover { color: var(--rm-accent); }
    .edit-ing-inline-edit {
      display: flex; align-items: center; gap: 4px; padding: 4px 0; list-style: none;
    }
    .ing-inline-input {
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-accent);
      border-radius: 6px; color: var(--rm-text); padding: 4px 6px; font-size: 13px;
      font-family: inherit; min-width: 0;
    }
    .ing-inline-input:focus { outline: none; }
    .ing-inline-amt { width: 52px; flex: 0 0 52px; }
    .ing-inline-unit { width: 60px; flex: 0 0 60px; }
    .ing-inline-name { flex: 1; }
    .ing-inline-save, .ing-inline-cancel {
      width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--rm-border);
      background: none; cursor: pointer; color: var(--rm-text-muted);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ing-inline-save { border-color: var(--rm-accent); color: var(--rm-accent); }
    .ing-inline-save:hover { background: var(--rm-accent); color: var(--rm-ink, #fff); }
    .ing-inline-save ha-icon, .ing-inline-cancel ha-icon { --mdc-icon-size: 13px; }


    /* ═══ Fresh + Compact ═══ */
    :host([ui-style="fresh"]) .hero,
    :host([ui-style="compact"]) .hero { margin: 12px 20px 0; border-radius: var(--rm-radius-card); background: linear-gradient(135deg, var(--rm-accent-soft), var(--rm-bg-elevated)); }
    :host([ui-style="fresh"]) .hero-btn,
    :host([ui-style="compact"]) .hero-btn { background: rgba(255,255,255,0.94); color: #12201B; width: 40px; height: 40px; }
    :host([ui-style="fresh"]) .hero-btn.fav-active,
    :host([ui-style="compact"]) .hero-btn.fav-active { color: #A32B2B; }
    :host([ui-style="fresh"]) .detail-scroll,
    :host([ui-style="compact"]) .detail-scroll { padding: 16px 20px 32px; }
    :host([ui-style="fresh"]) .recipe-title,
    :host([ui-style="compact"]) .recipe-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
    :host([ui-style="fresh"]) .recipe-title.wide-centered,
    :host([ui-style="compact"]) .recipe-title.wide-centered { font-size: 28px; }
    :host([ui-style="fresh"]) .wide-title,
    :host([ui-style="compact"]) .wide-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
    :host([ui-style="fresh"]) .meta-chip-icon,
    :host([ui-style="compact"]) .meta-chip-icon { border-radius: 999px; background: var(--rm-bg-surface); padding: 8px 14px; font-weight: 600; }
    :host([ui-style="compact"]) .meta-chip-icon { border-color: transparent; border-radius: 12px; }
    :host([ui-style="fresh"]) .chip,
    :host([ui-style="compact"]) .chip { border-radius: 999px; padding: 6px 12px; font-weight: 600; }
    :host([ui-style="fresh"]) .scaler-btn,
    :host([ui-style="compact"]) .scaler-btn { width: 40px; height: 40px; background: var(--rm-bg-surface); color: var(--rm-text); }
    :host([ui-style="fresh"]) .scaler-val,
    :host([ui-style="compact"]) .scaler-val { font-weight: 800; }
    :host([ui-style="fresh"]) .action-icon-btn .btn-icon,
    :host([ui-style="compact"]) .action-icon-btn .btn-icon { background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([ui-style="compact"]) .action-icon-btn .btn-icon { border-radius: 14px; }
    :host([ui-style="fresh"]) .action-icon-btn.fav-active .btn-icon,
    :host([ui-style="compact"]) .action-icon-btn.fav-active .btn-icon { color: var(--rm-danger); }
    :host([ui-style="fresh"]) .quick-rating .qr-star.filled,
    :host([ui-style="compact"]) .quick-rating .qr-star.filled { color: var(--rm-warn); }

    /* Tabs become pill chips */
    :host([ui-style="fresh"]) .tabs-row,
    :host([ui-style="compact"]) .tabs-row { border-bottom: none; gap: 8px; margin-bottom: 12px; padding: 2px 0; }
    :host([ui-style="fresh"]) .tab-btn,
    :host([ui-style="compact"]) .tab-btn {
      min-height: 40px; padding: 0 16px; border: 1px solid var(--rm-border); border-radius: 999px;
      background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .tab-btn { border-radius: 12px; border-color: transparent; }
    :host([ui-style="fresh"]) .tab-btn.active,
    :host([ui-style="compact"]) .tab-btn.active { background: var(--rm-text); border-color: var(--rm-text); color: var(--rm-bg-main); font-weight: 700; }

    /* Ingredients and steps sit in one rounded card */
    :host([ui-style="fresh"]) .ingredient-list,
    :host([ui-style="compact"]) .ingredient-list,
    :host([ui-style="fresh"]) .steps-list,
    :host([ui-style="compact"]) .steps-list {
      background: var(--rm-bg-surface); border: 1px solid var(--rm-border);
      border-radius: var(--rm-radius-card); padding: 2px 16px;
    }
    :host([ui-style="compact"]) .ingredient-list,
    :host([ui-style="compact"]) .steps-list { border-color: transparent; }
    :host([ui-style="fresh"]) .steps-list,
    :host([ui-style="compact"]) .steps-list { padding: 16px; }
    :host([ui-style="fresh"]) .ingredient-item,
    :host([ui-style="compact"]) .ingredient-item { padding: 13px 0; border-bottom-color: var(--rm-line); }
    :host([ui-style="fresh"]) .ingredient-item:last-child,
    :host([ui-style="compact"]) .ingredient-item:last-child { border-bottom: none; }
    :host([ui-style="fresh"]) .ing-amount,
    :host([ui-style="compact"]) .ing-amount { font-weight: 800; color: var(--rm-accent-text); min-width: 76px; }
    :host([ui-style="fresh"]) .ing-name,
    :host([ui-style="compact"]) .ing-name { font-weight: 600; }
    :host([ui-style="fresh"]) .step-text,
    :host([ui-style="compact"]) .step-text { line-height: 1.5; }
    :host([ui-style="fresh"]) .time-chip,
    :host([ui-style="compact"]) .time-chip { border-radius: 999px; min-height: 32px; }
    :host([ui-style="fresh"]) .time-chip:hover,
    :host([ui-style="compact"]) .time-chip:hover { color: var(--rm-ink); }

    /* Wide layout cards */
    :host([ui-style="fresh"]) .wide-image-card,
    :host([ui-style="fresh"]) .wide-info-card,
    :host([ui-style="fresh"]) .wide-section-card,
    :host([ui-style="compact"]) .wide-image-card,
    :host([ui-style="compact"]) .wide-info-card,
    :host([ui-style="compact"]) .wide-section-card {
      background: var(--rm-bg-surface); border-radius: var(--rm-radius-card);
    }
    :host([ui-style="compact"]) .wide-image-card,
    :host([ui-style="compact"]) .wide-info-card,
    :host([ui-style="compact"]) .wide-section-card { border-color: transparent; }
    :host([ui-style="fresh"]) .wide-layout,
    :host([ui-style="compact"]) .wide-layout { padding: 16px 28px 32px; gap: 16px; }
    :host([ui-style="fresh"]) .wide-section-title,
    :host([ui-style="compact"]) .wide-section-title { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rm-text-secondary); border-bottom-color: var(--rm-line); }

    /* Buttons */
    :host([ui-style="fresh"]) .action-btn,
    :host([ui-style="fresh"]) .shopping-btn,
    :host([ui-style="fresh"]) .picker-sel-btn { min-height: 44px; border-radius: 999px; padding: 0 18px; }
    :host([ui-style="compact"]) .action-btn,
    :host([ui-style="compact"]) .shopping-btn,
    :host([ui-style="compact"]) .picker-sel-btn { min-height: 44px; border-radius: 12px; padding: 0 16px; }
    :host([ui-style="fresh"]) .edit-panel,
    :host([ui-style="compact"]) .edit-panel { border-radius: 28px 28px 0 0; background: var(--rm-bg-main); }

    :host([ui-style="fresh"]) .meta-item,
    :host([ui-style="compact"]) .meta-item { background: var(--rm-bg-surface); border: 1px solid var(--rm-border); border-radius: 18px; padding: 10px 14px; }
    :host([ui-style="compact"]) .meta-item { border-color: transparent; border-radius: 14px; }
    :host([ui-style="fresh"]) .meta-val,
    :host([ui-style="compact"]) .meta-val { font-weight: 800; font-variant-numeric: tabular-nums; }
    :host([ui-style="fresh"]) .chip-label,
    :host([ui-style="compact"]) .chip-label { background: none; border: none; padding-left: 0; }
    :host([ui-style="fresh"]) .chip-course,
    :host([ui-style="compact"]) .chip-course { background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([ui-style="fresh"]) .chip-category,
    :host([ui-style="compact"]) .chip-category { background: color-mix(in srgb, var(--rm-warn) 16%, var(--rm-bg-surface)); color: var(--rm-warn); }
    :host([ui-style="fresh"]) .chip-collection,
    :host([ui-style="compact"]) .chip-collection { background: var(--rm-bg-elevated); color: var(--rm-text-secondary); }

    :host([ui-style="fresh"]) .wide-section-card .ingredient-list,
    :host([ui-style="compact"]) .wide-section-card .ingredient-list { background: none; border: none; border-radius: 0; padding: 0; }
  `}try{customElements.define("ksh-rm-recipe-detail",te)}catch{}class ie extends e{static properties={uiStyle:{type:String,attribute:"ui-style",reflect:!0},api:{type:Object},asPanel:{type:Boolean},inlineMode:{type:Boolean},_mode:{type:String},_url:{type:String},_scraping:{type:Boolean},_scrapeError:{type:String},_form:{type:Object},_saving:{type:Boolean},_ingredientInput:{type:String},_ratingHover:{type:Number},_importFile:{type:Object},_importing:{type:Boolean},_importResult:{type:Object},_importError:{type:String},_importDownloadImages:{type:Boolean}};constructor(){super(),m(this),this.api=null,this.asPanel=!1,this.inlineMode=!1,this._mode="url",this._url="",this._scraping=!1,this._scrapeError=null,this._saving=!1,this._ingredientInput="",this._ratingHover=0,this._form=this._emptyForm(),this._importFile=null,this._importing=!1,this._importResult=null,this._importError=null,this._importDownloadImages=!0}_emptyForm(){return{name:"",description:"",source_url:"",servings:"",prep_time:"",cook_time:"",image_url:"",tags:"",courses:"",categories:"",collections:"",rating:0,notes:"",ingredients:[],instructions:[],cal:"",fat:"",satf:"",chol:"",sod:"",carb:"",fib:"",sug:"",prot:""}}_close(){this.dispatchEvent(new CustomEvent("rm-close",{bubbles:!0,composed:!0}))}async _handleScrape(){if(this._url.trim()&&!this._scraping){this._scraping=!0,this._scrapeError=null;try{const e=await this.api.scrapeRecipe(this._url.trim());if(e?.recipe){const t=e.recipe,i=t.nutrition||{};this._form={name:t.name||"",description:t.description||"",source_url:t.source_url||this._url.trim(),servings:t.servings||"",prep_time:t.prep_time||"",cook_time:t.cook_time||"",image_url:t.image_url||"",tags:(t.tags||[]).join(", "),courses:(t.courses||[]).join(", "),categories:(t.categories||[]).join(", "),collections:(t.collections||[]).join(", "),rating:t.rating||0,notes:t.notes||"",ingredients:t.ingredients||[],instructions:t.instructions||[],cal:i.calories??"",fat:i.fat??"",satf:i.saturated_fat??"",chol:i.cholesterol??"",sod:i.sodium??"",carb:i.carbohydrates??"",fib:i.fiber??"",sug:i.sugar??"",prot:i.protein??""},this._mode="manual"}else this._scrapeError=e?.error||n("Could not extract recipe from this URL.")}catch(e){this._scrapeError=e.message||n("Scraping failed.")}finally{this._scraping=!1}}}_handleImportFileChange(e){this._importFile=e.target.files[0]||null,this._importResult=null,this._importError=null}async _handleImport(){if(this._importFile&&!this._importing){this._importing=!0,this._importResult=null,this._importError=null;try{let e;try{const{default:t}=await import("./jszip.min-BBYxBrss.js").then(function(e){return e.j});e=await t.loadAsync(this._importFile)}catch(e){throw new Error(n(c`Could not open ZIP file: ${e.message}`))}const t=Object.values(e.files).find(e=>!e.dir&&e.name.endsWith(".html"));if(!t)throw new Error(n("No HTML file found inside the ZIP — is this a valid Recipe Keeper export?"));const i=await t.async("text"),r=await this.api.importRecipeKeeper(i);let a=0,s=0;if(this._importDownloadImages&&r.recipe_images?.length){const t=new Set([".jpg",".jpeg",".png",".webp",".gif",".bmp"]);for(const{recipe_id:i,image_filename:o}of r.recipe_images){const r=e.files[o]??Object.values(e.files).find(e=>{const i=o.split("/").pop();return!e.dir&&e.name.split("/").pop()===i&&t.has(e.name.slice(e.name.lastIndexOf(".")).toLowerCase())});if(r)try{const e=await r.async("base64");await this.api.uploadRecipeImage(i,e),a++}catch(e){console.warn(`[Recipe Keeper Import] Could not save image for recipe ${i}:`,e),s++}}}this._importResult={...r,imagesSaved:a},r.imported>0&&this.dispatchEvent(new CustomEvent("rm-import-done",{bubbles:!0,composed:!0}))}catch(e){console.error("[Recipe Keeper Import] Failed:",e),this._importError=e.message||String(e)||n("Import failed.")}finally{this._importing=!1}}}async _handleSave(){if(this._form.name.trim()&&!this._saving){this._saving=!0;try{const e=this._form,t=e=>e?e.split(",").map(e=>e.trim()).filter(Boolean):[],i={cal:"calories",fat:"fat",satf:"saturated_fat",chol:"cholesterol",sod:"sodium",carb:"carbohydrates",fib:"fiber",sug:"sugar",prot:"protein"},r={};let a=!1;for(const[t,s]of Object.entries(i))""!==e[t]&&null!=e[t]&&(r[s]=e[t],a=!0);const s={name:e.name,description:e.description,source_url:e.source_url,image_url:e.image_url,servings:parseInt(e.servings)||null,prep_time:parseInt(e.prep_time)||null,cook_time:parseInt(e.cook_time)||null,tags:t(e.tags),courses:t(e.courses),categories:t(e.categories),collections:t(e.collections),rating:e.rating||null,notes:e.notes,ingredients:e.ingredients,instructions:e.instructions,nutrition:a?r:null};this.dispatchEvent(new CustomEvent("rm-add-recipe",{detail:{data:s},bubbles:!0,composed:!0})),this._form=this._emptyForm()}finally{this._saving=!1}}}_setField(e,t){this._form={...this._form,[e]:t}}_addIngredient(){const e=this._ingredientInput.trim();if(!e)return;let t;if(e.startsWith("#"))t={name:e,is_heading:!0};else{const i=e.split(/\s+/);let r="",a="",s="";i.length>=3&&!isNaN(parseFloat(i[0]))?(r=i[0],a=i[1],s=i.slice(2).join(" ")):2!==i.length||isNaN(parseFloat(i[0]))?s=e:(r=i[0],s=i[1]),t={amount:r,unit:a,name:s}}this._form={...this._form,ingredients:[...this._form.ingredients,t]},this._ingredientInput=""}_addIngredientsBulk(e){const t=e.split("\n").map(e=>e.trim()).filter(Boolean).map(e=>{if(e.startsWith("#"))return{name:e,is_heading:!0};const t=e.split(/\s+/);let i="",r="",a="";return t.length>=3&&!isNaN(parseFloat(t[0]))?(i=t[0],r=t[1],a=t.slice(2).join(" ")):2!==t.length||isNaN(parseFloat(t[0]))?a=e:(i=t[0],a=t[1]),{amount:i,unit:r,name:a}});t.length&&(this._form={...this._form,ingredients:[...this._form.ingredients,...t]})}_removeIngredient(e){this._form={...this._form,ingredients:this._form.ingredients.filter((t,i)=>i!==e)}}_addStep(e){e.trim()&&(this._form={...this._form,instructions:[...this._form.instructions,e.trim()]})}_removeStep(e){this._form={...this._form,instructions:this._form.instructions.filter((t,i)=>i!==e)}}_renderPanelContent(){return t`
      <div class="dialog-header">
        <div class="mode-toggle">
          <button class="mode-btn ${"url"===this._mode?"active":""}" @click=${()=>{this._mode="url"}}>
            <ha-icon icon="mdi:link-variant"></ha-icon> ${n("From URL")}
          </button>
          <button class="mode-btn ${"manual"===this._mode?"active":""}" @click=${()=>{this._mode="manual"}}>
            <ha-icon icon="mdi:pencil-outline"></ha-icon> ${n("Manual")}
          </button>
          <button class="mode-btn ${"import"===this._mode?"active":""}" @click=${()=>{this._mode="import"}}>
            <ha-icon icon="mdi:import"></ha-icon> ${n("Import")}
          </button>
        </div>
        ${this.inlineMode?"":t`<button class="icon-btn" @click=${this._close}><ha-icon icon="mdi:close"></ha-icon></button>`}
      </div>

      <div class="dialog-body">
        ${"url"===this._mode?this._renderUrlMode():""}
        ${"import"===this._mode?this._renderImportMode():""}
        ${"manual"===this._mode?this._renderManualMode():""}
      </div>

      ${"manual"===this._mode?t`
        <div class="dialog-footer">
          <button class="action-btn" @click=${this._close}>${n("Cancel")}</button>
          <button
            class="action-btn primary"
            ?disabled=${!this._form.name.trim()||this._saving}
            @click=${this._handleSave}
          >
            ${this._saving?t`<ha-circular-progress active size="tiny"></ha-circular-progress>`:t`<ha-icon icon="mdi:content-save-outline"></ha-icon>`}
            ${n("Save Recipe")}
          </button>
        </div>
      `:""}
    `}render(){return this.inlineMode?t`<div class="dialog-panel inline-panel">${this._renderPanelContent()}</div>`:t`
      <div class="dialog-overlay ${this.asPanel?"panel-mode":""}" @click=${e=>{e.target===e.currentTarget&&this._close()}}>
        <div class="dialog-panel">${this._renderPanelContent()}</div>
      </div>
    `}_renderImportMode(){return t`
      <div class="import-mode">
        <div class="import-info">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div>
            <strong>${n("Recipe Keeper import")}</strong><br/>
            ${n(t`Export your recipes from the Recipe Keeper app
            (<em>Menu → Export → Recipe Keeper File</em>), then select the
            exported <code>.zip</code> file below. Recipe photos will be saved
            locally if available.`)}
          </div>
        </div>

        <label class="file-label">
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
          ${this._importFile?this._importFile.name:n("Choose .zip file…")}
          <input
            type="file"
            accept=".zip,application/zip"
            class="file-input"
            @change=${this._handleImportFileChange}
          />
        </label>

        <label class="toggle-row">
          <input
            type="checkbox"
            ?checked=${this._importDownloadImages}
            @change=${e=>{this._importDownloadImages=e.target.checked}}
          />
          ${n("Save recipe photos locally")}
        </label>

        ${this._importResult?t`
          <div class="import-result ${this._importResult.failed>0?"partial":"success"}">
            <ha-icon icon="${this._importResult.failed>0?"mdi:alert-circle-outline":"mdi:check-circle-outline"}"></ha-icon>
            <div>
              <strong>${1===this._importResult.imported?n(c`${this._importResult.imported} recipe imported`):n(c`${this._importResult.imported} recipes imported`)}</strong>
              ${this._importResult.imagesSaved>0?t` ${1===this._importResult.imagesSaved?n(c`with ${this._importResult.imagesSaved} photo`):n(c`with ${this._importResult.imagesSaved} photos`)}`:""}
              ${this._importResult.failed>0?t`<br/><small>${n(c`${this._importResult.failed} failed — check HA logs for details`)}</small>`:""}
            </div>
          </div>
        `:this._importError?t`
          <div class="import-result error">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            <div><strong>${n("Import failed")}</strong><br/><small>${this._importError}</small></div>
          </div>
        `:""}

        <button
          class="action-btn primary import-btn"
          ?disabled=${!this._importFile||this._importing}
          @click=${this._handleImport}
        >
          ${this._importing?t`<ha-circular-progress active size="tiny"></ha-circular-progress> ${n("Importing…")}`:t`<ha-icon icon="mdi:import"></ha-icon> ${n("Import Recipes")}`}
        </button>
      </div>
    `}_renderUrlMode(){return t`
      <div class="url-mode">
        <div class="url-hint">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${n("Paste a recipe URL to automatically extract the recipe details.")}
        </div>
        <div class="url-row">
          <input
            type="url"
            class="url-input"
            placeholder="https://www.example.com/recipe/..."
            .value=${this._url}
            @input=${e=>{this._url=e.target.value}}
            @keydown=${e=>{"Enter"===e.key&&this._handleScrape()}}
          />
          <button
            class="action-btn primary"
            ?disabled=${!this._url.trim()||this._scraping}
            @click=${this._handleScrape}
          >
            ${this._scraping?t`<ha-circular-progress active size="tiny"></ha-circular-progress>`:t`<ha-icon icon="mdi:download-outline"></ha-icon>`}
            ${n("Fetch")}
          </button>
        </div>
        ${this._scrapeError?t`
          <div class="error-msg">
            <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
            ${this._scrapeError}
          </div>
          <button class="action-btn" @click=${()=>{this._mode="manual",this._form={...this._emptyForm(),source_url:this._url}}}>
            ${n("Enter manually instead")}
          </button>
        `:""}
      </div>
    `}_renderManualMode(){const e=this._form,i=this._ratingHover||e.rating||0;return t`
      <div class="manual-mode">

        <!-- Name -->
        <div class="field">
          <label>${n("Recipe Name *")}</label>
          <input type="text" .value=${e.name}
            @input=${e=>this._setField("name",e.target.value)}
            placeholder="${n("e.g. Spaghetti Bolognese")}" />
        </div>

        <!-- Description -->
        <div class="field">
          <label>${n("Description")}</label>
          <textarea rows="2" .value=${e.description}
            @input=${e=>this._setField("description",e.target.value)}
            placeholder="${n("Short description…")}"></textarea>
        </div>

        <!-- Source URL + Image URL -->
        <div class="field-row">
          <div class="field">
            <label>${n("Source URL")}</label>
            <input type="url" .value=${e.source_url}
              @input=${e=>this._setField("source_url",e.target.value)}
              placeholder="https://…" />
          </div>
          <div class="field">
            <label>${n("Image URL")}</label>
            <input type="url" .value=${e.image_url}
              @input=${e=>this._setField("image_url",e.target.value)}
              placeholder="https://…/image.jpg" />
          </div>
        </div>

        <!-- Times + servings -->
        <div class="field-row-3">
          <div class="field">
            <label>${n("Prep (min)")}</label>
            <input type="number" .value=${String(e.prep_time)}
              @input=${e=>this._setField("prep_time",e.target.value)} placeholder="15" min="0" />
          </div>
          <div class="field">
            <label>${n("Cook (min)")}</label>
            <input type="number" .value=${String(e.cook_time)}
              @input=${e=>this._setField("cook_time",e.target.value)} placeholder="30" min="0" />
          </div>
          <div class="field">
            <label>${n("Servings")}</label>
            <input type="number" .value=${String(e.servings)}
              @input=${e=>this._setField("servings",e.target.value)} placeholder="4" min="1" />
          </div>
        </div>

        <!-- Rating -->
        <div class="field">
          <label>${n("Rating")}</label>
          <div class="star-row"
            @mouseleave=${()=>{this._ratingHover=0}}>
            ${[1,2,3,4,5].map(r=>t`
              <span
                class="star ${r<=i?"filled":""}"
                @mouseenter=${()=>{this._ratingHover=r}}
                @click=${()=>this._setField("rating",e.rating===r?0:r)}
              >★</span>
            `)}
            ${e.rating?t`<button class="clear-rating" @click=${()=>this._setField("rating",0)}>${n("Clear")}</button>`:""}
          </div>
        </div>

        <!-- Categorisation row -->
        <div class="field">
          <label>${n("Tags (comma-separated)")}</label>
          <input type="text" .value=${e.tags}
            @input=${e=>this._setField("tags",e.target.value)}
            placeholder="${n("quick, weeknight, family")}" />
        </div>

        <div class="field">
          <label>${n("Courses (comma-separated)")}</label>
          <input type="text" .value=${e.courses}
            @input=${e=>this._setField("courses",e.target.value)}
            placeholder="${n("Dinner, Main Course")}" />
        </div>

        <div class="field-row">
          <div class="field">
            <label>${n("Categories (comma-separated)")}</label>
            <input type="text" .value=${e.categories}
              @input=${e=>this._setField("categories",e.target.value)}
              placeholder="${n("Italian, Gluten Free")}" />
          </div>
          <div class="field">
            <label>${n("Collections (comma-separated)")}</label>
            <input type="text" .value=${e.collections}
              @input=${e=>this._setField("collections",e.target.value)}
              placeholder="${n("30 Minutes, Summer")}" />
          </div>
        </div>

        <!-- Ingredients -->
        <div class="field">
          <label>${n(c`Ingredients (${e.ingredients.length})`)}</label>
          ${e.ingredients.length?t`
            <ul class="ing-list">
              ${e.ingredients.map((e,i)=>t`
                <li class="${e.is_heading||e.name?.startsWith("#")?"ing-heading":""}">
                  <span class="ing-text">
                    ${e.is_heading||e.name?.startsWith("#")?t`<strong>${e.name?.startsWith("#")?e.name.slice(1).trim():e.name}</strong>`:t`${e.amount?`${e.amount}${e.unit?" "+e.unit:""} `:""}${e.name}`}
                  </span>
                  <button class="remove-btn" @click=${()=>this._removeIngredient(i)}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </li>
              `)}
            </ul>
          `:""}
          <div class="add-row">
            <input
              type="text"
              .value=${this._ingredientInput}
              @input=${e=>{this._ingredientInput=e.target.value}}
              @keydown=${e=>{"Enter"===e.key&&this._addIngredient()}}
              placeholder='${n('e.g. "2 cups flour", "salt", or "# Section"')}'
            />
            <button class="action-btn sm" @click=${this._addIngredient}>${n("Add")}</button>
          </div>
          <div class="bulk-hint">
            ${n(t`Tip: Use <code>#Section Name</code> to add a section header. Or paste multiple lines at once:`)}
            <button class="action-btn sm bulk-btn" @click=${()=>{const e=prompt(n("Paste ingredients (one per line, use # for headers):"));e&&this._addIngredientsBulk(e)}}>
              <ha-icon icon="mdi:text-box-multiple-outline"></ha-icon> ${n("Bulk paste")}
            </button>
          </div>
        </div>

        <!-- Directions -->
        <div class="field">
          <label>${n(c`Directions (${e.instructions.length} steps)`)}</label>
          ${e.instructions.length?t`
            <ol class="steps-edit">
              ${e.instructions.map((e,i)=>t`
                <li>
                  <span class="step-text">${e}</span>
                  <button class="remove-btn" @click=${()=>this._removeStep(i)}>
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </li>
              `)}
            </ol>
          `:""}
          <div class="add-row">
            <textarea
              rows="2"
              @keydown=${e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),this._addStep(e.target.value),e.target.value="")}}
              placeholder="${n("Type a step, press Enter to add…")}"
            ></textarea>
            <button class="action-btn sm" @click=${e=>{const t=e.target.closest(".add-row").querySelector("textarea");this._addStep(t.value),t.value=""}}>${n("Add")}</button>
          </div>
        </div>

        <!-- Notes -->
        <div class="field">
          <label>${n("Notes")}</label>
          <textarea rows="2" .value=${e.notes}
            @input=${e=>this._setField("notes",e.target.value)}
            placeholder="${n("Variations, tips…")}"></textarea>
        </div>

        <!-- Nutrition -->
        <div class="section-divider">${n("Nutrition Facts (per serving — optional)")}</div>
        <div class="field-row-3">
          <div class="field">
            <label>${n("Calories (kcal)")}</label>
            <input type="number" .value=${String(e.cal)}
              @input=${e=>this._setField("cal",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Protein (g)")}</label>
            <input type="number" .value=${String(e.prot)}
              @input=${e=>this._setField("prot",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Fat (g)")}</label>
            <input type="number" .value=${String(e.fat)}
              @input=${e=>this._setField("fat",e.target.value)} placeholder="0" min="0" />
          </div>
        </div>
        <div class="field-row-3">
          <div class="field">
            <label>${n("Saturated Fat (g)")}</label>
            <input type="number" .value=${String(e.satf)}
              @input=${e=>this._setField("satf",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Carbohydrates (g)")}</label>
            <input type="number" .value=${String(e.carb)}
              @input=${e=>this._setField("carb",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Dietary Fiber (g)")}</label>
            <input type="number" .value=${String(e.fib)}
              @input=${e=>this._setField("fib",e.target.value)} placeholder="0" min="0" />
          </div>
        </div>
        <div class="field-row-3">
          <div class="field">
            <label>${n("Sugars (g)")}</label>
            <input type="number" .value=${String(e.sug)}
              @input=${e=>this._setField("sug",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Sodium (mg)")}</label>
            <input type="number" .value=${String(e.sod)}
              @input=${e=>this._setField("sod",e.target.value)} placeholder="0" min="0" />
          </div>
          <div class="field">
            <label>${n("Cholesterol (mg)")}</label>
            <input type="number" .value=${String(e.chol)}
              @input=${e=>this._setField("chol",e.target.value)} placeholder="0" min="0" />
          </div>
        </div>

      </div>
    `}static styles=i`
    :host { display: block; height: 100%; }

    .inline-panel {
      border-radius: 0 !important;
      max-width: 100% !important;
      max-height: 100% !important;
      height: 100%;
      border-left: none !important;
      box-shadow: none !important;
      border-top: 1px solid var(--rm-border, rgba(0,0,0,0.08));
    }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      z-index: 1000;
    }

    /* Right-side panel mode (wide/tablet layout) */
    .dialog-overlay.panel-mode {
      align-items: stretch;
      justify-content: flex-end;
      background: rgba(0,0,0,0.45);
    }

    .dialog-panel {
      background: var(--rm-bg-surface, #1c1c1e);
      border-radius: var(--rm-radius, 12px) var(--rm-radius, 12px) 0 0;
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .panel-mode .dialog-panel {
      border-radius: 0;
      max-width: 420px;
      max-height: 100%;
      height: 100%;
      border-left: 1px solid var(--rm-border, rgba(0,0,0,0.1));
      box-shadow: -4px 0 24px rgba(0,0,0,0.2);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      flex-shrink: 0;
    }

    .mode-toggle {
      display: flex;
      gap: 4px;
      background: var(--rm-surface, #2c2c2e);
      border-radius: 8px;
      padding: 3px;
    }
    .mode-btn {
      background: none;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      color: var(--rm-text-secondary, #8e8e93);
      display: flex;
      align-items: center;
      gap: 5px;
      transition: background 0.15s, color 0.15s;
    }
    .mode-btn ha-icon { --mdc-icon-size: 16px; }
    .mode-btn.active { background: var(--rm-accent, #ff6b35); color: var(--rm-ink, #fff); }

    .icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93);
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }

    .dialog-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border, rgba(255,255,255,0.08)) transparent;
    }

    /* URL mode */
    .url-mode { display: flex; flex-direction: column; gap: 14px; }
    .url-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--rm-text-secondary, #8e8e93);
      background: var(--rm-surface, #2c2c2e);
      border-radius: 8px;
      padding: 10px 12px;
    }
    .url-hint ha-icon { --mdc-icon-size: 18px; flex-shrink: 0; }
    .url-row { display: flex; gap: 8px; }
    .url-input {
      flex: 1;
      background: var(--rm-surface, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 10px 12px;
      font-size: 14px;
    }
    .url-input:focus { outline: none; border-color: var(--rm-accent, #ff6b35); }
    .error-msg {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--error-color, #cf6679);
      font-size: 13px;
    }
    .error-msg ha-icon { --mdc-icon-size: 16px; }

    /* Manual form */
    .manual-mode { display: flex; flex-direction: column; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--rm-text-secondary, #8e8e93);
    }
    .field input, .field textarea {
      background: var(--rm-surface, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 10px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
    }
    .field input:focus, .field textarea:focus { outline: none; border-color: var(--rm-accent, #ff6b35); }

    .field-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .field-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

    /* Star rating */
    .star-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 0;
    }
    .star {
      font-size: 28px;
      color: var(--rm-border, rgba(255,255,255,0.2));
      cursor: pointer;
      line-height: 1;
      transition: color 0.1s;
    }
    .star.filled { color: #f5a623; }
    .star:hover  { color: #f5a623; }
    .clear-rating {
      margin-left: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 11px;
      color: var(--rm-text-secondary, #8e8e93);
      text-decoration: underline;
      padding: 0;
    }

    /* Section divider */
    .section-divider {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--rm-text-secondary, #8e8e93);
      padding-top: 8px;
      border-top: 1px solid var(--rm-border, rgba(255,255,255,0.08));
    }

    /* Ingredient / step lists */
    .ing-list, .steps-edit { list-style: none; padding: 0; margin: 0 0 6px; }
    .ing-list li, .steps-edit li {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 5px 0;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.06));
      font-size: 13px;
      color: var(--rm-text, #e5e5ea);
    }
    .ing-list li.ing-heading { font-weight: 700; color: var(--rm-accent, #9fa8da); }
    .ing-text, .step-text { flex: 1; }
    .bulk-hint {
      font-size: 11px; color: var(--rm-text-secondary, #8e8e93);
      margin-top: 6px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    }
    .bulk-hint code {
      background: rgba(255,255,255,0.08); border-radius: 4px; padding: 1px 5px; font-size: 11px;
    }
    .bulk-btn { padding: 4px 8px !important; font-size: 11px !important; }
    .remove-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93); padding: 2px; flex-shrink: 0;
    }
    .remove-btn ha-icon { --mdc-icon-size: 14px; }

    .add-row { display: flex; gap: 8px; align-items: flex-end; }
    .add-row input, .add-row textarea {
      flex: 1;
      background: var(--rm-surface, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 8px 10px;
      font-size: 13px;
      font-family: inherit;
      resize: none;
    }
    .add-row input:focus, .add-row textarea:focus { outline: none; border-color: var(--rm-accent, #ff6b35); }

    /* Buttons */
    .action-btn {
      background: var(--rm-surface, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 8px;
      color: var(--rm-text, #e5e5ea);
      padding: 9px 14px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .action-btn ha-icon { --mdc-icon-size: 16px; }
    .action-btn.primary { background: var(--rm-accent, #ff6b35); border-color: var(--rm-accent, #ff6b35); color: var(--rm-ink, #fff); }
    .action-btn.sm { padding: 6px 10px; font-size: 13px; }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Import mode */
    .import-mode { display: flex; flex-direction: column; gap: 16px; }
    .import-info {
      display: flex;
      gap: 12px;
      background: var(--rm-surface, #2c2c2e);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 13px;
      color: var(--rm-text-secondary, #8e8e93);
      line-height: 1.5;
    }
    .import-info ha-icon { --mdc-icon-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .import-info strong { color: var(--rm-text, #e5e5ea); }
    .import-info code {
      background: rgba(255,255,255,0.08);
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 12px;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--rm-surface, #2c2c2e);
      border: 2px dashed var(--rm-border, rgba(255,255,255,0.15));
      border-radius: 10px;
      padding: 16px 14px;
      cursor: pointer;
      font-size: 14px;
      color: var(--rm-text, #e5e5ea);
      transition: border-color 0.15s;
    }
    .file-label:hover { border-color: var(--rm-accent, #ff6b35); }
    .file-label ha-icon { --mdc-icon-size: 22px; color: var(--rm-accent, #ff6b35); }
    .file-input { display: none; }

    .toggle-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--rm-text-secondary, #8e8e93);
      cursor: pointer;
    }
    .toggle-row input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; }

    .import-result {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 13px;
    }
    .import-result ha-icon { --mdc-icon-size: 20px; flex-shrink: 0; margin-top: 1px; }
    .import-result.success { background: rgba(76, 175, 80, 0.12); color: var(--success-color, #4caf50); }
    .import-result.partial { background: rgba(255, 152, 0, 0.12); color: #ff9800; }
    .import-result.error   { background: rgba(207, 102, 121, 0.12); color: var(--error-color, #cf6679); }
    .import-result strong { display: block; }
    .import-result small { opacity: 0.85; }

    .import-btn { width: 100%; justify-content: center; gap: 8px; }
    .import-btn ha-icon { --mdc-icon-size: 18px; }

    .dialog-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding: 12px 16px;
      border-top: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      flex-shrink: 0;
    }

    /* ═══ Fresh + Compact ═══ */
    :host([ui-style="fresh"]) .dialog-header,
    :host([ui-style="compact"]) .dialog-header { border-bottom: none; padding: 16px 16px 4px; background: transparent; }
    :host([ui-style="fresh"]) .mode-toggle,
    :host([ui-style="compact"]) .mode-toggle { gap: 8px; background: none; border: none; padding: 0; }
    :host([ui-style="fresh"]) .mode-btn,
    :host([ui-style="compact"]) .mode-btn {
      min-height: 40px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 600;
      border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .mode-btn { border-radius: 12px; border-color: transparent; }
    :host([ui-style="fresh"]) .mode-btn.active,
    :host([ui-style="compact"]) .mode-btn.active { background: var(--rm-text); border-color: var(--rm-text); color: var(--rm-bg-main); font-weight: 700; }
    :host([ui-style="fresh"]) .url-input,
    :host([ui-style="compact"]) .url-input,
    :host([ui-style="fresh"]) .field input,
    :host([ui-style="fresh"]) .field textarea,
    :host([ui-style="compact"]) .field input,
    :host([ui-style="compact"]) .field textarea,
    :host([ui-style="fresh"]) .add-row input,
    :host([ui-style="fresh"]) .add-row textarea,
    :host([ui-style="compact"]) .add-row input,
    :host([ui-style="compact"]) .add-row textarea { border-radius: 14px; min-height: 48px; background: var(--rm-bg-surface); }
    :host([ui-style="fresh"]) .action-btn,
    :host([ui-style="fresh"]) .import-btn { min-height: 48px; border-radius: 999px; padding: 0 20px; }
    :host([ui-style="compact"]) .action-btn,
    :host([ui-style="compact"]) .import-btn { min-height: 48px; border-radius: 12px; padding: 0 18px; }
    :host([ui-style="fresh"]) .file-label,
    :host([ui-style="compact"]) .file-label { border-radius: 999px; min-height: 44px; }
    :host([ui-style="fresh"]) .url-hint,
    :host([ui-style="compact"]) .url-hint { background: var(--rm-accent-soft); color: var(--rm-accent-text); border-radius: var(--rm-radius-sm); padding: 12px 14px; }
  `}try{customElements.define("ksh-rm-add-recipe-dialog",ie)}catch{}const re=["breakfast","lunch","dinner","snack"];class ae extends e{static properties={uiStyle:{type:String,attribute:"ui-style",reflect:!0},api:{type:Object},recipes:{type:Array},settings:{type:Object},fromRecipe:{type:Object},_weekStart:{type:String},_selectedDate:{type:String},_plan:{type:Array},_loading:{type:Boolean},_showPicker:{type:Boolean},_pickerTarget:{type:Object},_pickerSearch:{type:String},_pickerServings:{type:Number}};constructor(){super(),m(this),this.api=null,this.recipes=[],this.settings={},this.fromRecipe=null,this._plan=[],this._loading=!1,this._showPicker=!1,this._pickerTarget=null,this._pickerSearch="",this._pickerServings=2,this._weekStart=this._getMondayISO(new Date),this._selectedDate=this._todayISO()}updated(e){e.has("_showPicker")&&this.dispatchEvent(new CustomEvent("rm-overlay",{detail:{open:this._showPicker},bubbles:!0,composed:!0})),(e.has("api")||e.has("_weekStart"))&&this.api&&this._loadPlan()}_getMondayISO(e){const t=e.getDay(),i=0===t?-6:1-t,r=new Date(e);r.setDate(r.getDate()+i);return`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}-${String(r.getDate()).padStart(2,"0")}`}_addDays(e,t){const i=new Date(e+"T00:00:00Z");return i.setUTCDate(i.getUTCDate()+t),i.toISOString().split("T")[0]}_formatDisplayDate(e){return new Date(e+"T00:00:00Z").getUTCDate().toString()}_formatMonthYear(e){return new Date(e+"T00:00:00Z").toLocaleDateString(this.settings?.language||"en",{month:"long",year:"numeric",timeZone:"UTC"})}_formatDayName(e){return new Date(e+"T00:00:00Z").toLocaleDateString(this.settings?.language||"en",{weekday:"short",timeZone:"UTC"})}get _styled(){return"fresh"===this.uiStyle||"compact"===this.uiStyle}_todayISO(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}_setWeek(e){this._weekStart=e;const t=this._todayISO(),i=t>=e&&t<=this._addDays(e,6);this._selectedDate=i?t:e}_prevWeek(){this._setWeek(this._addDays(this._weekStart,-7))}_nextWeek(){this._setWeek(this._addDays(this._weekStart,7))}_formatLongDay(e){const t=new Date(e+"T00:00:00Z").toLocaleDateString(this.settings?.language||"en",{weekday:"long",day:"numeric",month:"short",timeZone:"UTC"});return e===this._todayISO()?n(c`Today · ${t}`):t}_mealIcon(e){return{breakfast:"mdi:weather-sunny",lunch:"mdi:silverware-fork-knife",dinner:"mdi:weather-night",snack:"mdi:coffee-outline"}[e]||"mdi:food"}_mealHue(e){return{breakfast:"--rm-h3",lunch:"--rm-h2",dinner:"--rm-h4",snack:"--rm-h6"}[e]||"--rm-accent"}_formatMinutes(e){if(!e)return"";if(e<60)return`${e} min`;const t=Math.floor(e/60),i=e%60;return i?`${t} h ${i} min`:`${t} h`}_isCurrentWeek(){return this._weekStart===this._getMondayISO(new Date)}async _loadPlan(){this._loading=!0;try{const e=await this.api.getMealPlan(this._weekStart);this._plan=e?.entries??[]}catch(e){this._plan=[]}finally{this._loading=!1}}_getEntriesForSlot(e,t){return this._plan.filter(i=>i.date===e&&i.meal_type===t)}_openPicker(e,t){this._pickerTarget={date:e,mealType:t},this._pickerSearch="",this._pickerServings=2,this._showPicker=!0}async _handlePickRecipe(e){this._pickerTarget&&(await this.api.addToMealPlan(e.id,this._pickerTarget.date,this._pickerTarget.mealType,this._pickerServings),this._showPicker=!1,await this._loadPlan())}async _handleRemoveEntry(e){await this.api.removeFromMealPlan(e),await this._loadPlan()}async _handleClearWeek(){await this.api.clearMealPlanWeek(this._weekStart),await this._loadPlan()}_openRecipeDetail(e){const t=this.recipes.find(t=>t.id===e.recipe_id);t&&this.dispatchEvent(new CustomEvent("rm-open-recipe",{detail:{recipe:t},bubbles:!0,composed:!0}))}_mealTypeLabel(e){switch(e){case"breakfast":return n("Breakfast");case"lunch":return n("Lunch");case"dinner":return n("Dinner");case"snack":return n("Snack");default:return e}}get _pickerFiltered(){const e=this._pickerSearch.trim().toLowerCase();return e?this.recipes.filter(t=>t.name?.toLowerCase().includes(e)||t.tags?.some(t=>t.toLowerCase().includes(e))):this.recipes}render(){const e=Array.from({length:7},(e,t)=>this._addDays(this._weekStart,t)),i=this._todayISO();return t`
      <div class="planner-container">
        ${this.fromRecipe?t`
          <div class="back-to-recipe">
            <button class="back-recipe-btn" @click=${()=>this.dispatchEvent(new CustomEvent("rm-back-to-recipe",{bubbles:!0,composed:!0}))}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              <span>${n(c`Back to ${this.fromRecipe.name}`)}</span>
            </button>
          </div>
        `:""}
        <!-- Week navigation -->
        <div class="week-nav">
          <button class="nav-btn" @click=${this._prevWeek}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <div class="week-label">
            <span class="week-month">${this._formatMonthYear(this._weekStart)}</span>
            ${this._isCurrentWeek()?t`<span class="today-badge">${n("This week")}</span>`:t`
              <button class="text-link" @click=${()=>{this._setWeek(this._getMondayISO(new Date))}}>${n("Today")}</button>
            `}
          </div>
          <button class="nav-btn" @click=${this._nextWeek}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </div>

        ${this._styled?this._renderDayView(e,i):""}

        <!-- Day headers -->
        <div class="day-headers" ?hidden=${this._styled}>
          ${e.map(e=>t`
            <div class="day-header ${e===i?"today":""}">
              <span class="day-name">${this._formatDayName(e)}</span>
              <span class="day-num">${this._formatDisplayDate(e)}</span>
            </div>
          `)}
        </div>

        <!-- Plan grid scroll (Classic week matrix) -->
        <div class="plan-scroll" ?hidden=${this._styled}>
          ${this._loading?t`
            <div class="plan-loading"><ha-circular-progress active></ha-circular-progress></div>
          `:t`
            ${re.map(r=>t`
              <div class="meal-row">
                <div class="meal-label">${this._mealTypeLabel(r)}</div>
                <div class="meal-cells">
                  ${e.map(e=>{const a=this._getEntriesForSlot(e,r);return t`
                      <div class="meal-cell ${e===i?"today":""}">
                        ${a.map(e=>{const i=this.recipes.find(t=>t.id===e.recipe_id);return t`
                            <div class="meal-entry" @click=${()=>this._openRecipeDetail(e)}>
                              ${i?.image_url?t`
                                <img src="${i.image_url}" alt="${i?.name||""}" class="entry-thumb" />
                              `:t`
                                <div class="entry-thumb entry-placeholder"><ha-icon icon="mdi:food"></ha-icon></div>
                              `}
                              <span class="entry-name">${i?.name??n("Unknown")}</span>
                              ${e.servings&&1!==e.servings?t`
                                <span class="entry-servings">×${e.servings}</span>
                              `:""}
                              <button
                                class="entry-remove"
                                @click=${t=>{t.stopPropagation(),this._handleRemoveEntry(e.id)}}
                              >
                                <ha-icon icon="mdi:close"></ha-icon>
                              </button>
                            </div>
                          `})}
                        <button class="add-slot-btn" @click=${()=>this._openPicker(e,r)}>
                          <ha-icon icon="mdi:plus"></ha-icon>
                        </button>
                      </div>
                    `})}
                </div>
              </div>
            `)}
          `}

          <!-- Clear week button -->
          ${this._plan.length?t`
            <div class="clear-row">
              <button class="text-danger-btn" @click=${this._handleClearWeek}>
                <ha-icon icon="mdi:calendar-remove-outline"></ha-icon>
                ${n("Clear this week")}
              </button>
            </div>
          `:""}
        </div>

        <!-- Recipe picker dialog -->
        ${this._showPicker?this._renderPicker():""}
      </div>
    `}_renderDayView(e,i){const r=Math.max(0,e.indexOf(this._selectedDate)),a=[e[r],e[r+1]].filter(Boolean);return t`
      <div class="day-chips" role="group" aria-label="${n("Day of the week")}">
        ${e.map(e=>{const r=this._plan.some(t=>t.date===e);return t`
            <button class="day-chip" aria-pressed="${e===this._selectedDate?"true":"false"}"
              aria-current="${e===i?"date":"false"}"
              @click=${()=>{this._selectedDate=e}}>
              <span class="dc-name">${this._formatDayName(e)}</span>
              <span class="dc-num">${this._formatDisplayDate(e)}</span>
              <span class="dc-dot ${r?"":"empty"}"></span>
            </button>
          `})}
      </div>
      ${this._loading?t`<div class="plan-loading"><ha-circular-progress active></ha-circular-progress></div>`:t`
        <div class="day-scroll">
          <div class="day-groups">
            ${a.map((e,i)=>t`
              <section class="day-group">
                <div class="day-title"><span class="dt-dot ${i?"alt":""}"></span>${this._formatLongDay(e)}</div>
                <div class="day-card">
                  ${re.map(t=>this._renderSlot(e,t))}
                </div>
              </section>
            `)}
          </div>
          ${this._plan.length?t`
            <div class="clear-row">
              <button class="text-danger-btn" @click=${this._handleClearWeek}>
                <ha-icon icon="mdi:calendar-remove-outline"></ha-icon>
                ${n("Clear this week")}
              </button>
            </div>
          `:""}
        </div>
      `}
    `}_renderSlot(e,i){const r=this._getEntriesForSlot(e,i),a=this._mealTypeLabel(i);return r.length?t`${r.map((s,o)=>{const l=this.recipes.find(e=>e.id===s.recipe_id),d=l&&(l.total_time||(l.prep_time||0)+(l.cook_time||0))||0,p=[d?this._formatMinutes(d):"",s.servings?n(c`serves ${s.servings}`):""].filter(Boolean).join(" · ");return t`
        <div class="slot">
          <button class="slot-open" @click=${()=>this._openRecipeDetail(s)}>
            <span class="slot-thumb ${l?.image_url?"":"no-img"}" style="--hue: var(${this._mealHue(i)})">
              ${l?.image_url?t`<img src="${l.image_url}" alt="" />`:t`<ha-icon icon="${this._mealIcon(i)}"></ha-icon>`}
            </span>
            <span class="slot-mid">
              <span class="slot-eyebrow">${0===o?a:""}</span>
              <span class="slot-name">${l?.name??n("Unknown")}</span>
              ${p?t`<span class="slot-sub">${p}</span>`:""}
            </span>
          </button>
          ${o===r.length-1?t`
            <button class="slot-btn" @click=${()=>this._openPicker(e,i)}
              title="${n(c`Add another ${a}`)}" aria-label="${n(c`Add another ${a}`)}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          `:""}
          <button class="slot-btn" @click=${()=>this._handleRemoveEntry(s.id)}
            title="${n("Remove")}" aria-label="${n(c`Remove ${l?.name??""}`)}">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      `})}`:t`
        <div class="slot">
          <span class="slot-tile" style="--hue: var(${this._mealHue(i)})"><ha-icon icon="${this._mealIcon(i)}"></ha-icon></span>
          <div class="slot-mid">
            <div class="slot-eyebrow">${a}</div>
            <div class="slot-name muted">${n("Nothing planned")}</div>
          </div>
          <button class="slot-btn add" @click=${()=>this._openPicker(e,i)}
            title="${n(c`Add ${a}`)}" aria-label="${n(c`Add ${a}`)}">
            <span><ha-icon icon="mdi:plus"></ha-icon></span>
          </button>
        </div>
      `}_renderPicker(){const e=this._pickerTarget;return t`
      <div class="picker-overlay" @click=${e=>{e.target===e.currentTarget&&(this._showPicker=!1)}}>
        <div class="picker-panel">
          <div class="picker-header">
            <span>${n(c`Add to ${this._mealTypeLabel(e.mealType)}`)}</span>
            <button class="icon-btn" @click=${()=>{this._showPicker=!1}}><ha-icon icon="mdi:close"></ha-icon></button>
          </div>
          <div class="picker-servings-row">
            <span class="picker-label">${n("Servings:")}</span>
            <div class="servings-ctrl">
              <button class="scaler-btn" @click=${()=>{this._pickerServings>1&&this._pickerServings--}}>
                <ha-icon icon="mdi:minus"></ha-icon>
              </button>
              <span class="servings-val">${this._pickerServings}</span>
              <button class="scaler-btn" @click=${()=>{this._pickerServings++}}>
                <ha-icon icon="mdi:plus"></ha-icon>
              </button>
            </div>
          </div>
          <div class="picker-search-wrap">
            <ha-icon icon="mdi:magnify" class="search-icon"></ha-icon>
            <input
              type="text"
              class="picker-search"
              placeholder="${n("Search recipes…")}"
              .value=${this._pickerSearch}
              @input=${e=>{this._pickerSearch=e.target.value}}
              @keydown=${e=>{"Escape"===e.key&&this._pickerSearch&&(e.stopPropagation(),this._pickerSearch="")}}
            />
            ${this._pickerSearch?t`
              <button class="picker-search-clear" title="${n("Clear search")}" aria-label="${n("Clear search")}"
                @click=${()=>{this._pickerSearch=""}}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            `:""}
          </div>
          <div class="picker-list">
            ${0===this._pickerFiltered.length?t`
              <div class="picker-empty">${n("No recipes found")}</div>
            `:this._pickerFiltered.map(e=>t`
              <div class="picker-item" @click=${()=>this._handlePickRecipe(e)}>
                ${e.image_url?t`
                  <img src="${e.image_url}" alt="${e.name}" class="picker-thumb" />
                `:t`
                  <div class="picker-thumb picker-placeholder"><ha-icon icon="mdi:food"></ha-icon></div>
                `}
                <div class="picker-info">
                  <span class="picker-name">${e.name}</span>
                  ${e.tags?.length?t`<span class="picker-tags">${e.tags.slice(0,2).join(", ")}</span>`:""}
                </div>
                ${e.is_favourite?t`<ha-icon icon="mdi:heart" class="picker-fav"></ha-icon>`:""}
              </div>
            `)}
          </div>
        </div>
      </div>
    `}static styles=i`
    :host { display: block; height: 100%; }

    .planner-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Back to recipe */
    .back-to-recipe {
      padding: 6px 14px 0;
      flex-shrink: 0;
    }
    .back-recipe-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      color: var(--rm-accent, #ff6b35); font-size: 13px; font-weight: 500;
      padding: 4px 6px; border-radius: 8px; transition: background 0.15s;
    }
    .back-recipe-btn:hover { background: var(--rm-accent-soft, rgba(255,107,53,0.12)); }
    .back-recipe-btn ha-icon { --mdc-icon-size: 18px; }

    /* Week nav */
    .week-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      flex-shrink: 0;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
    }
    .nav-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93);
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }
    .nav-btn:hover { background: var(--rm-border, rgba(255,255,255,0.08)); }
    .week-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--rm-text, #e5e5ea);
    }
    .today-badge {
      font-size: 11px;
      background: var(--rm-accent-soft, rgba(255,107,53,0.15));
      color: var(--rm-accent, #ff6b35);
      border-radius: 10px;
      padding: 2px 8px;
    }
    .text-link {
      background: none; border: none; cursor: pointer;
      color: var(--rm-accent, #ff6b35);
      font-size: 12px; padding: 0;
    }

    /* Day headers */
    .day-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      padding: 6px 8px 4px;
      flex-shrink: 0;
    }
    .day-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .day-name { font-size: 10px; text-transform: uppercase; color: var(--rm-text-secondary, #8e8e93); letter-spacing: 0.05em; }
    .day-num { font-size: 14px; font-weight: 600; color: var(--rm-text, #e5e5ea); }
    .day-header.today .day-num {
      background: var(--rm-accent, #ff6b35);
      color: var(--rm-ink, #fff);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    /* Plan scroll */
    .plan-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 4px 8px 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border, rgba(255,255,255,0.08)) transparent;
    }

    .plan-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 120px;
    }

    .meal-row { margin-bottom: 8px; }
    .meal-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--rm-text-secondary, #8e8e93);
      font-weight: 600;
      padding: 4px 2px 3px;
    }
    .meal-cells {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 3px;
    }
    .meal-cell {
      min-height: 48px;
      background: var(--rm-surface, #2c2c2e);
      border-radius: 6px;
      padding: 3px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      border: 1px solid transparent;
    }
    .meal-cell.today { border-color: var(--rm-accent, #ff6b35); }

    .meal-entry {
      display: flex;
      align-items: center;
      gap: 3px;
      background: var(--rm-bg-elevated, #1c1c1e);
      border-radius: 4px;
      padding: 2px 2px 2px 4px;
      cursor: pointer;
      font-size: 10px;
      color: var(--rm-text, #e5e5ea);
      position: relative;
      min-height: 22px;
      max-height: 22px;
      overflow: hidden;
    }
    .entry-thumb {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .entry-placeholder {
      background: var(--rm-border, rgba(255,255,255,0.08));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .entry-placeholder ha-icon { --mdc-icon-size: 10px; }
    .entry-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 10px;
    }
    .entry-servings { font-size: 9px; color: var(--rm-text-secondary, #8e8e93); flex-shrink: 0; }
    .entry-remove {
      background: rgba(0,0,0,0.35);
      border: none;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      min-width: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      padding: 0;
      opacity: 1;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .entry-remove:hover { background: rgba(207,102,121,0.8); }
    .entry-remove ha-icon { --mdc-icon-size: 10px; }

    .add-slot-btn {
      background: none;
      border: 1px dashed var(--rm-border, rgba(255,255,255,0.12));
      border-radius: 4px;
      cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93);
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.15s, color 0.15s;
      padding: 0;
      margin-top: auto;
    }
    .add-slot-btn ha-icon { --mdc-icon-size: 12px; }
    .add-slot-btn:hover { border-color: var(--rm-accent, #ff6b35); color: var(--rm-accent, #ff6b35); }

    .clear-row {
      display: flex;
      justify-content: center;
      padding: 8px;
    }
    .text-danger-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--error-color, #cf6679);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 10px;
      border-radius: 6px;
      opacity: 0.8;
    }
    .text-danger-btn:hover { opacity: 1; background: rgba(207, 102, 121, 0.1); }
    .text-danger-btn ha-icon { --mdc-icon-size: 16px; }

    /* Picker */
    .picker-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      z-index: 20;
    }
    .picker-panel {
      background: var(--rm-bg-surface, #1c1c1e);
      border-radius: var(--rm-radius, 12px) var(--rm-radius, 12px) 0 0;
      width: 100%;
      max-height: 80%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
    }
    .picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      font-weight: 600;
      font-size: 15px;
      color: var(--rm-text, #e5e5ea);
      text-transform: capitalize;
      flex-shrink: 0;
    }
    .icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary, #8e8e93);
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }

    .picker-servings-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.06));
      flex-shrink: 0;
    }
    .picker-label { font-size: 13px; color: var(--rm-text-secondary, #8e8e93); }
    .servings-ctrl { display: flex; align-items: center; gap: 8px; }
    .scaler-btn {
      background: var(--rm-surface, #2c2c2e);
      border: 1px solid var(--rm-border, rgba(255,255,255,0.08));
      border-radius: 50%;
      width: 26px; height: 26px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--rm-text, #e5e5ea); padding: 0;
    }
    .scaler-btn ha-icon { --mdc-icon-size: 14px; }
    .servings-val { font-size: 14px; font-weight: 600; color: var(--rm-text, #e5e5ea); min-width: 24px; text-align: center; }

    .picker-search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.06));
      flex-shrink: 0;
    }
    .search-icon { color: var(--rm-text-secondary, #8e8e93); --mdc-icon-size: 18px; }
    .picker-search {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--rm-text, #e5e5ea);
      font-size: 14px;
      padding: 4px 0;
    }
    .picker-search::placeholder { color: var(--rm-text-secondary, #8e8e93); }

    .picker-list {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border, rgba(255,255,255,0.08)) transparent;
    }
    .picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--rm-border, rgba(255,255,255,0.05));
      transition: background 0.12s;
    }
    .picker-item:hover { background: var(--rm-surface, #2c2c2e); }
    .picker-thumb {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .picker-placeholder {
      background: var(--rm-surface, #2c2c2e);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--rm-text-secondary, #8e8e93);
    }
    .picker-placeholder ha-icon { --mdc-icon-size: 22px; }
    .picker-info { flex: 1; min-width: 0; }
    .picker-name { font-size: 14px; font-weight: 500; color: var(--rm-text, #e5e5ea); display: block; }
    .picker-tags { font-size: 12px; color: var(--rm-text-secondary, #8e8e93); }
    .picker-fav { color: var(--error-color, #cf6679); --mdc-icon-size: 16px; }
    .picker-empty { padding: 30px; text-align: center; color: var(--rm-text-secondary, #8e8e93); font-size: 14px; }

    /* ═══ Fresh + Compact ═══ */
    :host([ui-style="fresh"]) .week-nav,
    :host([ui-style="compact"]) .week-nav { border-bottom: none; padding: 16px 20px 4px; }
    :host([ui-style="fresh"]) .nav-btn,
    :host([ui-style="compact"]) .nav-btn {
      width: 44px; height: 44px; border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .nav-btn { border-radius: 14px; border-color: transparent; background: var(--rm-bg-elevated); }
    :host([ui-style="fresh"]) .week-label,
    :host([ui-style="compact"]) .week-label { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
    :host([ui-style="fresh"]) .today-badge,
    :host([ui-style="compact"]) .today-badge { background: var(--rm-accent-soft); color: var(--rm-accent-text); font-weight: 700; padding: 4px 10px; border-radius: 999px; }
    :host([ui-style="fresh"]) .text-link,
    :host([ui-style="compact"]) .text-link { color: var(--rm-accent-text); font-weight: 700; min-height: 32px; }
    :host([ui-style="fresh"]) .day-headers,
    :host([ui-style="compact"]) .day-headers { padding: 10px 16px 6px; gap: 3px; }
    :host([ui-style="fresh"]) .day-name,
    :host([ui-style="compact"]) .day-name { font-weight: 700; }
    :host([ui-style="fresh"]) .day-num,
    :host([ui-style="compact"]) .day-num { font-size: 15px; font-weight: 800; }
    :host([ui-style="fresh"]) .day-header.today .day-num,
    :host([ui-style="compact"]) .day-header.today .day-num { width: 28px; height: 28px; font-size: 13px; }
    :host([ui-style="fresh"]) .plan-scroll,
    :host([ui-style="compact"]) .plan-scroll { padding: 4px 16px 24px; }
    :host([ui-style="fresh"]) .meal-label,
    :host([ui-style="compact"]) .meal-label { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; padding: 12px 4px 6px; }
    :host([ui-style="fresh"]) .meal-cell,
    :host([ui-style="compact"]) .meal-cell {
      border-radius: 12px; padding: 4px; background: var(--rm-bg-surface); border: 1px solid var(--rm-border);
    }
    :host([ui-style="compact"]) .meal-cell { border-color: transparent; }
    :host([ui-style="fresh"]) .meal-cell.today,
    :host([ui-style="compact"]) .meal-cell.today { border-color: var(--rm-accent); }
    :host([ui-style="fresh"]) .meal-entry,
    :host([ui-style="compact"]) .meal-entry { background: var(--rm-accent-soft); color: var(--rm-accent-text); border-radius: 8px; font-weight: 600; }
    :host([ui-style="fresh"]) .entry-servings,
    :host([ui-style="compact"]) .entry-servings { color: var(--rm-accent-text); opacity: 0.8; }
    :host([ui-style="fresh"]) .add-slot-btn,
    :host([ui-style="compact"]) .add-slot-btn { border-radius: 8px; height: 22px; }
    :host([ui-style="fresh"]) .picker-panel,
    :host([ui-style="compact"]) .picker-panel { border-radius: 28px 28px 0 0; background: var(--rm-bg-main); box-shadow: 0 -10px 40px rgba(0,0,0,0.22); }
    :host([ui-style="fresh"]) .picker-header,
    :host([ui-style="compact"]) .picker-header { border-bottom: none; padding: 18px 20px 8px; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
    :host([ui-style="fresh"]) .picker-item,
    :host([ui-style="compact"]) .picker-item { padding: 10px 20px; border-bottom-color: var(--rm-line); }
    :host([ui-style="fresh"]) .picker-thumb,
    :host([ui-style="compact"]) .picker-thumb { border-radius: 14px; }
    :host([ui-style="fresh"]) .picker-search-wrap,
    :host([ui-style="compact"]) .picker-search-wrap { margin: 4px 16px 8px; padding: 0 14px; min-height: 44px; border: 1px solid var(--rm-border); border-radius: 999px; background: var(--rm-bg-surface); }
    :host([ui-style="fresh"]) .scaler-btn,
    :host([ui-style="compact"]) .scaler-btn { width: 36px; height: 36px; }

    /* ── Day view (Fresh + Compact) ── */
    [hidden] { display: none !important; }
    .day-chips { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; padding: 14px 16px 0; flex-shrink: 0; }
    .day-chip {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      min-height: 64px; padding: 8px 0; border-radius: 18px; cursor: pointer;
      border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([ui-style="compact"]) .day-chip { border-radius: 14px; border-color: transparent; }
    .dc-name { font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--rm-text-secondary); }
    .dc-num { font-size: 17px; font-weight: 800; font-variant-numeric: tabular-nums; }
    .dc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rm-accent); margin-top: 2px; }
    .dc-dot.empty { background: transparent; }
    .day-chip[aria-current="date"] .dc-num { color: var(--rm-accent-text); }
    .day-chip[aria-pressed="true"] { background: var(--rm-text); border-color: var(--rm-text); color: var(--rm-bg-main); }
    .day-chip[aria-pressed="true"] .dc-name { color: var(--rm-bg-main); opacity: 0.8; }
    .day-chip[aria-pressed="true"] .dc-num { color: var(--rm-bg-main); }
    .day-chip[aria-pressed="true"] .dc-dot { background: var(--rm-bg-main); }
    .day-chip:focus-visible, .slot-btn:focus-visible, .slot-open:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }

    .day-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 0 24px; scrollbar-width: thin; scrollbar-color: var(--rm-border) transparent; }
    .day-groups { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 20px; }
    @container (min-width: 680px) { .day-groups { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .planner-container { container-type: inline-size; }
    .day-title {
      display: flex; align-items: center; gap: 8px; padding: 18px 24px 8px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rm-text-secondary);
    }
    .dt-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rm-accent); flex: none; }
    .dt-dot.alt { background: var(--rm-warn); }
    .day-card { margin: 0 16px; padding: 2px 14px; border-radius: var(--rm-radius-card); border: 1px solid var(--rm-border); background: var(--rm-bg-surface); }
    :host([ui-style="compact"]) .day-card { border-color: transparent; padding: 0 14px; }
    .slot { display: flex; align-items: center; gap: 12px; min-height: 72px; padding: 10px 0; border-bottom: 1px solid var(--rm-line); }
    .slot:last-child { border-bottom: none; }
    .slot-tile, .slot-thumb {
      flex: none; width: 44px; height: 44px; border-radius: 14px; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--hue, var(--rm-accent)) 18%, var(--rm-bg-surface)); color: var(--hue, var(--rm-accent-text));
    }
    :host([ui-style="compact"]) .slot-tile, :host([ui-style="compact"]) .slot-thumb.no-img { width: 40px; height: 40px; border-radius: 12px; background: var(--hue, var(--rm-accent)); color: var(--rm-bg-main); }
    .slot-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .slot-tile ha-icon, .slot-thumb ha-icon { --mdc-icon-size: 22px; }
    .slot-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 0; border: none; background: transparent; text-align: left; cursor: pointer; color: var(--rm-text); font: inherit; }
    .slot-mid { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .slot-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rm-text-secondary); min-height: 1em; }
    .slot-name { font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--rm-text); }
    .slot-name.muted { font-weight: 500; color: var(--rm-text-secondary); }
    .slot-sub { font-size: 12.5px; font-weight: 500; color: var(--rm-text-secondary); }
    .slot-btn {
      flex: none; width: 44px; height: 44px; padding: 0; border: none; background: transparent; cursor: pointer;
      color: var(--rm-text-secondary); display: flex; align-items: center; justify-content: center;
    }
    .slot-btn:hover { color: var(--rm-text); }
    .slot-btn ha-icon { --mdc-icon-size: 20px; }
    .slot-btn.add span { width: 36px; height: 36px; border-radius: 50%; background: var(--rm-accent-soft); color: var(--rm-accent-text); display: flex; align-items: center; justify-content: center; }
    .slot-btn.add ha-icon { --mdc-icon-size: 18px; }

    .picker-search { min-width: 0; }
    .picker-search-clear {
      flex: none; width: 32px; height: 32px; padding: 0; border: none; border-radius: 50%; cursor: pointer;
      background: var(--rm-bg-elevated, rgba(128,128,128,0.15)); color: var(--rm-text, inherit);
      display: flex; align-items: center; justify-content: center;
    }
    .picker-search-clear:hover { background: var(--rm-accent-soft); color: var(--rm-accent-text, var(--rm-accent)); }
    .picker-search-clear:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }
    .picker-search-clear ha-icon { --mdc-icon-size: 16px; }
  `}try{customElements.define("ksh-rm-meal-planner",ae)}catch{}const se=[["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["pt","Português"],["nl","Nederlands"],["it","Italiano"]];class oe extends e{static properties={uiStyle:{type:String,attribute:"ui-style",reflect:!0},hass:{type:Object},settings:{type:Object},hubMode:{type:Boolean,attribute:"hub-mode"},_activeTab:{type:String},_backupState:{type:String}};constructor(){super(),m(this),this.settings={},this._activeTab="appearance",this._backupState=null}updated(e){}async _backup(){if("loading"!==this._backupState){this._backupState="loading";try{const e=await this.hass.callWS({type:"ksh_recipes/backup"}),t=JSON.stringify(e,null,2),i=new Blob([t],{type:"application/json"}),r=URL.createObjectURL(i),a=document.createElement("a");a.href=r,a.download=`recipe-manager-backup-${(new Date).toISOString().slice(0,10)}.json`,a.click(),URL.revokeObjectURL(r),this._backupState="done"}catch(e){console.error("[RM] Backup failed:",e),this._backupState="error"}setTimeout(()=>{this._backupState=null},3e3)}}get _darkNow(){const e=this.settings?.darkMode;if("on"===e)return!0;if("off"===e)return!1;const t=this.hass?.themes?.darkMode;return"boolean"==typeof t?t:"function"==typeof matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches}_themeName(e){return{meadow:n("Meadow"),slate:n("Slate"),sunset:n("Sunset")}[e]??e}_tile(e,i=1){return t`<span class="tile" style="--hue: var(--rm-h${i}, var(--rm-accent))"><ha-icon icon="${e}"></ha-icon></span>`}_update(e){const t={...this.settings,...e};this.dispatchEvent(new CustomEvent("rm-settings-change",{detail:{settings:t},bubbles:!0,composed:!0}))}render(){const e=this.settings;return t`
      <div class="settings-root">
        <div class="tab-bar">
          ${[["appearance","mdi:palette-outline",n("Appearance")],["advanced","mdi:tune-variant",n("Advanced")],["sync","mdi:cloud-sync-outline",n("Sync")],["help","mdi:help-circle-outline",n("Help")]].map(([e,i,r])=>t`
            <button class="tab-item ${this._activeTab===e?"active":""}"
              @click=${()=>{this._activeTab=e}}>
              <ha-icon icon="${i}"></ha-icon>
              <span>${r}</span>
            </button>
          `)}
        </div>
        <div class="settings-body">
          ${"appearance"===this._activeTab?this._renderAppearance(e):""}
          ${"advanced"===this._activeTab?this._renderAdvanced(e):""}
          ${"sync"===this._activeTab?this._renderSync():""}
          ${"help"===this._activeTab?this._renderHelp():""}
        </div>
      </div>
    `}_renderAppearance(e){const i="midnight"===e.theme||"ember"===e.theme||"neon"===e.theme,r="arctic"===e.theme||"meadow"===e.theme||"ocean"===e.theme,a=i||r,s=["fresh","compact","classic"].includes(e.uiStyle)?e.uiStyle:"fresh";return t`
      ${this.hubMode?"":t`
      <!-- ── Interface style ── -->
      <div class="section">
        <div class="section-label">${n("Interface style")}</div>
        <div class="setting-row block">
          <div class="style-options" role="radiogroup" aria-label="${n("Interface style")}">
            ${[["fresh",n("Fresh"),n("Soft cards, summary card, floating menu")],["compact",n("Compact"),n("Dense list, checkboxes, flat tab bar")],["classic",n("Classic"),n("The original look and colour themes")]].map(([e,i,r])=>t`
              <button class="style-option ${s===e?"selected":""}" role="radio"
                aria-checked="${s===e?"true":"false"}"
                @click=${()=>this._update({uiStyle:e})}>
                <span class="sp sp-${e}" aria-hidden="true"></span>
                <span class="so-label">${i}</span>
                <span class="so-hint">${r}</span>
              </button>
            `)}
          </div>
        </div>
      </div>

      ${"classic"===s?t`
        <div class="section">
          <div class="section-label">${n("Theme")}</div>
          <div class="setting-row">
            ${this._tile("mdi:palette-outline",1)}
            <span class="setting-name">${n("Colour theme")}</span>
            <select class="theme-select" @change=${e=>this._update({theme:e.target.value})}>
              <optgroup label="${n("Adaptive")}">
                <option value="soft"     ?selected=${"soft"===e.theme||!e.theme}>${n("🎨 Soft Pastel")}</option>
                <option value="blossom"  ?selected=${"blossom"===e.theme}>${n("🌸 Blossom")}</option>
              </optgroup>
              <optgroup label="${n("Light Themes")}">
                <option value="arctic"   ?selected=${"arctic"===e.theme}>${n("🧊 Arctic")}</option>
                <option value="meadow"   ?selected=${"meadow"===e.theme}>${n("🌿 Meadow")}</option>
                <option value="ocean"    ?selected=${"ocean"===e.theme}>${n("🌊 Ocean Blue")}</option>
              </optgroup>
              <optgroup label="${n("Dark Themes")}">
                <option value="midnight" ?selected=${"midnight"===e.theme}>${n("🌙 Midnight Ocean")}</option>
                <option value="ember"    ?selected=${"ember"===e.theme}>${n("🔥 Ember")}</option>
                <option value="neon"     ?selected=${"neon"===e.theme}>${n("🍇 Purple & Cyan")}</option>
              </optgroup>
            </select>
          </div>
        </div>
      `:t`
        <div class="section">
          <div class="section-label">${n("Theme")}</div>
          <div class="setting-row block">
            <div class="theme-cards" role="radiogroup" aria-label="${n("Theme")}">
              ${B.map(i=>{const r=this._darkNow?i.preview.dark:i.preview.light,a=O(s,e.designTheme)?.id===i.id;return t`
                  <button class="theme-card ${a?"selected":""}" role="radio" aria-checked="${a?"true":"false"}"
                    @click=${()=>this._update({designTheme:i.id})}>
                    <span class="theme-sw" style="background: ${r.bg}">
                      <i style="background: ${r.a}; height: 14px"></i>
                      <i style="background: ${r.s}; height: 22px"></i>
                    </span>
                    <span class="theme-name">${this._themeName(i.id)}${a?t`<ha-icon icon="mdi:check"></ha-icon>`:""}</span>
                  </button>
                `})}
            </div>
          </div>
        </div>
      `}

      ${"classic"===s&&a?t`
        <div class="section">
          <div class="section-label">${n("Colour mode")}</div>
          <div class="setting-row muted-row">
            <span class="setting-name">${n("Dark mode")}</span>
            <span class="muted-note">${n(i?"Always dark for this theme":"Always light for this theme")}</span>
          </div>
        </div>
      `:t`
        <div class="section">
          <div class="section-label">${n("Colour mode")}</div>
          <div class="setting-row block">
            <div class="mode-seg" role="radiogroup" aria-label="${n("Colour mode")}">
              ${[["off",n("Light")],["on",n("Dark")],["system",n("Match device")]].map(([i,r])=>t`
                <button class="mode-opt ${(e.darkMode??"system")===i?"selected":""}" role="radio"
                  aria-checked="${(e.darkMode??"system")===i?"true":"false"}"
                  @click=${()=>this._update({darkMode:i})}>${r}</button>
              `)}
            </div>
          </div>
        </div>
      `}

      `}

      <div class="section">
        <div class="section-label">${n("Text")}</div>
        <div class="setting-row">
          ${this._tile("mdi:format-size",5)}
          <span class="setting-name">${n("Text size")}</span>
          <div class="btn-group">
            ${[["small",n("S")],["medium",n("M")],["large",n("L")]].map(([i,r])=>t`
              <button class="seg-btn ${e.fontSize===i?"active":""}"
                @click=${()=>this._update({fontSize:i})}>${r}</button>
            `)}
          </div>
        </div>
      </div>

      <!-- ── Language & Units ── -->
      <div class="section">
        <div class="section-label">${n("Language & Units")}</div>

        <div class="setting-row">
          ${this._tile("mdi:translate",2)}
          <span class="setting-name">${n("Language")}</span>
          <select class="theme-select" @change=${e=>this._update({language:e.target.value})}>
            ${se.map(([i,r])=>t`
              <option value="${i}" ?selected=${(e.language??"en")===i}>${r}</option>
            `)}
          </select>
        </div>

        <div class="setting-row">
          ${this._tile("mdi:scale-balance",3)}
          <span class="setting-name">${n("Preferred units")}</span>
          <div class="btn-group">
            ${[["imperial",n("Imperial")],["metric",n("Metric")]].map(([i,r])=>t`
              <button class="seg-btn ${(e.unitSystem??"imperial")===i?"active":""}"
                @click=${()=>this._update({unitSystem:i})}>${r}</button>
            `)}
          </div>
        </div>
      </div>

      <!-- ── Recipe Grid ── -->
      <div class="section">
        <div class="section-label">${n("Recipe Grid")}</div>

        <div class="setting-row">
          ${this._tile("mdi:view-grid-outline",2)}
          <span class="setting-name">${n("Recipe columns")}</span>
          <div class="btn-group">
            ${[2,3,4,5,8,10].map(i=>t`
              <button class="seg-btn ${e.columns===i?"active":""}"
                @click=${()=>this._update({columns:i})}>${i}</button>
            `)}
          </div>
        </div>

        <div class="setting-row">
          ${this._tile("mdi:view-agenda-outline",3)}
          <span class="setting-name">${n("Recipe view")}</span>
          <div class="btn-group">
            ${[["list",n("List")],["tiles",n("Tiles")]].map(([i,r])=>t`
              <button class="seg-btn ${(e.recipeView??"list")===i?"active":""}"
                @click=${()=>this._update({recipeView:i})}>${r}</button>
            `)}
          </div>
        </div>

        <div class="setting-row">
          ${this._tile("mdi:heart-outline",6)}
          <span class="setting-name">${n("Favourites section")}</span>
          <label class="toggle">
            <input type="checkbox" ?checked=${e.showFavourites}
              @change=${e=>this._update({showFavourites:e.target.checked})} />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>

        <div class="setting-row">
          ${this._tile("mdi:history",5)}
          <div class="setting-info">
            <span class="setting-name">${n("Recent recipes count")}</span>
            <span class="setting-hint">${n("Recipes shown in the Recent filter tab")}</span>
          </div>
          <div class="btn-group">
            ${[6,12,24].map(i=>t`
              <button class="seg-btn ${(e.recentCount??12)===i?"active":""}"
                @click=${()=>this._update({recentCount:i})}>${i}</button>
            `)}
          </div>
        </div>
      </div>

      <!-- ── Navigation ── -->
      <div class="section">
        <div class="section-label">${n("Navigation")}</div>

        <div class="setting-row">
          ${this._tile("mdi:calendar-week",5)}
          <span class="setting-name">${n("Meal planner")}</span>
          <label class="toggle">
            <input type="checkbox" ?checked=${e.showPlanner}
              @change=${e=>this._update({showPlanner:e.target.checked})} />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
      </div>
    `}_renderAdvanced(e){return t`
      <!-- ── Timer Sound ── -->
      <div class="section">
        <div class="section-label">${n("Timer Sound")}</div>

        <div class="setting-row">
          ${this._tile("mdi:bell-ring-outline",6)}
          <span class="setting-name">${n("Alarm sound")}</span>
          <select class="theme-select" @change=${e=>this._update({timerSound:e.target.value})}>
            <option value="beep"  ?selected=${"beep"===(e.timerSound??"beep")}>${n("Beep")}</option>
            <option value="ding"  ?selected=${"ding"===e.timerSound}>${n("Ding")}</option>
            <option value="alarm" ?selected=${"alarm"===e.timerSound}>${n("Alarm (3 beeps)")}</option>
            <option value="none"  ?selected=${"none"===e.timerSound}>${n("Silent")}</option>
            <option value="file"  ?selected=${"file"===e.timerSound}>${n("Custom file…")}</option>
          </select>
        </div>

        ${"file"===e.timerSound?t`
          <div class="setting-row">
            <div class="setting-info">
              ${this._tile("mdi:file-music-outline",4)}
          <span class="setting-name">${n("Sound file")}</span>
              <span class="setting-hint">${e.timerSoundFileName||n("No file selected")}</span>
            </div>
            <label class="file-label">
              <input type="file" accept="audio/*" class="file-input"
                @change=${this._handleSoundFileChange} />
              <ha-icon icon="mdi:folder-music-outline"></ha-icon>
              ${e.timerSoundFile?n("Change"):n("Choose file")}
            </label>
          </div>
        `:""}

        <div class="setting-row">
          <div class="setting-info">
            ${this._tile("mdi:play-circle-outline",1)}
          <span class="setting-name">${n("Test sound")}</span>
            <span class="setting-hint">${n("Play a preview of the selected alarm")}</span>
          </div>
          <button class="seg-btn active" @click=${()=>this._testSound(e.timerSound??"beep",e.timerSoundFile)}>
            <ha-icon icon="mdi:volume-high"></ha-icon> ${n("Play")}
          </button>
        </div>
      </div>

      <!-- ── Keep Screen On ── -->
      <div class="section">
        <div class="section-label">${n("Voice PE / ESPHome timers")}</div>

        <div class="setting-row">
          ${this._tile("mdi:microphone-outline",4)}
          <div class="setting-info">
            <span class="setting-name">${n("Show Voice PE timers")}</span>
            <span class="setting-hint">${n("Lists timers started by voice in the Timers tab")}</span>
          </div>
          <label class="toggle">
            <input type="checkbox" .checked=${!1!==e.vpeTimers}
              @change=${e=>this._update({vpeTimers:e.target.checked})} />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>

        ${!1!==e.vpeTimers?t`
          <div class="setting-row">
            ${this._tile("mdi:code-tags",2)}
            <div class="setting-info">
              <span class="setting-name">${n("Sensor prefix")}</span>
              <span class="setting-hint">${n("Template sensors named like sensor.vpe_timer_1")}</span>
            </div>
            <input class="text-field" type="text" .value=${e.vpePrefix??"sensor.vpe_timer"}
              @change=${e=>this._update({vpePrefix:e.target.value.trim()||"sensor.vpe_timer"})} />
          </div>
        `:""}
      </div>

      <div class="section">
        <div class="section-label">${n("Keep Screen On")}</div>

        <div class="setting-row">
          ${this._tile("mdi:eye-outline",1)}
          <div class="setting-info">
            <span class="setting-name">${n("Keep screen on while viewing a recipe")}</span>
            <span class="setting-hint">${n("Uses the Wake Lock API — engages automatically while a recipe is open")}</span>
          </div>
          <label class="toggle">
            <input type="checkbox" ?checked=${e.keepScreenOn}
              @change=${e=>this._update({keepScreenOn:e.target.checked})} />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>

        ${e.keepScreenOn&&!T()?t`
          <div class="setting-row muted-row">
            <span class="setting-hint">${n('Not available in this browser/connection — the Wake Lock API requires a secure (HTTPS) connection to Home Assistant. This is the most common reason "keep screen on" doesn\'t work.')}</span>
          </div>
        `:""}

        ${e.keepScreenOn?t`
          <div class="setting-row">
            <div class="setting-info">
              ${this._tile("mdi:timer-sand",5)}
          <span class="setting-name">${n("Auto-release after")}</span>
              <span class="setting-hint">${n("Screen lock released after this many minutes")}</span>
            </div>
            <div class="btn-group">
              ${[15,30,45,60].map(i=>t`
                <button class="seg-btn ${(e.wakeLockDuration??60)===i?"active":""}"
                  @click=${()=>this._update({wakeLockDuration:i})}>${i}m</button>
              `)}
            </div>
          </div>
        `:""}
      </div>

      <!-- ── Unit Conversion ── -->
      <div class="section">
        <div class="section-label">${n("Unit Conversion")}</div>

        <div class="setting-row">
          ${this._tile("mdi:swap-horizontal",3)}
          <div class="setting-info">
            <span class="setting-name">${n("Show metric conversion button")}</span>
            <span class="setting-hint">${n("Button in Ingredients tab converts oz/lb/cups/fl oz → g/ml/kg")}</span>
          </div>
          <label class="toggle">
            <input type="checkbox" ?checked=${e.showUnitConversion}
              @change=${e=>this._update({showUnitConversion:e.target.checked})} />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
          </label>
        </div>
      </div>

      <!-- ── Image Slideshow ── -->
      <div class="section">
        <div class="section-label">${n("Image Slideshow")}</div>

        <div class="setting-row">
          <div class="setting-info">
            ${this._tile("mdi:image-multiple-outline",4)}
          <span class="setting-name">${n("Auto-advance interval")}</span>
            <span class="setting-hint">${n("Seconds between slides when a recipe has multiple images (0 = off)")}</span>
          </div>
          <div class="btn-group">
            ${[0,3,5,10,15].map(i=>t`
              <button class="seg-btn ${(e.slideshowInterval??5)===i?"active":""}"
                @click=${()=>this._update({slideshowInterval:i})}>${0===i?n("Off"):`${i}s`}</button>
            `)}
          </div>
        </div>
      </div>

    `}_handleSoundFileChange(e){const t=e.target.files?.[0];if(!t)return;const i=new FileReader;i.onload=e=>{this._update({timerSoundFile:e.target.result,timerSoundFileName:t.name})},i.readAsDataURL(t)}_testSound(e,t){if("file"!==e)try{const t=new(window.AudioContext||window.webkitAudioContext);if("ding"===e){const e=t.createOscillator(),i=t.createGain();e.connect(i),i.connect(t.destination),e.type="sine",e.frequency.setValueAtTime(1046,t.currentTime),i.gain.setValueAtTime(.6,t.currentTime),i.gain.exponentialRampToValueAtTime(.001,t.currentTime+1),e.start(t.currentTime),e.stop(t.currentTime+1)}else if("alarm"===e)for(let e=0;e<3;e++){const i=t.currentTime+.35*e,r=t.createOscillator(),a=t.createGain();r.connect(a),a.connect(t.destination),r.type="square",r.frequency.setValueAtTime(660,i),a.gain.setValueAtTime(.3,i),a.gain.exponentialRampToValueAtTime(.001,i+.2),r.start(i),r.stop(i+.2)}else if("none"!==e){const e=t.createOscillator(),i=t.createGain();e.connect(i),i.connect(t.destination),e.type="sine",e.frequency.setValueAtTime(880,t.currentTime),i.gain.setValueAtTime(.5,t.currentTime),i.gain.exponentialRampToValueAtTime(.001,t.currentTime+.5),e.start(t.currentTime),e.stop(t.currentTime+.5)}}catch(e){console.warn("Audio test failed:",e)}else if(t){new Audio(t).play().catch(e=>console.warn("Could not play file:",e))}}_renderSync(){const e="loading"===this._backupState?n("Backing up…"):"done"===this._backupState?n("Downloaded ✓"):"error"===this._backupState?n("Failed ✗"):n("Download backup");return t`
      <div class="section">
        <div class="section-label">${n("Backup")}</div>

        <div class="setting-row">
          <div class="setting-info">
            ${this._tile("mdi:download",1)}
          <span class="setting-name">${n("Export recipes")}</span>
            <span class="setting-hint">${n("Download all recipes and meal plans as a JSON file")}</span>
          </div>
          <button
            class="seg-btn backup-btn ${this._backupState||""}"
            ?disabled=${"loading"===this._backupState}
            @click=${()=>this._backup()}
          >${e}</button>
        </div>
      </div>
    `}_renderHelp(){return t`
      <div class="section">
        <div class="section-label">${n("FAQ & Support")}</div>

        <a class="help-link" href="https://github.com/thekiwismarthome/recipe-manager/wiki" target="_blank">
          <ha-icon icon="mdi:help-circle-outline"></ha-icon>
          <div class="help-link-content">
            ${this._tile("mdi:help-circle-outline",2)}
          <span class="setting-name">${n("FAQ")}</span>
            <span class="setting-hint">${n("Frequently asked questions")}</span>
          </div>
          <ha-icon icon="mdi:open-in-new" class="help-link-ext"></ha-icon>
        </a>

        <a class="help-link" href="https://github.com/thekiwismarthome/recipe-manager/issues" target="_blank">
          <ha-icon icon="mdi:bug-outline"></ha-icon>
          <div class="help-link-content">
            ${this._tile("mdi:bug-outline",6)}
          <span class="setting-name">${n("Report a Problem")}</span>
            <span class="setting-hint">${n("Submit an issue on GitHub")}</span>
          </div>
          <ha-icon icon="mdi:open-in-new" class="help-link-ext"></ha-icon>
        </a>

        <a class="help-link" href="https://github.com/thekiwismarthome/recipe-manager" target="_blank">
          <ha-icon icon="mdi:github"></ha-icon>
          <div class="help-link-content">
            ${this._tile("mdi:github",4)}
          <span class="setting-name">${n("GitHub Repository")}</span>
            <span class="setting-hint">${n("View source code")}</span>
          </div>
          <ha-icon icon="mdi:open-in-new" class="help-link-ext"></ha-icon>
        </a>
      </div>
    `}_renderPlaceholder(e,i,r){return t`
      <div class="placeholder-tab">
        <ha-icon icon="${i}"></ha-icon>
        <div class="placeholder-title">${e}</div>
        <div class="placeholder-msg">${r}</div>
      </div>
    `}static styles=i`
    :host { display: block; height: 100%; overflow: hidden; }

    .settings-root { display: flex; flex-direction: column; height: 100%; }

    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--rm-border, rgba(0,0,0,0.08));
      background: var(--rm-bg-surface, #fff);
      flex-shrink: 0; overflow-x: auto; scrollbar-width: none;
    }
    .tab-bar::-webkit-scrollbar { display: none; }

    .tab-item {
      display: flex; align-items: center; gap: 5px;
      background: none; border: none;
      border-bottom: 2px solid transparent;
      padding: 10px 14px; font-size: 13px; font-weight: 500;
      color: var(--rm-text-secondary, #6b5c4a);
      cursor: pointer; white-space: nowrap;
      transition: color 0.15s, border-color 0.15s; flex-shrink: 0;
    }
    .tab-item ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }
    .tab-item:hover { color: var(--rm-text, #2d2016); }
    .tab-item.active { color: var(--rm-accent); border-bottom-color: var(--rm-accent); }

    .settings-body { flex: 1; overflow-y: auto; padding-bottom: 24px; }

    .section { margin-bottom: 8px; }

    .section-label {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--rm-text-muted, #a08060); padding: 16px 20px 6px;
    }

    .setting-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--rm-border, rgba(0,0,0,0.08)); gap: 12px;
    }
    .setting-row.muted-row { opacity: 0.5; }

    .setting-name { font-size: 15px; font-weight: 500; flex-shrink: 0; color: var(--rm-text); }

    .setting-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .setting-hint { font-size: 12px; color: var(--rm-text-muted, #a08060); }

    .muted-note { font-size: 13px; color: var(--rm-text-muted, #a08060); }

    .backup-btn { min-width: 140px; white-space: nowrap; }
    .backup-btn.done    { background: var(--rm-success, #4caf50); color: #fff; }
    .backup-btn.error   { background: var(--rm-danger,  #e53935); color: #fff; }
    .backup-btn.loading { opacity: 0.7; cursor: wait; }

    .help-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--rm-border, rgba(0,0,0,0.06));
      text-decoration: none;
      color: inherit;
    }
    .help-link:last-of-type { border-bottom: none; }
    .help-link ha-icon { color: var(--rm-accent, #a0522d); flex-shrink: 0; }
    .help-link-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .help-link-ext { --mdc-icon-size: 16px; opacity: 0.4; }

    .theme-select {
      background: var(--rm-bg-surface, #fff); color: var(--rm-text, #2d2016);
      border: 1px solid var(--rm-border, rgba(0,0,0,0.12));
      border-radius: 8px; padding: 6px 10px; font-size: 14px; cursor: pointer;
      min-width: 160px; flex-shrink: 0;
    }

    .btn-group {
      display: flex; border-radius: 8px; overflow: hidden;
      border: 1px solid var(--rm-border, rgba(0,0,0,0.1)); flex-shrink: 0;
    }
    .seg-btn {
      background: transparent; border: none; padding: 6px 14px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      color: var(--rm-text-secondary, #6b5c4a);
      border-right: 1px solid var(--rm-border, rgba(0,0,0,0.1));
      transition: background 0.12s, color 0.12s;
      display: flex; align-items: center; gap: 4px;
    }
    .seg-btn ha-icon { --mdc-icon-size: 16px; }
    .seg-btn:last-child { border-right: none; }
    .seg-btn.active { background: var(--rm-accent); color: var(--rm-ink, #fff); }
    .seg-btn:hover:not(.active) { background: var(--rm-border); color: var(--rm-text); }

    .toggle { display: flex; align-items: center; cursor: pointer; flex-shrink: 0; }
    .toggle input { display: none; }
    .toggle-track {
      width: 44px; height: 24px;
      background: var(--rm-border, rgba(0,0,0,0.15));
      border-radius: 12px; position: relative; transition: background 0.2s;
    }
    .toggle input:checked + .toggle-track { background: var(--rm-accent); }
    .toggle-thumb {
      position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; background: #fff; border-radius: 50%;
      transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }

    .file-label {
      display: flex; align-items: center; gap: 6px;
      background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 8px; padding: 6px 12px; font-size: 13px;
      color: var(--rm-text); cursor: pointer; transition: background 0.15s;
      flex-shrink: 0;
    }
    .file-label:hover { background: var(--rm-accent-soft); }
    .file-label ha-icon { --mdc-icon-size: 18px; color: var(--rm-accent); }
    .file-input { display: none; }

    .placeholder-tab {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 60px 24px; gap: 12px;
      color: var(--rm-text-secondary); text-align: center;
    }
    .placeholder-tab ha-icon { --mdc-icon-size: 48px; opacity: 0.3; }
    .placeholder-title { font-size: 18px; font-weight: 600; color: var(--rm-text); }
    .placeholder-msg { font-size: 14px; max-width: 280px; line-height: 1.5; }

    /* ═══ Fresh + Compact ═══ */
    :host([ui-style="fresh"]) .tab-bar,
    :host([ui-style="compact"]) .tab-bar { background: transparent; border-bottom: none; gap: 8px; padding: 16px 16px 4px; }
    :host([ui-style="fresh"]) .tab-item,
    :host([ui-style="compact"]) .tab-item {
      min-height: 40px; padding: 0 16px; border: 1px solid var(--rm-border); border-radius: 999px;
      background: var(--rm-bg-surface); color: var(--rm-text); font-weight: 600; font-size: 14px;
    }
    :host([ui-style="compact"]) .tab-item { border-radius: 12px; border-color: transparent; }
    :host([ui-style="fresh"]) .tab-item.active,
    :host([ui-style="compact"]) .tab-item.active { background: var(--rm-text); border-color: var(--rm-text); color: var(--rm-bg-main); font-weight: 700; }
    :host([ui-style="fresh"]) .settings-body,
    :host([ui-style="compact"]) .settings-body { padding-bottom: 32px; }
    :host([ui-style="fresh"]) .section-label,
    :host([ui-style="compact"]) .section-label {
      padding: 18px 24px 8px; font-size: 12px; letter-spacing: 0.06em; color: var(--rm-text-secondary);
    }
    /* Rows in a section read as one rounded card */
    :host([ui-style="fresh"]) .setting-row,
    :host([ui-style="compact"]) .setting-row {
      margin: 0 16px; padding: 12px 16px; min-height: 60px;
      background: var(--rm-bg-surface);
      border: 1px solid var(--rm-border); border-top: none; border-bottom-color: var(--rm-line);
    }
    :host([ui-style="compact"]) .setting-row { border-color: transparent; border-bottom-color: var(--rm-line); }
    :host([ui-style="fresh"]) .section-label + .setting-row,
    :host([ui-style="compact"]) .section-label + .setting-row { border-top: 1px solid var(--rm-border); border-radius: var(--rm-radius-card) var(--rm-radius-card) 0 0; }
    :host([ui-style="compact"]) .section-label + .setting-row { border-top-color: transparent; }
    :host([ui-style="fresh"]) .setting-row:last-child,
    :host([ui-style="compact"]) .setting-row:last-child { border-bottom-color: var(--rm-border); border-radius: 0 0 var(--rm-radius-card) var(--rm-radius-card); }
    :host([ui-style="compact"]) .setting-row:last-child { border-bottom-color: transparent; }
    :host([ui-style="fresh"]) .section-label + .setting-row:last-child,
    :host([ui-style="compact"]) .section-label + .setting-row:last-child { border-radius: var(--rm-radius-card); }
    :host([ui-style="fresh"]) .setting-name,
    :host([ui-style="compact"]) .setting-name { font-weight: 700; }
    :host([ui-style="fresh"]) .btn-group,
    :host([ui-style="compact"]) .btn-group { border-radius: 14px; padding: 3px; gap: 2px; background: var(--rm-bg-main); }
    :host([ui-style="fresh"]) .seg-btn,
    :host([ui-style="compact"]) .seg-btn { min-height: 38px; padding: 0 14px; border-right: none; border-radius: 11px; font-weight: 600; color: var(--rm-text-secondary); }
    :host([ui-style="fresh"]) .seg-btn.active,
    :host([ui-style="compact"]) .seg-btn.active { background: var(--rm-accent); color: var(--rm-ink); font-weight: 700; }
    :host([ui-style="fresh"]) .theme-select,
    :host([ui-style="compact"]) .theme-select { border-radius: 12px; min-height: 44px; padding: 0 12px; }
    :host([ui-style="fresh"]) .toggle-track,
    :host([ui-style="compact"]) .toggle-track { width: 48px; height: 28px; border-radius: 99px; background: var(--rm-bg-elevated); box-shadow: inset 0 0 0 1px var(--rm-border); }
    :host([ui-style="fresh"]) .toggle-thumb,
    :host([ui-style="compact"]) .toggle-thumb { top: 3px; left: 3px; width: 22px; height: 22px; background: var(--rm-text-secondary); box-shadow: none; }
    :host([ui-style="fresh"]) .toggle input:checked + .toggle-track,
    :host([ui-style="compact"]) .toggle input:checked + .toggle-track { background: var(--rm-accent); box-shadow: none; }
    :host([ui-style="fresh"]) .toggle input:checked ~ .toggle-track .toggle-thumb,
    :host([ui-style="compact"]) .toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); background: var(--rm-ink); }
    :host([ui-style="fresh"]) .file-label,
    :host([ui-style="compact"]) .file-label { border-radius: 999px; min-height: 40px; padding: 0 16px; }
    :host([ui-style="fresh"]) .setting-row,
    :host([ui-style="compact"]) .setting-row { flex-wrap: wrap; }
    :host([ui-style="fresh"]) .btn-group,
    :host([ui-style="compact"]) .btn-group { max-width: 100%; overflow-x: auto; scrollbar-width: none; }

    /* ═══ Settings in the demo look: icon tiles, style / theme cards, colour mode ═══ */
    .tile { display: none; }
    :host([ui-style="fresh"]) .tile,
    :host([ui-style="compact"]) .tile {
      display: inline-flex; flex: none; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 12px;
      background: color-mix(in srgb, var(--hue) 18%, var(--rm-bg-surface)); color: var(--hue);
    }
    :host([ui-style="compact"]) .tile { width: 32px; height: 32px; border-radius: 9px; background: var(--hue); color: var(--rm-bg-main); }
    .tile ha-icon { --mdc-icon-size: 20px; }
    :host([ui-style="compact"]) .tile ha-icon { --mdc-icon-size: 18px; }
    :host([ui-style="fresh"]) .setting-info,
    :host([ui-style="compact"]) .setting-info { flex: 1; }
    :host([ui-style="fresh"]) .setting-row > .setting-name,
    :host([ui-style="compact"]) .setting-row > .setting-name { flex: 1; min-width: 0; text-align: left; }
    :host([ui-style="fresh"]) .setting-hint,
    :host([ui-style="compact"]) .setting-hint { color: var(--rm-text-secondary); font-size: 13px; }
    .setting-row.block { display: block; padding: 12px; min-height: 0; }

    .style-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .style-option {
      display: flex; flex-direction: column; gap: 6px; padding: 8px;
      border: 2px solid var(--rm-border); border-radius: 14px; background: transparent;
      color: var(--rm-text); text-align: left; cursor: pointer; font: inherit;
    }
    .style-option.selected { border-color: var(--rm-accent); background: color-mix(in srgb, var(--rm-accent) 10%, transparent); }
    .style-option:focus-visible, .theme-card:focus-visible, .mode-opt:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }
    .so-label { font-size: 13px; font-weight: 700; }
    .so-hint { font-size: 11px; line-height: 1.25; color: var(--rm-text-secondary); }
    .sp { position: relative; display: block; height: 58px; border-radius: 8px; background: var(--rm-bg-main); border: 1px solid var(--rm-border); overflow: hidden; }
    .sp::before { content: ""; position: absolute; left: 6px; right: 6px; top: 6px; height: 8px; border-radius: 3px; background: var(--rm-border); }
    .sp::after { content: ""; position: absolute; left: 6px; right: 6px; top: 20px; height: 14px; border-radius: 3px; background: var(--rm-bg-surface); box-shadow: 0 16px 0 -2px var(--rm-bg-surface); }
    .sp-fresh::after { border-radius: 7px; border: 1px solid var(--rm-border); box-sizing: border-box; height: 16px; }
    .sp-fresh { background-image: linear-gradient(var(--rm-accent), var(--rm-accent)); background-repeat: no-repeat; background-size: 60% 7px; background-position: center bottom 5px; }
    .sp-compact { background-image: linear-gradient(var(--rm-accent), var(--rm-accent)); background-repeat: no-repeat; background-size: 26% 3px; background-position: 50% bottom 0; }
    .sp-compact::after { border-radius: 0; box-shadow: none; border-bottom: 1px solid var(--rm-border); background: transparent; height: 8px; top: 22px; }
    .sp-classic { background: #fafbfc; }
    .sp-classic::before { background: #e8eaf6; }
    .sp-classic::after { background: #fff; border-radius: 6px; border: 1px solid #e8eaf6; box-sizing: border-box; height: 16px; box-shadow: 0 16px 0 -2px #fff; }

    .theme-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .theme-card {
      display: flex; flex-direction: column; gap: 8px; padding: 8px;
      border: 2px solid var(--rm-border); border-radius: 18px; background: var(--rm-bg-surface);
      color: var(--rm-text); font: inherit; text-align: left; cursor: pointer;
    }
    .theme-card.selected { border-color: var(--rm-accent); }
    .theme-sw { display: flex; align-items: flex-end; gap: 4px; height: 56px; padding: 8px; border-radius: 12px; box-sizing: border-box; }
    .theme-sw i { flex: 1; display: block; border-radius: 5px; }
    .theme-name { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700; }
    .theme-name ha-icon { --mdc-icon-size: 16px; color: var(--rm-accent); }
    .mode-seg { display: flex; gap: 4px; padding: 4px; border-radius: 16px; background: var(--rm-bg-elevated); }
    .mode-opt { flex: 1; min-height: 44px; padding: 0 8px; border: none; border-radius: 12px; background: transparent; color: var(--rm-text-secondary); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
    .mode-opt.selected { background: var(--rm-bg-surface); color: var(--rm-text); font-weight: 700; box-shadow: var(--rm-shadow); }

    .text-field { min-width: 0; width: 170px; min-height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text); font: inherit; font-size: 14px; }
    .text-field:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 1px; }
  `}try{customElements.define("ksh-rm-settings-view",oe)}catch{}const ne={"--slm-bg-main":"--rm-bg-main","--slm-bg-surface":"--rm-bg-surface","--slm-bg-elevated":"--rm-bg-elevated","--slm-tile-bg":"--rm-bg-surface","--slm-text-primary":"--rm-text","--slm-text-secondary":"--rm-text-secondary","--slm-text-muted":"--rm-text-secondary","--slm-border-subtle":"--rm-border","--slm-line-soft":"--rm-line","--slm-accent-primary":"--rm-accent","--slm-accent-ink":"--rm-ink","--slm-accent-soft":"--rm-accent-soft","--slm-accent-text":"--rm-accent-text","--slm-accent-warning":"--rm-warn","--slm-accent-danger":"--rm-danger"},ce=Object.keys(ne);class le extends e{static properties={uiStyle:{type:String,attribute:"ui-style",reflect:!0},hass:{type:Object},slmAvailable:{type:Boolean},shoppingLists:{type:Array},api:{type:Object},localItems:{type:Array},settings:{type:Object}};constructor(){super(),m(this),this.hass=null,this.slmAvailable=!1,this.shoppingLists=[],this.api=null,this.localItems=[],this.settings=null,this._slmCard=null,this._slmRetryTimeout=null}disconnectedCallback(){super.disconnectedCallback(),this._slmRetryTimeout&&(clearTimeout(this._slmRetryTimeout),this._slmRetryTimeout=null)}get _useSLM(){return this.slmAvailable||!!customElements.get("ksh-shopping-module")}updated(e){this._useSLM&&(this._slmCard?(e.has("hass")&&this.hass&&(this._slmCard.hass=this.hass),(e.has("settings")||e.has("uiStyle"))&&this.settings&&this._slmCard&&this._syncSlmTheme()):this._mountSlmCard())}_syncSlmTheme(){if(!this._slmCard||!this.settings)return;const{theme:e,darkMode:t}=this.settings;this._slmCard.settings={...this._slmCard.settings,theme:e,darkMode:t},this._slmCard.applyColorScheme?.(),this._syncSlmPalette()}_syncSlmPalette(){const e=this._slmCard;if(!e)return;const t=L(this.settings?.uiStyle),i=this.getRootNode()?.host,r=i?.getAttribute?.("data-mode"),a=this.settings?.darkMode,s=r?"dark"===r:"on"===a||"off"!==a&&(window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1),o=["--ha-card-border-radius","--ha-card-box-shadow","--ha-card-border-width"];if("hostUi"in e){for(const t of ce)e.style.removeProperty(t);return e.hostUi="classic"===t?void 0:t,e.hostDark=s,e.hostAccent="classic"===t?null:N(t,this.settings?.designTheme,s),e.applyColorScheme?.(),void("classic"===t?o.forEach(t=>e.style.removeProperty(t)):(e.style.setProperty("--ha-card-border-radius","0"),e.style.setProperty("--ha-card-box-shadow","none"),e.style.setProperty("--ha-card-border-width","0")))}const n=ne;if("classic"===t){for(const t of[...Object.keys(n),"--ha-card-border-radius"])e.style.removeProperty(t);return}const c=W(t,s,this.settings?.designTheme);for(const[t,i]of Object.entries(n))e.style.setProperty(t,c[i]);e.style.setProperty("--ha-card-border-radius",c["--rm-radius-card"])}_mountSlmCard(){const e=this.shadowRoot?.querySelector(".slm-host");if(!e)return;const t=customElements.get("ksh-shopping-module");if(!t)return void(this._slmRetryTimeout||(this._slmRetryTimeout=setTimeout(()=>{this._slmRetryTimeout=null,this.isConnected&&this._mountSlmCard()},500)));const i=new t;try{i.setConfig({})}catch(e){}i.style.cssText="display:block;width:100%;height:100%;max-height:100%;min-height:0;",i.isEmbedded=!0,e.appendChild(i),this.hass&&(i.hass=this.hass),this._slmCard=i,setTimeout(()=>this._syncSlmTheme(),0)}_toggleLocalItem(e){const t=this.localItems.map(t=>t.id===e?{...t,checked:!t.checked}:t);this._dispatchLocalUpdate(t)}_clearLocalChecked(){this._dispatchLocalUpdate(this.localItems.filter(e=>!e.checked))}_clearAllLocal(){this._dispatchLocalUpdate([])}_dispatchLocalUpdate(e){this.dispatchEvent(new CustomEvent("rm-shopping-local-update",{detail:{items:e},bubbles:!0,composed:!0}))}render(){return t`
      <div class="shopping-view">
        ${this._useSLM?this._renderSlmMode():this._renderLocalMode()}
      </div>
    `}_renderSlmMode(){return t`
      <div class="slm-card-wrap">
        <div class="slm-host"></div>
      </div>
    `}_renderLocalMode(){const e=this.localItems.some(e=>e.checked),i=this.localItems.filter(e=>!e.checked),r=this.localItems.filter(e=>e.checked);return t`
      <div class="sv-header">
        <span class="sv-list-name">${n("My Shopping List")}</span>
        <div class="sv-actions">
          ${e?t`
            <button class="sv-btn danger" @click=${this._clearLocalChecked}>
              <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
              <span>${n("Clear checked")}</span>
            </button>
          `:""}
          ${this.localItems.length?t`
            <button class="sv-btn" @click=${this._clearAllLocal} title=${n("Clear all")}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          `:""}
        </div>
      </div>

      <div class="sv-install-banner">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <div class="sv-install-text">
          <strong>${n("Get more features with Shopping List Manager")}</strong>
          <span>${n("Install the Shopping List Manager HACS integration for shared lists, categories, and sync.")}</span>
        </div>
      </div>

      ${0===this.localItems.length?t`
        <div class="sv-empty">
          <ha-icon icon="mdi:cart-outline"></ha-icon>
          <p>${n("Your shopping list is empty.")}</p>
          <p class="sv-hint">${n("Add ingredients from any recipe to get started.")}</p>
        </div>
      `:t`
        <div class="sv-items">
          ${i.map(e=>this._renderLocalRow(e))}
          ${r.length?t`
            <div class="sv-divider-label">${n("Checked")}</div>
            ${r.map(e=>this._renderLocalRow(e))}
          `:""}
        </div>
      `}
    `}_renderLocalRow(e){const i=[e.amount||"",e.unit||""].filter(Boolean).join(" ");return t`
      <div class="sv-row ${e.checked?"sv-row-checked":""}"
        @click=${()=>this._toggleLocalItem(e.id)}>
        <div class="sv-row-left">
          <div class="cat-dot"></div>
          <span class="row-emoji">📦</span>
        </div>
        <div class="sv-row-mid">
          <span class="sv-item-name">${e.name}</span>
          ${i?t`<span class="sv-item-unit">${i}</span>`:""}
        </div>
        <div class="sv-row-right">
          <div class="sv-checkbox ${e.checked?"checked":""}">
            ${e.checked?t`<ha-icon icon="mdi:check"></ha-icon>`:""}
          </div>
        </div>
      </div>
    `}static styles=i`
    :host { display: block; height: 100%; }

    .shopping-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    /* ── Embedded SLM card ──────────────────────────────────────────────── */

    .slm-card-wrap {
      flex: 1;
      min-height: 0;
      padding: 10px 12px 12px;
      box-sizing: border-box;
      background: var(--rm-bg-main);
      overflow: hidden;
    }

    .slm-host {
      display: block;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    /* ── Header (local mode only) ───────────────────────────────────────── */

    .sv-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid var(--rm-border);
      flex-shrink: 0;
      gap: 8px;
    }

    .sv-list-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--rm-text);
    }

    .sv-actions { display: flex; gap: 6px; align-items: center; }

    .sv-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: 1px solid var(--rm-border);
      border-radius: 8px;
      color: var(--rm-text-secondary);
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .sv-btn ha-icon { --mdc-icon-size: 18px; }
    .sv-btn:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .sv-btn.danger { color: var(--error-color, #cf6679); border-color: var(--error-color, #cf6679); }
    .sv-btn.danger:hover { background: rgba(207,102,121,0.1); }

    /* ── Install banner ─────────────────────────────────────────────────── */

    .sv-install-banner {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--rm-accent-soft);
      border-left: 3px solid var(--rm-accent);
      padding: 10px 14px;
      margin: 12px 16px;
      border-radius: 0 8px 8px 0;
      flex-shrink: 0;
    }
    .sv-install-banner ha-icon { --mdc-icon-size: 20px; color: var(--rm-accent); flex-shrink: 0; margin-top: 1px; }
    .sv-install-text { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--rm-text-secondary); }
    .sv-install-text strong { color: var(--rm-text); font-size: 13px; }

    /* ── Empty state ────────────────────────────────────────────────────── */

    .sv-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--rm-text-secondary);
      text-align: center;
      gap: 6px;
    }
    .sv-empty ha-icon { --mdc-icon-size: 48px; opacity: 0.35; }
    .sv-empty p { margin: 0; font-size: 15px; }
    .sv-hint { font-size: 13px !important; color: var(--rm-text-muted) !important; }

    /* ── Local item rows ────────────────────────────────────────────────── */

    .sv-items {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--rm-border) transparent;
    }

    .sv-divider-label {
      padding: 12px 16px 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--rm-text-muted);
    }

    .sv-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px 9px 12px;
      cursor: pointer;
      transition: background 0.12s;
      border-bottom: 1px solid var(--rm-border);
      min-height: 46px;
    }
    .sv-row:hover { background: var(--rm-accent-soft); }
    .sv-row-checked { opacity: 0.5; }

    .sv-row-left { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
    .cat-dot { width: 8px; height: 8px; border-radius: 50%; background: #78909c; flex-shrink: 0; }
    .row-emoji { font-size: 17px; line-height: 1; width: 22px; text-align: center; }

    .sv-row-mid {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: 7px;
      min-width: 0;
      flex-wrap: wrap;
    }

    .sv-item-name { font-size: 14px; color: var(--rm-text); font-weight: 500; }
    .sv-row-checked .sv-item-name { text-decoration: line-through; }
    .sv-item-unit { font-size: 12px; color: var(--rm-text-muted); }

    .sv-row-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

    .sv-checkbox {
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid var(--rm-border);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sv-checkbox.checked { color: #fff; background: #78909c; border-color: #78909c; }
    .sv-checkbox ha-icon { --mdc-icon-size: 14px; }

    /* ═══ Fresh + Compact ═══ */
    :host([ui-style="fresh"]) .slm-card-wrap,
    :host([ui-style="compact"]) .slm-card-wrap { padding: 0; }
    :host([ui-style="fresh"]) .sv-header,
    :host([ui-style="compact"]) .sv-header { border-bottom: none; padding: 20px 20px 8px; }
    :host([ui-style="fresh"]) .sv-list-name,
    :host([ui-style="compact"]) .sv-list-name { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--rm-text); }
    :host([ui-style="fresh"]) .sv-btn,
    :host([ui-style="compact"]) .sv-btn { min-height: 44px; border-radius: 999px; }
    :host([ui-style="compact"]) .sv-btn { border-radius: 12px; }
    :host([ui-style="fresh"]) .sv-install-banner,
    :host([ui-style="compact"]) .sv-install-banner { margin: 8px 20px; border: none; border-radius: var(--rm-radius-card); background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([ui-style="fresh"]) .sv-items,
    :host([ui-style="compact"]) .sv-items { margin: 8px 20px 24px; padding: 2px 14px; background: var(--rm-bg-surface); border: 1px solid var(--rm-border); border-radius: var(--rm-radius-card); overflow: hidden; }
    :host([ui-style="compact"]) .sv-items { border-color: transparent; }
    :host([ui-style="fresh"]) .sv-checkbox.checked,
    :host([ui-style="compact"]) .sv-checkbox.checked { background: var(--rm-accent); border-color: var(--rm-accent); color: var(--rm-ink); }
  `}try{customElements.define("ksh-rm-shopping-view",le)}catch{}const de="manual-toggle",pe="rm_settings",he="rm_shopping",me="rm_recent_recipes",ue="rm_timers",ge="rm_timer_presets",be="rm_view_state",ve=["grid","detail","settings","planner","shopping"];function fe(e){try{localStorage.setItem(ge,JSON.stringify(e))}catch{}}const xe=["DE","AT","CH","FR","ES","IT","NL","BE","PT","NZ","AU"],_e={uiStyle:"fresh",theme:"soft",darkMode:"system",fontSize:"medium",columns:3,recipeView:"list",showFavourites:!0,showPlanner:!0,recentCount:12,timerSound:"beep",vpeTimers:!0,vpePrefix:"sensor.vpe_timer",keepScreenOn:!1,keepScreenOnMins:30,showUnitConversion:!1,language:"en",unitSystem:"imperial"},ye={soft:{light:{"--rm-bg-main":"#fafbfc","--rm-bg-surface":"#ffffff","--rm-bg-elevated":"#ffffff","--rm-text":"#424242","--rm-text-secondary":"#757575","--rm-text-muted":"#9e9e9e","--rm-accent":"#9fa8da","--rm-accent-soft":"rgba(159,168,218,0.15)","--rm-border":"#e8eaf6","--rm-shadow":"0 2px 6px rgba(0,0,0,0.08)"},dark:{"--rm-bg-main":"#14161a","--rm-bg-surface":"#1b1f25","--rm-bg-elevated":"#232833","--rm-text":"#e4e7ec","--rm-text-secondary":"#a8b0bd","--rm-text-muted":"#7a8594","--rm-accent":"#9fa8da","--rm-accent-soft":"rgba(159,168,218,0.18)","--rm-border":"#2b313c","--rm-shadow":"0 2px 6px rgba(0,0,0,0.3)"}},arctic:{light:{"--rm-bg-main":"#f0f4f8","--rm-bg-surface":"#ffffff","--rm-bg-elevated":"#ffffff","--rm-text":"#1a2332","--rm-text-secondary":"#526070","--rm-text-muted":"#8097aa","--rm-accent":"#2979ff","--rm-accent-soft":"rgba(41,121,255,0.12)","--rm-border":"#dce6f0","--rm-shadow":"0 2px 6px rgba(26,35,50,0.1)"}},meadow:{light:{"--rm-bg-main":"#f4f7f0","--rm-bg-surface":"#fefffe","--rm-bg-elevated":"#fefffe","--rm-text":"#2d3a2a","--rm-text-secondary":"#6b7c64","--rm-text-muted":"#96a98e","--rm-accent":"#4caf50","--rm-accent-soft":"rgba(76,175,80,0.12)","--rm-border":"#dde8d8","--rm-shadow":"0 2px 6px rgba(45,58,42,0.1)"}},blossom:{light:{"--rm-bg-main":"#fdf8fb","--rm-bg-surface":"#ffffff","--rm-bg-elevated":"#fff8fc","--rm-text":"#3d1f35","--rm-text-secondary":"#8c5e79","--rm-text-muted":"#b48fa5","--rm-accent":"#c2668a","--rm-accent-soft":"rgba(194,102,138,0.12)","--rm-border":"#f0d6e8","--rm-shadow":"0 2px 6px rgba(61,31,53,0.1)"},dark:{"--rm-bg-main":"#1a0d12","--rm-bg-surface":"#241420","--rm-bg-elevated":"#2e1a28","--rm-text":"#f8d0de","--rm-text-secondary":"#c070a0","--rm-text-muted":"#603050","--rm-accent":"#f48fb1","--rm-accent-soft":"rgba(244,143,177,0.15)","--rm-border":"rgba(248,208,222,0.08)","--rm-shadow":"0 2px 8px rgba(0,0,0,0.4)"}},ocean:{light:{"--rm-bg-main":"#f0f7ff","--rm-bg-surface":"#ffffff","--rm-bg-elevated":"#f9fbff","--rm-text":"#1a3a5f","--rm-text-secondary":"#4a6b8c","--rm-text-muted":"#7a9bbd","--rm-accent":"#0077ff","--rm-accent-soft":"rgba(0,119,255,0.12)","--rm-border":"#d0e1f2","--rm-shadow":"0 2px 6px rgba(26,58,95,0.1)"}},midnight:{dark:{"--rm-bg-main":"#0d1117","--rm-bg-surface":"#161b22","--rm-bg-elevated":"#1c2333","--rm-text":"#c9d1d9","--rm-text-secondary":"#8b949e","--rm-text-muted":"#6e7681","--rm-accent":"#58a6ff","--rm-accent-soft":"rgba(88,166,255,0.15)","--rm-border":"#21262d","--rm-shadow":"0 2px 8px rgba(0,0,0,0.5)"}},ember:{dark:{"--rm-bg-main":"#111111","--rm-bg-surface":"#1c1a17","--rm-bg-elevated":"#242018","--rm-text":"#f5f0e8","--rm-text-secondary":"#a89880","--rm-text-muted":"#7a6a55","--rm-accent":"#f0a500","--rm-accent-soft":"rgba(240,165,0,0.15)","--rm-border":"rgba(245,240,232,0.08)","--rm-shadow":"0 2px 8px rgba(0,0,0,0.5)"}},neon:{dark:{"--rm-bg-main":"#0a0b10","--rm-bg-surface":"#121420","--rm-bg-elevated":"#1a1d2e","--rm-text":"#e0e0f0","--rm-text-secondary":"#a0a5c0","--rm-text-muted":"#6a6f8e","--rm-accent":"#bb86fc","--rm-accent-soft":"rgba(187,134,252,0.15)","--rm-border":"#2a2d45","--rm-shadow":"0 2px 8px rgba(0,0,0,0.6)"}}},we={small:"13px",medium:"15px",large:"17px"};function ke(e){try{localStorage.setItem(pe,JSON.stringify(e))}catch{}}function $e(e){try{const t=e.filter(e=>!e.global).map(e=>({...e,savedAt:Date.now()}));localStorage.setItem(ue,JSON.stringify(t))}catch{}}function Se(e){const t=Math.floor(e/3600),i=Math.floor(e%3600/60),r=e%60;return t>0?`${t}:${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`:`${i}:${String(r).padStart(2,"0")}`}function ze(e){try{const t=new(window.AudioContext||window.webkitAudioContext);t.createGain().connect(t.destination);const i=(e,i,r,a=.6)=>{const s=t.createOscillator(),o=t.createGain();s.connect(o),o.connect(t.destination),s.frequency.value=e,o.gain.setValueAtTime(a,t.currentTime+i),o.gain.exponentialRampToValueAtTime(.001,t.currentTime+i+r),s.start(t.currentTime+i),s.stop(t.currentTime+i+r+.05)};if("beep"===e)i(880,0,.15),i(880,.2,.15),i(880,.4,.15);else if("ding"===e)i(1318,0,.8,.5),i(1047,.1,.6,.3);else if("alarm"===e)for(let e=0;e<5;e++)i(880,.25*e,.12),i(660,.25*e+.13,.1)}catch{}}class Te extends e{static properties={hass:{type:Object},_config:{type:Object},_view:{type:String},hubMode:{type:Boolean,attribute:"hub-mode"},hostDark:{type:Boolean},hostUi:{type:String},_recipes:{type:Array},_tags:{type:Array},_selectedRecipe:{type:Object},_loading:{type:Boolean},_error:{type:String},_searchQuery:{type:String},_activeTag:{type:String},_shoppingLists:{type:Array},_slmAvailable:{type:Boolean},_localShoppingItems:{type:Array},_settings:{type:Object},_wide:{type:Boolean},_sidebarCollapsed:{type:Boolean},_gridScrollPos:{type:Number},_weekPlan:{type:Array},_overlayOpen:{type:Boolean},_recentRecipeIds:{type:Array},_timers:{type:Array},_timerAlarm:{type:Object},_timerAlarmQueue:{type:Array},_timersPrevView:{type:String},_customTimerInput:{type:String},_hdrStarHover:{type:Number},_mobileMenuOpen:{type:Boolean},_navDirection:{type:String},_closingDetail:{type:Boolean},_gridFilterPreset:{type:Object},_timerPresets:{type:Array},_presetNameInput:{type:String},_presetMinsInput:{type:String},_alarmAddInput:{type:String},_plannerFromRecipe:{type:Object},_globalMode:{type:Boolean},_quickTimerLabel:{type:String},_globalWakeActive:{type:Boolean}};constructor(){super(),m(this),this._pendingViewRestore=function(){try{const e=sessionStorage.getItem(be);return e?JSON.parse(e):null}catch{return null}}(),this._view="grid",this._recipes=[],this._tags=[],this._selectedRecipe=null,this._loading=!1,this._error=null,this._searchQuery="",this._activeTag=null,this._shoppingLists=[],this._slmAvailable=!1,this._localShoppingItems=[],this._settings=function(){try{const e=localStorage.getItem(pe);return e?{..._e,...JSON.parse(e)}:{..._e}}catch{return{..._e}}}(),this._languageAutoDetectPending=!function(){try{const e=localStorage.getItem(pe);return!(!e||!Object.prototype.hasOwnProperty.call(JSON.parse(e),"language"))}catch{return!1}}(),k(this._settings.language),this._wide=!1,this._sidebarCollapsed=!1,this._weekPlan=[],this._overlayOpen=!1,this._gridScrollPos=0,this._recentRecipeIds=function(){try{const e=localStorage.getItem(me);return e?JSON.parse(e):[]}catch{return[]}}(),this._timers=function(){try{const e=localStorage.getItem(ue);if(!e)return[];const t=JSON.parse(e),i=Date.now();return t.map(e=>{const t=e.savedAt?Math.floor((i-e.savedAt)/1e3):0,r=Math.max(0,(e.remaining??0)-(e.running?t:0));return{...e,remaining:r,savedAt:void 0}}).filter(e=>e.remaining>0)}catch{return[]}}(),this._timerAlarm=null,this._timerAlarmQueue=[],this._timersPrevView=null,this._customTimerInput="",this._hdrStarHover=0,this._mobileMenuOpen=!1,this._navDirection="forward",this._closingDetail=!1,this._gridFilterPreset=null,this._timerPresets=function(){try{const e=localStorage.getItem(ge);return e?JSON.parse(e):[]}catch{return[]}}(),this._presetNameInput="",this._presetMinsInput="",this._alarmAddInput="",this._plannerFromRecipe=null,this._globalMode=!1,this._quickTimerLabel="",this._alarmLoopActive=!1,this._alarmInterval=null,this._alarmTimeout=null,this._alarmAudio=null,this._unsubscribe=null,this._darkModeQuery=null,this._resizeObserver=null,this._timerTick=null,this._globalWakeActive=!1,this._globalWakeUnsubscribeFn=null}setConfig(e){this._config=e}static getConfigElement(){return document.createElement("recipe-manager-card-editor")}static getStubConfig(){return{}}getCardSize(){return 6}setLanguage(e){this._settings.language!==e&&(this._settings={...this._settings,language:e},ke(this._settings),k(e))}setHubView(e){e!==this._view&&(this._navDirection="forward","planner"===e&&(this._plannerFromRecipe=null),"timers"===e&&(this._timersPrevView=this._view),this._selectedRecipe=null,this._view=e)}_updateHeight(){this.hubMode||requestAnimationFrame(()=>requestAnimationFrame(()=>{const e=this.getBoundingClientRect().top,t=window.innerHeight-Math.max(e,0);t>100&&(this.style.height=`${t}px`)}))}connectedCallback(){super.connectedCallback(),this._darkModeQuery=window.matchMedia("(prefers-color-scheme: dark)"),this._darkModeQuery.addEventListener("change",this._onSystemDark),this._applyTheme(),this._resizeObserver=new ResizeObserver(e=>{const t=e[0]?.contentRect?.width??0;this._wide=t>=620}),this._resizeObserver.observe(this),this._onViewportResize=()=>this._updateHeight(),window.visualViewport?.addEventListener("resize",this._onViewportResize),window.addEventListener("resize",this._onViewportResize),this._updateHeight(),this._timerTick=setInterval(()=>this._tickTimers(),1e3)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=null),this._darkModeQuery?.removeEventListener("change",this._onSystemDark),this._resizeObserver?.disconnect(),window.visualViewport?.removeEventListener("resize",this._onViewportResize),window.removeEventListener("resize",this._onViewportResize),this._timerTick&&(clearInterval(this._timerTick),this._timerTick=null),this._timerAlarm&&(this._stopAlarmLoop(),this._timerAlarm=null),this._timerAlarmQueue=[],$e(this._timers),this._globalWakeActive&&R(de)}_onSystemDark=()=>{"system"===this._settings.darkMode&&this._applyTheme()};updated(e){if(e.has("hass")&&this.hass&&!this._api&&(this._api=new f(this.hass),this._init()),e.has("hass")&&this.hass&&this._languageAutoDetectPending){this._languageAutoDetectPending=!1;const e=(this.hass.language||"").split("-")[0].toLowerCase(),t=_.includes(e)?e:this._settings.language,i=this.hass.config||{},r="km"===i.unit_system?.length||xe.includes(String(i.country||"").toUpperCase());this._settings={...this._settings,language:t,...r?{unitSystem:"metric"}:{}},ke(this._settings),k(t)}e.has("hass")&&this._api&&(this._api.hass=this.hass),(e.has("_settings")||e.has("hostDark")||e.has("hostUi")||e.has("hubMode")||e.has("hass")&&this.hass?.themes?.darkMode!==this._lastHaDark)&&this._applyTheme(),this._lastHaDark=this.hass?.themes?.darkMode,e.has("hubMode")&&this.toggleAttribute("data-hub",!!this.hubMode),e.has("_view")&&this.hubMode&&this.dispatchEvent(new CustomEvent("module-view-changed",{detail:{view:this._view},bubbles:!0,composed:!0})),e.has("_view")&&this._overlayOpen&&(this._overlayOpen=!1),(e.has("_view")||e.has("_selectedRecipe"))&&this._saveViewState()}_saveViewState(){ve.includes(this._view)&&function(e){try{sessionStorage.setItem(be,JSON.stringify(e))}catch{}}({view:this._view,recipeId:"detail"===this._view?this._selectedRecipe?.id??null:null})}_restoreViewState(){const e=this._pendingViewRestore;if(this._pendingViewRestore=null,e&&ve.includes(e.view))if("detail"===e.view&&e.recipeId){const t=this._recipes.find(t=>t.id===e.recipeId);t&&(this._selectedRecipe=t,this._view="detail")}else"detail"===e.view||this.hubMode&&"shopping"===e.view||(this._view=e.view)}get _ui(){return this.hubMode?"fresh"===this.hostUi?"fresh":"compact":L(this._settings.uiStyle)}_isDarkNow(){if(this.hubMode&&"boolean"==typeof this.hostDark)return this.hostDark;const e=this._settings.darkMode;if("on"===e)return!0;if("off"===e)return!1;const t=this.hass?.themes?.darkMode;return"boolean"==typeof t?t:this._darkModeQuery?.matches??!1}_applyTheme(){const e=this._settings,t=this._ui;if(this.setAttribute("data-ui",t),this.style.setProperty("--rm-font-size-base",we[e.fontSize]??"15px"),this.style.setProperty("--rm-grid-columns",`repeat(${e.columns??3}, minmax(0, 1fr))`),"classic"!==t){const i=this._isDarkNow();this.setAttribute("data-mode",i?"dark":"light");for(const[r,a]of Object.entries(W(t,i,e.designTheme)))this.style.setProperty(r,a);if(this.hubMode)for(const[e,t]of Object.entries(U[i?"dark":"light"]))this.style.setProperty(e,t);return}this.removeAttribute("data-mode");for(const e of["--rm-bg","--rm-surface","--rm-success","--rm-accent-text","--rm-ink","--rm-line","--rm-warn","--rm-danger","--rm-radius-card","--rm-shadow-float"])this.style.removeProperty(e);this.style.removeProperty("--rm-radius"),this.style.removeProperty("--rm-radius-sm");const i=ye[e.theme]??ye.soft,r=!i.light,a=!i.dark;let s=r;r||a?a&&(s=!1):s="on"===e.darkMode||"off"!==e.darkMode&&(this._darkModeQuery?.matches??!1);const o=s?i.dark??i.light:i.light??i.dark;for(const[e,t]of Object.entries(o))this.style.setProperty(e,t);this.style.setProperty("--rm-font-size-base",we[e.fontSize]??"15px"),this.style.setProperty("--rm-grid-columns",`repeat(${e.columns??3}, minmax(0, 1fr))`)}async _init(){this._loading=!0,this._loadLocalShopping();try{await Promise.all([this._loadRecipes(),this._loadTags(),this._loadShoppingLists(),this._loadGlobalTimers(),this._loadWeekPlan()]),this._restoreViewState(),await this._subscribe()}catch(e){this._error=e.message||n("Failed to load recipes")}finally{this._loading=!1}}async _loadWeekPlan(){try{const e=new Date,t=(e.getDay()+6)%7;e.setDate(e.getDate()-t);const i=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,r=await this._api.getMealPlan(i);this._weekPlan=r?.entries??[]}catch{this._weekPlan=[]}}async _loadGlobalTimers(){try{const{timers:e}=await this._api.getGlobalTimers(),t=Date.now()/1e3;this._timers=[...this._timers.filter(e=>!e.global),...(e||[]).map(e=>this._globalTimerToLocal(e,t))]}catch{}}_globalTimerToLocal(e,t=Date.now()/1e3){const i=e.running?Math.max(0,e.duration-(t-e.start_time)):e.paused_remaining??e.duration;return{id:e.id,label:e.label,total:e.duration,remaining:Math.round(i),running:e.running&&i>0,alarming:e.running&&i<=0,presetId:e.preset_id||null,global:!0,duration:e.duration,start_time:e.start_time,paused_remaining:e.paused_remaining}}_loadLocalShopping(){try{const e=localStorage.getItem(he);this._localShoppingItems=e?JSON.parse(e):[]}catch{this._localShoppingItems=[]}}_saveLocalShopping(){try{localStorage.setItem(he,JSON.stringify(this._localShoppingItems))}catch{}}async _loadRecipes(){const e=await this._api.getAllRecipes();this._recipes=e?.recipes??[]}async _loadTags(){const e=await this._api.getTags();this._tags=e?.tags??[]}async _loadShoppingLists(){try{this._shoppingLists=(await this._api.getShoppingLists())?.lists??[],this._slmAvailable=!0}catch{this._shoppingLists=[],this._slmAvailable=!1}}async _subscribe(){if(!this._unsubscribe)try{this._unsubscribe=await this._api.subscribe(async e=>{const t=e.event_type??e.event,i=e.data??{};/recipe_(added|updated|deleted)/.test(t)?(await Promise.all([this._loadRecipes(),this._loadTags()]),this._selectedRecipe&&(this._selectedRecipe=this._recipes.find(e=>e.id===this._selectedRecipe.id)??this._selectedRecipe)):/meal_plan/.test(t??"")?this._loadWeekPlan():"ksh_recipes_global_timer_added"===t?this._timers.find(e=>e.id===i.id)||(this._timers=[...this._timers,this._globalTimerToLocal(i)]):"ksh_recipes_global_timer_updated"===t?this._timers=this._timers.map(e=>e.id===i.id?this._globalTimerToLocal(i):e):"ksh_recipes_global_timer_deleted"===t&&(this._timers=this._timers.filter(e=>e.id!==i.timer_id),this._timerAlarm?.id===i.timer_id&&(this._stopAlarmLoop(),this._timerAlarm=this._timerAlarmQueue.length?this._timerAlarmQueue.shift():null,this._timerAlarm&&this._startAlarmLoop(this._settings.timerSound??"beep",this._settings.timerSoundFile)))})}catch{}}get _filteredRecipes(){let e=this._recipes;if(this._activeTag&&(e=e.filter(e=>e.tags?.includes(this._activeTag)||e.courses?.includes(this._activeTag)||e.categories?.includes(this._activeTag)||e.collections?.includes(this._activeTag))),this._searchQuery.trim()){const t=this._searchQuery.trim().toLowerCase();e=e.filter(e=>e.name?.toLowerCase().includes(t)||e.description?.toLowerCase().includes(t)||e.tags?.some(e=>e.toLowerCase().includes(t)))}return e}get _recentRecipes(){const e=this._settings.recentCount??12;return this._recentRecipeIds.slice(0,e).map(e=>this._recipes.find(t=>t.id===e)).filter(Boolean)}_toggleRecipeView(){this._settings={...this._settings,recipeView:"tiles"===this._settings.recipeView?"list":"tiles"},ke(this._settings)}_handleSettingsChange(e){const t=this._settings.language;this._settings=e.detail.settings,ke(this._settings),this._settings.language!==t&&k(this._settings.language)}async _toggleGlobalWakeLock(){T()&&(this._globalWakeActive?(await R(de),this._globalWakeActive=!1):(await A(de),this._globalWakeActive=!0))}_tickTimers(){if("timers"===this._view&&this._vpeTimers.some(e=>e.running)&&this.requestUpdate(),!this._timers.length)return;let e=!1;const t=[],i=Date.now()/1e3,r=this._timers.map(r=>{if(r.alarming||!r.running)return r;const a=r.global?Math.max(0,r.duration-(i-r.start_time)):r.remaining-1;if(e=!0,a<=0){if(r.presetId)return{...r,remaining:0,running:!1,alarming:!0};t.push({id:r.id,label:r.label})}return{...r,remaining:Math.round(a),running:a>0}});e&&(this._timers=r,$e(this._timers)),t.length&&(this._timerAlarm||(this._timerAlarm=t.shift(),this._startAlarmLoop(this._settings.timerSound??"beep",this._settings.timerSoundFile)),t.length&&(this._timerAlarmQueue=[...this._timerAlarmQueue,...t]))}async _startTimer(e,t,i=null,r=!1){const a=t||n(c`${Math.floor(e/60)} min timer`);if(r&&this._api)try{const t=Date.now()/1e3;return void await this._api.addGlobalTimer({label:a,duration:e,start_time:t,running:!0,paused_remaining:null,...i?{preset_id:i}:{}})}catch(e){console.warn("Global timer failed, falling back to local:",e)}const s=Date.now().toString(36);this._timers=[...this._timers,{id:s,label:a,total:e,remaining:e,running:!0,presetId:i||null}],$e(this._timers)}_stopTimer(e){const t=this._timers.find(t=>t.id===e);this._timers=this._timers.filter(t=>t.id!==e),$e(this._timers),t?.global&&this._api&&this._api.deleteGlobalTimer(e).catch(()=>{})}_pauseTimer(e){const t=this._timers.find(t=>t.id===e),i=!!t&&t.running;if(this._timers=this._timers.map(t=>t.id===e?{...t,running:!t.running}:t),$e(this._timers),t?.global&&this._api)if(i){const t=this._timers.find(t=>t.id===e);this._api.updateGlobalTimer(e,{running:!1,paused_remaining:t?.remaining??0}).catch(()=>{})}else{const i=this._timers.find(t=>t.id===e),r=Date.now()/1e3-(t.duration-(i?.remaining??0));this._timers=this._timers.map(i=>i.id===e?{...i,start_time:r,duration:t.duration,running:!0}:i),this._api.updateGlobalTimer(e,{running:!0,start_time:r,paused_remaining:null}).catch(()=>{})}}_addTimeToTimer(e,t){const i=this._timers.find(t=>t.id===e);if(this._timers=this._timers.map(i=>i.id===e?{...i,remaining:i.remaining+t,total:i.total+t,running:!0,alarming:!1}:i),this._timerAlarm?.id===e?(this._stopAlarmLoop(),this._timerAlarm=this._timerAlarmQueue.length?this._timerAlarmQueue.shift():null,this._timerAlarm&&this._startAlarmLoop(this._settings.timerSound??"beep",this._settings.timerSoundFile)):this._timerAlarmQueue=this._timerAlarmQueue.filter(t=>t.id!==e),$e(this._timers),i?.global&&this._api){const r=this._timers.find(t=>t.id===e),a=Date.now()/1e3-(i.duration-(r?.remaining??0)),s=i.duration+t;this._timers=this._timers.map(t=>t.id===e?{...t,start_time:a,duration:s}:t),this._api.updateGlobalTimer(e,{running:!0,start_time:a}).catch(()=>{})}}_dismissAlarm(){this._timerAlarm&&(this._stopAlarmLoop(),this._stopTimer(this._timerAlarm.id),this._timerAlarm=this._timerAlarmQueue.length?this._timerAlarmQueue.shift():null,this._timerAlarm&&this._startAlarmLoop(this._settings.timerSound??"beep",this._settings.timerSoundFile))}_addPresetTimer(){const e=this._presetNameInput.trim(),t=parseFloat(this._presetMinsInput);if(!e||!t||t<=0)return;const i={id:Date.now().toString(36),name:e,seconds:Math.round(60*t)};this._timerPresets=[...this._timerPresets,i],fe(this._timerPresets),this._presetNameInput="",this._presetMinsInput=""}_removePreset(e){this._timerPresets=this._timerPresets.filter(t=>t.id!==e),fe(this._timerPresets)}_startAlarmLoop(e,t){if(this._stopAlarmLoop(),"none"!==e)if("file"===e&&t){this._alarmLoopActive=!0;const e=()=>{this._alarmLoopActive&&(this._alarmAudio=new Audio(t),this._alarmAudio.onended=()=>{this._alarmLoopActive&&(this._alarmTimeout=setTimeout(e,2e3))},this._alarmAudio.onerror=()=>{this._alarmLoopActive&&(this._alarmTimeout=setTimeout(()=>ze("beep"),2e3))},this._alarmAudio.play().catch(()=>{}))};e()}else ze(e),this._alarmInterval=setInterval(()=>ze(e),4e3)}_stopAlarmLoop(){this._alarmLoopActive=!1,this._alarmInterval&&(clearInterval(this._alarmInterval),this._alarmInterval=null),this._alarmTimeout&&(clearTimeout(this._alarmTimeout),this._alarmTimeout=null),this._alarmAudio&&(this._alarmAudio.pause(),this._alarmAudio.onended=null,this._alarmAudio.onerror=null,this._alarmAudio=null)}_handleStartTimer(e){const{seconds:t,label:i}=e.detail;this._startTimer(t,i,null,this._globalMode)}_handleSearch(e){this._searchQuery=e.detail?.query??""}_handleTagFilter(e){const t=e.detail?.tag;this._activeTag=this._activeTag===t?null:t}_handleChipNav(e){const{filterMode:t,value:i}=e.detail;this._navDirection="back","tags"===t?(this._activeTag=i,this._gridFilterPreset=null):(this._activeTag=null,this._gridFilterPreset={filterMode:t,selectedValues:[i]}),this._view="grid"}_handleBack(){this._closingDetail||("detail"===this._view&&this._selectedRecipe&&!this._closingDetail?(this._closingDetail=!0,this._view="grid"):(this._navDirection="back",this._view="grid",this._selectedRecipe=null,this._closingDetail=!1))}_onDetailTransitionEnd(e){e.target===e.currentTarget&&"transform"===e.propertyName&&this._closingDetail&&(this._closingDetail=!1,this._selectedRecipe=null)}_handleShowGrid(){this._navDirection="back",this._view="grid",this._selectedRecipe=null}_handleShowPlanner(){this._plannerFromRecipe=this._selectedRecipe||null,this._navDirection="forward",this._view="planner"}_handleBackToRecipe(){this._plannerFromRecipe&&(this._selectedRecipe=this._plannerFromRecipe,this._plannerFromRecipe=null,this._navDirection="back",this._view="detail")}_handleOpenRecipe(e){const t=this.shadowRoot?.querySelector("ksh-rm-recipe-grid");if(t){const e=t.shadowRoot?.querySelector(".grid-scroll");this._gridScrollPos=e?.scrollTop??0}const i=e.detail?.recipe;if(this._closingDetail=!1,this._navDirection="forward",this._selectedRecipe=i,this._view="detail",i?.id){const e=[i.id,...this._recentRecipeIds.filter(e=>e!==i.id)].slice(0,50);this._recentRecipeIds=e,function(e){try{localStorage.setItem(me,JSON.stringify(e))}catch{}}(e)}}async _handleToggleFavourite(e){const{recipeId:t}=e.detail;await this._api.toggleFavourite(t),await this._loadRecipes(),this._selectedRecipe?.id===t&&(this._selectedRecipe=this._recipes.find(e=>e.id===t)??this._selectedRecipe)}async _handleDeleteRecipe(e){await this._api.deleteRecipe(e.detail.recipeId),await this._loadRecipes(),await this._loadTags(),this._navDirection="back",this._view="grid",this._selectedRecipe=null}async _handleUpdateRecipe(e){const{recipeId:t,data:i}=e.detail;await this._api.updateRecipe(t,i),await this._loadRecipes(),await this._loadTags(),this._selectedRecipe?.id===t&&(this._selectedRecipe=this._recipes.find(e=>e.id===t)??null)}async _handleAddRecipe(e){try{await this._api.addRecipe(e.detail.data),this._navDirection="back",this._view="grid",await this._loadRecipes(),await this._loadTags()}catch(e){console.error("[Recipe Manager] Failed to save recipe:",e)}}async _handleImportDone(){this._navDirection="back",this._view="grid",await this._loadRecipes(),await this._loadTags()}async _handleAddToShopping(e){const{ingredients:t,listId:i,recipeName:r}=e.detail;if(this._slmAvailable&&i)try{(await this._api.addIngredientsToShoppingList(i,t,r)).filter(e=>!e.success).length&&console.warn("Some ingredients failed to add to SLM")}catch(e){console.error("Shopping list error:",e)}else{const e=t.map(e=>({id:Math.random().toString(36).slice(2,10),name:e.name,amount:e.amount||null,unit:e.unit||null,checked:!1}));this._localShoppingItems=[...this._localShoppingItems,...e],this._saveLocalShopping()}}_handleShoppingLocalUpdate(e){this._localShoppingItems=e.detail.items,this._saveLocalShopping()}_renderStars(e){const i=e||0,r=this._hdrStarHover,a=r>0?r:i;return t`
      <div class="header-stars"
        @mouseleave=${()=>{this._hdrStarHover=0}}
        title="${n(r>0?c`Set rating: ${r}★`:i>0?c`Rating: ${i}★ — click to change`:"Click to rate")}">
        ${[1,2,3,4,5].map(e=>t`
          <span class="hdr-star ${e<=a?"filled":""}"
            @mouseover=${()=>{this._hdrStarHover=e}}
            @click=${()=>this._handleRateRecipe(e)}>★</span>
        `)}
      </div>
    `}async _handleRateRecipe(e){if(!this._selectedRecipe)return;const t=this._selectedRecipe.rating===e?null:e;this._hdrStarHover=0,await this._handleUpdateRecipe({detail:{recipeId:this._selectedRecipe.id,data:{rating:t}}})}_renderSidebar(){const e=this._view,i=this._sidebarCollapsed,r=(r,a,s,o=!1,l=null)=>t`
      <button
        class="sb-item ${e===s?"active":""} ${o?"placeholder":""}"
        title="${o?n(c`${a} — coming soon`):a}"
        @click=${o?void 0:l||(()=>{this._navDirection="forward",this._view=s,this._selectedRecipe=null})}
        ?disabled=${o}
      >
        <ha-icon icon="${r}"></ha-icon>
        ${i?"":t`<span>${a}</span>`}
      </button>
    `;return t`
      <nav class="rm-sidebar ${i?"collapsed":""}">
        <div class="sb-top">
          <div class="sb-logo-row">
            <button class="sb-collapse-btn" @click=${()=>{this._sidebarCollapsed=!this._sidebarCollapsed}}
              title="${n(i?"Expand sidebar":"Collapse sidebar")}">
              <ha-icon icon="${i?"mdi:menu-close":"mdi:menu-open"}"></ha-icon>
            </button>
          </div>

          ${i?t`
            <button class="sb-icon-only-btn" @click=${()=>{this._view="add"}} title="${n("New Recipe")}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          `:t`
            <div class="sb-search">
              <ha-icon icon="mdi:magnify" class="sb-search-icon"></ha-icon>
              <input
                class="sb-search-input"
                type="text"
                placeholder="${n("Search…")}"
                .value=${this._searchQuery}
                @input=${e=>{this._searchQuery=e.target.value,this._navDirection="back",this._view="grid"}}
                @keydown=${e=>{"Escape"===e.key&&(this._searchQuery="")}}
              />
              ${this._searchQuery?t`
                <button class="sb-search-clear" title="${n("Clear search")}" aria-label="${n("Clear search")}"
                  @click=${()=>{this._searchQuery=""}}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              `:""}
            </div>

            <button class="sb-new-btn" @click=${()=>{this._view="add"}}>
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${n("New Recipe")}</span>
            </button>
          `}
        </div>

        <div class="sb-nav">
          ${r("mdi:home",n("Home"),"grid")}
          ${r("mdi:cart-outline",n("Shopping List"),"shopping")}
          ${this._settings.showPlanner?r("mdi:calendar-week",n("Meal Planner"),"planner",!1,()=>{this._plannerFromRecipe=null,this._navDirection="forward",this._view="planner",this._selectedRecipe=null}):""}
          ${r("mdi:book-open-variant",n("Cookbook"),"cookbook",!0)}
          <button
            class="sb-item ${"timers"===e?"active":""}"
            title="${n("Timers")}"
            @click=${()=>{this._timersPrevView=this._view,this._view="timers"}}
          >
            <ha-icon icon="mdi:timer-outline"></ha-icon>
            ${i?"":t`<span>${n("Timers")}</span>`}
            ${this._timerCount?t`<span class="sb-timer-badge">${this._timerCount}</span>`:""}
          </button>
        </div>

        <div class="sb-bottom">
          <button class="sb-item placeholder" disabled title="${n("Sync — coming soon")}">
            <ha-icon icon="mdi:cloud-sync-outline"></ha-icon>${i?"":t`<span>${n("Sync")}</span>`}
          </button>
          <button class="sb-item placeholder" disabled title="${n("Help — coming soon")}">
            <ha-icon icon="mdi:help-circle-outline"></ha-icon>${i?"":t`<span>${n("Help")}</span>`}
          </button>
          <button class="sb-item ${"settings"===e?"active":""}"
            @click=${()=>{this._view="settings"}}>
            <ha-icon icon="mdi:cog-outline"></ha-icon>${i?"":t`<span>${n("Settings")}</span>`}
          </button>
        </div>
      </nav>
    `}_renderHeader(){const e=("detail"===this._view||this._closingDetail)&&this._selectedRecipe,i="settings"===this._view,r="add"===this._view,a="timers"===this._view,s=this._wide,o=i?n("Settings"):r?n("New Recipe"):a?n("Timers"):e?"":"planner"===this._view?n("Meal Planner"):"shopping"===this._view?n("Shopping List"):this.hubMode?"":n("Recipes");return t`
      <div class="rm-header">
        <div class="rm-header-left">
          ${e||r?t`
            <button class="icon-btn" @click=${this._handleBack} title="${n("Back")}">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          `:a&&"detail"===this._timersPrevView?t`
            <button class="icon-btn"
              @click=${()=>{this._navDirection="back",this._view="detail",this._timersPrevView=null}}
              title="${n("Back to recipe")}">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          `:s||"grid"===this._view||i||a?"":t`
            <button class="icon-btn" @click=${this._handleShowGrid}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          `}
          <div class="rm-title ${o?"":"empty"}">
            <ha-icon icon="mdi:chef-hat"></ha-icon>
            <span>${o}</span>
          </div>
        </div>

        <div class="rm-header-right">
          <!-- Timer pills (compact, shown when timers are running, not in timer view) -->
          ${this._timers.length&&"timers"!==this._view?t`
            <div class="timer-pills" @click=${()=>{this._navDirection="forward",this._timersPrevView=this._view,this._view="timers"}}>
              ${this._timers.slice(0,3).map(e=>t`
                <div class="timer-pill ${e.running?"":"paused"}">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span>${Se(e.remaining)}</span>
                </div>
              `)}
              ${this._timers.length>3?t`<span class="timer-more">+${this._timers.length-3}</span>`:""}
            </div>
          `:""}

          ${this.hubMode&&s&&"grid"===this._view?t`
            <div class="hub-search">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input type="text" placeholder="${n("Search…")}" .value=${this._searchQuery}
                @input=${e=>{this._searchQuery=e.target.value}}
                @keydown=${e=>{"Escape"===e.key&&(this._searchQuery="")}} />
              ${this._searchQuery?t`
                <button class="hub-search-clear" aria-label="${n("Clear search")}" @click=${()=>{this._searchQuery=""}}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`:""}
            </div>
            <button class="hub-new-btn" @click=${()=>{this._navDirection="forward",this._view="add"}}>
              <ha-icon icon="mdi:plus"></ha-icon><span>${n("New Recipe")}</span>
            </button>
          `:""}

          ${e?this._renderStars(this._selectedRecipe.rating):""}

          ${"grid"===this._view&&"compact"===this._ui?t`
            <button class="icon-btn" @click=${this._toggleRecipeView}
              title="${"tiles"===this._settings.recipeView?n("Show as a list"):n("Show as tiles")}"
              aria-label="${"tiles"===this._settings.recipeView?n("Show as a list"):n("Show as tiles")}">
              <ha-icon icon="${"tiles"===this._settings.recipeView?"mdi:view-agenda-outline":"mdi:view-grid-outline"}"></ha-icon>
            </button>`:""}

          <button class="icon-btn wake-toggle-btn ${this._globalWakeActive?"active":""}"
            @click=${this._toggleGlobalWakeLock}
            ?disabled=${!T()}
            title="${T()?this._globalWakeActive?n("Screen awake — click to allow sleep"):n("Keep screen awake"):n("Keep screen awake — requires a secure (HTTPS) connection and a supported browser")}">
            <ha-icon icon="${this._globalWakeActive?"mdi:eye":"mdi:eye-off-outline"}"></ha-icon>
          </button>

          ${s||"grid"!==this._view||"compact"!==this._ui?"":t`
            <button class="icon-btn primary" @click=${()=>{this._navDirection="forward",this._view="add"}} title="${n("New Recipe")}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          `}

          ${i||r||a?t`
            <button class="icon-btn" @click=${this._handleShowGrid}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          `:s||this.hubMode?"":t`
            <button class="icon-btn"
              @click=${()=>{this._mobileMenuOpen=!this._mobileMenuOpen}}
              title="${this._mobileMenuOpen?n("Close menu"):n("Menu")}">
              <ha-icon icon="${this._mobileMenuOpen?"mdi:close":"mdi:menu"}"></ha-icon>
            </button>
          `}
        </div>
      </div>
    `}_renderBody(){const e=this._settings,i=this._ui;if("settings"===this._view)return t`
      <ksh-rm-settings-view ui-style=${i}
        .hubMode=${this.hubMode}
        .hass=${this.hass}
        .settings=${e}
        @rm-settings-change=${this._handleSettingsChange}
      ></ksh-rm-settings-view>
    `;if("add"===this._view)return t`
      <ksh-rm-add-recipe-dialog ui-style=${i}
        .api=${this._api}
        .asPanel=${!0}
        .inlineMode=${!0}
        @rm-add-recipe=${this._handleAddRecipe}
        @rm-import-done=${this._handleImportDone}
        @rm-close=${()=>{this._navDirection="back",this._view="grid"}}
      ></ksh-rm-add-recipe-dialog>
    `;if("timers"===this._view)return this._renderTimersView();if("planner"===this._view)return t`
      <ksh-rm-meal-planner ui-style=${i}
        .api=${this._api}
        .recipes=${this._recipes}
        .fromRecipe=${this._plannerFromRecipe}
        .settings=${e}
        @rm-open-recipe=${this._handleOpenRecipe}
        @rm-back-to-recipe=${this._handleBackToRecipe}
      ></ksh-rm-meal-planner>
    `;if("shopping"===this._view)return t`
      <ksh-rm-shopping-view ui-style=${i}
        .hass=${this.hass}
        .slmAvailable=${this._slmAvailable}
        .shoppingLists=${this._shoppingLists}
        .api=${this._api}
        .localItems=${this._localShoppingItems}
        .settings=${this._settings}
        @rm-shopping-local-update=${this._handleShoppingLocalUpdate}
      ></ksh-rm-shopping-view>
    `;if(this._loading)return t`
      <div class="rm-loading"><ha-circular-progress active size="large"></ha-circular-progress></div>
    `;if(this._error)return t`
      <div class="rm-error">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <p>${this._error}</p>
        <button class="text-btn" @click=${this._init.bind(this)}>${n("Retry")}</button>
      </div>
    `;const r=("detail"===this._view||this._closingDetail)&&this._selectedRecipe;return t`
      <div class="rm-slide-track ${"detail"===this._view?"show-detail":""}"
        @transitionend=${this._onDetailTransitionEnd}>
        <div class="rm-slide-pane">
          <ksh-rm-recipe-grid
            .recipes=${this._filteredRecipes}
            .allRecipes=${this._recipes}
            .tags=${this._tags}
            .searchQuery=${this._searchQuery}
            .activeTag=${this._activeTag}
            .columns=${e.columns}
            .viewMode=${e.recipeView}
            .hubMode=${this.hubMode}
            .showFavourites=${e.showFavourites}
            .hideSidebar=${this._wide}
            .scrollPos=${this._gridScrollPos}
            .recentRecipes=${this._recentRecipes}
            .recentCount=${e.recentCount??12}
            .filterPreset=${this._gridFilterPreset}
            .uiStyle=${this._ui}
            .weekPlan=${this._weekPlan}
            .showPlanner=${e.showPlanner}
            @rm-open-planner=${()=>{this._plannerFromRecipe=null,this._navDirection="forward",this._view="planner",this._selectedRecipe=null}}
            @rm-search=${this._handleSearch}
            @rm-tag-filter=${this._handleTagFilter}
            @rm-open-recipe=${this._handleOpenRecipe}
            @rm-toggle-favourite=${this._handleToggleFavourite}
          ></ksh-rm-recipe-grid>
        </div>
        <div class="rm-slide-pane">
          ${r?t`
            <ksh-rm-recipe-detail ui-style=${i}
              .recipe=${this._selectedRecipe}
              .api=${this._api}
              .settings=${e}
              .wide=${this._wide}
              .shoppingLists=${this._shoppingLists}
              .slmAvailable=${this._slmAvailable}
              .hideShopping=${this.hubMode&&!this._slmAvailable}
              .allTags=${this._tags||[]}
              .allCourses=${[...new Set(this._recipes.flatMap(e=>e.courses||[]))].sort()}
              .allCategories=${[...new Set(this._recipes.flatMap(e=>e.categories||[]))].sort()}
              .allCollections=${[...new Set(this._recipes.flatMap(e=>e.collections||[]))].sort()}
              @rm-back=${this._handleBack}
              @rm-toggle-favourite=${this._handleToggleFavourite}
              @rm-delete-recipe=${this._handleDeleteRecipe}
              @rm-update-recipe=${this._handleUpdateRecipe}
              @rm-add-to-shopping=${this._handleAddToShopping}
              @rm-start-timer=${this._handleStartTimer}
              @rm-show-planner=${this._handleShowPlanner}
              @rm-chip-nav=${this._handleChipNav}
            ></ksh-rm-recipe-detail>
          `:""}
        </div>
      </div>
    `}_renderTimerAddSection(){const e=this._customTimerInput.trim(),i=this._presetNameInput.trim()&&this._presetMinsInput.trim();return t`
        <!-- Add timer section -->
        <div class="timer-add-section">
          <div class="timer-add-header">
            <span class="timer-add-title">${n("Add Timer")}</span>
            <label class="timer-global-toggle ${this._globalMode?"active":""}" title="${n("Sync timer across all devices via Home Assistant")}">
              <input type="checkbox" .checked=${this._globalMode}
                @change=${e=>{this._globalMode=e.target.checked}}
              />
              <ha-icon icon="mdi:earth"></ha-icon>
              ${n("Global")}
            </label>
          </div>

          <div class="timer-add-group">
            <div class="timer-add-group-label">${n("Quick start")}</div>
            <div class="timer-add-row">
              <input type="text" class="timer-input" placeholder="${n("Label (optional)")}"
                .value=${this._quickTimerLabel}
                @input=${e=>{this._quickTimerLabel=e.target.value}}
                @keydown=${t=>{"Enter"===t.key&&e&&(this._startTimer(Math.round(60*parseFloat(this._customTimerInput)),this._quickTimerLabel.trim()||null,null,this._globalMode),this._customTimerInput="",this._quickTimerLabel="")}}
              />
              <input type="number" class="timer-input timer-mins-input" placeholder="${n("min")}" min="0.5" step="0.5"
                .value=${this._customTimerInput}
                @input=${e=>{this._customTimerInput=e.target.value}}
                @keydown=${t=>{"Enter"===t.key&&e&&(this._startTimer(Math.round(60*parseFloat(this._customTimerInput)),this._quickTimerLabel.trim()||null,null,this._globalMode),this._customTimerInput="",this._quickTimerLabel="")}}
              />
              <button class="action-btn primary" ?disabled=${!e}
                @click=${()=>{this._startTimer(Math.round(60*parseFloat(this._customTimerInput)),this._quickTimerLabel.trim()||null,null,this._globalMode),this._customTimerInput="",this._quickTimerLabel=""}}>
                <ha-icon icon="mdi:play" style="--mdc-icon-size:14px"></ha-icon> ${n("Start")}
              </button>
            </div>
          </div>

          <div class="timer-add-group">
            <div class="timer-add-group-label">${n("Save preset")}</div>
            <div class="timer-add-row">
              <input type="text" class="timer-input" placeholder="${n("Preset name")}"
                .value=${this._presetNameInput}
                @input=${e=>{this._presetNameInput=e.target.value}}
                @keydown=${e=>{"Enter"===e.key&&this._addPresetTimer()}}
              />
              <input type="number" class="timer-input timer-mins-input" placeholder="${n("min")}" min="0.5" step="0.5"
                .value=${this._presetMinsInput}
                @input=${e=>{this._presetMinsInput=e.target.value}}
                @keydown=${e=>{"Enter"===e.key&&this._addPresetTimer()}}
              />
              <button class="action-btn" ?disabled=${!i} @click=${this._addPresetTimer}>${n("+ Preset")}</button>
            </div>
          </div>
        </div>
    `}_renderTimersView(){if("classic"!==this._ui)return this._renderTimersViewStyled();this._customTimerInput.trim(),this._presetNameInput.trim()&&this._presetMinsInput.trim();const e=this._timers.filter(e=>!e.presetId),i=263.9;return t`
      <div class="timers-view">

        <!-- Active timers (non-preset): horizontal wrap of square arc tiles -->
        ${e.length?t`
          <div class="timer-list">
            ${e.map(e=>{const r=e.remaining<60?"#f59e0b":"var(--rm-accent)",a=i*(1-e.remaining/e.total);return t`
                <div class="timer-card">
                  <button class="preset-remove" @click=${()=>this._stopTimer(e.id)} title="${n("Remove")}">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                  ${e.global?t`<ha-icon class="timer-global-badge" icon="mdi:earth" title="${n("Global timer")}"></ha-icon>`:""}
                  <span class="timer-card-name">${e.label}</span>
                  <div class="preset-arc-wrap">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rm-border)" stroke-width="6"/>
                      <circle cx="50" cy="50" r="42" fill="none"
                        stroke="${r}" stroke-width="6" stroke-linecap="round"
                        stroke-dasharray="${i}" stroke-dashoffset="${a}"
                        transform="rotate(-90 50 50)"
                        style="transition: stroke-dashoffset 0.8s linear, stroke 0.3s;"/>
                    </svg>
                    <div class="preset-arc-center">
                      <span class="preset-arc-time">${Se(e.remaining)}</span>
                    </div>
                  </div>
                  <div class="preset-arc-btns">
                    <button class="timer-ctrl-btn" @click=${()=>this._pauseTimer(e.id)} title="${e.running?n("Pause"):n("Resume")}">
                      <ha-icon icon="${e.running?"mdi:pause":"mdi:play"}"></ha-icon>
                    </button>
                    <button class="timer-ctrl-btn danger" @click=${()=>this._stopTimer(e.id)} title="${n("Stop")}">
                      <ha-icon icon="mdi:stop"></ha-icon>
                    </button>
                  </div>
                </div>
              `})}
          </div>
        `:t`
          <div class="timer-empty">
            <ha-icon icon="mdi:timer-off-outline"></ha-icon>
            <p>${n("No active timers.")}</p>
            <p class="timer-empty-hint">${n("Tap a highlighted time in a recipe's directions to start one.")}</p>
          </div>
        `}

        <!-- Spacer pushes add+presets to bottom -->
        <div style="flex:1"></div>

        ${this._renderTimerAddSection()}

        <!-- Preset timers grid (bottom) -->
        ${this._timerPresets.length?t`
          <div class="timer-presets-grid">
            ${this._timerPresets.map(e=>{const r=this._timers.find(t=>t.presetId===e.id),a=r&&r.running,s=r&&r.alarming,o=r?r.remaining:e.seconds,c=r?r.total:e.seconds,l=s?"var(--error-color, #cf6679)":o<60&&r?"#f59e0b":"var(--rm-accent)",d=s?0:r?i*(1-o/c):i;return t`
                <div class="timer-preset-card ${s?"alarming":""}">
                  <button class="preset-remove" @click=${()=>{r&&this._stopTimer(r.id),this._removePreset(e.id)}} title="${n("Remove")}">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                  <span class="preset-arc-name">${e.name}</span>
                  <div class="preset-arc-wrap">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--rm-border)" stroke-width="7"/>
                      <circle cx="50" cy="50" r="44" fill="none"
                        stroke="${l}" stroke-width="7" stroke-linecap="round"
                        stroke-dasharray="${i}" stroke-dashoffset="${d}"
                        transform="rotate(-90 50 50)"
                        style="transition: stroke-dashoffset 0.8s linear, stroke 0.3s;"/>
                    </svg>
                    <div class="preset-arc-center">
                      ${s?t`
                        <span class="preset-arc-time" style="color:var(--error-color,#cf6679)">${n("Done!")}</span>
                      `:t`
                        <span class="preset-arc-time">${Se(o)}</span>
                      `}
                    </div>
                  </div>
                  <div class="preset-arc-btns">
                    ${s?t`
                      <button class="preset-arc-btn" @click=${()=>this._addTimeToTimer(r.id,30)}>${n("+30s")}</button>
                      <button class="preset-arc-btn" @click=${()=>this._addTimeToTimer(r.id,60)}>${n("+1m")}</button>
                      <button class="preset-arc-btn" @click=${()=>this._addTimeToTimer(r.id,300)}>${n("+5m")}</button>
                      <button class="preset-arc-btn stop" @click=${()=>this._stopTimer(r.id)}>${n("Stop")}</button>
                    `:a?t`
                      <button class="preset-arc-btn" @click=${()=>this._addTimeToTimer(r.id,30)}>${n("+30s")}</button>
                      <button class="preset-arc-btn" @click=${()=>this._addTimeToTimer(r.id,60)}>${n("+1m")}</button>
                      <button class="preset-arc-btn" @click=${()=>this._pauseTimer(r.id)}>
                        <ha-icon icon="mdi:pause" style="--mdc-icon-size:12px;vertical-align:middle"></ha-icon>
                      </button>
                      <button class="preset-arc-btn stop" @click=${()=>this._stopTimer(r.id)}>${n("Stop")}</button>
                    `:r?t`
                      <button class="preset-arc-btn" @click=${()=>this._pauseTimer(r.id)}>${n("Resume")}</button>
                      <button class="preset-arc-btn stop" @click=${()=>this._stopTimer(r.id)}>${n("Stop")}</button>
                    `:t`
                      <button class="preset-arc-btn play" @click=${()=>this._startTimer(e.seconds,e.name,e.id)}>
                        <ha-icon icon="mdi:play" style="--mdc-icon-size:14px;vertical-align:middle"></ha-icon> ${n("Start")}
                      </button>
                    `}
                  </div>
                </div>
              `})}
          </div>
        `:""}
      </div>
    `}_hms(e){if(!e)return 0;const t=String(e).split(":").map(e=>parseInt(e,10)||0);return 3===t.length?3600*t[0]+60*t[1]+t[2]:2===t.length?60*t[0]+t[1]:0}get _vpeTimers(){if(!1===this._settings.vpeTimers||!this.hass?.states)return[];const e=(this._settings.vpePrefix||"sensor.vpe_timer").trim(),t=[];for(const[i,r]of Object.entries(this.hass.states)){if(!i.startsWith(e))continue;const a=r.state;if(!["active","paused","finished"].includes(a))continue;const s=r.attributes||{},o=this._hms(s.duration);let c=this._hms(s.remaining);if("active"===a){const e=Date.parse(r.last_updated)||Date.now(),t=s.finishes_at?Date.parse(s.finishes_at):e+1e3*c;c=Math.max(0,Math.round((t-Date.now())/1e3))}"finished"===a&&(c=0);const l=s.timer_id??s.timerId??s.id??null;t.push({id:`vpe-${i}`,entityId:i,label:s.timer_name&&String(s.timer_name).trim()||s.display_name&&String(s.display_name).trim()||n("Voice timer"),sub:s.display_name&&s.timer_name?String(s.display_name).trim():n("Voice PE"),total:o||c||1,remaining:c,running:"active"===a,finished:"finished"===a,vpeId:l?String(l).trim():null,control:s.control_entity?String(s.control_entity).trim():null,source:"voice_pe"})}return t.sort((e,t)=>e.remaining-t.remaining)}get _timerCount(){return"classic"===this._ui?this._timers.length:this._timers.length+this._vpeTimers.filter(e=>!e.finished).length}async _vpeCommand(e,t){if(!e.control||!e.vpeId||!this.hass)return;const i=e.control.split(".")[0];if("text"===i||"input_text"===i)try{await this.hass.callService(i,"set_value",{entity_id:e.control,value:`${t}:${e.vpeId}`})}catch{}}_renderTimersViewStyled(){const e=this._vpeTimers,i=this._timers.map(e=>({id:e.id,label:e.label,total:e.total||e.remaining||1,remaining:e.remaining,running:e.running,finished:!!e.alarming,global:!!e.global,source:"local"})),r=[...e,...i];return t`
      <div class="timers-view tm-view">
        <div class="tm-quick" role="group" aria-label="${n("Quick timers")}">
          ${[5,10,15,30].map(e=>t`
            <button class="tm-chip" @click=${()=>this._startTimer(60*e,null,null,this._globalMode)}>
              <ha-icon icon="mdi:plus"></ha-icon>${n(c`${e} min`)}
            </button>`)}
          ${this._timerPresets.map(e=>t`
            <span class="tm-chip preset">
              <button class="tm-chip-main" @click=${()=>this._startTimer(e.seconds,e.name,e.id,this._globalMode)}>${e.name} · ${Math.round(e.seconds/60)} ${n("min")}</button>
              <button class="tm-chip-x" @click=${()=>this._removePreset(e.id)} aria-label="${n(c`Remove preset ${e.name}`)}"><ha-icon icon="mdi:close"></ha-icon></button>
            </span>`)}
          <label class="tm-chip toggle ${this._globalMode?"on":""}" title="${n("Sync timer across all devices via Home Assistant")}">
            <input type="checkbox" .checked=${this._globalMode} @change=${e=>{this._globalMode=e.target.checked}} />
            <ha-icon icon="mdi:earth"></ha-icon>${n("Global")}
          </label>
        </div>

        ${r.length?t`<div class="tm-list">${r.map(e=>{const i="voice_pe"===e.source,r=!i||!(!e.control||!e.vpeId);return t`
        <div class="tm-card ${e.finished?"done":""}">
          <div class="tm-row">
            <div class="tm-mid">
              <div class="tm-name">
                ${i?t`<ha-icon icon="mdi:microphone-outline"></ha-icon>`:e.global?t`<ha-icon icon="mdi:earth"></ha-icon>`:""}
                <span>${e.label}</span>
              </div>
              <div class="tm-clock">${e.finished?n("Ready"):Se(e.remaining)}</div>
              ${i?t`<div class="tm-sub">${e.sub}</div>`:""}
            </div>
            ${e.finished?t`
              ${i?"":t`<button class="tm-btn text" @click=${()=>this._addTimeToTimer(e.id,60)} aria-label="${n("Add one minute")}">+1m</button>`}
              ${r?t`<button class="tm-btn" @click=${()=>i?this._vpeCommand(e,"cancel"):this._stopTimer(e.id)} aria-label="${n("Dismiss")}"><ha-icon icon="mdi:check"></ha-icon></button>`:""}
            `:t`
              ${r?t`
                <button class="tm-btn" @click=${()=>i?this._vpeCommand(e,e.running?"pause":"resume"):this._pauseTimer(e.id)}
                  aria-label="${e.running?n("Pause"):n("Resume")}"><ha-icon icon="${e.running?"mdi:pause":"mdi:play"}"></ha-icon></button>
                <button class="tm-btn" @click=${()=>i?this._vpeCommand(e,"cancel"):this._stopTimer(e.id)}
                  aria-label="${n("Delete timer")}"><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
              `:""}
            `}
          </div>
          <div class="tm-bar"><i style="width:${e.finished?100:(e=>Math.max(0,Math.min(100,Math.round(100*(1-e.remaining/(e.total||1))))))(e)}%"></i></div>
        </div>
      `})}</div>`:t`
          <div class="timer-empty">
            <ha-icon icon="mdi:timer-off-outline"></ha-icon>
            <p>${n("No timers running")}</p>
            <p class="timer-empty-hint">${n("Start one from a recipe step, a quick timer above, or by voice.")}</p>
          </div>
        `}

        ${this._renderTimerAddSection()}
      </div>
    `}_renderTimerAlarm(){const e=this._timerAlarm;return e?t`
      <div class="alarm-overlay">
        <div class="alarm-bubble">
          <ha-icon icon="mdi:alarm" class="alarm-icon"></ha-icon>
          <div class="alarm-label">${e.label}</div>
          <div class="alarm-sub">${n("Timer complete!")}</div>
          <div class="alarm-btns">
            <button class="alarm-btn" @click=${()=>this._addTimeToTimer(e.id,30)}>${n("+30s")}</button>
            <button class="alarm-btn" @click=${()=>this._addTimeToTimer(e.id,60)}>${n("+1 min")}</button>
            <button class="alarm-btn" @click=${()=>this._addTimeToTimer(e.id,300)}>${n("+5 min")}</button>
            <button class="alarm-btn" @click=${()=>this._addTimeToTimer(e.id,600)}>${n("+10 min")}</button>
            <div class="alarm-custom-row">
              <input type="number" class="alarm-custom-input" placeholder="${n("min")}" min="1"
                .value=${this._alarmAddInput}
                @input=${e=>{this._alarmAddInput=e.target.value}}
                @keydown=${t=>{if("Enter"===t.key&&this._alarmAddInput){const t=parseInt(this._alarmAddInput);t>0&&this._addTimeToTimer(e.id,60*t),this._alarmAddInput=""}}}
              />
              <button class="alarm-btn accent" ?disabled=${!this._alarmAddInput}
                @click=${()=>{const t=parseInt(this._alarmAddInput);t>0&&this._addTimeToTimer(e.id,60*t),this._alarmAddInput=""}}>${n("+min")}</button>
            </div>
            <button class="alarm-btn stop" @click=${this._dismissAlarm}>${n("Stop")}</button>
          </div>
        </div>
      </div>
    `:""}_renderBottomNav(){const e=this._view,i=(i,r,a,s)=>t`
      <button class="rm-bn-btn ${e===a?"active":""}"
        @click=${s||(()=>{this._navDirection="forward",this._view=a,this._selectedRecipe=null})}
        title="${r}">
        <ha-icon icon="${i}"></ha-icon>
        <span>${r}</span>
      </button>
    `;return t`
      <nav class="rm-bottom-nav">
        ${i("mdi:home",n("Home"),"grid",()=>{this._navDirection="back",this._view="grid",this._selectedRecipe=null})}
        ${i("mdi:cart-outline",n("Shopping"),"shopping")}
        ${"classic"===this._ui?t`
        <button class="rm-bn-btn rm-bn-add"
          @click=${()=>{this._navDirection="forward",this._view="add"}}
          title="${n("New Recipe")}">
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>`:""}
        ${i("mdi:calendar-week",n("Planner"),"planner",()=>{this._plannerFromRecipe=null,this._navDirection="forward",this._view="planner",this._selectedRecipe=null})}
        <button class="rm-bn-btn ${"timers"===e?"active":""}"
          @click=${()=>{this._navDirection="forward",this._timersPrevView=this._view,this._view="timers"}}
          title="${n("Timers")}">
          <ha-icon icon="mdi:timer-outline"></ha-icon>
          <span>${n("Timers")}</span>
          ${this._timerCount?t`<span class="rm-bn-badge">${this._timerCount}</span>`:""}
        </button>
      </nav>
    `}_renderMobileMenu(){return t`
      <div class="rm-mobile-overlay" @click=${()=>{this._mobileMenuOpen=!1}}>
        <nav class="rm-mobile-menu" @click=${e=>e.stopPropagation()}>
          <div class="rm-mm-header">
            <ha-icon icon="mdi:chef-hat" class="rm-mm-logo"></ha-icon>
            <span class="rm-mm-title">${n("Recipes")}</span>
            <button class="icon-btn" @click=${()=>{this._mobileMenuOpen=!1}}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="rm-mm-items">
            <button class="rm-mm-item" @click=${()=>{this._view="settings",this._mobileMenuOpen=!1}}>
              <ha-icon icon="mdi:cog-outline"></ha-icon>
              <span>${n("Settings")}</span>
            </button>
            <button class="rm-mm-item" disabled>
              <ha-icon icon="mdi:help-circle-outline"></ha-icon>
              <span>${n("Help")}</span>
              <span class="rm-mm-soon">${n("Soon")}</span>
            </button>
          </div>
        </nav>
      </div>
    `}render(){const e=this._wide;return t`
      <ha-card class="rm-card ${e?"rm-wide":""} ${this._overlayOpen?"rm-overlay-open":""}"
        @rm-overlay=${e=>{this._overlayOpen=!!e.detail?.open}}>
        ${e&&!this.hubMode?this._renderSidebar():""}
        <div class="rm-main">
          ${this._renderHeader()}
          <div class="rm-body" data-nav="${this._navDirection}">${this._renderBody()}</div>
          ${e||this.hubMode?"":this._renderBottomNav()}
        </div>

        ${e||"grid"!==this._view||"fresh"!==this._ui?"":t`
          <button class="rm-fab" @click=${()=>{this._navDirection="forward",this._view="add"}} title="${n("New Recipe")}" aria-label="${n("New Recipe")}">
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        `}

        ${e||this.hubMode||!this._mobileMenuOpen?"":this._renderMobileMenu()}

        <!-- Timer alarm modal -->
        ${this._timerAlarm?this._renderTimerAlarm():""}
      </ha-card>
    `}static styles=i`
    :host {
      display: block;
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      max-height: -webkit-fill-available;
      --rm-bg-main:        #fafbfc;
      --rm-bg-surface:     #ffffff;
      --rm-bg-elevated:    #ffffff;
      --rm-text:           #424242;
      --rm-text-secondary: #757575;
      --rm-text-muted:     #9e9e9e;
      --rm-accent:         #9fa8da;
      --rm-accent-soft:    rgba(159,168,218,0.15);
      --rm-border:         #e8eaf6;
      --rm-shadow:         0 2px 6px rgba(0,0,0,0.08);
      --rm-radius:         12px;
      --rm-radius-sm:      8px;
      --rm-radius-card:    12px;
      --rm-accent-text:    var(--rm-accent);
      --rm-ink:            #ffffff;
      --rm-line:           var(--rm-border);
      --rm-warn:           #f5a623;
      --rm-danger:         var(--error-color, #cf6679);
      --rm-shadow-float:   0 4px 12px rgba(0,0,0,0.2);
      --rm-font-size-base: 15px;
      --rm-grid-columns:   repeat(3, minmax(0, 1fr));
      font-size: var(--rm-font-size-base);
    }

    ha-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
      overflow: hidden;
      position: relative;
      background: var(--rm-bg-surface);
    }
    ha-card.rm-card {
      background: var(--rm-bg-main);
      border-radius: 0;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      height: 100%;
      margin: 0;
      color: var(--rm-text);
      position: relative;
    }

    /* ── Sidebar ─────────────────────────────── */

    .rm-sidebar {
      width: 200px;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      background: var(--rm-bg-surface);
      border-right: 1px solid var(--rm-border);
      overflow: hidden;
      transition: width 0.2s ease, min-width 0.2s ease;
    }

    .rm-sidebar.collapsed {
      width: 56px;
      min-width: 56px;
    }

    ha-card:not(.rm-wide) .rm-sidebar { display: none; }

    .sb-top {
      padding: 12px 8px 8px;
      flex-shrink: 0;
    }

    .sb-logo-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2px 8px;
    }

    .sb-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 15px;
      color: var(--rm-accent);
      overflow: hidden;
    }
    .sb-logo ha-icon { --mdc-icon-size: 22px; flex-shrink: 0; }

    .sb-collapse-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--rm-text-muted);
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s;
    }
    .sb-collapse-btn:hover { background: var(--rm-accent-soft); color: var(--rm-text); }
    .sb-collapse-btn ha-icon { --mdc-icon-size: 20px; }

    .sb-search {
      display: flex;
      align-items: center;
      background: var(--rm-bg-main);
      border-radius: 8px;
      padding: 0 8px;
      gap: 6px;
      margin-bottom: 8px;
      border: 1px solid var(--rm-border);
    }
    .sb-search-icon { --mdc-icon-size: 16px; color: var(--rm-text-muted); flex-shrink: 0; }
    .sb-search-input {
      flex: 1; min-width: 0; width: 100%; background: none; border: none; outline: none;
      color: var(--rm-text); font-size: 13px; padding: 7px 0;
    }
    .sb-search-input::placeholder { color: var(--rm-text-muted); }
    .sb-search-clear {
      flex: none; width: 28px; height: 28px; margin-right: -6px;
      background: var(--rm-bg-elevated, rgba(128,128,128,0.15)); border: none; border-radius: 50%; cursor: pointer;
      color: var(--rm-text); padding: 0; display: flex; align-items: center; justify-content: center;
    }
    .sb-search-clear:hover { background: var(--rm-accent-soft); color: var(--rm-accent-text, var(--rm-accent)); }
    .sb-search-clear ha-icon { --mdc-icon-size: 16px; }

    .sb-new-btn {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 8px 10px;
      background: var(--rm-accent); color: var(--rm-ink, #fff);
      border: none; border-radius: 8px;
      font-size: 13px; font-weight: 600; cursor: pointer;
      transition: opacity 0.15s;
    }
    .sb-new-btn:hover { opacity: 0.88; }
    .sb-new-btn ha-icon { --mdc-icon-size: 18px; }

    .sb-icon-only-btn {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; margin: 0 auto;
      background: var(--rm-accent); color: var(--rm-ink, #fff);
      border: none; border-radius: 8px;
      cursor: pointer; transition: opacity 0.15s;
    }
    .sb-icon-only-btn:hover { opacity: 0.88; }
    .sb-icon-only-btn ha-icon { --mdc-icon-size: 20px; }

    .sb-nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 6px 4px;
      scrollbar-width: none;
    }
    .sb-nav::-webkit-scrollbar { display: none; }

    .sb-bottom {
      padding: 4px 6px 12px;
      border-top: 1px solid var(--rm-border);
    }

    .sb-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 9px 10px;
      background: none; border: none; border-radius: 8px;
      font-size: 14px; color: var(--rm-text-secondary);
      cursor: pointer; text-align: left;
      transition: background 0.12s, color 0.12s;
      position: relative;
    }
    .rm-sidebar.collapsed .sb-item {
      justify-content: center;
      padding: 10px 6px;
    }
    .sb-item ha-icon { --mdc-icon-size: 20px; flex-shrink: 0; }
    .sb-item:hover:not(:disabled) { background: var(--rm-accent-soft); color: var(--rm-text); }
    .sb-item.active { background: var(--rm-accent-soft); color: var(--rm-accent); font-weight: 600; }
    .sb-item.placeholder { opacity: 0.4; cursor: default; }

    .sb-timer-badge {
      margin-left: auto;
      background: var(--rm-accent);
      color: var(--rm-ink, #fff);
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      min-width: 18px;
      text-align: center;
    }
    .rm-sidebar.collapsed .sb-timer-badge {
      position: absolute;
      top: 4px; right: 4px;
      margin-left: 0;
      font-size: 9px;
      padding: 1px 4px;
    }

    /* ── Main content ────────────────────────── */

    .rm-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .rm-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      border-bottom: 1px solid var(--rm-border);
      background: var(--rm-bg-surface);
      flex-shrink: 0;
      gap: 8px;
    }

    .rm-header-left, .rm-header-right {
      display: flex; align-items: center; gap: 6px;
      min-width: 0;
    }
    .rm-header-left { flex: 1; min-width: 0; }
    .rm-header-right { flex-shrink: 0; }

    .rm-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 17px; font-weight: 600; color: var(--rm-text);
      overflow: hidden; white-space: nowrap; flex: 1; min-width: 0;
    }
    .rm-title ha-icon { --mdc-icon-size: 22px; color: var(--rm-accent); flex-shrink: 0; }
    .rm-title span { overflow: hidden; text-overflow: ellipsis; }

    /* Star rating in header */
    .header-stars {
      display: flex;
      gap: 1px;
      align-items: center;
    }
    .hdr-star {
      font-size: 18px;
      color: var(--rm-border, rgba(0,0,0,0.2));
      line-height: 1;
      cursor: pointer;
      transition: color 0.1s, transform 0.1s;
      -webkit-text-stroke: 1px rgba(200,150,0,0.3);
    }
    .hdr-star:hover { transform: scale(1.2); color: #f5a623; }
    .hdr-star.filled { color: #f5a623; -webkit-text-stroke: 1px #c47f0a; }

    /* Timer pills */
    .timer-pills {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 2px;
    }
    .timer-pill {
      display: flex;
      align-items: center;
      gap: 3px;
      background: var(--rm-accent-soft);
      color: var(--rm-accent);
      border-radius: 10px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .timer-pill.paused { opacity: 0.6; }
    .timer-pill ha-icon { --mdc-icon-size: 12px; }
    .timer-more {
      font-size: 11px;
      color: var(--rm-text-secondary);
      padding: 0 4px;
    }

    .rm-body {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .icon-btn {
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-secondary); width: 34px; height: 34px;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      transition: background 0.15s, color 0.15s; padding: 0; flex-shrink: 0;
    }
    .icon-btn:hover { background: var(--rm-border); color: var(--rm-text); }
    .icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .icon-btn:disabled:hover { background: none; }
    .wake-toggle-btn.active { background: var(--rm-accent-soft); color: var(--rm-accent); }

    .text-btn {
      background: var(--rm-accent); color: var(--rm-ink, #fff); border: none;
      border-radius: var(--rm-radius-sm); padding: 8px 16px;
      cursor: pointer; font-size: 14px; font-weight: 500;
    }

    .rm-loading {
      display: flex; justify-content: center; align-items: center; height: 200px;
    }

    .rm-error {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 40px 20px; gap: 12px;
      color: var(--rm-text-secondary); text-align: center;
    }
    .rm-error ha-icon { --mdc-icon-size: 48px; color: var(--error-color, #cf6679); }
    .rm-error p { margin: 0; font-size: 14px; }

    /* ── Timers view ─────────────────────────── */

    .timers-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      padding: 12px 16px 16px;
      gap: 12px;
    }

    .timer-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 40px 0 24px;
      color: var(--rm-text-secondary);
      text-align: center;
      font-size: 14px;
    }
    .timer-empty ha-icon { --mdc-icon-size: 48px; opacity: 0.35; }
    .timer-empty p { margin: 0; }
    .timer-empty-hint { font-size: 12px !important; color: var(--rm-text-muted) !important; }

    /* Active timer list: horizontal wrap of square arc tiles */
    .timer-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .timer-card {
      position: relative;
      width: 180px; height: 180px;
      background: var(--rm-bg-elevated);
      border-radius: 16px;
      border: 1px solid var(--rm-border);
      padding: 10px 8px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      box-sizing: border-box;
    }
    .timer-card-name {
      font-size: 11px; font-weight: 600; color: var(--rm-text);
      text-align: center; width: 100%;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .timer-ctrl-btn {
      background: none;
      border: 1px solid var(--rm-border);
      border-radius: 50%;
      width: 28px; height: 28px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--rm-text-secondary);
      padding: 0; transition: background 0.15s, color 0.15s;
    }
    .timer-ctrl-btn ha-icon { --mdc-icon-size: 14px; }
    .timer-ctrl-btn:hover { background: var(--rm-accent-soft); color: var(--rm-accent); }
    .timer-ctrl-btn.danger:hover { background: rgba(207,102,121,0.12); color: var(--error-color, #cf6679); border-color: var(--error-color, #cf6679); }

    /* Preset timer grid: square arc tiles */
    .timer-presets-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .timer-preset-card {
      position: relative;
      width: 160px; height: 160px;
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 16px;
      padding: 8px 8px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      box-sizing: border-box;
    }
    .timer-preset-card.alarming {
      border-color: var(--error-color, #cf6679);
      animation: alarm-pulse-border 0.8s ease-in-out infinite alternate;
    }
    @keyframes alarm-pulse-border {
      from { box-shadow: 0 0 0 0 rgba(207,102,121,0); }
      to   { box-shadow: 0 0 0 6px rgba(207,102,121,0.3); }
    }
    /* Arc wrap fills available vertical space in the square tile */
    .preset-arc-wrap {
      position: relative;
      flex: 1;
      width: 100%;
      min-height: 0;
    }
    .preset-arc-wrap svg {
      width: 100%; height: 100%;
      display: block;
    }
    .preset-arc-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .preset-arc-time {
      font-size: 17px; font-weight: 700;
      color: var(--rm-text); line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .preset-arc-name {
      font-size: 11px; font-weight: 600; color: var(--rm-text);
      text-align: center; width: 100%;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .preset-arc-btns {
      display: flex; gap: 4px; flex-wrap: wrap; justify-content: center;
    }
    .preset-arc-btn {
      background: var(--rm-bg); border: 1px solid var(--rm-border);
      border-radius: 10px; padding: 2px 6px; font-size: 10px;
      color: var(--rm-text-secondary); cursor: pointer; transition: all 0.15s;
    }
    .preset-arc-btn:hover { background: var(--rm-accent-soft); color: var(--rm-accent); border-color: var(--rm-accent); }
    .preset-arc-btn.stop { color: var(--error-color, #cf6679); border-color: var(--error-color, #cf6679); }
    .preset-arc-btn.stop:hover { background: rgba(207,102,121,0.12); }
    .preset-arc-btn.play {
      background: var(--rm-accent); color: var(--rm-ink, #fff); border-color: var(--rm-accent);
      padding: 3px 12px; font-size: 11px; border-radius: 12px;
    }
    .preset-arc-btn.play:hover { opacity: 0.85; }
    .preset-remove {
      position: absolute; top: 4px; right: 4px;
      background: none; border: none; cursor: pointer;
      color: var(--rm-text-muted); opacity: 0; padding: 2px;
      border-radius: 50%; transition: opacity 0.15s; z-index: 1;
    }
    .timer-preset-card:hover .preset-remove,
    .timer-card:hover .preset-remove { opacity: 1; }
    .preset-remove ha-icon { --mdc-icon-size: 13px; }

    /* Timer add section */
    .timer-add-section {
      border-top: 1px solid var(--rm-border);
      padding-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .timer-add-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .timer-add-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--rm-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .timer-global-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid var(--rm-border);
      cursor: pointer;
      font-size: 12px;
      color: var(--rm-text-muted);
      transition: all 0.15s;
      user-select: none;
    }
    .timer-global-toggle input { display: none; }
    .timer-global-toggle ha-icon { --mdc-icon-size: 14px; }
    .timer-global-toggle.active {
      border-color: var(--rm-accent);
      color: var(--rm-accent);
      background: var(--rm-accent-soft);
    }
    .timer-add-group { display: flex; flex-direction: column; gap: 5px; }
    .timer-add-group-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--rm-text-muted);
      opacity: 0.7;
    }
    .timer-add-row { display: flex; gap: 6px; align-items: center; }
    .timer-input {
      flex: 1;
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 8px;
      color: var(--rm-text);
      padding: 6px 9px;
      font-size: 13px;
      font-family: inherit;
      min-width: 0;
    }
    .timer-mins-input { max-width: 72px; flex: 0 0 72px; }
    .timer-input:focus { outline: none; border-color: var(--rm-accent); }
    .timer-global-badge {
      position: absolute;
      top: 4px;
      right: 22px;
      --mdc-icon-size: 11px;
      color: var(--rm-accent);
      opacity: 0.75;
    }

    .action-btn {
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 8px;
      color: var(--rm-text);
      padding: 8px 14px;
      cursor: pointer;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .action-btn.primary {
      background: var(--rm-accent);
      border-color: var(--rm-accent);
      color: var(--rm-ink, #fff);
    }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Timer alarm bubble ──────────────────── */

    .alarm-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alarm-bubble {
      background: var(--rm-bg-surface);
      border-radius: 20px;
      padding: 28px 24px;
      text-align: center;
      max-width: 300px;
      width: calc(100% - 48px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .alarm-icon {
      --mdc-icon-size: 52px;
      color: var(--rm-accent);
      animation: alarm-pulse 0.8s ease-in-out infinite alternate;
    }

    @keyframes alarm-pulse {
      from { transform: scale(1); opacity: 1; }
      to   { transform: scale(1.15); opacity: 0.8; }
    }

    .alarm-label {
      font-size: 18px;
      font-weight: 700;
      color: var(--rm-text);
    }

    .alarm-sub {
      font-size: 13px;
      color: var(--rm-text-secondary);
      margin-bottom: 8px;
    }

    .alarm-btns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      width: 100%;
    }

    .alarm-btn {
      background: var(--rm-bg-elevated);
      border: 1px solid var(--rm-border);
      border-radius: 10px;
      color: var(--rm-text);
      padding: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s;
    }
    .alarm-btn:hover { background: var(--rm-accent-soft); }
    .alarm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .alarm-btn.accent { background: var(--rm-accent); color: var(--rm-ink, #fff); border-color: var(--rm-accent); }
    .alarm-btn.stop {
      background: var(--error-color, #cf6679);
      color: #fff;
      border-color: var(--error-color, #cf6679);
      grid-column: 1 / -1;
    }
    .alarm-btn.stop:hover { opacity: 0.85; }
    .alarm-custom-row {
      display: flex; gap: 6px; grid-column: 1 / -1;
    }
    .alarm-custom-input {
      flex: 1; background: var(--rm-bg-elevated); border: 1px solid var(--rm-border);
      border-radius: 8px; color: var(--rm-text); padding: 8px 10px;
      font-size: 13px; font-family: inherit;
    }
    .alarm-custom-input:focus { outline: none; border-color: var(--rm-accent); }

    /* ── View transitions ───────────────────────────────────── */

    /* Generic directional slide for full-screen views (settings, add, planner, etc.) */
    @keyframes rm-slide-forward {
      from { opacity: 0; transform: translateX(48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes rm-slide-back {
      from { opacity: 0; transform: translateX(-48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .rm-body[data-nav="forward"] > *:not(.rm-detail-overlay) { animation: rm-slide-forward 0.25s cubic-bezier(0.25,0.46,0.45,0.94); }
    .rm-body[data-nav="back"]    > *:not(.rm-detail-overlay) { animation: rm-slide-back    0.25s cubic-bezier(0.25,0.46,0.45,0.94); }

    /* Recipe detail — sliding track (grid left pane, detail right pane) */
    .rm-slide-track {
      display: flex;
      flex-direction: row;
      width: 200%;
      height: 100%;
      transform: translateX(0);
      transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform;
    }
    .rm-slide-track.show-detail {
      transform: translateX(-50%);
    }
    .rm-slide-pane {
      flex: 0 0 50%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .rm-slide-pane > * {
      flex: 1;
      min-height: 0;
    }

    /* ── Mobile bottom nav ───────────────── */

    .rm-bottom-nav {
      display: flex;
      justify-content: space-around;
      background: var(--rm-bg-surface);
      border-top: 1px solid var(--rm-border);
      padding: 6px 0;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
      z-index: 10;
      flex-shrink: 0;
    }

    .rm-bn-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--rm-text-muted);
      font-size: 10px;
      font-weight: 500;
      padding: 6px 4px;
      position: relative;
      transition: color 0.15s;
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }
    .rm-bn-btn ha-icon { --mdc-icon-size: 22px; }
    .rm-bn-btn.active { color: var(--rm-accent); }
    .rm-bn-btn:not(.rm-bn-add):hover { color: var(--rm-text); }

    .rm-bn-add {
      background: var(--rm-accent);
      color: var(--rm-ink, #fff) !important;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      flex: none;
      align-self: center;
      margin: 0 8px;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .rm-bn-add ha-icon { --mdc-icon-size: 26px; }

    .rm-bn-badge {
      position: absolute;
      top: 2px;
      right: calc(50% - 20px);
      background: var(--rm-accent);
      color: var(--rm-ink, #fff);
      border-radius: 8px;
      font-size: 9px;
      font-weight: 700;
      padding: 1px 4px;
      min-width: 14px;
      text-align: center;
    }

    /* ── Mobile slide-in menu ────────────── */

    .rm-mobile-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 100;
      display: flex;
      justify-content: flex-end;
    }

    .rm-mobile-menu {
      width: min(280px, 80%);
      height: 100%;
      background: var(--rm-bg-surface);
      border-left: 1px solid var(--rm-border);
      display: flex;
      flex-direction: column;
      animation: rm-menu-slide-in 0.22s ease;
      overflow: hidden;
    }

    @keyframes rm-menu-slide-in {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }

    .rm-mm-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 12px 14px 16px;
      border-bottom: 1px solid var(--rm-border);
      flex-shrink: 0;
    }
    .rm-mm-logo { color: var(--rm-accent); --mdc-icon-size: 22px; }
    .rm-mm-title { flex: 1; font-weight: 700; font-size: 15px; color: var(--rm-text); }

    .rm-mm-items { padding: 8px 0; flex: 1; overflow-y: auto; }

    .rm-mm-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--rm-text-secondary);
      font-size: 14px;
      text-align: left;
      transition: background 0.12s, color 0.12s;
      -webkit-tap-highlight-color: transparent;
    }
    .rm-mm-item ha-icon { --mdc-icon-size: 20px; flex-shrink: 0; }
    .rm-mm-item:hover:not(:disabled) { background: var(--rm-accent-soft); color: var(--rm-text); }
    .rm-mm-item:disabled { opacity: 0.4; cursor: default; }

    .rm-mm-soon {
      margin-left: auto;
      font-size: 10px;
      font-weight: 700;
      background: var(--rm-accent-soft);
      color: var(--rm-accent);
      border-radius: 6px;
      padding: 2px 6px;
    }


    /* ═══════════════════════════════════════════════════════════════
       Fresh + Compact interface styles (same language as Shopping List
       Manager). Classic keeps everything above untouched.
       Fresh: rounded cards, pill header, floating nav, + button.
       Compact: flat bars, rows, square buttons.
    ═══════════════════════════════════════════════════════════════ */

    :host([data-ui="fresh"]) ha-card.rm-card,
    :host([data-ui="compact"]) ha-card.rm-card { background: var(--rm-bg-main); }

    /* Header */
    :host([data-ui="fresh"]) .rm-header,
    :host([data-ui="compact"]) .rm-header {
      background: transparent;
      border-bottom: none;
      padding: 20px 20px 0;
      gap: 10px;
    }
    :host([data-ui="compact"]) .rm-header { padding: 20px 16px 0 20px; gap: 8px; }
    :host([data-ui="fresh"]) ha-card.rm-wide .rm-header,
    :host([data-ui="compact"]) ha-card.rm-wide .rm-header { padding: 28px 28px 0; }
    :host([data-ui="fresh"]) .rm-title.empty,
    :host([data-ui="compact"]) .rm-title.empty { display: none; }

    /* Fresh phone: title is a pill with an icon chip */
    :host([data-ui="fresh"]) ha-card:not(.rm-wide) .rm-title {
      height: 48px; padding: 0 16px 0 8px; gap: 10px; flex: 1;
      border-radius: 999px; border: 1px solid var(--rm-border);
      background: var(--rm-bg-surface); font-size: 15px; font-weight: 700;
    }
    :host([data-ui="fresh"]) ha-card:not(.rm-wide) .rm-title ha-icon {
      width: 32px; height: 32px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--rm-accent-soft); color: var(--rm-accent-text);
      --mdc-icon-size: 18px;
    }
    /* Compact phone + wide: plain bold title */
    :host([data-ui="compact"]) .rm-title ha-icon,
    :host([data-ui="fresh"]) ha-card.rm-wide .rm-title ha-icon { display: none; }
    :host([data-ui="compact"]) .rm-title { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
    :host([data-ui="fresh"]) ha-card.rm-wide .rm-title,
    :host([data-ui="compact"]) ha-card.rm-wide .rm-title {
      font-size: 30px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1;
    }

    /* Round header buttons */
    :host([data-ui="fresh"]) .icon-btn {
      width: 48px; height: 48px;
      border: 1px solid var(--rm-border); background: var(--rm-bg-surface); color: var(--rm-text);
    }
    :host([data-ui="compact"]) .icon-btn {
      width: 44px; height: 44px; border-radius: 14px;
      border: none; background: var(--rm-bg-elevated); color: var(--rm-text);
    }
    :host([data-ui="fresh"]) .icon-btn:hover,
    :host([data-ui="compact"]) .icon-btn:hover { background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([data-ui="fresh"]) .icon-btn.primary,
    :host([data-ui="compact"]) .icon-btn.primary { background: var(--rm-accent); border-color: var(--rm-accent); color: var(--rm-ink); }
    :host([data-ui="fresh"]) .wake-toggle-btn.active,
    :host([data-ui="compact"]) .wake-toggle-btn.active { background: var(--rm-accent-soft); color: var(--rm-accent-text); }
    :host([data-ui="fresh"]) .hdr-star.filled,
    :host([data-ui="compact"]) .hdr-star.filled { color: var(--rm-warn); -webkit-text-stroke: 0; }
    :host([data-ui="fresh"]) .hdr-star,
    :host([data-ui="compact"]) .hdr-star { -webkit-text-stroke: 0; color: var(--rm-border); }
    :host([data-ui="fresh"]) .timer-pill,
    :host([data-ui="compact"]) .timer-pill {
      background: var(--rm-accent-soft); color: var(--rm-accent-text); border-radius: 999px; padding: 6px 10px;
    }

    /* Sidebar */
    :host([data-ui="fresh"]) .rm-sidebar,
    :host([data-ui="compact"]) .rm-sidebar { width: 236px; min-width: 236px; }
    :host([data-ui="fresh"]) .rm-sidebar.collapsed,
    :host([data-ui="compact"]) .rm-sidebar.collapsed { width: 72px; min-width: 72px; }
    :host([data-ui="fresh"]) .sb-top,
    :host([data-ui="compact"]) .sb-top { padding: 20px 14px 8px; }
    :host([data-ui="fresh"]) .sb-search,
    :host([data-ui="compact"]) .sb-search { height: 44px; padding: 0 14px; border-radius: 999px; gap: 8px; }
    :host([data-ui="compact"]) .sb-search { border-radius: 12px; }
    :host([data-ui="fresh"]) .sb-search-input,
    :host([data-ui="compact"]) .sb-search-input { font-size: 14px; }
    :host([data-ui="fresh"]) .sb-new-btn,
    :host([data-ui="compact"]) .sb-new-btn {
      justify-content: center; min-height: 48px; border-radius: 999px;
      font-size: 15px; font-weight: 700; color: var(--rm-ink);
    }
    :host([data-ui="compact"]) .sb-new-btn { border-radius: 12px; }
    :host([data-ui="fresh"]) .sb-icon-only-btn { width: 48px; height: 48px; border-radius: 50%; color: var(--rm-ink); }
    :host([data-ui="compact"]) .sb-icon-only-btn { width: 48px; height: 48px; border-radius: 12px; color: var(--rm-ink); }
    :host([data-ui="fresh"]) .sb-nav,
    :host([data-ui="compact"]) .sb-nav { padding: 8px 14px 4px; }
    :host([data-ui="fresh"]) .sb-bottom,
    :host([data-ui="compact"]) .sb-bottom { padding: 8px 14px 16px; border-top: none; }
    :host([data-ui="fresh"]) .sb-item,
    :host([data-ui="compact"]) .sb-item {
      min-height: 48px; padding: 0 14px; gap: 12px; border-radius: 16px;
      font-size: 15px; font-weight: 600;
    }
    :host([data-ui="compact"]) .sb-item { border-radius: 12px; }
    :host([data-ui="fresh"]) .rm-sidebar.collapsed .sb-item,
    :host([data-ui="compact"]) .rm-sidebar.collapsed .sb-item { padding: 0; justify-content: center; }
    :host([data-ui="fresh"]) .sb-item.active,
    :host([data-ui="compact"]) .sb-item.active { background: var(--rm-accent-soft); color: var(--rm-accent-text); font-weight: 700; }
    :host([data-ui="fresh"]) .sb-timer-badge,
    :host([data-ui="compact"]) .sb-timer-badge { color: var(--rm-ink); }

    /* Phone bottom nav */
    :host([data-ui="fresh"]) .rm-bottom-nav {
      margin: 0 12px 12px; padding: 8px; gap: 4px;
      border: 1px solid var(--rm-border); border-radius: 28px;
      box-shadow: var(--rm-shadow-float); justify-content: stretch;
    }
    :host([data-ui="fresh"]) .rm-bn-btn {
      min-height: 56px; justify-content: center; border-radius: 20px;
      gap: 3px; padding: 4px 2px; font-size: 11.5px; font-weight: 600;
      color: var(--rm-text-secondary); min-width: 0;
    }
    :host([data-ui="fresh"]) .rm-bn-btn.active { background: var(--rm-accent-soft); color: var(--rm-accent-text); font-weight: 700; }
    :host([data-ui="compact"]) .rm-bottom-nav { padding: 0; box-shadow: none; }
    :host([data-ui="compact"]) .rm-bn-btn {
      min-height: 60px; justify-content: center; gap: 4px;
      font-size: 11.5px; font-weight: 600; color: var(--rm-text-secondary); min-width: 0;
    }
    :host([data-ui="compact"]) .rm-bn-btn.active { color: var(--rm-accent-text); font-weight: 700; }
    :host([data-ui="compact"]) .rm-bn-btn.active::before {
      content: ""; position: absolute; top: -1px; left: 30%; right: 30%;
      height: 3px; border-radius: 0 0 3px 3px; background: var(--rm-accent);
    }
    :host([data-ui="fresh"]) .rm-bn-badge,
    :host([data-ui="compact"]) .rm-bn-badge {
      color: var(--rm-ink); font-size: 11px; min-width: 18px; border-radius: 9px; padding: 1px 5px;
    }

    /* + button (Fresh) */
    .rm-fab {
      position: absolute; right: 24px; bottom: 104px; z-index: 11;
      width: 56px; height: 56px; padding: 0; border: none; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      background: var(--rm-text); color: var(--rm-bg-main);
      box-shadow: 0 8px 20px rgba(0,0,0,0.28);
    }
    .rm-fab ha-icon { --mdc-icon-size: 26px; }

    /* Menus, timers, buttons */
    :host([data-ui="fresh"]) .rm-mobile-menu,
    :host([data-ui="compact"]) .rm-mobile-menu { border-radius: 28px 0 0 28px; }
    :host([data-ui="fresh"]) .rm-mm-item:hover:not(:disabled),
    :host([data-ui="compact"]) .rm-mm-item:hover:not(:disabled) { color: var(--rm-accent-text); }
    :host([data-ui="fresh"]) .timers-view,
    :host([data-ui="compact"]) .timers-view { padding: 16px 20px 24px; }
    :host([data-ui="fresh"]) .timer-card,
    :host([data-ui="fresh"]) .timer-preset-card,
    :host([data-ui="compact"]) .timer-card,
    :host([data-ui="compact"]) .timer-preset-card { border-radius: var(--rm-radius-card); background: var(--rm-bg-surface); }
    :host([data-ui="compact"]) .timer-card,
    :host([data-ui="compact"]) .timer-preset-card { border-color: transparent; }
    :host([data-ui="fresh"]) .text-btn,
    :host([data-ui="fresh"]) .action-btn,
    :host([data-ui="compact"]) .text-btn,
    :host([data-ui="compact"]) .action-btn { min-height: 44px; }
    :host([data-ui="fresh"]) .text-btn,
    :host([data-ui="fresh"]) .action-btn { border-radius: 999px; padding: 0 18px; }
    :host([data-ui="compact"]) .text-btn,
    :host([data-ui="compact"]) .action-btn { border-radius: 12px; padding: 0 16px; }
    :host([data-ui="fresh"]) .text-btn,
    :host([data-ui="compact"]) .text-btn { color: var(--rm-ink); }
    :host([data-ui="fresh"]) .alarm-btn.accent,
    :host([data-ui="compact"]) .alarm-btn.accent { color: var(--rm-ink); }

    /* Timers view (Fresh + Compact): quick chips, one card per timer */
    .tm-view { gap: 14px; }
    .tm-quick { display: flex; flex-wrap: wrap; gap: 8px; }
    .tm-chip {
      min-height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--rm-border);
      background: var(--rm-bg-surface); color: var(--rm-text); font: inherit; font-size: 14px; font-weight: 600;
      display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
    }
    :host([data-ui="compact"]) .tm-chip { border-radius: 12px; border-color: transparent; }
    .tm-chip ha-icon { --mdc-icon-size: 16px; }
    .tm-chip.preset { padding: 0; gap: 0; overflow: hidden; }
    .tm-chip-main { background: none; border: none; color: inherit; font: inherit; padding: 0 4px 0 14px; min-height: 40px; cursor: pointer; }
    .tm-chip-x { background: none; border: none; color: var(--rm-text-secondary); width: 36px; min-height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .tm-chip.toggle input { display: none; }
    .tm-chip.toggle.on { background: var(--rm-accent-soft); border-color: var(--rm-accent); color: var(--rm-accent-text); }
    .tm-list { display: grid; gap: 12px; }
    .tm-card { padding: 16px; border-radius: var(--rm-radius-card); border: 1px solid var(--rm-border); background: var(--rm-bg-surface); display: grid; gap: 12px; }
    :host([data-ui="compact"]) .tm-card { border-color: transparent; }
    .tm-card.done { background: var(--rm-accent); color: var(--rm-ink); border-color: var(--rm-accent); }
    .tm-row { display: flex; align-items: center; gap: 10px; }
    .tm-mid { flex: 1; min-width: 0; }
    .tm-name { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rm-text-secondary); }
    .tm-name ha-icon { --mdc-icon-size: 14px; flex: none; }
    .tm-name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tm-card.done .tm-name, .tm-card.done .tm-sub { color: inherit; }
    .tm-clock { font-size: 36px; font-weight: 800; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.1; }
    .tm-sub { font-size: 12.5px; font-weight: 500; color: var(--rm-text-secondary); }
    .tm-bar { height: 8px; border-radius: 99px; background: var(--rm-bg-elevated); overflow: hidden; }
    .tm-bar i { display: block; height: 100%; border-radius: 99px; background: var(--rm-accent); transition: width 0.8s linear; }
    .tm-card.done .tm-bar { background: color-mix(in srgb, var(--rm-ink) 28%, transparent); }
    .tm-card.done .tm-bar i { background: var(--rm-ink); }
    .tm-btn {
      flex: none; width: 44px; height: 44px; padding: 0; border: none; border-radius: 50%;
      background: var(--rm-accent-soft); color: var(--rm-accent-text);
      display: flex; align-items: center; justify-content: center; cursor: pointer; font: inherit; font-weight: 700;
    }
    .tm-btn.text { width: auto; padding: 0 14px; border-radius: 999px; }
    .tm-card.done .tm-btn { background: var(--rm-ink); color: var(--rm-accent); }
    .tm-btn:focus-visible, .tm-chip:focus-visible, .tm-chip-main:focus-visible { outline: 2px solid var(--rm-accent); outline-offset: 2px; }
    :host([data-ui="fresh"]) .tm-view .timer-add-section,
    :host([data-ui="compact"]) .tm-view .timer-add-section {
      border-top: none; padding: 16px; background: var(--rm-bg-surface);
      border: 1px solid var(--rm-border); border-radius: var(--rm-radius-card);
    }
    :host([data-ui="compact"]) .tm-view .timer-add-section { border-color: transparent; }
    :host([data-ui="fresh"]) .timer-input,
    :host([data-ui="compact"]) .timer-input { border-radius: 12px; min-height: 44px; }
    :host([data-ui="fresh"]) .alarm-bubble,
    :host([data-ui="compact"]) .alarm-bubble { border-radius: 28px; background: var(--rm-bg-surface); }

    /* A sheet from the grid or planner covers the phone nav and + button */
    ha-card.rm-overlay-open .rm-bottom-nav,
    ha-card.rm-overlay-open .rm-fab { display: none; }
    /* ----- KSH Family Hub: the hub provides navigation, the module just fills its space ----- */
    :host([data-hub]) { height: 100%; max-height: none; }
    .hub-search {
      display: flex; align-items: center; gap: 6px; min-width: 180px; max-width: 320px; flex: 1;
      padding: 0 10px; height: 38px; border-radius: 999px;
      background: var(--rm-bg-surface); border: 1px solid var(--rm-border); color: var(--rm-text-secondary);
    }
    .hub-search ha-icon { --mdc-icon-size: 18px; flex: none; }
    .hub-search input {
      flex: 1; min-width: 0; border: none; outline: none; background: transparent;
      color: var(--rm-text); font: inherit; font-size: 14px;
    }
    .hub-search-clear { border: none; background: transparent; color: inherit; cursor: pointer; padding: 0; display: flex; }
    .hub-new-btn {
      display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px;
      border: none; border-radius: 999px; cursor: pointer; font: inherit; font-weight: 700; font-size: 14px;
      background: var(--rm-accent); color: var(--rm-ink);
    }
    .hub-new-btn ha-icon { --mdc-icon-size: 18px; }
  `}try{customElements.define("ksh-recipes-module",Te)}catch{}window.customCards=window.customCards||[],window.customCards.push({type:"ksh-recipes-module",name:n("Recipe Manager"),description:n("Manage, browse, and plan meals with your recipe collection."),preview:!1});
