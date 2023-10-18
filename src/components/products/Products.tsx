"use client";
import { FC, useEffect, useState } from "react";
import "./Products.scss";
import { apiStoreService } from "@/services/apiStoreService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/hooks/redux";

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
      <div className="products-page-container">
        {isLoading && <h1>Loading</h1>}
        {error && <h1>Failed to get products</h1>}
        {!admin && (
          <div className="add-product">
            <input
              {...register("name")}
              placeholder="Name"
              className="product-input"
              type="text"
            ></input>

            <input
              {...register("price")}
              placeholder="Price"
              type="text"
              className="product-input"
            ></input>

            <textarea
              placeholder="Description"
              {...register("description")}
              name="description"
              className="product-input"
            />
            <label className="choose-image">
              Choose preview image
              <input
                onChange={(event) => handleFileChange(event, setPreviewFile)}
                name="image"
                type="file"
                className="choose-image-input"
              />
            </label>
            <label className="submit-button" onClick={handleSubmit(submitForm)}>
              Post Product
            </label>
          </div>
        )}
        <div className="product-container">
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
