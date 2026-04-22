from fastapi import APIRouter
from app.schemas.book import Book

router=APIRouter()
books=[]

@router.get("/books")
def get_books():
    return books

@router.post("/books")
def create_book(book:Book):
    books.append(book)
    return book