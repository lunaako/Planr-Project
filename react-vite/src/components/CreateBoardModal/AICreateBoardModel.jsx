import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useModal } from '../../context/Modal';



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
      // console.log(res);
      const data = await res.json();
      console.log(data)
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
      // console.log(res);
      const data = await res.json();
      console.log(data)
      
      navigate(`/boards/${data.board_id}`).then(closeModal);
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }


  return (
    <div>
      <form>
        <label>
          Request Description
          <textarea
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </form>

      {suggestion.length > 0 ? <div><h4>Here are some tips you can use as your tasks</h4>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(suggestion) }}>
      </div></div> : <div></div>}
      
      <button
        onClick={handleSuggestionClick}
      >
        Get Suggestion
      </button>

      {suggestion.length > 0 ? <button
        onClick={handleCreationClick}
      >
        Create Board
      </button> : <div></div>}
    </div>
  )
}