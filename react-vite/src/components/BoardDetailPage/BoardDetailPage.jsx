import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './BoardDetailPage.css';
import LoginFormPage from "../LoginFormPage";
import { getBoardsThunk} from "../../redux/board";
import { useParams } from "react-router-dom";
import Card from "../Card/Card";

export default function BoardDetailPage() {
  const { id:boardId } = useParams();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const currBoard = boards[boardId];
  const dispatch = useDispatch();

  // console.log(currBoard.CardSections[0].Cards)
  
  useEffect(() => {
    dispatch(getBoardsThunk())
  }, [dispatch])

  if (!user) return (<LoginFormPage />)
  if (!currBoard) return <>Loading...</>

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>{currBoard?.name}</h2>
      </div>

      {currBoard.CardSections?.length ?
        currBoard.CardSections?.map(cardSection => {
          return <div key={cardSection.id}>
                  <p>{cardSection.title}</p>
                  {cardSection.Cards?.map(card => {
                    return <Card card={card} />
                  })}
                </div>
        })
        :
        <button>Add a Card</button>
      }

    </div>
  )
}