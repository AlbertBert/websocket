#### 本地如何启动

- cd到client目录下，运行命令npm i，安装相应包
- 安装完相应包后，运行命令npm start，启动页面部分
- cd到server目录下，运行命令npm i，安装相应包
- 安装完相应包后，运行命令npm  run start，启动服务器部分
- 访问http://localhost:3000/index.html， 即可看到拍卖师页面
- 访问http://localhost:3000/admin.html， 即可看到投标者页面
  
#### 注意事项和踩坑点

* websocket通信有跨域限制，也就是前端在建立socket连接时需要指定socket服务器和端口，本地是通过前端代理解决，也可以使用CORS解决
* 用create react app建立的项目是react单页应用，其中默认的webpack配置是隐藏的，如果需要react多页面应用，需要执行npm run eject才能看到webpack配置，可参考https://www.jianshu.com/p/9a4b336b1410 建议多页应用