if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let c={};const o=e=>n(e,a),d={module:{uri:a},exports:c,require:o};i[a]=Promise.all(r.map((e=>d[e]||o(e)))).then((e=>(s(...e),c)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BhXzVDbJ.js",revision:null},{url:"assets/index-Deu6Bxm2.css",revision:null},{url:"favicon.png",revision:"6cd6ace1413393595a48ac5a98446a54"},{url:"index.html",revision:"e6d894e6cd959181f23e5febf76cec5c"},{url:"pwa-192x192.png",revision:"7387dda6ebd294285b604a9af46632b9"},{url:"pwa-512x512.png",revision:"6cd6ace1413393595a48ac5a98446a54"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"favicon.png",revision:"6cd6ace1413393595a48ac5a98446a54"},{url:"pwa-192x192.png",revision:"7387dda6ebd294285b604a9af46632b9"},{url:"pwa-512x512.png",revision:"6cd6ace1413393595a48ac5a98446a54"},{url:"manifest.webmanifest",revision:"b456e5494b85813213f9840ccdd0ae7d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));