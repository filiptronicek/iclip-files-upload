import { Dispatch, SetStateAction } from "react";

const getInterclipCode = async (
  url: string,
  setCode: Dispatch<SetStateAction<string>>
): Promise<void> => {
  const response = await fetch(`https://interclip.app/api/set?url=${url}`);
  const data = await response.json();
  setCode(data.result);
};

export default getInterclipCode;
