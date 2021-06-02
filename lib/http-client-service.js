var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class HttpClientContentType {
}
HttpClientContentType.MULTIPART_FORM_DATA = "multipart/form-data";
HttpClientContentType.FORM = "application/x-www-form-urlencoded";
HttpClientContentType.JSON = "application/json";
HttpClientContentType.XML = "application/xml";
HttpClientContentType.UNDEFINED = undefined;
export class HttpClientCorsMode {
}
HttpClientCorsMode.SAME_ORIGIN = "same-origin";
HttpClientCorsMode.CORS = "cors";
HttpClientCorsMode.NO_CORS = "no-cors";
export class HttpClientCredentials {
}
HttpClientCredentials.SAME_ORIGIN = "same-origin";
HttpClientCredentials.INCLUDE = "include";
HttpClientCredentials.OMIT = "omit";
export class HttpResponseCodeInterceptor {
}
export class HttpResponseCode {
}
HttpResponseCode.UNDEFINED = 0;
HttpResponseCode.OK = 200;
HttpResponseCode.UNAUTHORIZED = 401;
HttpResponseCode.FORBIDDEN = 403;
HttpResponseCode.REDIRECT = 302;
export class HttpClientRequestType {
}
HttpClientRequestType.GET = "GET";
HttpClientRequestType.POST = "POST";
HttpClientRequestType.PUT = "PUT";
HttpClientRequestType.DELETE = "DELETE";
HttpClientRequestType.PATCH = "PATCH";
export class HttpClientRequest {
    constructor() {
        this.path = "";
        this.requestMethod = HttpClientRequestType.GET;
        this.contentType = HttpClientContentType.JSON;
        this.credentials = HttpClientCredentials.OMIT;
        this.cors = HttpClientCorsMode.CORS;
    }
}
export class HttpClientProperties {
    constructor() {
        this.baseURL = window.location.hostname;
        this.port = window.location.port;
    }
}
export class HttpClientService {
    constructor(config, defaultRequest) {
        this.config = config;
        this.defaultRequest = defaultRequest;
        this.httpResponseCodeInterceptors = [];
    }
    addHttpResponseCodeInterceptor(httpResponseCodeInterceptor) {
        this.httpResponseCodeInterceptors.push(httpResponseCodeInterceptor);
    }
    getDefaultRequestInstance() {
        return Object.assign({}, this.defaultRequest);
    }
    getDefaultPostRequest() {
        const defaultRequest = this.getDefaultRequestInstance();
        defaultRequest.requestMethod = HttpClientRequestType.POST;
        return defaultRequest;
    }
    getDefaultPutRequest() {
        const defaultRequest = this.getDefaultRequestInstance();
        defaultRequest.requestMethod = HttpClientRequestType.PUT;
        return defaultRequest;
    }
    getDefaultPatchRequestInstance() {
        const defaultRequest = this.getDefaultRequestInstance();
        defaultRequest.requestMethod = HttpClientRequestType.PATCH;
        return defaultRequest;
    }
    getDefaultDeleteRequestInstance() {
        const defaultRequest = this.getDefaultRequestInstance();
        defaultRequest.requestMethod = HttpClientRequestType.DELETE;
        return defaultRequest;
    }
    getDefaultGetRequestInstance() {
        const defaultRequest = this.getDefaultRequestInstance();
        defaultRequest.requestMethod = HttpClientRequestType.GET;
        return defaultRequest;
    }
    request(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.baseURL == null || request.baseURL.length == 0) {
                request.baseURL = this.getUrl();
            }
            const url = request.baseURL + request.path;
            const headers = {};
            headers["Accept"] = "*";
            headers["Accept-Encoding"] = "*";
            console.debug("set request url: " + url);
            console.debug("set request method: " + request.requestMethod);
            if (request.contentType != undefined) {
                console.debug("set content type header: ", request.contentType);
                headers["Content-Type"] = request.contentType;
            }
            console.debug("set body: " + JSON.stringify(request.body));
            console.debug("set credentials: " + request.credentials);
            console.debug("set mode: " + request.cors);
            console.debug("set headers: " + JSON.stringify(headers));
            const requestOptions = {
                headers: headers,
                method: request.requestMethod,
                body: request.body,
                credentials: request.credentials,
                mode: request.cors,
            };
            const response = yield fetch(url, requestOptions);
            console.info("response status: ", response.status);
            this.httpResponseCodeInterceptors.forEach((httpResponseCodeInterceptor) => {
                httpResponseCodeInterceptor.getCodes().forEach((code) => {
                    if (response.status == code)
                        httpResponseCodeInterceptor.run();
                });
            });
            return response;
        });
    }
    sendFormData(path, formData, baseUrl = this.getUrl()) {
        console.log("send form data %s", formData);
        const urlSearchParams = new URLSearchParams();
        formData.forEach((value, key) => {
            urlSearchParams.append(key, value.toString());
        });
        const request = this.getDefaultRequestInstance();
        request.requestMethod = HttpClientRequestType.POST;
        request.contentType = HttpClientContentType.FORM;
        request.path = path;
        request.baseURL = baseUrl;
        request.body = urlSearchParams;
        return this.request(request);
    }
    getUrl() {
        return this.config.port != ""
            ? this.config.baseURL + ":" + this.config.port
            : this.config.baseURL;
    }
    uploadFiles(url, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileUpload = {
                files: [],
                response: {},
            };
            if (files != undefined) {
                for (let i = 0, f; (f = files[i]); i++) {
                    const formData = new FormData();
                    formData.append("file", f);
                    const request = this.getDefaultRequestInstance();
                    request.requestMethod = HttpClientRequestType.POST;
                    request.contentType = HttpClientContentType.UNDEFINED;
                    request.path = url;
                    request.baseURL = this.getUrl();
                    request.body = formData;
                    const response = yield this.request(request);
                    const fileItem = {
                        file: f,
                        response: response,
                        filename: f.name,
                        uploadDate: new Date(),
                    };
                    fileUpload.files.push(fileItem);
                }
            }
            return fileUpload;
        });
    }
}
