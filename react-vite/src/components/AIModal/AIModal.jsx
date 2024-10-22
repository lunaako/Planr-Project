import { useEffect, useState } from "react";
import { marked } from "marked";
import { useModal } from '../../context/Modal';
import aiGif from '/aiGif.gif';
import loadingGif from '/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import './AIModal.css';


export default function AIModal({boardId}) {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModal();

  const handleGenerateAI = async() => {
    setIsLoading(true);
    const res = await fetch(`/api/ai/${boardId}`);
    if (res.ok) {
      const data = await res.json();
      setTip(data.answer);
      setIsLoading(false);
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }

  return (
    <div className="ai-tips-whole">
      <div className="create-board-ai-gif">
        <img src={aiGif} />

        <div className="chat-bubble-whole">
          <FontAwesomeIcon icon={faCaretLeft} className="arrow-bubble" />

          <div className="chat-bubble">
            <p>{tip ? "Get more advice?" : "Do you need any advice? Then click yes."}</p>
          </div>
        </div>
      </div>

      {tip ? <div dangerouslySetInnerHTML={{ __html: marked.parse(tip)}}
        className="ai-tips-res"
      >     
      </div> : 
        ""
      }

      {isLoading && <img src={loadingGif} alt='loading' className="loading-gif" />}

      <div className="ai-tips-buttons">
        <button
          onClick={handleGenerateAI}
          className="buttons-wiz-hover yes-button-ai-tips"
        >
         {tip ? 'Regenerate' : 'Yes'}
        </button>

        <button onClick={() => closeModal()}
          className="no-button-ai-tips"
        >
          I don't need
        </button>
      </div>
      
    </div>
  )
}