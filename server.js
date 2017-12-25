var fs = require('fs');
var express = require('express');

var app = express();

app.locals.title = 'test';
var parseNum = function(str){
    var numMap=['零','一','二','三','四','五','六','七','八','九','十'];
    var unitMap = ['个','十','百','千'];

    var numStr = str.match(/第(\S*)+?章/);

    // numStr = numStr[1].replace(/[千百十]/g,'');
    var num = 0,lastNum = 1;
    numStr[1].replace(/两/g,'二').split('').forEach((n)=>{
        var index = unitMap.indexOf(n);
        if(index > -1){
            num += lastNum*Math.pow(10,index);
            lastNum = 0;
        }else{
            lastNum = numMap.indexOf(n)
        }
    });
    num += lastNum;
    console.log(num);
    return num;
}

//设置模版
app.set('views','./views');
app.set('view engine','jade');
app.engine('jade',require('jade').__express);

//设置静态资源
app.use(require('less-middleware')(`${__dirname}/public`,{
    // force:true,
    // debug:true,
    // once:false
}));
app.use(express.static('public'));

app.get('/',function(req,res){
    var data = {files: []};
    fs.readdir('./build',(err,files)=>{
        files.forEach((file,index)=>{
            var name = file.replace('.txt','');
            if(/^第(\S*)+?章\s+/.test(name)){ //去除标题异常
                data.files.push({
                    title:'列表',
                    name,
                    index: parseNum(file)
                });
            }
        });
        data.files.sort((a,b)=>a.index-b.index);
        res.render('index',data);
    })
});
// 详情页
app.get('/detail/:name',function(req,res){
    var name = req.params.name;
    fs.readFile(`./build/${name}.txt`,{encoding:'utf-8'},function(err,content){
        res.render('book',{title:'详情',name,content: content.trim().split(/\s+/g).map((c)=>`<p>${c}</p>`).join('')});
    })
})

app.listen(3000)