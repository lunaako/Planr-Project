import { useModal } from '../../context/Modal';
import { useDispatch } from "react-redux";
import { deleteBoardThunk } from '../../redux/board';




export default function DeleteBoardModal({boardId}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  // console.log(boardId)

  const handleDelete = () => {
    dispatch(deleteBoardThunk(boardId))
    closeModal()
  }

  return (
    <div className="delete-board-container">
      <div className='delete-board-header'>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this board?</p>
      </div>

      <button
        className='delete-board-yes'
        onClick={handleDelete}
      >
        Yes (Delete Board)
      </button>

      <button
        className='delete-board-no'
        onClick={() => closeModal()}
      >
        No (Keep Board)
      </button>
    </div>
  )
}