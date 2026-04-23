from app.db import SessionLocal
from app.models.book import Book

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