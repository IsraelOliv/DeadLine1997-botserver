//const axios = require('axios');
//const queryString = require('querystring');

import axios from 'axios';
import queryString from 'querystring';
 
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

//const crypto = require('crypto');
import crypto from 'crypto';
const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;
//const symbol = process.env.SYMBOL;
const symbol = 'BTCUSDT'; 
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

async function klines(interval){
    const limit = 100;
    return publicCall('/api/v3/klines',{symbol, interval, limit});
}

module.exports = { time, depth, exchangeInfo, accountSnapshot, klines }

/*
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