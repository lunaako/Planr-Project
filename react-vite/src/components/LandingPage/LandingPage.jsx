import LoginFormPage from "../LoginFormPage";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { getBoardsThunk } from "../../redux/board";


export default function LandingPage() {
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const boardsArr = Object.values(boards);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(getBoardsThunk());
  }, [dispatch, user])


  if (!user) {
    return <LoginFormPage />
  }

  if (!boards) {
    return <>Loading...</>
  }


  return (
   <div className="landing-page-container">

    <div className="landing-page-side-bar">
        <h3>{user.username}&apos; Boards</h3>
      <ul>
        {boardsArr?.map(board => {
          return <li key={board.id}>{board.name}</li>
        })}
      </ul>
      <button onClick={() => navigate('/boards')}>Enter Your WorkPlace</button>
    </div>

    <div className="landing-page-main">
      <div className="landing-starred">
         ❤️Fav feature Coming Soon...
      </div>

      <div className="landing-all-boards">
          {boardsArr?.map(board => {
            return <div key={board.id}>{board.name}</div>
          })}
      </div>
    </div>

   </div>
  )
}