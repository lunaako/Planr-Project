from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class CardSection(db.Model):
  __tablename__ = 'card_sections'

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}
  
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(50), nullable=False)
  board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id')), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
  updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

  #Relations
  board = db.relationship('Board', back_populates='card_sections')
  cards = db.relationship('Card', back_populates='card_section', cascade='all, delete-orphan')

  def to_dict_basic(self):
    return {
      "id": self.id,
      "title": self.title,
      "boardId": self.board_id,
      "createdAt": self.created_at,
      "updatedAt": self.updated_at
    }