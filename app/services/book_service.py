from app.db import SessionLocal
from app.models.book import Book
from app.models.borrow import BorrowRecord
from app.models.user import User
from app.schemas.user import UserCreate,UserLogin
from app.utils.security import hash_password,verify_password
from app.utils.jwt import cerate_access_token
from datetime import datetime 

def get_all_books():
    db= SessionLocal()
    books= db.query(Book).all()
    db.close()
    return books

def get_book(book_id):
    db= SessionLocal()
    book= db.query(Book).filter(Book.id == book_id).first()
    db.close()
    return book

def create_book(book_data):
    db= SessionLocal()
    book= Book(title=book_data.title, author= book_data.author)
    db.add(book)
    db.commit()
    db.refresh(book)
    db.close()
    return book
    

def update_book(book_id, book_data):
    db= SessionLocal()
    book= db.query(Book).filter(Book.id==book_id).first()

    if not book:
        db.close()
        return None
    
    book.title= book_data.title
    book.author= book_data.author

    db.commit()
    db.refresh(book)
    db.close()
    return book

def delete_book(book_id):
    db= SessionLocal()

    book= db.query(Book).filter(Book.id==book_id).first()

    if not book:
        db.close()
        return None
    
    db.delete(book)
    db.commit()
    db.close()
    return book



#..
def borrow_book(user_id,book_id):
    db= SessionLocal()

    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        db.close()
        return "user_not_found"
    

    
    book=db.query(Book).filter(Book.id==book_id).first()
    if not book:
        db.close()
        return "book_not_found"

    borrowed=db.query(BorrowRecord).filter(BorrowRecord.book_id==book_id).first()
    if borrowed:
        db.close()
        return "book_already_borrowed"
    

    user_books_count = db.query(BorrowRecord).filter(BorrowRecord.user_id == user_id).count()

    if user_books_count >=3:
        db.close()
        return "limit_exceeded"


    borrow= BorrowRecord(user_id=user_id,book_id=book_id)
    db.add(borrow)
    db.commit()
    db.close()

    return "success"




#..
def return_book(user_id,book_id):
    db=SessionLocal()

    record=db.query(BorrowRecord).filter(
        BorrowRecord.user_id==user_id,
        BorrowRecord.book_id==book_id,
        BorrowRecord.returned == False
                                        ).first()
    
    if not record:
        db.close()
        return "Record Not Found"
    
    record.returned = True
    record.returned_at = datetime.utcnow()
    db.commit()
    db.close()

    return "Success"

#..
def create_user(user_data: UserCreate):
    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        db.close()
        return "email_exists"
    
    hashed_password = hash_password(user_data.password)

    user= User(
        username=user_data.username,
        email=user_data.email,
        password= hashed_password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    return user


#..
def login_user(user_data: UserLogin):
    db = SessionLocal()

    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        db.close()
        return "invalid_credentials"

    # verify password
    if not verify_password(user_data.password, user.password):
        db.close()
        return "invalid_credentials"
    token=cerate_access_token({"user_id":user.id})
    db.close()
    return token


#..history
def get_user_history(user_id):
    db = SessionLocal()

    records = db.query(BorrowRecord).filter(
        BorrowRecord.user_id == user_id
    ).all()

    db.close()
    return records






    

    

