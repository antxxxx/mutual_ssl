var tls = require('tls');

module.exports = {
    tryConnect : tryConnect
}
function tryConnect(key, cert, ca, cb) {

    var options = {
        key  : key,
        cert : cert,
        ca: ca,
        host: 'localhost',
        port: '4433',
        ciphers: 'AES128-SHA',
        rejectUnauthorized: false
    };
    try {
    var client = tls.connect(options, function () {
        var authorized = client.authorized;
        var tlsCipher = client.getCipher();
        var peerCertificate = client.getPeerCertificate("detailed")
        var reply = {
            isConnected : authorized,
            tlsCipher : tlsCipher,
            peerCertificate: peerCertificate
        }
        cb(null, reply)
    });

    client.on('data', function (data) {
        console.log('in client connection')
        console.log(data.toString());
        client.end();
    });

    client.addListener('error', function(error) {
        console.log(error)
        var reply = {
            connectionStatus : error.message,
            message: 'fail'
        }
        cb(null, reply)
    });

    } catch (ex) {
        var reply = {
            connectionStatus : ex.message,
            message: 'exception'
        }
        cb(null, reply)

    }

}