import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useModal } from '../../context/Modal';
import './AICreateBoardModal.css';

export default function AICreateBoardModal({ boardId }) {
  const [description, setDescription] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const navigate = useNavigate();
  const { closeModal } = useModal();


  const handleSuggestionClick = async () => {
    const body = {
      description: description
    }
    const res = await fetch(`/api/ai/board/suggestion`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json();
      setSuggestion(data.answer);
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }

  const handleCreationClick = async () => {
    const body = {
      description: description,
      suggestion: suggestion
    }
    const res = await fetch(`/api/ai/board/creation`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      const data = await res.json(); 
      closeModal();     
      navigate(`/boards/${data.board_id}`);
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }


  return (
    <div className="create-board-ai-self">
      <form>
        <label className="breate-board-ai-label">
          Enter your descriptions below:
          <textarea
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </form>

      {suggestion.length > 0 ? 
        <div className="create-board-ai-res">
          <h4>Here are some tips you can use as your tasks</h4>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(suggestion) }}></div>
        </div> 
        : 
        <div></div>}
      
      <div className="create-board-ai-buttons">
        <button
          onClick={handleSuggestionClick}
        >
          {suggestion ? 'Regenerate Suggestion' : 'Get Suggestion'}
        </button>

        {suggestion.length > 0 ? <button
          onClick={handleCreationClick}
        >
          Create Board
        </button> : <div></div>}
      </div>
      
    </div>
  )
}