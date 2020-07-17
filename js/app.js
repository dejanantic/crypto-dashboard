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
            const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coinPrice);
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
  }).done(displayCoins);

  $('#account-form').submit(function (e) {
    e.preventDefault();
  })


  // Solution down here














  // Populate the table with custom data from my object


  // const holdingProperties = Object.keys(holdings[0]);

  // const $cryptoTableBody = $('#crypto-table tbody');
  // holdings.forEach((item, index) => {
  //   const $row = $('<tr></tr>').attr('data-coin-id', index);
  //   holdingProperties.forEach(key => {
  //     $row.append(`<td>${item[key]}</td>`);
  //   });
  //   $cryptoTableBody.append($row);
  // });

  // TODO: implement show crypto details on click
});