import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "../../components/Header/MainHeader";
import Alert from "../../components/Alert/Alert";
import { useAppSelector } from "../../hooks/redux";

const RootLayout = () => {
  const alert = useAppSelector(state=>state.alert.alertTitle)
  return (
    <>
    {alert&&<Alert/>}
      <MainHeader />
      <main >
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
