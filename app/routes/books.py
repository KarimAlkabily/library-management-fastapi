from fastapi import APIRouter
from app.schemas.book import Book
from fastapi import  HTTPException

router=APIRouter()
books=[]

@router.get("/books")
def get_books():
    return books

@router.get("/books/{book_id}")
def get_book(book_id:int):
    if book_id>=len(books):
        raise HTTPException(status_code=404, detail="Book not found")
    return books[book_id]

@router.post("/books")
def create_book(book:Book):
    books.append(book)
    return book

@router.put("/books/{book_id}")
def update_book(book_id:int,book:Book):
     if book_id>=len(books):
        raise HTTPException(status_code=404, detail="Book not found")
        books[book_id]=book
        return book

@router.delete("/books/{book_id}")
def delete_book(book_id:int):
    if book_id>=len(books):
        raise HTTPException(status_code=404, detail="Book not found")
    deleted_book = books.pop(book_id)
    return {"message":"Book deleted","book":deleted_book}
