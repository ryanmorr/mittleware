/*! @ryanmorr/mittleware v0.1.1 | https://github.com/ryanmorr/mittleware */
"use strict";module.exports=function(){const s=[];return{use(t){return s.push(t),this},dispatch:t=>new Promise(((e,n)=>{if(s[0]){let o=0;const r=()=>{const u=s[++o];u?u(t,r,e,n):e(t)};s[o](t,r,e,n)}else e(t)}))}};
