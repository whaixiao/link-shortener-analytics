from pydantic import BaseModel, HttpUrl
from typing import List

class URLCreate(BaseModel):
    original_url: HttpUrl

class URLResponse(BaseModel):
    original_url: str
    short_code: str
    short_url: str

class ClickStat(BaseModel):
    date: str
    clicks: int

class AnalyticsResponse(BaseModel):
    short_code: str
    total_clicks: int
    timeline: List[ClickStat]