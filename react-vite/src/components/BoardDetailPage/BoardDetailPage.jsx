import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import './BoardDetailPage.css';
import LoginFormPage from "../LoginFormPage";
import { getBoardsThunk, updateBoardThunk} from "../../redux/board";
import { useParams } from "react-router-dom";
import { getCardSectionsThunk } from "../../redux/cardSection";
import CardSection from "../CardSection/CardSection";
import OpenModalButton from '../OpenModalButton';
import CreateCsModal from "../CreateCsModal";


export default function BoardDetailPage() {
  const { id:boardId } = useParams();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const currBoard = boards[boardId];
  const cardSections = useSelector(state => state.cardSection);
  const cardSectionArr = Object.values(cardSections);
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(currBoard?.name || '');
  const dispatch = useDispatch();


  // console.log(cardSectionArr)

  const handleBoardNameUpdate = () => {
    if (boardName.trim() && boardName !== currBoard?.name) {
      dispatch(updateBoardThunk(boardId, {name: boardName}))
        .then(() => setIsEditing(false))
    } else {
      setIsEditing(false)
    }
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    setBoardName(e.target.value)
  }

  const handleInputBlur = () => {
    handleBoardNameUpdate()
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBoardNameUpdate();
    } else if (e.key === 'Escape') {
      setBoardName(currBoard.name)
      setIsEditing(false)
    }
  }

  useEffect(() => {
    setBoardName(currBoard?.name || '')
  }, [currBoard])

  useEffect(() => {
    dispatch(getBoardsThunk())
    dispatch(getCardSectionsThunk(boardId))
  }, [dispatch, boardId])

  if (!user) return (<LoginFormPage />)
  if (!currBoard) return <>Loading...</>

  return (
    <div className="board-container">
      <div className="board-header">
        { isEditing ? (
          <input 
            type='text'
            value={boardName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autoFocus
            className="board-name-input"
          />
        ) : (
          <h2 onClick={handleNameClick}>
            {currBoard?.name}
          </h2>
        )
        }
      </div>

      {cardSectionArr.length ? 
        cardSectionArr.map(cardSec => {
          return <CardSection cardSec={cardSec} key={cardSec.id} />
        })
        :
        <></>
      }

      <OpenModalButton
        buttonText='Create a New Card Section'
        modalComponent={<CreateCsModal boardId={currBoard.id} />}
      />

    </div>
  )
}