from fastapi import FastAPI
from app.routes import books
from app.models import book,user
from app.db import engine,Base



app=FastAPI()
app.include_router(books.router)

Base.metadata.create_all(bind=engine)