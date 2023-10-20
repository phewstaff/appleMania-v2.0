"use client";
import { FC, useEffect, useState } from "react";
import "./Products.scss";
import { apiStoreService } from "@/services/apiStoreService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/hooks/redux";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const productFormSchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    price: yup.string().required(),
    description: yup.string().required(),
  })
  .required();

type FormData = yup.InferType<typeof productFormSchema>;

type Props = {
  id: string;
};

const Products: FC<Props> = ({ id }) => {
  const admin = useAppSelector((state) => {
    return state.auth.admin;
  });

  const [selectedPreviewFile, setPreviewFile] = useState<File | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<File | null>>,
  ): void => {
    setFunc(event.target.files![0]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(productFormSchema),
  });

  const [postProduct, { isError }] = apiStoreService.useCreateProductMutation();

  const submitForm = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("previewImage", selectedPreviewFile as File);

    await postProduct(formData);
    invalidateProducts();
  };

  const {
    refetch: invalidateProducts,
    data: products,
    isLoading,
    error,
  } = apiStoreService.useFetchProductsByCategoryIdQuery(id);

  useEffect(() => {
    invalidateProducts();
  }, []);

  return (
    <>
      <div className="m-auto flex max-w-md flex-col items-center">
        {!admin && (
          <div className="flex flex-col items-center gap-1">
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
              className="rounded-2xl  bg-slate-100"
            />

            <Input
              onChange={(event) => handleFileChange(event, setPreviewFile)}
              name="image"
              type="file"
              className="cursor-pointer rounded-full bg-slate-700 text-white hover:bg-slate-900"
            />

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
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    // navigate(`/product/${item._id}`);
                  }}
                  className="product-card"
                >
                  <div className="product-image">
                    <img src={item.previewImage?.url} />
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
