"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[5825],{5318:function(e,t,a){a.d(t,{Zo:function(){return g},kt:function(){return d}});var n=a(7378);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},g=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,g=s(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,m=p["".concat(l,".").concat(d)]||p[d]||u[d]||i;return a?n.createElement(m,o(o({ref:t},g),{},{components:a})):n.createElement(m,o({ref:t},g))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<i;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},6117:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return g},default:function(){return p}});var n=a(5773),r=a(808),i=(a(7378),a(5318)),o=["components"],s={},l="Installing a Gateway",c={unversionedId:"getting-started/installation/installing-a-gateway/README",id:"version-1.32.0/getting-started/installation/installing-a-gateway/README",isDocsHomePage:!1,title:"Installing a Gateway",description:"Prerequisites",source:"@site/versioned_docs/version-1.32.0/getting-started/installation/installing-a-gateway/README.md",sourceDirName:"getting-started/installation/installing-a-gateway",slug:"/getting-started/installation/installing-a-gateway/README",permalink:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/README",editUrl:"https://github.com/nrkno/sofie-core/edit/master/packages/documentation/versioned_docs/version-1.32.0/getting-started/installation/installing-a-gateway/README.md",tags:[],version:"1.32.0",frontMatter:{},sidebar:"version-1.32.0/gettingStarted",previous:{title:"Initial Sofie Core Setup",permalink:"/sofie-core/docs/1.32.0/getting-started/installation/initial-sofie-core-setup"},next:{title:"Media Manager",permalink:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/media-manager"}},g=[{value:"Rundown &amp; Newsroom Gateways",id:"rundown--newsroom-gateways",children:[]},{value:"Playout &amp; Media Manager Gateways",id:"playout--media-manager-gateways",children:[]}],u={toc:g};function p(e){var t=e.components,a=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"installing-a-gateway"},"Installing a Gateway"),(0,i.kt)("h4",{id:"prerequisites"},"Prerequisites"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-sofie-server-core"},"Installed and running Sofie Core"))),(0,i.kt)("p",null,"The ",(0,i.kt)("em",{parentName:"p"},"Sofie Core")," is the primary application for managing the broadcast, but it doesn't play anything out on it's own. A Gateway will establish the connection from ",(0,i.kt)("em",{parentName:"p"},"Core")," to other pieces of hardware or remote software. A basic setup may include the ",(0,i.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/rundown-or-newsroom-system-connection/installing-sofie-with-google-spreadsheet-support"},"Spreadsheet Gateway")," which will ingest a rundown from Google Sheets then, use the ",(0,i.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/playout-gateway"},"Playout Gateway")," to send commands to a CasparCG graphics server, an ATEM vision mixer, and / or the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/olzzon/sisyfos-audio-controller"},"Sisyfos audio controller"),"."),(0,i.kt)("p",null,"Installing a Gateway is a two part process. To begin, you will ",(0,i.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-blueprints"},"add the required Blueprints"),", or mini plug-in programs, to ",(0,i.kt)("em",{parentName:"p"},"Core")," so it can manipulate the data from the Gateway. Then you will install the Gateway itself. Each Gateway follows a similar installation pattern but, each one does differ slightly. The links below will help you navigate to the correct Gateway for the piece of hardware / software you are using."),(0,i.kt)("h3",{id:"rundown--newsroom-gateways"},"Rundown & Newsroom Gateways"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/rundown-or-newsroom-system-connection/installing-sofie-with-google-spreadsheet-support"},"Google Spreadsheet Gateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/rundown-or-newsroom-system-connection/inews-connection"},"iNews Gateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/rundown-or-newsroom-system-connection/enps-connection"},"MOS Gateway"))),(0,i.kt)("h3",{id:"playout--media-manager-gateways"},"Playout & Media Manager Gateways"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/playout-gateway"},"Playout Gateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/sofie-core/docs/1.32.0/getting-started/installation/installing-a-gateway/media-manager"},"Media Manager Gateway"))))}p.isMDXComponent=!0}}]);