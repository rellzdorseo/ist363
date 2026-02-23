document.addEventListener('DOMContentLoaded', function() {

    M.Tabs.init(document.querySelectorAll('.tabs'));
    M.Collapsible.init(document.querySelectorAll('.collapsible'));
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'));
  
    // NEW: mobile nav + hero image effect + optional image zoom
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Parallax.init(document.querySelectorAll('.parallax'));
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  
    setTimeout(function() {
      document.getElementById('loader').style.display = "none";
    }, 800);
  });