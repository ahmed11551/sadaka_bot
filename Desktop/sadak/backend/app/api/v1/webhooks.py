"""
Вебхуки для платежных систем
"""
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import donation_service
from app.services.payment import payment_service
from app.models.donation import DonationStatus
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/yookassa")
async def yookassa_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Вебхук от YooKassa
    """
    try:
        body = await request.json()
        
        # Валидация подписи
        signature = request.headers.get("X-Yookassa-Signature")
        if not payment_service.verify_webhook("yookassa", body, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Обработка события
        event = body.get("event")
        payment = body.get("object", {})
        
        if event == "payment.succeeded":
            order_id = payment.get("metadata", {}).get("order_id")
            if order_id:
                donation = donation_service.update_donation_status(
                    db=db,
                    donation_id=int(order_id),
                    status=DonationStatus.COMPLETED,
                    payment_id=payment.get("id")
                )
                # Синхронизация обновленного статуса с e-replika.ru
                if donation:
                    from app.api.v1.donations import sync_donation_to_replika
                    from fastapi import BackgroundTasks
                    background_tasks = BackgroundTasks()
                    background_tasks.add_task(sync_donation_to_replika, donation.id)
                    # Выполняем синхронизацию асинхронно
                    import asyncio
                    try:
                        loop = asyncio.get_event_loop()
                        if loop.is_running():
                            asyncio.create_task(sync_donation_to_replika(donation.id))
                        else:
                            loop.run_until_complete(sync_donation_to_replika(donation.id))
                    except Exception as e:
                        logger.error(f"Error syncing donation status to e-replika: {e}")
        
        return {"status": "ok"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"YooKassa webhook error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail="Webhook processing error")


@router.post("/cloudpayments")
async def cloudpayments_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Вебхук от CloudPayments
    """
    try:
        body = await request.json()
        
        # Валидация подписи
        signature = request.headers.get("Content-HMAC")
        if not payment_service.verify_webhook("cloudpayments", body, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Обработка события
        transaction_status = body.get("Status")
        invoice_id = body.get("InvoiceId")
        
        if transaction_status == "Completed" and invoice_id:
            donation = donation_service.update_donation_status(
                db=db,
                donation_id=int(invoice_id),
                status=DonationStatus.COMPLETED,
                payment_id=body.get("TransactionId")
            )
            # Синхронизация обновленного статуса с e-replika.ru
            if donation:
                from app.api.v1.donations import sync_donation_to_replika
                import asyncio
                try:
                    loop = asyncio.get_event_loop()
                    if loop.is_running():
                        asyncio.create_task(sync_donation_to_replika(donation.id))
                    else:
                        loop.run_until_complete(sync_donation_to_replika(donation.id))
                except Exception as e:
                    logger.error(f"Error syncing donation status to e-replika: {e}")
        
        return {"status": "ok"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CloudPayments webhook error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail="Webhook processing error")

