import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateCardThunk } from "../../redux/card";
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
  const [originalDescription, setOriginalDescription] = useState(card?.description || '');
  const [labels, setLabels] = useState(card?.labels || '')
  const [dueDate, setDueDate] = useState(card?.dueDate ? new Date(card.dueDate) : null)
  const [errors, setErrors] = useState({})
  const cards = useSelector(state => state.card)
  const updatedCard = Object.values(cards).find(c => c.id === card.id)


  useEffect(() => {
    if(updatedCard) {
      setName(updatedCard.name);
      setDescription(updatedCard.description);
      setOriginalDescription(updatedCard.description);
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


    if (!Object.values(errors).length) {
      let newCard = {
        name,
        description,
        labels,
        due_date: dueDate ? dueDate.toISOString().substring(0, 10) : null
      }

      dispatch(updateCardThunk(card.id, newCard))
        .then(() => {
          setOriginalDescription(description);
          setIsDesUpdate(false)
        })
    }
  }

  const handleRemoveLabel = () => {
    setLabels('')
  }

  useEffect(() => {
    if (labels === '') {
      handleUpdate('labels')
    }
  }, [labels])

  const handleCancelDescriptionUpdate = () => {
    setDescription(originalDescription); // Revert description back to the original value
    setIsDesUpdate(false); // Close the editing mode
  };

  return (
    <div className="update-card-modal-self">
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
            <FontAwesomeIcon icon={faAlignLeft} className="update-des-icon"/>
            <h4>Description</h4>
          </div>

          <button
            onClick={() => setIsDesUpdate(true)}
            className="buttons-wiz-hover"
          >Edit</button>
          
        </div>

        {!isDesUpdate ? (
          <p className="des-paragraph">
            {description || 'No description'}
          </p>
        ) : (
          <div className="des-update-text-area">
            <textarea 
              placeholder="Add a more detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="des-update-buttons">
              <button
                onClick={() => handleUpdate('description')}
                className="des-save buttons-wiz-hover"
              >Save</button>
              <button 
                onClick={handleCancelDescriptionUpdate}
                className="buttons-wiz-hover"
              >
                Cancel
              </button>
            </div>
            
          </div>
        )
        }
      </div>

      <div className="update-card-label-container">
        <div className="update-labels-header">
          <div className="update-labels-left">
            <FontAwesomeIcon icon={faTag} />
            <h4>Labels</h4>
          </div>
          
          <button
            className="remove-label buttons-wiz-hover"
            onClick={handleRemoveLabel}
          >
            Remove label
          </button>
        </div>

        <div className="update-labels-display">
          {
            updatedCard?.labels ? (
              <p className="labels-p">{updatedCard?.labels}</p>
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

          <button 
            onClick={() => handleUpdate('labels')}
            className="buttons-wiz-hover update-label-button"
          >
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

        <div className="update-duedate">
          <DatePicker 
          selected={dueDate} 
          onChange={(date) => setDueDate(date)}
          dateFormat='yyyy-MM-dd'
          className="date-picker" 
          />
          <button
            onClick={() => handleUpdate('dueDate')}
            className="buttons-wiz-hover"
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