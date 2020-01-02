(this["webpackJsonpvrms-client"]=this["webpackJsonpvrms-client"]||[]).push([[0],{20:function(e,t,a){e.exports=a(37)},25:function(e,t,a){},26:function(e,t,a){},32:function(e,t,a){},34:function(e,t,a){},35:function(e,t,a){},36:function(e,t,a){},37:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(17),l=a.n(r),s=(a(25),a(9)),i=a(1),m=a(2),o=(a(26),function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=(a[0],a[1],Object(n.useState)(null)),l=Object(i.a)(r,2);l[0],l[1];return Object(n.useEffect)((function(){}),[]),c.a.createElement("div",{className:"flexcenter-container"},c.a.createElement("div",{className:"home"},c.a.createElement("div",{className:"home-headers"},c.a.createElement("h1",null,"VRMS"),c.a.createElement("h2",null,"Volunteer Relationship Management System")),c.a.createElement("div",{className:"home-buttons"},c.a.createElement(m.b,{to:"/new"},"New"),c.a.createElement(m.b,{to:"/returning"},"Returning")),c.a.createElement("div",{className:"login-button"},c.a.createElement(m.b,{to:"/login"},"Login"))))}),u=(a(32),function(e){return c.a.createElement("div",{className:"nav-wrapper"},c.a.createElement("nav",{className:"navbar",role:"navigation","aria-label":"main navigation"},c.a.createElement("div",{className:"navbar-brand"},c.a.createElement(m.b,{to:"/"},"Home")),c.a.createElement("div",{className:"navbar-buttons"},c.a.createElement(m.b,{className:"navbar-button primary",to:"/new"},"New User"),c.a.createElement(m.b,{className:"navbar-button",to:"/returning"},"Returning User"),c.a.createElement(m.b,{className:"navbar-button primary",to:"/dashboard"},"Dashboard"))))}),p=a(4),v=a.n(p),f=a(8),E=function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=(a[0],a[1],Object(n.useState)([])),l=Object(i.a)(r,2),s=l[0],o=l[1],u=Object(n.useState)(!1),p=Object(i.a)(u,2);p[0],p[1];function E(){return(E=Object(f.a)(v.a.mark((function e(){var t,a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("/api/events");case 3:return t=e.sent,e.next=6,t.json();case 6:a=e.sent,o(a),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),alert(e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){!function(){E.apply(this,arguments)}()}),[]),c.a.createElement("div",{className:"flexcenter-container"},c.a.createElement("div",{className:"events-list"},c.a.createElement("ul",null,s.map((function(e,t){return c.a.createElement("li",{key:t},c.a.createElement("div",{key:t,className:"event"},c.a.createElement("h4",null,e.name),c.a.createElement(m.b,{to:"/event/".concat(e._id)},"Details")))})))))},h=function(e){return Object(n.useEffect)((function(){}),[]),c.a.createElement("div",{className:"flex-container"},c.a.createElement("div",{className:"dashboard"},c.a.createElement("div",{className:"events"},c.a.createElement(E,null))))},b=(a(34),function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=a[0],l=a[1],s=Object(n.useState)([]),o=Object(i.a)(s,2),u=o[0],p=o[1],E=Object(n.useState)(),h=Object(i.a)(E,2),b=h[0],d=h[1];function N(){return(N=Object(f.a)(v.a.mark((function t(){var a,n;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("/api/events/".concat(e.match.params.id));case 3:return a=t.sent,t.next=6,a.json();case 6:n=t.sent,p(n),d(n.checkInReady),t.next=13;break;case 11:t.prev=11,t.t0=t.catch(0);case 13:case"end":return t.stop()}}),t,null,[[0,11]])})))).apply(this,arguments)}function k(e){return g.apply(this,arguments)}function g(){return(g=Object(f.a)(v.a.mark((function t(a){return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.preventDefault(),t.prev=1,t.next=4,fetch("/api/events/".concat(e.match.params.id),{method:"PATCH",headers:{"Content-Type":"application/json"}}).then((function(e){e.ok&&(p(u),d(!b))}));case 4:t.next=9;break;case 6:t.prev=6,t.t0=t.catch(1),l(!r);case 9:case"end":return t.stop()}}),t,null,[[1,6]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){!function(){N.apply(this,arguments)}()}),[r,b]),c.a.createElement("div",{className:"flex-container"},c.a.createElement("div",{className:"event"},u&&u.location?c.a.createElement("div",{className:"event-headers"},c.a.createElement("h4",null,u.name),c.a.createElement("p",null,u.date),c.a.createElement("p",null,u.location.city),c.a.createElement("p",null,u.location.state)):c.a.createElement("div",null,"Loading..."),c.a.createElement("div",{className:"set-checkin-button"},u&&!1===b?c.a.createElement(m.b,{to:"/events/".concat(u._id),onClick:function(e){return k(e)}},"OPEN"):c.a.createElement(m.b,{to:"/events/".concat(u._id),onClick:function(e){return k(e)}},"CLOSE"))))}),d=function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=a[0],l=a[1],s=Object(n.useState)([]),o=Object(i.a)(s,2),u=o[0],p=o[1];function E(){return(E=Object(f.a)(v.a.mark((function e(){var t,a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,l(!0),e.next=4,fetch("/api/events?checkInReady=true");case 4:return t=e.sent,e.next=7,t.json();case 7:a=e.sent,p(a),l(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0),l(!1);case 16:case"end":return e.stop()}}),e,null,[[0,12]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){!function(){E.apply(this,arguments)}()}),[]),c.a.createElement("div",{className:"flex-container"},c.a.createElement("h3",null,"Events to check-in for below:"),r?c.a.createElement("div",null,"Loading..."):c.a.createElement("div",{className:"event-container"},u.length>0?u.map((function(t,a){return c.a.createElement("div",{key:a,className:"event"},c.a.createElement("div",{className:"event-headers"},c.a.createElement("h4",null,t.name),c.a.createElement("p",null,t.date),c.a.createElement("p",null,t.location.city),c.a.createElement("p",null,t.location.state)),e.newUser?c.a.createElement(m.b,{to:"/checkIn/newUser",className:"checkin-newuser-button"},"New User Check-In"):null,e.returningUser?c.a.createElement(m.b,{to:"/checkIn/returningUser",className:"checkin-newuser-button"},"Returning User Check-In"):null)})):c.a.createElement("div",null,"Check back later...")))},N=function(e){var t=Object(n.useState)(!0),a=Object(i.a)(t,2),r=a[0];a[1];return Object(n.useEffect)((function(){}),[]),c.a.createElement("div",{className:"flex-container"},c.a.createElement("div",{className:"new"},c.a.createElement("div",{className:"new-headers"},c.a.createElement("h3",null,"Welcome!"),c.a.createElement("h4",null,"Thanks for coming."),c.a.createElement(d,{newUser:r}))))},k=function(e){var t=Object(n.useState)(!0),a=Object(i.a)(t,2),r=a[0];a[1];return Object(n.useEffect)((function(){}),[]),c.a.createElement("div",{className:"flex-container"},c.a.createElement("div",{className:"returning"},c.a.createElement("div",{className:"returning-headers"},c.a.createElement("h3",null,"Welcome Back!"),c.a.createElement("h4",null,"We're happy to see you"),c.a.createElement(d,{returningUser:r}))))},g=function(e){return Object(n.useEffect)((function(){}),[]),c.a.createElement("div",{className:"flexcenter-container"},c.a.createElement("div",{className:"adminlogin"},c.a.createElement("div",{className:"adminlogin-headers"},c.a.createElement("h3",null,"Welcome Back!"),c.a.createElement("h4",null,"Please login below.")),c.a.createElement("div",{className:"adminlogin-buttons"})))},j=(a(35),function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=a[0],l=a[1],s=Object(n.useState)([]),m=Object(i.a)(s,2),o=(m[0],m[1]),u=Object(n.useState)(e.match.params.userType),p=Object(i.a)(u,2),E=p[0],h=(p[1],Object(n.useState)("")),b=Object(i.a)(h,2),d=b[0],N=b[1];function k(){return(k=Object(f.a)(v.a.mark((function e(){var t,a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,l(!0),e.next=4,fetch("/api/events?checkInReady=true");case 4:return t=e.sent,e.next=7,t.json();case 7:a=e.sent,o(a),l(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0),l(!1);case 16:case"end":return e.stop()}}),e,null,[[0,12]])})))).apply(this,arguments)}return Object(n.useEffect)((function(){!function(){k.apply(this,arguments)}()}),[]),c.a.createElement("div",{className:"flex-container"},"returningUser"===E?c.a.createElement("div",{className:"check-in-container"},c.a.createElement("div",{className:"check-in-headers"},c.a.createElement("h3",null,"Welcome Back!"),c.a.createElement("h4",null,"Answer a quick question to unlock the check-in button!")),c.a.createElement("div",{className:"check-in-form"},c.a.createElement("form",{className:"form-topics",onSubmit:function(e){return e.preventDefault()}},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("input",{placeholder:"Returning User Form",type:"text",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}})),c.a.createElement("div",{className:"form-input-button"},c.a.createElement("button",{type:"submit",className:"form-check-in-submit",onClick:function(e){return e.preventDefault}},"Check In"))))):null,"newUser"===E?c.a.createElement("div",{className:"check-in-container"},c.a.createElement("div",{className:"check-in-headers"},c.a.createElement("h3",null,"Welcome!"),c.a.createElement("h4",null,"Tell us a little bit about yourself!")),c.a.createElement("div",{className:"check-in-form"},c.a.createElement("form",{className:"form-check-in",onSubmit:function(e){return e.preventDefault()}},c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("label",{htmlFor:"first-name"},"First Name"),c.a.createElement("input",{type:"text",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}}))),c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("label",{htmlFor:"last-name"},"Last Name"),c.a.createElement("input",{type:"text",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}}))),c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("label",{htmlFor:"email"},"Email Address"),c.a.createElement("input",{type:"email",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}})),c.a.createElement("p",null,"(This allows easy use of the app. We'll never sell your data!)")),c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("label",{htmlFor:"current-role"},"Current Role"),c.a.createElement("input",{type:"text",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}}))),c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-text"},c.a.createElement("label",{htmlFor:"desired-role"},"Desired Role"),c.a.createElement("input",{type:"text",value:d.toString(),"aria-label":"topic",onChange:function(e){return N(e.target.value)}}))),r?c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-button"},c.a.createElement("button",{type:"submit",className:"form-check-in-submit",onClick:function(e){return e.preventDefault}},"Checking In..."))):c.a.createElement("div",{className:"form-row"},c.a.createElement("div",{className:"form-input-button"},c.a.createElement("button",{type:"submit",className:"form-check-in-submit",onClick:function(e){return e.preventDefault}},"Check In")))))):null)}),O=(a(36),[{path:"/",name:"home",Component:o},{path:"/dashboard",name:"dashboard",Component:h},{path:"/event/:id",name:"event",Component:b},{path:"/new",name:"new",Component:N},{path:"/returning",name:"returning",Component:k},{path:"/login",name:"login",Component:g},{path:"/checkIn/:userType",name:"checkIn",Component:j}]);var x=function(){return c.a.createElement("div",{className:"app"},c.a.createElement("div",{className:"app-container"},c.a.createElement(u,null),c.a.createElement("main",{role:"main",className:"main"},O.map((function(e){var t=e.path,a=e.Component;return c.a.createElement(s.a,{key:t,exact:!0,path:t,component:a})})))))};l.a.render(c.a.createElement(m.a,null,c.a.createElement(x,null)),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.1ce8fc7a.chunk.js.map