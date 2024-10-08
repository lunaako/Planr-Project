import { useModal } from '../../context/Modal';
import { useDispatch } from "react-redux";
import { deleteBoardThunk } from '../../redux/board';
import { deleteCardThunk } from '../../redux/card';



export default function DeleteCardModal({cardId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCardThunk(cardId))
    closeModal()
  }

  return (
    <div>
      <div className='delete-card-header'>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this card?</p>
      </div>

      <button
        className='delete-card-yes'
        onClick={handleDelete}
      >
        Yes
      </button>

      <button
        className='delete-card-no'
        onClick={() => closeModal()}
      >
        No 
      </button>

    </div>
  )
}