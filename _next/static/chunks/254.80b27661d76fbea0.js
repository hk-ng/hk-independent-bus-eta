"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[254],{2638:function(g,b,a){var c=a(5318);b.Z=void 0;var d=c(a(4938)),e=a(5893),f=(0,d.default)((0,e.jsx)("path",{d:"M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"}),"MyLocation");b.Z=f},4254:function(k,f,a){a.r(f);var h=a(4051),c=a.n(h),l=a(5893),m=a(7294),i=a(5152),d=a.n(i),n=a(5243),j=a(7357),g=a(948),o=a(1567),p=a(2970),q=a(2638),r=a(8473),s=a(5715);function t(c,d,e,f,g,h,i){try{var a=c[h](i),b=a.value}catch(j){e(j);return}a.done?d(b):Promise.resolve(b).then(f,g)}function e(a){return function(){var b=this,c=arguments;return new Promise(function(e,f){var g=a.apply(b,c);function d(a){t(g,e,f,d,h,"next",a)}function h(a){t(g,e,f,d,h,"throw",a)}d(void 0)})}}function u(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function v(d){for(var a=1;a<arguments.length;a++){var c=null!=arguments[a]?arguments[a]:{},b=Object.keys(c);"function"==typeof Object.getOwnPropertySymbols&&(b=b.concat(Object.getOwnPropertySymbols(c).filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable}))),b.forEach(function(a){u(d,a,c[a])})}return d}var w=d()(e(c().mark(function b(){return c().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,a.e(149).then(a.bind(a,3149));case 2:return b.abrupt("return",b.sent.Marker);case 3:case"end":return b.stop()}},b)})),{loadableGenerated:{webpack:function(){return[3149]}},ssr:!1}),x=d()(e(c().mark(function b(){return c().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,a.e(149).then(a.bind(a,3149));case 2:return b.abrupt("return",b.sent.TileLayer);case 3:case"end":return b.stop()}},b)})),{loadableGenerated:{webpack:function(){return[3149]}},ssr:!1}),y=d()(e(c().mark(function b(){return c().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,a.e(149).then(a.bind(a,3149));case 2:return b.abrupt("return",b.sent.Polyline);case 3:case"end":return b.stop()}},b)})),{loadableGenerated:{webpack:function(){return[3149]}},ssr:!1}),z=d()(e(c().mark(function b(){return c().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,a.e(149).then(a.bind(a,3149));case 2:return b.abrupt("return",b.sent.Circle);case 3:case"end":return b.stop()}},b)})),{loadableGenerated:{webpack:function(){return[3149]}},ssr:!1}),A=function(){var a=(0,m.useContext)(p.Z),b=a.geolocation,c=a.geoPermission;return"granted"!==c?null:(0,l.jsx)(z,{center:(0,r.bf)(b),radius:25})},B=function(a){var b=a.onClick;return(0,l.jsx)("div",{className:"leaflet-bottom leaflet-right",children:(0,l.jsx)(G,{className:"".concat(E.centerControlContainer," leaflet-control leaflet-bar"),onClick:b,children:(0,l.jsx)(q.Z,{className:E.centerControl})})})};f.default=function(d){var a=d.stops,b=d.stopIdx,g=d.onMarkerClick,c=(0,m.useContext)(p.Z),e=c.geolocation,h=c.geoPermission,i=c.updateGeoPermission,j=c.colorMode,k=(0,o.$)().i18n,f=(0,m.useState)(null),q=f[0],t=f[1],u=(0,m.useRef)({initialCenter:a[b]?a[b].location:(0,r.bf)(),currentStopCenter:a[b]?a[b].location:(0,r.bf)(),center:a[b]?a[b].location:(0,r.bf)(),isFollow:!1,stops:a,stopIdx:b});(0,m.useEffect)(function(){h=u.current.stops===a&&u.current.stopIdx===b&&u.current.isFollow,c=u.current.stops===a&&u.current.stopIdx===b&&h?e:a[b]?a[b].location:(0,r.bf)();var h,c,d,f,g=u.current.center;g===c||(0,r.pB)(c,g)||(u.current.stops!==a?null===(d=u.current.map)|| void 0===d||d.setView(c):null===(f=u.current.map)|| void 0===f||f.flyTo(c)),u.current=v({},u.current,{center:c,currentStopCenter:a[b]?a[b].location:(0,r.bf)(),stops:a,stopIdx:b,isFollow:h})},[a,b,e]),(0,m.useEffect)(function(){if(q){u.current=v({},u.current,{map:q});var a=function(){u.current=v({},u.current,{center:u.current.currentStopCenter,isFollow:!1})};return null==q||q.on({dragend:a,dragstart:a}),null==q||q.setView(u.current.center),console.log("try invalidateSize"),null==q||q.invalidateSize(),function(){q.off({dragstart:a,dragend:a})}}},[q]);var z=(0,m.useCallback)(function(){if("granted"===h){var a;null===(a=u.current.map)|| void 0===a||a.flyTo(e),u.current=v({},u.current,{center:e,isFollow:!0})}else"denied"!==h&&(u.current=v({},u.current,{isFollow:!0}),i("opening"))},[h,e,i]),G=(0,m.useMemo)(function(){return a.map(function(a,c){return(0,l.jsx)(w,{position:a.location,icon:D({active:c===b,passed:c<b}),alt:"".concat(c,". ").concat(a.name[k.language]),eventHandlers:{click:function(a){console.log("onMarkerClick",c,a),g(c,a)}}},"".concat(a.location.lng,"-").concat(a.location.lat,"-").concat(c))})},[k.language,g,b,a]),H=(0,m.useMemo)(function(){return a.reduce(function(a,c,b,d){if(0===b)return a;var e=d[b-1];return void 0===e?(console.log("wat?",d,b),a):(a.push((0,l.jsx)(y,{positions:[C(e.location),C(c.location)],color:"#FF9090"},"".concat(c.location.lng,"-").concat(c.location.lat,"-line-").concat(b))),a)},[])},[a]);return(0,l.jsx)(F,{id:"route-map",className:E.mapContainerBox,children:(0,l.jsxs)(s.h,{center:u.current.initialCenter,zoom:16,scrollWheelZoom:!1,className:E.mapContainer,ref:t,children:[(0,l.jsx)(x,{crossOrigin:"anonymous",detectRetina:!0,maxZoom:n.Browser.retina?20:19,maxNativeZoom:18,keepBuffer:10,updateWhenIdle:!1,attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"light"===j?"https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png":"https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"}),G,H,(0,l.jsx)(A,{}),(0,l.jsx)(B,{onClick:z})]})})};var C=function(a){var b=a.lat,c=a.lng;return[b,c]},D=function(a){var b=a.active,c=a.passed;return(0,n.divIcon)({iconSize:[25,41],iconAnchor:[12.5,41],className:"".concat(E.marker," ").concat(b?E.active:""," ").concat(c?E.passed:"")})},b="routeMap",E={mapContainerBox:"".concat(b,"-mapContainerBox"),mapContainer:"".concat(b,"-mapContainer"),centerControlContainer:"".concat(b,"-centerControlContainer"),centerControl:"".concat(b,"-centerControl"),marker:"".concat(b,"-marker"),active:"".concat(b,"-active"),passed:"".concat(b,"-passed")},F=(0,g.ZP)(j.Z)(function(b){var a,c=b.theme;return u(a={},"&.".concat(E.mapContainerBox),{height:"30vh",filter:"dark"===c.palette.mode?"brightness(0.8)":"none"}),u(a,"& .".concat(E.mapContainer),{height:"30vh"}),u(a,"& .".concat(E.marker),{width:"25px",height:"41px",zIndex:618,outline:"none",filter:"hue-rotate(130deg)",backgroundImage:"url(/icons/marker-icon-2x.png)",backgroundSize:"cover"}),u(a,"& .".concat(E.active),{animation:"blinker 2s linear infinite"}),u(a,"& .".concat(E.passed),{filter:"grayscale(100%)"}),a}),G=(0,g.ZP)("div")(function(b){var a;return b.theme,u(a={},"& .".concat(E.centerControl),{padding:"5px",color:"black"}),u(a,"&.".concat(E.centerControlContainer),{background:"white",height:"28px",marginBottom:"20px !important",marginRight:"5px !important"}),a})},1410:function(e,b,a){a.d(b,{Hb:function(){return f},UO:function(){return h},mE:function(){return i},sj:function(){return g}});var c=a(7294);function f(a){return Object.freeze({__version:1,map:a})}function g(a,b){return Object.freeze({...a,...b})}let d=(0,c.createContext)(null),h=d.Provider;function i(){let a=(0,c.useContext)(d);if(null==a)throw new Error("No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>");return a}},5715:function(d,b,a){a.d(b,{h:function(){return h}});var e=a(1410),f=a(5243),c=a(7294);function g(){return(g=Object.assign||function(d){for(var a=1;a<arguments.length;a++){var b=arguments[a];for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(d[c]=b[c])}return d}).apply(this,arguments)}let h=(0,c.forwardRef)(function({bounds:o,boundsOptions:p,center:q,children:b,className:d,id:h,placeholder:i,style:j,whenReady:r,zoom:s,...t},k){let[l]=(0,c.useState)({className:d,id:h,style:j}),[a,u]=(0,c.useState)(null);(0,c.useImperativeHandle)(k,()=>a?.map??null,[a]);let m=(0,c.useCallback)(c=>{if(null!==c&&null===a){let b=new f.Map(c,t);null!=q&&null!=s?b.setView(q,s):null!=o&&b.fitBounds(o,p),null!=r&&b.whenReady(r),u((0,e.Hb)(b))}},[]);(0,c.useEffect)(()=>()=>{a?.map.remove()},[]);let n=a?c.createElement(e.UO,{value:a},b):i??null;return c.createElement("div",g({},l,{ref:m}),n)})}}])