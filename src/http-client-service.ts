export class HttpClientContentType {
  static MULTIPART_FORM_DATA = "multipart/form-data";
  static FORM = "application/x-www-form-urlencoded";
  static JSON = "application/json";
  static XML = "application/xml";
  static UNDEFINED = undefined;
}

export class HttpClientCorsMode {
  static SAME_ORIGIN = "same-origin";
  static CORS = "cors";
  static NO_CORS = "no-cors";
}

export class HttpClientCredentials {
  static SAME_ORIGIN: string = "same-origin";
  static INCLUDE: string = "include";
  static OMIT: string = "omit";
}

export abstract class HttpResponseCodeInterceptor {
  abstract getCodes(): HttpResponseCode[];

  abstract run(): void;
}

export class HttpResponseCode {
  static UNDEFINED: number = 0;
  static OK: number = 200;
  static UNAUTHORIZED: number = 401;
  static FORBIDDEN: number = 403;
  static REDIRECT: number = 302;
}

export class HttpClientRequestType {
  static GET: string = "GET";
  static POST: string = "POST";
  static PUT: string = "PUT";
  static DELETE: string = "DELETE";
  static PATCH: string = "PATCH";
}

export class HttpClientRequest {
  baseURL?: string;
  path: string = "";
  requestMethod: string = HttpClientRequestType.GET;
  contentType: string | undefined = HttpClientContentType.JSON;
  credentials: string = HttpClientCredentials.OMIT;
  cors: string = HttpClientCorsMode.CORS;
  body?: BodyInit | null;
}

export class HttpClientProperties {
  baseURL: string = window.location.hostname;
  port: string = window.location.port;
}

export interface FileUploadItem {
  filename: string;
  responseStatus: boolean;
  uploadDate: Date;
  file: File;
  response: Response;
}

export interface FileUpload {
  files: FileUploadItem[];
}

export class HttpClientService {

  public constructor(
    private config: HttpClientProperties,
  ) {}

  defaultRequest: HttpClientRequest = new HttpClientRequest();

  private httpResponseCodeInterceptors: HttpResponseCodeInterceptor[] = [];

  public addHttpResponseCodeInterceptor(
    httpResponseCodeInterceptor: HttpResponseCodeInterceptor
  ): void {
    this.httpResponseCodeInterceptors.push(httpResponseCodeInterceptor);
  }

  public getDefaultRequestInstance(): HttpClientRequest {
    return Object.assign({}, this.defaultRequest);
  }

  public getDefaultPostRequest(): HttpClientRequest {
    const defaultRequest = this.getDefaultRequestInstance();
    defaultRequest.requestMethod = HttpClientRequestType.POST;
    return defaultRequest;
  }

  public getDefaultPutRequest(): HttpClientRequest {
    const defaultRequest = this.getDefaultRequestInstance();
    defaultRequest.requestMethod = HttpClientRequestType.PUT;
    return defaultRequest;
  }

  public getDefaultPatchRequestInstance(): HttpClientRequest {
    const defaultRequest = this.getDefaultRequestInstance();
    defaultRequest.requestMethod = HttpClientRequestType.PATCH;
    return defaultRequest;
  }

  public getDefaultDeleteRequestInstance(): HttpClientRequest {
    const defaultRequest = this.getDefaultRequestInstance();
    defaultRequest.requestMethod = HttpClientRequestType.DELETE;
    return defaultRequest;
  }

  public getDefaultGetRequestInstance(): HttpClientRequest {
    const defaultRequest = this.getDefaultRequestInstance();
    defaultRequest.requestMethod = HttpClientRequestType.GET;
    return defaultRequest;
  }

  public async request(request: HttpClientRequest): Promise<Response> {
    if (request.baseURL == null || request.baseURL.length == 0) {
      request.baseURL = this.getUrl();
    }
    const url = request.baseURL + request.path;
    const headers: HeadersInit = {};
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

    const requestOptions: RequestInit = {
      headers: headers,
      method: request.requestMethod,
      body: request.body,
      credentials: request.credentials as RequestCredentials,
      mode: request.cors as RequestMode,
    };

    const response = await fetch(url, requestOptions);
    console.info("response status: ", response.status);

    this.httpResponseCodeInterceptors.forEach(
      (httpResponseCodeInterceptor: HttpResponseCodeInterceptor) => {
        httpResponseCodeInterceptor.getCodes().forEach((code) => {
          if (response.status == code) httpResponseCodeInterceptor.run();
        });
      }
    );
    return response;
  }

  public sendFormData(
    path: string,
    formData: FormData,
    baseUrl: string = this.getUrl()
  ): Promise<Response> {
    console.log("send form data %s", formData);
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    formData.forEach((value, key) => {
      urlSearchParams.append(key, value.toString());
    });
    const request: HttpClientRequest = this.getDefaultRequestInstance();
    request.requestMethod = HttpClientRequestType.POST;
    request.contentType = HttpClientContentType.FORM;
    request.path = path;
    request.baseURL = baseUrl;
    request.body = urlSearchParams;
    return this.request(request);
  }

  private getUrl(): string {
    return this.config.port != ""
      ? this.config.baseURL + ":" + this.config.port
      : this.config.baseURL;
  }

  async uploadFiles(
    url: string,
    files: FileList | undefined | null
  ): Promise<FileUpload> {
    const fileUpload: FileUpload = <FileUpload>{
      files: [],
      response: {},
    };

    if (files != undefined) {
      for (let i = 0, f; (f = files[i]); i++) {
        const formData = new FormData();
        formData.append("file", f);
        const request: HttpClientRequest = this.getDefaultRequestInstance();
        request.requestMethod = HttpClientRequestType.POST;
        request.contentType = HttpClientContentType.UNDEFINED;
        request.path = url;
        request.baseURL = this.getUrl();
        request.body = formData;
        const response = await this.request(request);
        const fileItem: FileUploadItem = <FileUploadItem>{
          file: f,
          response: response,
          filename: f.name,
          uploadDate: new Date(),
        };
        fileUpload.files.push(fileItem);
      }
    }

    return fileUpload;
  }
}
