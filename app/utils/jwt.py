from jose import jwt ,JWTError
from datetime import datetime,timedelta
from app.db import SessionLocal
from app.models.user import User
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
security = HTTPBearer()

SECRET_KEY = "secret123"
ALGORITHM = "HS256"
#encode
def cerate_access_token(data: dict):
    to_encode =data.copy()
    expire= datetime.utcnow()+ timedelta(hours=2)
    to_encode.update({"exp":expire})

    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

#decode
def get_current_user(token:str):
    try:
        payload =jwt.decode(token,SECRET_KEY,algorithms=ALGORITHM)
        user_id=payload.get("user_id")
    except JWTError:
        return None
    
    db = SessionLocal()
    user = db.query(User).filter(User.id==user_id).first()

    db.close()

    return user




#admin
def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    
    token = credentials.credentials
    user = get_current_user(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return user