import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { apiStoreService } from "../../services/apiStoreService";
import "./Categories.scss";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

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
  const [deleteCategory] = apiStoreService.useDeleteCategoryMutation();

  // const navigate = useNavigate();

  const key = image.key;
  return (
    <div key={id} className="category-card relative mt-2 rounded-2xl ">
      {!admin && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="absolute right-0 rounded-2xl bg-slate-50 text-slate-700  shadow-sm shadow-black "
            asChild
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="text-inherit" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="hover:!bg-destructive hover:text-white"
              onClick={() => {
                deleteCategory({ id, key });
                refetch();
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setValue(name);
                setCurrentCategoryId(id);
                setKey(key);
              }}
            >
              Update
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
