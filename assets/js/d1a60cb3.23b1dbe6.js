"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[2402],{5318:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return h}});var n=a(7378);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(a),h=i,m=d["".concat(l,".").concat(h)]||d[h]||p[h]||r;return a?n.createElement(m,o(o({ref:t},u),{},{components:a})):n.createElement(m,o({ref:t},u))}));function h(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,o=new Array(r);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<r;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},2455:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var n=a(5773),i=a(808),r=(a(7378),a(5318)),o=["components"],s={},l="Settings",c={unversionedId:"main/features-and-configuration/settings-view",id:"version-1.32.0/main/features-and-configuration/settings-view",isDocsHomePage:!1,title:"Settings",description:'{% hint style="warning" %}',source:"@site/versioned_docs/version-1.32.0/main/features-and-configuration/settings-view.md",sourceDirName:"main/features-and-configuration",slug:"/main/features-and-configuration/settings-view",permalink:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/settings-view",editUrl:"https://github.com/nrkno/tv-automation-server-core/edit/master/packages/documentation/versioned_docs/version-1.32.0/main/features-and-configuration/settings-view.md",tags:[],version:"1.32.0",frontMatter:{},sidebar:"version-1.32.0/main",previous:{title:"Customizing the Rundown View",permalink:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/rundown-view"},next:{title:"Sofie Core: System configuration",permalink:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/sofie-core-settings"}},u=[{value:"System",id:"system",children:[]},{value:"Studio",id:"studio",children:[{value:"Attached devices",id:"attached-devices",children:[]},{value:"Blueprint configuration",id:"blueprint-configuration",children:[]},{value:"Layer Mappings",id:"layer-mappings",children:[]}]},{value:"Show style",id:"show-style",children:[]},{value:"Migrations",id:"migrations",children:[]}],p={toc:u};function d(e){var t=e.components,s=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"settings"},"Settings"),(0,r.kt)("p",null,'{% hint style="warning" %}\nThe settings pages are only visible to users with the right ',(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/sofie-navigation"},"access level"),"!\n{% endhint %}"),(0,r.kt)("p",null,"Recommended read before diving into the settings: ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/concepts-and-architecture#system-organization-studio-and-show-style"},"System, ","(","Organization",")",", Studio & Show Style"),"."),(0,r.kt)("h2",{id:"system"},"System"),(0,r.kt)("p",null,"The ",(0,r.kt)("em",{parentName:"p"},"System")," settings are settings for this installation of Sofie. In here goes the settings that are applicable system-wide."),(0,r.kt)("p",null,'{% hint style="warning" %}\nDocumentation for this section is yet to be written.\n{% endhint %}'),(0,r.kt)("h2",{id:"studio"},"Studio"),(0,r.kt)("p",null,"A ",(0,r.kt)("em",{parentName:"p"},"Studio")," in Sofie-terms is a physical location, with a specific set of devices and equipment. Only one show can be on air in a studio at the same time.",(0,r.kt)("br",{parentName:"p"}),"\n","The ",(0,r.kt)("em",{parentName:"p"},"studio")," settings are settings for that specific studio, and contains settings related to hardware and play-out, such as:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Attached devices")," - the Gateways related to this studio"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Blueprint configuration")," - ****custom config option defined by the blueprints"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Layer Mappings")," - Maps the logical ",(0,r.kt)("em",{parentName:"li"},"timeline layers")," to physical devices and outputs")),(0,r.kt)("p",null,"The Studio uses a studio-blueprint, which handles things like mapping up an incoming rundown to a Showstyle."),(0,r.kt)("h3",{id:"attached-devices"},"Attached devices"),(0,r.kt)("p",null,"This section allows you to add and remove Gateways that are related to this ",(0,r.kt)("em",{parentName:"p"},"Studio"),". When a Gateway is attached to a Studio, it will react to the changes happening within it, as well as feed the neccessary data into it."),(0,r.kt)("h3",{id:"blueprint-configuration"},"Blueprint configuration"),(0,r.kt)("p",null,"Sofie allows the Blueprints to expose custom configuration fields that allow the System Administrator to reconfigure how these Blueprints work through the Sofie UI. Here you can change the configuration of the ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/concepts-and-architecture#studio-blueprints"},"Studio Blueprint"),"."),(0,r.kt)("h3",{id:"layer-mappings"},"Layer Mappings"),(0,r.kt)("p",null,"This section allows you to add, remove and configure how logical device-control will be translated to physical automation control. ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/concepts-and-architecture#blueprints"},"Blueprints")," control devices through objects placed on a ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/concepts-and-architecture#timeline"},"Timeline")," using logical device identifiers called ",(0,r.kt)("em",{parentName:"p"},"Layers"),". A layer represents a single aspect of a device that can be controlled at a given time: a video switcher's M/E bus, an audio mixers's fader, an OSC control node, a video server's output channel. Layer Mappings translate these logical identifiers into physical device aspects, for example:"),(0,r.kt)("p",null,"![A sample configuration of a Layer Mapping for the M/E1 Bus of an ATEM switcher]","(/gitbook/assets/obraz (2).png)"),(0,r.kt)("p",null,"This ",(0,r.kt)("em",{parentName:"p"},"Layer Mapping")," configures the ",(0,r.kt)("inlineCode",{parentName:"p"},"atem_me_program")," Timeline-layer to control the ",(0,r.kt)("inlineCode",{parentName:"p"},"atem0")," device of the ",(0,r.kt)("inlineCode",{parentName:"p"},"ATEM")," type. No Lookahead will be enabled for this layer. This layer will control a ",(0,r.kt)("inlineCode",{parentName:"p"},"MixEffect")," aspect with the Index of ",(0,r.kt)("inlineCode",{parentName:"p"},"0")," ","(","so M/E 1 Bus",")","."),(0,r.kt)("p",null,"These mappings allow the System Administrator to reconfigure what devices the Blueprints will control, without the need of changing the Blueprint code."),(0,r.kt)("h4",{id:"route-sets"},"Route Sets"),(0,r.kt)("p",null,"In order to allow the Producer to reconfigure the automation from the Switchboard in the ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#rundown-view"},"Rundown View"),", as well as have some pre-set automation control available for the System Administrator, Sofie has a concept of Route Sets. Route Sets work on top of the Layer Mappings, by configuring sets of ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/features-and-configuration/settings-view#layer-mappings"},"Layer Mappings")," that will re-route the control from one device to another, or to disable the automation altogether. These Route Sets are presented to the Producer in the ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#switchboard"},"Switchboard "),"panel."),(0,r.kt)("p",null,"A Route Set is essentially a distinct set of Layer Mappings, which can modify the settings already configured by the Layer Mappings, but can be turned On and Off. Called Routes, these can change:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"the Layer ID to a new Layer ID"),(0,r.kt)("li",{parentName:"ul"},"change the Device being controlled by the Layer"),(0,r.kt)("li",{parentName:"ul"},"change the aspect of the Device that's being controlled.")),(0,r.kt)("p",null,"Route Sets can be grouped into Exclusivity Groups, in which only a single Route Set can be enabled at a time. When activating a Route Set within an Exclusivity Group, all other Route Sets in that group will be deactivated. This in turn, allows the System Administrator to create entire sections of exclusive automation control within the Studio that the Producer can then switch between. One such example could be switching between Primary and Backup playout servers, or switching between Primary and Backup talent microphone."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"The Exclusivity Group Name will be displayed as a header in the Switchboard panel",src:a(4883).Z})),(0,r.kt)("p",null,"A Route Set has a Behavior property which will dictate what happens how the Route Set operates:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Behavior"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"ACTIVATE_ONLY")),(0,r.kt)("td",{parentName:"tr",align:"left"},"This RouteSet cannot be deactivated, only a different RouteSet in the same Exclusivity Group can cause it to deactivate")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"TOGGLE")),(0,r.kt)("td",{parentName:"tr",align:"left"},"The RouteSet can be activated and deactivated. As a result, it's possible for the Exclusivity Group to have no Route Set active")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},(0,r.kt)("inlineCode",{parentName:"td"},"HIDDEN")),(0,r.kt)("td",{parentName:"tr",align:"left"},"The RouteSet can be activated and deactivated, but it will not be presented to the user in the Switchboard panel")))),(0,r.kt)("p",null,"![An active RouteSet with a single Layer Mapping being re-configured]","(/gitbook/assets/obraz (1).png)"),(0,r.kt)("p",null,"Route Sets can also be configured with a ",(0,r.kt)("em",{parentName:"p"},"Default State"),". This can be used to contrast a normal, day-to-day configuration with an exceptional one ","(","like using a backup device",")"," in the ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#switchboard"},"Switchboard "),"panel."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"left"},"Default State"),(0,r.kt)("th",{parentName:"tr",align:"left"},"Behavior"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"Active"),(0,r.kt)("td",{parentName:"tr",align:"left"},"If the Route Set is not active, an indicator will be shown")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"Not Active"),(0,r.kt)("td",{parentName:"tr",align:"left"},"If the Route Set is active, an indicator will be shown")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"left"},"Not defined"),(0,r.kt)("td",{parentName:"tr",align:"left"},"No indicator will be shown, regardless of the Route Set state")))),(0,r.kt)("h2",{id:"show-style"},"Show style"),(0,r.kt)("p",null,"A ",(0,r.kt)("em",{parentName:"p"},"Showstyle")," is related to the looks and logic of a ",(0,r.kt)("em",{parentName:"p"},"show"),", which in contrast to the ",(0,r.kt)("em",{parentName:"p"},"studio")," is not directly related to the hardware.",(0,r.kt)("br",{parentName:"p"}),"\n","The Showstyle contains settings like"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Source Layers -")," Groups different types of content in the GUI"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Output Channels")," - Indicates different output targets ","(","such as the ",(0,r.kt)("em",{parentName:"li"},"Program")," or ",(0,r.kt)("em",{parentName:"li"},"back-screen in the studio"),")"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},"Blueprint configuration")," - ****custom config option defined by the blueprints")),(0,r.kt)("p",null,'{% hint style="warning" %}\nPlease note the difference between S',(0,r.kt)("em",{parentName:"p"},"ource Layers")," and ",(0,r.kt)("em",{parentName:"p"},"timeline-layers:")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#piece"},"Pieces "),"are put onto ",(0,r.kt)("em",{parentName:"p"},"Source layers"),", to group different types of content ","(","such as a VT or Camera",")",", they are therefore intended only as something to indicate to the user what is going to be played, not what is actually going to happen on the technical level."),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#timeline-object"},"Timeline-objects")," ","(","inside of the ",(0,r.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/1.32.0/main/dictionary#piece"},"Pieces"),")"," are put onto timeline-layers, which are ","(","through the Mappings in the studio",")"," mapped to physical devices and outputs.",(0,r.kt)("br",{parentName:"p"}),"\n","The exact timeline-layer is never exposed to the user, but instead used on the technical level to control play-out."),(0,r.kt)("p",null,"An example of the difference could be when playing a VT ","(","that's a Source Layer",")",", which could involve all of the timeline-layers ",(0,r.kt)("em",{parentName:"p"},"video","_","player0"),", ",(0,r.kt)("em",{parentName:"p"},"audio","_","fader","_","video"),", ",(0,r.kt)("em",{parentName:"p"},"audio","_","fader","_","host")," and ",(0,r.kt)("em",{parentName:"p"},"mixer","_","pgm."),"\n{% endhint %}"),(0,r.kt)("h2",{id:"migrations"},"Migrations"),(0,r.kt)("p",null,"The migrations are automatic setup-scripts that help you during initial setup and system upgrades."),(0,r.kt)("p",null,"There are system-migrations that comes directly from the version of Sofie Core you're running, and there are also migrations added by the different blueprints."),(0,r.kt)("p",null,"It is mandatory to run migrations when you've upgraded Sofie Core to a new version, or upgraded your blueprints."))}d.isMDXComponent=!0},4883:function(e,t,a){t.Z=a.p+"assets/images/obraz-a8997f2de686f110cc188db78fb413f7.png"}}]);