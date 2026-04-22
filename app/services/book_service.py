books = []

def get_all_books():
    return books

def get_book(book_id):
    if book_id >= len(books):
        return None
    return books[book_id]

def create_book(book):
    books.append(book)
    return book

def update_book(book_id, book):
    if book_id >= len(books):
        return None
    books[book_id] = book
    return book

def delete_book(book_id):
    if book_id >= len(books):
        return None
    return books.pop(book_id)