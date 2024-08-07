import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TECollapse } from "tw-elements-react";

const FAQ = () => {
  const { t } = useTranslation("faq");
  const [activeElement, setActiveElement] = useState<string>("");
  const faqList = t("faqList", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  // handle FAQ show and hide
  const handleClick = (value: string) => {
    if (value === activeElement) {
      setActiveElement("");
    } else {
      setActiveElement(value);
    }
  };

  return (
    <>
      <div className="card-box p-6 my-6 rounded-lg">
        {!!faqList &&
          !!faqList.length &&
          faqList.map((question: any, index: number) => (
            <div id={`accordionExample${index + 1}`} key={index}>
              <div className="rounded-none border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 ">
                <h2 className="mb-0 ">
                  <button
                    className={`${
                      activeElement === `question${index + 1}` &&
                      `bg-[#afd5d5]  dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)] font-semibold primary-text `
                    } group relative flex w-full items-center rounded-sm  border-none bg-white px-5 py-4 text-left transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white text-xl `}
                    type="button"
                    onClick={() => handleClick(`question${index + 1}`)}
                    aria-expanded="true"
                    aria-controls={`collapseOne${index + 1}`}
                  >
                    {question.question}
                    <span
                      className={`${
                        activeElement === `question${index + 1}`
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
                  show={activeElement === `question${index + 1}`}
                  className="!mt-0 !rounded-b-none !shadow-none"
                >
                  <div className="px-5 py-4 h-[auto]">{question.answer}</div>
                </TECollapse>
              </div>
            </div>
          ))}

        {/* <div className="rounded-none border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 ">
          <h2 className="mb-0" id="headingTwo">
            <button
              className={`${
                activeElement === "question2" &&
                `dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)] font-semibold primary-text`
              } group relative flex w-full items-center rounded-sm  border-none bg-white px-5 py-4 text-left text-xl transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
              type="button"
              onClick={() => handleClick("question2")}
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              How does the contrast checker work?
              <span
                className={`${
                  activeElement === "question2"
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
            show={activeElement === "question2"}
            className="!mt-0 !rounded-b-none !shadow-none"
          >
            <div className="px-5 py-4">
              <strong>This is the second item's accordion body.</strong> Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eu
              rhoncus purus, vitae tincidunt nibh. Vivamus elementum egestas
              ligula in varius. Proin ac erat pretium, ultricies leo at, cursus
              ante. Pellentesque at odio euismod, mattis urna ac, accumsan
              metus. Nam nisi leo, malesuada vitae pretium et, laoreet at lorem.
              Curabitur non sollicitudin neque.
            </div>
          </TECollapse>
        </div> */}
      </div>
    </>
  );
};

export default FAQ;
