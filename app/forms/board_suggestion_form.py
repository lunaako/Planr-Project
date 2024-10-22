from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length

class BoardSuggestionForm(FlaskForm):
  description = StringField('description', validators=[
    DataRequired(message='description is required'),
    Length(min=20, message='description should be longer than 20 characters')
    ])
  
class BoardCreationForm(FlaskForm):
  description = StringField('description', validators=[
    DataRequired(message='description is required')])
  suggestion = StringField('suggestion', validators=[
    DataRequired(message='suggestion is required')])