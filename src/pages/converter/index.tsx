import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
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
import pageData from "../../utilities/pageData.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FAQ from "../../components/faq";
import {
  SelectConversionFormat,
  SelectExtensionName,
  SelectIsErrorShow,
  SelectIsFileExtension,
  SelectUploadedFile,
  SelectVerticalActive,
  uploadedFileActions,
} from "../../store/reducers/uploadedFileSlice";
import {
  filterFileType,
  isNotPossibleFormat,
} from "../../utilities/fileconverterFunction";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  convertedFileActions,
  SelectFileExtension,
} from "../../store/reducers/convertedFileSlice";
import { FileExtensions } from "../../models/convertedFileModel";
import { decryptData, encryptData } from "../../utilities/utils";
import { ConversionFormat, FileDetails } from "../../models/uploadedFileModal";

function ImageConverter(): JSX.Element {
  const pageHeading = decryptData("currentPage");
  const possibleFormat: FileExtensions = useAppSelector(SelectFileExtension);
  const dispatch = useAppDispatch();
  const FileId = decryptData("files");
  const [activeElement, setActiveElement] = useState<string>("section1");
  const uploadedFileList = useAppSelector(SelectUploadedFile);
  const conversionFormat = useAppSelector(SelectConversionFormat);
  const verticalActive: any = useAppSelector(SelectVerticalActive);
  const extensionName: any = useAppSelector(SelectExtensionName);
  const isFileExtension = useAppSelector(SelectIsFileExtension);
  const isErrorShow = useAppSelector(SelectIsErrorShow);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [queryObject, setQueryObject] = useState<string>("");
  const [filterFormattedList, setFilterFormattedList] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hoveredTab, setHoveredTab] = useState<any>(null);
  const [dataList, setDataList] = useState<any>({});
  const [pageTitle, setPageTitle] = useState<string>("");
  const { t } = useTranslation("imageConverter");
  const how = t("how", { returnObjects: true }) as Array<{
    id: number;
    line1: string;
  }>;
  const cards = t("cards", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;
  const formats = (t("formats") as unknown as string[]) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname;
  useEffect(() => {
    setDataList(pageData);

    if (Object.keys(dataList).includes(location.pathname)) {
      setPageTitle(dataList[location.pathname].title);
    } else {
      if (pageHeading) {
        const title = pageHeading?.format?.split("-");
        if (title.length > 0) {
          title[0] = title[0].toUpperCase();
          if (title.length > 1) {
            title[title.length - 1] = title[title.length - 1].toUpperCase();
          }
          setPageTitle(title.join(" "));
        }
      }
    }
  }, [dataList, pageTitle, location.pathname, pageHeading]);
  useEffect(() => {
    dispatch(uploadedFileActions.resetUploadFileState());
  }, [location.pathname]);
  useEffect(() => {
    if (searchResults.length) {
      let s = searchResults.find(
        (item: any) => item.fName === queryObject
      ).extensionList;
      setFilterFormattedList(s);
    }
  }, [searchResults]);

  // handle FAQ show and hide
  const handleClick = (value: string) => {
    if (value === activeElement) {
      setActiveElement("");
    } else {
      setActiveElement(value);
    }
  };

  const handleSearchPossibleFormat = (
    fileName: string,
    searchStr: string,
    fileType: keyof FileExtensions
  ) => {
    const searchString = searchStr.trim().toLowerCase();
    setQueryObject(fileName);
    setSearchQuery(searchString);
    const filteredData = filterFileType(
      fileName,
      searchString,
      fileType,
      possibleFormat,
      verticalActive
    );

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

  // handle multiple file uploading
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const UploadedFiles: any = Array.from(files);
    const totalFilesCount = uploadedFileList.length + UploadedFiles.length;
    if (totalFilesCount > 10) {
      event.preventDefault();
      setErrorMsg(`Cannot upload more than 10 files.`);
      return;
    }

    const payload = {
      UploadedFiles,
      possibleFormat,
      pageName,
      type: Object.keys(dataList).includes(location.pathname)
        ? "image"
        : pageHeading?.FileType,
      conversionType: Object.keys(dataList).includes(location.pathname)
        ? "jpg"
        : pageHeading?.format?.split("-")[2],
    };
    dispatch(uploadedFileActions.uploadFileListData(payload));
    setErrorMsg("");
  };

  // Handle choose conversion format
  const handleChooseConversion = (
    format: string,
    fileName: string,
    indexN?: number,
    isComman?: boolean,
    selectAllType?: boolean
  ) => {
    dispatch(
      uploadedFileActions.chooseConversionFormat({
        format,
        fileName,
        isComman,
        indexN,
        selectAllType,
      })
    );
    if (isComman) {
      handleSameFileExtensionConversion(format);
    }
    setFilterFormattedList([]);
    setSearchQuery("");
  };

  // Remove uploaded file
  const handleRemoveRow = (fileName: string, idx: number) => {
    dispatch(uploadedFileActions.removeFile({ fileName, idx }));
  };

  // handle same file extension conversion
  const handleSameFileExtensionConversion = (conversionExtension: string) => {
    dispatch(uploadedFileActions.updateConversionFormat(conversionExtension));
  };

  // Active and deactive tabs navigation
  const handleVerticalClick = (
    tabName: string,
    ObjectKeyName: string
    // keyName: string
  ) => {
    dispatch(
      uploadedFileActions.setVerticalActive({ [ObjectKeyName]: tabName })
    );
  };

  // handle convert file
  const handleConvert = async () => {
    encryptData("isClicked", true);
    if (uploadedFileList.length === 0) {
      setErrorMsg("No files uploaded.");
      return;
    }
    if (conversionFormat.length) {
      const formData = new FormData();
      uploadedFileList.forEach((fileObj: any, index: number) => {
        formData.append("files", fileObj.fileDetails);
        formData.append("formats", conversionFormat[index].conversionFormat);
      });
      if (FileId) {
        formData.append("id", FileId._id);
      }
      dispatch(convertedFileActions.FilesToConvert(formData));
      navigate(`${pageName}/download`);
    } else {
      dispatch(uploadedFileActions.setIsErrorShow());
    }
  };
  useEffect(() => {
    dispatch(convertedFileActions.resetConvertedState());
    dispatch(convertedFileActions.getFileExtension());
    dispatch(uploadedFileActions.resetUploadFileState());
  }, []);
  return (
    <>
      <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 mb-8 mt-24">
        <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
        <div className="lg:col-span-3 py-2 px-5">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">
              {t("pageTitle", { pageTitle })}
            </h1>
            <p className="text-sm pt-2">{t("description", { pageTitle })}</p>
          </div>
          {!!uploadedFileList && !!uploadedFileList.length ? (
            <>
              {/* UI after file upload */}
              <div className="mt-5 border rounded-lg">
                <div>
                  {uploadedFileList.map(
                    (file: FileDetails, FileIndex: number) => (
                      <div
                        className="flex md:grid flex-wrap justify-between items-center file-list-main rounded-lg border-none w-full custom-flex-nowrap-class"
                        key={FileIndex}
                      >
                        <div className="flex items-center justify-between file-list-item">
                          {/* <img
                          src="../../static/img/picture.svg"
                          className="me-1"
                        /> */}
                          <div className="text-ellipsis overflow-hidden w-[100px] whitespace-nowrap custom-width-60">
                            {file.fileName}
                          </div>
                          <div className="file-list-item">{file.size}</div>
                        </div>

                        {/* dropdown start */}

                        <div className="flex items-center justify-end">
                          <div className="file-list-item">
                            <TEDropdown className="flex justify-center">
                              <TERipple rippleColor="light">
                                <TEDropdownToggle
                                  className={`flex items-center whitespace-nowrap px-3 pb-1 pt-1 border rounded-lg w-20 ${
                                    isNotPossibleFormat(
                                      file.fileType,
                                      possibleFormat
                                    )
                                      ? "small-btn"
                                      : "error-btn"
                                  }`}
                                >
                                  {!!conversionFormat &&
                                  conversionFormat.length > 0 &&
                                  conversionFormat.some(
                                    (
                                      e: ConversionFormat,
                                      FormatIndex: number
                                    ) =>
                                      e.fileName === file.fileName &&
                                      FormatIndex === FileIndex
                                  )
                                    ? (() => {
                                        const conversionResult =
                                          conversionFormat
                                            .find(
                                              (
                                                e: ConversionFormat,
                                                FormatIndex: number
                                              ) =>
                                                e.fileName === file.fileName &&
                                                FormatIndex === FileIndex
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

                              <TEDropdownMenu
                                style={{
                                  transform: "translate3d(-120px, 31px, 0px)",
                                }}
                              >
                                <div className="p-2 custom-drop-menu border-0 mt-2 shadow-none`">
                                  {/* Search Bar */}
                                  <div className="dropdown-searchbar">
                                    <div className="search-bar-main relative">
                                      <div className="search-bar-view relative">
                                        <input
                                          type="text"
                                          placeholder="Search"
                                          className="w-full"
                                          onChange={(e: any) =>
                                            handleSearchPossibleFormat(
                                              file.fileName,
                                              e.target.value,
                                              file.fileType
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
                                          <circle
                                            cx="11"
                                            cy="11"
                                            r="8"
                                          ></circle>
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
                                                    file.fileName,
                                                    FileIndex
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
                                              file.fileType === key && (
                                                <React.Fragment key={index}>
                                                  <TETabs
                                                    vertical
                                                    className="tabs-heading file-tabs"
                                                  >
                                                    {Object.keys(formats).map(
                                                      (keyName, idx) => {
                                                        return (
                                                          <TETabsItem
                                                            className={`tab-item ${
                                                              verticalActive[
                                                                file.fileName
                                                              ] ===
                                                                `tab-${file.fileName}-1-${keyName}` ||
                                                              hoveredTab ===
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
                                                            onMouseEnter={() => {
                                                              setHoveredTab(
                                                                `tab-${file.fileName}-1-${keyName}`
                                                              );
                                                              handleVerticalClick(
                                                                `tab-${file.fileName}-1-${keyName}`,
                                                                file.fileName
                                                              );
                                                            }}
                                                            onMouseLeave={() =>
                                                              setHoveredTab(
                                                                null
                                                              )
                                                            }
                                                          >
                                                            {keyName}
                                                            {(verticalActive[
                                                              file.fileName
                                                            ] ===
                                                              `tab-${file.fileName}-1-${keyName}` ||
                                                              hoveredTab ===
                                                                `tab-${file.fileName}-1-${keyName}`) && (
                                                              <img
                                                                className="ms-2"
                                                                src="../../static/img/right-arrow.svg"
                                                                alt=""
                                                              />
                                                            )}
                                                          </TETabsItem>
                                                        );
                                                      }
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
                                                file.fileType === key &&
                                                Object.entries(formats).map(
                                                  (
                                                    [
                                                      keyName,
                                                      possibleFormats,
                                                    ]: [string, any],
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
                                                      {possibleFormats?.map(
                                                        (
                                                          fileExtension: any,
                                                          innerIdx: number
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
                                                                file.fileName,
                                                                FileIndex,
                                                                false,
                                                                false
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
                              onClick={() =>
                                handleRemoveRow(file.fileName, FileIndex)
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.5em"
                              height="1.5em"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#7987a1"
                              strokeWidth="2"
                              strokeLinejoin="round"
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

                        {/* close button end*/}
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-between  items-center added-files flex-wrap">
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

                  <div className="p-3 flex items-center conversion justify-center">
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
                                          uploadedFileList[0].fileType
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
                                                0,
                                                false,
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
                                          uploadedFileList[0].fileType ===
                                            key && (
                                            <React.Fragment key={index}>
                                              <TETabs
                                                vertical
                                                className="tabs-heading file-tabs"
                                              >
                                                {Object.keys(formats).map(
                                                  (keyName, idx) => (
                                                    <TETabsItem
                                                      className={`tab-item ${
                                                        verticalActive[
                                                          uploadedFileList[0]
                                                            .fileName
                                                        ] ===
                                                          `tab-${uploadedFileList[0].fileName}-1-${keyName}` ||
                                                        hoveredTab ===
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
                                                      onMouseEnter={() => {
                                                        setHoveredTab(
                                                          `tab-${uploadedFileList[0].fileName}-1-${keyName}`
                                                        );
                                                        handleVerticalClick(
                                                          `tab-${uploadedFileList[0].fileName}-1-${keyName}`,
                                                          uploadedFileList[0]
                                                            .fileName
                                                        );
                                                      }}
                                                      onMouseLeave={() =>
                                                        setHoveredTab(null)
                                                      }
                                                    >
                                                      {keyName}
                                                      {verticalActive[
                                                        uploadedFileList[0]
                                                          .fileName
                                                      ] ===
                                                        `tab-${uploadedFileList[0].fileName}-1-${keyName}` && (
                                                        <img
                                                          className="ms-2"
                                                          src="../../static/img/right-arrow.svg"
                                                          alt=""
                                                        />
                                                      )}
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
                                            uploadedFileList[0].fileType ===
                                              key &&
                                            Object.entries(formats).map(
                                              (
                                                [keyName, possibleFormats]: [
                                                  string,
                                                  any
                                                ],
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
                                                  {possibleFormats &&
                                                    possibleFormats.map(
                                                      (
                                                        fileExtension: any,
                                                        innerIdx: number
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
                    ) : errorMsg ? (
                      <p className="text-red-500">{errorMsg}</p>
                    ) : (
                      <p> Added {uploadedFileList.length} files</p>
                    )}
                  </div>
                  <div
                    className="text-xl font-bold text-white flex items-center convert-btn cursor-pointer rounded-lg"
                    onClick={() => handleConvert()}
                  >
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
                      {t("inputLabel")}
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
                  {!!uploadedFileList && uploadedFileList.length === 0 ? (
                    <p className="text-red-500">{errorMsg}</p>
                  ) : (
                    <p className="mb-0 mt-2 text-white ">
                      Max. 10 files are allowed
                    </p>
                  )}
                </div>
              </div>
              {/* default File uploader ends */}
            </>
          )}

          {/* how-to-convert-image */}
          <div className="card-box md:p-6 p-3 my-6 rounded-lg">
            <div className="mb-3">
              <h2 className="text-[23px] font-bold md:px-5 px-3 py-4">
                {t("howTitle", { pageTitle })}
              </h2>
              <ol className="text-base mt-1 list-decimal px-5 py-4 md:ml-10 ml-1">
                {!!how &&
                  !!how.length &&
                  how.map((item) => (
                    <li className="leading-8" key={item.id}>
                      <Trans
                        i18nKey={item.line1}
                        values={{ pageTitle }}
                        components={{ b: <b /> }}
                      />
                    </li>
                  ))}
              </ol>
            </div>
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 mt-10">
              {!!cards &&
                !!cards.length &&
                cards.map((card, idx) => (
                  <div key={idx} className="p-4">
                    <div>
                      <img
                        src={`/static/img/happy-user/${
                          idx === 0
                            ? "converto.png"
                            : idx === 1
                            ? "image-converter.png"
                            : "free&secure.png"
                        }`}
                        className="mx-auto h-[34px]"
                      />
                    </div>
                    <div className="md:px-5 px-3">
                      <h2 className="text-center mb-[16px] mt-5 text-[23px] font-bold min-h-[69px]">
                        {t(card.title, { pageTitle })}
                      </h2>
                      <p className="leading-relaxed text-base">
                        {t(card.description, { pageTitle })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card-box md:p-6 p-3 my-6 rounded-lg">
            <div>
              <div className="rounded-none border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 ">
                <h2 className="mb-0 " id="headingOne1">
                  <button
                    className={`${
                      activeElement === "section1" &&
                      `bg-[#afd5d5]  dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                    } group relative flex w-full items-center rounded-sm  border-none bg-white px-5 py-4 text-left font-bold text-[23px] transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white text-xl `}
                    type="button"
                    onClick={() => handleClick("section1")}
                    aria-expanded="true"
                    aria-controls="collapseOne1"
                  >
                    {t("formatTitle", { pageTitle })}
                    {/* <span
                      className={`${
                        activeElement === "section1"
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
                    </span> */}
                  </button>
                </h2>

                <div className="my-4">
                  <ul className="grid md:grid-cols-3 sm:grid-cols-2">
                    {!!formats &&
                      !!formats.length &&
                      formats.map((format: string, indx: number) => (
                        <li
                          key={indx}
                          className="text-[var(--primary-color)] text-base px-5 py-4"
                        >
                          <Link to="#">{format}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
                {/* </TECollapse> */}
                {/* <TECollapse
                  show={activeElement === "section1"}
                  className="!mt-0 !rounded-b-none !shadow-none"
                >
                  <div className="my-4">
                    <ul className="grid md:grid-cols-3 sm:grid-cols-2">
                      {!!formats &&
                        !!formats.length &&
                        formats.map((format: string, indx: number) => (
                          <li
                            key={indx}
                            className="text-[var(--primary-color)] text-base px-5 py-4"
                          >
                            <Link to="#">{format}</Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </TECollapse> */}
              </div>
            </div>
          </div>
          <FAQ />

          {/*review-section*/}
        </div>

        <div className="bg-gray-50 h-36 lg:h-full mx-5 rounded-lg"></div>
      </div>
    </>
  );
}

export default ImageConverter;
