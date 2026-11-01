import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

type Services = {
  catalogBaseQuery: AppBaseQuery;
};

let services: Services = {
  catalogBaseQuery: fetchBaseQuery({ baseUrl: "" }),
};

export function configureServices(next: Partial<Services>) {
  services = { ...services, ...next };
}

export function getServices(): Services {
  return services;
}

export function resetServices() {
  services = {
    catalogBaseQuery: fetchBaseQuery({ baseUrl: "" }),
  };
}
