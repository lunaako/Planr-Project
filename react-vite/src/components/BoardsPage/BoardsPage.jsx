import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './BoardsPage.css';
import LoginFormPage from "../LoginFormPage";
import { createBoardThunk, deleteBoardThunk, getBoardsThunk, getBoardThunk, updateBoardThunk } from "../../redux/board";
import SideBar from "../SideBar/SideBar";



export default function BoardsPage() {
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(getBoardsThunk())
  }, [dispatch])

  if (!user) return (<LoginFormPage />)


  // console.log(boards)
  return (
    <div className="boards-page-container">
      <div className="boards-page-side-bar">
        <SideBar boards={boards} user={user} />

        <button onClick={() => 
          dispatch(updateBoardThunk(1, { name: 'Demo Board' }))}>
            Test Update
        </button>

        <button onClick={() =>
          dispatch(createBoardThunk({name: 'test'}))}>
          Test Create Board
        </button>

        <button onClick={() =>
          dispatch(deleteBoardThunk(4))}>
          Test Delete Board
        </button>
      </div>

      <div className="boards-page-main">
          <div>
            <h2></h2>
          </div>
      </div>
    </div>
  )
}