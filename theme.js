// Theme toggle helper for Universal Market.
(function(){
  function setTheme(theme){
    document.documentElement.dataset.theme = theme;
    try{ localStorage.setItem('um_theme', theme); }catch{}
  }

  window.UniMarketTheme = { setTheme };
})();

