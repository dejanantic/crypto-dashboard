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