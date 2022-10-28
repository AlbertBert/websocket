const app = require("express")();
const http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res){
  // res.sendfile("index.html");
  res.send('Hello World!');
});

//Whenever someone connects this gets executed
io.on("connection", function(socket){
  console.log("A user connected");

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

});

http.listen(3001, function(){
  console.log("listening on *:3000");
});
