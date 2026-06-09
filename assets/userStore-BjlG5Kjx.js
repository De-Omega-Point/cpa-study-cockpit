import{c as n,b as i}from"./index-D8mlSAYG.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],V=n("book-open",g);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M9 13a4.5 4.5 0 0 0 3-4",key:"10igwf"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M16 8V5a2 2 0 0 1 2-2",key:"u6izg6"}],["circle",{cx:"16",cy:"13",r:".5",key:"ry7gng"}],["circle",{cx:"18",cy:"3",r:".5",key:"1aiba7"}],["circle",{cx:"20",cy:"21",r:".5",key:"yhc1fs"}],["circle",{cx:"20",cy:"8",r:".5",key:"1e43v0"}]],$=n("brain-circuit",b);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]],q=n("clipboard-check",x);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]],w=n("route",M);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],z=n("shield-check",m);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],B=n("target",C),p=t=>{let e;const c=new Set,a=(r,d)=>{const s=typeof r=="function"?r(e):r;if(!Object.is(s,e)){const f=e;e=d??(typeof s!="object"||s===null)?s:Object.assign({},e,s),c.forEach(S=>S(e,f))}},o=()=>e,y={setState:a,getState:o,getInitialState:()=>h,subscribe:r=>(c.add(r),()=>c.delete(r))},h=e=t(a,o,y);return y},_=(t=>t?p(t):p),I=t=>t;function v(t,e=I){const c=i.useSyncExternalStore(t.subscribe,i.useCallback(()=>e(t.getState()),[t,e]),i.useCallback(()=>e(t.getInitialState()),[t,e]));return i.useDebugValue(c),c}const k=t=>{const e=_(t),c=a=>v(e,a);return Object.assign(c,e),c},j=(t=>t?k(t):k),u=(t,e)=>{try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch{return!1}},A=t=>{try{const e=localStorage.getItem(t);return e?JSON.parse(e):null}catch{return null}};function N(t){return Math.floor(t/1e3)+1}function H(t){return t>=50?"Illinois CPA Master":t>=30?"CPA Candidate Elite":t>=20?"Audit Specialist":t>=10?"Senior Accountant":t>=5?"Staff Accountant":"Candidate"}const l="cpa-user-profile",O={name:"",targetDiscipline:"TCP",targetExamDate:"",studyHoursWeekly:10,xp:0,level:1,streak:0,createdAt:new Date().toISOString()},L=j(t=>({profile:A(l)||O,updateProfile:e=>t(c=>{const a={...c.profile,...e};return u(l,a),{profile:a}}),addXP:e=>t(c=>{const a=c.profile.xp+e,o={...c.profile,xp:a,level:N(a)};return u(l,o),{profile:o}}),incrementStreak:()=>t(e=>{const c={...e.profile,streak:e.profile.streak+1};return u(l,c),{profile:c}})}));export{V as B,q as C,w as R,z as S,B as T,$ as a,j as c,A as l,H as r,u as s,L as u};
