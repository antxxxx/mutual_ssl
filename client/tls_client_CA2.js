var fs = require('fs');  
var https = require('https');
var tlsConnect = require('./tlsConnect')

var root_ca = fs.readFileSync('certstore/root_CA/certs/root_ca.cert.pem')
var ca_1 = fs.readFileSync('certstore/intermediate_CA_1/certs/intermediate_CA_1.cert.pem')
var ca_2 = fs.readFileSync('certstore/intermediate_CA_2/certs/intermediate_CA_2.cert.pem')
var ca_array = []
ca_array.push(root_ca)
ca_array.push(ca_2)

var key = fs.readFileSync('certstore/signed_by_CA_2/private/client_CA2.pem')
var cert = fs.readFileSync('certstore/signed_by_CA_2/certs/client_CA2.crt')

tlsConnect.tryConnect(key, cert, ca_array, function(err, data) {
    console.log(err);
    console.log(data);
    process.exit();
})
