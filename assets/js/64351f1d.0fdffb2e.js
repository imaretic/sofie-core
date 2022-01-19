"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[929],{5318:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return f}});var n=r(7378);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(r),f=a,d=m["".concat(s,".").concat(f)]||m[f]||c[f]||o;return r?n.createElement(d,i(i({ref:t},u),{},{components:r})):n.createElement(d,i({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2538:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var n=r(5773),a=r(808),o=(r(7378),r(5318)),i=["components"],l={sidebar_label:"v1.33 (2021-06-16)",sidebar_position:1e3,title:"Release 33"},s=void 0,p={unversionedId:"release33",id:"release33",isDocsHomePage:!1,title:"Release 33",description:"Release date: 2021-06-16 \\(1.33.0\\)",source:"@site/releases/release33.md",sourceDirName:".",slug:"/release33",permalink:"/sofie-core/releases/release33",tags:[],version:"current",sidebarPosition:1e3,frontMatter:{sidebar_label:"v1.33 (2021-06-16)",sidebar_position:1e3,title:"Release 33"},sidebar:"default",previous:{title:"v1.34 (2021-06-29)",permalink:"/sofie-core/releases/release34"},next:{title:"v1.32 (2021-05-05)",permalink:"/sofie-core/releases/release32"}},u=[{value:"Main Features",id:"main-features",children:[]},{value:"Components",id:"components",children:[]}],c={toc:u};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Release date: 2021-06-16 ","(","1.33.0",")"),(0,o.kt)("h3",{id:"main-features"},"Main Features"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Support of inputting basic arrays in settings"),(0,o.kt)("li",{parentName:"ul"},"Filter out duplicate ad libs"),(0,o.kt)("li",{parentName:"ul"},"Human readable layer names for use in UI's"),(0,o.kt)("li",{parentName:"ul"},"Blueprints can now upload static assets to core to be used as icons and previews in the UI'",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Note that this introduces a breaking change in the blueprint ingest API"))),(0,o.kt)("li",{parentName:"ul"},"Translatable adlib actions"),(0,o.kt)("li",{parentName:"ul"},"Various other Blueprint API improvements"),(0,o.kt)("li",{parentName:"ul"},"Introduction of expected playout items"),(0,o.kt)("li",{parentName:"ul"},"Staggered UI updates improving UI performance"),(0,o.kt)("li",{parentName:"ul"},"Playout gateway can upload short clips to Blackmagic Atem Switchers")),(0,o.kt)("h3",{id:"components"},"Components"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Component"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Version"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"https://github.com/nrkno/tv-automation-server-core"},"Core")," ",(0,o.kt)("br",null)," ",(0,o.kt)("a",{parentName:"td",href:"https://www.npmjs.com/package/@sofie-automation/blueprints-integration"},"Blueprints API ( Core )"),(0,o.kt)("br",null),(0,o.kt)("a",{parentName:"td",href:"https://www.npmjs.com/package/@sofie-automation/server-core-integration"},"Gateway API"),(0,o.kt)("br",null),(0,o.kt)("a",{parentName:"td",href:"https://github.com/nrkno/tv-automation-mos-gateway"},"Mos Gateway"),(0,o.kt)("br",null),(0,o.kt)("a",{parentName:"td",href:"https://github.com/nrkno/tv-automation-playout-gateway"},"Playout Gateway")),(0,o.kt)("td",{parentName:"tr",align:"left"},"1.33")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"https://www.npmjs.com/package/timeline-state-resolver"},"Blueprints API ( TSR )")),(0,o.kt)("td",{parentName:"tr",align:"left"},"5.8")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("a",{parentName:"td",href:"https://github.com/nrkno/tv-automation-media-management"},"Media Manager")),(0,o.kt)("td",{parentName:"tr",align:"left"},"1.8")))))}m.isMDXComponent=!0}}]);