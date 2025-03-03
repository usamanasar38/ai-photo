export interface Response<T> {
    data: T;
  }
  
  export interface Page {
    num: number;
    size: number;
  }
  
  export interface PaginatedData<T> {
    data: T[];
    nextPage?: Page;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    links: { next?: string };
  }