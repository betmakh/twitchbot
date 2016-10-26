'use strict';
var config = require('./config');
var utils = require('./utils');

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
        reconnect: true,
    },
    identity: {
        username: config.USER,
        password: config.PASS
    },
    channels: config.CHANNELS
};



// utils.updateModerators().then(function(data) {
//     console.log('data', data);
// });

// utils.getChannelInfo().then(function(json) {
//     console.log('json', json);
// });

// utils.getJokes().then(function(data) {
//     console.log('data', data);
// }, function(err) {
//     console.log('err', err);
// })

var client = new tmi.client(opts);
client.connect();

client.on('connected', function(address, port) {
    utils.sendMsg(client, "Hey bitches, Im here to make some shkol'niki calm down! Prepare your anus!")
});

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
        utils.getChannelInfo(channel).then(function(resp){
            if (resp.stream) {
                msg = "Стрим стартанул в " + resp.stream.created_at;
            } else {
                msg = "Стрим оффлайн, братишки.";
            }
        });
    } else if (message.indexOf('!pidor') === 0) {
        msg = '@' + userstate.username + ' - пидор.';
    } else if (isAhuel) {
        if (ahuevshie[userstate.username] == 2) {
            msg = '@' + userstate.username + ', еще раз такое напишешь - я тебе круглой скобочкой по еблищу дам!';
        } else if (ahuevshie[userstate.username] > 2) {
            msg = '@' + userstate.username + ', ну все сука, ты отгребаешь!';
            utils.timeoutUser(client, userstate.username, ahuevshie[userstate.username] * 100, channel);
        } else {
            msg = '@' + userstate.username + ', не делай так.';
        }
        
    } else if (message.indexOf('!roulette') === 0) {
        var rand = Math.random()*10;
        if (rand < 5) {
            msg = '@' + userstate.username + ', повезло тебе, сучка!'
        } else {
            let banTime = Math.random() * 1000;
            msg = '@' + userstate.username + ', поздравляю братан. Ты заработал бан(' + Math.round(banTime) + 's)';
            utils.timeoutUser(client, userstate.username, banTime, channel);
        }
    } else if (message.indexOf('!magicball') === 0) {
        if (message.indexOf('?') < 0) {
            msg = '@' + userstate.username + ', ' + "это не вопрос";
        } else {
            let variants = ['Да', 'Нет', 'Ты ебанутый такие вопросы задавать?', 'Определенно нет', 'Базарю, инфа сотка'];
            msg = '@' + userstate.username + ', ' +  variants[Math.floor(Math.random() * variants.length)];
        }
    } else if (message.indexOf('!joke') === 0) {
        utils.getJokes().then(function(data) {
            var joke = data[Math.floor(Math.random() * data.length)];
            utils.sendMsg(client, joke.elementPureHtml.replace(/<[A-Za-z ='"#0-9]+\/?>/g, "").replace(/&[A-Za-z]+;/g, ""), channel);
        }, function(err) {
            console.log('err', err);
        })
    } else if (message.indexOf('!typidor') === 0) {
        if (args[1]) {
            msg = (args[1].indexOf(config.god) == -1 ? args[1] : userstate.username) + ", ты пидор!";
        }
    } else if (message.indexOf(config.USER) != -1) {
        let ascorbinka = ["Отъебись", "Иди нахуй", "Комманды для кого под каналом написаны?"]
        msg = ascorbinka[Math.floor(Math.random() * ascorbinka.length)];
    }

    if (msg && msg.length) {
        utils.sendMsg(client, msg, channel);
    }

})
