import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../utilities/utils";
import { rootUrl } from "../../utilities/services/convertFileAPI.services";

import axios from "axios";
function Download() {
  const storedFiles = decryptData("files");
  const navigate = useNavigate();
  const [files, setFiles] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const urlList = ["image-converter", "heif-converter", "heif-jpg-converter"];
  const location = useLocation();

  useEffect(() => {
    const storedFiles = decryptData("files");
    if (storedFiles) {
      if (urlList.includes(location.state)) {
        navigate(`/${location.state}/download`);
      } else {
        navigate("/download");
      }
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const storedFiles: any = decryptData("files");
    if (storedFiles) {
      setFiles(storedFiles.convertedFile);
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
    }
  }, [progress]);

  useEffect(() => {
    const storedFiles = decryptData("files");
    if (files.length === 0 && !storedFiles) {
      navigate("/");
    }
  }, [files]);

  if (!files || files.length === 0) {
    return null;
  }

  // Remove uploaded file
  const handleRemoveRow = (idx: number) => {
    const updatedFiles = files.filter((_, index: number) => index !== idx);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      localStorage.removeItem("files");
      if (location.pathname.includes("image-converter")) {
        navigate("/image-converter");
      } else {
        navigate("/");
      }
    }
  };

  // const handleDownload = async (fileName: string) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/jobs/${fileName}`,
  //       {
  //         responseType: "blob",
  //       }
  //     );
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("Error downloading the files:", error);
  //   }
  // };
  const handleDownloadAllFiles = async () => {
    const payload = {
      convertedFile: storedFiles && storedFiles.convertedFile,
    };
    try {
      const response = await axios.post(`${rootUrl}/allZip`, payload, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ALLfiles.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the files:", error);
    }
  };
  return (
    <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
      <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
      <div className="lg:col-span-3 py-2 px-5">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Conversion Results</h1>
        </div>
        {!!files && !!files.length && (
          <>
            {/* UI after file upload */}
            <div className="mt-5 border rounded-lg">
              <div>
                {files.map((file: any, index: number) => (
                  <div
                    className="flex md:grid flex-wrap sm:justify-between items-center file-list-main-download rounded-lg border-none"
                    key={index}
                  >
                    <div className="flex items-center file-list-item w-full sm:w-fit ">
                      <div>{file.fileName}</div>
                    </div>

                    {isConverting ? (
                      <>
                        <div>
                          <p className="text-green-500 font-semibold text-md">
                            Converting
                          </p>
                          <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : isDone ? (
                      <div className="border border-[#1add72] text-[#1add72] px-7 py-1 w-fit rounded mx-5 sm:m-auto">
                        Done
                      </div>
                    ) : (
                      <div className="text-gray-700">{file.size}</div>
                    )}

                    <div
                      className={`text-white bg-[var(--primary-color)] px-5 py-3 w-28 rounded  xl:ml-[-53px] download ${
                        isConverting ? "opacity-75" : "opacity-100"
                      }`}
                    >
                      <button
                        disabled={isConverting}
                        className={`${isConverting ? "cursor-no-drop" : ""}`}
                        // onClick={() => handleDownload(file.fileName)}
                      >
                        <a
                          className="text-decoration-none"
                          href={`${rootUrl}/jobs/${file.fileName}`}
                        >
                          Download
                        </a>
                      </button>
                    </div>
                    <div className="file-list-item">
                      <svg
                        onClick={() => handleRemoveRow(index)}
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
                <div className="add-more-btn flex items-center">
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
                <div className="me-3">
                  <button
                    className="text-white bg-[var(--primary-color)] px-5 py-3 rounded download opacity-100 text-nowrap"
                    onClick={() => handleDownloadAllFiles()}
                  >
                    Download All Files
                  </button>
                </div>
              </div>
            </div>
            {!isConverting && (
              <div className="bg-gray-50 mx-5 rounded-lg">
                <div className="p-6 my-6  rounded-lg card-box">
                  <div className="border border-[var(--light-grey)] ">
                    <div className="bg-[var(--light-grey)] py-[14px] px-[30px]">
                      <h3 className="text-[22px] font-bold">
                        Are you a happy user?
                      </h3>
                    </div>

                    {/* div-1 */}
                    <div className="grid grid-cols-12 xl:gap-14 lg:gap-10 gap-5 w-full sm:px-[30px] px-1 py-5 border-b border-[var(--light-grey)]">
                      <div className="lg:col-span-4 col-span-12">
                        <p className="sm:text-base text-sm">
                          Want more features?
                        </p>
                      </div>
                      <div className="lg:col-span-8 col-span-12">
                        <button className="flex items-center border border-[var(--primary-color)] sm:px-[7px] px-3 py-[5px] gap-3 rounded">
                          <div>
                            <img
                              className=""
                              src="/static/img/happy-user/diamond.svg"
                              style={{}}
                            />
                          </div>
                          <div>
                            <p className="text-[var(--primary-color)] text-sm">
                              Upgrade to Pro
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* div-2 */}
                    <div className="grid grid-cols-12 xl:gap-14 lg:gap-10 gap-5 w-full sm:px-[30px] px-1 py-5 border-b border-[var(--light-grey)]">
                      <div className="lg:col-span-4 col-span-8">
                        <p className="sm:text-base text-sm">Buy more Coffee</p>
                      </div>
                      <div className="lg:col-span-8 col-span-12">
                        <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                          <div>
                            <img
                              className=""
                              src="/static/img/happy-user/offer.svg"
                              style={{}}
                            />
                          </div>
                          <div>
                            <p className="text-[var(--primary-color)] text-sm">
                              Donate
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 xl:gap-14 lg:gap-10 gap-5 w-full sm:px-[30px] px-1 py-5 border-b border-[var(--light-grey)]+">
                      <div className="lg:col-span-4 col-span-8">
                        <p className="sm:text-base text-sm">
                          Sharing is caring
                        </p>
                      </div>

                      <div className="lg:col-span-8 col-span-12">
                        <div className="flex items-center flex-wrap gap-5">
                          {/* button-1 */}
                          <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                            <img
                              className=""
                              src="/static/img/happy-user/diamond.svg"
                              style={{}}
                            />

                            <p className="text-[var(--primary-color)] text-sm">
                              Facebook
                            </p>
                          </button>

                          {/* button-2*/}
                          <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                            <img
                              className=""
                              src="/static/img/happy-user/offer.svg"
                              style={{}}
                            />

                            <p className="text-[var(--primary-color)] text-sm">
                              Twitter
                            </p>
                          </button>

                          {/* button-3*/}
                          <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                            <img
                              src="/static/img/happy-user/reddit.svg"
                              style={{}}
                            />

                            <div>
                              <p className="text-[var(--primary-color)] text-sm">
                                Reddit
                              </p>
                            </div>
                          </button>

                          {/* button-3*/}
                          <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                            <img
                              src="/static/img/happy-user/linkedin.svg"
                              style={{}}
                            />

                            <p className="text-[var(--primary-color)] text-sm">
                              Linkedin
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* div-4*/}
                    <div className="grid grid-cols-12 xl:gap-14 lg:gap-10 gap-5 w-full sm:px-[30px] px-1 py-5 border-b border-[var(--light-grey)] ">
                      <div className="lg:col-span-4 col-span-8">
                        <p className="sm:text-base text-sm">Come Back!</p>
                      </div>
                      <div className="col-span-8">
                        <button className="flex items-center border border-[var(--primary-color)] px-[7px] py-[5px] gap-3 rounded">
                          <img
                            className=""
                            src="/static/img/happy-user/bookmark.svg"
                            style={{}}
                          />

                          <p className="text-[var(--primary-color)] text-sm">
                            Bookmark Page
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* div-5*/}
                    <div className="grid grid-cols-12 xl:gap-14 lg:gap-10 gap-5 w-full sm:px-[30px] px-1 py-5 border-b border-[var(--light-grey)]">
                      <div className="lg:col-span-4 col-span-8">
                        <p className="sm:text-base text-sm">
                          Link in this tool
                        </p>
                      </div>
                      <div className="col-span-8">
                        <div className="flex flex-wrap">
                          <button className="flex items-center border border-[var(--primary-color)] sm:px-[7px] px-3 py-[5px]  gap-3 rounded-l">
                            <img
                              className=""
                              src="/static/img/happy-user/link.svg"
                              style={{}}
                            />
                            <a href="#">
                              <p className="text-[var(--primary-color)] text-sm">
                                https://convertio2-0-red.vercel.app
                              </p>
                            </a>
                          </button>

                          <div className="bg-[var(--primary-color)] rounded-r">
                            <a href="#">
                              <p className="text-white md:px-3 px-1 py-1">
                                Copy
                              </p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UI after file upload ends */}
          </>
        )}
      </div>
    </div>
  );
}

export default Download;
