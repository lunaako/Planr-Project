import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import './BoardDetailPage.css';
import LoginFormPage from "../LoginFormPage";
import { getBoardsThunk, updateBoardThunk} from "../../redux/board";
import { getCardsThunk, reorderCardThunk, onDragCardThunk } from '../../redux/card'
import { useParams } from "react-router-dom";
import { getCardSectionsThunk } from "../../redux/cardSection";
import CardSection from "../CardSection/CardSection";
import OpenModalButton from '../OpenModalButton';
import CreateCsModal from "../CreateCsModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularFaStar} from '@fortawesome/free-regular-svg-icons';
import { faStar as solidFaStar, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { addFavThunk, deleteFavThunk, getFavsThunk } from "../../redux/session";
import Cards from '../Cards/Cards'
import AIModal from "../AIModal/AIModal";


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
  const cards = useSelector(state => state.card);
  const cardArr = Object.values(cards);
  const [activeCard, setActiveCard] = useState(null);

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

  const handleDragStart = (e) => {
    const activeId = e.active.id;
    const activeCard = cardArr.find(card => card.id === activeId);
    setActiveCard(activeCard);
  }

  const handleDragOver = (e) => {
    if (!e.over) return;
    const activeId = e.active.id;

    const overCardSectionId = e.over.data.current.cardSectionId;

    const moveCardProps = {
      tempCardSectionId: overCardSectionId,
      id: activeId
    }
    dispatch(onDragCardThunk(moveCardProps));
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);

    if (!over) return;

    const oldSectionId = active.data?.current.cardSectionId;
    const newSectionId = over.data?.current.cardSectionId;

    console.log(oldSectionId, newSectionId)

    const oldIndex = cardArr.findIndex(card => card.id === active.id);
    // const newIndex = cardArr.findIndex(card => card.id === over.id);

    if (oldIndex !== -1) {
      const updatedCards = [...cardArr];

      if (oldSectionId === newSectionId) {
        const targetCards = updatedCards.filter(card => card.cardSectionId === oldSectionId)
        const orderedTargetCards = targetCards.sort((a, b) => a.order - b.order)
        const oldI = orderedTargetCards.findIndex(card => card.id === active.id)
        const newI = orderedTargetCards.findIndex(card => card.id === over.id);
        const [movingCard] = orderedTargetCards.splice(oldI, 1);
        orderedTargetCards.splice(newI, 0, movingCard);
        for (let i = 0; i < orderedTargetCards.length; i++) {
          orderedTargetCards[i].order = i;
        }
        dispatch(reorderCardThunk({ reorderedCards: orderedTargetCards }));
        dispatch(getCardsThunk(newSectionId))

      } else {
        const oldCards = updatedCards.filter(card => card.cardSectionId === oldSectionId);
        const orderedOldCards = oldCards.sort((a, b) => a.order - b.order);
        const oldI = orderedOldCards.findIndex(card => card.id === active.id);
        const [movingCard] = orderedOldCards.splice(oldI, 1);
        for (let i = 0; i < orderedOldCards.length; i++) {
          orderedOldCards[i].order = i;
        }

        //?-----------till now the old cards's orders have been updated
        const targetCards = updatedCards.filter(card => card.cardSectionId === newSectionId);

        const orderedTargetCards = targetCards.sort((a, b) => a.order - b.order);
        const newI = orderedTargetCards.findIndex(card => card.id === over?.id);

        movingCard.cardSectionId = newSectionId;

        if(newI === orderedTargetCards.length - 1 || newI === -1) {
          orderedTargetCards.push(movingCard);
        } else {
          orderedTargetCards.splice(newI, 0, movingCard);
        }

        for (let i = 0; i < orderedTargetCards.length; i++) {
          orderedTargetCards[i].order = i;
        }

        const finalUpdatedCards = [...orderedOldCards, ...orderedTargetCards];
        dispatch(reorderCardThunk({ reorderedCards: finalUpdatedCards }));
        dispatch(getCardsThunk(oldSectionId))
        dispatch(getCardsThunk(newSectionId))
      }
    }
  }

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

        <OpenModalButton
          buttonText={<FontAwesomeIcon icon={faWandMagicSparkles} id="ai-tip-icon"/>}
          modalComponent={<AIModal boardId={currBoard.id} />}
        />
      </div>

      <DndContext collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
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

        <DragOverlay>
          {activeCard ? (
            <Cards card={activeCard} />
          ) : null}
        </DragOverlay>

      </DndContext>

    </div>
  )
}