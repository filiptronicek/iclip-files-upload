import { ChangeEvent, Dispatch, SetStateAction } from "react";
import getInterclipCode from "./getCode";

const uploadFile = async (
  filesEndpoint: string,
  toast: any,
  setFileURL: Dispatch<SetStateAction<string>>,
  setUploaded: Dispatch<SetStateAction<boolean>>,
  setCode: Dispatch<SetStateAction<string>>,
  e: any | ChangeEvent<HTMLInputElement>
): Promise<void> => {
  const file = e?.dataTransfer?.files[0] || e.target.files[0];
  const filename = encodeURIComponent(file.name);
  const fileType = encodeURIComponent(file.type);
  const res = await fetch(
    `/api/upload-url?file=${filename}&fileType=${fileType}`
  );
  const { url, fields } = await res.json();
  const formData = new FormData();
  Object.entries({ ...fields, file }).forEach(
    ([key, value]: [string, string | Blob]) => {
      formData.append(key, value);
    }
  );
  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (upload.ok) {
    toast.success("File uploaded successfully!");
    const url = `${filesEndpoint}/${fields.key}`;
    setFileURL(url);
    await getInterclipCode(url, setCode);
    setUploaded(true);
  } else {
    toast.error("Upload failed.");
  }
};

export default uploadFile;
