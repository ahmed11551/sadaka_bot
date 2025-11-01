"""
Сервис для интеграции с API e-replika.ru
"""
import httpx
from typing import Dict, Any, Optional, List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EReplikaService:
    """Сервис для работы с API e-replika.ru"""
    
    def __init__(self):
        self.base_url = settings.E_REPLIKA_API_URL
        self.token = settings.E_REPLIKA_AUTH_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    async def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Универсальный метод для запросов к API
        """
        url = f"{self.base_url}{endpoint}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                if method.upper() == "GET":
                    response = await client.get(url, headers=self.headers, params=params)
                elif method.upper() == "POST":
                    response = await client.post(url, headers=self.headers, json=data)
                elif method.upper() == "PUT":
                    response = await client.put(url, headers=self.headers, json=data)
                elif method.upper() == "DELETE":
                    response = await client.delete(url, headers=self.headers)
                else:
                    raise ValueError(f"Unsupported method: {method}")
                
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error for {endpoint}: {e.response.status_code} - {e.response.text}")
                raise
            except httpx.RequestError as e:
                logger.error(f"Request error for {endpoint}: {str(e)}")
                raise
            except Exception as e:
                logger.error(f"Unexpected error for {endpoint}: {str(e)}")
                raise
    
    # ========== СТАТИСТИКА ==========
    
    async def get_statistics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        group_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Получить статистику
        
        Args:
            start_date: Начальная дата (формат: YYYY-MM-DD)
            end_date: Конечная дата (формат: YYYY-MM-DD)
            group_by: Группировка (day, week, month)
        
        Returns:
            Словарь со статистикой
        """
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        if group_by:
            params["group_by"] = group_by
        
        return await self._make_request("GET", "/statistics", params=params)
    
    async def get_donations_statistics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Получить статистику по пожертвованиям"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        return await self._make_request("GET", "/statistics/donations", params=params)
    
    async def get_campaigns_statistics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Получить статистику по кампаниям"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        return await self._make_request("GET", "/statistics/campaigns", params=params)
    
    async def get_users_statistics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Получить статистику по пользователям"""
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        return await self._make_request("GET", "/statistics/users", params=params)
    
    # ========== СИНХРОНИЗАЦИЯ ДАННЫХ ==========
    
    async def sync_donation(self, donation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Синхронизировать пожертвование с внешней базой
        
        Args:
            donation_data: Данные пожертвования
        
        Returns:
            Результат синхронизации
        """
        return await self._make_request("POST", "/donations/sync", data=donation_data)
    
    async def sync_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Синхронизировать кампанию с внешней базой
        
        Args:
            campaign_data: Данные кампании
        
        Returns:
            Результат синхронизации
        """
        return await self._make_request("POST", "/campaigns/sync", data=campaign_data)
    
    async def sync_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Синхронизировать пользователя с внешней базой
        
        Args:
            user_data: Данные пользователя
        
        Returns:
            Результат синхронизации
        """
        return await self._make_request("POST", "/users/sync", data=user_data)
    
    # ========== ПОЛУЧЕНИЕ ДАННЫХ ИЗ ВНЕШНЕЙ БАЗЫ ==========
    
    async def get_users(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Получить список пользователей из внешней базы"""
        params = {"skip": skip, "limit": limit}
        if filters:
            params.update(filters)
        
        return await self._make_request("GET", "/users", params=params)
    
    async def get_donations(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Получить список пожертвований из внешней базы"""
        params = {"skip": skip, "limit": limit}
        if filters:
            params.update(filters)
        
        return await self._make_request("GET", "/donations", params=params)
    
    async def get_campaigns(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Получить список кампаний из внешней базы"""
        params = {"skip": skip, "limit": limit}
        if filters:
            params.update(filters)
        
        return await self._make_request("GET", "/campaigns", params=params)


# Глобальный экземпляр сервиса
e_replika_service = EReplikaService()

