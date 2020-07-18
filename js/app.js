$(document).ready(function () {

  function getCoinThumbnail(coin) {
    const $span = $('<span></span>');
    $($span).addClass('coin-image mr-2');
    const $img = $('<img>');
    $($img).attr({
      alt: `${coin.name} (${coin.symbol.toUpperCase()})`,
      src: `${coin.image}`,
      height: '25px'
    });
    $($span).append($img);

    return $span;
  }

  function getCoinSymbol(coin) {
    const $span = $('<span></span>');
    $($span).addClass('coin-symbol text-dark font-weight-light ml-5');
    $($span).text(`${coin.symbol.toUpperCase()}`);

    return $span;
  }

  function formatCoinPrice(price, locale = 'en-US', currency = 'USD') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(price);
  }

  function formatNumber(number, locale = 'en-US') {
    return new Intl.NumberFormat(locale).format(number);
  }

  function saveCoinData(coinData) {
    localStorage.setItem('coinData', JSON.stringify(coinData));
  }

  function getCoinData() {
    return JSON.parse(localStorage.getItem('coinData'))
  }

  function displayCoins(data) {
    const $table = $('#crypto-table tbody');

    $.each(data, function addTableRow(i, coin) {
      const $row = $('<tr></tr>').attr('data-coin-id', coin.id);

      $('th').each(function populateRowWithData(i, th) {
        const $td = $('<td></td>');

        switch ($(th).text().toLowerCase()) {
          case 'coin':
            $($td).text(coin.name);
            $($td).addClass('font-weight-bold text-primary');
            $($td).prepend(getCoinThumbnail(coin));
            $($td).append(getCoinSymbol(coin));
            $($row).append($td);
            break;

          case 'price':
            const coinPrice = coin.current_price;
            const formattedValue = formatCoinPrice(coinPrice);
            // const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coinPrice);
            $($td).text(formattedValue);
            $($td).addClass('text-right')
            $($row).append($td);
            break;

          case '24 hours':
            const value = Number(coin.price_change_percentage_24h).toFixed(2);
            // Apply green color if number is positive, red if negative
            Math.sign(value) >= 0 ? $($td).addClass('text-success') : $($td).addClass('text-danger');
            $($td).text(`${value}%`);
            $($td).addClass('text-right')
            $($row).append($td);
            break;
        }
      })

      $table.append($row);
    })
  }

  $.ajax({
    url: 'https://api.coingecko.com/api/v3/coins/markets',
    data: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: true,
      // ids: 'bitcoin,ethereum,litecoin,cardano',
      price_change_percentage: '24h'
    }
  }).done([saveCoinData, displayCoins]);

  $('#account-form').submit(function (e) {
    e.preventDefault();
  })

  // Show coin details
  $('#crypto-table').click(function (e) {
    const $parentTr = $(e.target).closest('tr');
    if (!$($parentTr).attr('data-coin-id')) return;

    const id = $parentTr.attr('data-coin-id');

    // toggle the #coin-details section here
    const $coinDetailsSection = $('#coin-details');

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
});