export type Paginate<T> = {
  data: T;
  current_page: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export const InitialPaginate = {
  data: [],
  current_page: 1,
  per_page: 0,
  last_page: 1,
  from: 0,
  to: 0,
  total: 0,
  first_page_url: "",
  last_page_url: "string",
  next_page_url: "string",
  prev_page_url: "string",
};
