var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");
function start(response){
  console.log("request handler 'start' was called");

  var body = '<html>'+'<head>'+'<body>'+'<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="upload"/><input type="submit" value="upload file">'+'</form></body></html>';

  response.writeHead(200,{"Content-Type":"text/html"});
    response.write(body);
    response.end();

}

function upload(response,postData){
  console.log("request handler 'upload' was called");
  // console.log('data',postData)
    // response.writeHead(200,{"Content-Type":"text/xml"});
    //   response.write("data:haha");
    //   response.write("<image src='/show'/>");
    //   response.end();
    response.on('data',function(){
      console.log(chunk.toString());
    })
  var form = new formidable.IncomingForm();
  // console.log('aa',request)
  form.parse(postData,function(error,fields,file){
    console.log(file.file_list)
    fs.renameSync(file.file_list.path,"/tmp/test.jpg");
    response.writeHead(200,{"Content-Type":"text/html"});
      response.write("image:</br>");
      response.write("<image src='/show'/>");
      response.end();
  });

}

function show(response,postData){
  console.log("request handler 'show' was called");
  fs.readFile("/tmp/test.png","binary",function(error,file){
      if(error){
           response.writeHead(500,{"Content-Type":"text/plain"});
           response.write(error+"\n");
             response.end();
      }else{
          response.writeHead(200,{"Content-Type":"image/png"});
          response.write(file,"binary");
          response.end();
      }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
