import LoginFormPage from "../LoginFormPage";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./LandingPage.css";
import { getBoardsThunk } from "../../redux/board";


export default function LandingPage() {
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const boardsArr = Object.values(boards).filter(board => board.userId === user?.id);

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