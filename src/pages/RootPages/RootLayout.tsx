import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "../../components/Header/MainHeader";
import Alert from "../../components/Alert/Alert";
import { useAppSelector } from "../../hooks/redux";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";

const RootLayout = () => {
  const alert = useAppSelector((state) => state.alert.alertTitle);
  const pending = useAppSelector((state) => state.pending.pending);

  return (
    <>
      {pending && <LoadingBar />}
      {alert && <Alert />}
      <Navigation />
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
