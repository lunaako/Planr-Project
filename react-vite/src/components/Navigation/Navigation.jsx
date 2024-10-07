import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from 'react-redux';

import "./Navigation.css";

function Navigation() {
  const user = useSelector(state => state.session.user);

  return (
    <>
      {user ? (<ul className="nav-bar-container">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>

        <li>
          <ProfileButton />
        </li>
      </ul>) 
      : 
      (<></>)}
    </>
  );
}

export default Navigation;
