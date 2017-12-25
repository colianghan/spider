// import { connect } from 'http2';
// var repl = require('repl');

var http = require('http'),
    fs = require('fs'),
    log4js = require('log4js');
    length = 0,
    cheerio = require('cheerio');

log4js.configure({
    appenders:{
        out: {type:'stdout'},
        app: {type: 'dateFile', filename:'logs/spider.log'}
    },
    categories:{
        default:{
            appenders:['out','app'],
            level:'debug'
        }
    }
});

const logger = log4js.getLogger();

function getCxt(url){
    http.get(url,(req)=>{
        // console.log(content);
        var chunk = '';
        req.on('data',function(d){
            // console.log(chunk);
            chunk += d;
        })
        req.on('end',()=>{
            var $ = cheerio.load(chunk);
            var title = $('h1').text().trim();
            var content = $('#content').text().trim();
            var writeStream = fs.createWriteStream(`./build/${title}.txt`);
            writeStream.write(content);
            var nextUrl = $('.content_read .bottem a').filter((index,item)=>{ return $(item).text() == '下一章'}).attr('href');
            logger.info(`nextUrl:${nextUrl}`);
            if(nextUrl && nextUrl.indexOf('http')>-1){
                setTimeout(()=>getCxt(nextUrl),0);
            }else{
                if(!nextUrl){
                    nextUrl = $('.content_read .bottem a').filter((index,item)=>{ return ($(item).attr('onclick')||'').indexOf('addbookmark')>-1}).prev().attr('href');
                    if(nextUrl && nextUrl.indexOf('http')>-1){
                        setTimeout(()=>getCxt(nextUrl),0);
                        return;
                    }
                }
                logger.info(`结束前的bottom:`+ $('.content_read .bottem').html());
                logger.info(`结束标题:${title}`);
            }
        })
    })
}

getCxt('http://www.biquge.info/0_921/3113225.html');
// getCxt('http://www.biquge.info/0_921/14017462.html');
