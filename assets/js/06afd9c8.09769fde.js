"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[1367],{5318:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return f}});var r=t(7378);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),u=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},l=function(e){var n=u(e.components);return r.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(t),f=o,m=p["".concat(c,".").concat(f)]||p[f]||d[f]||a;return t?r.createElement(m,i(i({ref:n},l),{},{components:t})):r.createElement(m,i({ref:n},l))}));function f(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=p;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var u=2;u<a;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},5213:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return l},default:function(){return p}});var r=t(5773),o=t(808),a=(t(7378),t(5318)),i=["components"],s={},c="Additional Sofie views",u={unversionedId:"main/features-and-configuration/sofie-pages",id:"version-1.32.0/main/features-and-configuration/sofie-pages",isDocsHomePage:!1,title:"Additional Sofie views",description:"For the purpose of running the system in a studio environment, there are some views that can be used for various purposes:",source:"@site/versioned_docs/version-1.32.0/main/features-and-configuration/sofie-pages.md",sourceDirName:"main/features-and-configuration",slug:"/main/features-and-configuration/sofie-pages",permalink:"/sofie-core/docs/1.32.0/main/features-and-configuration/sofie-pages",editUrl:"https://github.com/nrkno/sofie-core/edit/master/packages/documentation/versioned_docs/version-1.32.0/main/features-and-configuration/sofie-pages.md",tags:[],version:"1.32.0",frontMatter:{},sidebar:"version-1.32.0/main",previous:{title:"Access Levels",permalink:"/sofie-core/docs/1.32.0/main/features-and-configuration/sofie-navigation"},next:{title:"Status views",permalink:"/sofie-core/docs/1.32.0/main/features-and-configuration/status-views"}},l=[{value:"Prompter",id:"prompter",children:[]},{value:"Presenter screen",id:"presenter-screen",children:[]},{value:"Active Rundown",id:"active-rundown",children:[]},{value:"Active Rundown - Shelf",id:"active-rundown---shelf",children:[]},{value:"Specific rundown - shelf",id:"specific-rundown---shelf",children:[]},{value:"Screensaver",id:"screensaver",children:[]}],d={toc:l};function p(e){var n=e.components,s=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},d,s,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"additional-sofie-views"},"Additional Sofie views"),(0,a.kt)("p",null,"For the purpose of running the system in a studio environment, there are some views that can be used for various purposes:"),(0,a.kt)("h3",{id:"prompter"},"Prompter"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/prompter/:studioId")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Prompter View",src:t(9115).Z})),(0,a.kt)("p",null,"A fullscreen page which displays the prompter text for the currently active rundown. The prompter can be controlled and configured in various ways, see more at the ",(0,a.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/main/features-and-configuration/prompter"},"Prompter")," documentation. If no Rundown is active in a given studio, the ",(0,a.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/main/features-and-configuration/sofie-pages#screensaver"},"Screensaver")," will be displayed. "),(0,a.kt)("p",null,"A full-screen page which displays the prompter text for the currently active rundown. The prompter can be controlled and configured in various ways, see more at the ",(0,a.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/main/features-and-configuration/prompter"},"Prompter")," documentation."),(0,a.kt)("h3",{id:"presenter-screen"},"Presenter screen"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/countdowns/:studioId/presenter")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Presenter Screen",src:t(4649).Z})),(0,a.kt)("p",null,"A full-screen page, intended to be shown to the studio presenter. It displays countdown timers for the current and next items in the rundown. If no Rundown is active in a given studio, the ",(0,a.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/main/features-and-configuration/sofie-pages#screensaver"},"Screensaver")," will be shown."),(0,a.kt)("h4",{id:"presenter-screen-overlay"},"Presenter screen overlay"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/countdowns/:studioId/overlay")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Presenter Screen Overlay",src:t(6849).Z})),(0,a.kt)("p",null,"A full-screen page with transparent background, intended to be shown to the studio presenter as an overlay on top of the produced PGM signal. It displays a reduced amount of the information from the regular ",(0,a.kt)("a",{parentName:"p",href:"/sofie-core/docs/1.32.0/main/features-and-configuration/sofie-pages#presenter-screen"},"Presenter screen"),": the countdown to the end of the current Part, a summary preview ","(","type and name",")"," of the next item in the Rundown and the current time of day. If no Rundown is active it will show the name of the Studio."),(0,a.kt)("h3",{id:"active-rundown"},"Active Rundown"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/activeRundown/:studioId")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Active Rundown",src:t(9901).Z})),(0,a.kt)("p",null,"A page which automatically displays the currently active rundown. Can be useful for the producer to have on a secondary screen."),(0,a.kt)("h3",{id:"active-rundown---shelf"},"Active Rundown - Shelf"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/activeRundown/:studioId/shelf")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Active Rundown Shelf",src:t(9781).Z})),(0,a.kt)("p",null,"A page which automatically displays the currently active rundown, and shows the Shelf in full screen. Can be useful for the producer to have on a secondary screen."),(0,a.kt)("p",null,"A shelf layout can be selected by modifying the query string, see ",(0,a.kt)("a",{parentName:"p",href:"shelf-layout"},"Shelf layout"),"."),(0,a.kt)("h3",{id:"specific-rundown---shelf"},"Specific rundown - shelf"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"/rundown/:rundownId/shelf")),(0,a.kt)("p",null,"Displays the shelf in fullscreen for a rundown"),(0,a.kt)("h3",{id:"screensaver"},"Screensaver"),(0,a.kt)("p",null,"When big screen displays ","(","like Prompter and the Presenter screen",")"," do not have any meaningful content to show, an animated screensaver showing the current time and the next planned show will be displayed. If no Rundown is upcoming, the Studio name will be displayed."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"A screensaver showing the next scheduled show",src:t(2772).Z})))}p.isMDXComponent=!0},9901:function(e,n,t){n.Z=t.p+"assets/images/active-rundown-example-a08e9334eb5b09385789f4c0b4d30dc4.png"},9781:function(e,n,t){n.Z=t.p+"assets/images/active-rundown-shelf-example-4b59e9be5a9a69f8336b0984c2a6e9d1.png"},2772:function(e,n,t){n.Z=t.p+"assets/images/next-scheduled-show-example-ece31c5cf5265476d7484489e0c0303c.png"},4649:function(e,n,t){n.Z=t.p+"assets/images/presenter-screen-example-c03aacb8cb2603d40bca3c25e59b5657.png"},6849:function(e,n,t){n.Z=t.p+"assets/images/presenter-screen-overlay-example-4cb0d6456ee71aa4fd097e38639ab018.png"},9115:function(e,n,t){n.Z=t.p+"assets/images/prompter-example-95521a8b78dba5d16a0c4568924d2992.png"}}]);