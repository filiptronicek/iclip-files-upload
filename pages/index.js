import "tailwindcss/tailwind.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Avatar, Tooltip } from "@nextui-org/react";

export default function HomePage() {
  const { data: session } = useSession();

  const filesEndpoint = "https://files.interclip.app";

  const [showOverlay, setShowOverlay] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileURL, setFileURL] = useState(filesEndpoint);
  const [code, setCode] = useState("iosxd");

  const getInterclipCode = async (url) => {
    const response = await fetch(`https://interclip.app/api/set?url=${url}`);
    const data = await response.json();
    setCode(data.result);
  };

  const uploadFile = async (e) => {
    const file = e?.dataTransfer?.files[0] || e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);
    const res = await fetch(
      `/api/upload-url?file=${filename}&fileType=${fileType}`
    );
    const { url, fields } = await res.json();
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      toast.success("File uploaded successfully!");
      const url = `${filesEndpoint}/${fields.key}`;
      setFileURL(url);
      await getInterclipCode(url);
      setUploaded(true);
    } else {
      toast.error("Upload failed.");
    }
  };

  if (typeof window !== "undefined") {
    if (!setShowOverlay) {
      document.getElementById("button").onclick = () =>
        document.getElementById("hidden-input").click();
    }
  }
  // reset counter and append file to gallery when file is dropped
  const dropHandler = (e) => {
    e.preventDefault();
    uploadFile(e);
    setShowOverlay(false);
  };

  // only react to actual files being dragged
  const dragEnterHandler = (e) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  const dragLeaveHandler = (_e) => {
    setShowOverlay(false);
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  return (
    <main className="flex flex-col justify-between items-center h-screen bg-[#157EFB] text-white">
      <header className="flex justify-between items-center w-screen max-w-screen gap-4">
        <h1 className="text-4xl font-bold">Interclip files</h1>
        {session ? (
          <>
            <div className="flex flex-row mx-4 gap-4 items-center justify-center">
              <Tooltip
                text={`Signed in as: ${
                  session.user.name || session.user.email
                }`}
              >
                <Avatar
                  size="large"
                  src={session.user.image}
                  color="error"
                  bordered
                />
              </Tooltip>
              <Button
                color="warning"
                className="bg-transparent font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded"
                onClick={() => signOut()}
                bordered
                auto
              >
                Log out
              </Button>
            </div>
          </>
        ) : (
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </header>
      <section className="h-1/2">
        <Toaster />
        <div className="bg-[#005AC7] h-full w-screen sm:px-8 md:px-16 sm:py-8">
          <main className="container mx-auto max-w-screen-lg h-full">
            {!uploaded ? (
              <article
                aria-label="File Upload Modal"
                className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDragEnter={dragEnterHandler}
              >
                {showOverlay && (
                  <div
                    id="overlay"
                    className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
                  >
                    <i>
                      <svg
                        className="fill-current w-12 h-12 mb-3 text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                      </svg>
                    </i>
                    <p className="text-lg text-blue-700">Drop your file here</p>
                  </div>
                )}

                <section className="overflow-auto p-8 w-full h-full flex flex-col">
                  <header className="border-dashed border-2 h-full border-[#157EFB] py-12 flex flex-col justify-center items-center">
                    {!showOverlay && (
                      <>
                        <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                          <span>Drag and drop your</span>&nbsp;
                          <span>file anywhere or</span>
                        </p>
                        <input
                          id="hidden-input"
                          type="file"
                          onChange={uploadFile}
                          className="hidden"
                        />
                        <button
                          id="button"
                          className="mt-2 rounded-xl px-3 py-1 bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
                        >
                          Upload a file
                        </button>
                      </>
                    )}
                  </header>
                </section>
              </article>
            ) : (
              <article className="relative h-full flex flex-col bg-white shadow-xl rounded-md">
                <section className="h-full overflow-auto p-8 w-full flex flex-col">
                  <header className="border-solid border-2 h-full border-gray-400 py-12 flex flex-col justify-center items-center">
                    <p className="mb-3 font-semibold text-gray-900 text-2xl flex flex-wrap justify-center">
                      <span>Your file has been uploaded to</span>
                    </p>
                    <p className="mb-3 font-semibold text-gray-900 text-3xl flex flex-wrap justify-center text-center hover:underline">
                      <span>
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileURL.replace("https://", "")}
                        </a>
                      </span>
                    </p>
                    <p className="mb-3 font-semibold text-gray-900 text-2xl flex flex-wrap justify-center">
                      <span>as the code</span>
                    </p>
                    <p className="mb-3 font-semibold text-gray-900 text-3xl flex flex-wrap justify-center">
                      <span>
                        <a
                          href={`https://interclip.app/${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {code}
                        </a>
                      </span>
                    </p>
                    <button
                      className="mt-2 rounded-xl px-3 py-1 bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
                      onClick={() => {
                        setUploaded(false);
                        setShowOverlay(false);
                      }}
                    >
                      Upload a new file
                    </button>
                  </header>
                </section>
              </article>
            )}
          </main>
        </div>
      </section>
      <footer>
        <div className="container mx-auto max-w-screen-lg h-full">
          <div className="flex flex-col items-center justify-center">
            <p className="text-white text-center text-sm">
              Made with{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              by{" "}
              <a
                href="https://github.com/filiptronicek"
                target="_blank"
                rel="noopener noreferrer"
              >
                @filiptronicek
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
