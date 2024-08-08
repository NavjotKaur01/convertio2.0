const Footer = () => {
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <footer className="w-full">
        <div className="py-20 bg-black text-secondary text-center m-0">
          <div className="max-w-screen-xl px-4  pb-6 mx-auto sm:px-6 lg:px-8 lg:pt-20">
            <div className="grid grid-cols-1  md:gap-x-20  gap-y-5 md:grid-cols-3">
              <div>
                <div className="flex text-white transition  justify-start font-bold text-xl">
                  Logo
                </div>
                <p className="max-w-md  mt-6 leading-relaxed sm:max-w-xs sm:mx-0 text-left text-md font-medium text-white transition">
                  Copyright © 2020. LogoIpsum. All rights reserved.
                </p>
              </div>

              <div className="grid   gap-y-10 gap-x-24  md:gap-x-20 sm:col-span-2 sm:grid-cols-4 grid-cols-2">
                <div className="text-left">
                  <p className="text-lg font-bold text-white transition ">
                    Services
                  </p>

                  <nav className="mt-8">
                    <ul className="space-y-4 text-sm">
                      <li>
                        <a className="text-white transition" href="/">
                          Email Marketing
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Campaigns
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Branding
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Offline
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div className="text-left">
                  <p className="text-lg font-bold text-white transition">
                    About
                  </p>

                  <nav className="mt-8">
                    <ul className="space-y-4 text-sm">
                      <li>
                        <a className="text-white transition " href="/">
                          Our Story
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Benefits
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Teams
                        </a>
                      </li>

                      <li>
                        <a className="text-white transition" href="/">
                          Careers
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div className="!text-center md:text-left col-span-2 sm:col-span-2 flex sm:justify-end justify-center">
                  <div
                    className="bg-[--primary-color] w-14 h-14 rounded-full flex justify-center items-center"
                    onClick={() => handleScroll()}
                  >
                    <img
                      className=""
                      src="/static/img/happy-user/footer-icon.svg"
                      style={{}}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between flex-col md:flex-row text-left pt-6 md:mt-12 sm:mt-10 mt-0 gap-4">
              <div>
                <p className="mt-4 text-sm hover:text-white/75 sm:order-first sm:mt-0 font-normal">
                  Copyright &copy; 2020. LogoIpsum. All rights reserved.
                </p>
              </div>

              <div className="flex gap-5">
                <a className="inline-block  text-white" href="/">
                  Terms & Conditions
                </a>

                <a className="inline-block  text-white" href="/">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-24 border-t  border-gray-800"></div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
