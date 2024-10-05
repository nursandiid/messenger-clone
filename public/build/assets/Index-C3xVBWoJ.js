import{r as x,j as e,a as j}from"./app-2-nbgIXB.js";import{z as m,o as C,B as b,D as d,d as v,q as N,n as _,E as w,A as y,F as k,M as B,S as A}from"./SidebarMini-CfCRdJqb.js";import{c as h}from"./clsx-B-dksMZM.js";import{a as S}from"./index-6oVq9cAL.js";import{u as E,B as L}from"./index-nS5Yp60y.js";import{a as M,B as O,e as p,g as T}from"./index-Dx4gZyUt.js";import{C as P}from"./ContentEmpty-BBaHEYDe.js";import"./transition-BV2HJH_b.js";import"./moment-C5S46NFB.js";import"./Modal-ppMeCEZL.js";import"./InputLabel-BOEoPHxE.js";import"./InputError-Bz1JaDdo.js";function D({search:t,setSearch:a}){const{setContacts:n,setPaginate:o}=m(),[l,r]=x.useState(!0),[s]=C(t,300);x.useEffect(()=>{r(!1),l||b(s).then(c=>{n(c.data.data.data),o(c.data.data)})},[s]);const i=c=>{a(c.target.value)};return e.jsxs("div",{className:"relative flex items-center px-2 py-0",children:[e.jsx("span",{className:"absolute left-5",children:e.jsx(S,{className:"text-2xl text-secondary-foreground"})}),e.jsx("input",{type:"text",placeholder:"Search Messenger",className:"w-full rounded-lg border-secondary bg-background pl-10 focus:border-secondary focus:ring-transparent",value:t,onChange:i})]})}function I({contact:t}){return e.jsx("div",{className:"absolute right-8 shrink-0",children:e.jsx(d,{children:e.jsx(R,{contact:t})})})}const R=({contact:t})=>{var f;const{contacts:a,setContacts:n}=m(),{openModal:o}=v(),{open:l}=N(),r=x.useRef(null),s=(((f=r.current)==null?void 0:f.getBoundingClientRect().bottom)||0)<window.innerHeight-100,i=()=>{o({view:"DELETE_CONTACT_CONFIRMATION",size:"lg",payload:t})},c=()=>{o({view:"BLOCK_CONTACT_CONFIRMATION",size:"lg",payload:t})},g=()=>{_(t.id).then(()=>{n(a.map(u=>(u.id===t.id&&(u.is_contact_blocked=!1),u)))})};return e.jsxs("div",{ref:r,children:[e.jsx(d.Trigger,{children:e.jsx("button",{type:"button",className:h("rounded-full border border-secondary bg-background p-1.5 shadow-sm group-hover:visible group-hover:flex",l?"visible":"invisible"),children:e.jsx(M,{className:"text-secondary-foreground"})})}),e.jsxs(d.Content,{align:s?"right":"top-right",contentClasses:s?"":"mb-7",children:[e.jsx(d.Button,{onClick:i,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(O,{}),"Delete Contact"]})}),e.jsx(d.Button,{onClick:t.is_contact_blocked?g:c,children:t.is_contact_blocked?e.jsxs("div",{className:"flex items-center gap-2 text-success",children:[e.jsx(p,{}),"Unblock Contact"]}):e.jsxs("div",{className:"flex items-center gap-2 text-danger",children:[e.jsx(p,{}),"Block Contact"]})})]})]})};function F(){const{contacts:t,setContacts:a,paginate:n,setPaginate:o}=m(),{ref:l,inView:r}=E();if(x.useEffect(()=>{r&&l.length>0&&n.next_page_url&&w(n.next_page_url).then(s=>{o(s.data.data),a([...t,...s.data.data.data])})},[r,n]),t.length!==0)return e.jsxs("div",{className:"relative max-h-[calc(100vh_-_158px)] flex-1 overflow-y-auto px-2 sm:max-h-max sm:pb-2",children:[t.sort((s,i)=>s.name.localeCompare(i.name)).sort((s,i)=>s.is_online===i.is_online?0:s.is_online?-1:1).map(s=>e.jsxs("div",{className:"group relative flex items-center",children:[e.jsxs(j,{href:route("chats.show",s.id),as:"button",className:h("relative flex w-full flex-1 items-center gap-3 rounded-lg p-3 text-left transition-all group-hover:bg-secondary",s.is_contact_blocked&&"opacity-25"),children:[e.jsxs("div",{className:"relative shrink-0",children:[e.jsx("img",{src:s.avatar,alt:s.name,className:"h-10 w-10 rounded-full border border-secondary"}),s.is_online&&e.jsx(L,{})]}),e.jsx("div",{className:"overflow-hidden",children:e.jsx("h5",{className:"truncate font-medium",children:s.name})})]}),e.jsx(I,{contact:s})]},s.id)),n.next_page_url&&e.jsx("button",{className:"mx-auto mt-4 flex",ref:l,children:e.jsx(T,{className:"animate-spin text-2xl text-secondary-foreground"})})]})}function z(){const{contacts:t}=m(),[a,n]=x.useState("");return e.jsxs("div",{className:h("order-1 flex-1 shrink-0 flex-col gap-2 sm:order-2 sm:flex sm:w-[320px] sm:flex-initial sm:border-l sm:border-secondary lg:w-[360px]",route().current("chats.show")?"hidden":"flex"),children:[e.jsxs("div",{className:"flex items-center justify-between px-2 pt-2 sm:pb-0",children:[e.jsx("h3",{className:"text-2xl font-semibold",children:"People"}),e.jsxs("p",{children:["Active contacts (",t.filter(o=>o.is_online===!0).length,")"]})]}),e.jsx(D,{search:a,setSearch:n}),e.jsx(F,{}),t.length===0&&a.length>0&&e.jsx("p",{className:"flex h-full flex-1 items-center justify-center",children:"Contact not found"}),t.length===0&&a.length===0&&e.jsx("p",{className:"flex h-full flex-1 items-center justify-center",children:"No contact saved yet"})]})}function $(){return e.jsx(y,{title:"People",children:e.jsx(k,{children:e.jsxs(B,{children:[e.jsx(A,{}),e.jsx(z,{}),e.jsx(P,{})]})})})}export{$ as default};