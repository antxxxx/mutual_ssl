var fs = require('fs');  
var https = require('https');
var util = require('util');

var root_ca = fs.readFileSync('certstore/root_CA/certs/root_ca.cert.pem')
var ca_1 = fs.readFileSync('certstore/intermediate_CA_1/certs/intermediate_CA_1.cert.pem')
var ca_2 = fs.readFileSync('certstore/intermediate_CA_2/certs/intermediate_CA_2.cert.pem')
var ca_array = []
ca_array.push(root_ca)
ca_array.push(ca_1)
/*
only need to add this when clien is using trireme
ca_array.push(ca_2)
*/

/*
set rejectUnauthorized to true see errors when running tls_connect
*/
var options = {  
    key: fs.readFileSync('certstore/signed_by_CA_1/private/server.pem'),
    cert: fs.readFileSync('certstore/signed_by_CA_1/certs/server.crt'),
    ca: ca_array,
    requestCert: true,
    rejectUnauthorized: false
};

https.createServer(options, function (req, res) {
    if (req.client.authorized) {
        console.log(new Date()+' AUTHORIZED CONNECTION ');        
        console.log(util.inspect(req.socket.getPeerCertificate(), false, null));    
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end('{"status": "approved"}');
    } else {
        console.log(new Date()+' DENIED CONNECTION ');        
        console.log(req.socket.authorizationError);
        res.writeHead(401, {"Content-Type": "application/json"});
        res.end('{"status":"denied"}');
    }
}).listen(4433);  