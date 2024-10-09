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
      err.boardName = 'Board name should be within 50 characters!'
    }
    setErrors(err);
  }, [boardName])

  const handleSubmit= (e) => {
    e.preventDefault();
    let err = {};
    if(!boardName) {
      err.boardName = 'Board name is required'
    }
    setErrors(err);

    if (!Object.values(err).length) {
      dispatch(createBoardThunk({ name: boardName }))
        .then(closeModal)
    }
  }

  return (
    <div className='create-board-self'>
      <h2>Create Board</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Board Name
          <input 
            type='text'
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
        </label>

        {errors.boardName && <p>*{errors.boardName}</p>}

        <button
          type='submit'
          onClick={handleSubmit}
          disabled={Object.values(errors).length}
          className='buttons-wiz-hover'
        >
          Create
        </button>
      </form>
    </div>
  )
}