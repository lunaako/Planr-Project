from flask import Blueprint
from flask_login import login_required, current_user
from ..gpt import call_gpt
from app.models import Board

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
                  Please use this information to generate new suggested task categories and task cards. The reply should be less than 300 words.
                 '''
  return call_gpt(prompt_for_ai)