const search = window.location.search;
const spr = (search.length>0) ? window.location.search.split('?') : [];
const searchParams = spr.length > 0 ? spr[1].split('&') : [];
console.log(searchParams);