import './DeleteCardSectionModal.css'
import { useModal } from '../../context/Modal';
import { useDispatch } from "react-redux";
import { deleteCardSectionThunk } from '../../redux/cardSection';


export default function DeleteCardSectionModal({csId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCardSectionThunk(csId))
    closeModal()
  }

  return (
    <div>
      <div>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this card section?</p>
      </div>

      <button
        className='delete-cs-yes'
        onClick={handleDelete}
      >
        Yes
      </button>

      <button
        className='delete-cs-no'
        onClick={() => closeModal()}
      >
        No
      </button>
    </div>
  )
}