# node-red-contrib-baltnet-core

This project implements several functions for sms.baltneta.lt API

Usage example:

```javascript
let baltnetCore = require('baltnetcore');

baltnetCore.getBalance(apiKey, login)
    .then(result => {
        console.info(result.data);
    })
    .catch(err => {
        console.error(err.errno);
        console.error(err.code);
    });
```
