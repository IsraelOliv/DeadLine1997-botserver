//const axios = require('axios');
//const queryString = require('querystring');

import axios from 'axios';
import queryString from 'querystring';
import crypto from 'crypto';
const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;
//const symbol = process.env.SYMBOL;
const symbol = 'BTCUSDT'; 
//const symbol = 'ADAUSDT'; 
 
async function publicCall(path, data, method = 'GET', headers = {}) {
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        });
        return result;
    } catch (err) {
        console.error(err);
    }
}

async function publicFutCall(path, data, method = 'GET', headers = {}) {
    try {
        const qs = data ? `?${queryString.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL_FUT}${path}${qs}`
        });
        return result;
    } catch (err) {
        console.error(err);
    }
}


async function privateCall(path, timestamp, data = {}, method = 'GET') {
    if (!apiKey || !apiSecret){
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');
    }
    const type = "FUTURES";
    //const timestamp = (Date.now())-1000;
    const recvWindow = 60000;//máximo permitido, default 5000
    
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, type, timestamp, recvWindow })}`)
        .digest('hex');
 
    const newData = { ...data, type, timestamp, recvWindow, signature };
    const qs = `?${queryString.stringify(newData)}`;
 
    try {
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        return result.data;
    } catch (err) {
        console.log(err);
    }
}

async function privateFutCall(path, timestamp, data = {}, method = 'GET') {
    if (!apiKey || !apiSecret){
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');
    }
    const type = "FUTURES";
    //const timestamp = (Date.now())-1000;
    const recvWindow = 60000;//máximo permitido, default 5000
    
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, type, timestamp, recvWindow })}`)
        .digest('hex');
 
    const newData = { ...data, type, timestamp, recvWindow, signature };
    const qs = `?${queryString.stringify(newData)}`;
 
    try {
        const result = await axios({
            method,
            url: `${process.env.API_URL_FUT}${path}${qs}`,
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        return result.data;
    } catch (err) {
        console.log(err);
    }
}
 
async function time() {
    return publicCall('/api/v3/time');
}
 
async function depth(symbol = 'BTCBRL', limit = 5) {
    return publicCall('/api/v3/depth', { symbol, limit });
}

async function exchangeInfo(symbol) {
    const result = await publicCall('/api/v3/exchangeInfo');
    return symbol ? result.symbols.find(s => s.symbol === symbol) : result.symbols;
}
 
async function accountInfo(){
    return privateCall('/v3/account');
}

async function accountSnapshot(timestamp){

    return privateCall('/sapi/v1/accountSnapshot',timestamp);
}

async function balance(timestamp){

    return privateFutCall('/fapi/v2/balance',timestamp);
}

async function accountFutures(timestamp){

    return privateFutCall('/fapi/v2/account',timestamp);
}

async function klines(interval){
    const limit = 100;
    //return publicCall('/api/v3/klines',{symbol, interval, limit});
    return publicFutCall('/fapi/v1/klines',{symbol, interval, limit});
}

async function openOrders(timestamp){

    return privateFutCall('/fapi/v1/openOrders',timestamp);
}

module.exports = { time, depth, exchangeInfo, accountSnapshot, balance, accountFutures, klines, openOrders }

/*

"positions": [
{
        "symbol": "BTCUSDT",
        "initialMargin": "1.03671120",
        "maintMargin": "0.51835560",
        "unrealizedProfit": "0.39540000",
        "positionInitialMargin": "1.03671120",
        "openOrderInitialMargin": "0",
        "leverage": "125",
        "isolated": true,
        "entryPrice": "43064.5",
        "maxNotional": "50000",
        "positionSide": "BOTH",
        "positionAmt": "0.003",
        "notional": "129.58890000",
        "isolatedWallet": "1.04676060",
        "updateTime": 1649617567003,
        "bidNotional": "0",
        "askNotional": "0"
      }
    ]


Current All Open Orders (USER_DATA)
Response:

[
  {
    "avgPrice": "0.00000",
    "clientOrderId": "abc",
    "cumQuote": "0",
    "executedQty": "0",
    "orderId": 1917641,
    "origQty": "0.40",
    "origType": "TRAILING_STOP_MARKET",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,   // if Close-All
    "symbol": "BTCUSDT",
    "time": 1579276756075,              // order time
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order
    "updateTime": 1579276756075,        // update time
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected   
  }
]
GET /fapi/v1/openOrders (HMAC SHA256)

Get all open orders on a symbol. Careful when accessing this with no symbol.

Weight: 1 for a single symbol; 40 when the symbol parameter is omitted

Parameters:

Name	Type	Mandatory	Description
symbol	STRING	NO	
recvWindow	LONG	NO	
timestamp	LONG	YES	
If the symbol is not sent, orders for all symbols will be returned in an array.

All Orders (USER_DATA)
Response:

[
  {
    "avgPrice": "0.00000",
    "clientOrderId": "abc",
    "cumQuote": "0",
    "executedQty": "0",
    "orderId": 1917641,
    "origQty": "0.40",
    "origType": "TRAILING_STOP_MARKET",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,   // if Close-All
    "symbol": "BTCUSDT",
    "time": 1579276756075,              // order time
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order
    "updateTime": 1579276756075,        // update time
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected   
  }
]
GET /fapi/v1/allOrders (HMAC SHA256)

Get all account orders; active, canceled, or filled.

These orders will not be found:
order status is CANCELED or EXPIRED, AND
order has NO filled trade, AND
created time + 7 days < current time
Weight: 5

Parameters:

Name	Type	Mandatory	Description
symbol	STRING	YES	
orderId	LONG	NO	
startTime	LONG	NO	
endTime	LONG	NO	
limit	INT	NO	Default 500; max 1000.
recvWindow	LONG	NO	
timestamp	LONG	YES	
Notes:

If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned.
The query time period must be less then 7 days( default as the recent 7 days).


New Order (TRADE)
Response:

{
    "clientOrderId": "testOrder",
    "cumQty": "0",
    "cumQuote": "0",
    "executedQty": "0",
    "orderId": 22542179,
    "avgPrice": "0.00000",
    "origQty": "10",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",        // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,   // if Close-All
    "symbol": "BTCUSDT",
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "origType": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",    // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",         // callback rate, only return with TRAILING_STOP_MARKET order
    "updateTime": 1566818724722,
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected   
}
POST /fapi/v1/order (HMAC SHA256)

Send in a new order.

Weight: 1

Parameters:

Name	Type	Mandatory	Description
symbol	STRING	YES	
side	ENUM	YES	
positionSide	ENUM	NO	Default BOTH for One-way Mode ; LONG or SHORT for Hedge Mode. It must be sent in Hedge Mode.
type	ENUM	YES	
timeInForce	ENUM	NO	
quantity	DECIMAL	NO	Cannot be sent with closePosition=true(Close-All)
reduceOnly	STRING	NO	"true" or "false". default "false". Cannot be sent in Hedge Mode; cannot be sent with closePosition=true
price	DECIMAL	NO	
newClientOrderId	STRING	NO	A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: ^[\.A-Z\:/a-z0-9_-]{1,36}$
stopPrice	DECIMAL	NO	Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
closePosition	STRING	NO	true, false；Close-All，used with STOP_MARKET or TAKE_PROFIT_MARKET.
activationPrice	DECIMAL	NO	Used with TRAILING_STOP_MARKET orders, default as the latest price(supporting different workingType)
callbackRate	DECIMAL	NO	Used with TRAILING_STOP_MARKET orders, min 0.1, max 5 where 1 for 1%
workingType	ENUM	NO	stopPrice triggered by: "MARK_PRICE", "CONTRACT_PRICE". Default "CONTRACT_PRICE"
priceProtect	STRING	NO	"TRUE" or "FALSE", default "FALSE". Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
newOrderRespType	ENUM	NO	"ACK", "RESULT", default "ACK"
recvWindow	LONG	NO	
timestamp	LONG	YES	
Additional mandatory parameters based on type:

Type	Additional mandatory parameters
LIMIT	timeInForce, quantity, price
MARKET	quantity
STOP/TAKE_PROFIT	quantity, price, stopPrice
STOP_MARKET/TAKE_PROFIT_MARKET	stopPrice
TRAILING_STOP_MARKET	callbackRate

/fapi/v2/account

GET /fapi/v2/balance (HMAC SHA256)

Weight: 5

Parameters:

Name	Type	Mandatory	Description
recvWindow	LONG	NO	
timestamp	LONG	YES

GET /sapi/v1/accountSnapshot (HMAC SHA256)

Weight(IP): 2400

Parameters:

Name	Type	Mandatory	Description
type	STRING	YES	"SPOT", "MARGIN", "FUTURES"
startTime	LONG	NO	
endTime	LONG	NO	
limit	INT	NO	min 7, max 30, default 7
recvWindow	LONG	NO	
timestamp	LONG	YES


GET /api/v3/klines

Kline/candlestick bars for a symbol.
Klines are uniquely identified by their open time.

Weight(IP): 1

Parameters:

Name	Type	Mandatory	Description
symbol	STRING	YES	
interval	ENUM	YES	
startTime	LONG	NO	
endTime	LONG	NO	
limit	INT	NO

[
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]

*/