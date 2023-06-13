import React from "react";
import styles from "./Footer.module.scss";
import { useAppSelector } from "../../hooks/redux";

import { ReactComponent as FaceBookIcon } from "../../img/SVG/facebook.svg";
import { ReactComponent as TwitterIcon } from "../../img/SVG/twitter.svg";
import { ReactComponent as InstargamIcon } from "../../img/SVG/instagram.svg";
import { ReactComponent as LinkedInIcon } from "../../img/SVG/linkedin2.svg";

const Footer = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <footer className={styles["footer"]} theme-footer={theme}>
      <div className={styles["footer__content-wrapper"]}>
        <div className={styles["footer__top-content"]}>
          <div className={styles["footer__about"]}>
            <h3 className={styles["footer__heading"]}>About</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad velit
              accusantium recusandae ullam itaque explicabo obcaecati quasi quam
              numquam, molestiae earum consequatur aspernatur nesciunt
              reprehenderit sapiente sit voluptates voluptatem corrupti, nisi a?
              Odit quasi, beatae vero veritatis iure consequatur. Ad sequi
              incidunt odit explicabo nihil perspiciatis eius atque fugiat
              harum?Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Praesentium, minus.
            </p>
          </div>
          <div className={styles["footer__categories"]}>
            <h3 className={styles["footer__heading"]}>Categories</h3>
            <ul
              theme-footer-list-item={theme}
              className={styles["footer__top-content__list"]}
            >
              <li>Category 1</li>
              <li>Category 2</li>
              <li>Category 3</li>
              <li>Category 4</li>
              <li>Category 5</li>
            </ul>
          </div>

          <div className={styles["footer__quick-links"]}>
            <h3 className={styles["footer__heading"]}>Quick Links</h3>
            <ul
              theme-footer-list-item={theme}
              className={styles["footer__top-content__list"]}
            >
              <li>Home</li>
              <li>About</li>
              <li>FAQ</li>
              <li>Get Started</li>
              <li>Videos</li>
            </ul>
          </div>
        </div>

        <div
          theme-footer-center-line={theme}
          className={styles["footer__center-line"]}
        ></div>
        <div className={styles["footer__bottom-content"]}>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing.</div>
          <ul className={styles["footer__bottom-content__links"]}>
            <li
              className={
                styles["footer__bottom-content__links__link--facebook"]
              }
            >
              <a href="#">
                <FaceBookIcon
                  theme-footer-icon={theme}
                  className={`${styles["footer__bottom-content__links__link"]}`}
                />
              </a>
            </li>
            <li
              className={styles["footer__bottom-content__links__link--twitter"]}
            >
              <a href="#">
                <TwitterIcon
                  theme-footer-icon={theme}
                  className={styles["footer__bottom-content__links__link"]}
                />
              </a>
            </li>
            <li
              className={
                styles["footer__bottom-content__links__link--instagram"]
              }
            >
              <a href="#">
                <InstargamIcon
                  theme-footer-icon={theme}
                  className={styles["footer__bottom-content__links__link"]}
                />
              </a>
            </li>
            <li
              className={
                styles["footer__bottom-content__links__link--linkedin"]
              }
            >
              <a href="#">
                <LinkedInIcon
                  theme-footer-icon={theme}
                  className={styles["footer__bottom-content__links__link"]}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
