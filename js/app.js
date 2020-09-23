const loaderMethods = (function () {
  return {
    create(element) {
      const $mainContent = $('.main-content');
      const $loader = $('<div></div>').addClass('loader');
      const $spinner = $('<div></div>').addClass('spinner');
      $loader.append($spinner);
      if (element) {
        $(element).append($loader);
      } else {
        $mainContent.append($loader);
      }
    },
    remove() {
      $('.loader').remove();
    },
  };
})();

$(function () {
  loaderMethods.create();

  // Save sidebar state (open/close) to local storage
  function updateSidebarState() {
    // If sidebarState is not set, we initialized it to 'closed' (default sidebar state)
    const sidebarState = localStorage.getItem('sidebarState')
      ? localStorage.getItem('sidebarState')
      : 'closed';
    if (sidebarState === 'open') $('.sidebar').addClass('open');
    else $('.sidebar').removeClass('open');
  }

  // Update sidebarState
  updateSidebarState();

  // Toggle sidebar
  $('.sidebar-toggle').on('click', function toggleSidebar() {
    const $sidebar = $('.sidebar');

    if ($sidebar.hasClass('open')) {
      $sidebar.removeClass('open');
      localStorage.setItem('sidebarState', 'closed');
    } else {
      $sidebar.addClass('open');
      localStorage.setItem('sidebarState', 'open');
    }
  });

  function applyTransitions() {
    const $appMain = $('#app-main');
    const $sidebar = $('#sidebar');
    const $sidebarToggle = $('#sidebar-toggle');

    $appMain.addClass('transition-5');
    $sidebar.addClass('transition-5');
    $sidebarToggle.addClass('transition-3');
  }

  applyTransitions();
});
