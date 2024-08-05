import { Link } from "react-router-dom";
// import { TERipple } from "tw-elements-react";
import searchList from "../../utilities/searchData.json";
import { useState } from "react";
import { useTranslation } from "react-i18next";
interface SearchItem {
  id: number;
  searchName: string;
}
function Header(): JSX.Element {
  const languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "hi", lang: "Hindi" },
  ];
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [chooseSearchResult, setChooseSearchResult] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const { t } = useTranslation("navigation");

  const toggleDropdown = () => setIsOpen(!isOpen);

  // handle search functionality
  const handleInputChange = (event: string) => {
    const searchString = event.trim().toLowerCase();
    setChooseSearchResult(searchString);
    if (searchString.length > 0) {
      setShowSearchResults(true);
      searchData(searchString);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // set data in dropdown
  const searchData = (inputSearchString: string) => {
    const filterData: SearchItem[] = inputSearchString
      ? searchList.lists.filter((item: SearchItem) =>
          item.searchName.toLowerCase().includes(inputSearchString)
        )
      : [];
    setSearchResults(filterData);
  };
  const menuToggleHandler = () => {
    setIsExpanded(!isExpanded);
  };
  // select search results
  const handleSelectedSearchResult = (selectName: string) => {
    setChooseSearchResult(selectName);
    setSearchResults([]);
    setShowSearchResults(false);
  };
  // choose language
  const handleChooseLang = (lng: string) => {
    setIsOpen(!isOpen);
    i18n.changeLanguage(lng);
  };
  return (
    <header className="h-[60px]">
      <div className="navbar bg-white z-30">
        {/* Destop design */}
        <nav className="flex lg:container px-5 lg:px-10 mx-auto justify-between py-4">
          <div className="flex items-center xl:gap-56 gap-10">
            <Link className="text-xl lg:mx-20 font-semibold m-0" to="/">
              Logo
            </Link>
            <ul className="gap-10 items-center hidden lg:flex">
              <li className=""></li>
              <li>
                <Link to="/heif-jpg-converter">{t("nav.heifJpg")} </Link>
              </li>
              <li>
                <Link to="/heif-converter">{t("nav.heifConverter")} </Link>
              </li>
              <li>
                <Link to="/image-converter">{t("nav.imageConverter")}</Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
          <div className="search-bar-main relative hidden lg:block lg:ml-10">
            {/* Search Bar */}
            <div className="search-bar-view relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
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
                  searchResults.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="py-[12px] px-[24px]"
                      onClick={() =>
                        handleSelectedSearchResult(item.searchName)
                      }
                    >
                      <Link to="#" className="text-decoration-none">
                        {item.searchName}
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
          {/* Add dropdown for language translation */}
          <div className="relative px-4 flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <img
                className="h-6 w-6 rounded-full object-cover"
                src="../../static/img/ic-world.svg"
                alt="Language selector"
              />
              <span className="text-white font-semibold ml-0 hidden">Language</span>
            </div>

            {isOpen && (
              <div className="mt-4 absolute right-0 bg-gray-800 border border-gray-600 rounded-md w-48 -translate-x-[65px] translate-y-[75px]">
                {languages.map((lng: any, index: number) => (
                  <div
                    key={index}
                    className={`block text-gray-400 hover:text-white px-4 py-2 ${
                      lng.code === i18n.language ? "text-white" : ""
                    }`}
                    onClick={() => handleChooseLang(lng.code)}
                  >+
                    {lng.lang}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </nav>
      </div>
      {/* Mobile Design  */}
      <div
        className={`fixed bg-white top-0 bottom-0 left-0 right-0 z-40 px-5 pb-3 pt-0 ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between h-[60px] items-center">
          <Link
            className="text-xl mr-4 font-semibold"
            to="/"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Logo
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
              <Link to="/heif-jpg-converter"> {t("nav.heifJpg")}</Link>
            </li>
            <li onClick={() => setIsExpanded(!isExpanded)}>
              <Link to="/heif-converter">{t("nav.heifConverter")}</Link>
            </li>
            <li onClick={() => setIsExpanded(!isExpanded)}>
              <Link to="/image-converter">{t("nav.imageConverter")}</Link>
            </li>
          </ul>
        </div>

        <div className="search-bar-main relative lg:block mt-6">
          {/* Search Bar */}
          <div className="search-bar-view relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
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
                searchResults.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="py-[12px] px-[24px]"
                    onClick={() => handleSelectedSearchResult(item.searchName)}
                  >
                    <Link to="#" className="text-decoration-none">
                      {item.searchName}
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
