from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, validators
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
from datetime import datetime


def validate_due_date(form, field):
  due_date_str = field.data
  if due_date_str is None or due_date_str.strip() == "":
        return
  try: 
    print(due_date_str)
    due_date = datetime.fromisoformat(due_date_str)
    print(due_date)
    field.data = due_date
  except ValueError:
    print("Due date format error")

    raise ValidationError('Invalid due date format')


class CardForm(FlaskForm):
  name = StringField('name', validators=[
    DataRequired(message='Name is required'),
    Length(max=50, message='Name should be within 50 characters')
  ])

  labels = StringField('labels', validators=[
    Length(max=50, message='Label should be within 50 characters')
  ])

  description = TextAreaField('description', validators=[
    Length(max=500, message='Description should be within 500 characters')
  ])

  order = IntegerField('order')

  due_date = StringField('due_date', validators=[
    validate_due_date
  ])

