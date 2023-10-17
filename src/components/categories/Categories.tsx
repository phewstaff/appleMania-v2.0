"use client";

import Category from "./Category";

import "./Categories.scss";
import { apiStoreService } from "@/services/apiStoreService";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "@/hooks/redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import Loading from "@/components/loading";

const categoryFormSchema = yup
  .object()
  .shape({
    name: yup.string().required().max(30),
    file: yup.mixed().required(),
  })
  .required();

type FormData = yup.InferType<typeof categoryFormSchema>;

const Categories: React.FC = () => {
  const admin = useAppSelector((state) => {
    return state.auth.admin;
  });
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files![0]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(categoryFormSchema) });
  const [currentCategoryId, setCurrentCategoryId] = useState<
    string | undefined
  >();
  const [key, setKey] = useState<string | undefined>();
  const [postCategory, { isError }] =
    apiStoreService.useCreateCategoryMutation();
  const [updateCategory, { isError: updateError }] =
    apiStoreService.useUpdateCategoryMutation();
  const addOrUpdateCategory = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", selectedFile as File);
    if (currentCategoryId && key) {
      console.log("update");
      await updateCategory({
        formData,
        params: { currentCategoryId, key: key },
      });
    } else {
      await postCategory(formData);
    }
    setCurrentCategoryId(undefined);
    invalidateCategories();
  };

  const {
    refetch: invalidateCategories,
    data: categories,
    isLoading,
    error,
  } = apiStoreService.useFetchCategoriesQuery();

  return (
    <>
      <ToastContainer position="bottom-right" />
      {isLoading && <Loading />}
      <div className="categories-container">
        {!admin && (
          <div className="add-category">
            <input
              onChangeCapture={(e) => {
                setValue(e.currentTarget.value);
              }}
              {...register("name")}
              placeholder="Name"
              className="category-name-input"
            ></input>
            <label className="choose-image">
              Choose image
              <input
                {...register("file")}
                onChange={handleFileChange}
                name="image"
                type="file"
                className="choose-image-input"
              />
            </label>

            <button
              type="submit"
              className="submit-button"
              onClick={handleSubmit(addOrUpdateCategory)}
            >
              {!currentCategoryId ? <>Post category</> : <>Update Category</>}
            </button>
          </div>
        )}
        {error && <h1>Error</h1>}
        {categories && (
          <div className="category-cards-container">
            {categories.map((item) => {
              return (
                <Category
                  admin={admin}
                  setValue={setValue}
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  setCurrentCategoryId={setCurrentCategoryId}
                  setKey={setKey}
                  refetch={invalidateCategories}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
