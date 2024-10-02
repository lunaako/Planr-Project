from app.models import db, environment, SCHEMA, Favorite
from sqlalchemy.sql import text
from .users import demo, bobbie, marnie
from .boards import board1, board2, board3

fav1 = Favorite(
  user=demo, board=board1
)

fav2 = Favorite(
  user=marnie, board=board2
)

fav3 = Favorite(
  user=bobbie, board=board3
)

def seed_favorites():
  db.session.add(fav1)
  db.session.add(fav2)
  db.session.add(fav3)
  db.session.commit()

def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()