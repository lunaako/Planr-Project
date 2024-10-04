import './SideBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OpenModalButton from '../OpenModalButton';
import DeleteBoardModal from '../DeleteBoardModal/DeleteBoardModal';
import { useDispatch } from 'react-redux';
import { getBoardThunk } from '../../redux/board';


export default function SideBar({boards, user}) {
  const boardsArr = Object.values(boards);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);


  const handleMenu = () => {
    setIsOpen(prev => !prev)
  }

  // console.log(boardsArr[0])

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
        <span><FontAwesomeIcon icon={faEllipsis} /></span>
      </div>

      <ul className='side-bar-board-lists'>
        {boardsArr.map(board => {
          return (<div key={board.id} onClick={() => dispatch(getBoardThunk(board.id))}>
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