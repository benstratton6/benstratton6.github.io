const http = require('http'); 
const fs = require("fs");

http.createServer((req, res) => {
    if (req.url == "/") {
        fs.readFile("./home.html", (err, data) => {
            if (err) { 
                res.send(500,{error: err});
            } else { 
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write(data);
                res.end(); 
           }
        })
    }
    else if (req.url == "/map_creater.js") {
        fs.readFile("./map_creater.js", (err, data) => {
            if (err) { 
                res.send(500,{error: err}); 
            } else {
                res.writeHeader(200, {"Content-Type": "text/javascript"});
                res.write(data); 
                res.end(); 
}
        })

    } }
    
 ).listen(3000); 

console.log("Listening on port 3000....")