import{c as r,a as l,j as e,L as t}from"./index-aBpIye4y.js";import{l as o,C as p}from"./MainLayout-DMBF5yA8.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],m=r("circle",x);function j({compact:c=!1}){const{pathname:i}=l();return e.jsx("div",{className:c?"space-y-2":"learning-stepper",children:o.map((s,n)=>{const a=i===s.route;return e.jsxs(t,{to:s.route,className:`flow-step ${a?"flow-step-active":""} ${c?"flow-step-compact":""}`,children:[e.jsxs("span",{className:"flex items-center gap-2",children:[a?e.jsx(p,{size:16}):e.jsx(m,{size:16}),e.jsxs("b",{children:[n+1,". ",s.label]})]}),!c&&e.jsx("span",{className:"mt-1 block text-xs leading-5 opacity-80",children:s.focus})]},s.id)})})}export{j as L};
