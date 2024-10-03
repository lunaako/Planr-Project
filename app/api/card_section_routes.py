from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import CardSection, Board, Card, db
from app.forms import CardSectionForm, CardForm


card_section_routes = Blueprint('card-sections', __name__)

@card_section_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_card_section(id):
  """
  Updates an existing card section if the user is logged in
  """
  card_section = CardSection.query.get(id)
  if not card_section:
    return {"message": "Card section couldn't be found"}, 404
  
  user_id = card_section.board.user_id
  if user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  form = CardSectionForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    card_section.title = form.data['title']
    db.session.commit()
    return card_section.to_dict_basic()
  
  return form.errors, 400


@card_section_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_card_section(id):
  """
  Deletes and existing card sectuin based on its id if the user is logged in
  """
  card_section = CardSection.query.get(id)
  if not card_section:
    return {"message": "Card section couldn't be found"}, 404
  
  user_id = card_section.board.user_id
  if user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  db.session.delete(card_section)
  db.session.commit()
  return {'message': 'Successfully deleted'}


#?---------------------------Card----------------------------
@card_section_routes.route('/<int:id>/cards')
@login_required
def get_cards(id):
  """
  Get all cards based on the card section when the user is logged in
  """
  card_section = CardSection.query.get(id)
  if not card_section:
    return {"message": "Card section couldn't be found"}, 404
  
  user_id = card_section.board.user_id
  if user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  return {'Cards': card_section.to_dict_card()['Cards']}


@card_section_routes.route('/<int:id>/cards', methods=['POST'])
@login_required
def create_card(id):
  """
  Create a new card based on its card section when the user logged in
  """
  card_section = CardSection.query.get(id)
  if not card_section:
    return {"message": "Card section couldn't be found"}, 404
  
  user_id = card_section.board.user_id
  if user_id != current_user.id:
    return {"message" : "Forbidden"}, 403
  
  form = CardForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    if not form.data['order']:
      max_order = Card.query.order_by(Card.order.desc()).first().order
      new_order = (max_order or 0) + 1
    else:
      new_order = form.data['order']

    new_card = Card(
      card_section_id = card_section.id,
      name = form.data['name'],
      description = form.data['description'],
      labels = form.data['labels'],
      due_date = form.data['due_date'],
      order = new_order
    )
    db.session.add(new_card)
    db.session.commit()
    return new_card.to_dict_basic(), 201
  
  return form.errors, 400
  
  