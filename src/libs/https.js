import https from 'https';

export default class customHttps {
  static request (options) {
    const requestParams = Object.assign({}, options);
    return new Promise((resolve, reject) => {
      if (('body' in requestParams) === true && requestParams.body !== null) {
        requestParams.body = JSON.stringify(requestParams.body);
        requestParams.headers = Object.assign({
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestParams.body)
        }, requestParams.headers);
      }

      const request = https.request(requestParams, (response) => {
        let currentBody = [];

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          currentBody.push(chunk);
        });
        response.on('end', () => {
          try {
            currentBody = JSON.parse(currentBody.join(''));
          } catch (e) {
            currentBody = '';
          }

          if ([200, 201, 204].includes(response.statusCode) === false) {
            if (currentBody && ('error' in currentBody) === true) {
              if (Object.prototype.toString.call(currentBody.error) === '[object Object]') {
                const fieldsError = new Error('invalid body');
                fieldsError.fields = currentBody.error;
                reject(fieldsError);
                return;
              }

              reject(new Error(currentBody.error));
              return;
            }

            reject(new Error(response.statusCode));
            return;
          }

          resolve(currentBody);
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      if (('body' in requestParams) === true && requestParams.body !== null) {
        request.write(requestParams.body);
      }
      request.end();
    });
  }
}
