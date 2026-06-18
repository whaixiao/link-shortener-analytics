from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.database import check_db_connection
from app.config import settings

# ¡Esta es la variable que Uvicorn no encuentra!
app = FastAPI(title="Link Shortener con Analíticas API")

# Configuración de CORS para permitir peticiones desde el Frontend de React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await check_db_connection()

# Incluir las rutas
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)