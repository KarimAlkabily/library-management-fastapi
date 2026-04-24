from fastapi import APIRouter, HTTPException
from app.schemas.book import Book
from app.services import book_service
from app.schemas.user import UserCreate

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


    if result== "user_not_found":
        raise HTTPException(status_code=404,detail=f"User not found: {user_id}")
    
    if result == "book_not_found":
        raise HTTPException(status_code=404, detail=f"Book not found: {book_id}")

    if result == "book_already_borrowed":
        raise HTTPException(status_code=400, detail="Book already borrowed")
    
    if result == "limit_exceeded":
        raise HTTPException(status_code=400, detail="Borrow limit exceeded")

    return {"message": "Book borrowed successfully"}


@router.post("/borrow/return")
def return_book(book_id:int,user_id:int):
    result = book_service.return_book(user_id,book_id)

    if result=="Record Not Found":
        raise HTTPException(status_code=404,detail="Borrow record not found")

    return {"message":"Book returnd successfully"}



#..
@router.post("/register")
def register(user:UserCreate):
    result= book_service.create_user(user)

    if result == "email_exists":
        raise HTTPException(status_code=400, detail="Email already exists")

    return result
    