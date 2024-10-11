from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Favorite, Board, db

fav_routes = Blueprint('favorites', __name__)


@fav_routes.route('')
@login_required
def get_favs():
  '''
  Get all favorites based off of current user. returns a list of all favorites
  '''
  favs = Favorite.query.filter(Favorite.user_id == current_user.id).all()
  return [fav.to_dict_board() for fav in favs]


@fav_routes.route('', methods=['POST'])
@login_required
def create_fav():
  '''
  Create a favorite for current user
  '''
  board_id = request.get_json()['board_id']
  board = Board.query.get(board_id)
  if not board:
    return {"message": "Board couldn't be found"}, 404
  
  if board.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  existed_fav = Favorite.query.filter(Favorite.board_id == board_id).filter(Favorite.user_id == current_user.id).first()
  if existed_fav:
    return {'message': 'This board has already been favorited'}
  
  new_fav = Favorite(user_id=current_user.id, board_id=board_id)
  db.session.add(new_fav)
  db.session.commit()
  return new_fav.to_dict_board()
  

@fav_routes.route('/<int:fav_id>', methods=['DELETE'])
@login_required
def delete_fav(fav_id):
  '''
  Delete a favorite when a user logged in 
  '''
  fav = Favorite.query.get(fav_id)
  if not fav:
    return {"message": "Favorite couldn't be found"}, 404
  
  if fav.user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  db.session.delete(fav)
  db.session.commit()
  return {'message': 'Successfully deleted'}