var http = require('http');
var url = require('url');
var fs = require('fs');
var path =require('path');
var jsonPath = path.join(__dirname, 'data.json');

console.log ('starting server');
http.createServer(function(req, res){
    var parsedUrl = url.parse(req, res);

    if (parsedUrl.pathname === '/chirps' && req.method === 'GET'){
        fs.createReadStream(jsonPath)
        .on('error', function(err){
            res.writeHead(500);
            res.end('could not read file');
        })
        .pipe(res);
    } else if (parsedUrl.pathname === 'chirps' && req.method === 'POST'){
        var chunks = '', 
            data;
        req.on('data', function(chunk) {
            chunks += chunk;

            if (chunks.length > 1e6) {
                req.connection.destroy();
            }
            data = JSON.parse(chunks);
        });
        fs.readFile(jsonPath, 'utf-8', function(err, file) {
            if (err){
                res.writeHead(500);
                res.end('Could not read file');
            }
            var arr = JSON.parse(file);
            arr.push(data.chirp);
            fs.writeFile(jsonPath, JSON.stringify(arr), function(err, success) {
                if (err){
                    res.writeHead(500);
                    res.end(JSON.stringify(arr));
                } else {
                    res.writeHead(201, 'Created');
                    res.end(JSON.stringify(arr));
                }
            });
        });    
    }
})
.listen(3000);