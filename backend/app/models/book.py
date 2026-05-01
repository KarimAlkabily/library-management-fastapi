from app.db import Base
from sqlalchemy import Column,Integer,String

class Book(Base):
    __tablename__ ="books"

    id=Column(Integer,primary_key=True,)
    title=Column(String)
    author=Column(String)