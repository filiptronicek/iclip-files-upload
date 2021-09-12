import "tailwindcss/tailwind.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Upload() {
  const filesEndpoint = "https://files.interclip.app";

  const [showOverlay, setShowOverlay] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileURL, setFileURL] = useState(filesEndpoint);
  const [code, setCode] = useState("iosxd");

  const uploadPhoto = async (e) => {
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
      setUploaded(true);
      setFileURL(`${filesEndpoint}/${fields.key}`);
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
    uploadPhoto(e);
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
    <main className="flex flex-col justify-center items-center h-screen">
      <Toaster />
      <p className="text-4xl">Interclip files</p>
      <div className="bg-gray-500 h-1/2 w-screen sm:px-8 md:px-16 sm:py-8">
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

              <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
                <header className="border-dashed border-2 h-full border-gray-400 py-12 flex flex-col justify-center items-center">
                  {!showOverlay && (
                    <>
                      <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                        <span>Drag and drop your</span>&nbsp;
                        <span>file anywhere or</span>
                      </p>
                      <input
                        id="hidden-input"
                        type="file"
                        onChange={uploadPhoto}
                        className="hidden"
                      />
                      <button
                        id="button"
                        className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
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
              <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
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
                        href={`$https://interclip.app/{code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {code}
                      </a>
                    </span>
                  </p>
                </header>
              </section>
            </article>
          )}
        </main>
      </div>
    </main>
  );
}
