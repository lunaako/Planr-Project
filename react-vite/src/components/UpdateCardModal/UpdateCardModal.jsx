import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createCardThunk, getCardsThunk, updateCardThunk } from "../../redux/card";
import { PiSubtitles } from "react-icons/pi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faTag, faCalendar } from '@fortawesome/free-solid-svg-icons';
import './UpdateCardModal.css';

export default function UpdateCardModal({card}) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isDesUpdate, setIsDesUpdate] = useState(card?.description === '' || false)
  const [name, setName] = useState(card?.name || '')
  const [description, setDescription] = useState(card?.description || '')
  const [labels, setLabels] = useState(card?.labels || '')
  const [dueDate, setDueDate] = useState(card?.dueDate ? new Date(card.dueDate) : null)
  const [errors, setErrors] = useState({})
  const cards = useSelector(state => state.card)
  const updatedCard = Object.values(cards).find(c => c.id === card.id)


  useEffect(() => {
    if(updatedCard) {
      setName(updatedCard.name);
      setDescription(updatedCard.description);
      setLabels(updatedCard.labels);
      setDueDate(updatedCard.dueDate ? new Date(updatedCard.dueDate) : null);
    }
  }, [updatedCard])

  const handleCardNameUpdate = () => {
    if (name.trim() && name !== card.name) {
      const newCard = {
        name,
        description,
        labels,
        dueDate
      }
      dispatch(updateCardThunk(card.id, newCard))
        .then(() => setIsEditing(false))
    } else {
      setIsEditing(false)
    }
  }

  const handleNameClick = () => {
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    setName(e.target.value)
  }

  const handleInputBlur = () => {
    handleCardNameUpdate()
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCardNameUpdate();
    } else if (e.key === 'Escape') {
      setName(card.name)
      setIsEditing(false)
    }
  }

  useEffect(() => {
    setName(card?.name || '')
  }, [card])

  // console.log(card);


  const handleUpdate = (label) => {
    const errs = {}
    if (label === 'name' && name.length > 50) {
      errs.name = 'Card name should be within 50 characters'
    }
    if (label === 'description' && description.length > 500) {
      errs.description = 'Description should be within 500 characters'
    }
    setErrors(errs)

    // console.log(dueDate)
    // console.log(dueDate.toISOString())
    // console.log(dueDate.toLocaleDateString())
    // console.log(dueDate.toLocaleString())
    // console.log(dueDate.toLocaleTimeString())


    if (!Object.values(errors).length) {
      let newCard = {
        name,
        description,
        labels,
        due_date: dueDate ? dueDate.toISOString().substring(0, 10) : null
      }

      dispatch(updateCardThunk(card.id, newCard))
        .then(() => {
          setIsDesUpdate(false)
        })
    }
  }

  
  return (
    <div>
      <div className="update-card-title">
        <PiSubtitles />
        { isEditing ? (
          <input 
            type="text"
            value={name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autoFocus
          />
        ) : (
          <h3 onClick={handleNameClick}>
            {name}
          </h3>
          )
        }
      </div>

      <div className="update-card-des">
        <div className="update-des-title">
          <div className="update-des-left">
            <FontAwesomeIcon icon={faAlignLeft} />
            <h4>Description</h4>
          </div>

          <button
            onClick={() => setIsDesUpdate(true)}
          >Edit</button>
          
        </div>

        {!isDesUpdate ? (
          <p>{description || 'No description'}</p>
        ) : (
          <div>
            <textarea 
              placeholder="Add a more detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              onClick={() => handleUpdate('description')}
            >Save</button>
            <button onClick={() => setIsDesUpdate(false)}>Cancel</button>
          </div>
        )
        }
      </div>

      <div className="update-card-label-container">
        <div className="update-labels-header">
          <FontAwesomeIcon icon={faTag} />
          <h4>Labels</h4>
        </div>

        <div className="update-labels-display">
          {
            labels ? (
              <p>{updatedCard?.labels}</p>
            ) : (
              <p>No Lables</p>
            )
          }
        </div>

        <div className="update-labels-update">
          <select
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          >
            <option value="">--Please choose an option--</option>
            <option value="Low Priority">Low Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="High Priority">High Priority</option>
          </select>
          <button onClick={() => handleUpdate('labels')}>
            {labels ? 'Change Labels' : 'Create Labels'}
          </button>
        </div>
      </div>

      <div>
        <div className="update-duedate-header">
          <FontAwesomeIcon icon={faCalendar} />
          <h4>Due Date</h4>
        </div>

        <div className="update-duedate-display">
          {
            updatedCard.dueDate ? (
              <p>{new Date(updatedCard.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</p>
            ) : (
              <p>No due date</p>
            )
          }
        </div>

        <div className="update-duedate-update">
          <DatePicker 
          selected={dueDate} 
          onChange={(date) => setDueDate(date)}
          dateFormat='yyyy-MM-dd' 
          />
          <button
            onClick={() => handleUpdate('dueDate')}
          >
            {
              updatedCard?.dueDate ? 'Change Due Date' : 'Create Due Date'
            }
          </button>
        </div>
      </div>

    </div>
  )
}