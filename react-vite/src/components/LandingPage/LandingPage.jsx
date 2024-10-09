import LoginFormPage from "../LoginFormPage";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./LandingPage.css";
import { getBoardsThunk } from "../../redux/board";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import cardSecImg from '/cardSectionCover.jpg';
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const boardsArr = Object.values(boards).filter(board => board.userId === user?.id);
  const navigate = useNavigate()
  const dispatch = useDispatch();

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
      <div className="landing-starred">
        <h3>
          <FontAwesomeIcon icon={faBriefcase} className="landing-allboards-icon" />
          Starred boards
        </h3>
         ❤️Fav feature Coming Soon...
      </div>

      <div className="landing-all-boards">
        <h3>
          <FontAwesomeIcon icon={faBriefcase} className="landing-allboards-icon"/>
          Your boards
        </h3>

        <div className="landing-boards-block">
          {boardsArr?.map(board => {
            return <div key={board.id} 
                      className="landing-board" 
                      onClick={() => navigate(`boards/${board.id}`)}>

              <img src={cardSecImg} alt='card section image' className="landing-board-imgs" />
              <p>{board.name}</p>
            </div>
          })}
        </div>

      </div>
   </div>
  )
}