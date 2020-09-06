const loaderMethods = (function() {
  // Loader
  function loader(element) {
    const $mainContent = $('.main-content');
    const $loader = $('<div></div>').addClass('loader');
    const $spinner = $('<div></div>').addClass('spinner');
    $loader.append($spinner);
    element ? $(element).append($loader) : $($mainContent).append($loader);
  }
  
  // remove loader
  function removeLoader() {
    $('.loader').remove();
  }

  return {
    create: loader,
    remove: removeLoader
  }

})();

$(document).ready(function () { 

  // Save sidebar state (open/close) to local storage
  function updateSidebarState() {
    const sidebarState = localStorage.getItem('sidebarState') ? localStorage.getItem('sidebarState') : 'open';
    if (sidebarState === 'open') $('.sidebar').removeClass('collapsed');
    else $('.sidebar').addClass('collapsed');
  }
  
  // Update sidebarState
  updateSidebarState();

  // Toggle sidebar
  $('.sidebar-toggle').click(function toggleSidebar() {
    const $sidebar = $('.sidebar');

    if ($sidebar.hasClass('collapsed')) {
      $sidebar.removeClass('collapsed');
      localStorage.setItem('sidebarState', 'open');
    } else {
      $sidebar.addClass('collapsed');
      localStorage.setItem('sidebarState', 'closed');
    }
  })

});