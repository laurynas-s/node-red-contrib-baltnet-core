# node-red-contrib-baltnet-core

This project implements several functions for sms.baltneta.lt API

## How to install

In the Node-RED folder run:

```bash
npm install node-red-contrib-baltnet-core
```

## Usage example:

```javascript
let baltnetCore = require('node-red-contrib-baltnet-core');

baltnetCore.getBalance(apiKey, login)
    .then(result => {
        console.info(result.data);
    })
    .catch(err => {
        console.error(err.errno);
        console.error(err.code);
    });
```

## Implemented functions:

* getBalance: (apiKey, login)
* sendSms: (apiKey, login, phoneNumber, sender, text, time)

|   Function    |   Description                             |
| ------------- | ----------------------------------------- |
| getBalance    | Retrieves your account credit balance     |
|               | `apiKey` - your api key                   |
|               | `login` - your login                      |
| sendSms       | Send SMS to phone number                  |
|               | `apiKey` - your api key                   |
|               | `login` - your login                      |
|               | `phoneNumber` - 370XXXXXXXX               |
|               | `sender` - sender from authorized senders list |
|               | `text` - message text                     |
|               | `time` - YYYY-mm-DD HH:MM (optional, for scheduled  messages |