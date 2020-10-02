$(function () {
  // loaderMethods.remove();

  let coinData = [];

  function getCoinData() {
    return coinData;
  }

  function convert(eventTarget) {
    const crypto1 = $('#crypto-select-1').select2('data')[0];
    const amount1 = $('#crypto-amount-1');
    const crypto2 = $('#crypto-select-2').select2('data')[0];
    const amount2 = $('#crypto-amount-2');

    if ($(eventTarget).attr('id') === 'crypto-amount-2') {
      const result =
        (+amount2.val() * crypto2.current_price) / crypto1.current_price;
      amount1.val(result);
    } else {
      const result =
        (+amount1.val() * crypto1.current_price) / crypto2.current_price;
      amount2.val(result);
    }
  }

  $('#converter').on('input', function (e) {
    convert(e.target);
  });

  function formatCoinData(coinsArr) {
    const formattedData = coinsArr.map((coin) => {
      const newCoin = {};
      newCoin.id = coin.id;
      newCoin.text = coin.name;
      newCoin.symbol = coin.symbol;
      newCoin.image = coin.image;
      newCoin.current_price = coin.current_price;

      return newCoin;
    });

    coinData = [...formattedData];
  }

  function fetchCoins(pageNumber = 1) {
    $.ajax({
      url: 'https://api.coingecko.com/api/v3/coins/markets',
      data: {
        vs_currency: 'btc',
        order: 'market_cap_desc',
        per_page: 250,
        page: pageNumber,
      },
    })
      .done(formatCoinData)
      .done(function () {
        $('#crypto-select-1').select2({
          theme: 'bootstrap4',
          placeholder: 'BTC',
          data: [...getCoinData()],
          templateSelection(coin) {
            $(coin.element).attr('data-current-price', coin.current_price);
            return coin.text;
          },
        });

        $('#crypto-select-2').select2({
          theme: 'bootstrap4',
          placeholder: 'ETH',
          data: [...getCoinData()],
          templateSelection(coin) {
            $(coin.element).attr('data-current-price', coin.current_price);
            return coin.text;
          },
        });
      })
      .done(loaderMethods.remove);
  }

  fetchCoins();
});
