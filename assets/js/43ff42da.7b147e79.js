"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[5513],{5318:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return n?r.createElement(f,a(a({ref:t},c),{},{components:n})):r.createElement(f,a({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var p=2;p<i;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1544:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var r=n(5773),o=n(808),i=(n(7378),n(5318)),a=["components"],s={sidebar_position:1},l="Quick install",p={unversionedId:"getting-started/installation/installing-sofie-server-core",id:"getting-started/installation/installing-sofie-server-core",isDocsHomePage:!1,title:"Quick install",description:"Installing for testing \\(or production\\)",source:"@site/docs/getting-started/installation/installing-sofie-server-core.md",sourceDirName:"getting-started/installation",slug:"/getting-started/installation/installing-sofie-server-core",permalink:"/tv-automation-server-core/docs/getting-started/installation/installing-sofie-server-core",editUrl:"https://github.com/nrkno/tv-automation-server-core/edit/master/packages/documentation/docs/getting-started/installation/installing-sofie-server-core.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"gettingStarted",previous:{title:"Installation & Setup",permalink:"/tv-automation-server-core/docs/getting-started/installation/README"},next:{title:"Initial Sofie Core Setup",permalink:"/tv-automation-server-core/docs/getting-started/installation/initial-sofie-core-setup"}},c=[{value:"Installing for testing (or production)",id:"installing-for-testing-or-production",children:[{value:"<strong>Prerequisites</strong>",id:"prerequisites",children:[]},{value:"Installation",id:"installation",children:[]},{value:"Tips for running in production",id:"tips-for-running-in-production",children:[]}]},{value:"Installing for Development",id:"installing-for-development",children:[]}],u={toc:c};function d(e){var t=e.components,s=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"quick-install"},"Quick install"),(0,i.kt)("h2",{id:"installing-for-testing-or-production"},"Installing for testing ","(","or production",")"),(0,i.kt)("h3",{id:"prerequisites"},(0,i.kt)("strong",{parentName:"h3"},"Prerequisites")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"(","Linux",")")," Install ",(0,i.kt)("a",{parentName:"p",href:"https://docs.docker.com/install/linux/docker-ce/ubuntu/"},"Docker")," and ",(0,i.kt)("a",{parentName:"p",href:"https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04"},"docker-compose"),".",(0,i.kt)("br",{parentName:"p"}),"\n",(0,i.kt)("strong",{parentName:"p"},"(","Windows",")")," Install ",(0,i.kt)("a",{parentName:"p",href:"https://hub.docker.com/editions/community/docker-ce-desktop-windows"},"Docker for Windows")," ","(","Please note that Docker for Windows using WSL2 may come with severe performance issues",")"),(0,i.kt)("h3",{id:"installation"},"Installation"),(0,i.kt)("p",null,"This docker-compose file automates the basic setup of the ",(0,i.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/for-developers/libraries#main-application"},"Sofie-Core application"),", the backend database and different Gateway options."),(0,i.kt)("p",null,(0,i.kt)("a",{target:"_blank",href:n(5516).Z},"Docker Compose File")),(0,i.kt)("p",null,"After you've downloaded the file, open it in a text editor and navigate to the ",(0,i.kt)("em",{parentName:"p"},"ingest-gateway")," section, and select which type of ",(0,i.kt)("em",{parentName:"p"},"ingest-gateway")," you'd like installed by commenting out the others."),(0,i.kt)("p",null,"Create a ",(0,i.kt)("inlineCode",{parentName:"p"},"Sofie")," folder and copy the docker-compose-file into it."),(0,i.kt)("p",null,"Then open a terminal, ",(0,i.kt)("inlineCode",{parentName:"p"},"cd your-sofie-folder")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"sudo docker-compose up")," ","(","just ",(0,i.kt)("inlineCode",{parentName:"p"},"docker-compose up")," on windows",")","."),(0,i.kt)("p",null,"Once the installation is done, Sofie should be running on ",(0,i.kt)("a",{parentName:"p",href:"http://localhost:3000"},"http://localhost:3000")),(0,i.kt)("p",null,"Next, you will need to install a Rundown Gateway. Visit ",(0,i.kt)("a",{parentName:"p",href:"./installing-a-gateway/rundown-or-newsroom-system-connection/README"},"Rundowns\xa0&\xa0Newsroom Systems")," to see which ",(0,i.kt)("em",{parentName:"p"},"Rundown Gateway")," is best suited for ",(0,i.kt)("del",{parentName:"p"},(0,i.kt)("em",{parentName:"del"},"your"))," production environment."),(0,i.kt)("p",null,"To get a demo rundown up and running quickly, check out the ",(0,i.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/getting-started/installation/installing-a-gateway/rundown-or-newsroom-system-connection/rundown-editor"},"Sofie Rundown Editor"),"."),(0,i.kt)("h3",{id:"tips-for-running-in-production"},"Tips for running in production"),(0,i.kt)("p",null,"There are some things not covered in this guide needed to run Sofie in a production environment:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Logging: Collect, store and track error messages. ",(0,i.kt)("a",{parentName:"li",href:"https://www.elastic.co/kibana"},"Kibana "),"and ",(0,i.kt)("a",{parentName:"li",href:"https://www.elastic.co/logstash"},"logstash")," is one way to do it."),(0,i.kt)("li",{parentName:"ul"},"NGINX: It is customary to put a load-balancer in front of Sofie-Core."),(0,i.kt)("li",{parentName:"ul"},"Memory and CPU usage monitoring.")),(0,i.kt)("h2",{id:"installing-for-development"},"Installing for Development"),(0,i.kt)("p",null,"Installation instructions for installing Sofie-Core or the various gateways are available in the README-file in their respective github-repos."),(0,i.kt)("p",null,"Common prerequisites are ",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/"},"Node.js")," and ",(0,i.kt)("a",{parentName:"p",href:"https://yarnpkg.com/"},"Yarn"),".",(0,i.kt)("br",{parentName:"p"}),"\n","Links to the repos are listed at ",(0,i.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/for-developers/libraries"},"Applications & Libraries"),"."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/nrkno/tv-automation-server-core"},"Sofie Core GitHub Page for Developers")))}d.isMDXComponent=!0},5516:function(e,t,n){t.Z=n.p+"assets/files/docker-compose-7d52ba50650db40b23aaabf3b0fb5634.yaml"}}]);