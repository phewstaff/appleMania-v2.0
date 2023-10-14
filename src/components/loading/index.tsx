import { FC } from "react";
import { images } from "../../assets/constants";
import "./Loading.scss";
import Image from "next/image";

const Loading: FC = () => {
  return (
    <>
      <div className="loading-container">
        <div className="header-container">
          <Image src={images.vlogo} alt="" className="apple-logo" />
        </div>
        <div className="main-container">
          <Image className="iphone-14" src={images.iphone} alt="" />
          <div className="flex">
            <h2>Apple</h2>
            <h3>Mania</h3>
          </div>
          <h4>вкусные технологии</h4>
        </div>
        <Image className="loader" src={images.loader} alt="" />
      </div>
    </>
  );
};

export default Loading;
