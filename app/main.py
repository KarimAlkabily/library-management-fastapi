from fastapi import FastAPI
from app.routes import books
from app.models import book
from app.db import engine


app=FastAPI()
app.include_router(books.router)

book.Base.metadata.create_all(bind=engine)