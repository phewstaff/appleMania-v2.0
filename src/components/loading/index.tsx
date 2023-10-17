import { FC } from "react";
import { images } from "@/assets/constants";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const Loading: FC = () => {
  return (
    <div className="absolute left-1/2 top-1/2 z-50 min-h-full w-full -translate-x-1/2 -translate-y-1/2 transform bg-black text-white">
      <div className="flex w-full justify-center">
        <Image src={images.vlogo} alt="logo" />
      </div>
      <div className="flex flex-col items-center duration-1000 ease-out animate-in fade-in-0  zoom-in">
        <Image className="w-2/3 sm:w-2/6 md:w-1/4" src={images.iphone} alt="" />
        <div className="flex">
          <p>Apple</p>
          <p className="font-bold">Mania</p>
        </div>
        <p className="text-xs">вкусные технологии</p>
      </div>
      <Loader2 size={45} className="m-auto mt-5 animate-spin text-white" />
    </div>
  );
};

export default Loading;
