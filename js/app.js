$(document).ready(function () {

  // Update sidebarState
  updateSidebarState();

  function getCoinThumbnail(coin) {
    const $span = $('<span></span>');
    $span.addClass('coin-image mr-2');
    const $img = $('<img>');
    $img.attr({
      alt: `${coin.name} (${coin.symbol.toUpperCase()})`,
      src: `${coin.image}`,
      height: '25px'
    });
    $span.append($img);

    return $span;
  }

  function formatCoinPrice(price, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(price);
  }

  function formatNumber(number, locale = 'en-US') {
    return new Intl.NumberFormat(locale).format(number);
  }

  // CHART SETTINGS
  var chartOptions = {
    series: [{
      data: null
    }],
    chart: {
      type: 'line',
      height: '50px',
      width: '220px',
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: false
      },
    },
    stroke: {
      width: 1,
    },
    colors: null,
    tooltip: {
      enabled: false
    }
  }

  function displayCoins(data) {
    const $table = $('#crypto-table tbody');

    $.each(data, function addTableRow(i, coin) {
      const $row = $('<tr></tr>').attr('data-coin-id', coin.id);

      $('th').each(function populateRowWithData(i, th) {
        const $td = $('<td></td>');

        switch ($(th).attr('data-coin-data')) {
          case 'coin':
            $td.text(coin.symbol.toUpperCase());
            $td.addClass('font-weight-bold text-primary');
            $td.prepend(getCoinThumbnail(coin));
            // $td.append(getCoinSymbol(coin));
            $row.append($td);
            break;

          case 'price':
            const coinPrice = coin.current_price;
            const formattedValue = formatCoinPrice(coinPrice);
            $td.text(formattedValue);
            $td.addClass('text-right')
            $row.append($td);
            break;

          case '1-hour':
            const change1h = Number(coin.price_change_percentage_1h_in_currency).toFixed(2);
            // Apply green color if number is positive, red if negative
            Math.sign(change1h) >= 0 ? $td.addClass('text-success') : $td.addClass('text-danger');
            $td.text(`${change1h}%`);
            $td.addClass('text-right')
            $row.append($td);
            break;

          case '24-hours':
            const change24h = Number(coin.price_change_percentage_24h).toFixed(2);
            // Apply green color if number is positive, red if negative
            Math.sign(change24h) >= 0 ? $td.addClass('text-success') : $td.addClass('text-danger');
            $td.text(`${change24h}%`);
            $td.addClass('text-right')
            $row.append($td);
            break;

          case '7-days':
            const change7d = Number(coin.price_change_percentage_7d_in_currency).toFixed(2);
            // Apply green color if number is positive, red if negative
            Math.sign(change7d) >= 0 ? $td.addClass('text-success') : $td.addClass('text-danger');
            $td.text(`${change7d}%`);
            $td.addClass('text-right')
            $row.append($td);
            break;

          case 'sparkline':
            // Update the chart options with coin specific data
            const $sparklineContainer = $('<div></div>').addClass('sparkline-container');
            const options = {
              ...chartOptions,
              series: [{
                data: coin.sparkline_in_7d.price
              }],
              colors: [Math.sign(coin.price_change_percentage_7d_in_currency) >= 0 ? 'hsl(120, 100%, 50%)' : 'hsl(0, 100%, 50%)'],
            };
            const sparkline = new ApexCharts($sparklineContainer.get()[0], options);
            $td.append($sparklineContainer);
            $row.append($td);
            sparkline.render();
            break;
        }
      })

      $table.append($row);
    })
  }

  // Fetch coins -- use it for pagination
  function fetchCoins(pageNumber = 1) {
    $.ajax({
      url: 'https://api.coingecko.com/api/v3/coins/markets',
      data: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: pageNumber,
        sparkline: true,
        // ids: 'bitcoin,ethereum,litecoin,cardano',
        price_change_percentage: '1h,24h,7d'
      }
    }).done(displayCoins);
  }

  fetchCoins();

  $('#account-form').submit(function (e) {
    e.preventDefault();
  })

  // Show coin details
  $('#crypto-table').click(function (e) {
    const $parentTr = $(e.target).closest('tr');
    if (!$parentTr.attr('data-coin-id')) return;

    const id = $parentTr.attr('data-coin-id');

    // Show coin details section here
    showCoinDetailsSection();

    // Scroll to top
    // $(window).scrollTop(0);

    $.ajax({
      url: `https://api.coingecko.com/api/v3/coins/${id}`,
      data: {
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: true,
        localization: false
      }
    }).done(displayCoinDetails)
  });

  function showCoinDetailsSection() {
    const $coinDetailsSection = $('#coin-details');

    if ($coinDetailsSection.attr('data-status') === 'hidden') {
      $coinDetailsSection.slideDown();
      $coinDetailsSection.attr('data-status', 'open');
    };
  }

  function hideCoinDetailsSection() {
    const $coinDetailsSection = $('#coin-details');

    $coinDetailsSection.attr('data-status', 'hidden');
    $coinDetailsSection.slideToggle();
  }

  function displayCoinDetails(coinData) {
    $('#coin-name').text(coinData.name);
    $('#coin-symbol').text(coinData.symbol.toUpperCase());
    $('#coin-image').attr({
      src: coinData.image.small,
      alt: `${coinData.name} image`
    });
    $('#coin-price').text(formatCoinPrice(coinData.market_data.current_price.usd));
    $('#market-cap').text(formatCoinPrice(coinData.market_data.market_cap.usd));
    $('#volume').text(formatCoinPrice(coinData.market_data.total_volume.usd));
    $('#low-high').text(`${formatCoinPrice(coinData.market_data.low_24h.usd)} / ${formatCoinPrice(coinData.market_data.high_24h.usd)}`);
  }

  $('#close-details-section').click(function () {
    hideCoinDetailsSection();
  })

  function clearTableBody() {
    const $cryptoTableBody = $('tbody');
    $cryptoTableBody.empty()
  }

  // Pagination functionality
  $('#pagination').click(function changeCoinPage(e) {

    const $clickedLi = $(e.target).closest('li');
    const $cryptoTable = $('#crypto-table');
    const $liPrevious = $('li[data-page=previous]');
    const currentPage = $('#crypto-table').attr('data-page');
    const targetPage = $clickedLi.attr('data-page');
    const $ellipsisLi = $(`
      <li class="page-item disabled" id="ellipsis">
        <span class="page-link">&mldr;</span>
      </li>`
    );

    // Return if clicking on the ul#pagination area
    if (e.target === e.currentTarget) return;

    // Return if clicking on a disabled LI or if clicking on the same page as the 
    // current page
    if ($clickedLi.hasClass('disabled') || currentPage == targetPage) {

      // Prevent anchor element's default behavior (scolling to the top)
      e.preventDefault();
      return;
    };

    // Check if click happened on previous/next buttons
    if (isNaN(targetPage)) {
      if (targetPage === 'next') {
        const newPage = +currentPage + 1;
        clearTableBody();
        fetchCoins(newPage);

        // Set the new page on #crypto-table data-page attribute
        $cryptoTable.attr('data-page', newPage);
      } else {
        const newPage = +currentPage - 1;
        clearTableBody();
        fetchCoins(newPage);

        // Set the new page on #crypto-table data-page attribute
        $cryptoTable.attr('data-page', newPage);
      }
    } else {
      clearTableBody();
      fetchCoins(targetPage);

      // Set the new page on #crypto-table data-page attribute
      $cryptoTable.attr('data-page', targetPage);
    }

    // Remove .disabled class on LI "previous" if page is not 1
    $cryptoTable.attr('data-page') != 1 ? $liPrevious.removeClass('disabled') : $liPrevious.addClass('disabled');

    // If page is greater than 3, add LI "ellipsis" and update the LI numbers accordingly
    // Else, remove the LI "ellipsis" and update the LI numbers accordingly
    if ($cryptoTable.attr('data-page') > 3) {

      // If LI "ellipsis" doesn't exist in pagination, add one
      if ($('#ellipsis').length === 0) $('li[data-page=1]').after($ellipsisLi);

      // update li numbers
      let liPageNumberStart = $('#crypto-table').attr('data-page') - 1;

      // Get the last two numbered LIs
      $('li.page-item').slice(-3, -1).each(function updateLiNumbers() {

        // Convert the element into a jQuery object
        const $this = $(this);

        // Update the data-page attribute
        $this.attr('data-page', liPageNumberStart);

        // Update the anchor text and increase liPageNumberStart
        $this.children().text(liPageNumberStart++);
      })
    } else {
      // Remove LI "ellipsis" if it exists
      if ($('#ellipsis').length !== 0) $('#ellipsis').remove();

      // If #crypto-table data-page <= 3, we just need pages 1, 2 and 3
      let liPageNumberStart = 2;

      $('li.page-item').slice(-3, -1).each(function updateLiNumbers() {

        // Convert the element into a jQuery object
        const $this = $(this);

        // Update the data-page attribute
        $this.attr('data-page', liPageNumberStart);

        // Update the anchor text
        $this.children().text(liPageNumberStart++);
      })

    }

    // Update the new active LI with the .active
    $('li.active').removeClass('active');
    $(`li[data-page=${$cryptoTable.attr('data-page')}]`).addClass('active');
  })

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

  // Save sidebar state (open/close) to local storage
  function updateSidebarState() {
    const sidebarState = localStorage.getItem('sidebarState') ? localStorage.getItem('sidebarState') : 'open';
    if (sidebarState === 'open') $('.sidebar').removeClass('collapsed');
    else $('.sidebar').addClass('collapsed');
  }
});