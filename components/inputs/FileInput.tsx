import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileInputProps {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
}

const FileInput: React.FC<FileInputProps> = ({ files, onChange }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  console.log(files);

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      {files && files.length > 0 ? (
        <div>
          <Image
            src={convertFileToUrl(files[0])}
            alt="uploaded file"
            width={1000}
            height={1000}
            className="max-h-[400px] overflow-hidden object-cover"
          />
        </div>
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={40}
            height={40}
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Click to upload</span> or drag
              and drop
            </p>
            <p>SVG , PNG , JPG or GIF (max 800x400) </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileInput;
