from contextlib import asynccontextmanager

from app.services.scheduler_service import (
    start_scheduler,
    stop_scheduler,
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.database import models

from app.routes import (
    stocks,
    news,
    portfolio,
    automation,
    chat,
)
Base.metadata.create_all(bind=engine)
@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting FinAI...")

    start_scheduler()

    yield

    print("Stopping FinAI...")

    stop_scheduler()

app = FastAPI(
    title="FinAI API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    stocks.router,
    prefix="/api/stocks",
    tags=["Stocks"]
)
app.include_router(
    news.router,
    prefix="/api/news",
    tags=["News"]
)
app.include_router(
    portfolio.router,
    prefix="/api/portfolio",
    tags=["Portfolio"]
)
app.include_router(
    automation.router,
    prefix="/api/automation",
    tags=["Automation"],
)
app.include_router(
    chat.router,
    prefix="/api/chat",
    tags=["Chatbot"],
)

@app.get("/")
def home():

    return {
        "message": "Financial API running"
    }