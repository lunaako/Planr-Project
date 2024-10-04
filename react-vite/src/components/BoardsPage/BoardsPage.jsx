import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './BoardsPage.css';
import LoginFormPage from "../LoginFormPage";
import { createBoardThunk, deleteBoardThunk, getBoardThunk, updateBoardThunk } from "../../redux/board";





export default function BoardsPage() {
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(getBoardThunk(1))
  }, [dispatch])

  if (!user) return (<LoginFormPage />)


  console.log(boards)
  return (
    <div className="boards-page-container">
      <div className="boards-page-side-bar">
        <button onClick={() => 
          dispatch(updateBoardThunk(1, { name: 'Demo Board' }))}>
            Test Update
        </button>

        <button onClick={() =>
          dispatch(createBoardThunk({name: 'Demo Day'}))}>
          Test Create Board
        </button>

        <button onClick={() =>
          dispatch(deleteBoardThunk(5))}>
          Test Delete Board
        </button>
      </div>

      <div className="boards-page-main">

      </div>
    </div>
  )
}