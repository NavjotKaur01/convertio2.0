import React, { useEffect, useState } from "react";
import {
  TEDropdown,
  TEDropdownToggle,
  TEDropdownMenu,
  TEDropdownItem,
  TERipple,
  TETabs,
  TETabsContent,
  TETabsItem,
  TETabsPane,
} from "tw-elements-react";
import axios from "axios";
import possibleFormat from "../../utilities/possibleFileFormat.json";

interface FileDetails {
  fileName: string;
  size: string;
  fileExtension: string;
}

interface ConversionFormat {
  fileName: string;
  conversionFormat: string;
}

function ImageConverter(): JSX.Element {
  const [uploadedFileList, setUploadedFileList] = useState<FileDetails[]>([]);
  const [conversionFormat, setConversionFormat] = useState<ConversionFormat[]>(
    []
  );
  const [extensionName, setExtensionName] = useState<string>("");
  const [isFileExtension, setIsFileExtension] = useState<boolean>(false);
  const [isErrorShow, setIsErrorShow] = useState<boolean>(false);
  const [verticalActive, setVerticalActive] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [jsonFileData, setJsonFileData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [queryObject, setQueryObject] = useState<string>("");
  const [filterFormattedList, setFilterFormattedList] = useState<string[]>([]);

  useEffect(() => {
    if (Object.keys(possibleFormat).length) {
      setJsonFileData(possibleFormat);
    }
  }, []);

  useEffect(() => {
    if (searchResults.length) {
      let s = searchResults.find(
        (item: any) => item.fName === queryObject
      ).extensionList;
      setFilterFormattedList(s);
    }
  }, [searchResults]);

  //UseEffect for uploadedFileList
  useEffect(() => {
    if (uploadedFileList.length) {
      const fileExtensions = uploadedFileList.map(
        (file: FileDetails) => file.fileExtension
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
          (file: ConversionFormat | undefined) => file?.conversionFormat || ""
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

  // Set default active tab IDs for each file extension
  useEffect(() => {
    if (uploadedFileList.length > 0 && possibleFormat) {
      const initialActiveState: { [fileName: string]: string } = {};
      uploadedFileList.forEach((file) => {
        if (possibleFormat.hasOwnProperty(file.fileExtension)) {
          initialActiveState[file.fileName] = `tab-${file.fileName}-1-images`;
        }
      });
      setVerticalActive(initialActiveState);
    }
  }, [uploadedFileList, possibleFormat]);

  const handleSearchPossibleFormat = (
    fileName: string,
    searchStr: string,
    extension: string
  ) => {
    const searchString = searchStr.trim().toLowerCase();
    setQueryObject(fileName);
    setSearchQuery(searchString);
    const filteredData = filterFileType(extension, fileName, searchString);

    const updateSearchResults = (fileName: string, filteredData: string[]) => {
      setSearchResults((prevState) => {
        const existingEntryIndex = prevState.findIndex(
          (entry) => entry.fName === fileName
        );

        if (existingEntryIndex !== -1) {
          prevState[existingEntryIndex].extensionList = filteredData;
          return [...prevState];
        } else {
          return [
            ...prevState,
            { fName: fileName, extensionList: filteredData },
          ];
        }
      });
    };

    if (filteredData) {
      updateSearchResults(fileName, filteredData);
    }
  };

  function filterFileType(
    fileType: string,
    fileName: string,
    searchStr: string
  ) {
    if (
      possibleFormat.hasOwnProperty(fileType) &&
      Object.keys(verticalActive).includes(fileName) &&
      searchStr
    ) {
      const activeTabId = verticalActive[fileName];
      const lastIndex = activeTabId.lastIndexOf("-");
      let filterData = [];
      if (lastIndex !== -1) {
        const lastWord = activeTabId.substring(lastIndex + 1);
        const activeTabData = jsonFileData[fileType][lastWord];
        if (activeTabData.length) {
          filterData = activeTabData.filter((item: string) =>
            item.toLowerCase().includes(searchStr)
          );
        }
      }
      return filterData;
    } else {
      return [];
    }
  }

  // handle multiple file uploading
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    if (Array.from(files).length > 10 || uploadedFileList.length > 9) {
      event.preventDefault();
      console.log(`Cannot upload files more than 10`);
      return;
    }

    const fd = new FormData();
    const updatedFiles: FileDetails[] = [];
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]?.name;
      const fileExtension = fileName?.split(".").pop()?.toLowerCase();
      if (!fileExtension) {
        console.log(`File extension is undefined for file: ${fileName}`);
        continue;
      }

      updatedFiles.push({
        fileName: files[i].name,
        size: formatBytes(files[i].size),
        fileExtension: fileExtension,
      });

      fd.append(`file${i + 1}`, files[i]);
    }
    setUploadedFileList((prevState) => [...prevState, ...updatedFiles]);
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
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Handle choose conversion format
  const handleChooseConversion = (
    format: string,
    fileName: string,
    isComman?: boolean
  ) => {
    let fileIndex = conversionFormat.findIndex(
      (item: ConversionFormat) => item.fileName === fileName
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
    if (isComman) {
      handleSameFileExtensionConversion(format);
    }
    setExtensionName(format);
    setFilterFormattedList([]);
    setSearchQuery("");

    setIsErrorShow(true);
  };

  // Remove uploaded file
  const handleRemoveRow = (fileName: string) => {
    const updatedDetails = uploadedFileList.filter(
      (file: FileDetails) => file.fileName !== fileName
    );
    const updatedConversionFormatted = conversionFormat.filter(
      (conversion: ConversionFormat) => conversion.fileName !== fileName
    );
    setConversionFormat(updatedConversionFormatted);
    setUploadedFileList(updatedDetails);
  };

  // handle same file extension conversion
  const handleSameFileExtensionConversion = (conversionExtension: string) => {
    setExtensionName(conversionExtension);
    setIsErrorShow(false);
    if (conversionFormat.length === 0) {
      const newConversionFormat = uploadedFileList.map(
        (uploadedFile: FileDetails) => ({
          conversionFormat: conversionExtension,
          fileName: uploadedFile.fileName,
        })
      );
      setConversionFormat(newConversionFormat);
    } else {
      const updatedConversionFormat = uploadedFileList.map(
        (uploadedFile: FileDetails) => {
          const existingFormat = conversionFormat.find(
            (format: ConversionFormat) => {
              format.fileName === uploadedFile.fileName;
            }
          );
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

  // Uploaded file is not converted to another format
  const isNotPossibleFormat = (fileExtension: string): boolean => {
    return Object.keys(possibleFormat).includes(fileExtension);
  };

  // Active and deactive tabs navigation
  const handleVerticalClick = (
    tabName: string,
    ObjectKeyName: string
    // keyName: string
  ) => {
    const updatedState = { ...verticalActive };
    updatedState[ObjectKeyName] = tabName;
    setVerticalActive(updatedState);
  };

  return (
    <>
      <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
        <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
        <div className="lg:col-span-3 py-2 px-5">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">Image Converter</h1>
            <p className="text-sm pt-2">Convert images online, for free.</p>
          </div>
          {!!uploadedFileList && !!uploadedFileList.length ? (
            <>
              {/* UI after file upload */}
              <div className="mt-5 border rounded-lg">
                <div>
                  {uploadedFileList.map((file: FileDetails, index: number) => (
                    <div
                      className="flex md:grid flex-wrap justify-between items-center file-list-main rounded-lg border-none"
                      key={index}
                    >
                      <div className="flex items-center file-list-item">
                        {/* <img
                          src="../../static/img/picture.svg"
                          className="me-1"
                        /> */}
                        <div className="">{file.fileName}</div>
                      </div>

                      <div className="file-list-item">{file.size}</div>
                      {/* dropdown start */}
                      <div className="file-list-item">
                        <TEDropdown className="flex justify-center">
                          <TERipple rippleColor="light">
                            <TEDropdownToggle
                              className={`flex items-center whitespace-nowrap px-3 pb-1 pt-1 border rounded-lg w-20 ${
                                isNotPossibleFormat(file.fileExtension)
                                  ? "small-btn"
                                  : "error-btn"
                              }`}
                            >
                              {!!conversionFormat &&
                              conversionFormat.length > 0 &&
                              conversionFormat.some(
                                (e: ConversionFormat) =>
                                  e.fileName === file.fileName
                              )
                                ? (() => {
                                    const conversionResult =
                                      conversionFormat
                                        .find(
                                          (e: ConversionFormat) =>
                                            e.fileName === file.fileName
                                        )
                                        ?.conversionFormat.toUpperCase() ??
                                      "select";
                                    const length = conversionResult?.length;
                                    const space =
                                      length > 1
                                        ? "\u00A0".repeat(6 - length)
                                        : "";
                                    return (
                                      <span>
                                        {conversionResult}
                                        {space}
                                      </span>
                                    );
                                  })()
                                : "select"}
                              <span className="ml-2 [&>svg]:w-5 w-2 absolute right-4">
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
                            <div className="p-2 custom-drop-menu border-0 mt-2 shadow-none`">
                              {/* Search Bar */}
                              <div className="dropdown-searchbar">
                                <div className="search-bar-main relative">
                                  <div className="search-bar-view relative">
                                    <input
                                      type="text"
                                      placeholder="Search"
                                      className="w-full"
                                      // value={
                                      //   queryObject === file.fileName
                                      //     ? searchQuery
                                      //     : ""
                                      // }
                                      onChange={(e: any) =>
                                        handleSearchPossibleFormat(
                                          file.fileName,
                                          e.target.value,
                                          file.fileExtension
                                        )
                                      }
                                    />

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1.5em"
                                      height="1.5em"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      className="cursor-pointer"
                                    >
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                      ></line>
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start">
                                {searchQuery &&
                                queryObject === file.fileName ? (
                                  <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none`">
                                    {!!filterFormattedList &&
                                      !!filterFormattedList.length &&
                                      filterFormattedList.map(
                                        (item: any, idx: number) => (
                                          <button
                                            key={`${idx}`}
                                            type="button"
                                            className={`btn px-3 py-1 btn-custom mx-1 my-1`}
                                            onClick={() =>
                                              handleChooseConversion(
                                                item,
                                                file.fileName
                                              )
                                            }
                                          >
                                            {item.toUpperCase()}
                                          </button>
                                        )
                                      )}
                                  </TEDropdownItem>
                                ) : (
                                  <>
                                    {/* tabs */}
                                    <TEDropdownItem preventCloseOnClick>
                                      {Object.entries(possibleFormat).map(
                                        ([key, formats], index) =>
                                          file.fileExtension === key && (
                                            <React.Fragment key={index}>
                                              <TETabs
                                                vertical
                                                className="tabs-heading"
                                              >
                                                {Object.keys(formats).map(
                                                  (keyName, idx) => (
                                                    <TETabsItem
                                                      className={`${
                                                        verticalActive[
                                                          file.fileName
                                                        ] ===
                                                        `tab-${file.fileName}-1-${keyName}`
                                                          ? "primary-active"
                                                          : ""
                                                      }`}
                                                      key={idx}
                                                      onClick={() =>
                                                        handleVerticalClick(
                                                          `tab-${file.fileName}-1-${keyName}`,
                                                          file.fileName
                                                        )
                                                      }
                                                      active={
                                                        verticalActive ===
                                                        `tab-${file.fileName}-1-${keyName}`
                                                      }
                                                    >
                                                      {keyName}
                                                    </TETabsItem>
                                                  )
                                                )}
                                              </TETabs>
                                            </React.Fragment>
                                          )
                                      )}
                                    </TEDropdownItem>

                                    <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none`">
                                      <TETabsContent>
                                        {Object.entries(possibleFormat).map(
                                          ([key, formats], index) =>
                                            file.fileExtension === key &&
                                            Object.entries(formats).map(
                                              (
                                                [keyName, possibleFormats],
                                                idx
                                              ) => (
                                                <TETabsPane
                                                  className="grid grid-cols-12"
                                                  key={`${idx}`}
                                                  show={
                                                    verticalActive[
                                                      file.fileName
                                                    ] ===
                                                    `tab-${file.fileName}-1-${keyName}`
                                                  }
                                                >
                                                  {possibleFormats.map(
                                                    (
                                                      fileExtension,
                                                      innerIdx
                                                    ) => (
                                                      <button
                                                        key={`${index}-${idx}-${innerIdx}`}
                                                        type="button"
                                                        className={`btn px-1 text-center py-1 mx-1 my-1 col-span-4 ${
                                                          conversionFormat.find(
                                                            (items: any) =>
                                                              items.fileName ===
                                                              file.fileName
                                                          )
                                                            ?.conversionFormat ===
                                                          fileExtension
                                                            ? "btn-custom-selected"
                                                            : "btn-custom"
                                                        }`}
                                                        onClick={() =>
                                                          handleChooseConversion(
                                                            fileExtension,
                                                            file.fileName
                                                          )
                                                        }
                                                      >
                                                        {fileExtension.toUpperCase()}
                                                      </button>
                                                    )
                                                  )}
                                                </TETabsPane>
                                              )
                                            )
                                        )}
                                      </TETabsContent>
                                    </TEDropdownItem>
                                    {/* tabs end */}
                                  </>
                                )}
                              </div>
                            </div>
                          </TEDropdownMenu>
                        </TEDropdown>
                      </div>
                      {/* dropdown end*/}
                      {/* close button */}
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
                      {/* close button end*/}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center added-files flex-wrap">
                  <div className="add-more-btn flex">
                    <div className="custom-import border-2 px-1 py-1 primary-border rounded-lg ms-3 ">
                      <span className="label px-4 text-nowrap flex items-center text-sm font-semibold primary-text ">
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

                  <div className="p-3 flex items-center conversion">
                    {isFileExtension ? (
                      <div className="flex items-center justify-between conversion-inside">
                        <p className="mb-0">
                          Convert All ({uploadedFileList.length} ) to:{" "}
                        </p>

                        <TEDropdown className="flex justify-center ms-2">
                          <TERipple rippleColor="light">
                            <TEDropdownToggle
                              className={`flex items-center whitespace-nowrap rounded-lg px-3 pb-1 pt-1 border w-20 ${
                                isErrorShow ? "error-btn" : "small-btn"
                              }`}
                            >
                              {extensionName
                                ? extensionName.toUpperCase()
                                : "select"}
                              <span className="ml-2 [&>svg]:w-5 w-2 absolute right-4">
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
                            <div className="p-2 custom-drop-menu border-0 mt-2 shadow-none`">
                              {/* Search Bar */}
                              <div className="dropdown-searchbar">
                                <div className="search-bar-main relative">
                                  <div className="search-bar-view relative">
                                    <input
                                      type="text"
                                      placeholder="Search"
                                      className="w-full"
                                      value={
                                        queryObject ===
                                        uploadedFileList[0].fileName
                                          ? searchQuery
                                          : ""
                                      }
                                      onChange={(e: any) =>
                                        handleSearchPossibleFormat(
                                          uploadedFileList[0].fileName,
                                          e.target.value,
                                          uploadedFileList[0].fileExtension
                                        )
                                      }
                                    />

                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1.5em"
                                      height="1.5em"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      className="cursor-pointer"
                                    >
                                      <circle cx="11" cy="11" r="8"></circle>
                                      <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                      ></line>
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start">
                                {searchQuery &&
                                queryObject === uploadedFileList[0].fileName ? (
                                  <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none`">
                                    {!!filterFormattedList &&
                                      !!filterFormattedList.length &&
                                      filterFormattedList.map(
                                        (item: any, idx: number) => (
                                          <button
                                            key={`${idx}`}
                                            type="button"
                                            className="btn px-3 py-1 btn-custom mx-1 my-1"
                                            onClick={() =>
                                              handleChooseConversion(
                                                item,
                                                uploadedFileList[0].fileName,
                                                true
                                              )
                                            }
                                          >
                                            {item.toUpperCase()}
                                          </button>
                                        )
                                      )}
                                  </TEDropdownItem>
                                ) : (
                                  <>
                                    {/* tabs */}
                                    <TEDropdownItem preventCloseOnClick>
                                      {Object.entries(possibleFormat).map(
                                        ([key, formats], index) =>
                                          uploadedFileList[0].fileExtension ===
                                            key && (
                                            <React.Fragment key={index}>
                                              <TETabs
                                                vertical
                                                className="tabs-heading"
                                              >
                                                {Object.keys(formats).map(
                                                  (keyName, idx) => (
                                                    <TETabsItem
                                                      className={`${
                                                        verticalActive[
                                                          uploadedFileList[0]
                                                            .fileName
                                                        ] ===
                                                        `tab-${uploadedFileList[0].fileName}-1-${keyName}`
                                                          ? "primary-active"
                                                          : ""
                                                      }`}
                                                      key={idx}
                                                      onClick={() =>
                                                        handleVerticalClick(
                                                          `tab-${uploadedFileList[0].fileName}-1-${keyName}`,
                                                          uploadedFileList[0]
                                                            .fileName
                                                        )
                                                      }
                                                      active={
                                                        verticalActive ===
                                                        `tab-${uploadedFileList[0].fileName}-1-${keyName}`
                                                      }
                                                    >
                                                      {keyName}
                                                    </TETabsItem>
                                                  )
                                                )}
                                              </TETabs>
                                            </React.Fragment>
                                          )
                                      )}
                                    </TEDropdownItem>

                                    <TEDropdownItem className="p-4 custom-drop-menu border-0 mt-2 shadow-none`">
                                      <TETabsContent>
                                        {Object.entries(possibleFormat).map(
                                          ([key, formats], index) =>
                                            uploadedFileList[0]
                                              .fileExtension === key &&
                                            Object.entries(formats).map(
                                              (
                                                [keyName, possibleFormats],
                                                idx
                                              ) => (
                                                <TETabsPane
                                                  className="grid grid-cols-12"
                                                  key={`${idx}`}
                                                  show={
                                                    verticalActive[
                                                      uploadedFileList[0]
                                                        .fileName
                                                    ] ===
                                                    `tab-${uploadedFileList[0].fileName}-1-${keyName}`
                                                  }
                                                >
                                                  {possibleFormats.map(
                                                    (
                                                      fileExtension,
                                                      innerIdx
                                                    ) => (
                                                      <button
                                                        key={`${index}-${idx}-${innerIdx}`}
                                                        type="button"
                                                        className="btn px-1 text-center py-1 btn-custom mx-1 my-1 col-span-4"
                                                        onClick={() =>
                                                          handleSameFileExtensionConversion(
                                                            fileExtension
                                                          )
                                                        }
                                                      >
                                                        {fileExtension.toUpperCase()}
                                                      </button>
                                                    )
                                                  )}
                                                </TETabsPane>
                                              )
                                            )
                                        )}
                                      </TETabsContent>
                                    </TEDropdownItem>
                                    {/* tabs end */}
                                  </>
                                )}
                              </div>
                            </div>
                            <></>
                          </TEDropdownMenu>
                        </TEDropdown>
                      </div>
                    ) : (
                      <p> Added {uploadedFileList.length} files</p>
                    )}
                  </div>
                  <div className="text-xl font-bold text-white flex items-center convert-btn cursor-pointer rounded-lg">
                    Convert
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
              <div className="dropzone-box flex justify-center items-center relative rounded-lg">
                <div className="text-center">
                  <div className="custom-import primary-btn rounded-lg">
                    <span className="label px-4 font-bold fs-18 text-nowrap flex items-center ">
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
                      className="import-field "
                      type="file"
                      name="name"
                      multiple
                      onChange={(e: any) => handleFileUpload(e)}
                    />
                  </div>
                  <p className="mb-0 mt-2 text-white ">
                    Max. 10 files are allowed
                  </p>
                </div>
              </div>
              {/* default File uploader ends */}
            </>
          )}
        </div>

        <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
      </div>
    </>
  );
}

export default ImageConverter;
