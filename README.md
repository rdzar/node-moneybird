# node-moneybird

[![Build Status](https://travis-ci.org/renedx/node-moneybird.svg?branch=master)](https://travis-ci.org/renedx/node-moneybird)

A promise based API wrapper for Moneybird.com in Node

## Install
```bash
npm install moneybird --save
```

## What do I need?
To make these calls work you'll have to obtain a token and the administrationId. The administrationId can be found browsing on moneybird.com being logged in, the first numeric value in the URL is your administrationId. **Take note to not use this as a numeric value within JS as it exceeds the JS integer value**.

## Obtain a moneybird token
To obtain a moneybird token go to [https://moneybird.com/user/applications/new](https://moneybird.com/user/applications/new) and choose "Personal use". The next page will provide you with the token, please store the token in a secure manner.

## Example create contact
```js
import { Client } from 'moneybird'

const moneyBirdClient = new Client('TOKEN', 'ADMINISTRATION_ID');
moneyBirdClient.post('contacts', {
  'contact': {
    'company_name': 'DualDev'
  }
}).then(res => {
  console.log('created!', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});
```

## Example get contacts
```js
import { Client } from 'moneybird'

const moneyBirdClient = new Client('TOKEN', 'ADMINISTRATION_ID');
moneyBirdClient.get('contacts').then(res => {
  console.log('all contacts', res);
}).catch(err => {
  console.log('Whoops, something went wrong!', err);
});
```

## How do I make other calls?
This promise based API wrapper is not call-specific, allowing it to be more flexible to future API changes. The following methods are available for use.

## API
### Client(Token, AdministrationId, [version=v2])
#### .get('resource_path')
#### .put('resource_path', body)
#### .patch('resource_path', body)
#### .create('resource_path', body)
#### .delete('resource_path')

## Does this package depends upon other packages?
**No**, this package doesn't use any dependencies besides dev-dependencies for testing and building.
