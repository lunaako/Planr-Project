import { useEffect, useState, useRef } from 'react'
import { createCardThunk, getCardsThunk } from '../../redux/card'
import './CardSection.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardSectionThunk } from '../../redux/cardSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import OpenModalButton from '../OpenModalButton';
import DeleteCardSectionModal from '../DeleteCardSectionModal'
import Cards from '../Cards/Cards'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

export default function CardSection({cardSec}) {
  const dispatch = useDispatch()
  const cards = useSelector(state => state.card)
  const csId = cardSec.id
  const cardArr = Object.values(cards).filter(card => card.cardSectionId === csId).sort((a, b) => a.order - b.order)
  const [isEditing, setIsEditing] = useState(false)
  const [csName, setCsName] = useState(cardSec?.title || '')
  const [cardName, setCardName] = useState('')
  const [cardErr, setCardErr] = useState({})
  const [isCreateCard, setIsCreateCard] = useState(false)
  const cardInputRef = useRef(null)

  const { isOver, setNodeRef } = useDroppable({
    id: `droppab;e-${csId}`,
    data: {cardSectionId: csId}
  })

  //! for add new card
  const handleAddCard = () => {
    setIsCreateCard(true)
  }

  const handleCardNameInput = (e) => {
    setCardName(e.target.value)
  }

  useEffect(() => {
    const errors = {};
    if (cardName.length > 50) {
      errors.cardName = 'Card name should be within 50 characters'
    }
    setCardErr(errors);
  }, [cardName])

  const handleCardSubmit = (e) => {
    e.preventDefault()
    if (Object.values(cardErr).length) return;
    dispatch(createCardThunk(csId, {name: cardName}))
    setCardName('')
    setIsCreateCard(false)
  }

  //! for change name of card section
  const handleCsNameUpdate = () => {
    if (csName.trim() && csName !== cardSec?.title) {
      dispatch(updateCardSectionThunk(csId, {title: csName}))
        .then(() => setIsEditing(false))
    } else {
      setIsEditing(false)
    }
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    setCsName(e.target.value)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCsNameUpdate();
    } else if (e.key === 'Escape') {
      setCsName(cardSec.title)
      setIsEditing(false)
    }
  } 

  const handleInputBlur = () => {
    handleCsNameUpdate()
  }

  useEffect(() => {
    setCsName(cardSec?.title || '')
  }, [cardSec])

  useEffect(() => {
    dispatch(getCardsThunk(csId))
  }, [dispatch, csId])

  useEffect(() => {
    function handleClickOutside(e) {
      if (cardInputRef.current && !cardInputRef.current.contains(e.target)) {
        setIsCreateCard(false) // Close the input form if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cardInputRef, isCreateCard])

  if (!cardSec) return <>Loading</>

  return (
    <div className='card-section-container'>
      <div className='card-section-title'>
        {isEditing ? (
          <input
            type='text'
            value={csName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
        ) : (
          <p onClick={handleNameClick}>
            {cardSec?.title}
          </p>
        )
        }

        <OpenModalButton
          buttonText={<FontAwesomeIcon icon={faTrash} />}
          modalComponent={<DeleteCardSectionModal csId={csId} />}
        />

      </div>

        <SortableContext items={cardArr.map(card => card.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className='card-section-cards'
            ref={setNodeRef}
            style={{ backgroundColor: isOver ? '#f0f0f0' : 'transparent' }}
          >
            {cardArr.length > 0 ? (
              cardArr.map(card => (
                <Cards card={card} csId={csId} key={card.id} />
              ))
            ) : (
              // This div acts as a droppable area when the section is empty
              <div className="empty-card-section">
              </div>
            )}

            {isCreateCard ?
              (
                <form className='card-section-add-card-input'
                  ref={cardInputRef}
                  onSubmit={handleCardSubmit}
                >
                  <input
                    type='text'
                    value={cardName}
                    onChange={handleCardNameInput}
                    placeholder='Enter a name for this card'
                    autoFocus
                  />
                  {cardErr.cardName && <p id='card-section-card-name-err'>*{cardErr.cardName}</p>}
                  <button
                    type='submit'
                    disabled={Object.values(cardErr).length}
                    className='buttons-wiz-hover'
                    id='card-section-add-card-button'
                  >
                    Add card
                  </button>
                </form>

              ) : (
                <div
                  onClick={handleAddCard}
                  className='card-section-add-card'
                >
                  <FontAwesomeIcon icon={faPlus} className='add-card-icon' />
                  <p>Add a card</p>
                </div>
              )
            }
          </div>
        </SortableContext>

    </div>
  )
}