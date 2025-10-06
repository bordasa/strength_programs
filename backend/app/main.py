from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, programs, athletes

app = FastAPI(
    title="Strength Programs API",
    description="API for generating and managing strength training programs",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(programs.router, prefix="/api/programs", tags=["programs"])
app.include_router(athletes.router, prefix="/api/athletes", tags=["athletes"])


@app.get("/")
async def root():
    return {
        "message": "Strength Programs API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
