"""
API v1 роутеры
"""
from fastapi import APIRouter
from app.api.v1 import funds, donations, subscriptions, campaigns, zakat, history, webhooks, admin

api_router = APIRouter()

api_router.include_router(funds.router, prefix="/funds", tags=["funds"])
api_router.include_router(donations.router, prefix="/donations", tags=["donations"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
api_router.include_router(zakat.router, prefix="/zakat", tags=["zakat"])
api_router.include_router(history.router, prefix="/me", tags=["history"])
api_router.include_router(webhooks.router, prefix="/payments/webhook", tags=["webhooks"])
api_router.include_router(admin.router, tags=["admin"])

