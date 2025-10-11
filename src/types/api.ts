export type ApiResponse<T> = {
  code: number;
  data: T;
  message: any;
};
