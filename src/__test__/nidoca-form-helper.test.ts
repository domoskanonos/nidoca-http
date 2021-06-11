import "@open-wc/testing";
import {HttpClientProperties, HttpClientService} from "../http-client-service";

const assert = chai.assert;

suite("HttpClientService", () => {
  test("check http client service", () => {
    const httpClientProperties: HttpClientProperties = new HttpClientProperties();
    httpClientProperties.baseURL = "http://localhost";
    httpClientProperties.port = "8090";

    const httpClientService: HttpClientService = new HttpClientService(httpClientProperties);
    
  });
});
