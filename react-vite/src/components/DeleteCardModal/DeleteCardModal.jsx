import { useModal } from '../../context/Modal';
import { useDispatch } from "react-redux";
import { deleteCardThunk } from '../../redux/card';
import './DeleteCardModal.css'


export default function DeleteCardModal({cardId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCardThunk(cardId))
    closeModal()
  }

  return (
    <div className='delete-card-modal-self'>
      <div className='delete-card-header'>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this card?</p>
      </div>

      <div className='delete-card-buttons'>
        <button
          className='delete-card-yes'
          onClick={handleDelete}
        >
          Yes (Delete card)
        </button>

        <button
          className='delete-card-no buttons-wiz-hover'
          onClick={() => closeModal()}
        >
          No (Keep card)
        </button>
      </div>
      

    </div>
  )
}