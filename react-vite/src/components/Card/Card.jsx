import './Card.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenClip } from '@fortawesome/free-solid-svg-icons';





export default function Card({card}) {
  
  // console.log(card)
  if (!card) return <>Loading...</>
  return (
    <div>
      <p>{card?.name}</p>
      <FontAwesomeIcon icon={faPenClip} />
    </div>
  )
}