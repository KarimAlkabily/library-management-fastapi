from app.db import SessionLocal
from app.models.book import Book
from app.models.borrow import BorrowRecord
from app.models.user import User

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




def borrow_book(user_id,book_id):
    db= SessionLocal()

    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        db.close()
        return "User Not Found"
    

    
    book=db.query(Book).filter(Book.id==book_id).first()
    if not book:
        db.close()
        return "Book Not Found"
    


    borrowed=db.query(BorrowRecord).filter(BorrowRecord.book_id==book_id).first()

    if borrowed:
        db.close()
        return "Book is aleardy borrowed"
    


    borrow= BorrowRecord(user_id=user_id,book_id=book_id)

    db.add(borrow)
    db.commit()
    db.close()

    return "success"
    

    

