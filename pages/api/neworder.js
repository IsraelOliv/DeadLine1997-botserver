
const api = require('./api');

function neworder(request, response){
    const dynamicDate = new Date();
/*
    result = await api.time();
    console.log(`serverTime: ${result.data.serverTime}`);
    ts = result.data.serverTime;

    const newOrd = await api.newOrder(ts,"BUY", 0.003);
    console.log(`newOrd.orderId: ${newOrd.orderId}`);

    */
    response.json({
        serverTimestamp: dynamicDate,
        marginBalance: "0.02738226"
    })
    //{"serverTimestamp":"1648712608125","marginBalance":"0.02738226"}
}

export default neworder;