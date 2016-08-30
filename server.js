var http = require('http');
var url = require('url');
var query = require("querystring");
var fs = require('fs');

function serverStart(route,handle){
        http.createServer(function(req,res){
          var pathname = url.parse(req.url).pathname;
          console.log('http req for '+pathname+' recieved');

          //判断是GET/POST请求
        if(req.method == "GET"){
            var params = [];
            params = url.parse(req.url,true).query;
            // res.write(JSON.stringify(params));
            res.end();
        }else{
            var str = req.headers['content-type'].split("boundary=")[1];
            console.log('headers', str)
            var postdata = "";
            req.addListener("data",function(postchunk){
                postdata += postchunk;
            })

            //POST结束输出结果
            req.addListener("end",function(){
                var params = query.parse(postdata);
                params = JSON.stringify(params);
                params = params.split(str)[1];
                var num = params.lastIndexOf("=");
                params = params.slice(0,num+1);
                // params = "data:image/png;base64,"+params.split("base64,")[1];
                params = params.split("base64,")[1];
                params.replace(/\r\n\s+/g, '');
                console.log(params);
                var s = "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";
                console.log(params === s)
                var dataBuffer = new Buffer(s, "base64");
                fs.writeFile("image.png", dataBuffer, function(err) {
                    if(err){
                      console.log(err);
                    }else{
                      // res.sendData("保存成功！");
                      console.log("success")
                    }
                });
                // res.write(JSON.stringify(params));
                res.end();
            })
        }

          route(handle,pathname,res,req);

        }).listen(3000,'127.0.0.1');

        console.log('http server start on port 3000');
}

exports.serverStart = serverStart;