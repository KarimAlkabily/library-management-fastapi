from sqlalchemy import Column, Integer, ForeignKey,Boolean,DateTime
from app.db import Base
from datetime import datetime


class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))

    returned=Column(Boolean,default=False)
    Borrowed_at=Column(DateTime,default=datetime.utcnow)
    returned_at=Column(DateTime,nullable=True)