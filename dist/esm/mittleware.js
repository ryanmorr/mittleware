/*! @ryanmorr/mittleware v0.1.1 | https://github.com/ryanmorr/mittleware */
function t(){const t=[];return{use(e){return t.push(e),this},dispatch:e=>new Promise(((s,n)=>{if(t[0]){let o=0;const r=()=>{const u=t[++o];u?u(e,r,s,n):s(e)};t[o](e,r,s,n)}else s(e)}))}}export{t as default};
