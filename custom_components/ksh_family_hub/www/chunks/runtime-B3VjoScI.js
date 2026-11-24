/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e="lit-localize-status",t=(e,...t)=>({strTag:!0,strings:e,values:t}),r=(e,t,r)=>{let s=e[0];for(let o=1;o<e.length;o++)s+=t[r?r[o-1]:o-1],s+=e[o];return s},s=e=>{return"string"!=typeof(t=e)&&"strTag"in t?r(e.strings,e.values):e;var t};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let o=s,n=!1;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class i{constructor(){this.settled=!1,this.promise=new Promise((e,t)=>{this._resolve=e,this._reject=t})}resolve(e){this.settled=!0,this._resolve(e)}reject(e){this.settled=!0,this._reject(e)}}
/**
 * @license
 * Copyright 2014 Travis Webb
 * SPDX-License-Identifier: MIT
 */const l=[];for(let e=0;e<256;e++)l[e]=(e>>4&15).toString(16)+(15&e).toString(16);function a(e,t){return(t?"h":"s")+function(e){let t=0,r=8997,s=0,o=33826,n=0,i=40164,a=0,c=52210;for(let l=0;l<e.length;l++)r^=e.charCodeAt(l),t=435*r,s=435*o,n=435*i,a=435*c,n+=r<<8,a+=o<<8,s+=t>>>16,r=65535&t,n+=s>>>16,o=65535&s,c=a+(n>>>16)&65535,i=65535&n;return l[c>>8]+l[255&c]+l[i>>8]+l[255&i]+l[o>>8]+l[255&o]+l[r>>8]+l[255&r]}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */("string"==typeof e?e:e.join(""))}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const c=new WeakMap,u=new Map;function g(e,t,o){if(e){const s=o?.id??function(e){const t="string"==typeof e?e:e.strings;let r=u.get(t);void 0===r&&(r=a(t,"string"!=typeof e&&!("strTag"in e)),u.set(t,r));return r}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */(t),n=e[s];if(n){if("string"==typeof n)return n;if("strTag"in n)return r(n.strings,t.values,n.values);{let e=c.get(n);return void 0===e&&(e=n.values,c.set(n,e)),{...n,values:e.map(e=>t.values[e])}}}}return s(t)}function d(t){window.dispatchEvent(new CustomEvent(e,{detail:t}))}let f,v,h,p,w,m="",L=new i;L.resolve();let y=0;const j=e=>(function(e){if(n)throw new Error("lit-localize can only be configured once");o=e,n=!0}((e,t)=>g(w,e,t)),m=v=e.sourceLocale,h=new Set(e.targetLocales),h.add(e.sourceLocale),p=e.loadLocale,{getLocale:E,setLocale:S}),E=()=>m,S=e=>{if(e===(f??m))return L.promise;if(!h||!p)throw new Error("Internal error");if(!h.has(e))throw new Error("Invalid locale code");y++;const t=y;f=e,L.settled&&(L=new i),d({status:"loading",loadingLocale:e});return(e===v?Promise.resolve({templates:void 0}):p(e)).then(r=>{y===t&&(m=e,f=void 0,w=r.templates,d({status:"ready",readyLocale:e}),L.resolve())},r=>{y===t&&(d({status:"error",errorLocale:e,errorMessage:r.toString()}),L.reject(r))}),L.promise};export{e as L,j as c,o as m,t as s};
