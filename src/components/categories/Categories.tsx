"use client";

import { apiStoreService } from "../../services/apiStoreService";
import "./Categories.scss";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "../../hooks/redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import Category from "./Category";
import Loading from "../loading/Loading";
import { useUploadThing } from "@/utils/uploadthing";

const categoryFormSchema = yup
  .object()
  .shape({
    name: yup.string().required().max(30),
    image: yup.mixed().required(),
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
  } = useForm<FormData>({
    resolver: yupResolver(categoryFormSchema),
  });

  const [currentCategoryId, setCurrentCategoryId] = useState<
    string | undefined
  >();

  const [postCategory, { isError }] =
    apiStoreService.useCreateCategoryMutation();

  const [updateCategory, { isError: updateError }] =
    apiStoreService.useUpdateCategoryMutation();

  const addOrUpdateCategory = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", selectedFile as File);
    if (currentCategoryId) {
      await updateCategory({ currentCategoryId, formData });
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

  const { startUpload } = useUploadThing("imageUploader");

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  //TO DO    https://codesandbox.io/p/sandbox/github/adrianhajdin/threads/tree/main?file=%2Fcomponents%2Fforms%2FAccountProfile.tsx%3A45%2C2-45%2C50

  return (
    <>
      <ToastContainer position="bottom-right" />
      {isLoading && <Loading />}
      <div className="categories-container">
        {admin && (
          <div className="add-category">
            <input
              value={value}
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
                {...register("image")}
                onChange={handleFileChange}
                name="image"
                type="file"
                className="choose-image-input"
              />
            </label>

            <label
              className="submit-button"
              onClick={handleSubmit(addOrUpdateCategory)}
            >
              {!currentCategoryId ? <>Post category</> : <>Update Category</>}
            </label>
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
