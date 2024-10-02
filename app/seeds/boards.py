from app.models import db, environment, SCHEMA, Board
from sqlalchemy.sql import text
from .users import demo, marnie, bobbie

board1 = Board(
  name='Demo\'s Daily', user=demo
)

board2 = Board(
  name='Marnie Plan', user=marnie
)

board3 = Board(
  name='Bobbie\'s Study Goal', user=bobbie
)

def seed_boards():
  db.session.add(board1)
  db.session.add(board2)
  db.session.add(board3)
  db.session.commit()

def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))

    db.session.commit()
