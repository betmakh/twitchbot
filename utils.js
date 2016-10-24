var fetch = require('node-fetch');
var config = require('./config');

module.exports = {
    getChannelInfo: function(channel) {
    	channel = channel || config.CHANNEL;
        return fetch('https://api.twitch.tv/kraken/streams/' + channel, {
                headers: {
                    'Client-ID': config.TOKEN
                }
            })
            .then(function(res) {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
    },
    updateModerators: function() {
        return new Promise(function(resolve, reject) {
            fetch('http://tmi.twitch.tv/group/user/betmanenko/chatters')
                .then(function(res) {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        return null;
                    }
                }).then(function(json) {
                	var data = [];
                    if (json && json.chatters) {
                        config.moderatorGroups.forEach(function(el) {
                            if (json.chatters[el].length) {
                                data = data.concat(json.chatters[el]);
                            }
                        });
                    	resolve(data);
                    } else {
                    	reject(null)
                    }
                });
        })
    },
    sendMsg: function(client, msg) {
    	client.action(config.CHANNEL," : " +  msg);
    },
    timeoutUser: function(client, user, time) {
    	client.timeout(config.CHANNEL, user, time);
    }

}
