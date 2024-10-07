import './CreateCsModal.css'
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createCardSectionThunk } from '../../redux/cardSection';


export default function CreateCsModal({boardId}) {
  const disptach = useDispatch();
  const [csTitle, setCsTitle] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    let errs = {};
    if (csTitle.length > 50) {
      errs.title = 'The title of the card section should be within 50 characters'
    }
    setErrors(errs);
  }, [csTitle])

  const handleSubmit = (e) => {
    e.preventDefault();
    disptach(createCardSectionThunk(boardId, {title: csTitle}))
      .then(closeModal)
  }

  return (
    <div>
      <h3>
        Create a new Card Section
      </h3>

      <form>
        <label>
          Title
          <input 
            type='text'
            value={csTitle}
            onChange={(e) => setCsTitle(e.target.value)}
            required
          />
        </label>

        {errors.title && <p>{errors.title}</p>}

        <button
          type='submit'
          onClick={handleSubmit}
        >
          Create
        </button>
      </form>
    </div>
  )
}