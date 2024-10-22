import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { marked } from "marked";


export default function AIModal({boardId}) {
  const [tip, setTip] = useState('');

  const handleGenerateAI = async() => {
    const res = await fetch(`/api/ai/${boardId}`);
    if (res.ok) {
      // console.log(res);
      const data = await res.json();
      console.log(data)
      setTip(data.answer);
      return data;
    } else {
      const err = await res.json();
      return err;
    }
  }

  return (
    <div>
      <h4>Here are some tips you can use as your tasks</h4>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(tip)}}>     
      </div>
      <button
        onClick={handleGenerateAI}
      >
        Generate it
      </button>
    </div>
  )
}