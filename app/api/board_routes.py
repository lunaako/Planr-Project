from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Board, db

board_routes = Blueprint('boards', __name__)


@board_routes.route('/current')
@login_required
def get_user_boards():
  """
  Queries all the boards owned by the current user
  """
  boards = Board.query.filter_by(user_id=current_user.id).all()
  formal_board = [board.to_dict_basic() for board in boards]
  return {'Boards': formal_board}


@board_routes.route('/<int:boardId>')
@login_required
def get_detailed_board(boardId):
  """
  Queries a single board by id
  """  
  board = Board.query.get(boardId)
  if not board:
    return {"message": "Board couldn't be found"}
  return board.to_dict_detail()