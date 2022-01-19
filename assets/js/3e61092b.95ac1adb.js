"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[162],{5318:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return f}});var a=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),f=o,g=p["".concat(l,".").concat(f)]||p[f]||u[f]||i;return n?a.createElement(g,r(r({ref:t},d),{},{components:n})):a.createElement(g,r({ref:t},d))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,r[1]=s;for(var c=2;c<i;c++)r[c]=n[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1704:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return p}});var a=n(5773),o=n(808),i=(n(7378),n(5318)),r=["components"],s={},l="Access Levels",c={unversionedId:"main/features-and-configuration/sofie-navigation",id:"main/features-and-configuration/sofie-navigation",isDocsHomePage:!1,title:"Access Levels",description:"By default, a user cannot edit settings, nor play out anything.",source:"@site/docs/main/features-and-configuration/sofie-navigation.md",sourceDirName:"main/features-and-configuration",slug:"/main/features-and-configuration/sofie-navigation",permalink:"/sofie-core/docs/main/features-and-configuration/sofie-navigation",editUrl:"https://github.com/nrkno/sofie-core/edit/master/packages/documentation/docs/main/features-and-configuration/sofie-navigation.md",tags:[],version:"current",frontMatter:{},sidebar:"main",previous:{title:"Sofie Core: System configuration",permalink:"/sofie-core/docs/main/features-and-configuration/sofie-core-settings"},next:{title:"Additional Sofie views",permalink:"/sofie-core/docs/main/features-and-configuration/sofie-pages"}},d=[{value:"Access levels",id:"access-levels-1",children:[]},{value:"Language selection",id:"language-selection",children:[]}],u={toc:d};function p(e){var t=e.components,n=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"access-levels"},"Access Levels"),(0,i.kt)("p",null,"By default, a user cannot edit settings, nor play out anything."),(0,i.kt)("p",null,"If user accounts are enabled ","(",(0,i.kt)("inlineCode",{parentName:"p"},"enableUserAccounts")," in ",(0,i.kt)("a",{parentName:"p",href:"/sofie-core/docs/main/features-and-configuration/sofie-core-settings#settings-file"},"Core settings"),")",", the access levels are set under the user settings. If no user accounts are set, the access level for a browser is set by adding ",(0,i.kt)("inlineCode",{parentName:"p"},"?theaccessmode=1")," to the URL as described below."),(0,i.kt)("p",null,"The access level is persisted in browser's Local Storage. To disable, visit",(0,i.kt)("inlineCode",{parentName:"p"},"?theaccessmode=0"),"."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Access area"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Basic Mode"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Configuration Mode"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Studio Mode"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Admin Mode"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("strong",{parentName:"td"},"Rundowns")),(0,i.kt)("td",{parentName:"tr",align:"left"},"View Only"),(0,i.kt)("td",{parentName:"tr",align:"left"},"View Only"),(0,i.kt)("td",{parentName:"tr",align:"left"},"Yes, playout"),(0,i.kt)("td",{parentName:"tr",align:"left"},"Yes, playout")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("strong",{parentName:"td"},"Settings")),(0,i.kt)("td",{parentName:"tr",align:"left"},"No"),(0,i.kt)("td",{parentName:"tr",align:"left"},"Yes"),(0,i.kt)("td",{parentName:"tr",align:"left"},"No"),(0,i.kt)("td",{parentName:"tr",align:"left"},"Yes")))),(0,i.kt)("h3",{id:"access-levels-1"},"Access levels"),(0,i.kt)("h4",{id:"basic-mode"},"Basic mode"),(0,i.kt)("p",null,"The basic mode allows for view only. No playout or access to any settings."),(0,i.kt)("h4",{id:"studio-mode"},"Studio mode"),(0,i.kt)("p",null,"Studio Mode gives the user playout-control of the studio, rundowns etc."),(0,i.kt)("p",null,"Enables rundown actions such as activating/deactivating rundowns, taking parts, ad-libbing, etc."),(0,i.kt)("p",null,"This mode is accessed by adding  ",(0,i.kt)("inlineCode",{parentName:"p"},"?studio=1")," to the end of the URL."),(0,i.kt)("h4",{id:"configuration-mode"},"Configuration mode"),(0,i.kt)("p",null,"Configuration mode gives the user full control over the Settings pages and allows full access to the system including the ability to modify Blueprints, Studios, or Show Styles, creating and restoring Snapshots, as well as modifying attached devices."),(0,i.kt)("p",null,"This mode is accessed by adding  ",(0,i.kt)("inlineCode",{parentName:"p"},"?configure=1")," to the end of the URL."),(0,i.kt)("h4",{id:"help-mode"},"Help Mode"),(0,i.kt)("p",null,"Enables some tooltips that might be useful to new users."),(0,i.kt)("p",null,"This mode is accessed by adding  ",(0,i.kt)("inlineCode",{parentName:"p"},"?help=1")," to the end of the URL."),(0,i.kt)("h4",{id:"admin-mode"},"Admin Mode"),(0,i.kt)("p",null,"This mode will give the user the same access as the Configuration and Studio modes as well as having access to a set of Test Tools and a Manual Control section on the Rundown page."),(0,i.kt)("p",null,"This mode is enabled when ",(0,i.kt)("inlineCode",{parentName:"p"},"?admin=1")," is added the end of the URL."),(0,i.kt)("h4",{id:"testing-mode"},"Testing Mode"),(0,i.kt)("p",null,"Enables the page Test Tools, which contains various tools useful for testing the system during development."),(0,i.kt)("p",null,"This mode is enabled when ",(0,i.kt)("inlineCode",{parentName:"p"},"?testing=1")," is added the end of the URL."),(0,i.kt)("h4",{id:"developer-mode"},"Developer mode"),(0,i.kt)("p",null,"This mode enables various things that might be useful for a developer, such as re-enabling the right-click menu."),(0,i.kt)("p",null,"This mode is enabled when ",(0,i.kt)("inlineCode",{parentName:"p"},"?develop=1")," is added the end of the URL."),(0,i.kt)("h2",{id:"language-selection"},"Language selection"),(0,i.kt)("p",null,"The UI will automatically detect user browser's default matching and select the best match, falling back to English. You can also force the UI language to any language by navigating to a page with ",(0,i.kt)("inlineCode",{parentName:"p"},"?lng=xx")," query string, for example:"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"http://localhost:3000/?lng=en")),(0,i.kt)("p",null,"This choice is persisted in browser's Local Storage, and the same language will be used until a new forced language is chosen using this method."))}p.isMDXComponent=!0}}]);