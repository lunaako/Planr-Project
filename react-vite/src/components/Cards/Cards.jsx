import OpenModalButton from '../OpenModalButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import DeleteCardModal from '../DeleteCardModal/DeleteCardModal'
import UpdateCardModal from '../UpdateCardModal/UpdateCardModal'


export default function Cards({card, csId}) {
  return (
    <div key={card.id} className='card-section-card-row'>
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
  )
}