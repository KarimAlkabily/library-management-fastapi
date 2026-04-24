#Books Module

* GET    /books        → كل الكتب
* GET    /books/{id}   → كتاب واحد
* POST   /books        → إضافة كتاب
* PUT    /books/{id}   → تعديل
* DELETE /books/{id}   → حذف

## Relations

![Database Diagram](./Relations.png)


###User->borrow->book
1-book shoud be exist
2-check user exist
3-book not borrowed
4-make history to borrow_records

###return
*if record(user_id+book_id) is exist Delete it

###Flow login
User → login → verify password → generate token → return token


