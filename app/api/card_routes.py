from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Card, CardSection, db
from app.forms import CardForm


card_routes = Blueprint('cards', __name__)


@card_routes.route('<int:cardId>', methods=['PUT'])
@login_required
def edit_card(cardId):
  card = Card.query.get(cardId)
  if not card:
    return {'message': 'Card couldn\'t be found'}, 404
  
  if card.to_dict_basic()['userId'] != current_user.id:
    return {"message" : "Forbidden"}, 403

  form = CardForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    card.name = form.data['name']
    card.description = form.data['description']
    card.labels = form.data['labels']
    card.due_date = form.data['due_date']
    db.session.commit()
    return card.to_dict_basic()
  
  return form.errors, 400


@card_routes.route('<int:cardId>', methods=['DELETE'])
@login_required
def delete_card(cardId):
  card = Card.query.get(cardId)
  if not card:
    return {"message": "Card couldn't be found"}
  
  if card.to_dict_basic()['userId'] != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  db.session.delete(card)
  db.session.commit()
  return {"message": "Successfully deleted"}