"use client";

import React, { FC } from "react";

import { images } from "@/assets/constants";
import Image from "next/image";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { cn } from "@/libs/utils";

interface IProps {
  className?: string;
  basket?: boolean;
  backButton?: boolean;
  title?: string;
}

const Header: FC<IProps> = ({ title, backButton, basket, className }) => {
  const backClickHandler = () => {};
  const basketClickHandler = () => {};
  return (
    <header className={cn(className, "m-auto mb-2 w-full text-center")}>
      <div className="flex items-center justify-between">
        <div className="h-6 w-6">
          {backButton && (
            <ChevronLeft strokeWidth={2} onClick={backClickHandler} />
          )}
        </div>
        <Image src={images.blogo} alt="" className="h-6 w-6" />
        <div className="h-6 w-6">
          {basket && (
            <ShoppingBag
              className="p-[0.15rem]"
              strokeWidth={2}
              onClick={basketClickHandler}
            />
          )}
        </div>
      </div>
      <p className="m-auto font-bold">{title}</p>
    </header>
  );
};

export default Header;
