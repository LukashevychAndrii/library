import React, { ReactElement } from "react";
import styles from "./Filter.module.scss";
import { useAppSelector } from "../../../../hooks/redux";

import { ReactComponent as ChevronDown } from "../../../../img/SVG/chevron-small-down.svg";
import { ReactComponent as TitleIcon } from "../../../../img/SVG/book1.svg";
import { ReactComponent as AuthorIcon } from "../../../../img/SVG/user.svg";
import { ReactComponent as CalendarIcon } from "../../../../img/SVG/calendar.svg";
import { ReactComponent as CountryIcon } from "../../../../img/SVG/country.svg";
import { ReactComponent as LanguageIcon } from "../../../../img/SVG/language.svg";
import { ReactComponent as PagesIcon } from "../../../../img/SVG/pages.svg";
import { useLocation, useNavigate } from "react-router-dom";
import useClickOutside from "../../../../hooks/useClickOutside";

interface currentFilterI {
  categorieImg: ReactElement;
  categorie: string;
}

const Filter = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [currentFilter, setCurrentFilter] =
    React.useState<currentFilterI | null>(null);
  const location = useLocation();
  const [hoverFilter, setHoverFilter] = React.useState(false);

  const [showPageCount, setShowPageCount] = React.useState(false);

  const [showYear, setShowYear] = React.useState(false);

  const [showFilter, setShowFilter] = React.useState(false);

  const navigate = useNavigate();

  const filterRef = React.useRef<HTMLDivElement>(null);
  const handleClickOutside = useClickOutside({ ref: filterRef });

  if (showFilter && handleClickOutside && !hoverFilter) {
    setShowFilter(false);
  }

  function setURLParams({ categorie }: { categorie: string }): void {
    const transformedCategorieName =
      categorie.charAt(0).toUpperCase() + categorie.slice(1);
    let categorieImg: ReactElement;

    switch (categorie) {
      case "title":
        categorieImg = <TitleIcon />;
        break;
      case "author":
        categorieImg = <AuthorIcon />;
        break;
      case "pages":
        categorieImg = <PagesIcon />;
        break;
      case "year":
        categorieImg = <CalendarIcon />;
        break;
      case "country":
        categorieImg = <CountryIcon />;
        break;
      case "language":
        categorieImg = <LanguageIcon />;
        break;
      default:
        return;
    }

    setCurrentFilter({
      categorie: transformedCategorieName,
      categorieImg: categorieImg,
    });

    const queryParams = new URLSearchParams();
    queryParams.set("categorie", categorie);
    navigate(`?${queryParams}`);
  }

  function setPagesExtraParameters({ extraParams }: { extraParams: string }) {
    const searchParams = new URLSearchParams(location.search);
    const categorie = searchParams.get("categorie");
    if (categorie !== "pages") {
      searchParams.set("categorie", "pages");
    }
    searchParams.set("comparison", extraParams);
    navigate(`?${searchParams}`);
  }
  const [selectedBookRadioBtn, setSelectedBookRadioBtn] = React.useState("");

  const isPageRadioSelected = (value: string): boolean =>
    value === selectedBookRadioBtn;

  const handlePageRadioClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedBookRadioBtn(e.currentTarget.value);
    setPagesExtraParameters({ extraParams: e.target.value });
  };

  function setYearExtraParameters({ extraParams }: { extraParams: string }) {
    const searchParams = new URLSearchParams(location.search);
    const categorie = searchParams.get("categorie");
    if (categorie !== "year") {
      searchParams.set("categorie", "year");
    }
    searchParams.set("comparison", extraParams);
    navigate(`?${searchParams}`);
  }
  const [selectedYearRadioBtn, setSelectedYearRadioBtn] =
    React.useState("earlier");

  const isYearRadioSelected = (value: string): boolean =>
    value === selectedYearRadioBtn;

  const handleYearRadioClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedYearRadioBtn(e.currentTarget.value);
    setYearExtraParameters({ extraParams: e.target.value });
  };
  return (
    <div
      onMouseEnter={() => {
        if (!("ontouchstart" in window)) {
          setShowFilter(true);
          setHoverFilter(true);
        }
      }}
      onMouseLeave={() => {
        if (!("ontouchstart" in window)) {
          setShowFilter(false);
          setHoverFilter(false);
        }
      }}
      ref={filterRef}
      theme-filter={theme}
      className={styles["filter"]}
    >
      <div
        onPointerDown={(e) => {
          if (!(e.pointerType === "mouse")) {
            setShowFilter(!showFilter);
          }
        }}
        className={styles["filter__icon"]}
      >
        {currentFilter ? (
          <div className={styles["filter__icon"]}>
            {currentFilter.categorieImg}
            <div>{currentFilter.categorie}</div>
          </div>
        ) : (
          <div>Set Filter</div>
        )}
        <ChevronDown className={styles["filter__chevron"]} />
      </div>

      <div
        className={`${styles["filter__options"]} ${
          showFilter && styles["filter__options__visible"]
        }`}
      >
        <div
          onClick={() => {
            setURLParams({ categorie: "title" });
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <TitleIcon className={styles["filter__img"]} />
          <div>Title</div>
        </div>
        <div
          onClick={() => {
            setURLParams({ categorie: "author" });
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <AuthorIcon className={styles["filter__img"]} />
          <div>Author</div>
        </div>

        <div
          onMouseEnter={() => {
            if (!("ontouchstart" in window)) {
              setShowPageCount(true);
            }
          }}
          onMouseLeave={() => {
            if (!("ontouchstart" in window)) {
              setShowPageCount(false);
            }
          }}
          onPointerDown={(e) => {
            if (!(e.pointerType === "mouse")) {
              setShowPageCount(!showPageCount);
            }
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <PagesIcon className={styles["filter__img"]} />
          <div>Page Count</div>
          <ChevronDown className={styles["filter__chevron"]} />
          <div
            className={`${styles["filter__page-count"]} ${
              showPageCount && styles["filter__page-count--visible"]
            }`}
          >
            <div className={styles["filter__page-count__options"]}>
              <form theme-filter={theme}>
                <div className={styles["filter__page-count__options__option"]}>
                  <input
                    type="radio"
                    name="page-count"
                    id="less"
                    value="less"
                    checked={isPageRadioSelected("less")}
                    onChange={(e) => {
                      handlePageRadioClick(e);
                    }}
                  />
                  <label htmlFor="less">
                    <div
                      className={
                        styles["filter__page-count__options__option__radio-btn"]
                      }
                    ></div>
                    <div
                      className={
                        styles[
                          "filter__page-count__options__option__radio-btn__text"
                        ]
                      }
                    >
                      Less than
                    </div>
                  </label>
                </div>
                <div className={styles["filter__page-count__options__option"]}>
                  <input
                    type="radio"
                    name="page-count"
                    id="more"
                    value="more"
                    checked={isPageRadioSelected("more")}
                    onChange={(e) => {
                      handlePageRadioClick(e);
                    }}
                  />
                  <label htmlFor="more">
                    <div
                      className={
                        styles["filter__page-count__options__option__radio-btn"]
                      }
                    ></div>
                    <div
                      className={
                        styles[
                          "filter__page-count__options__option__radio-btn__text"
                        ]
                      }
                    >
                      More than
                    </div>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div
          onPointerDown={(e) => {
            if (!(e.pointerType === "mouse")) {
              setShowYear(!showYear);
            }
          }}
          onMouseEnter={() => {
            if (!("ontouchstart" in window)) {
              setShowYear(true);
            }
          }}
          onMouseLeave={() => {
            if (!("ontouchstart" in window)) {
              setShowYear(false);
            }
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <CalendarIcon className={styles["filter__img"]} />
          <div>Year</div>
          <ChevronDown className={styles["filter__chevron"]} />
          <div
            className={`${styles["filter__year-count"]} ${
              showYear && styles["filter__year-count--visible"]
            }`}
          >
            <div className={styles["filter__year-count__options"]}>
              <form theme-filter={theme}>
                <div className={styles["filter__year-count__options__option"]}>
                  <input
                    type="radio"
                    name="year"
                    id="earlier"
                    value="earlier"
                    checked={isYearRadioSelected("earlier")}
                    onChange={(e) => {
                      handleYearRadioClick(e);
                    }}
                  />
                  <label htmlFor="earlier">
                    <div
                      className={
                        styles["filter__year-count__options__option__radio-btn"]
                      }
                    ></div>
                    <div
                      className={
                        styles[
                          "filter__year-count__options__option__radio-btn__text"
                        ]
                      }
                    >
                      Earlier than
                    </div>
                  </label>
                </div>
                <div className={styles["filter__year-count__options__option"]}>
                  <input
                    type="radio"
                    name="year"
                    id="later"
                    value="later"
                    checked={isYearRadioSelected("later")}
                    onChange={(e) => {
                      handleYearRadioClick(e);
                    }}
                  />
                  <label htmlFor="later">
                    <div
                      className={
                        styles["filter__year-count__options__option__radio-btn"]
                      }
                    ></div>
                    <div
                      className={
                        styles[
                          "filter__year-count__options__option__radio-btn__text"
                        ]
                      }
                    >
                      Later than
                    </div>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setURLParams({ categorie: "country" });
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <CountryIcon className={styles["filter__img"]} />
          <div>Country</div>
        </div>
        <div
          onClick={() => {
            setURLParams({ categorie: "language" });
          }}
          className={styles["filter__options__option"]}
          theme-filter-option={theme}
        >
          <LanguageIcon className={styles["filter__img"]} />
          <div>Language</div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
