//const api = require(process.cwd()+'/api');
//const SMA = require(process.cwd()+'technicalindicators').SMA;
//const StochasticRSI = require(process.cwd()+'technicalindicators').StochasticRSI;

//const symbol = process.env.SYMBOL;

import api from './api';
//import dynamic from 'next/dynamic';
import { stochasticrsi } from 'technicalindicators';
//import { StochasticRsiInput } from 'technicalindicators/declarations/momentum/StochasticRSI';
//import technicalindicators from ('technicalindicators');
//import StochasticRSI from ('technicalindicators').StochasticRSI;

//const StochasticRSI = dynamic(() => import('technicalindicators').StochasticRSI);

let timestampArr1m = [];
let dateArr1m = [];
let openArr1m = [];
let closeArr1m = [];
let highArr1m = [];
let lowArr1m = [];
let volArr1m = [];
let marketData1m = null;

let timestampArr5m = [];
let dateArr5m = [];
let openArr5m = [];
let closeArr5m = [];
let highArr5m = [];
let lowArr5m = [];
let volArr5m = [];
let marketData5m = null;

let timestampArr15m = [];
let dateArr15m = [];
let openArr15m = [];
let closeArr15m = [];
let highArr15m = [];
let lowArr15m = [];
let volArr15m = [];
let marketData15m = null;




