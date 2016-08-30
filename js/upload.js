/*
    upload.js是上传图片中调用的接口，包括图片的上传，图片刷新
 */

function upload(config){
    this.config = config;

}

upload.commit_error = 1;
upload.commit_right = 2;
upload.commit_server_right = 3;
upload.commit_server_error = 4;

upload.up_success = 5;
upload.up_fail = 6;


upload.prototype.ajaxUp = function(fileId, callback){
var formData = new FormData();
formData.append('file_list', fileId);
  ajax({
      url: 'http://127.0.0.1:3000/start',
      type: 'POST',
      data:formData ,
      async: false,
      success: function(){
          callback(key,name);
          window.console.log('upload class success');

      },
      error: function(){
          window.console.log('与提交服务器通信发生错误');
      }
  });
    // for(var i = 0; i< $('#'+fileId)[0].files.length; i++){
    //     var formData = new FormData();
    //     formData.append('file_list', $('#'+fileId)[0].files[i].name);
    //     ajax({
    //         url: 'http://storage.guazi.com/sign.php',
    //         type: 'POST',
    //         data: formData,
    //         async: false,
    //         dataType : 'json',
    //         index: i,
    //         success: function(data, cur_i){
    //             if(0 === data.code) {
    //                 var signs = data.data.signs;
    //                 var policy = signs.Policy;
    //                 var kss = signs.KSSAccessKeyId;
    //                 var key = signs.key;
    //                 var acl = signs.acl;
    //                 var signature = signs.Signature;
    //                 var name = signs.file_name;
    //                 var formDataUp = new FormData();
    //
    //                 formDataUp.append('KSSAccessKeyId',kss);
    //                 formDataUp.append('acl', acl);
    //                 formDataUp.append('key', key);
    //                 formDataUp.append('Policy',policy);
    //                 formDataUp.append('Signature',signature);
    //                 formDataUp.append('file', $('#'+fileId)[0].files[cur_i]);
    //                 var fileObj = $('#'+fileId)[0].files[cur_i];
    //                 ajax({
    //                     url: 'http://guazi01.kss.ksyun.com',
    //                     type: 'POST',
    //                     data:formDataUp ,
    //                     async: false,
    //                     success: function(){
    //                         callback(key,name,fileObj);
    //                         window.console.log('upload class success');
    //
    //                     },
    //                     error: function(){
    //                         window.console.log('与提交服务器通信发生错误');
    //                     }
    //                 });
    //             }
    //         },
    //         error: function(){
    //             window.console.log('与获取服务器通信发生错误');
    //         }
    //     });
    // }
};
//upload.prototype.iframeUp = function(fileId,formId){
//    if($('#'+fileId)[0].files.length !== 0){
//        for(var i = 0; i< $('#'+fileId)[0].files.length; i++){
//            ajax({
//                url: 'http://storage.guazi.com/sign.php',
//                type: 'POST',
//                data: {'file_list': $('#'+fileId)[0].files[i].name},
//                async: false,
//                dataType : 'json',
//                success : function(data){
//                    if(0 === data.code){
//                        var signs = data.data.signs;
//                        var policy = signs.Policy;
//                        var kss = signs.KSSAccessKeyId;
//                        var key = signs.key;
//                        var acl = signs.acl;
//                        var signature = signs.Signature;
//
//                        var iframe = document.createElement('iframe');
//                        var form = document.getElementById(formId);
//                        iframe.id = 'iframeUpload';
//                        iframe.name = 'iframeUpload';
//                        iframe.style.display = 'none';
//                        form.action = 'http://guazi01.kss.ksyun.com';
//                        form.method = 'POST';
//                        form.target = 'iframeUpload';
//                        form.parentNode.insertBefore(iframe,form);
//                        var a = createInput(fileId,'hidden','key',key);
//                        var b = createInput(fileId,'hidden','KSSAccessKeyId',kss);
//                        var c = createInput(fileId,'hidden','Policy',policy);
//                        var d = createInput(fileId,'hidden','Signature',signature);
//                        var e = createInput(fileId,'hidden','acl',acl);
//
//                        form.submit();
//
//                        iframe.onload = function(){
//                            iframe.remove();
//                            a.remove();
//                            b.remove();
//                            c.remove();
//                            d.remove();
//                            e.remove();
//                        };
//
//
//
//                    }
//                }
//            });
//        }
//    }
//};

upload.prototype.refreshImg = function(fileName,fileObj,callback){
    var formData = new FormData();
    formData.append('file_list', fileName);
    ajax({
        url: 'http://storage.guazi.com/sign.php',
        type: 'POST',
        data: formData,
        async: false,
        dataType : 'json',
        success: function(data){
            if(0 === data.code) {
                var signs = data.data.signs;
                var policy = signs.Policy;
                var kss = signs.KSSAccessKeyId;
                var key = signs.key;
                var acl = signs.acl;
                var signature = signs.Signature;
                var name = signs.file_name;
                var formDataUp = new FormData();
                // self.key = key;
                formDataUp.append('KSSAccessKeyId',kss);
                formDataUp.append('acl', acl);
                formDataUp.append('key', key);
                formDataUp.append('Policy',policy);
                formDataUp.append('Signature',signature);
                formDataUp.append('file', fileObj);
                ajax({
                    url: 'http://guazi01.kss.ksyun.com',
                    type: 'POST',
                    data:formDataUp ,
                    async: false,
                    success: function(){
                        callback(key,name,fileObj);
                        window.console.log('refresh success');
                    },
                    error: function(){
                        window.console.log('与提交服务器通信发生错误');
                    }
                });
            }
        },
        error: function(){
            window.console.log('与获取服务器通信发生错误');
        }
    });

};
//封装ajax
var createAjax = function(){
    var xhr = null;
    try{
        xhr = new XMLHttpRequest();
    }catch(e1){
        window.alert('您的浏览器不支持ajax，请更换');
    }
    return xhr;
};
var ajax = function(conf){
    var type1 = conf.type;
    var type = type1.toUpperCase();
    var random = Math.random();
    var data = conf.data;
    var success = conf.success;
    var dataType = conf.dataType;
    var url = conf.url;
    var index = conf.index;
    var headers = conf.headers;

    var xhr = createAjax();

    if (type === 'GET') {
        if(data){
            xhr.open('GET', url + '?' + data, true);
        }else{
            xhr.open('GET', url + '?t=' + random, true);
        }

        if(headers){
            for(var it in headers){
                xhr.setRequestHeader(it, headers[it]);
            }

        }

        xhr.send();
    } else if (type === 'POST') {
        xhr.open('POST', url, true);

        if(headers){
            for(var it in headers){
                xhr.setRequestHeader(it, headers[it]);
            }

        }
        if(data){
            xhr.send(data);
        }else{
            xhr.send();
        }
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status ===200){
            if(dataType === 'text'||dataType==='TEXT') {
                if (success !== null){
                    success(xhr.responseText, index);
                }
            }else if(dataType==='xml'||dataType==='XML') {
                if (success !== null){
                    success(xhr.responseXML, index);
                }
            }else if(dataType==='json'||dataType==='JSON') {
                if (success !== null){
                    success(eval('('+xhr.responseText+')'), index);
                }
            }
        }else if(xhr.readyState === 2 && xhr.status === 200) {
            if(success !== null){
                success(xhr.responseText, index);
            }
        }
    };
};
// module.exports =  upload;
