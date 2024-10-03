from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Board, CardSection, db
from app.forms import BoardForm, CardSectionForm


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
    return {"message": "Board couldn't be found"}, 404
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  return board.to_dict_detail()


@board_routes.route('', methods=['POST'])
@login_required
def create_board():
  """
  Create a new Board
  """  
  form = BoardForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    new_board = Board(
      name=form.data['name'],
      user_id=current_user.id
    )
    db.session.add(new_board)
    db.session.commit()
    return new_board.to_dict_basic(), 201
  
  return form.errors, 400


@board_routes.route('/<int:boardId>', methods=['PUT'])
@login_required
def edit_board(boardId):
  """
  Updates an existing board if the user is logged in
  """
  board =Board.query.get(boardId)

  if not board:
    return {"message": "Board couldn't be found"}, 404
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  form = BoardForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    board.name = form.data['name']
    db.session.commit()
    return board.to_dict_basic()
  
  return form.errors, 400


@board_routes.route('/<int:boardId>', methods=['DELETE'])
@login_required
def delete_board(boardId):
  """
  Deletes and existing board based off its id if the user is logged in
  """
  board = Board.query.get(boardId)
  if not board:
    return {"message": "Board couldn't be found"}, 404
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  db.session.delete(board)
  db.session.commit()
  return {'message': 'Successfully deleted'}

#?---------------------------Card Section----------------------------
@board_routes.route('/<int:boardId>/card-sections')
@login_required
def get_card_sections(boardId):
  """
  Get all cardSections from a board when user is logged in
  """
  board = Board.query.get(boardId)
  if not board:
    return {"message": "Board couldn't be found"}, 404
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  return {"CardSections": board.to_dict_detail()['CardSections']}


@board_routes.route('/<int:boardId>/card-sections', methods=['POST'])
@login_required
def create_card_section(boardId):
  """
  Create a cardSection from a board when user is logged in
  """
  board = Board.query.get(boardId)
  if not board:
    return {"message": "Board couldn't be found"}, 404
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  form = CardSectionForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    new_card_section = CardSection(
      board_id = board.id,
      title = form.data['title']
    )
    db.session.add(new_card_section)
    db.session.commit()
    return new_card_section.to_dict_basic()
  
  return form.errors, 400
