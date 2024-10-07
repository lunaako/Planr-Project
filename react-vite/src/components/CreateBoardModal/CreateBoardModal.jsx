import './CreateBoardModal.css';
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createBoardThunk } from '../../redux/board';



export default function CreateBoardModal() {
  const dispatch = useDispatch();
  const [boardName, setBoardName] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    let err = {};
    if (boardName.length > 50) {
      err.boardName = 'Board Name should be within 50 characters!'
    }
    setErrors(err);
  }, [boardName])

  const handleSubmit= (e) => {
    e.preventDefault();
    dispatch(createBoardThunk({name: boardName}))
      .then(closeModal)
  }

  return (
    <div>
      <h3>Create Board</h3>
      <form>
        <label>
          Board Name
          <input 
            type='text'
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
        </label>

        {errors.boardName && <p>{errors.boardName}</p>}

        <button
          type='submit'
          onClick={handleSubmit}
          disabled={Object.values(errors).length}
        >
          Create
        </button>
      </form>
    </div>
  )
}