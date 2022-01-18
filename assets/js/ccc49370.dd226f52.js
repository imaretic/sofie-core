"use strict";(self.webpackChunksofie_documentation=self.webpackChunksofie_documentation||[]).push([[6103],{4884:function(e,t,a){a.d(t,{Z:function(){return E}});var n=a(808),r=a(7378),l=a(8944),i=a(29),o=a(4142),c="sidebar_3pri",s="sidebarItemTitle_2iko",m="sidebarItemList_3aXd",u="sidebarItem_2HDj",d="sidebarItemLink_VIvG",g="sidebarItemLinkActive_34mL",p=a(1787);function v(e){var t=e.sidebar;return 0===t.items.length?null:r.createElement("nav",{className:(0,l.Z)(c,"thin-scrollbar"),"aria-label":(0,p.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},r.createElement("div",{className:(0,l.Z)(s,"margin-bottom--md")},t.title),r.createElement("ul",{className:m},t.items.map((function(e){return r.createElement("li",{key:e.permalink,className:u},r.createElement(o.Z,{isNavLink:!0,to:e.permalink,className:d,activeClassName:g},e.title))}))))}var f=a(7205),h=["sidebar","toc","children"];var E=function(e){var t=e.sidebar,a=e.toc,o=e.children,c=(0,n.Z)(e,h),s=t&&t.items.length>0;return r.createElement(i.Z,c,r.createElement("div",{className:"container margin-vert--lg"},r.createElement("div",{className:"row"},s&&r.createElement("aside",{className:"col col--3"},r.createElement(v,{sidebar:t})),r.createElement("main",{className:(0,l.Z)("col",{"col--7":s,"col--9 col--offset-1":!s}),itemScope:!0,itemType:"http://schema.org/Blog"},o),a&&r.createElement("div",{className:"col col--2"},r.createElement(f.Z,{toc:a})))))}},3179:function(e,t,a){a.d(t,{Z:function(){return _}});var n=a(7378),r=a(8944),l=a(5318),i=a(1787),o=a(4142),c=a(8948),s=a(5013),m=a(775),u=a(9169),d="blogPostTitle_28zC",g="blogPostData_2ipU",p="blogPostDetailsFull_2LNT",v=a(749),f="image_2B_A";var h=function(e){var t=e.author,a=t.name,r=t.title,l=t.url,i=t.imageURL;return n.createElement("div",{className:"avatar margin-bottom--sm"},i&&n.createElement(o.Z,{className:"avatar__photo-link avatar__photo",href:l},n.createElement("img",{className:f,src:i,alt:a})),a&&n.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},n.createElement("div",{className:"avatar__name"},n.createElement(o.Z,{href:l,itemProp:"url"},n.createElement("span",{itemProp:"name"},a))),r&&n.createElement("small",{className:"avatar__subtitle",itemProp:"description"},r)))},E="authorCol_3dH_";function b(e){var t=e.authors,a=e.assets;return 0===t.length?n.createElement(n.Fragment,null):n.createElement("div",{className:"row margin-top--md margin-bottom--sm"},t.map((function(e,t){var l;return n.createElement("div",{className:(0,r.Z)("col col--6",E),key:t},n.createElement(h,{author:Object.assign({},e,{imageURL:null!=(l=a.authorsImageUrls[t])?l:e.imageURL})}))})))}var _=function(e){var t,a,f,h,E=(f=(0,s.c2)().selectMessage,function(e){var t=Math.ceil(e);return f(t,(0,i.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:t}))}),_=(0,c.C)().withBaseUrl,N=e.children,Z=e.frontMatter,k=e.assets,P=e.metadata,T=e.truncated,y=e.isBlogPostPage,L=void 0!==y&&y,w=P.date,C=P.formattedDate,I=P.permalink,B=P.tags,A=P.readingTime,R=P.title,x=P.editUrl,U=P.authors,M=null!=(t=k.image)?t:Z.image;return n.createElement("article",{className:L?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},(h=L?"h1":"h2",n.createElement("header",null,n.createElement(h,{className:d,itemProp:"headline"},L?R:n.createElement(o.Z,{itemProp:"url",to:I},R)),n.createElement("div",{className:(0,r.Z)(g,"margin-vert--md")},n.createElement("time",{dateTime:w,itemProp:"datePublished"},C),void 0!==A&&n.createElement(n.Fragment,null," \xb7 ",E(A))),n.createElement(b,{authors:U,assets:k}))),M&&n.createElement("meta",{itemProp:"image",content:_(M,{absolute:!0})}),n.createElement("div",{className:"markdown",itemProp:"articleBody"},n.createElement(l.Zo,{components:m.Z},N)),(B.length>0||T)&&n.createElement("footer",{className:(0,r.Z)("row docusaurus-mt-lg",(a={},a[p]=L,a))},B.length>0&&n.createElement("div",{className:(0,r.Z)("col",{"col--9":!L})},n.createElement(v.Z,{tags:B})),L&&x&&n.createElement("div",{className:"col margin-top--sm"},n.createElement(u.Z,{editUrl:x})),!L&&T&&n.createElement("div",{className:"col col--3 text--right"},n.createElement(o.Z,{to:P.permalink,"aria-label":"Read more about "+R},n.createElement("b",null,n.createElement(i.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}},2240:function(e,t,a){a.r(t),a.d(t,{default:function(){return u}});var n=a(7378),r=a(1956),l=a(4884),i=a(3179),o=a(1787),c=a(4142);var s=function(e){var t=e.nextItem,a=e.prevItem;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,o.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},n.createElement("div",{className:"pagination-nav__item"},a&&n.createElement(c.Z,{className:"pagination-nav__link",to:a.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(o.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")),n.createElement("div",{className:"pagination-nav__label"},"\xab ",a.title))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},t&&n.createElement(c.Z,{className:"pagination-nav__link",to:t.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(o.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post")),n.createElement("div",{className:"pagination-nav__label"},t.title," \xbb"))))},m=a(5013);var u=function(e){var t,a=e.content,o=e.sidebar,c=a.frontMatter,u=a.assets,d=a.metadata,g=d.title,p=d.description,v=d.nextItem,f=d.prevItem,h=d.date,E=d.tags,b=d.authors,_=c.hide_table_of_contents,N=c.keywords,Z=null!=(t=u.image)?t:c.image;return n.createElement(l.Z,{wrapperClassName:m.kM.wrapper.blogPages,pageClassName:m.kM.page.blogPostPage,sidebar:o,toc:!_&&a.toc?a.toc:void 0},n.createElement(r.Z,{title:g,description:p,keywords:N,image:Z},n.createElement("meta",{property:"og:type",content:"article"}),n.createElement("meta",{property:"article:published_time",content:h}),b.some((function(e){return e.url}))&&n.createElement("meta",{property:"article:author",content:b.map((function(e){return e.url})).filter(Boolean).join(",")}),E.length>0&&n.createElement("meta",{property:"article:tag",content:E.map((function(e){return e.label})).join(",")})),n.createElement(i.Z,{frontMatter:c,assets:u,metadata:d,isBlogPostPage:!0},n.createElement(a,null)),(v||f)&&n.createElement(s,{nextItem:v,prevItem:f}))}},9169:function(e,t,a){a.d(t,{Z:function(){return d}});var n=a(7378),r=a(1787),l=a(5773),i=a(808),o=a(8944),c="iconEdit_1CBY",s=["className"],m=function(e){var t=e.className,a=(0,i.Z)(e,s);return n.createElement("svg",(0,l.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,o.Z)(c,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))},u=a(5013);function d(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:u.kM.common.editThisPage},n.createElement(m,null),n.createElement(r.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},7205:function(e,t,a){a.d(t,{r:function(){return g},Z:function(){return p}});var n=a(7378),r=a(8944),l=a(5013);function i(e){var t=e.getBoundingClientRect();return t.top===t.bottom?i(e.parentNode):t}function o(e){var t,a=e.anchorTopOffset,n=Array.from(document.querySelectorAll(".anchor.anchor__h2, .anchor.anchor__h3")),r=n.find((function(e){return i(e).top>=a}));return r?function(e){return e.top>0&&e.bottom<window.innerHeight/2}(i(r))?r:null!=(t=n[n.indexOf(r)-1])?t:null:n[n.length-1]}function c(){var e=(0,n.useRef)(0),t=(0,l.LU)().navbar.hideOnScroll;return(0,n.useEffect)((function(){e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}var s=function(e){var t=(0,n.useRef)(void 0),a=c();(0,n.useEffect)((function(){var n=e.linkClassName,r=e.linkActiveClassName;function l(){var e=function(e){return Array.from(document.getElementsByClassName(e))}(n),l=o({anchorTopOffset:a.current}),i=e.find((function(e){return l&&l.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)}));e.forEach((function(e){!function(e,a){if(a){var n;t.current&&t.current!==e&&(null==(n=t.current)||n.classList.remove(r)),e.classList.add(r),t.current=e}else e.classList.remove(r)}(e,e===i)}))}return document.addEventListener("scroll",l),document.addEventListener("resize",l),l(),function(){document.removeEventListener("scroll",l),document.removeEventListener("resize",l)}}),[e,a])},m="tableOfContents_3J2a",u="table-of-contents__link",d={linkClassName:u,linkActiveClassName:"table-of-contents__link--active"};function g(e){var t=e.toc,a=e.isChild;return t.length?n.createElement("ul",{className:a?"":"table-of-contents table-of-contents__left-border"},t.map((function(e){return n.createElement("li",{key:e.id},n.createElement("a",{href:"#"+e.id,className:u,dangerouslySetInnerHTML:{__html:e.value}}),n.createElement(g,{isChild:!0,toc:e.children}))}))):null}var p=function(e){var t=e.toc;return s(d),n.createElement("div",{className:(0,r.Z)(m,"thin-scrollbar")},n.createElement(g,{toc:t}))}},6839:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(7378),r=a(8944),l=a(4142),i="tag__u1m",o="tagRegular_Kusr",c="tagWithCount_2eub";var s=function(e){var t,a=e.permalink,s=e.name,m=e.count;return n.createElement(l.Z,{href:a,className:(0,r.Z)(i,(t={},t[o]=!m,t[c]=m,t))},s,m&&n.createElement("span",null,m))}},749:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(7378),r=a(8944),l=a(1787),i=a(6839),o="tags_1YZR",c="tag_3GNh";function s(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(l.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,r.Z)(o,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:c},n.createElement(i.Z,{name:t,permalink:a}))}))))}}}]);