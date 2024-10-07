import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import './BoardDetailPage.css';
import LoginFormPage from "../LoginFormPage";
import { getBoardsThunk} from "../../redux/board";
import { useParams } from "react-router-dom";
import Card from "../Card/Card";
import { getCardSectionsThunk } from "../../redux/cardSection";
import CardSection from "../CardSection/CardSection";

export default function BoardDetailPage() {
  const { id:boardId } = useParams();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.board);
  const cardSections = useSelector(state => state.cardSection);
  const cardSectionArr = Object.values(cardSections);
  const dispatch = useDispatch();

  const currBoard = boards[boardId];

  // console.log(cardSectionArr)

  useEffect(() => {
    dispatch(getBoardsThunk())
    dispatch(getCardSectionsThunk(boardId))
  }, [dispatch, boardId])

  if (!user) return (<LoginFormPage />)
  if (!currBoard) return <>Loading...</>

  return (
    <div className="board-container">
      <div className="board-header">
        <h2>{currBoard?.name}</h2>
      </div>

      {cardSectionArr.length ? 
        cardSectionArr.map(cardSec => {
          return <CardSection cardSec={cardSec} key={cardSec.id} />
        })
        :
        <button>Create Your Card!</button>
      }

    </div>
  )
}