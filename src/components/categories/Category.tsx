import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../consts";
import { apiStoreService } from "../../services/apiStoreService";
import "./Categories.scss";
import CategoryDropdown from "./CategoryDropdown";
import Image from "next/image";

type CategoryProps = {
  refetch: () => void;
  admin: boolean;
  id: string;
  name: string;
  image: { key: string; url: string };
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCurrentCategoryId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setKey: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Category: React.FC<CategoryProps> = ({
  refetch,
  id,
  name,
  image,
  setValue,
  setCurrentCategoryId,
  setKey,
  admin,
}) => {
  const [deleteCategory, response] =
    apiStoreService.useDeleteCategoryMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const navigate = useNavigate();

  const key = image.key;
  return (
    <div key={id} className="category-card">
      <CategoryDropdown
        setCurrentCategoryId={setCurrentCategoryId}
        setKey={setKey}
        id={id}
        ImageKey={key}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onUpdate={() => {
          setValue(name);
        }}
        onDelete={() => {
          return deleteCategory({ id, key }).then(() => {
            refetch();
          });
        }}
      />
      {!admin && (
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className="dropdown-dots"
        >
          <div className="dropdown-dot"></div>
          <div className="dropdown-dot"></div>
          <div className="dropdown-dot"></div>
        </div>
      )}
      <div className="category-image">
        <Image
          height={140}
          width={128}
          // onClick={() => navigate(`/products/category/${id}`)}
          src={image.url}
          alt=""
        />
      </div>

      <h3 className="category-name">{name}</h3>
    </div>
  );
};

export default Category;
