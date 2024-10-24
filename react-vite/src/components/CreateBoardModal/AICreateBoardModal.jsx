import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useModal } from '../../context/Modal';
import './AICreateBoardModal.css';
import aiGif from '/aiGif.gif';
import loadingGif from '/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from "react-redux";
import { getBoardsThunk } from "../../redux/board";


export default function AICreateBoardModal() {
  const [description, setDescription] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const dispatch = useDispatch()


  const handleSuggestionClick = async () => {
    setIsLoading(true);

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
      setIsLoading(false);
      setSuggestion(data.answer);
      
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }

  const handleCreationClick = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      dispatch(getBoardsThunk());
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
      <div className="create-board-ai-gif">
        <img src={aiGif} />

        <div className="chat-bubble-whole">
          <FontAwesomeIcon icon={faCaretLeft} className="arrow-bubble"/>

          <div className="chat-bubble">
            <p>Do you want AI's help?</p>
          </div> 
        </div>
      </div>

      <form>
        <label className="breate-board-ai-label">
          Tell me the general idea about you plan:
          <textarea
            type='text'
            value={description}
            placeholder="Example: I wanna make a 2-days plan for keeping fit. I don't like Cardio!"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </form>


      {suggestion.length > 0 ? 
        <div className="create-board-ai-res">
          <h4>Here is your plan: </h4>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(suggestion) }}
            className="create-board-plan-body"
          ></div>
        </div> 
        : 
        <div></div>}
      
      <img src={loadingGif} alt='loading' className={isLoading ? "loading-gif" : "loading-gif hide-gif"}/>
      
      <div className="create-board-ai-buttons">
        <button
          onClick={handleSuggestionClick}
          className="buttons-wiz-hover"
        >
          {suggestion ? 'Regenerate' : 'Generate Your Plan'}
        </button>

        {suggestion ? 
        <button
          onClick={handleCreationClick}
          className="buttons-wiz-hover"
        >
          Create Board
        </button> : ""}
      </div>
      
    </div>
  )
}