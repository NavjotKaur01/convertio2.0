import {
  TEDropdown,
  TEDropdownToggle,
  TEDropdownMenu,
  TEDropdownItem,
  TERipple,
} from "tw-elements-react";

function Home(): JSX.Element {
  return (
    <>
      <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5">
        <div className="bg-gray-50"></div>
        <div className="lg:col-span-3  py-2 px-5">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold">File Converter</h1>
            <p className="text-sm pt-2">
              Easily convert files from one format to another, online.
            </p>
          </div>
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
                />
              </div>
            </div>

            <div>
              <div className="grid flex justify-between items-center file-list-main">
                <div className="flex items-center file-list-item">
                  <img src="../../static/img/picture.svg" className="me-1" />
                </div>
                <div className="file-list-item">447</div>
                <div className="file-list-item">
                  {/* <div className="dropdown btn-caret">
                    <button
                      className="btn btn-sm d-flex align-items-center small-btn"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <i className="bi bi-chevron-down ps-2"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-custom p-4 border-0 mt-2 custom-drop-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <p className="primary-text fs-16 mb-3">
                        Choose file type{" "}
                      </p>
                      <li>
                        <div className="format-grid d-flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-custom"
                          ></button>
                        </div>
                      </li>
                    </ul>
                  </div> */}
                  <TEDropdown className="flex justify-center">
                    <TERipple rippleColor="light">
                      <TEDropdownToggle className="flex items-center whitespace-nowrap rounded px-3 pb-1 pt-1 border small-btn">
                        ...
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
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PNG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            SVG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            JPEG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PSD
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            TIFF
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            BMP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            GIF
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            MAP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            WEBP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            RGB
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            HDR
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PDB
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            ICO
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            SGI
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            DDS
                          </button>
                        </div>
                      </TEDropdownItem>
                    </TEDropdownMenu>
                  </TEDropdown>
                </div>
                <div className="file-list-item">
                  <img src="../../static/img/close.svg" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center added-files">
              <div className="p-3 flex items-center">
                <div className="flex items-center">
                  <p className="mb-0">dummy</p>
                  <TEDropdown className="flex justify-center ms-2">
                    <TERipple rippleColor="light">
                      <TEDropdownToggle className="flex items-center whitespace-nowrap rounded px-3 pb-1 pt-1 border small-btn">
                        ...
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
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PNG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            SVG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            JPEG
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PSD
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            TIFF
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            BMP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            GIF
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            MAP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            WEBP
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            RGB
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            HDR
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            PDB
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            ICO
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            SGI
                          </button>
                          <button
                            type="button"
                            className="btn px-2 py-1 btn-custom"
                          >
                            DDS
                          </button>
                        </div>
                      </TEDropdownItem>
                    </TEDropdownMenu>
                  </TEDropdown>
                </div>
                {/* : (<span> files</span>) */}
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

          {/* default File uploader */}
          {/* <div className="dropzone-box flex justify-center items-center relative">
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
                />
              </div>
              <p className="mb-0 mt-2">Max. 10 files are allowed</p>
            </div>
          </div> */}
          {/* default File uploader ends */}

          {/* cards section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 card-box p-6 my-6 ">
            {/* card-1 */}
            <div className="text-center px-2">
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
            <div className="text-center px-2">
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
            {/* card-3 */}
            <div className="text-center px-2">
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
          </div>
        </div>

        <div className="bg-gray-50"></div>
      </div>
    </>
  );
}

export default Home;
