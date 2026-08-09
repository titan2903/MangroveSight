from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from settings import settings

# In SQLAlchemy 2.0, standard PostgreSQL URLs are best represented with postgresql:// or postgresql+psycopg2://
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
