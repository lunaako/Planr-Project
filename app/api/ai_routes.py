from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..gpt import call_gpt, call_gpt_with_schema, ai_board_schema
from app.forms import BoardSuggestionForm, BoardCreationForm
from app.models import Board, CardSection, Card, db



ai_routes = Blueprint('ai', __name__)


@ai_routes.route('/<int:board_id>', methods=['GET'])
@login_required
def get_ai_plan(board_id):
  board = Board.query.get(board_id)
  board_in_detail = board.to_dict_detail()
  prompt_board_info = {
    'board': {'name': board_in_detail['name']},
    'card_section': [{'title': cs['title'], 'cards': [{'name': card['name'], 'description': card['description'], 'labels': card['labels'], 'dueDate': card['dueDate']} for card in cs['Cards']]} for cs in board_in_detail['CardSections']]
  }

  prompt_for_ai = f'''
                  Based on the following board information, generate new task categories and task content to help optimize the current workflow. Please provide detailed task descriptions and priority recommendations.
                  Board Information:
                    {prompt_board_info}
                  Please use this information to generate new suggested task categories and task cards. The reply should be less than 50 words.
                 '''
  return {"answer": call_gpt(prompt_for_ai)}


@ai_routes.route('/board/suggestion', methods=['POST'])
@login_required
def get_board_ai_suggestion():
  """
  Create a new Board
  """  
  form = BoardSuggestionForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    description = form.data['description']
    prompt_for_ai = f'''
              Based on the following description, generate a board name, main categories as card sections, and card items to help planning the goal and subtasks.

              Request:
                {description}

              Please use this information to generate new suggested task categories and task cards. The reply should be less than 200 words and in natural language.
            '''
    return {"answer": call_gpt(prompt_for_ai)}

  return form.errors, 400

@ai_routes.route('/board/creation', methods=['POST'])
@login_required
def create_board_by_ai():
  """
  Create a new Board
  """  
  form = BoardCreationForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    suggestion = form.data['suggestion']
    description = form.data['description']
    #title = form.data['title']

    # prompt_for_ai = f'''
    #                 Based on the following description, generate a board name, main categories as card sections, and card items to help planning the goal and subtasks.

    #                 Request:
    #                   {description}

    #                 Please use this information to generate new suggested task categories and task cards. The reply should be less than 200 words and in natural language.
    #               '''

    prompt_for_ai = ''

    board = call_gpt_with_schema(description, suggestion, prompt_for_ai, ai_board_schema.Board)
    # print(board.title);
    # print(board.card_sections);
    # for card_section in board.card_sections:
    #   print(card_section.title)

    board_id = create_board(board)

    return {"board_id": board_id}
  
  return form.errors, 400
  
def create_board(board):
  #Create Board
  new_board = Board(name=board.title, user_id=current_user.id)
  db.session.add(new_board)
  db.session.commit()
  
  #Create Card Section
  for card_section in board.card_sections:
    new_card_section = CardSection(
      board_id = new_board.id,
      title = card_section.title
    )
    db.session.add(new_card_section)
    db.session.commit()
    count = 0
    for card in card_section.cards:
      print("here's card")
      print(card)
      new_card = Card(
        card_section_id = new_card_section.id,
        name = card.title,
        description = card.description,
        order = count
      )
      count += 1
      db.session.add(new_card)
      db.session.commit()
  return new_board.id