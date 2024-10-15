import { useEffect, useState, useRef } from 'react'
import { createCardThunk, getCardsThunk } from '../../redux/card'
import './CardSection.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardSectionThunk } from '../../redux/cardSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import OpenModalButton from '../OpenModalButton';
import DeleteCardSectionModal from '../DeleteCardSectionModal'
import DeleteCardModal from '../DeleteCardModal/DeleteCardModal'
import UpdateCardModal from '../UpdateCardModal/UpdateCardModal'


export default function CardSection({cardSec}) {
  const dispatch = useDispatch()
  const cards = useSelector(state => state.card)
  const csId = cardSec.id
  const cardArr = Object.values(cards).filter(card => card.cardSectionId === csId)
  const [isEditing, setIsEditing] = useState(false)
  const [csName, setCsName] = useState(cardSec?.title || '')
  const [cardName, setCardName] = useState('')
  const [cardErr, setCardErr] = useState({})
  const [isCreateCard, setIsCreateCard] = useState(false)

  const cardInputRef = useRef(null)

  //! for add new card
  const handleAddCard = () => {
    setIsCreateCard(true)
  }

  const handleCardNameInput = (e) => {
    if (Object.values(cardErr).length) return;
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

      
      <div className='card-section-cards'>
       {cardArr.map(card => {
        return <div key={card.id} className='card-section-card-row'>
                <p>{card.name}</p>
          <div className='card-section-card-row-icons'>
            <OpenModalButton
              buttonText={<FontAwesomeIcon icon={faTrash} />}
              modalComponent={<DeleteCardModal cardId={card.id} />}
            />
            <OpenModalButton
              buttonText={<FontAwesomeIcon icon={faPen} />}
              modalComponent={<UpdateCardModal card={card} csId={csId} />}
              modalClassName='update-card-modal'
            />
          </div>  
      </div>
       })}

        { isCreateCard ?
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
                // onClick={handleCardSubmit}
                disabled={Object.values(cardErr)}
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
          <FontAwesomeIcon icon={faPlus} className='add-card-icon'/>
          <p>Add a card</p>
        </div>
        )  
        }
      </div>

    </div>
  )
}