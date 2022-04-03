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

let timestampArr = [];
let dateArr = [];
let openArr = [];
let closeArr = [];
let highArr = [];
let lowArr = [];
let volArr = [];

let marketData = null;

async function data(request, response){ 
    const dynamicDate = new Date();

    marketData = null;
    timestampArr = [];
    dateArr = [];
    openArr = [];
    closeArr = [];
    highArr = [];
    lowArr = [];
    volArr = [];

    const timeApi = await api.time();
    console.log(`serverTime: ${timeApi.data.serverTime}`);
    const lastUpdate = formatTime(timeApi.data.serverTime);
    
    const carteira = await api.accountSnapshot(timeApi.data.serverTime);
    const coin = carteira.snapshotVos[0].data.assets.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    console.log(`TEST:coins:  ${JSON.stringify(coin[0].marginBalance)}`);
    /*
    const result = await api.klines("15m");

    for (let i = 0; i < result.data.length-1; i++) {
        criarObj(result.data[i]);
    }

    marketData = { date: dateArr, timestamp: timestampArr, open: openArr, close: closeArr, high: highArr, low: lowArr, volume: volArr };
    */

    var marketData15m = await criarKlineObj("15m");

    /*
    console.log(`klines0: ${JSON.stringify(result.data[0])}`);
    console.log('');
    console.log(`klines00: ${JSON.stringify(result.data[result.data.length-1])}`);
  */
    //invertido    
    for (let i = 40; i > 0; i--) {
        //criarObj(result.data[i]);
    }

    //console.log('');
    //console.log(`marketData.date(últimoCandle): ${JSON.stringify(marketData.date[result.data.length-2])}`);

    const stochRsi = stochasticrsi({values: marketData15m.close,
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
        lastUpdtMarket15m: marketData15m.date[result.data.length-2],
        stoch: stochRsi[stochRsi.length-1]
        //StochasticRSI: StochasticRSI[StochasticRSI.length-1]
    })
    //{"serverTimestamp":"1648712608125","marginBalance":"0.02738226"}
}

async function criarKlineObj(periodGrph){

    var marketData = null;
    timestampArr = [];
    dateArr = [];
    openArr = [];
    closeArr = [];
    highArr = [];
    lowArr = [];
    volArr = [];

    const result = await api.klines(periodGrph);

    for (let i = 0; i < result.data.length-1; i++) {
        criarObj(result.data[i]);
    }

    marketData = { date: dateArr, timestamp: timestampArr, open: openArr, close: closeArr, high: highArr, low: lowArr, volume: volArr };

    return marketData;
}

function criarObj(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr.push(formattedTime);
    timestampArr.push(unix_timestamp);
    openArr.push(item[1]);
    closeArr.push(item[4]);
    highArr.push(item[2]);
    lowArr.push(item[3]);
    volArr.push(item[5]);

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