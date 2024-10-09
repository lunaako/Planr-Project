import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from 'react-redux';
import webLogo from '/logo.jpg';
import "./Navigation.css";

function Navigation() {
  const user = useSelector(state => state.session.user);

  return (
    <>
      {user ? (<ul className="nav-bar-container">
        <li>
          <NavLink to="/" className='nav-link-container'>
            <img src={webLogo} alt='logo' className="nav-logo"/>
            <h1>Planr</h1>
          </NavLink>
        </li>

        <li>
          <ProfileButton className='nav-profile-icon' />
        </li>
      </ul>) 
      : 
      (<></>)}
    </>
  );
}

export default Navigation;
