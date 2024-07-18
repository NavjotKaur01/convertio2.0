import { Link } from "react-router-dom";
// import { TERipple } from "tw-elements-react";
function Header(): JSX.Element {
  return (
    <header className="bg-white">
      <div className="navbar">
        <nav className="flex container px-10 mx-auto justify-between py-4">
          <ul className="flex gap-10 items-center">
            <li className="text-xl mr-4 font-semibold">logo</li>
            <li>Heif jpg</li>
            <li>Heif converter</li>
            <li>image converter</li>
          </ul>
          <div className="search-bar-main relative">
            {/* Search Bar */}
            <div className="search-bar-view relative">
              <input type="text" placeholder="Search" className="w-full" />
              {/* Cross svg */}
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
            </div>
            {/* Search Contents */}
            {/* <div className="w-full absolute bg-white site-search">
              <ul className="list-unstyled">
                <li>
                  <Link to="#" className="text-decoration-none">
                    lorem ispu makh
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-decoration-none">
                    lorem ispu makh
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-decoration-none">
                    lorem ispu makh
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
