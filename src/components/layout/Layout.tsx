"use client";

import React, { FC } from "react";

import "./Layout.scss";
import { images } from "@/assets/constants";
import Image from "next/image";
interface IProps {
  children: React.ReactNode;
  basket: boolean;
  backButton: boolean;
  title: string | undefined;
}

const Layout: FC<IProps> = ({ children, title, backButton, basket }) => {
  const backClickHandler = () => {};
  const basketClickHandler = () => {};
  return (
    <>
      <header>
        <div className="header-container">
          <div className="back-button">
            {backButton && (
              <Image onClick={backClickHandler} src={images.back} alt="" />
            )}
          </div>
          <Image src={images.blogo} alt="" className="apple-logo" />
          <div className="basket-button">
            {basket && (
              <Image onClick={basketClickHandler} src={images.basket} alt="" />
            )}
          </div>
        </div>
        <div className="title-container">
          <p className="title">{title}</p>
          <p className="under-title">Other Apple Products</p>
        </div>
      </header>
      <main> {children}</main>
    </>
  );
};

export default Layout;
