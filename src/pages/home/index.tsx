import { TECollapse } from "tw-elements-react";
import { useEffect, useState } from "react";
import {
  TEDropdown,
  TEDropdownToggle,
  TEDropdownMenu,
  TEDropdownItem,
  TERipple,
} from "tw-elements-react";
import axios from "axios";
import possibleFormat from "../../utilities/convertedFileFormat.json";

function Home(): JSX.Element {
  const [activeElement, setActiveElement] = useState("");
  const [uploadedFileList, setUploadedFileList] = useState<any>([]);
  const [conversionFormat, setConversionFormat] = useState<any>([]);
  const [extensionName, setExtensionName] = useState<string>("");
  const [isFileExtension, setIsFileExtension] = useState<boolean>(false);
  const [isErrorShow, setIsErrorShow] = useState<boolean>(false);

  useEffect(() => {
    if (uploadedFileList.length) {
      const fileExtensions = uploadedFileList.map(
        (file: any) => file.fileExtension
      );
      const allExtensionsSame = fileExtensions.every(
        (ext: string) => ext === fileExtensions[0]
      );
      setIsFileExtension(allExtensionsSame);
    }
  }, [uploadedFileList]);

  // show error when we select the same file and change specific conversion format
  useEffect(() => {
    if (conversionFormat.length !== 0) {
      if (conversionFormat.length === uploadedFileList.length) {
        const fileExtensions = conversionFormat.map(
          (file: any) => file.conversionFormat
        );
        const allExtensionsSame = fileExtensions.every(
          (ext: string) => ext === fileExtensions[0]
        );
        if (allExtensionsSame) {
          setExtensionName(fileExtensions[0]);
          setIsErrorShow(false);
        }
      } else {
        setIsErrorShow(true);
      }
    } else {
      setIsErrorShow(false);
    }
  }, [conversionFormat, isErrorShow]);

  useEffect(() => {
    if (extensionName) {
      setIsErrorShow(false);
    }
  }, [extensionName]);

  const handleClick = (value: string) => {
    if (value === activeElement) {
      setActiveElement("");
    } else {
      setActiveElement(value);
    }
  };

  // handle multiple file uploading
  const handleFileUpload = (event: any) => {
    if (!event.target.files[0]) {
      console.log("No file selected");
      return;
    }
    if (
      Array.from(event.target.files).length > 10 ||
      uploadedFileList.length > 9
    ) {
      event.preventDefault();
      console.log(`Cannot upload files more than 10`);
      return;
    }

    const fd = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      setUploadedFileList((prevState: any) => [
        ...prevState,
        {
          fileName: event.target.files[i].name,
          size: formatBytes(event.target.files[i].size),
          fileExtension: event.target.files[i].name
            .split(".")
            .pop()
            .toLowerCase(),
        },
      ]);
      fd.append(`file${i + 1}`, event.target.files[i]);
    }
    axios
      .post("http://httpbin.org/post", fd, {
        headers: {
          "Custom-Header": "value",
        },
      })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  // calculate file size in bytes,KB,MB,GB
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Handle choose conversion format
  const handleChooseConversion = (format: string, fileName: string) => {
    let fileIndex = conversionFormat.findIndex(
      (item: any) => item.fileName === fileName
    );
    if (fileIndex != -1) {
      setConversionFormat((prevFormats: any) => {
        const updatedFormats = [...prevFormats];
        updatedFormats[fileIndex] = {
          ...updatedFormats[fileIndex],
          conversionFormat: format,
        };
        return updatedFormats;
      });
    } else {
      setConversionFormat((prevState: any) => [
        ...prevState,
        { conversionFormat: format, fileName: fileName },
      ]);
    }
    setIsErrorShow(true);
  };

  // Remove uploaded file
  const handleRemoveRow = (fileName: string) => {
    const updatedDetails = uploadedFileList.filter(
      (file: any) => file.fileName !== fileName
    );
    const updatedConversionFormatted = conversionFormat.filter(
      (conversion: any) => conversion.fileName !== fileName
    );
    setConversionFormat(updatedConversionFormatted);
    setUploadedFileList(updatedDetails);
  };

  // handle same file extension conversion
  const handleSameFileExtensionConversion = (conversionExtension: string) => {
    setExtensionName(conversionExtension);
    setIsErrorShow(false);
    if (conversionFormat.length === 0) {
      const newConversionFormat = uploadedFileList.map((uploadedFile: any) => ({
        conversionFormat: conversionExtension,
        fileName: uploadedFile.fileName,
      }));
      setConversionFormat(newConversionFormat);
    } else {
      const updatedConversionFormat = uploadedFileList.map(
        (uploadedFile: any) => {
          const existingFormat = conversionFormat.find((format: any) => {
            format.fileName === uploadedFile.fileName;
          });
          if (existingFormat) {
            return {
              ...existingFormat,
              conversionFormat: conversionExtension,
            };
          } else {
            return {
              conversionFormat: conversionExtension,
              fileName: uploadedFile.fileName,
            };
          }
        }
      );
      setConversionFormat(updatedConversionFormat);
    }
  };
  return (
    <>
      <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
        <div className="bg-gray-50 h-36 lg:h-full mx-5"></div>
        <div className="lg:col-span-3 py-2 px-5">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">File Converter</h1>
            <p className="text-sm pt-2">
              Easily convert files from one format to another, online.
            </p>
          </div>
          {!!uploadedFileList && !!uploadedFileList.length ? (
            <>
              {/* UI after file upload */}
              <div className="mt-5">
                <div className="w-fit">
                  <div className="custom-import primary-btn primary-btn-outlined border-none rounded-none">
                    <span className="label px-4 text-nowrap flex items-center text-sm">
                      {" "}
                      <span>
                        <img
                          className="mr-1"
                          src="../../static/img/ic-add-green.svg"
                          style={{ marginBottom: "4px" }}
                        />
                      </span>{" "}
                      Add more Files
                    </span>
                    <span className="label-file"></span>
                    <input
                      className="import-field"
                      type="file"
                      name="name"
                      multiple
                      onChange={(e: any) => handleFileUpload(e)}
                    />
                  </div>
                </div>

                <div>
                  {uploadedFileList.map((file: any, index: number) => (
                    <div
                      className="grid flex justify-between items-center file-list-main"
                      key={index}
                    >
                      <div className="flex items-center file-list-item">
                        <img
                          src="../../static/img/picture.svg"
                          className="me-1"
                        />
                        <div className="">{file.fileName}</div>
                      </div>

                      <div className="file-list-item">{file.size}</div>
                      <div className="file-list-item">
                        <TEDropdown className="flex justify-center">
                          <TERipple rippleColor="light">
                            <TEDropdownToggle className="flex items-center whitespace-nowrap rounded px-3 pb-1 pt-1 border small-btn">
                              {conversionFormat &&
                              conversionFormat.length > 0 &&
                              conversionFormat.some(
                                (e: any) => e.fileName === file.fileName
                              )
                                ? conversionFormat
                                    .find(
                                      (e: any) => e.fileName === file.fileName
                                    )
                                    .conversionFormat.toUpperCase()
                                : "..."}
                              <span className="ml-2 [&>svg]:w-5 w-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </TEDropdownToggle>
                          </TERipple>

                          <TEDropdownMenu>
                            <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none">
                              <p>Choose File Type</p>
                              <div className="format-grid flex flex-wrap gap-3 mt-3">
                                {!!possibleFormat &&
                                  !!possibleFormat.image_formats &&
                                  !!possibleFormat.image_formats.length &&
                                  possibleFormat.image_formats.map(
                                    (format: string, index: number) =>
                                      format != file.fileExtension && (
                                        <button
                                          type="button"
                                          className="btn px-2 py-1 btn-custom"
                                          key={index}
                                          onClick={() =>
                                            handleChooseConversion(
                                              format,
                                              file.fileName
                                            )
                                          }
                                        >
                                          {format.toUpperCase()}
                                        </button>
                                      )
                                  )}
                              </div>
                            </TEDropdownItem>
                          </TEDropdownMenu>
                        </TEDropdown>
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

                <div className="flex justify-between items-center added-files">
                  <div className="p-3 flex items-center">
                    {isFileExtension ? (
                      <div className="flex items-center">
                        <p className="mb-0">
                          Convert All ({uploadedFileList.length} ) to:{" "}
                        </p>

                        <TEDropdown className="flex justify-center ms-2">
                          <TERipple rippleColor="light">
                            <TEDropdownToggle
                              className={`flex items-center whitespace-nowrap rounded px-3 pb-1 pt-1 border ${
                                isErrorShow ? "error-btn" : "small-btn"
                              }`}
                            >
                              {extensionName
                                ? extensionName.toUpperCase()
                                : "..."}
                              <span className="ml-2 [&>svg]:w-5 w-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </TEDropdownToggle>
                          </TERipple>

                          <TEDropdownMenu>
                            <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none">
                              <p>Choose file type</p>

                              <div className="format-grid flex flex-wrap gap-3 mt-2">
                                {!!possibleFormat &&
                                  !!possibleFormat.image_formats &&
                                  !!possibleFormat.image_formats.length &&
                                  possibleFormat.image_formats.map(
                                    (format: string, index: number) =>
                                      format !=
                                        uploadedFileList[0].fileExtension && (
                                        <button
                                          type="button"
                                          className="btn px-2 py-1 btn-custom"
                                          key={index}
                                          onClick={() =>
                                            handleSameFileExtensionConversion(
                                              format
                                            )
                                          }
                                        >
                                          {format.toUpperCase()}
                                        </button>
                                      )
                                  )}
                              </div>
                            </TEDropdownItem>
                          </TEDropdownMenu>
                        </TEDropdown>
                      </div>
                    ) : (
                      <p> Added {uploadedFileList.length} files</p>
                    )}
                  </div>
                  <div className="text-white flex items-center convert-btn">
                    Convert{" "}
                    <img
                      src="../../static/img/ic-right-arrow.svg"
                      className="ms-2"
                    />
                  </div>
                </div>
              </div>
              {/* UI after file upload ends */}
            </>
          ) : (
            <>
              {/* default File uploader */}
              <div className="dropzone-box flex justify-center items-center relative">
                <div className="text-center">
                  <div className="custom-import primary-btn">
                    <span className="label px-4 font-bold fs-18 text-nowrap flex items-center">
                      {" "}
                      <span>
                        <img
                          src="../../static/img/add-file.svg"
                          style={{ marginBottom: "4px" }}
                        />
                      </span>{" "}
                      Choose Files
                    </span>
                    <span className="label-file"></span>

                    <input
                      className="import-field"
                      type="file"
                      name="name"
                      multiple
                      onChange={(e: any) => handleFileUpload(e)}
                    />
                  </div>
                  <p className="mb-0 mt-2">Max. 10 files are allowed</p>
                </div>
              </div>
              {/* default File uploader ends */}
            </>
          )}

          {/* cards section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 card-box p-6 my-6 ">
            {/* card-1 */}
            <div className="text-center px-2 py-3 lg-py-0">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                stroke="#282f3a"
                stroke-width="1"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="css-i6dzq1 mx-auto"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              <h4 className="text-xl my-4">Convert Any File</h4>
              <p className="text-sm">
                FreeConvert supports more than 1500 file conversions. You can
                convert videos, images, audio files, or e-books. There are tons
                of Advanced Options to fine-tune your conversions.
              </p>
            </div>
            {/* card-2 */}
            <div className="text-center px-2 py-3 lg-py-0">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                stroke="#282f3a"
                stroke-width="1"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="css-i6dzq1 mx-auto"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
              <h4 className="text-xl my-4">Works Anywhere</h4>
              <p className="text-sm">
                FreeConvert supports more than 1500 file conversions. You can
                convert videos, images, audio files, or e-books. There are tons
                of Advanced Options to fine-tune your conversions.
              </p>
            </div>
            {/* card-3 */}
            <div className="text-center px-2 py-3 lg-py-0">
              <svg
                viewBox="0 0 24 24"
                width="36"
                height="36"
                stroke="#282f3a"
                stroke-width="1"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="css-i6dzq1 mx-auto"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <h4 className="text-xl my-4">Works Anywhere</h4>
              <p className="text-sm">
                FreeConvert supports more than 1500 file conversions. You can
                convert videos, images, audio files, or e-books. There are tons
                of Advanced Options to fine-tune your conversions.
              </p>
            </div>
          </div>
          {/* accordion */}
          <div className="card-box p-6 my-6">
            <div id="accordionExample">
              <div className="rounded-none border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 ">
                <h2 className="mb-0 " id="headingOne">
                  <button
                    className={`${
                      activeElement === "element1" &&
                      `bg-[#afd5d5]  dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)] `
                    } group relative flex w-full items-center rounded-sm  border-none bg-white px-5 py-4 text-left text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white text-xl `}
                    type="button"
                    onClick={() => handleClick("element1")}
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    How many colors should I choose?
                    <span
                      className={`${
                        activeElement === "element1"
                          ? `rotate-[-180deg] -mr-1`
                          : `rotate-0 fill-[#212529] dark:fill-white`
                      } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <TECollapse
                  show={activeElement === "element1"}
                  className="!mt-0 !rounded-b-none !shadow-none"
                >
                  <div className="px-5 py-4">
                    <strong>This is the first item's accordion body.</strong>{" "}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum eu rhoncus purus, vitae tincidunt nibh. Vivamus
                    elementum egestas ligula in varius. Proin ac erat pretium,
                    ultricies leo at, cursus ante. Pellentesque at odio euismod,
                    mattis urna ac, accumsan metus. Nam nisi leo, malesuada
                    vitae pretium et, laoreet at lorem. Curabitur non
                    sollicitudin neque.
                  </div>
                </TECollapse>
              </div>
            </div>
            <div className="rounded-none border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
              <h2 className="mb-0" id="headingTwo">
                <button
                  className={`${
                    activeElement === "element2" &&
                    `bg-[#afd5d5]  dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                  } group relative flex w-full items-center rounded-sm  border-none bg-white px-5 py-4 text-left text-xl text-neutral-800 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                  type="button"
                  onClick={() => handleClick("element2")}
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  How does the contrast checker work?
                  <span
                    className={`${
                      activeElement === "element2"
                        ? `rotate-[-180deg] -mr-1`
                        : `rotate-0 fill-[#212529] dark:fill-white`
                    } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </button>
              </h2>
              <TECollapse
                show={activeElement === "element2"}
                className="!mt-0 !rounded-b-none !shadow-none"
              >
                <div className="px-5 py-4">
                  <strong>This is the second item's accordion body.</strong>{" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum eu rhoncus purus, vitae tincidunt nibh. Vivamus
                  elementum egestas ligula in varius. Proin ac erat pretium,
                  ultricies leo at, cursus ante. Pellentesque at odio euismod,
                  mattis urna ac, accumsan metus. Nam nisi leo, malesuada vitae
                  pretium et, laoreet at lorem. Curabitur non sollicitudin
                  neque.
                </div>
              </TECollapse>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 h-36 lg:h-full mx-5"></div>
      </div>
    </>
  );
}

export default Home;
