export declare class HttpClientContentType {
  static MULTIPART_FORM_DATA: string;
  static FORM: string;
  static JSON: string;
  static XML: string;
  static UNDEFINED: undefined;
}
export declare class HttpClientCorsMode {
  static SAME_ORIGIN: string;
  static CORS: string;
  static NO_CORS: string;
}
export declare class HttpClientCredentials {
  static SAME_ORIGIN: string;
  static INCLUDE: string;
  static OMIT: string;
}
export declare abstract class HttpResponseCodeInterceptor {
  abstract getCodes(): HttpResponseCode[];
  abstract run(): void;
}
export declare class HttpResponseCode {
  static UNDEFINED: number;
  static OK: number;
  static UNAUTHORIZED: number;
  static FORBIDDEN: number;
  static REDIRECT: number;
}
export declare class HttpClientRequestType {
  static GET: string;
  static POST: string;
  static PUT: string;
  static DELETE: string;
  static PATCH: string;
}
export declare class HttpClientRequest {
  baseURL?: string;
  path: string;
  requestMethod: string;
  contentType: string | undefined;
  credentials: string;
  cors: string;
  body?: BodyInit | null;
}
export declare class HttpClientProperties {
  baseURL: string;
  port: string;
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
export declare class HttpClientService {
  private config;
  private defaultRequest;
  constructor(config: HttpClientProperties, defaultRequest: HttpClientRequest);
  private httpResponseCodeInterceptors;
  addHttpResponseCodeInterceptor(
    httpResponseCodeInterceptor: HttpResponseCodeInterceptor
  ): void;
  getDefaultRequestInstance(): HttpClientRequest;
  getDefaultPostRequest(): HttpClientRequest;
  getDefaultPutRequest(): HttpClientRequest;
  getDefaultPatchRequestInstance(): HttpClientRequest;
  getDefaultDeleteRequestInstance(): HttpClientRequest;
  getDefaultGetRequestInstance(): HttpClientRequest;
  request(request: HttpClientRequest): Promise<Response>;
  sendFormData(
    path: string,
    formData: FormData,
    baseUrl?: string
  ): Promise<Response>;
  private getUrl;
  uploadFiles(
    url: string,
    files: FileList | undefined | null
  ): Promise<FileUpload>;
}
