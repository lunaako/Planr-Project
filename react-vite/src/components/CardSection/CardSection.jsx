import { useEffect } from 'react'
import { getCardsThunk } from '../../redux/card'
import './CardSection.css'
import { useDispatch, useSelector } from 'react-redux'


export default function CardSection({cardSec}) {
  const dispatch = useDispatch()
  const cards = useSelector(state => state.card)
  const cardArr = Object.values(cards)
  const csId = cardSec.id
  // console.log(cardArr)

  useEffect(() => {
    dispatch(getCardsThunk(csId))
  }, [dispatch, csId])

  if (!cardSec || !cardArr.length) return <>Loading</>

  return (
    <div>
      <p>{cardSec?.title}</p>
      
      <div className='card-section-cards'>
       {cardArr.map(card => {
        return <div key={card.id}>{card.name}</div>
       })}
      </div>
    </div>
  )
}