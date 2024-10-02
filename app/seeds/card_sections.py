from app.models import db, environment, SCHEMA, CardSection
from sqlalchemy.sql import text
from .boards import board1, board2, board3

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


def seed_card_sections():
  db.session.add(card_section1)
  db.session.add(card_section2)
  db.session.add(card_section3)
  db.session.add(card_section4)
  db.session.commit()

def undo_card_sections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.card_sections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM card_sections"))

    db.session.commit()