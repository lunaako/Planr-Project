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
    let errs = {};
    if(!csTitle) {
      errs.title = 'Card section title is required'
    }
    setErrors(errs);

    if(!Object.values(errs).length) {
      disptach(createCardSectionThunk(boardId, { title: csTitle }))
        .then(closeModal)
    }
  }

  return (
    <div className='create-cs-self'>
      <h2>
        Create a new Card Section
      </h2>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input 
            type='text'
            value={csTitle}
            onChange={(e) => setCsTitle(e.target.value)}
            required
            className='create-cs-input'
          />
        </label>

        {errors.title && <p>*{errors.title}</p>}

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