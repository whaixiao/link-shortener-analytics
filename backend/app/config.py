from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGO_URI: str
    DATABASE_NAME: str
    PORT: int

    # Busca automáticamente el archivo .env en la raíz del backend
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()