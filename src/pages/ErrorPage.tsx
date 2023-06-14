import React from "react";
import Error from "../components/Error/Error";
import MainHeader from "../components/Header/MainHeader";
import Footer from "../components/Footer/Footer";

const ErrorPage = () => {
  return (
    <>
      <MainHeader />
      <Error />
      <Footer />
    </>
  );
};

export default ErrorPage;
