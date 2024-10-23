from app.models import db, environment, SCHEMA, Card
from sqlalchemy.sql import text
from .card_sections import card_section1, card_section2, card_section3, card_section4, card_section5, card_section6, card_section7
from datetime import datetime, timedelta, timezone

card1 = Card(
  card_section=card_section1, name='Cancel Amazon Prime', description='check the price of it and cancel it', labels='Low Priority', due_date=datetime.now(timezone.utc) + timedelta(days=7), order=0
)

card2 = Card(
  card_section=card_section2, name='Go to Wholefoods', description='buy coffee beans', labels='Low Priority', due_date=datetime.now(timezone.utc) + timedelta(days=10), order=0
)

card3 = Card(
  card_section=card_section3, name='Go vet', description='take Nako to get vacinnated', labels='Low Priority', due_date=datetime.now(timezone.utc) + timedelta(days=10), order=0
)

card4 = Card(
  card_section=card_section4, name='Make trip plan', description='go to Portland', labels='Medium Priority', due_date=datetime.now(timezone.utc) + timedelta(days=7), order=0
)

card5 = Card(
  card_section=card_section1, name='Look Maui activities', description='make appointment if need', labels='Medium Priority', due_date=datetime.now(timezone.utc) + timedelta(days=7), order=1
)

card6 = Card(
  card_section=card_section1, name='Brush teeth for Nako', description='everyday', labels='Medium Priority', due_date=datetime.now(timezone.utc) + timedelta(days=7), order=2
)

card7 = Card(
  card_section=card_section1, name='Return pillow to UPS', description='before this Fri!!', labels='High Priority', due_date=datetime.now(timezone.utc) + timedelta(days=2), order=3
)

def seed_cards():
  db.session.add(card1)
  db.session.add(card2)
  db.session.add(card3)
  db.session.add(card4)
  db.session.add(card5)
  db.session.add(card6)
  db.session.add(card7)
  db.session.commit()

def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))

    db.session.commit()
