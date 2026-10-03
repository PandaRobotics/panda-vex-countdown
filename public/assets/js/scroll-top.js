(() => {
  const button=document.querySelector('#floatingTop');
  button?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();
