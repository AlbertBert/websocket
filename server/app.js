const app = require("express")();
const http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res){
  // res.sendfile("index.html");
  res.send('Hello World!');
});

let listData = [];
let userHistoryList = [];
let maxPriceInfo = {};

//Whenever someone connects this gets executed
io.on("connection", function(socket){
  console.log("A user connected");


  socket.on('start', function(msg){
    const data = JSON.parse(msg)
    const { name, startPrice, countTime, startTime } = data;
    listData = [];
    userHistoryList = [];
    maxPriceInfo = {};
    io.emit('start', {
      ...data,
      endTime: startTime + countTime * 1000
    });
    console.log('message: ' + msg, name);
  });

  socket.on('end', function(){
    io.emit('end');
  });

  socket.on('toubiao', function(msg){
    const data = JSON.parse(msg)
    const { username, price } = data;
    // 1.投标历史记录 投标者加价格
    // 2.每一个投标人的信息：姓名+次数+最高价格
    // 3.最高出价和出家人
    // 4.投标总次数
    console.log('listData', listData);
    listData.push(data);
    let flag = false;
    userHistoryList.forEach(item => {
      if (item.username === username) {
        item.count += 1;
        item.maxPrice = Math.max(price, item.maxPrice);
        flag = true;
      }
    })
    if (!flag) {
      userHistoryList.push({
        username,
        maxPrice: price,
        count: 1
      })
    }
    if (!maxPriceInfo.maxPrice) {
      maxPriceInfo.maxPrice = price;
      maxPriceInfo.username = username;
      maxPriceInfo
    } else if (maxPriceInfo.maxPrice < price) {
      maxPriceInfo.maxPrice = price;
      maxPriceInfo.username = username;
    }
    maxPriceInfo.totalCount = userHistoryList.length;
    io.emit('toubiao', listData, userHistoryList, maxPriceInfo);
    io.emit('maxPriceInfo', maxPriceInfo);
    console.log('message: ' + msg);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

});

http.listen(3001, function(){
  console.log("listening on *:3001");
});
