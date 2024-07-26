// Download.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Download() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const storedFiles = localStorage.getItem("files");
    if (storedFiles) {
      navigate("/download");
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const storedFiles = localStorage.getItem("files");
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }

    let interval: NodeJS.Timeout | null = null;

    if (isConverting) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval!);
            setIsConverting(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConverting, navigate]);

  useEffect(() => {
    if (progress === 100) {
      setIsDone(true);
      localStorage.removeItem("files");
    }
  }, [progress]);

  useEffect(() => {
    const storedFiles = localStorage.getItem("files");
    if (files.length === 0 && !storedFiles) {
      navigate("/");
    }
  }, [files]);

  if (!files || files.length === 0) {
    return null;
  }

  // Remove uploaded file
  const handleRemoveRow = (fileName: string) => {
    const updatedFiles = files.filter(
      (file: any) => file.fileName !== fileName
    );
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      localStorage.removeItem("files");
      navigate("/");
    }
  };

  const handleDownload = () => {
    console.log("Downloaded");
  };

  return (
    <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
      <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
      <div className="lg:col-span-3 py-2 px-5">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">File Converter</h1>
          <p className="text-sm pt-2">
            Easily convert files from one format to another, online.
          </p>
        </div>
        {!!files && !!files.length && (
          <>
            {/* UI after file upload */}
            <div className="mt-5 border rounded-lg">
              <div>
                {files.map((file: any, index: number) => (
                  <div
                    className="flex md:grid flex-wrap justify-between items-center file-list-main rounded-lg border-none"
                    key={index}
                  >
                    <div className="flex items-center file-list-item">
                      <div className="">{file.fileName}</div>
                    </div>

                    {isConverting ? (
                      <>
                        <div>
                          <p className="text-green-500 font-semibold text-md">
                            Converting
                          </p>
                          <div className="relative w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                            <div
                              className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : isDone ? (
                      <div className="text-gray-700">Done</div>
                    ) : (
                      <div className="text-gray-700">{file.size}</div>
                    )}
                    <div className="text-gray-700">
                      <button
                        disabled={isConverting}
                        onClick={() => handleDownload()}
                      >
                        Download
                      </button>
                    </div>
                    <div className="file-list-item">
                      <svg
                        onClick={() => handleRemoveRow(file.fileName)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7987a1"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="cross-ic cursor-pointer"
                        data-v-db7992bc=""
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          data-v-db7992bc=""
                        ></circle>
                        <line
                          x1="15"
                          y1="9"
                          x2="9"
                          y2="15"
                          data-v-db7992bc=""
                        ></line>
                        <line
                          data-v-db7992bc=""
                          x1="9"
                          y1="9"
                          x2="15"
                          y2="15"
                        ></line>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center added-files flex-wrap">
                <div className="add-more-btn flex">
                  <div className="custom-import border-2 px-1 py-1 primary-border rounded-lg ms-3 ">
                    <span
                      className="label px-4 text-nowrap flex items-center text-sm font-semibold primary-text"
                      onClick={() => window.open("/", "_blank")}
                    >
                      <span>
                        <img
                          className="mr-1"
                          src="../../static/img/ic-add-green.svg"
                          style={{ marginBottom: "4px" }}
                        />
                      </span>{" "}
                      Convert More
                    </span>
                    <span className="label-file"></span>
                  </div>
                </div>
              </div>
            </div>
            {/* UI after file upload ends */}
          </>
        )}
      </div>

      <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
    </div>
  );
}

export default Download;
