const https = require('https');

const URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD' +
    '&ids=bitcoin%2Cethereum%2Ctether%2Cpolkadot%2Ccardano%2Cbinancecoin%2Cripple' +
    '%2Clitecoin%2Cchainlink%2Cbitcoin-cash%2Cstellar%2Cusd-coin%2Cdogecoin%2Cwrapped' +
    '-bitcoin%2Cuniswap%2Caave%2Ccosmos%2Ceos%2Cmonero%2Cbitcoin-cash-sv%2Ciota%2' +
    'Ctron%2Cnem%2Ctezos%2Cvechain%2Ctheta-token%2Chavven%2Cavalanche-2%2Cneo%2Chuobi-token%' +
    '2Cterra-luna%2Cdash%2Cokb%2Ccrypto-com-chain%2Cthe-graph%2Celrond-erd-2%2Ccompound-ether%' +
    '2Csolana%2Cmaker%2Cftx-token%2Ccdai%2Cdai%2Cfilecoin%2Ccelsius-degree-token%2Ckusama%2Csushi%' +
    '2Ccompound-governance-token%2Czcash%2Cethereum-classic%2Ccompound-usd' +
    '-coin&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d';


https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(JSON.parse(data).explanation);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
