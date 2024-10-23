import OpenModalButton from '../OpenModalButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import DeleteCardModal from '../DeleteCardModal/DeleteCardModal'
import UpdateCardModal from '../UpdateCardModal/UpdateCardModal'
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import changeLabelColor from '../../utils/labelHelper';

export default function Cards({card, csId}) {
  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: card.id,
    data: {
      cardSectionId: card.cardSectionId,
      cardId: card.id
    }
  })

  const style = {
    transition: transition ?? 'transform 300ms ease',
    transform: CSS.Transform.toString(transform)
  }
  return (
    <div className={`card-section-card-row ${card.floating !== null && card.floating ? 'card-section-card-row-dragging' : ''}`}
      ref={setNodeRef} 
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      { card?.labels ? 
      <div className='card-label-outside' id={changeLabelColor(card.labels)}>{card.labels}</div>
        : ""
      }
      <div className='card-content'>
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
      
    </div>
  )
}