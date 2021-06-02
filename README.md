## nidoca-http-client
nidoca http client based on Fetch Web Api

|project info|
|:-------------|
|[![Published on npm](https://img.shields.io/npm/v/@domoskanonos/nidoca-http)](https://www.npmjs.com/package/@domoskanonos/nidoca-http)|
|[![Published on npm](https://img.shields.io/bundlephobia/min/@domoskanonos/nidoca-http)](https://www.npmjs.com/package/@domoskanonos/nidoca-http)|
|[![Published on npm](https://img.shields.io/bundlephobia/minzip/@domoskanonos/nidoca-http)](https://www.npmjs.com/package/@domoskanonos/nidoca-http)|
|[![Published on npm](https://img.shields.io/npm/dw/@domoskanonos/nidoca-http)](https://www.npmjs.com/package/@domoskanonos/nidoca-http)|
|[![Published on npm](https://img.shields.io/github/languages/code-size/domoskanonos/nidoca-http-client)](https://github.com/domoskanonos/nidoca-http-client)|

## usage typescript  
    const httpClientProperties: HttpClientProperties = new HttpClientProperties();  
    httpClientProperties.baseURL = "http://localhost";
    httpClientProperties.port = "8090";
    
    const defaultClientRequest = new HttpClientRequest();
    
    const httpClientService : HttpClientService = new HttpClientService(httpClientProperties, defaultClientRequest),

    const request: HttpClientRequest = httpClientService.getDefaultGetRequestInstance();
    request.path = this.path.concat("/PATH");
    request.requestMethod = HttpClientRequestType.POST;
    request.body = {};
    const response = await this.httpClient.request(request);
    const bodyText: string = await response.text();
    const myResponseBodyObject = JSON.parse(bodyText);
