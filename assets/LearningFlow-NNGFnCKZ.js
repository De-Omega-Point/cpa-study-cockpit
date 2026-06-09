import{c as n,a as l,j as e,L as o}from"./index-D8mlSAYG.js";import{l as t}from"./MainLayout-BiZJ-Nns.js";import{C as p}from"./circle-check-CDxrlW40.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],x=n("circle",m);function u({compact:c=!1}){const{pathname:i}=l();return e.jsx("div",{className:c?"space-y-2":"learning-stepper",children:t.map((s,r)=>{const a=i===s.route;return e.jsxs(o,{to:s.route,className:`flow-step ${a?"flow-step-active":""} ${c?"flow-step-compact":""}`,children:[e.jsxs("span",{className:"flex items-center gap-2",children:[a?e.jsx(p,{size:16}):e.jsx(x,{size:16}),e.jsxs("b",{children:[r+1,". ",s.label]})]}),!c&&e.jsx("span",{className:"mt-1 block text-xs leading-5 opacity-80",children:s.focus})]},s.id)})})}export{u as L};
