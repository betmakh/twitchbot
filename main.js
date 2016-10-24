var config = require('./config');
var utils = require('./utils');
console.log('config', config.HOST);

// var ircClient = require('twitch-irc').client;
// var io = require('socket.io-client');
var tmi = require('tmi.js');
var fetch = require('node-fetch');
var ahuevshie = {};

var opts = {
    options: {
        debug: true
    },
    connection: {
        // server: config.HOST,
        // port: config.PORT,
        reconnect: true,
    },
    identity: {
        username: config.USER,
        password: config.PASS
    },
    channels: [config.CHANNEL]
};



utils.updateModerators().then(function(data) {
    console.log('data', data);
});

utils.getChannelInfo().then(function(json) {
    console.log('json', json);
})

var client = new tmi.client(opts);
client.connect();

client.on('connected', function(address, port) {
    utils.sendMsg(client, "Hey bitches, Im here to make some shkol'niki calm down ! Prepare your anus!")
})

client.on('chat', function(channel, userstate, message, self) {
    if (self) return;

    var msg,
        args = message.split(' '),
        skob = [/\({2,}/, /\){2,}/],
        isAhuel = false;

    skob.forEach(function(el) {
        if (el.test(message)) {
            isAhuel = true;
            ahuevshie[userstate.username] = ahuevshie[userstate.username] ? ahuevshie[userstate.username] + 1 : 1; 
            return;
        } 
    });
            console.log('ahuevshie', ahuevshie);

    if (message.indexOf('!uptime') === 0 ) {
        utils.getChannelInfo().then(function(resp){
            if (resp.stream) {
                utils.sendMsg(client, "Стрим стартанул в " + resp.created_at);
            } else {
                utils.sendMsg(client, "Стрим оффлайн, братишки.");
            }
        });
    } else if (message.indexOf('!pidor') === 0) {
        msg = '@' + userstate.username + ' - пидор.';
        utils.sendMsg(client, msg);
    } else if (isAhuel) {
        if (ahuevshie[userstate.username] == 1) {
            msg = '@' + userstate.username + ', еще раз такое напишешь - я тебе круглой скобочкой по еблищу дам!';
        } else if (ahuevshie[userstate.username] > 1) {
            msg = '@' + userstate.username + ', ну все сука, ты отгребаешь!';
            utils.timeoutUser(client, userstate.username, ahuevshie[userstate.username] * 1);
            ahuevshie[userstate.username] = null;
        } else {
            msg = '@' + userstate.username + ', не делай так.';
        }

        utils.sendMsg(client, msg);
        setTimeout(function() {
            utils.sendMsg(client, ')');
        },10000)
    } else if (message.indexOf('!typidor') === 0) {
        if (args[1]) {
            msg = (args[1].indexOf(config.god) == -1 ? args[1] : userstate.username) + ", ты пидор!";
            utils.sendMsg(client, msg);
        }
    }

})


// var socket = io('http://' + config.HOST);
// socket.on('connect', function(data) {
//     console.log('data', data);
// })
















// client.connect().then(function(done){
//     client.join('#' + config.CHANNEL).then(function(joined){
//         console.log('joined', joined);
//         client.isMod('#' + config.CHANNEL, 'betmanenko').then(function(ping) {
//             console.log('ping', ping);
//         }, function(failed) {
//             console.log('failed', failed);
//         })
//     }, function(failed) {
//         console.log('failed', failed);
//     })
//     console.log('done', done);
// }, function(resp) {
//     console.log('resp', resp);
// })
// var client = new irc.Client(config.HOST, config.USER); 

// client.join('#' + config.JOIN + ' ' + config.PASS);

// client.addListener('message', function (from, to, message) {
//     console.log(from + ' => ' + to + ': ' + message);
// });

// client.addListener('message#' + config.JOIN, function (from, message) {
//     console.log(from + ' => #yourchannel: ' + message);
// });