const express = require('express');
var mysql = require('mysql');
const https = require('https')
const HtmlFilter = require('html-filter');
var execPhp = require('exec-php');
const htmlFilter = new HtmlFilter();
var request = require('request');
//const extract = require('extract-zip')
const fs = require('fs');
//const { exit } = require('process');
const app = express()
const randomUseragent = require('random-useragent');
var con = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11427880",
    password: "aM7cvYWEUc",
    database: "sql11427880"
  });
// 
function rename(repo,user,t) {
    fs.rename('./'+repo+'-'+t,user , (err) => {
        console.log(err);
  });
}
class login{
//for codes only 
    create(user,pwd){         
        con.connect(function(err) {
            console.log("Connected!");
            var sql = "INSERT INTO users (username, password) VALUES ('"+user+"', '"+pwd+"')";
            con.query(sql, function (err, result) {
            console.log("ohh yeah new user to kemo hosting");
            });
        });
    }
    //disabled
    login(user,pwd){
        con.query("SELECT * FROM users WHERE username = '"+ user +"' AND password = '"+pwd+"'", function(err, result, field){
            if(result.length === 0){
            
            }else{  
                return res.send({ error: 'this username has been taked' })
            }
        })
    }
    setsite(user,pwd,url,files,host){
        con.connect(function(err) {
            var sql = "UPDATE users SET site = '"+url+"', files = '"+files+"' WHERE username = '"+user+"' AND password = '"+pwd+"'";
            con.query(sql, function (err, result) {
              console.log("site has been set");
            });
          });
          let repo = url.replace('github.com','api.github.com/repos').replace('.git','')+'/contents/index.html';
          

          /*let output = repo+'-master.zip';
          request({url: url.replace('.git','')+'/archive/master.zip', encoding: null}, function(err, resp, body) {
            if(err) throw err;
            fs.writeFile(output, body, function(err) {
              console.log("zip file seved to hosting!");
            });
          
        if (body.indexOf('404') >= 0) {
            console.log(repo+';') 
            fs.unlinkSync(repo+'-master.zip')
            let output = repo+'-main.zip';
            request({url: url.replace('.git','')+'/archive/main.zip', encoding: null}, function(err, resp, body) {
              if(err) throw err;
              fs.writeFile(output, body, function(err) {
                console.log("file written!");
              });
              extract(repo+'-main.zip', { dir: process.cwd() }, function (err) {
                // handle err
             })
             try {
                 setTimeout(rename(repo,user,'main'), 4000);
             }catch{
                 console.log('fuck')
             }
          
            });
        }else{
            extract(repo+'-master.zip', { dir: process.cwd() }, function (err) {
                // handle err
             })
             try {
                 setTimeout(rename(repo,user,'master'), 4000);
             }catch{
                console.log('fuck')
            }

        }
    });*/
    }

}


app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())
app.use(express.static(__dirname + '/public'));
let xx = new login;


app.get('/login', (req, res) => {

    con.query("SELECT * FROM users WHERE username = '"+req.query.user+"' AND password = '"+req.query.pwd+"'", function(err, result, field){
        if(result.length === 0){
            res.send({ eDesc: 'true',message: 'error pwd or username'})
        }else{  
            res.send({ eDesc: 'false',url: result[0]['site'],files: result[0]['files'] })
        }
    })

})

//    let ch = x.check(req.query.user) 
app.get('/reg', (req, res) => {
    con.query("SELECT username FROM users WHERE username = '"+ req.query.user +"'", function(err, result, field){
        if(result.length === 0){
            xx.create(req.query.user,req.query.pwd)
            res.send({ error: 'account created sucssfly' })
            
        }else{  
            res.send({ error: 'this username has been taked' })
        }
    })
})

app.get('/setsite', (req, res) => {
    let url = req.query.url
    let user = req.query.user
    let pwd = req.query.pwd
    let files = req.query.files
    xx.setsite(user,pwd,url,files,req.get('host'))
    res.send({ status: 'done' })


})
/*
app.get('/rename', (req, res) => {
    let repo = url.replace('https://','').split('/')[2].replace('.git','');
    let url = req.query.url
    let user = req.query.user
    let t = req.query.t
    fs.rename(repo+'-'+t,user , (err) => {
        console.log("moved to subfomain.");
  });

})

*/


