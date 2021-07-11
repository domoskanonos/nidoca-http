import {HttpClientRequest, HttpClientRequestType, HttpClientService} from "./http-client-service";
import {NidocaDateHelper} from "@domoskanonos/nidoca-date-helper/";

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Sort2 {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: string;
  pageSize: string;
  pageNumber: string;
  unpaged: boolean;
  paged: boolean;
}

export interface PageableContainer<T> {
  content: T[];
  pageable: Pageable;
  totalPages: string;
  last: boolean;
  totalElements: string;
  number: string;
  size: string;
  sort: Sort2;
  numberOfElements: string;
  first: boolean;
  empty: boolean;
}

export abstract class HttpRemoteRepository<T, S> {
  constructor(protected httpClient: HttpClientService, protected path: string) {}

  private nidocaDateHelper: NidocaDateHelper = new NidocaDateHelper();

  public async getAll(): Promise<T[]> {
    const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
    request.path = this.path.concat("/ALL");
    const response = await this.httpClient.request(request);
    const bodyText: string = await response.text();
    return <T[]>this.parseBody(bodyText);
  }

  public async persist(item: T): Promise<T> {
    console.log("persist item, value: %s", JSON.stringify(item));
    const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
    request.path = this.path.concat("/CREATE");
    request.requestMethod = HttpClientRequestType.POST;
    request.body = JSON.stringify(item);
    const response = await this.httpClient.request(request);
    const bodyText: string = await response.text();
    return <T>this.parseBody(bodyText);
  }

  public async update(id: S, item: T): Promise<T> {
    console.debug("update item for id= %s, value: %s", id, JSON.stringify(item));
    const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
    request.path = this.path.concat("/UPDATE/").concat(String(id));
    request.requestMethod = HttpClientRequestType.PUT;
    request.body = JSON.stringify(item);
    const response = await this.httpClient.request(request);
    const bodyText: string = await response.text();
    return <T>this.parseBody(bodyText);
  }

  public async delete(id: S): Promise<void> {
    console.debug("delete item for id= %s", id);
    const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
    request.path = this.path.concat("/DELETE/").concat(String(id));
    request.requestMethod = HttpClientRequestType.DELETE;
    await this.httpClient.request(request);
  }

  public async findById(id: S | null): Promise<T> {
    if (id == null) {
      return Promise.reject();
    } else {
      console.debug("find item by id=%s", id);
      const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
      request.path = this.path.concat("/FIND_BY_ID/").concat(String(id));
      const response = await this.httpClient.request(request);
      const responseText: string = await response.text();
      return <T>this.parseBody(responseText);
    }
  }

  public async search(
    page: number = 0,
    size: number = 0,
    sort: string = "",
    searchParams: string
  ): Promise<PageableContainer<T>> {
    const request: HttpClientRequest = this.httpClient.getDefaultGetRequestInstance();
    request.path = this.path
      .concat("/SEARCH?")
      .concat(searchParams)
      .concat("&page=")
      .concat(String(page))
      .concat("&size=")
      .concat(String(size))
      .concat("&sort=")
      .concat(sort);
    const response = await this.httpClient.request(request);
    const responseText: string = await response.text();
    return <PageableContainer<T>>this.parseBody(responseText);
  }
  private parseBody(bodyText: string): T[] | T | PageableContainer<T> {
    return this.nidocaDateHelper.parse(bodyText);
  }

}
