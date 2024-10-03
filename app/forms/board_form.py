from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length

class BoardForm(FlaskForm):
  name = StringField('name', validators=[
    DataRequired(message='Name is required'),
    Length(max=50, message='Name should be within 50 characters')
    ])
  
  # user_id = IntegerField('user_id', validators=[DataRequired()])