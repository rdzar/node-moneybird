import https from '../libs/https';

export default class Client {
  constructor (token, administrationId, version = 'v2') {
    this.administrationId = administrationId;
    this.version = version;
    this.token = token;
    this.format = 'json';
    this.hostname = 'moneybird.com';
  }

  get (...args) {
    return this.request(...['get'].concat(...args));
  }

  post (...args) {
    return this.request(...['post'].concat(...args));
  }

  put (...args) {
    return this.request(...['patch'].concat(...args));
  }

  patch (...args) {
    return this.request(...['patch'].concat(...args));
  }

  delete (...args) {
    return this.request(...['delete'].concat(...args));
  }

  request (...args) {
    const method = String(args[0]).toUpperCase();
    const path = '/api/' + this.version + '/' + this.administrationId + Client.requestEndpoint(method, args) + '.' + this.format + Client.requestQueryString(method, args);

    return https.request({
      'hostname': this.hostname,
      'headers': {
        'Authorization': 'Bearer ' + this.token
      },
      'path': path,
      'port': 443,
      'method': method,
      'body': Client.requestBody(method, args)
    });
  }

  static requestHasBody (method) {
    return method === 'POST' || method === 'PATCH';
  }

  // Checks wether the request contains a query object
  static requestHasQuery (method, args) {
    if (args.length <= 2) { return false; }
    let objectCount = 0;
    Object.values(args).forEach((arg) => {
      if (arg === Object(arg)) {
        objectCount += 1;
      }
    });

    if (Client.requestHasBody(method) && objectCount >= 2) {
      return true;
    } else if (!Client.requestHasBody(method) && objectCount >= 1) {
      return true;
    }

    return false;
  }

  // Checks wether the request contains a body object
  static requestBody (method, args) {
    if (Client.requestHasBody(method)) {
      return Client.requestHasQuery(method, args) ? args[args.length - 2] : args[args.length - 1];
    }
    return null;
  }

  // Returns the query string when the request contains a query object, else an empty string
  static requestQueryString (method, args) {
    if (!Client.requestHasQuery(method, args)) {
      return '';
    }

    const queryParams = args[args.length - 1];
    if (queryParams !== Object(queryParams)) {
      return '';
    }

    let queryString = '';
    Object.keys(queryParams).forEach((queryParamKey) => {
      const queryParamValue = queryParams[queryParamKey];
      queryString += queryString === '' ? '?' : '&';
      queryString += encodeURIComponent(queryParamKey) + '=' + encodeURIComponent(queryParamValue);
    });

    return queryString;
  }

  // Returns the requested endpoint, joins all the parts together
  static requestEndpoint (method, args) {
    let endIndex = args.length;

    if (Client.requestHasBody(method, args)) {
      endIndex -= 1;
    }

    if (Client.requestHasQuery(method, args)) {
      endIndex -= 1;
    }

    const parts = args.slice(1, endIndex).filter((item) => item !== Object(item));

    if (parts.length > 1) {
      return '/' + parts.join('/');
    } else if (parts.length === 1) {
      return '/' + parts[0];
    }

    return '';
  }
}
