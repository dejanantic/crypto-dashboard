$(document).ready(function () {

  const coinIds = [
    'bitcoin',
    'ethereum',
    'cardano',
    'zcash'
  ]

  $('#account-form').submit(function (e) {
    e.preventDefault();
  })

  $.ajax({
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/coins/markets',
    dataType: 'json',
    data: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '50',
      page: 1
    }
  }, function (data) {
    console.log(data);
  })

  // Populate the table with custom data from my object
  const holdings = [
    {
      name: 'Bitcoin',
      price: 9023,
      holdings: 2500
    },
    {
      name: 'Ethereum',
      price: 201,
      holdings: 10500
    },
    {
      name: 'Cardano',
      price: 0.12,
      holdings: 150
    },
  ];
  const holdingProperties = Object.keys(holdings[0]);

  const $cryptoTableBody = $('#crypto-table tbody');
  holdings.forEach((item, index) => {
    const $row = $('<tr></tr>').attr('data-coin-id', index);
    holdingProperties.forEach(key => {
      $row.append(`<td>${item[key]}</td>`);
    });
    $cryptoTableBody.append($row);
  });

  // TODO: implement show crypto details on click

  // $.each(holdings[0], function (key, value) { console.log(key, value) })
  // $('tr').has('td').each(function (i, row) {
  //     $.each(holdings, function (i, coin) {
  //         // var $td = $(row).children().get(i);
  //         // $($td).text(coin.name);
  //     })
  // })
});