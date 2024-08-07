import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "../../utilities/utils";
import { rootUrl } from "../../utilities/services/convertFileAPI.services";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  convertedFileActions,
  SelectAllConvertedFile,
  SelectIsDelete,
  SelectIsLoading,
  SelectIsSuccess,
} from "../../store/reducers/convertedFileSlice";
import { AllConvertedFiles } from "../../models/convertedFileModel";
import Loader from "../../components/loaders";
function Download() {
  const dispatch = useAppDispatch();
  const isDelete = useAppSelector(SelectIsDelete);
  const isLoading = useAppSelector(SelectIsLoading);
  const isSuccess = useAppSelector(SelectIsSuccess);
  const AllConvertedFile = useAppSelector(SelectAllConvertedFile);
  const storedFiles = decryptData("files");
  const navigate = useNavigate();
  const [isConverting, setIsConverting] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const isClicked = decryptData("isClicked");

  useEffect(() => {
    encryptData("isClicked", false);
  }, []);
  useEffect(() => {
    if (!isClicked) {
      dispatch(convertedFileActions.getFiles({ _id: storedFiles?._id }));
    }
  }, [isClicked]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(convertedFileActions.getFiles({ _id: storedFiles?._id }));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (AllConvertedFile?.length === 0 && isDelete) {
      navigate(-1);
    }
  }, [isDelete, AllConvertedFile]);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    // Check if any file is still converting
    const filesInProgress = AllConvertedFile.filter(
      (file: AllConvertedFiles) => !file.status
    );
    if (filesInProgress.length > 0) {
      if (isConverting) {
        // Start the progress interval for files still being converted
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval!); // Clear the interval once progress reaches 100%
              setIsConverting(false); // Stop the conversion process
              return 100;
            }
            return prev + 20;
          });
        }, 1000);
      } else {
        // Once not converting, update file statuses
        filesInProgress.forEach((file: AllConvertedFiles) => {
          dispatch(
            convertedFileActions.changeStatusFile({
              fileId: file._id,
              newStatus: true,
            })
          );
        });
      }
    } else {
      // If no files are in progress, clean up the interval if it exists
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConverting, AllConvertedFile, dispatch]); // Added `AllConvertedFile` and `dispatch` to the dependency array

  // Remove uploaded file
  const handleRemoveRow = (fileId: string, fileName: string) => {
    dispatch(
      convertedFileActions.deleteSingleFile({
        fileId: fileId,
        outputFileName: fileName,
      })
    );
  };

  const handleDownloadAllFiles = async () => {
    const payload = {
      convertedFile: AllConvertedFile,
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
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
      <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
      <div className="lg:col-span-3 py-2 px-5">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Conversion Results</h1>
        </div>
        {!!AllConvertedFile && !!AllConvertedFile.length && (
          <>
            {/* UI after file upload */}
            <div className="mt-5 border rounded-lg">
              <div>
                {AllConvertedFile.map(
                  (file: AllConvertedFiles, index: number) => (
                    <div
                      className={`text-white bg-[--primary-color] w-fit !h-[40px] rounded  xl:ml-[-53px] download custom-import primary-btn !justify-center !shadow-none ${
                        isConverting ? "opacity-75" : "opacity-100"
                      }`}
                      key={index}
                    >
                      <div className="flex items-center file-list-item w-full sm:w-fit ">
                        <div>{file.fileName}</div>
                      </div>

                      {!file.status ? (
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
                      ) : file.converted ? (
                        <div className="border border-[#1add72] text-[#1add72] px-7 py-1 w-fit rounded mx-5 sm:m-auto ">
                          Done
                        </div>
                      ) : (
                        <div
                          className={`border px-5 py-1 rounded  sm:m-auto !mr-[4.25rem] w-fit  ${
                            file.converted
                              ? "border-[#1add72] text-[#1add72]"
                              : "border-[#f36] text-[#f36]"
                          } `}
                        >
                          Not Converted
                        </div>
                      )}

                      <div
                        className={`text-white bg-[var(--primary-color)] px-5 py-3 w-28 rounded  xl:ml-[-53px] download custom-import primary-btn !h-[40px] !justify-center !shadow-none ${
                          !file.status ? "opacity-75" : "opacity-100"
                        }`}
                      >
                        <button
                          disabled={file.status}
                          className={`${
                            file.status && file.status ? "cursor-no-drop" : ""
                          }  `}
                        >
                          <a
                            className="text-decoration-none "
                            {...(file.status && file.converted
                              ? { href: `${rootUrl}/jobs/${file.fileName}` }
                              : {})}
                          >
                            Download
                          </a>
                        </button>
                      </div>
                      <div className="file-list-item">
                        <svg
                          onClick={
                            file.status
                              ? () => handleRemoveRow(file._id, file.fileName)
                              : undefined
                          }
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#7987a1"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="cross-ic cursor-pointer"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="15" y1="9" x2="9" y2="15"></line>
                          <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-between items-center added-files flex-wrap py-3">
                <div className="add-more-btn flex items-center">
                  <div className="custom-import border-2 px-1 py-1 primary-border rounded-lg ms-3">
                    <span
                      className="label px-4 text-nowrap flex items-center text-sm font-semibold primary-text"
                      onClick={() => navigate(-1)}
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
                    className={`text-white bg-[var(--primary-color)] px-5 py-3 rounded download  text-nowrap  custom-import primary-btn  !h-[50px] shodow-none${
                      AllConvertedFile[AllConvertedFile.length - 1].status
                        ? "opacity-100"
                        : "opacity-75"
                    }`}
                    onClick={() => {
                      AllConvertedFile[AllConvertedFile.length - 1].status &&
                        handleDownloadAllFiles();
                    }}
                  >
                    Download All Files
                  </button>
                </div>
              </div>
            </div>
            {
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
                        <button className="flex items-center border border-[--primary-color] sm:px-[7px] px-3 py-[5px] gap-3 rounded">
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
                              src="/static/img/happy-user/fb.svg"
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
                              src="/static/img/happy-user/twitter.svg"
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
            }

            {/* UI after file upload ends */}
          </>
        )}
      </div>
    </div>
  );
}

export default Download;