async function data(request, response){ 
    const dynamicDate = new Date();

    timestampArr1m = [];
    dateArr1m = [];
    openArr1m = [];
    closeArr1m = [];
    highArr1m = [];
    lowArr1m = [];
    volArr1m = [];
    marketData1m = null;

    timestampArr5m = [];
    dateArr5m = [];
    openArr5m = [];
    closeArr5m = [];
    highArr5m = [];
    lowArr5m = [];
    volArr5m = [];
    marketData5m = null;

    timestampArr15m = [];
    dateArr15m = [];
    openArr15m = [];
    closeArr15m = [];
    highArr15m = [];
    lowArr15m = [];
    volArr15m = [];
    marketData15m = null;

    const timeApi = await api.time();
    console.log(`serverTime: ${timeApi.data.serverTime}`);
    const lastUpdate = formatTime(timeApi.data.serverTime);
    
    const carteira = await api.accountSnapshot(timeApi.data.serverTime);
    const coin = carteira.snapshotVos[0].data.assets.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    console.log(`TEST:coins:  ${JSON.stringify(coin[0].marginBalance)}`);
    
    const result1m = await api.klines("1m");
    const result5m = await api.klines("5m");
    const result15m = await api.klines("15m");

    for (let i = 0; i < result1m.data.length-1; i++) {
        criarObj1m(result1m.data[i]);
    }
    for (let i = 0; i < result5m.data.length-1; i++) {
        criarObj5m(result5m.data[i]);
    }
    for (let i = 0; i < result15m.data.length-1; i++) {
        criarObj15m(result15m.data[i]);
    }

    marketData1m = { date: dateArr1m, timestamp: timestampArr1m, open: openArr1m, close: closeArr1m, high: highArr1m, low: lowArr1m, volume: volArr1m };
    marketData5m = { date: dateArr5m, timestamp: timestampArr5m, open: openArr5m, close: closeArr5m, high: highArr5m, low: lowArr5m, volume: volArr5m };
    marketData15m = { date: dateArr15m, timestamp: timestampArr15m, open: openArr15m, close: closeArr15m, high: highArr15m, low: lowArr15m, volume: volArr15m };
    
    //let marketData15m = criarKlineObj("15m");

    /*
    console.log(`klines0: ${JSON.stringify(result.data[0])}`);
    console.log('');
    console.log(`klines00: ${JSON.stringify(result.data[result.data.length-1])}`);
  */
    //invertido    
    //for (let i = 40; i > 0; i--) {
        //criarObj(result.data[i]);
    //}

    //console.log('');
    //console.log(`marketData.date(últimoCandle): ${JSON.stringify(marketData.date[result.data.length-2])}`);

    const stochRsi15m = stochasticrsi({values: marketData15m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    /*
    //console.log('SMA: ');
    //console.log(SMA.calculate({period : 5, values : [1,2,3,4,5,6,7,8,9]}));
    console.log('');
    console.log('<<--   StochasticRSI   -->>');
    console.log(StochasticRSI.calculate({values: marketData.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    }));
    */

    //console.log(await api.exchangeInfo());
/*
    console.log('Mercado');

    const mercado = await api.depth('BNBBUSD');
    console.log(mercado.bids.length ? `Compra: ${mercado.bids[0][0]}` : 'Sem Compras');
    console.log(mercado.asks.length ? `Venda: ${mercado.asks[0][0]}` : 'Sem Vendas');

    console.log(await api.depth(symbol));

    let buy, sell;

    const result = await api.depth(symbol);
    if (result.bids && result.bids.length){
        console.log(`HI BUY: ${result.bids[0][0]}`);
        buy = parseFloat(result.bids[0][0]);
    }

    if (result.asks && result.asks.length){
        console.log(`LOW SELL: ${result.asks[0][0]}`);
        sell = parseFloat(result.asks[0][0]);
    }

    if(sell < 200000){
        console.log('Hora de Comprar!!!')

        
    }else if(buy > 230000){
        console.log('Hora de Vender!!!')
    }else{
        console.log('ESPERANDO!!!')
    }

    console.log('Carteira');

    result = await api.accountSnapshot(ts);
    console.log(result);
    objStr = JSON.stringify(result.snapshotVos[0].data);
    console.log(`TEST:snapshotVos: ${objStr}`);   

    const carteira = await api.accountSnapshot(ts);
    const coin = carteira.snapshotVos[0].data.assets.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    
    console.log(`TEST:coins:  ${JSON.stringify(coin[0].marginBalance)}`);
    //coin:  [{"asset":"USDT","marginBalance":"0.02738226","walletBalance":"0.02738226"}]
*/
    response.setHeader('Cache-Control', 's-maxage=10', 'stale-while-revalidate');

    response.json({
        //serverTimestamp: dynamicDate,
        //marginBalance: "0.02"
        lastUpdate: lastUpdate,
        marginBalance: coin[0].marginBalance,
        serverTimestamp: timeApi.data.serverTime,
        lastUpdtMarket1m: marketData1m.date[marketData1m.date.length-1],
        lastUpdtMarket5m: marketData5m.date[marketData5m.date.length-1],
        lastUpdtMarket15m: marketData15m.date[marketData15m.date.length-1],
        stoch15m: stochRsi15m[stochRsi15m.length-1]
        //StochasticRSI: StochasticRSI[StochasticRSI.length-1]
    })
    //{"serverTimestamp":"1648712608125","marginBalance":"0.02738226"}
}
/*
function criarKlineObj(periodGrph){

    var market = null;
    var timestamp = [];
    var date = [];
    var open = [];
    var close = [];
    var high = [];
    var low = [];
    var vol = [];

    const item = api.klines(periodGrph);

    for (let i = 0; i < item.data.length-1; i++) {
        //criarObj(item.data[i]);

        let unix_timestamp = item.data[i][0]
        var formattedTime = formatTime(unix_timestamp);
    
        dateArr.push(formattedTime);
        timestampArr.push(unix_timestamp);
        openArr.push(item.data[i][1]);
        closeArr.push(item.data[i][4]);
        highArr.push(item.data[i][2]);
        lowArr.push(item.data[i][3]);
        volArr.push(item.data[i][5]);

    }

    market = { date: date, timestamp: timestamp, open: open, close: close, high: high, low: low, volume: vol };

    return market;
}
*/

function criarObj1m(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr1m.push(formattedTime);
    timestampArr1m.push(unix_timestamp);
    openArr1m.push(item[1]);
    closeArr1m.push(item[4]);
    highArr1m.push(item[2]);
    lowArr1m.push(item[3]);
    volArr1m.push(item[5]);

}

function criarObj5m(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr5m.push(formattedTime);
    timestampArr5m.push(unix_timestamp);
    openArr5m.push(item[1]);
    closeArr5m.push(item[4]);
    highArr5m.push(item[2]);
    lowArr5m.push(item[3]);
    volArr5m.push(item[5]);

}

function criarObj15m(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr15m.push(formattedTime);
    timestampArr15m.push(unix_timestamp);
    openArr15m.push(item[1]);
    closeArr15m.push(item[4]);
    highArr15m.push(item[2]);
    lowArr15m.push(item[3]);
    volArr15m.push(item[5]);

}

function formatTime(timestamp){

    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    var formattedTime = hours-3 + ':' + minutes + ':' + seconds;

    return formattedTime;
}

export default data;