// httpモジュールを読み込む
var http = require('http');
var fs = require('fs');

// http.Serverクラスのインスタンスを作成する
var server = http.createServer();

// requestイベントハンドラを定義する
server.on('request', function(request, response) {
  // コンソールにリクエストされたURLを出力
  console.log(request.url);
  if(request.url == '/'){
    request.url = 'index.html';
  }
  fs.readFile('./' + request.url,'utf-8',function(err,data){
    if(err){
      response.writeHead(404,{'content-Type': 'text/plain'});
			response.write("not found");
			return response.end();
    }
    response.writeHead(200,{'content-Type': 'text/html'});
	  response.write(data);
	  response.end();
  });
});

// 8080番ポートで待ち受けを開始する
server.listen(8000);
