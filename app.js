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

    // $.ajax({
    //     method: 'GET',
    //     url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=ethereum',
    //     dataType: 'json'
    // }, function (data) {
    //     console.log(data);
    // })

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

    // $.each(holdings[0], function (key, value) { console.log(key, value) })

    $('tr').has('td').each(function (i, row) {
        $.each(holdings, function (i, coin) {
            var $td = $(row).children().get(i);
            $($td).text(coin.name);
        })
    })
});