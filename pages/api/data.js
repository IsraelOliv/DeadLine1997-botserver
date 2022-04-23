import api from './api';
import { stochasticrsi } from 'technicalindicators';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCCpzWIhst6gD7GHqLhIe2_N38T6cOwt6M",
    authDomain: "deadline-1997.firebaseapp.com",
    databaseURL: "https://deadline-1997-default-rtdb.firebaseio.com",
    projectId: "deadline-1997",
    storageBucket: "deadline-1997.appspot.com",
    messagingSenderId: "110864270922",
    appId: "1:110864270922:web:bd4984f9d157d4a685c8b3",
    measurementId: "G-M66C87Z9QT"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

let timestampArr1m = [];
let dateArr1m = [];
let openArr1m = [];
let closeArr1m = [];
let highArr1m = [];
let lowArr1m = [];
let volArr1m = [];
let marketData1m = null;

let timestampArr3m = [];
let dateArr3m = [];
let openArr3m = [];
let closeArr3m = [];
let highArr3m = [];
let lowArr3m = [];
let volArr3m = [];
let marketData3m = null;

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

let timestampArr30m = [];
let dateArr30m = [];
let openArr30m = [];
let closeArr30m = [];
let highArr30m = [];
let lowArr30m = [];
let volArr30m = [];
let marketData30m = null;

let timestampArr1h = [];
let dateArr1h = [];
let openArr1h = [];
let closeArr1h = [];
let highArr1h = [];
let lowArr1h = [];
let volArr1h = [];
let marketData1h = null;

let timestampArr4h = [];
let dateArr4h = [];
let openArr4h = [];
let closeArr4h = [];
let highArr4h = [];
let lowArr4h = [];
let volArr4h = [];
let marketData4h = null;

let timestampArr1d = [];
let dateArr1d = [];
let openArr1d = [];
let closeArr1d = [];
let highArr1d = [];
let lowArr1d = [];
let volArr1d = [];
let marketData1d = null;

let timestampArr1w = [];
let dateArr1w = [];
let openArr1w = [];
let closeArr1w = [];
let highArr1w = [];
let lowArr1w = [];
let volArr1w = [];
let marketData1w = null;

let openOrders = null;

var objSendcalc = {};

var flag = "";

