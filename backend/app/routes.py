from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.responses import RedirectResponse
from datetime import datetime
from app.models import URLCreate, URLResponse, AnalyticsResponse
from app.utils import generate_short_code
from app.database import db

router = APIRouter()

async def log_click_event(short_code: str, user_agent: str, ip_address: str):
    """Tarea asíncrona para registrar el clic sin retrasar la redirección del usuario."""
    click_data = {
        "short_code": short_code,
        "timestamp": datetime.utcnow(),
        "user_agent": user_agent,
        "ip_address": ip_address
    }
    await db.clicks.insert_one(click_data)

@router.post("/api/shorten", response_model=URLResponse)
async def create_short_url(payload: URLCreate, request: Request):
    short_code = generate_short_code()
    
    # Asegurar que el código no esté duplicado en la base de datos
    while await db.urls.find_one({"short_code": short_code}):
        short_code = generate_short_code()
        
    url_data = {
        "original_url": str(payload.original_url),
        "short_code": short_code,
        "created_at": datetime.utcnow()
    }
    await db.urls.insert_one(url_data)
    
    # Construye la URL corta usando la base del servidor actual
    base_url = str(request.base_url)
    return URLResponse(
        original_url=url_data["original_url"],
        short_code=short_code,
        short_url=f"{base_url}{short_code}"
    )

@router.get("/{short_code}")
async def redirect_to_original(short_code: str, request: Request, background_tasks: BackgroundTasks):
    url_data = await db.urls.find_one({"short_code": short_code})
    if not url_data:
        raise HTTPException(status_code=404, detail="Código de enlace no encontrado")
    
    # Extraer metadatos de la petición HTTP
    user_agent = request.headers.get("user-agent", "Unknown")
    ip_address = request.client.host if request.client else "127.0.0.1"
    
    # Delegar el guardado a BackgroundTasks para responder de inmediato
    background_tasks.add_task(log_click_event, short_code, user_agent, ip_address)
    
    return RedirectResponse(url=url_data["original_url"])

@router.get("/api/analytics/{short_code}", response_model=AnalyticsResponse)
async def get_analytics(short_code: str):
    # Verificar si el enlace existe primero
    url_data = await db.urls.find_one({"short_code": short_code})
    if not url_data:
        raise HTTPException(status_code=404, detail="Código de enlace no encontrado")
        
    # 1. Total de clics
    total_clicks = await db.clicks.count_documents({"short_code": short_code})
    
    # 2. Pipeline de agregación de MongoDB para agrupar clics por día (Formato: YYYY-MM-DD)
    pipeline = [
        {"$match": {"short_code": short_code}},
        {
            "$project": {
                "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}}
            }
        },
        {"$group": {"_id": "$date", "clicks": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
        {
            "$project": {
                "date": "$_id",
                "clicks": 1,
                "_id": 0
            }
        }
    ]
    
    cursor = db.clicks.aggregate(pipeline)
    timeline = await cursor.to_list(length=100)
    
    return AnalyticsResponse(
        short_code=short_code,
        total_clicks=total_clicks,
        timeline=timeline
    )