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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularFaStar} from '@fortawesome/free-regular-svg-icons';
import { faStar as solidFaStar } from '@fortawesome/free-solid-svg-icons';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { addFavThunk, deleteFavThunk, getFavsThunk } from "../../redux/session";


export default function BoardDetailPage() {
  const { id:boardId } = useParams();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const favs = useSelector(state => state.session.fav);
  const favArr = Object.values(favs);
  const favedBoard = favArr?.find(fav => fav.boardId === +boardId);

  const currBoard = boards[boardId];
  const cardSections = useSelector(state => state.cardSection);
  const cardSectionArr = Object.values(cardSections);
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(currBoard?.name || '');
  const [isStarred, setIsStarred] = useState(favedBoard !== undefined);
  const dispatch = useDispatch();
  // const cards = useSelector(state => state.card)
  // const cardArr = Object.values(cards)

  useEffect(() => {
    setIsStarred(favedBoard !== undefined)
  }, [favs, favedBoard])

  const handleStar = () => {
    if (isStarred) {
      dispatch(deleteFavThunk(favedBoard?.id))
    } else {
      dispatch(addFavThunk({board_id: boardId}))
    }
  }
  
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
    dispatch(getFavsThunk())
  }, [dispatch, user, favs])

  useEffect(() => {
    dispatch(getBoardsThunk())
    dispatch(getCardSectionsThunk(boardId))
  }, [dispatch, boardId])

  if (!user) return (<LoginFormPage />)
  if (!currBoard) return <> Oops, this board doesn't exist...</>

  // const handleDragEnd = ({active, over}) => {
  //   if (!over || active.id === over.id) return;
  //   const oldSectionId = active.data?.cardSectionId;
  //   const newSectionId = over.data?.cardSectionId;

  //   const oldIndex = cardArr.findIndex(card => card.id === active.id);
  //   const newIndex = cardArr.findIndex(card => card.id === over.id);

  //   console.log(active.id)
  //   if (oldIndex !== -1 && newIndex !== -1) {
  //     const updatedCards = [...cardArr];
  //     const [movedCard] = updatedCards.splice(oldIndex, 1);
  //     updatedCards.splice(newIndex, 0, movedCard)
  //   }
  // }

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
        { isStarred ?
          (<FontAwesomeIcon icon={solidFaStar} className="board-title-star" onClick={handleStar}/>)
          : (
            <FontAwesomeIcon icon={regularFaStar} className="board-title-star" onClick={handleStar} />
          )
        }
      </div>

      <DndContext collisionDetection={closestCorners} 
        // onDragEnd={handleDragEnd}
      >
        <SortableContext items={cardSectionArr.map(cs => cs.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="board-detail-main-card">
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
        </SortableContext>
      </DndContext>
    </div>
  )
}