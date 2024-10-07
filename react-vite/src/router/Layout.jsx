import './Layout.css';
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBar from "../components/SideBar/SideBar";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // const shouldShowNav = !hideNavPaths.includes(location.pathname);
  // console.log(location.pathname);

  return (
    <>
      <ModalProvider>
        <div className='layout'>
          <Navigation />
          <div className='content-container'>
            <SideBar />
            {isLoaded && <Outlet />}
            <Modal />
          </div>
        </div>
      </ModalProvider>
    </>
  );
}
