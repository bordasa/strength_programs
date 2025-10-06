# Strength Programs Platform

A web-based platform for coaches to generate, manage, and distribute customized strength training programs to athletes. Starting with "The Battleship" program with plans to expand to multiple training methodologies.

## 🎯 Project Status

**Phase 1.1: Project Setup** ✅ COMPLETE

- [x] Directory architecture created
- [x] Docker development environment configured
- [x] Backend skeleton (FastAPI) set up
- [x] Frontend skeleton (React + TypeScript) set up
- [x] Database models defined
- [x] Battleship program logic migrated
- [x] API endpoints scaffolded

**Next Steps:** Database migrations, authentication implementation

## 🏗️ Architecture

### Backend (FastAPI + PostgreSQL)
```
backend/
├── app/
│   ├── api/endpoints/     # API route handlers
│   ├── core/              # Config, security, utilities
│   ├── db/                # Database connection
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   ├── programs/          # Program generators (Battleship, etc.)
│   └── main.py            # FastAPI app
├── tests/                 # Backend tests
├── Dockerfile
└── requirements.txt
```

### Frontend (React + TypeScript + Tailwind)
```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── programs/     # Program-specific components
│   │   ├── auth/         # Authentication components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   ├── services/         # API client
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── Dockerfile
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Setup

1. **Clone and navigate to project:**
```bash
cd /Users/abordas/projects/cursor/strength_programs
```

2. **Create environment file:**
```bash
cp backend/env.example backend/.env
```

3. **Start all services:**
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **Backend API** on `http://localhost:8000`
- **Frontend** on `http://localhost:5173`

4. **Access the application:**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- API Health: http://localhost:8000/health

### Development Without Docker

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up PostgreSQL locally and update .env
# Then run:
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- **[Build Plan](docs/build-plan.md)** - Comprehensive development roadmap
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when running)

## 🎮 The Battleship Program

The Battleship is a strength training program that uses dice rolls to determine weekly volume:

- **Duration:** 8 weeks
- **Lifts:** 3, 4, or 6 lift options
- **Intensities:** Heavy (H), Medium (M), Light (L)
- **Mechanics:** 2d6 rolls determine NL (Number of Lifts/total reps)
- **Rep Ladders:** Based on individual lift RM (Rep Max)

### Example Usage

```python
# Generate a Battleship program
from app.programs.battleship import generate_battleship_program

program = generate_battleship_program(
    num_lifts=4,
    lift_rms={
        "upper_body_press": 10,
        "upper_body_pull": 12,
        "hip_hinge": 8,
        "squat": 9
    }
)
```

## 🔑 Key Features (Planned)

### Phase 1: The Battleship
- ✅ Program generation with dice mechanics
- ⏳ User authentication (Coach/Athlete roles)
- ⏳ Program creation interface
- ⏳ Week-by-week program display
- ⏳ PDF export for printing
- ⏳ Athlete management for coaches

### Phase 2: Multi-Program Platform
- ⏳ Additional programs (5/3/1, Texas Method, etc.)
- ⏳ Progress tracking
- ⏳ Workout logging
- ⏳ Analytics and charts

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Database Migrations

Using Alembic for database migrations:

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🔒 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/strength_programs
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Frontend
```
VITE_API_URL=http://localhost:8000
```

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

Private project - All rights reserved

## 🎯 Roadmap

See the detailed [Build Plan](docs/build-plan.md) for the complete development roadmap.

### Immediate Next Steps
1. Set up Alembic and create initial database migration
2. Implement user authentication endpoints
3. Build program creation form in frontend
4. Create program display components
5. Add PDF export functionality

## 📞 Contact

For questions or feedback, contact the project owner.

---

**Built with:** FastAPI • React • TypeScript • PostgreSQL • Docker • Tailwind CSS
