import './Card.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';
import { getCardSectionsThunk } from '../../redux/cardSection';
import { useDispatch } from 'react-redux';




export default function Card({card}) {
  const dispatch = useDispatch()
  // console.log(card)
  if (!card) return <>Loading...</>
  return (
    <div>
      <p>{card?.name}</p>
      <FontAwesomeIcon icon={faPenClip} />
      <button onClick={() => dispatch(getCardSectionsThunk(1))}>Card Section Test</button>
    </div>
  )
}