import { useEffect, useState } from 'react'
import { getCardsThunk } from '../../redux/card'
import './CardSection.css'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardSectionThunk } from '../../redux/cardSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import OpenModalButton from '../OpenModalButton';
import DeleteCardSectionModal from '../DeleteCardSectionModal'


export default function CardSection({cardSec}) {
  const dispatch = useDispatch()
  const cards = useSelector(state => state.card)
  const cardArr = Object.values(cards)
  const csId = cardSec.id
  const [isEditing, setIsEditing] = useState(false)
  const [csName, setCsName] = useState(cardSec?.title || '')

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

  if (!cardSec) return <>Loading</>

  return (
    <div>
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
        return <div key={card.id}>{card.name}</div>
       })}
      </div>


    </div>
  )
}