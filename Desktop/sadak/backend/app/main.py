"""
Главный файл приложения FastAPI для Садака-Пасс
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router
import logging
import os

# Настройка логирования
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Садака-Пасс API",
    description="API для благотворительного Mini App в Telegram",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None
)

# CORS middleware
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port
    "https://*.vercel.app",  # Vercel preview deployments
]

# Добавляем продакшен домены из переменных окружения
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

# Валидация критичных настроек для продакшена
if settings.ENVIRONMENT == "production":
    if settings.SECRET_KEY == "your-secret-key-change-in-production":
        logger.warning("⚠️ SECRET_KEY не изменен! Используйте случайную строку в продакшене!")
    
    if not settings.DATABASE_URL or "localhost" in settings.DATABASE_URL:
        logger.warning("⚠️ DATABASE_URL указывает на localhost! Проверьте настройки БД!")
    
    if not settings.TELEGRAM_SECRET_KEY:
        logger.warning("⚠️ TELEGRAM_SECRET_KEY не настроен! Безопасность может быть снижена!")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if settings.ENVIRONMENT == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(api_router, prefix="/api/v1")

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info(f"🚀 Садака-Пасс API запущен (Environment: {settings.ENVIRONMENT})")
    if settings.ENVIRONMENT == "production":
        logger.info("✅ Продакшен режим активен")
    
    # Настройка периодических задач
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    from app.core.tasks import check_expired_campaigns_task
    
    scheduler = AsyncIOScheduler()
    
    # Проверка истечённых кампаний каждый час
    scheduler.add_job(
        check_expired_campaigns_task,
        'interval',
        hours=1,
        id='check_expired_campaigns',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("✅ Планировщик задач запущен (проверка истекших кампаний каждый час)")
    
    # Запускаем проверку сразу при старте
    try:
        await check_expired_campaigns_task()
    except Exception as e:
        logger.error(f"Ошибка при первоначальной проверке кампаний: {e}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Выключение Садака-Пасс API")


@app.get("/")
async def root():
    return {
        "message": "Садака-Пасс API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint для мониторинга"""
    from app.core.database import engine
    from sqlalchemy import text
    
    try:
        # Проверка подключения к БД
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "error"
    
    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "database": db_status,
        "environment": settings.ENVIRONMENT
    }

