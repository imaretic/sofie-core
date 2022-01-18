"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[279],{5318:function(t,e,a){a.d(e,{Zo:function(){return m},kt:function(){return N}});var n=a(7378);function r(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?o(Object(a),!0).forEach((function(e){r(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function l(t,e){if(null==t)return{};var a,n,r=function(t,e){if(null==t)return{};var a,n,r={},o=Object.keys(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||(r[a]=t[a]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(n=0;n<o.length;n++)a=o[n],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}var d=n.createContext({}),p=function(t){var e=n.useContext(d),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},m=function(t){var e=p(t.components);return n.createElement(d.Provider,{value:e},t.children)},k={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},s=n.forwardRef((function(t,e){var a=t.components,r=t.mdxType,o=t.originalType,d=t.parentName,m=l(t,["components","mdxType","originalType","parentName"]),s=p(a),N=r,f=s["".concat(d,".").concat(N)]||s[N]||k[N]||o;return a?n.createElement(f,i(i({ref:e},m),{},{components:a})):n.createElement(f,i({ref:e},m))}));function N(t,e){var a=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var o=a.length,i=new Array(o);i[0]=s;var l={};for(var d in e)hasOwnProperty.call(e,d)&&(l[d]=e[d]);l.originalType=t,l.mdxType="string"==typeof t?t:r,i[1]=l;for(var p=2;p<o;p++)i[p]=a[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}s.displayName="MDXCreateElement"},275:function(t,e,a){a.r(e),a.d(e,{frontMatter:function(){return l},contentTitle:function(){return d},metadata:function(){return p},toc:function(){return m},default:function(){return s}});var n=a(5773),r=a(808),o=(a(7378),a(5318)),i=["components"],l={},d="Prompter",p={unversionedId:"main/features-and-configuration/prompter",id:"main/features-and-configuration/prompter",isDocsHomePage:!1,title:"Prompter",description:"See Sofie views for how to access the prompter page.",source:"@site/docs/main/features-and-configuration/prompter.md",sourceDirName:"main/features-and-configuration",slug:"/main/features-and-configuration/prompter",permalink:"/tv-automation-server-core/docs/main/features-and-configuration/prompter",editUrl:"https://github.com/nrkno/tv-automation-server-core/edit/master/packages/documentation/docs/main/features-and-configuration/prompter.md",tags:[],version:"current",frontMatter:{},sidebar:"main",previous:{title:"Concepts & Architecture",permalink:"/tv-automation-server-core/docs/main/features-and-configuration/concepts-and-architecture"},next:{title:"Customizing the Rundown View",permalink:"/tv-automation-server-core/docs/main/features-and-configuration/rundown-view"}},m=[{value:"Customize looks",id:"customize-looks",children:[]},{value:"Controlling the prompter",id:"controlling-the-prompter",children:[]}],k={toc:m};function s(t){var e=t.components,l=(0,r.Z)(t,i);return(0,o.kt)("wrapper",(0,n.Z)({},k,l,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"prompter"},"Prompter"),(0,o.kt)("p",null,"See ",(0,o.kt)("a",{parentName:"p",href:"/tv-automation-server-core/docs/main/features-and-configuration/sofie-pages#prompter"},"Sofie views")," for how to access the prompter page."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Prompter screen before the first Part is taken",src:a(6076).Z})),(0,o.kt)("p",null,"The prompter will display the script for the Rundown currently active in the Studio. On Air and Next parts and segments are highlighted - in red and green, respectively - to aid in navigation. In top-right corner of the screen, a Diff clock is shown, showing the difference between planned playback and what has been actually produced. This allows the host to know how far behind/ahead they are in regards to planned execution."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Indicators for the On Air and Next part shown underneath the Diff clock",src:a(3343).Z})),(0,o.kt)("p",null,"If the user scrolls the prompter ahead or behind the On Air part, helpful indicators will be shown in the right-hand side of the screen. If the On Air or Next part's script is above the current viewport, arrows pointing up will be shown. If the On Air part's script is below the current viewport, a single arrow pointing down will be shown."),(0,o.kt)("h2",{id:"customize-looks"},"Customize looks"),(0,o.kt)("p",null,"The prompter UI can be configured using query parameters:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Default"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"mirror")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Mirror the display horizontally"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"vmirror")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Mirror the display vertically"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"fontsize")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Set a custom font size of the text. 20 will fit in 5 lines of text, 14 will fit 7 lines etc.."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"14"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"marker")),(0,o.kt)("td",{parentName:"tr",align:"left"},"string"),(0,o.kt)("td",{parentName:"tr",align:"left"},'Set position of the read-marker. Possible values: "center", "top", "bottom", "hide"'),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"hide"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"margin")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Set margin of screen ","(","used on monitors with overscan",")",", in %."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"showmarker")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},'If the marker is not set to "hide", control if the marker is hidden or not'),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"showscroll")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Whether the scroll bar should be shown"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"followtake")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Whether the prompter should automatically scroll to current segment when the operator TAKE:s it"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"debug")),(0,o.kt)("td",{parentName:"tr",align:"left"},"0 / 1"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Whether to display a debug box showing controller input values and the calculated speed the prompter is currently scrolling at. Used to tweak speedMaps and ranges."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))))),(0,o.kt)("p",null,"Example: ",(0,o.kt)("a",{parentName:"p",href:"http://127.0.0.1/prompter/studio0/?mode=mouse&followTake=0&fontsize=20"},"http://127.0.0.1/prompter/studio0/?mode=mouse&followTake=0&fontsize=20")),(0,o.kt)("h2",{id:"controlling-the-prompter"},"Controlling the prompter"),(0,o.kt)("p",null,"The prompter can be controlled by different types of controllers. The control mode is set by a query parameter, like so: ",(0,o.kt)("inlineCode",{parentName:"p"},"?mode=mouse"),"."),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"Default"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by both mouse and keyboard")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?mode=mouse")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by mouse only. ",(0,o.kt)("a",{parentName:"td",href:"/tv-automation-server-core/docs/main/features-and-configuration/prompter#control-using-mouse-scroll-wheel"},"See configuration details"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?mode=keyboard")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by keyboard only. ",(0,o.kt)("a",{parentName:"td",href:"/tv-automation-server-core/docs/main/features-and-configuration/prompter#control-using-keyboard"},"See configuration details"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?mode=shuttlekeyboard")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by a Contour Design ShuttleXpress, X-keys Jog and Shuttle or any compatible, configured as keyboard-ish device. ",(0,o.kt)("a",{parentName:"td",href:"/tv-automation-server-core/docs/main/features-and-configuration/prompter#control-using-contour-shuttlexpress-or-x-keys"},"See configuration details"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?mode=pedal")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by any MIDI device outputting note values between 0 - 127 of CC notes on channel 8. Analogue Expression pedals work well with TRS-USB midi-converters. ",(0,o.kt)("a",{parentName:"td",href:"/tv-automation-server-core/docs/main/features-and-configuration/prompter#control-using-midi-input-mode-pedal"},"See configuration details"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?mode=joycon")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Controlled by Nintendo Switch Joycon, using the HTML5 GamePad API. ",(0,o.kt)("a",{parentName:"td",href:"/tv-automation-server-core/docs/main/features-and-configuration/prompter#control-using-nintendo-joycon-gamepad"},"See configuration details"))))),(0,o.kt)("h4",{id:"control-using-mouse-scroll-wheel"},"Control using mouse ","(","scroll wheel",")"),(0,o.kt)("p",null,"The prompter can be controlled in multiple ways when using the scroll wheel:"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?controlmode=normal")),(0,o.kt)("td",{parentName:"tr",align:"left"},'Scrolling of the mouse works as "normal scrolling"')),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?controlmode=speed")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Scrolling of the mouse changes the speed of scolling. Left-click to toggle, right-click to rewind")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"?controlmode=smoothscroll")),(0,o.kt)("td",{parentName:"tr",align:"left"},'Scrolling the mouse wheel starts continous scrolling. Small speed adjustments can then be made by nudging the scroll wheel. Stop the scrolling by making a "larger scroll" on the wheel.')))),(0,o.kt)("p",null,"has several operating modes, described further below. All modes are intended to be controlled by a computer mouse or similar, such as a presenter tool."),(0,o.kt)("h4",{id:"control-using-keyboard"},"Control using keyboard"),(0,o.kt)("p",null,'Keyboard control is intended to be used when having a "keyboard"-device, such as a presenter tool.'),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Scroll up"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Scroll down"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Arrow Up")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Arrow Down"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Arrow Left")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Arrow Right"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Page Up")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Page Down"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"}),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Space"))))),(0,o.kt)("h4",{id:"control-using-contour-shuttlexpress-or-x-keys-modeshuttlekeyboard"},"Control using Contour ShuttleXpress or X-keys ","(",(0,o.kt)("em",{parentName:"h4"},"?mode=shuttlekeyboard"),")"),(0,o.kt)("p",null,"This mode is intended to be used when having a Contour ShuttleXpress or X-keys device, configured to work as a keyboard device. These devices have jog/shuttle wheels, and their software/firmware allow them to map scroll movement to keystrokes from any key-combination. Since we only listen for key combinations, it effectively means that any device outputing keystrokes will work in this mode."),(0,o.kt)("p",null,"From Release 30, the speedMap has a prefix: ",(0,o.kt)("strong",{parentName:"p"},"shuttle","_")," ","(","i.e. shuttle","_","speedMap",")"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Key combination"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Function"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F1")," ... ",(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F7")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Set speed to +1 ... +7 ","(","Scroll down",")")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F1")," ... ",(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F7")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Set speed to -1 ... -7 ","(","Scroll up",")")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"+")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Increase speed")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"-")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Decrease speed")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F8"),", ",(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"PageDown")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Jump to next Segment and stop")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F9"),", ",(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"PageUp")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Jump to previous Segment and stop")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F10")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Jump to top of Script and stop")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F11")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Jump to Live and stop")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"Ctrl")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Alt")," ",(0,o.kt)("inlineCode",{parentName:"td"},"Shift")," ",(0,o.kt)("inlineCode",{parentName:"td"},"F12")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Jump to next Segment and stop")))),(0,o.kt)("p",null,"Configuration files that can be used in their respective driver software:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/nrkno/tv-automation-server-core/blob/release26/resources/prompter_layout_shuttlexpress.pref"},"Contour ShuttleXpress")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/nrkno/tv-automation-server-core/blob/release26/resources/prompter_layout_xkeys.mw3"},"X-keys"))),(0,o.kt)("h4",{id:""}),(0,o.kt)("h4",{id:"control-using-midi-input-modepedal"},"Control using midi input ","(",(0,o.kt)("em",{parentName:"h4"},"?mode=pedal"),")"),(0,o.kt)("p",null,"This mode listens to MIDI CC-notes on channel 8, expecting a linear range like i.e. 0-127. Sutiable for use with expression pedals, but any MIDI controller can be used. The mode picks the first connected MIDI device, and supports hot-swapping ","(","you can remove and add the device without refreshing the browser",")","."),(0,o.kt)("p",null,"If you want to use traditional analogue pedals with 5 volt TRS connection, a converter such as the ",(0,o.kt)("em",{parentName:"p"},"Beat Bars EX2M")," will work well."),(0,o.kt)("p",null,"From Release 30, the parameters for the pedal have a prefix: ",(0,o.kt)("strong",{parentName:"p"},"pedal","_")," ","(","i.e. pedal","_","speedMap, pedal","_","reverseSpeedMap etc",")"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Default"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Array of numbers"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Speeds to scroll by ","(","px. pr. frame - approx 60fps",")"," when scrolling forwards. The beginning of the forwards-range maps to the first number in this array, and the end of the forwards-range map to the end of this array. All values in between are being interpolated using a spline curve."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 5, 7, 9, 12, 17, 19, 30]"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"reverseSpeedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Array of numbers"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Same as ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")," but for the backwards range."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"[10, 30, 50]"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeRevMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The end of the backwards-range, full speed backwards."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The beginning of the backwards-range."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"35"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The minimum input to run forward, the start of the forward-range ","(","min speed",")",'. This is also the end of any "deadband" you want filter out before starting moving forwards.'),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"80"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeFwdMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The maximum input, the end of the forward-range ","(","max speed",")"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"127"))))),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMin")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeRevMin")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMax")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMin")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeFwdMax")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMax"))),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Yamaha FC7 mapped for both a forward (80-127) and backwards (0-35) range.",src:a(3449).Z})),(0,o.kt)("p",null,"The default values allow for both going forwards and backwards. This matches the ",(0,o.kt)("em",{parentName:"p"},"Yamaha FC7")," expression pedal. The default values create a forward-range from 80-127, a neutral zone from 35-80 and a reverse-range from 0-35."),(0,o.kt)("p",null,"Any movement within forward range will map to the ",(0,o.kt)("em",{parentName:"p"},"speedMap")," with interpolation between any numbers in the ",(0,o.kt)("em",{parentName:"p"},"speedMap"),". You can turn on ",(0,o.kt)("inlineCode",{parentName:"p"},"?debug=1")," to see how your input maps to an output. This helps during calibration. Similarly, any movement within the backwards rage maps to the ",(0,o.kt)("em",{parentName:"p"},"reverseSpeedMap.")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Calibration guide:")),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"th"},"Symptom")),(0,o.kt)("th",{parentName:"tr",align:"left"},"Adjustment"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"I can\'t rest my foot without it starting to run"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Increase ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"I have to push too far before it starts moving"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Decrease ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"It starts out fine, but runs too fast if I push too hard"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Add more weight to the lower part of the ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")," by adding more low values early in the map, compared to the large numbers in the end.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"I have to go too far back to reverse"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Increse ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMin"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"As I find a good speed, it varies a bit in speed up/down even if I hold my foot still"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Use ",(0,o.kt)("inlineCode",{parentName:"td"},"?debug=1")," to see what speed is calculated in the position the presenter wants to rest the foot in. Add more of that number in a sequence in the ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")," to flatten out the speed curve, i.e. ",(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 4, 4, 4, 5, ...]"))))),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Note:")," The default values are set up to work with the ",(0,o.kt)("em",{parentName:"p"},"Yamaha FC7")," expression pedal, and will probably not be good for pedals with one continuous linear range from fully released to fully depressed. A suggested configuration for such pedals ","(","i.e. the ",(0,o.kt)("em",{parentName:"p"},"Mission Engineering EP-1"),")"," will be like: "),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Suggestion"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 5, 7, 9, 12, 17, 19, 30]"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"reverseSpeedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"-2"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeRevMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"-1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeFwdMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"127"))))),(0,o.kt)("h4",{id:"control-using-nintendo-joycon-modejoycon"},"Control using Nintendo Joycon ","(",(0,o.kt)("em",{parentName:"h4"},"?mode=joycon"),")"),(0,o.kt)("p",null,"This mode uses the browsers Gamapad API and polls connected Joycons for their states on button-presses and joystick inputs."),(0,o.kt)("p",null,"The Joycons can operate in 3 modes, the L-stick, the R-stick or both L+R sticks together. Reconnections and jumping between modes works, with one known limitation: ",(0,o.kt)("strong",{parentName:"p"},"Transition from L+R to a single stick blocks all input, and requires a reconnect of the sticks you want to use.")," This seems to be a bug in either the Joycons themselves or in the Gamepad API in general."),(0,o.kt)("p",null,"From Release 30, the parameters for the JoyCon have a prefix: ",(0,o.kt)("strong",{parentName:"p"},"joycon","_")," ","(","i.e. joycon","_","speedMap, joycon","_","reverseSpeedMap etc",")"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},"Query parameter"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"left"},"Default"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Array of numbes"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Speeds to scroll by ","(","px. pr. frame - approx 60fps",")"," when scrolling forwards. The beginning of the forwards-range maps to the first number in this array, and thee end of the forwards-range map to the end of this array. All values in between are being interpolated in a spline curve."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 5, 8, 12, 30]"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"reverseSpeedMap")),(0,o.kt)("td",{parentName:"tr",align:"left"},"Array of numbers"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Same as ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")," but for the backwards range."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 5, 8, 12, 30]"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeRevMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The end of the backwards-range, full speed backwards."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"-1"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMin")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The beginning of the backwards-range."),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"-0.25"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The minimum input to run forward, the start of the forward-range ","(","min speed",")",'. This is also the end of any "deadband" you want filter out before starting moving forwards.'),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"0.25"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"rangeFwdMax")),(0,o.kt)("td",{parentName:"tr",align:"left"},"number"),(0,o.kt)("td",{parentName:"tr",align:"left"},"The maximum input, the end of the forward-range ","(","max speed",")"),(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("inlineCode",{parentName:"td"},"1"))))),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMin")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeRevMin")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMax")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMin")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rangeFwdMax")," has to be greater than ",(0,o.kt)("inlineCode",{parentName:"li"},"rangeNeutralMax"))),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Nintendo Swith Joycons",src:a(3939).Z})),(0,o.kt)("p",null,"You can turn on ",(0,o.kt)("inlineCode",{parentName:"p"},"?debug=1")," to see how your input maps to an output."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Button map:")),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"th"},"Button")),(0,o.kt)("th",{parentName:"tr",align:"left"},"Acton"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"L2 / R2"),(0,o.kt)("td",{parentName:"tr",align:"left"},'Go to the "On-air" story')),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"L / R"),(0,o.kt)("td",{parentName:"tr",align:"left"},'Go to the "Next" story')),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"Up / X"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Go top the top")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"Left / Y"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Go to the previous story")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},"Right / A"),(0,o.kt)("td",{parentName:"tr",align:"left"},"Go to the following story")))),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Calibration guide:")),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"left"},(0,o.kt)("strong",{parentName:"th"},"Symptom")),(0,o.kt)("th",{parentName:"tr",align:"left"},"Adjustment"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"The prompter drifts upwards when I\'m not doing anything"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Decrease ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMin"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"The prompter drifts downwards when I\'m not doing anything"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Increase ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeNeutralMax"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"It starts out fine, but runs too fast if I move too far"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Add more weight to the lower part of the ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap / reverseSpeedMap")," by adding more low values early in the map, compared to the large numbers in the end.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"I can\'t reach max speed backwards"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Increase ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeRevMin"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"I can\'t reach max speed forwards"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Decrease ",(0,o.kt)("inlineCode",{parentName:"td"},"rangeFwdMax"))),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"left"},(0,o.kt)("em",{parentName:"td"},'"As I find a good speed, it varies a bit in speed up/down even if I hold my finger still"')),(0,o.kt)("td",{parentName:"tr",align:"left"},"Use ",(0,o.kt)("inlineCode",{parentName:"td"},"?debug=1")," to see what speed is calculated in the position the presenter wants to rest their finger in. Add more of that number in a sequence in the ",(0,o.kt)("inlineCode",{parentName:"td"},"speedMap")," to flatten out the speed curve, i.e. ",(0,o.kt)("inlineCode",{parentName:"td"},"[1, 2, 3, 4, 4, 4, 4, 5, ...]"))))))}s.isMDXComponent=!0},3939:function(t,e,a){e.Z=a.p+"assets/images/nintendo-switch-joycons-a7a9d89b8dbff160ea255172e4aaf43c.png"},3343:function(t,e,a){e.Z=a.p+"assets/images/prompter-view-indicators-7a51cbcd52654c02fae6efd878b2680f.png"},6076:function(t,e,a){e.Z=a.p+"assets/images/prompter-view-95521a8b78dba5d16a0c4568924d2992.png"},3449:function(t,e,a){e.Z=a.p+"assets/images/yamaha-fc7-ea6ec40c643076ca65f8edc7ab975c5e.png"}}]);