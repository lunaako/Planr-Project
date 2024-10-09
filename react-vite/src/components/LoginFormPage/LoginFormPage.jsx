import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";
import loginImage from '/login-image.jpg'

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  const demoLogin = () => {
    dispatch(thunkLogin({
      "email": "demo@aa.io",
      "password": "password"
    }))
    navigate('/')
  }

  return (
    <div className="login-container">
      <div className="login-img">
        <img src={loginImage} alt='image' />
      </div>

      <div className="login-form">
        <h1>Log In</h1>
        {errors.length > 0 &&
          errors.map((message) => <p key={message}>{message}</p>)}
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id='login-email-input'
            />
          </label>
          {errors.email && 
            <p className="login-errors">*{errors.email}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && 
            <p className="login-errors">*{errors.password}</p>}

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <button onClick={demoLogin} className="buttons-wiz-hover">Demo User</button>

        <OpenModalButton
          buttonText='Create an account'
          // modalClassName=''
          modalComponent={<SignupFormModal />}
        />
      </div>
      
    </div>
  );
}

export default LoginFormPage;
