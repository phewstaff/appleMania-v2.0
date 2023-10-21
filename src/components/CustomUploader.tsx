import { UploadButton } from "@/utils/uploadthing";
import { FC } from "react";
import { UploadFileResponse } from "uploadthing/client";

interface CustomUploaderProps {
  setFiles: React.Dispatch<
    React.SetStateAction<UploadFileResponse[] | undefined>
  >;
}

const CustomUploader: FC<CustomUploaderProps> = ({ setFiles }) => {
  return (
    <UploadButton
      className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ut-button:h-8 ut-button:w-full ut-button:rounded-full ut-button:bg-slate-700 ut-button:hover:bg-slate-900 ut-allowed-content:hidden ut-button:ut-readying:bg-slate-700/50"
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);

        setFiles(res);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default CustomUploader;
