from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class BoardSuggestionForm(FlaskForm):
  description = StringField('description', validators=[
    DataRequired(message='description is required')
    ])
  
class BoardCreationForm(FlaskForm):
  description = StringField('description', validators=[
    DataRequired(message='description is required')])
  suggestion = StringField('suggestion', validators=[
    DataRequired(message='suggestion is required')])