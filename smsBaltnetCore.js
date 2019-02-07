let md5 = require('md5');
let axios = require('axios');

let constants = {
    PHP: ".php",
    BALTNET_URL: 'https://sms.baltneta.lt/external/'
};

let baltnetMethods = {

    GET_TIMESTAMP: {
        method: "get/timestamp",
        parameters: {}
    },

    GET_BALANCE: {
        method: "get/balance",
        parameters: {
            login: 'login',
            timestamp: 'timestamp'
        }

    },
    SEND_SMS: {
        method: "get/send",
        parameters: {
            login: 'login',
            timestamp: 'timestamp',
            phone: 'phone',
            text: 'text',
            sender: 'sender',
            sendingTime: 'sendingTime'
        }
    }
};

let parametersHelper = function (apiKey) {
    return {
        list: [],

        apiKey: apiKey,
        signature: null,

        with: function (name, value) {

            this.list.push({
                name: name,
                value: value
            });

            return this;
        },

        buildSignature: function () {

            this.list.sort((a, b) => a.name.localeCompare(b.name));

            var str = '';
            for (const listElement of this.list) {
                str += listElement.value;
            }

            this.signature = md5(str + this.apiKey);
            return this;
        },

        buildQuery: function (method) {
            this.with('signature', this.signature);
            var query = constants.BALTNET_URL + method + '?';
            var first = true;
            for (const listElement of this.list) {
                query += (first ? '' : '&') + listElement.name + '=' + this.addValue(listElement.name, listElement.value);
                first = false;
            }

            this.clean();
            this.signature = null;

            return query;
        },

        addValue: function (name, value) {
            if (name == 'text') {
                return encodeURIComponent(value);
            } else {
                return value;
            }
        },

        clean: function () {
            this.list = [];
        }

    }
};


module.exports = {
    getBalance: (apiKey, login) => {
        return axios.get(constants.BALTNET_URL + baltnetMethods.GET_TIMESTAMP.method + constants.PHP)
            .then(result => result.data)
            .then(timestamp => {

                let paramters = parametersHelper(apiKey);
                let query = paramters
                    .with(baltnetMethods.GET_BALANCE.parameters.login, login)
                    .with(baltnetMethods.GET_BALANCE.parameters.timestamp, timestamp)
                    .buildSignature()
                    .buildQuery(baltnetMethods.GET_BALANCE.method + constants.PHP);

                console.info(query);

                return axios.get(query);
            })
    },

    sendSms: (apiKey, login, phoneNumber, sender, text, time) => {
        return axios.get(constants.BALTNET_URL + baltnetMethods.GET_TIMESTAMP.method + constants.PHP)
            .then(result => result.data)
            .then(timestamp => {

                let paramters = parametersHelper(apiKey);
                let query = paramters
                    .with(baltnetMethods.SEND_SMS.parameters.login, login)
                    .with(baltnetMethods.SEND_SMS.parameters.timestamp, timestamp)
                    .with(baltnetMethods.SEND_SMS.parameters.phone, phoneNumber)
                    .with(baltnetMethods.SEND_SMS.parameters.sender, sender)
                    .with(baltnetMethods.SEND_SMS.parameters.text, text)
                    .with(baltnetMethods.SEND_SMS.parameters.sendingTime, time)
                    .buildSignature()
                    .buildQuery(baltnetMethods.SEND_SMS.method + constants.PHP);

                console.info(query);

                return axios.get(query);
            })
    }
};