async function data(request, response){ 
    //const dynamicDate = new Date();

    timestampArr1m = [];
    dateArr1m = [];
    openArr1m = [];
    closeArr1m = [];
    highArr1m = [];
    lowArr1m = [];
    volArr1m = [];
    marketData1m = null;

    timestampArr3m = [];
    dateArr3m = [];
    openArr3m = [];
    closeArr3m = [];
    highArr3m = [];
    lowArr3m = [];
    volArr3m = [];
    marketData3m = null;

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

    timestampArr30m = [];
    dateArr30m = [];
    openArr30m = [];
    closeArr30m = [];
    highArr30m = [];
    lowArr30m = [];
    volArr30m = [];
    marketData30m = null;

    timestampArr1h = [];
    dateArr1h = [];
    openArr1h = [];
    closeArr1h = [];
    highArr1h = [];
    lowArr1h = [];
    volArr1h = [];
    marketData1h = null;

    timestampArr4h = [];
    dateArr4h = [];
    openArr4h = [];
    closeArr4h = [];
    highArr4h = [];
    lowArr4h = [];
    volArr4h = [];
    marketData4h = null;

    timestampArr1d = [];
    dateArr1d = [];
    openArr1d = [];
    closeArr1d = [];
    highArr1d = [];
    lowArr1d = [];
    volArr1d = [];
    marketData1d = null;

    timestampArr1w = [];
    dateArr1w = [];
    openArr1w = [];
    closeArr1w = [];
    highArr1w = [];
    lowArr1w = [];
    volArr1w = [];
    marketData1w = null;   
    
    flag = "";   

    await get(child(dbRef, 'rsidata/obj/flag')).then((snapshot) => {    
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            if(data){
                flag = data;               
            }

        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    })

    const timeApi = await api.time();
    console.log(`serverTime: ${timeApi.data.serverTime}`);
    const lastUpdate = formatTime(timeApi.data.serverTime);
    const timestamp = timeApi.data.serverTime;

    //const neworder = await api.newOrder(timestamp, "BUY");
    /*
    const carteira = await api.accountSnapshot(timeApi.data.serverTime);
    const coin = carteira.snapshotVos[0].data.assets.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    console.log(`TEST:coins:  ${JSON.stringify(coin[0].marginBalance)}`);
    const carteira = await api.balance(timeApi.data.serverTime);

    //console.log(`TEST:  ${JSON.stringify(carteira.filter(b => b.asset === 'USDT'))}`);
    const coin = carteira.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    console.log(`TEST:coin:  ${JSON.stringify(coin[0].availableBalance)}`);
    */

    const carteira = await api.accountFutures(timeApi.data.serverTime);
    //console.log(`TEST:  ${JSON.stringify(carteira.filter(b => b.asset === 'USDT'))}`);
    const coin = carteira.assets.filter(b => b.asset === 'USDT'); // || b.asset === 'USDT');
    //console.log(`TEST:coin:  ${JSON.stringify(coin[0].availableBalance)}`);

    const positions = carteira.positions.filter(b => b.unrealizedProfit !== '0.00000000'); // || b.asset === 'USDT');
    //console.log(`TEST:positions:  ${JSON.stringify(coin[0].availableBalance)}`);

    const income = await api.income(timestamp);
    const pnlHist = income.filter(b => b.incomeType === 'REALIZED_PNL'); // || b.asset === 'USDT');

    //accountFutures

    const availableBalance = coin[0].availableBalance;
    const balance = coin[0].walletBalance;
    const unrealizedProfit = coin[0].unrealizedProfit;
    const marginBalance = coin[0].marginBalance;

    const result1m = await api.klines("1m");
    const result3m = await api.klines("3m");
    const result5m = await api.klines("5m");
    const result15m = await api.klines("15m");
    const result30m = await api.klines("30m");
    const result1h = await api.klines("1h");
    const result4h = await api.klines("4h");
    const result1d = await api.klines("1d");
    const result1w = await api.klines("1w");

    for (let i = 0; i < result1m.data.length; i++) {
        criarObj1m(result1m.data[i]);
    }
    for (let i = 0; i < result3m.data.length; i++) {
        criarObj3m(result3m.data[i]);
    }
    for (let i = 0; i < result5m.data.length; i++) {
        criarObj5m(result5m.data[i]);
    }
    for (let i = 0; i < result15m.data.length; i++) {
        criarObj15m(result15m.data[i]);
    }
    for (let i = 0; i < result30m.data.length; i++) {
        criarObj30m(result30m.data[i]);
    }
    for (let i = 0; i < result1h.data.length; i++) {
        criarObj1h(result1h.data[i]);
    }
    for (let i = 0; i < result4h.data.length; i++) {
        criarObj4h(result4h.data[i]);
    }
    for (let i = 0; i < result1d.data.length; i++) {
        criarObj1d(result1d.data[i]);
    }
    for (let i = 0; i < result1w.data.length; i++) {
        criarObj1w(result1w.data[i]);
    }

    marketData1m = { date: dateArr1m, timestamp: timestampArr1m, open: openArr1m, close: closeArr1m, high: highArr1m, low: lowArr1m, volume: volArr1m };
    marketData3m = { date: dateArr3m, timestamp: timestampArr3m, open: openArr3m, close: closeArr3m, high: highArr3m, low: lowArr3m, volume: volArr3m };
    marketData5m = { date: dateArr5m, timestamp: timestampArr5m, open: openArr5m, close: closeArr5m, high: highArr5m, low: lowArr5m, volume: volArr5m };
    marketData15m = { date: dateArr15m, timestamp: timestampArr15m, open: openArr15m, close: closeArr15m, high: highArr15m, low: lowArr15m, volume: volArr15m };
    marketData30m = { date: dateArr30m, timestamp: timestampArr30m, open: openArr30m, close: closeArr30m, high: highArr30m, low: lowArr30m, volume: volArr30m };
    marketData1h = { date: dateArr1h, timestamp: timestampArr1h, open: openArr1h, close: closeArr1h, high: highArr1h, low: lowArr1h, volume: volArr1h };
    marketData4h = { date: dateArr4h, timestamp: timestampArr4h, open: openArr4h, close: closeArr4h, high: highArr4h, low: lowArr4h, volume: volArr4h };
    marketData1d = { date: dateArr1d, timestamp: timestampArr1d, open: openArr1d, close: closeArr1d, high: highArr1d, low: lowArr1d, volume: volArr1d };
    marketData1w = { date: dateArr1w, timestamp: timestampArr1w, open: openArr1w, close: closeArr1w, high: highArr1w, low: lowArr1w, volume: volArr1w };

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

    const stochRsi1m = stochasticrsi({values: marketData1m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi3m = stochasticrsi({values: marketData3m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi5m = stochasticrsi({values: marketData5m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi15m = stochasticrsi({values: marketData15m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi30m = stochasticrsi({values: marketData30m.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi1h = stochasticrsi({values: marketData1h.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });
    
    const stochRsi4h = stochasticrsi({values: marketData4h.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });
    
    const stochRsi1d = stochasticrsi({values: marketData1d.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    const stochRsi1w = stochasticrsi({values: marketData1w.close,
        rsiPeriod: 14,
        stochasticPeriod: 14,
        kPeriod: 3,
        dPeriod: 3
    });

    //const allOrders = await api.allOrders(timeApi.data.serverTime);

    const openOrders = await api.openOrders(timeApi.data.serverTime);

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
    
    objSendcalc = {

        lastUpdate: lastUpdate,
        balance: balance,
        availableBalance: availableBalance,
        marginBalance: marginBalance,
        unrealizedProfit: unrealizedProfit,
        serverTimestamp: timeApi.data.serverTime,
        tick: marketData1m.close[marketData1m.close.length-1],
        tickprev: marketData1m.close[marketData1m.close.length-2],
        flag: flag,
        signals: {},

        lastUpdtMarket1m: marketData1m.date[marketData1m.date.length-1],
        stoch1m: stochRsi1m[stochRsi1m.length-1],
        stoch1mprev: stochRsi1m[stochRsi1m.length-2],

        lastUpdtMarket3m: marketData3m.date[marketData3m.date.length-1],
        stoch3m: stochRsi3m[stochRsi3m.length-1],
        stoch3mprev: stochRsi3m[stochRsi3m.length-2],

        lastUpdtMarket5m: marketData5m.date[marketData5m.date.length-1],
        stoch5m: stochRsi5m[stochRsi5m.length-1],
        stoch5mprev: stochRsi5m[stochRsi5m.length-2],

        lastUpdtMarket15m: marketData15m.date[marketData15m.date.length-1],
        stoch15m: stochRsi15m[stochRsi15m.length-1],
        stoch15mprev: stochRsi15m[stochRsi15m.length-2],

        lastUpdtMarket30m: marketData30m.date[marketData30m.date.length-1],
        stoch30m: stochRsi30m[stochRsi30m.length-1],
        stoch30mprev: stochRsi30m[stochRsi30m.length-2],

        lastUpdtMarket1h: marketData1h.date[marketData1h.date.length-1],
        stoch1h: stochRsi1h[stochRsi1h.length-1],
        stoch1hprev: stochRsi1h[stochRsi1h.length-2],

        lastUpdtMarket4h: marketData4h.date[marketData4h.date.length-1],
        stoch4h: stochRsi4h[stochRsi4h.length-1],
        stoch4hprev: stochRsi4h[stochRsi4h.length-2],
        
        lastUpdtMarket1d: marketData1d.date[marketData1d.date.length-1],
        stoch1d: stochRsi1d[stochRsi1d.length-1],
        stoch1dprev: stochRsi1d[stochRsi1d.length-2],

        lastUpdtMarket1w: marketData1w.date[marketData1w.date.length-1],
        stoch1w: stochRsi1w[stochRsi1w.length-1],
        stoch1wprev: stochRsi1w[stochRsi1w.length-2],
        
        openorders: openOrders,
        positions: positions,
        pnlHist: pnlHist
        //allOrders: allOrders

    };

    const signals = calcSignals(objSendcalc);
    objSendcalc.signals = signals;

    await makeMoneyRain(timestamp);
    //const objSend = await makeMoneyRain(timestamp, objSendcalc);
    //objSend.signals = signals;

    writeUserData(objSendcalc);
    //writeUserData(objSend);

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

    response.setHeader('Cache-Control', 's-maxage=3', 'stale-while-revalidate');

    response.json(objSendcalc);
}

async function makeMoneyRain(timestamp){

    //let obj = objSendcalc;

    //const dbref = ref(database, 'rsidata/obj/signals');
    //const position = objSendcalc.positions.filter(b => b.symbol === 'BTCUSDT'); // || b.asset === 'USDT');
    //var flag = "";
    //obj.flag = "";

    const sig = objSendcalc.signals;

    //const app = initializeApp(firebaseConfig);
    //const database = getDatabase(app);
    //const dbRef = ref(getDatabase(app));

    //const data = "";

    
    if(flag != ""){
        await calcClosePosition(timestamp, sig);
    }
    if(flag == ""){
        await calcOpenPosition(timestamp, sig);
    }
    
    //objSendcalc.flag = flag;

    //get(child(dbRef, `users/${userId}`)).then((snapshot) => {    
    //get(child(dbRef)).then((snapshot) => {
        /*
    get(child(dbRef, 'rsidata/obj/signals')).then((snapshot) => {    


        if (snapshot.exists()) {

            *
            //console.log(snapshot.val());
            //const data = snapshot.val();
            const sig = objSendcalc.signals;
            
            //set(ref(database, 'rsidata/getsignals/data'), data);

            //const order = null;
            if(flag == ""){
            
                if (sig.rsi1m == 2){
                    flag = "1mC";

                    const orderBuy = await api.newOrderBuy(timestamp);

                    //obj.flag = flag;
                    //set(ref(database, 'rsidata/obj/signals/flag'), flag);

                }

                if (sig.rsi1m == -2){
                    flag = "1mV";

                    const orderSell = await api.newOrderSell(timestamp);
                    //obj.flag = flag;
                    //set(ref(database, 'rsidata/obj/signals/flag'), flag);

                }

                if (sig.rsi1m == 2 && sig.rsi3m >= 1 && sig.rsi5m == 2 ){
                    flag = "5mC";

                    const orderBuy = api.newOrderBuy(timestamp);
                    //obj.flag = flag;
                    //set(ref(database, 'rsidata/obj/signals/flag'), flag);

                }

                if (sig.rsi1m == -2 && sig.rsi3m <= -1 && sig.rsi5m == -2){
                    flag = "5mV";

                    const orderSell = api.newOrderSell(timestamp);
                    //obj.flag = flag;
                    //set(ref(database, 'rsidata/obj/signals/flag'), flag);

                }

            }

            obj.flag = flag;

            /*
        } else {
            console.log("No data available");
        }

    }).catch((error) => {
        console.error(error);
    });
    */

    //return objSendcalc;
}

async function calcClosePosition(timestamp, sig){

    const dif1m = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
    const dif3m = objSendcalc.stoch3m.k - objSendcalc.stoch3m.d;
    const dif5m = objSendcalc.stoch5m.k - objSendcalc.stoch5m.d;
    const dif15m = objSendcalc.stoch15m.k - objSendcalc.stoch15m.d;
    const dif30m = objSendcalc.stoch30m.k - objSendcalc.stoch30m.d;
    const dif1h = objSendcalc.stoch1h.k - objSendcalc.stoch1h.d;
    const dif4h = objSendcalc.stoch4h.k - objSendcalc.stoch4h.d;
    const dif1d = objSendcalc.stoch1d.k - objSendcalc.stoch1d.d;
    const dif1w = objSendcalc.stoch1w.k - objSendcalc.stoch1w.d;

    //const app = initializeApp(firebaseConfig);
    //const database = getDatabase(app);

    const position = objSendcalc.positions.filter(b => b.symbol === 'BTCUSDT'); // || b.asset === 'USDT');

    if(position){
        const position0 = position[0];
        set(ref(database, 'rsidata/hist/position'), position0);

    }else if(!position){

        //var flagClose = flag;

        if (flag != ""){
            flag = "";
            objSendcalc.flag = flag;
            //return;
            //set(ref(database, `rsidata/obj/flag`), flag);
            
            //return flagClose;
            //return "";
        }
    }


    if (flag == "1mC"){


        //if (dif1m < 0 && objSendcalc.stoch3m.k >= 70){
        if (dif1m < 0){

            const result = await api.closePositionBuy(timestamp);
            const ordIdC = result.orderId;
            //set(ref(database, `rsidata/log/close1mC`), result);

            

            //if (result.orderId != null){

                //const histOrd = createHistObj(result, objSendcalc, position, flag);
                //set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                //const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, 'rsidata/hist/ordIdC'), ordIdC);
                flag = "";
                objSendcalc.flag = flag;

                //return flag;

            //}
            //obj.flag = flag;

        }

    }else if (flagClose == "1mV"){

        //if (dif > 0 && objSendcalc.stoch3m.k <= 30){
        if (dif1m > 0){
            const result = await api.closePositionSell(timestamp);
            const ordIdV = result.orderId;

            //set(ref(database, `rsidata/log/close1mV`), result);


            //if (result.orderId != null){
                //const histOrd = createHistObj(result, objSendcalc, position, flag);
                //set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                //const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, 'rsidata/hist/ordIdV'), ordIdV);
                flag = "";
                objSendcalc.flag = flag;

                //return flag;

            //}

            //obj.flag = flag;

        }

    }

    
    
    /*
    else if (flag == "5mC"){

        if (objSendcalc.stoch5m.k >= 70 && objSendcalc.stoch3m.k >= 70 && dif3m < 0 && objSendcalc.stoch1m.k > 50 && dif1m < 0){
            const result = await api.closePositionBuy(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }else if (flag == "5mV"){

        if (objSendcalc.stoch5m.k <= 30 && objSendcalc.stoch3m.k <= 30 && dif3m > 0 && objSendcalc.stoch1m.k < 50 && dif1m > 0){
            const result = await api.closePositionSell(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }else if (flag == "15mC"){

        if (sig.rsi5m == -2 && objSendcalc.stoch15m.k >= 70 && sig.rsi15m <= -1 && objSendcalc.stoch1m.k > 50 && dif1m < 0){
            const result = await api.closePositionBuy(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }else if (flag == "15mV"){

        if (sig.rsi5m == 2 && objSendcalc.stoch15m.k <= 30 && sig.rsi15m >= 1 && objSendcalc.stoch1m.k < 50 && dif1m > 0){
            const result = await api.closePositionSell(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }else if (flag == "1hC"){

        if (sig.rsi5m == -2 && sig.rsi15m <= -1 && sig.rsi30m <= -1 && objSendcalc.stoch1h.k > 70){
            const result = await api.closePositionBuy(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }else if (flag == "1hV"){

        if (sig.rsi5m == 2 && sig.rsi15m >= 1 && sig.rsi30m >= 1 && objSendcalc.stoch1h.k > 70){
            const result = await api.closePositionSell(timestamp);

            if (result.orderId){
                const histOrd = createHistObj(result, objSendcalc, position, flag);
                set(ref(database, `rsidata/hist/${result.orderId}`), histOrd);
                flag = "";
            }

            //obj.flag = flag;

        }

    }
    */
    

    //return flagClose;

}

async function calcOpenPosition(timestamp, sig){

    //var flagOpen = flag;

    const dif1m = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
    const dif3m = objSendcalc.stoch3m.k - objSendcalc.stoch3m.d;
    const dif5m = objSendcalc.stoch5m.k - objSendcalc.stoch5m.d;
    const dif15m = objSendcalc.stoch15m.k - objSendcalc.stoch15m.d;
    const dif30m = objSendcalc.stoch30m.k - objSendcalc.stoch30m.d;
    const dif1h = objSendcalc.stoch1h.k - objSendcalc.stoch1h.d;
    const dif4h = objSendcalc.stoch4h.k - objSendcalc.stoch4h.d;
    const dif1d = objSendcalc.stoch1d.k - objSendcalc.stoch1d.d;
    const dif1w = objSendcalc.stoch1w.k - objSendcalc.stoch1w.d;


    //if (sig.rsi1m == 2 && sig.rsi3m >= 1 && flag == ""){
    if (sig.rsi1m == 2){
        

        const orderBuy = await api.newOrderBuy(timestamp);
        set(ref(database, `rsidata/hist/open1mC`), orderBuy.orderId);


        //if(orderBuy){
            flag = "1mC";        

            //obj.flag = flag;
            //set(ref(database, 'rsidata/obj/signals/flag'), flag);
            //return flagOpen;
            objSendcalc.flag = flag;
        //}

    }

    //if (sig.rsi1m == -2 && sig.rsi3m <= -1 && flag == ""){
    if (sig.rsi1m == -2){

        const orderSell = await api.newOrderSell(timestamp);
        set(ref(database, `rsidata/hist/open1mV`), orderSell.orderId);


        //if(orderSell){
            flag = "1mV";
        
            //set(ref(database, 'rsidata/obj/signals/flag'), flag);
            //return flagOpen;
            objSendcalc.flag = flag;
        //}

        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        //return "1mV";

    }

    /*

    if (sig.rsi3m >= 1 && sig.rsi5m >= 1 && objSendcalc.stoch1m.k < 50 && dif1m > 0 && (flag == "" || flag == "1mC")){
        flag = "5mC";

        //if (){
            const orderBuy = await api.newOrderBuy(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "5mC";

    }

    if (sig.rsi3m <= -1 && sig.rsi5m == -2 && objSendcalc.stoch1m.k > 50 && dif1m < 0 && (flag == "" || flag == "1mV")){
        flag = "5mV";

        //const dif = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
        //if (){
            const orderSell = await api.newOrderSell(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "5mV";

    }

    if (sig.rsi5m == 2 && objSendcalc.stoch15m.k <= 30 && sig.rsi15m >= 1 && objSendcalc.stoch1m.k < 50 && dif1m > 0 && (flag == "" || flag == "1mC" || flag == "5mC" )){
        flag = "15mC";

        //if (){
            const orderBuy = await api.newOrderBuy(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "15mC";

    }

    if (sig.rsi5m == -2 && objSendcalc.stoch15m.k >= 70 && sig.rsi15m <= -1 && objSendcalc.stoch1m.k > 50 && dif1m < 0 && (flag == "" || flag == "1mV" || flag == "5mV" )){
        flag = "15mV";

        //const dif = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
        //if (){
            const orderSell = await api.newOrderSell(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "15mV";

    }

    if (sig.rsi5m == 2 && sig.rsi15m == 2 && sig.rsi30m >= 1 && sig.rsi1h >= 1 && (flag == "" || flag == "1mC" || flag == "5mC" || flag == "15mC" )){
        flag = "1hC";

        //if (){
            const orderBuy = await api.newOrderBuy(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "1hC";

    }

    if (sig.rsi5m == -2 && sig.rsi15m == -2 && sig.rsi30m >= -1 && sig.rsi1h >= -1 && (flag == "" || flag == "1mC" || flag == "5mC" || flag == "15mC" )){
        flag = "1hV";

        //const dif = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
        //if (){
            const orderSell = await api.newOrderSell(timestamp);
        //}
        //obj.flag = flag;
        //set(ref(database, 'rsidata/obj/signals/flag'), flag);

        return "1hV";

    }

    */

    //return flagOpen;
}

function createHistObj(result, objSendcalc, position, flag){

    const histObj = {

        orderId: result.orderId,
        firstUpdate: position.updateTime,
        lastUpdate: objSendcalc.serverTimestamp,
        symbol: position[0].symbol,
        entryPrice: position[0].entryPrice,
        closePrice: objSendcalc.tick,
        isolatedMargin: position[0].isolatedWallet,
        highPnl: position[0].unrealizedProfit,
        lowPnl: position[0].unrealizedProfit,
        realizedPnl: position[0].unrealizedProfit,
        flag: flag

    }  
    
    return histObj;

}

function calcSignals(objSendcalc) {
    
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    const rsi1mdif = objSendcalc.stoch1m.k - objSendcalc.stoch1m.d;
    const rsi1mdif2 = objSendcalc.stoch1mprev.k - objSendcalc.stoch1mprev.d;   
    const sig1m = calcFlag(objSendcalc.stoch1m, rsi1mdif, rsi1mdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi1m'), sig1m);

    const rsi3mdif = objSendcalc.stoch3m.k - objSendcalc.stoch3m.d;
    const rsi3mdif2 = objSendcalc.stoch3mprev.k - objSendcalc.stoch3mprev.d;   
    const sig3m = calcFlag(objSendcalc.stoch3m, rsi3mdif, rsi3mdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi3m'), sig3m);

    const rsi5mdif = objSendcalc.stoch5m.k - objSendcalc.stoch5m.d;
    const rsi5mdif2 = objSendcalc.stoch5mprev.k - objSendcalc.stoch5mprev.d;   
    const sig5m = calcFlag(objSendcalc.stoch5m, rsi5mdif, rsi5mdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi5m'), sig5m);

    const rsi15mdif = objSendcalc.stoch15m.k - objSendcalc.stoch15m.d;
    const rsi15mdif2 = objSendcalc.stoch15mprev.k - objSendcalc.stoch15mprev.d;   
    const sig15m = calcFlag(objSendcalc.stoch15m, rsi15mdif, rsi15mdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi15m'), sig15m);

    const rsi30mdif = objSendcalc.stoch30m.k - objSendcalc.stoch30m.d;
    const rsi30mdif2 = objSendcalc.stoch30mprev.k - objSendcalc.stoch30mprev.d;   
    const sig30m = calcFlag(objSendcalc.stoch30m, rsi30mdif, rsi30mdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi30m'), sig30m);

    const rsi1hdif = objSendcalc.stoch1h.k - objSendcalc.stoch1h.d;
    const rsi1hdif2 = objSendcalc.stoch1hprev.k - objSendcalc.stoch1hprev.d;   
    const sig1h = calcFlag(objSendcalc.stoch1h, rsi1hdif, rsi1hdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi1h'), sig1h);

    const rsi4hdif = objSendcalc.stoch4h.k - objSendcalc.stoch4h.d;
    const rsi4hdif2 = objSendcalc.stoch4hprev.k - objSendcalc.stoch4hprev.d;   
    const sig4h = calcFlag(objSendcalc.stoch4h, rsi4hdif, rsi4hdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi4h'), sig4h);

    const rsi1ddif = objSendcalc.stoch1d.k - objSendcalc.stoch1d.d;
    const rsi1ddif2 = objSendcalc.stoch1dprev.k - objSendcalc.stoch1dprev.d;   
    const sig1d = calcFlag(objSendcalc.stoch1d, rsi1ddif, rsi1ddif2);

    //set(ref(database, 'rsidata/obj/signals/rsi1d'), sig1d);

    const rsi1wdif = objSendcalc.stoch1w.k - objSendcalc.stoch1w.d;
    const rsi1wdif2 = objSendcalc.stoch1wprev.k - objSendcalc.stoch1wprev.d;   
    const sig1w = calcFlag(objSendcalc.stoch1w, rsi1wdif, rsi1wdif2);

    //set(ref(database, 'rsidata/obj/signals/rsi1w'), sig1w);

    const sig = {

        rsi1m: sig1m,
        rsi3m: sig3m,
        rsi5m: sig5m,
        rsi15m: sig15m,
        rsi30m: sig30m,
        rsi1h: sig1h,
        rsi4h: sig4h,
        rsi1d: sig1d,
        rsi1w: sig1w        
    }

    return sig;
}

function calcFlag(item, dif, dif2){

    let flag = 0;  // 0 = neutro; 1 = Pré-compra; 2 = comprar; -1 = Pré-venda; -2 = vender

    if (item.k > 70 && item.d > 70){                                        // sobrecomprado
        if(dif > 0){                                                        // subindo
            if(dif < dif2){                                                 // revertendo para baixo ex.: (4 < 5) = true
                if(dif < 2){
                    flag = -1; // Pré-venda
                }                                                 
            }
        }else if(dif < 0){                                                  // caindo
            flag = -2; // vender
        }
    }else
    if (item.k < 30 && item.d < 30){                                        // sobrevendido
        if(dif > 0){                                                        // subindo
            flag = 2; // comprar
        }else if(dif < 0){                                                  // caindo
            
            if(dif > dif2){                                                 // revertendo para cima  ex.: (-4 > -5) = true
                if(dif > -2){
                    flag = 1; // Pré-compra
                }                                                 
            }
        }
    }else{
        flag = 0; // neutro
    }

    return flag;
}

function writeUserData(objSendcalc) {

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    objSendcalc.flag = flag;
    set(ref(database, 'rsidata/obj'), objSendcalc);
}

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

function criarObj3m(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr3m.push(formattedTime);
    timestampArr3m.push(unix_timestamp);
    openArr3m.push(item[1]);
    closeArr3m.push(item[4]);
    highArr3m.push(item[2]);
    lowArr3m.push(item[3]);
    volArr3m.push(item[5]);

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

function criarObj30m(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr30m.push(formattedTime);
    timestampArr30m.push(unix_timestamp);
    openArr30m.push(item[1]);
    closeArr30m.push(item[4]);
    highArr30m.push(item[2]);
    lowArr30m.push(item[3]);
    volArr30m.push(item[5]);

}

function criarObj1h(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr1h.push(formattedTime);
    timestampArr1h.push(unix_timestamp);
    openArr1h.push(item[1]);
    closeArr1h.push(item[4]);
    highArr1h.push(item[2]);
    lowArr1h.push(item[3]);
    volArr1h.push(item[5]);

}

function criarObj4h(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr4h.push(formattedTime);
    timestampArr4h.push(unix_timestamp);
    openArr4h.push(item[1]);
    closeArr4h.push(item[4]);
    highArr4h.push(item[2]);
    lowArr4h.push(item[3]);
    volArr4h.push(item[5]);

}

function criarObj1d(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr1d.push(formattedTime);
    timestampArr1d.push(unix_timestamp);
    openArr1d.push(item[1]);
    closeArr1d.push(item[4]);
    highArr1d.push(item[2]);
    lowArr1d.push(item[3]);
    volArr1d.push(item[5]);

}

function criarObj1w(item){

    let unix_timestamp = item[0]
    var formattedTime = formatTime(unix_timestamp);

    dateArr1w.push(formattedTime);
    timestampArr1w.push(unix_timestamp);
    openArr1w.push(item[1]);
    closeArr1w.push(item[4]);
    highArr1w.push(item[2]);
    lowArr1w.push(item[3]);
    volArr1w.push(item[5]);

}

function formatTime(timestamp){

    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    switch(hours){
        case 0 :
            hours = 24;
            break;
        case 1 :
            hours = 25;
            break;
        case 2 :
            hours = 26;
            break;
        case 3 :
            hours = 27;
            break;
    
    }
    //var x = hours-3;
    //hours = x;
    //var x = hours-3;
    hours = hours-3;
    minutes = minutes;
    seconds = seconds;

    if (hours < 10){
        //var edited = "0"+hours;
        hours = "0"+ hours;
    }

    if (minutes < 10){
        minutes = "0"+ minutes;
    }

    if (seconds < 10){
        seconds = "0"+ seconds;
    }

    var formattedTime = hours + ':' + minutes + ':' + seconds;

    return formattedTime;
}

export default data;