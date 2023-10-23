"use client";
import { FC, SetStateAction, useEffect, useState } from "react";
import "./Products.scss";
import { apiStoreService } from "@/services/apiStoreService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/hooks/redux";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { UploadFileResponse } from "uploadthing/client";

import "@uploadthing/react/styles.css";
import CustomUploader from "../CustomUploader";
import Image from "next/image";

const productFormSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    price: yup.string().required(),
    description: yup.string().required(),
  })
  .required();

type FormData = yup.InferType<typeof productFormSchema>;

const Products = ({ params }: { params: { id: string } }) => {
  const admin = useAppSelector((state) => {
    return state.auth.admin;
  });

  const [selectedPreviewFile, setPreviewFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(productFormSchema),
  });
  const [files, setFiles] = useState<UploadFileResponse[] | undefined>([]);
  const [postProduct, { isError }] = apiStoreService.useCreateProductMutation();

  const submitForm = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("categoryId", params.id);
    if (files) {
      formData.append("image", JSON.stringify(files[0]));
    }

    await postProduct(formData);
    invalidateProducts();
  };

  const {
    refetch: invalidateProducts,
    data: products,
    isLoading,
    error,
  } = apiStoreService.useFetchProductsByCategoryIdQuery(params.id);

  useEffect(() => {
    invalidateProducts();
  }, []);

  return (
    <>
      <div className="m-auto flex max-w-md flex-col items-center">
        {!admin && (
          <div className="flex w-full flex-col items-center gap-1">
            <Input
              {...register("name")}
              placeholder="Name"
              className="rounded-full  bg-slate-100"
            />

            <Input
              {...register("price")}
              placeholder="Price"
              className="rounded-full  bg-slate-100"
            />

            <Textarea
              {...register("description")}
              name="description"
              placeholder="Description"
              className="rounded-2xl bg-slate-100"
            />

            <CustomUploader setFiles={setFiles} />

            <Button
              type="submit"
              className="h-8 w-1/2 rounded-full"
              onClick={handleSubmit(submitForm)}
            >
              Post product
            </Button>
          </div>
        )}
        <div className="product-container">
          {isLoading && <h1>Loading</h1>}
          {error && <h1>Failed to get products</h1>}
          {products &&
            products.map((item) => {
              console.log(item);
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    // navigate(`/product/${item._id}`);
                  }}
                  className="product-card"
                >
                  <div className="product-image">
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={item.image.url}
                    />
                  </div>
                  <h3 className="product-name">{item.name}</h3>
                  <p className="price">{item.price} руб</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Products;
