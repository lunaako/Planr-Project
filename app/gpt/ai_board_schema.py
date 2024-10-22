from pydantic import BaseModel


class Card(BaseModel):
  title: str
  description: str

class CardSection(BaseModel):
  title: str
  cards: list[Card]

class Board(BaseModel):
  card_sections: list[CardSection]
  title: str