from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from datetime import datetime
import secrets
from fastapi.responses import RedirectResponse

app = FastAPI()

# Configuración de la base de datos MongoDB
MONGODB_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGODB_URL)
db = client["url_shortener"]
urls_collection = db["urls"]

# Esquema Pydantic para representar una URL
class URL(BaseModel):
    url_original: str
    codigo_corto: str
    fecha_creacion: datetime
    clics: int = 0

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/shorten")
async def shorten_url(url_data: URL):
    # Generar un código corto aleatorio de 6 caracteres
    codigo_corto = secrets.token_urlsafe(3)[:6]

    # Crear el documento a guardar en MongoDB
    new_url = {
        "url_original": url_data.url_original,
        "codigo_corto": codigo_corto,
        "fecha_creacion": datetime.utcnow(),
        "clics": 0
    }

    # Insertar el nuevo documento en la colección
    result = await urls_collection.insert_one(new_url)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Error al guardar la URL")

    return {"codigo_corto": codigo_corto}

@app.get("/{codigo}")
async def redirect_to_original(codigo: str):
    # Buscar el código en MongoDB
    url_document = await urls_collection.find_one({"codigo_corto": codigo})
    
    if not url_document:
        raise HTTPException(status_code=404, detail="URL no encontrada")
    
    # Incrementar el contador de clics
    url_document["clics"] += 1
    
    # Actualizar el documento en MongoDB
    await urls_collection.update_one({"codigo_corto": codigo}, {"$set": url_document})
    
    # Realizar la redirección HTTP
    return RedirectResponse(url=url_document["url_original"])
