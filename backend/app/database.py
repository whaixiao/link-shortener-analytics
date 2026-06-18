from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Inicialización del cliente de Motor
client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]

async def check_db_connection():
    try:
        # Comando simple para verificar que la base de datos responde
        await client.admin.command('ping')
        print("Conexión exitosa a MongoDB")
    except Exception as e:
        print(f"Error al conectar a MongoDB: {e}")