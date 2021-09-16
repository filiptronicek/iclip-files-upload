import { ChangeEvent, Dispatch, SetStateAction } from "react";
import getInterclipCode from "./getCode";
import { convertXML } from "simple-xml-to-json";
import formatBytes from "./formatBytes";

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
    const plainText = await upload.text();
    const json = convertXML(plainText);
    const erorrMsg = json.Error.children[0].Code.content;

    switch (erorrMsg) {
      case "EntityTooLarge":
        const fileSize = json.Error.children[2].ProposedSize.content;

        toast.error(
          `File too large (${formatBytes(fileSize)})`
        );
        break;
      default:
        console.log(erorrMsg);
        toast.error("Upload failed.");
    }
  }
};

export default uploadFile;
