from fastapi import APIRouter, HTTPException
from app.schemas.book import Book
from app.services import book_service

router = APIRouter()

@router.get("/books")
def get_books():
    return book_service.get_all_books()

@router.get("/books/{book_id}")
def get_book(book_id: int):
    book = book_service.get_book(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/books")
def create_book(book: Book):
    return book_service.create_book(book)

@router.put("/books/{book_id}")
def update_book(book_id: int, book: Book):
    updated = book_service.update_book(book_id, book)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated

@router.delete("/books/{book_id}")
def delete_book(book_id: int):
    deleted = book_service.delete_book(book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "deleted", "book": deleted}


@router.post("/borrow")
def borrow_book(user_id:int,book_id:int):
    result= book_service.borrow_book(user_id,book_id)


    if result== "User Not Found":
        raise HTTPException(status_code=404,detail="User not found")
    
    if result == "Book Not Found":
        raise HTTPException(status_code=404, detail="Book not found")

    if result == "Book is aleardy borrowed":
        raise HTTPException(status_code=400, detail="Book already borrowed")

    return {"message": "Book borrowed successfully"}
    