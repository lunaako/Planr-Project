from app.models import db, environment, SCHEMA, CardSection
from sqlalchemy.sql import text
from .boards import board1, board2, board3, board4, board5

card_section1 = CardSection(
  board=board1, title='To do'
)

card_section2 = CardSection(
  board=board2, title='To do'
)

card_section3 = CardSection(
  board=board3, title='To do'
)

card_section4 = CardSection(
  board=board3, title='Doing'
)

card_section5 = CardSection(
  board=board1, title='Doing'
)

card_section6 = CardSection(
  board=board1, title='Done'
)
#!
card_section7 = CardSection(
  board=board4, title='Frontend'
)

card_section8 = CardSection(
  board=board4, title='Backend'
)

card_section9 = CardSection(
  board=board4, title='Stretch Goal'
)

card_section10 = CardSection(
  board=board4, title='Bugs'
)

card_section11 = CardSection(
  board=board5, title='Mon'
)

card_section12 = CardSection(
  board=board5, title='Tue'
)

card_section13 = CardSection(
  board=board5, title='Wed'
)

card_section14 = CardSection(
  board=board5, title='Thu'
)

card_section15 = CardSection(
  board=board5, title='Fri'
)


def seed_card_sections():
  db.session.add(card_section1)
  db.session.add(card_section2)
  db.session.add(card_section3)
  db.session.add(card_section4)
  db.session.add(card_section5)
  db.session.add(card_section6)
  db.session.add(card_section7)
  db.session.add(card_section8)
  db.session.add(card_section9)
  db.session.add(card_section10)
  db.session.add(card_section11)
  db.session.add(card_section12)
  db.session.add(card_section13)
  db.session.add(card_section14)
  db.session.add(card_section15)
  db.session.commit()

def undo_card_sections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.card_sections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM card_sections"))

    db.session.commit()