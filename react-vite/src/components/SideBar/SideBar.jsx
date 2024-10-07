import './SideBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  // const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    dispatch(getBoardsThunk())
  }, [dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null) {
        const menuNode = menuRefs.current[openMenuId];
        if (menuNode && !menuNode.contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const handleMenu = (e, boardId) => {
    console.log(menuRefs);
    e.stopPropagation();
    if (openMenuId === boardId) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(boardId);
    }
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
          const isOpen = openMenuId === board.id;

          const handleDetailBoard = () => {
            dispatch(getBoardThunk(board.id));
            navigate(`/boards/${board.id}`);
          }

          const handleMenuClick = (e) => {
            e.stopPropagation();
            handleMenu(e, board.id);
          };

          return (<li key={board.id} onClick={handleDetailBoard} className={`side-bar-board-item ${isOpen ? 'open' : ''}`}>
            <div>{board.name}</div>
            <div className='side-bar-board-actions'>
              <span className='side-bar-board-action-ellipsis-button'><FontAwesomeIcon icon={faEllipsis} onClick={handleMenuClick} /></span>
              {isOpen && (<div className='board-update-display' ref={(el) => (menuRefs.current[board.id] = el)} onClick={(e) => e.stopPropagation()}>
                <OpenModalButton
                  buttonText='Delete'
                  modalComponent={<DeleteBoardModal boardId={board.id} 
                  />}
                />
              </div>)}
            </div>
          </li>)
          })}
      </ul>

    </div>

  </div>
)
}