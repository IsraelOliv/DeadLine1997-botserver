function neworder(request, response){
    const dynamicDate = new Date();

    response.json({
        serverTimestamp: dynamicDate,
        marginBalance: "0.02738226"
    })
    //{"serverTimestamp":"1648712608125","marginBalance":"0.02738226"}
}

export default neworder;