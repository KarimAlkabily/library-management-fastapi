from fastapi import APIRouter, HTTPException
from app.schemas.book import Book
from app.services import book_service
from app.schemas.user import UserCreate,UserLogin
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import get_current_user
from app.utils.jwt import get_current_admin
security = HTTPBearer()
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
def create_book(book: Book,user = Depends(get_current_admin)):
    return book_service.create_book(book)

@router.put("/books/{book_id}")
def update_book(book_id: int, book: Book,user = Depends(get_current_admin)):
    updated = book_service.update_book(book_id, book)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated

@router.delete("/books/{book_id}")
def delete_book(book_id: int,user = Depends(get_current_admin)):

    deleted = book_service.delete_book(book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "deleted", "book": deleted}


@router.post("/borrow")
def borrow_book(
    book_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    user = get_current_user(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = book_service.borrow_book(user.id, book_id)

    # error handling
    if result == "user_not_found":
        raise HTTPException(status_code=404, detail="User not found")

    if result == "book_not_found":
        raise HTTPException(status_code=404, detail="Book not found")

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


#..
@router.post("/login")
def login(user:UserLogin):
    result=book_service.login_user(user)

    if result == "invalid_credentials":
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"access_token": result}


#..history
@router.get("/history")
def get_history(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    user = get_current_user(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    history = book_service.get_user_history(user.id)

    return history
