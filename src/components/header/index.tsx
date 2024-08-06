import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchActions,
  selectAllConversion,
} from "../../store/reducers/searchSlice";
import { AllConversion } from "../../models/searchModel";

function Header(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allConversions = useAppSelector(selectAllConversion);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<AllConversion[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [chooseSearchResult, setChooseSearchResult] = useState<string>("");

  // handle search functionality
  const handleInputChange = (event: string) => {
    const searchString = event.trim().toLowerCase();
    setChooseSearchResult(searchString);
    if (searchString.length > 0) {
      setShowSearchResults(true);
      const filterData: AllConversion[] =
        searchString && allConversions
          ? allConversions.filter((item: AllConversion) =>
              item.format.toLowerCase().includes(searchString)
            )
          : [];
      setSearchResults(filterData);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };
  const menuToggleHandler = () => {
    setIsExpanded(!isExpanded);
  };
  const handleSelectedSearchResult = (item: AllConversion) => {
    dispatch(searchActions.handleSelectedPage(item));
    navigate(item.format);
    setShowSearchResults(false);
    setChooseSearchResult("");
  };
  useEffect(() => {
    dispatch(searchActions.allConversion());
  }, []);
  return (
    <header>
      <div className="navbar bg-white z-30">
        {/* Destop design */}
        <nav className="flex lg:container px-5 lg:px-10 mx-auto justify-between py-4">
          <div className="flex items-center xl:gap-72 gap-10">
            <Link className="text-xl lg:mx-24 font-semibold" to="/">
              logo
            </Link>
            <ul className="gap-10 items-center hidden lg:flex">
              <li className=""></li>
              <li>
                <Link to="/heif-jpg-converter">Heif JPG </Link>
              </li>
              <li>
                <Link to="/heif-converter">Heif Converter </Link>
              </li>
              <li>
                <Link to="/image-converter">Image Converter</Link>
              </li>
              <li onClick={() => navigate("downlaod")}>Download</li>
            </ul>
          </div>
          <div className="search-bar-main relative hidden lg:block lg:ml-10">
            {/* Search Bar */}
            <div className="search-bar-view relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full"
                value={chooseSearchResult}
                onChange={(e: any) => handleInputChange(e.target.value)}
              />
              {/* Cross svg */}
              {chooseSearchResult ||
              (searchResults && searchResults.length > 0) ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    setChooseSearchResult("");
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="cursor-pointer"
                >
                  <path
                    d="M7 7L17 17M7 17L17 7"
                    stroke="#7F7F7F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
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
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              )}
            </div>

            {/* Search Contents */}
            <div className="w-full absolute mt-2">
              <ul
                className={`list-unstyled bg-white site-search p-2 ${
                  showSearchResults ? "block" : "hidden"
                }`}
              >
                {!!searchResults && !!searchResults.length ? (
                  searchResults.map((item: AllConversion, index: number) => (
                    <li
                      key={index}
                      className="py-[12px] px-[24px]"
                      onClick={() => handleSelectedSearchResult(item)}
                    >
                      <Link to="#" className="text-decoration-none">
                        {item.format}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>No Search Results</li>
                )}
              </ul>
            </div>
          </div>
          <div className="my-auto lg:hidden block">
            <img
              src="../../static/img/menu-btn.svg"
              alt="menu-icon"
              onClick={() => menuToggleHandler()}
            />
          </div>
        </nav>
      </div>
      {/* Mobile Design  */}
      <div
        className={`fixed bg-white top-0 bottom-0 left-0 right-0 z-40 px-5 py-3 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between">
          <Link
            className="text-xl mr-4 font-semibold"
            to="/"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            logo
          </Link>
          <img
            src="../../static/img/close.svg"
            alt="close Icons"
            onClick={() => menuToggleHandler()}
          />
        </div>
        <div className="">
          <ul className="gap-10 flex-col flex">
            <li className=""></li>
            <li onClick={() => setIsExpanded(!isExpanded)}>
              <Link to="/heif-jpg-converter">Heif JPG </Link>
            </li>
            <li onClick={() => setIsExpanded(!isExpanded)}>
              <Link to="/heif-converter">Heif Converter </Link>
            </li>
            <li onClick={() => setIsExpanded(!isExpanded)}>
              <Link to="/image-converter">Image Converter</Link>
            </li>
          </ul>
        </div>

        <div className="search-bar-main relative lg:block mt-6">
          {/* Search Bar */}
          <div className="search-bar-view relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full"
              value={chooseSearchResult}
              onChange={(e: any) => handleInputChange(e.target.value)}
            />
            {/* Cross svg */}
            {chooseSearchResult ||
            (searchResults && searchResults.length > 0) ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  setChooseSearchResult("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
              >
                <path
                  d="M7 7L17 17M7 17L17 7"
                  stroke="#7F7F7F"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </div>

          {/* Search Contents */}
          <div className="w-full absolute mt-2">
            <ul
              className={`list-unstyled bg-white site-search p-2 ${
                showSearchResults ? "block" : "hidden"
              }`}
            >
              {!!searchResults && !!searchResults.length ? (
                searchResults.map((item: AllConversion, index: number) => (
                  <li
                    key={index}
                    className="py-[12px] px-[24px]"
                    onClick={() => handleSelectedSearchResult(item)}
                  >
                    <Link to="#" className="text-decoration-none">
                      {item.format}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No Search Results</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
