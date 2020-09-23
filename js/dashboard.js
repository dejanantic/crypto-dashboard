$(function () {
  function getCoinThumbnail(coin) {
    const $span = $('<span></span>');
    $span.addClass('coin-image mr-2');
    const $img = $('<img>');
    $img.attr({
      alt: `${coin.name} (${coin.symbol.toUpperCase()})`,
      src: `${coin.image}`,
      height: '25px',
    });
    $span.append($img);

    return $span;
  }

  function formatCoinPrice(price, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price);
  }

  function displayCoins(data) {
    const $table = $('#crypto-table tbody');

    $.each(data, function addTableRow(i, coin) {
      const $row = $('<tr></tr>').attr('data-coin-id', coin.id);

      $('th').each(function populateRowWithData(j, th) {
        const $td = $('<td></td>');

        switch ($(th).attr('data-coin-data')) {
          case 'coin':
            $td.text(coin.symbol.toUpperCase());
            $td.addClass('font-weight-bold text-primary');
            $td.prepend(getCoinThumbnail(coin));
            // $td.append(getCoinSymbol(coin));
            $row.append($td);
            break;

          case 'price': {
            const coinPrice = coin.current_price;
            const formattedValue = formatCoinPrice(coinPrice);
            $td.text(formattedValue);
            $td.addClass('text-right');
            $row.append($td);
            break;
          }

          case '1-hour': {
            const change1h = Number(
              coin.price_change_percentage_1h_in_currency
            ).toFixed(2);
            // Apply green color if number is positive, red if negative
            if (Math.sign(change1h) >= 0) {
              $td.addClass('text-success');
            } else {
              $td.addClass('text-danger');
            }
            $td.text(`${change1h}%`);
            $td.addClass('text-right');
            $row.append($td);
            break;
          }

          case '24-hours': {
            const change24h = Number(coin.price_change_percentage_24h).toFixed(
              2
            );
            // Apply green color if number is positive, red if negative
            if (Math.sign(change24h) >= 0) {
              $td.addClass('text-success');
            } else {
              $td.addClass('text-danger');
            }
            $td.text(`${change24h}%`);
            $td.addClass('text-right');
            $row.append($td);
            break;
          }

          case '7-days': {
            const change7d = Number(
              coin.price_change_percentage_7d_in_currency
            ).toFixed(2);
            // Apply green color if number is positive, red if negative
            if (Math.sign(change7d) >= 0) {
              $td.addClass('text-success');
            } else {
              $td.addClass('text-danger');
            }
            $td.text(`${change7d}%`);
            $td.addClass('text-right');
            $row.append($td);
            break;
          }

          default: {
            // Update the chart options with coin specific data
            const $sparklineContainer = $('<div></div>').addClass(
              'sparkline-container'
            );

            const chartOptions = {
              series: [
                {
                  data: coin.sparkline_in_7d.price,
                },
              ],
              chart: {
                type: 'line',
                height: '50px',
                width: '220px',
                sparkline: {
                  enabled: true,
                },
                animations: {
                  enabled: false,
                },
              },
              stroke: {
                width: 1,
              },
              colors: [
                Math.sign(coin.price_change_percentage_7d_in_currency) >= 0
                  ? 'hsl(120, 100%, 50%)'
                  : 'hsl(0, 100%, 50%)',
              ],
              tooltip: {
                enabled: false,
              },
            };

            const sparkline = new ApexCharts(
              $sparklineContainer.get(0),
              chartOptions
            );
            $td.append($sparklineContainer);
            $row.append($td);
            sparkline.render();
            break;
          }
        }
      });

      $table.append($row);
    });

    loaderMethods.remove();
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
        price_change_percentage: '1h,24h,7d',
      },
    }).done(displayCoins);
  }

  fetchCoins();

  function manipulateSparklineData(sparklineData) {
    const totalHours = sparklineData.length;
    const now = new Date().getTime();
    const updatedSeries = sparklineData.map((val, i) => {
      const dateObj = new Date(now);
      const timestamp = dateObj.setHours(dateObj.getHours() - totalHours + i);
      return [timestamp, val];
    });

    return updatedSeries;
  }

  const coinDetailsChart = new ApexCharts($('#coin-chart').get(0), {
    // Chart options
    chart: {
      type: 'area',
      height: 225,
      toolbar: { show: true },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: { show: true },
      type: 'datetime',
    },
    yaxis: {
      seriesName: 'Price USD',
      labels: {
        show: true,
        formatter(val) {
          if (Math.round(val) <= 1) return val.toFixed(5);
          return val.toFixed(2);
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    stroke: { width: 2 },
    // The series will be updated with the AJAX request
    series: [],
    noData: {
      text: 'Loading...',
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 150,
            toolbar: { show: false },
          },
          yaxis: {
            labels: {
              show: false,
              formatter(val) {
                if (Math.round(val) <= 1) return val.toFixed(5);
                return val.toFixed(2);
              },
            },
          },
        },
      },
    ],
  });

  coinDetailsChart.render();

  function displayCoinDetails(coinData) {
    $('#coin-name').text(coinData.name);

    $('#coin-symbol').text(coinData.symbol.toUpperCase());

    $('#coin-image').attr({
      src: coinData.image.small,
      alt: `${coinData.name} image`,
    });

    $('#coin-price').text(
      formatCoinPrice(coinData.market_data.current_price.usd)
    );

    $('#market-cap').text(formatCoinPrice(coinData.market_data.market_cap.usd));
    $('#volume').text(formatCoinPrice(coinData.market_data.total_volume.usd));

    $('#low-high').text(
      `${formatCoinPrice(coinData.market_data.low_24h.usd)} / ${formatCoinPrice(
        coinData.market_data.high_24h.usd
      )}`
    );

    coinDetailsChart.updateSeries([
      {
        name: 'Price USD',
        data: manipulateSparklineData(coinData.market_data.sparkline_7d.price),
      },
    ]);

    // Wait 10 miliseconds to hide the pictures changing
    setTimeout(loaderMethods.remove, 10);
  }

  // Show coin details
  function showCoinDetailsSection() {
    const $coinDetailsSection = $('#coin-details');
    const isCoinDetailsSticky = $coinDetailsSection.hasClass('sticky-details');

    if ($coinDetailsSection.attr('data-status') === 'hidden') {
      $coinDetailsSection.slideDown();
      $coinDetailsSection.attr('data-status', 'open');
    }
  }

  function hideCoinDetailsSection() {
    const $coinDetailsSection = $('#coin-details');
    const isCoinDetailsSticky = $coinDetailsSection.hasClass('sticky-details');

    $coinDetailsSection.attr('data-status', 'hidden');
    $coinDetailsSection.slideUp();
    if (isCoinDetailsSticky) $coinDetailsSection.removeClass('sticky-details');
  }

  $('#close-details-section').on('click', function () {
    hideCoinDetailsSection();
  });

  // Coin details sticky section
  // Milos review
  $(window).on('scroll', function () {
    const $detailsSection = $('#coin-details');
    const $tableContainer = $('.table-container');
    const isCoinDetailsOpen = $detailsSection.attr('data-status') === 'open';
    const sticky = $('.header').outerHeight();

    if (window.pageYOffset >= sticky && isCoinDetailsOpen) {
      $detailsSection.addClass('sticky-details');
      // Add padding-top to prevent abrupt transition
      const padding = $detailsSection.outerHeight();
      $tableContainer.css('padding-top', padding);
    } else {
      $detailsSection.removeClass('sticky-details');
      $tableContainer.css('padding-top', 0);
    }
  });

  // CRYPTO TABLE FUNCTIONALITY
  $('#crypto-table').on('click', function (e) {
    const $parentTr = $(e.target).closest('tr');
    if (!$parentTr.attr('data-coin-id')) return;

    const id = $parentTr.attr('data-coin-id');

    // Create loader
    loaderMethods.create($('.coin-details'));

    showCoinDetailsSection();

    $.ajax({
      url: `https://api.coingecko.com/api/v3/coins/${id}`,
      data: {
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: true,
        localization: false,
      },
    }).done(displayCoinDetails);
  });

  function clearTableBody() {
    const $cryptoTableBody = $('tbody');
    $cryptoTableBody.empty();
  }

  // Pagination functionality
  $('#pagination').on('click', function changeCoinPage(e) {
    hideCoinDetailsSection();

    const $clickedLi = $(e.target).closest('li');
    const $cryptoTable = $('#crypto-table');
    const $liPrevious = $('li[data-page=previous]');
    const currentPage = +$('#crypto-table').attr('data-page');
    const targetPage = $clickedLi.attr('data-page');
    const $ellipsisLi = $(`
      <li class="page-item disabled" id="ellipsis">
        <span class="page-link">&mldr;</span>
      </li>`);

    // Return if clicking on the ul#pagination area
    if (e.target === e.currentTarget) return;

    // Return if clicking on a disabled LI or if clicking on the same page as the
    // current page
    if ($clickedLi.hasClass('disabled') || currentPage === targetPage) {
      // Prevent anchor element's default behavior (scolling to the top)
      e.preventDefault();
      return;
    }

    loaderMethods.create();

    // Check if click happened on previous/next buttons
    if (Number.isNaN(+targetPage)) {
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
    if (+$cryptoTable.attr('data-page') !== 1) {
      $liPrevious.removeClass('disabled');
    } else {
      $liPrevious.addClass('disabled');
    }

    // If page is greater than 3, add LI "ellipsis" and update the LI numbers accordingly
    // Else, remove the LI "ellipsis" and update the LI numbers accordingly
    if (Number($cryptoTable.attr('data-page')) > 3) {
      // If LI "ellipsis" doesn't exist in pagination, add one
      if ($('#ellipsis').length === 0) $('li[data-page=1]').after($ellipsisLi);

      // update li numbers
      let liPageNumberStart = +$('#crypto-table').attr('data-page') - 1;

      // Get the last two numbered LIs
      $('li.page-item')
        .slice(-3, -1)
        .each(function updateLiNumbers() {
          // Convert the element into a jQuery object
          const $this = $(this);

          // Update the data-page attribute
          $this.attr('data-page', liPageNumberStart);

          // Update the anchor text and increase liPageNumberStart
          $this.children().text(liPageNumberStart);
          liPageNumberStart += 1;
        });
    } else {
      // Remove LI "ellipsis" if it exists
      if ($('#ellipsis').length !== 0) $('#ellipsis').remove();

      // If #crypto-table data-page <= 3, we just need pages 1, 2 and 3
      let liPageNumberStart = 2;

      $('li.page-item')
        .slice(-3, -1)
        .each(function updateLiNumbers() {
          // Convert the element into a jQuery object
          const $this = $(this);

          // Update the data-page attribute
          $this.attr('data-page', liPageNumberStart);

          // Update the anchor text
          $this.children().text(liPageNumberStart);
          liPageNumberStart += 1;
        });
    }

    // Update the new active LI with the .active
    $('li.active').removeClass('active');
    $(`li[data-page=${$cryptoTable.attr('data-page')}]`).addClass('active');
  });
});
