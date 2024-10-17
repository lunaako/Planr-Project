import OpenModalButton from '../OpenModalButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import DeleteCardModal from '../DeleteCardModal/DeleteCardModal'
import UpdateCardModal from '../UpdateCardModal/UpdateCardModal'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export default function Cards({card, csId}) {
  // console.log(card.id)
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: card.id})

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  return (
    <div className='card-section-card-row'
      ref={setNodeRef} 
      style={style}
    >
      <p {...attributes} {...listeners}>{card.name}</p>
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