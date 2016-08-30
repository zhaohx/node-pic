/** 图片上传组件
*  示例:
var upload = require('js/util/uploadImg/view/uploadWidget.js');
upload.init(['.upload']);
<div class="upload">
    <div class="upload-btn" data-role="upBtn" enctype="multipart/form-data">
        <input type="button" class="btn-photo"  data-role="upfile" value="上传图片"/>
    </div>

    <ul class="upload-box" data-role="upBox">
    <li>
        <span class="btn-file">
            <input data-role="file" type="file" class="ufile" id="file" name="file" multiple />
            <a data-role="addImg" class="addImg">+</a>
        </span>
    </li>
    </ul>

    <div class="upload-text">您已上传<span data-role="num"></span>个文件。</div>
</div>

data-role="upfile"  把已选择图片上传到服务器的按钮
data-role="addImg"  添加图片到准备上传
data-role="delete"  删除图片
**/
var Widget = require('../lib/widget.js');
//var tpl = require('../tpl/up.tpl');
//var $ = require('$');
var Upload = require('./upload.js');
var upload = new Upload();
var num = 0;


//exports.init = function(config){
//    this.config = config;
//    $('body').removeClass('loading').append(tpl());
//    Widget.initWidgets();
//};
var widget = Widget.define({
    events:{
        'click [data-role="addImg"]' : function(){
            $(this.config.$file).click();
        },
        'change [data-role="file"]' : function(e){
            this.fileSelect(e);
            this.config.$upfile.trigger('click');
        },
        'click [data-role="upfile"]' : function(){
            var self = this;
            var upBox = this.config.$upBox;

            upload.ajaxUp('file',function(key,name,fileObj) {
                num = num +1;
                self.refreshFile.push({name : name, file: fileObj});
                if(key){

                    var id = key.substring(17,30);
                    var link = 'http://guazi01.kssws.ks-cdn.com/'+key+'@base@tag=imgScale&w=171&r=1';
                    $.ajax({
                        url:link,
                        type:'GET',
                        async: false,
                        success:function(){
                            $(upBox).append($('<li class="u-success"><img id="'+id+'" data-id="'+id+'" class="img-small" src="'+link+'"data-key="'+key+'"data-name="'+name+'"><div class="shadow"><a class="u24" data-role="delete" ></a></div></li>'));
                        },
                        error: function(){
                            $(upBox).append($('<li class="u-fail"><i class="u12"></i><div class="shadow"><a class="u21" data-role="rotate1"></a><a class="u22" data-role="rotate2"></a><a class="u23" data-name="'+name+'" data-role="refresh" ></a><a class="u24" data-role="delete" ></a></div></li>'));
                        }

                    });
                }else{
                    $(upBox).append($('<li class="u-tips"><i class="u11"></i><span class="fs12">上传失败,请重试</span><div class="shadow"><a class="u23" data-name="'+name+'" data-role="refresh" ></a><a class="u24" data-role="delete" ></a></div></li>'));
                }
                $(self.config.$num).html(num+'/3');
                if(num >= 3){
                    $(self.config.$upfile).addClass('disabled');
                    $(self.config.$upfile).attr('disabled', 'disabled');
                }

            });

        },
        'click [data-role="delete"]' : function(e){
            e.currentTarget.parentNode.parentNode.remove();
            num = num -1;
            $(this.config.$num).html(num+'/3');
            if(num < 3 && num > 0){
                $(this.config.$upfile).removeClass('disabled');
                $(this.config.$upfile).removettr('disabled', 'disabled');
            }
        },
        'click [data-role="refresh"]' : function(e){
            var target =e.currentTarget;
            var fileName = $(target).data('name');
            var box = target.parentNode.parentNode;
            var fileObj;


            for(var i = 0; i<this.refreshFile.length; i++){
                if(this.refreshFile[i].name === fileName){
                    fileObj = this.refreshFile[i].file;
                }
            }
            upload.refreshImg(fileName,fileObj,function(key,name,fileObj){
                if(key){
                    var id = key.substring(17,30);
                    $(box).empty();
                    $(box).attr('class','u-success');
                    var link = 'http://guazi01.kssws.ks-cdn.com/'+key+'@base@tag=imgScale&w=171&r=1';
                    $(box).append($('<img id="'+id+'" data-id="'+id+'" class="img-small" src="'+link+'"data-key="'+key+'"data-name="'+name+'" data-file="'+fileObj+'"><div class="shadow"><a class="u21" data-role="rotate1" ></a><a class="u22" data-role="rotate2" ></a><a class="u24" data-role="delete" ></a></div>'));
                }
            });

        },
        'click [data-role="rotate2"]' : function(e){
            var target = e.currentTarget;
            var img = target.parentNode.previousSibling;
            var id = $(img).data('id');
            rotate(id,'right');
        },
        'click [data-role="rotate1"]' : function(e){
            var target = e.currentTarget;
            var img = target.parentNode.previousSibling;
            var id = $(img).data('id');
            rotate(id,'left');
        }
    },
    init: function(config){
        this.refreshFile = [];
        this.config = config;
    },

    fileSelect : function(events){
        var files = events.currentTarget.files;
        for(var i = 0, f; f = files[i]; i++){
            this.size = f.size;
            // var reader = new FileReader();
            if (!f.type.match('image.*')) {
                window.alert('请上传正确的文件格式！');
                break;
            }
        }
    }
});
module.exports = widget;
function rotate(obj,arr){
    var img = document.getElementById(obj);
    if(!img || !arr){
        return false;
    }
    var n = parseInt(img.getAttribute('step'),10);
    if(!n){
        n = 0;
    }
    if(arr==='left'){
        n = (n === 0 ? 3 : n - 1);
    }else if(arr==='right'){
        n = (n === 3 ? 0 : n + 1);
    }
    img.setAttribute('step',n);
    //对IE浏览器使用滤镜旋转
    if(document.all) {
        img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ n +')';
        //HACK FOR MSIE 8
        switch(n){
            case 0:
                img.parentNode.style.height = img.height;
                break;
            case 1:
                img.parentNode.style.height = img.width;
                break;
            case 2:
                img.parentNode.style.height = img.height;
                break;
            case 3:
                img.parentNode.style.height = img.width;
                break;
        }
    // 对现代浏览器写入HTML5的元素进行旋转： canvas
    }else{
        var c = document.getElementById('canvas_'+obj);
        if(c== null){
            img.style.visibility = 'hidden';
            img.style.position = 'absolute';
            c = document.createElement('canvas');
            c.setAttribute('id','canvas_'+obj);
            img.parentNode.appendChild(c);
        }
        var canvasContext = c.getContext('2d');
        switch(n) {
            default :
            case 0 :
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(0 * Math.PI / 180);
                canvasContext.drawImage(img, 0, 0);
                break;
            case 1 :
                c.setAttribute('width', img.height);
                c.setAttribute('height', img.width);
                canvasContext.rotate(90 * Math.PI / 180);
                canvasContext.drawImage(img, 0, -img.height);
                break;
            case 2 :
                c.setAttribute('width', img.width);
                c.setAttribute('height', img.height);
                canvasContext.rotate(180 * Math.PI / 180);
                canvasContext.drawImage(img, -img.width, -img.height);
                break;
            case 3 :
                c.setAttribute('width', img.height);
                c.setAttribute('height', img.width);
                canvasContext.rotate(270 * Math.PI / 180);
                canvasContext.drawImage(img, -img.width, 0);
                break;
        }
    }
}
