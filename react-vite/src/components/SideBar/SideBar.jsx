import './SideBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OpenModalButton from '../OpenModalButton';
import DeleteBoardModal from '../DeleteBoardModal/DeleteBoardModal';
import { useDispatch, useSelector } from 'react-redux';
import { getBoardsThunk, getBoardThunk } from '../../redux/board';


export default function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const boardsArr = Object.values(boards);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getBoardsThunk())
  }, [dispatch])

  const handleMenu = () => {
    setIsOpen(prev => !prev)
  }

  if (!user) return <></>
  return (
  <div className='side-bar-container'>
    <div className='side-bar-buttons'>
      <button onClick={() => navigate('/')}>
        Home
      </button>
      
      <button>
        Template(TBD)
      </button>

      <button>
        Enter Your WorkPlace
      </button>
    </div>

    <div className='side-bar-boards-display'>
      <div className='side-bar-boards-header'>
        <h3>
            {user.username}&apos; Boards
        </h3>
      </div>

      <ul className='side-bar-board-lists'>
        {boardsArr.map(board => {
          
          const handleDetailBoard = () => {
            dispatch(getBoardThunk(board.id));
            navigate(`/boards/${board.id}`);
          }

          return (<div key={board.id} onClick={handleDetailBoard}>
            <li>{board.name}</li>
            <span><FontAwesomeIcon icon={faEllipsis} onClick={handleMenu} /></span>
            <div className={isOpen ? 'board-update-display': 'disable'}>
              <OpenModalButton 
                buttonText='Delete'
                modalComponent={<DeleteBoardModal boardId={board.id} />}
              />
            </div>
          </div>)
          })}
      </ul>

    </div>

  </div>
)
}