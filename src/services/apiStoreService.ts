import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import Cookies from "js-cookie";
import { baseUrl } from "../consts";
import { ICategory, IProduct } from "../types";

interface IBody {
  username: string;
  password: string;
}

export const apiStoreService = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    createProduct: build.mutation<IProduct, FormData>({
      query: (body) => ({
        method: "POST",
        url: "products",
        body,
      }),
    }),

    deleteProduct: build.mutation<string, string | undefined>({
      query: (id) => ({
        method: "DELETE",
        url: `products/${id}`,
      }),
    }),

    updateProduct: build.mutation<
      IProduct,
      { id: string | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => {
        return {
          method: "PATCH",
          url: `products/${id}`,
          body: formData,
        };
      },
    }),

    createCategory: build.mutation<ICategory, FormData>({
      query: (body) => ({
        method: "POST",
        url: "categories",
        body,
      }),
    }),

    deleteCategory: build.mutation<string, { id: string; key: string }>({
      query: (params) => ({
        method: "DELETE",
        url: "categories",
        params: { ...params },
      }),
    }),

    updateCategory: build.mutation<
      ICategory,
      {
        formData: FormData;
        params: {
          currentCategoryId: string | undefined;
          key: string | undefined;
        };
      }
    >({
      query: ({ formData, params }) => ({
        method: "PUT",
        url: `categories`,
        params: { ...params },
        body: formData,
      }),
    }),

    fetchAllProducts: build.query<IProduct[], void>({
      query: () => ({
        url: "products",
      }),
    }),

    fetchCategories: build.query<ICategory[], void>({
      query: () => ({
        url: "categories",
      }),
    }),

    fetchProductsByCategoryId: build.query<IProduct[], string>({
      query: (id) => ({
        url: `products/${id}`,
        params: { categoryId: id },
      }),
    }),

    fetchProductById: build.query<IProduct[], string>({
      query: (id) => ({
        url: `products/${id}`,
      }),
    }),
  }),
});

export {};