app.get('/*', (req, res) => {  
    con.query("SELECT * FROM users WHERE username = '"+req.get('host').split('.')[0]+"'", function(err, result, field){
        if(!result){res.send('404 page not found <br> close the fucking site please')}else{
        if(result.length === 0){
            res.send('404 page not found <br> close the fucking site please')
        }else{  
            let requestx = request.defaults({
                headers: {'User-Agent': 'asd', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'}
            })
            if(result[0]['site'].indexOf('php') >= 0){
                let git = result[0]['site'].replace('.git','').replace('github.com','api.github.com/repos')+'/contents//main.php'
                requestx.get(git, function (e,r,bodyur){let urlx = JSON.parse(bodyur)['download_url']
                requestx.get(urlx,function (error, response, bodyx) {     
                    var options = {
                        url: 'https://api.extendsclass.com/php/8.0.0',
                        method: 'POST',
                        headers: {'Content-Type': 'text/plain'},
                        body: bodyx
                    };
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            res.send(JSON.parse(body)['stdout']);
                        }
                    }
                    
                    request(options, callback);
                    

                            }) })}
            else{
            
            let git = result[0]['site'].replace('.git','').replace('github.com','api.github.com/repos')+'/contents/'
            requestx.get(
                git+'/index.html',
                function (error, response, body) {
                    if (!error ) {
                        urls = JSON.parse(body)['download_url']
                        urls2 = JSON.parse(body)['html_url']
                        
                        requestx.get(urls,function (error, response, bodyx) {
                                requestx.get(urls.replace('index.html','style.css')+'?raw=true',function (error, response, bodyq) {
                                    requestx.get(urls.replace('index.html','script.js')+'?raw=true',function (error, response, bodyw) {
                                    
                                        res.send(bodyx.replace('<body>','<style>'+bodyq+'</style><body>').replace('</body>','<script>'+bodyw+'</script></body>'))
                                        /*if (body.indexOf('404') >= 0) { 
                                            requestx.get(urls.replace('index.html','style.css'),function (error, response, bodyy) {
                                            res.send(bodyx.replace('<body>','<style>'+bodyy+'</style><body>'))
                                            console.log('y')
                                        })
                                        }else { 
                                            res.send(bodyx.replace('<body>','<style>'+body+'</style><body>'))
                                            console.log(urls.replace('index.html','style.css').replace('main','master'))
                                        }*/
                                    })
                                    
                                })
                                })
                            
                            
                            //                            res.send(body.replace('</head>','<link type="text/css" rel="stylesheet" href="'+urls.replace('index.html','style.css').replace('raw.githubusercontent.com','gitcdn.link/repo')+'"></head>'))})

                        /*if (body.indexOf('style.css') >= 0) { 
                            res.send(body.replace('style.css',url+'/style.css?raw=true'));
                        }else { 
                            res.send(body.replace('</head>','<link rel="stylesheet" type ="text/css" href="'+url2+'/style.css?raw=true"></head>'));

                        }*/
                    }
                }
            );
            
            /*let url = result[0]['site'].replace('github.com','raw.githubusercontent.com')+'/main';
            let url2 = result[0]['site'].replace('github.com','rawcdn.githubusercontent.com')+'/main';
            request.get(
                url+'/index.html?raw=true',
                function (error, response, body) {
                    if (!error ) {
                        if (body.indexOf('style.css') >= 0) { 
                            res.send(body.replace('style.css',url+'/style.css?raw=true'));
                        }else { 
                            res.send(body.replace('</head>','<link rel="stylesheet" type ="text/css" href="'+url2+'/style.css?raw=true"></head>'));

                        }
                    }
                }
            );*/
            //res.send({ eDesc: 'false',url: result[0]['site'],files: result[0]['files']})
        }}}
    })
})





const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
