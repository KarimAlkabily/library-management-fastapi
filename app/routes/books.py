from fastapi import APIRouter

router=APIRouter()
books=[]
@router.get("/books")
def get_books():
    return books