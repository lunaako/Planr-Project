import './Layout.css';
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBar from "../components/SideBar/SideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <>
      <ModalProvider>
        <div className='layout'>
          <Navigation />

          <div className='content-container'>

            {sessionUser && (
              <>
                <div className={`side-bar ${isSidebarVisible ? '' : 'hidden'}`}>
                  <SideBar />
                </div>

                <div onClick={toggleSidebar} className={`toggle-sidebar-btn ${isSidebarVisible ? '' : 'outside'}`}>
                  <FontAwesomeIcon icon={isSidebarVisible ? faChevronLeft : faChevronRight} />
                </div>
              </>
              
            )}

            <div className={`main-content ${ !sessionUser ? 'center-content' : ''}`}>
              {isLoaded && <Outlet />}
            </div>

            <Modal />

          </div>

        </div>
      </ModalProvider>
    </>
  );
}
