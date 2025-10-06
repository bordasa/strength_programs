# Getting Started with Strength Programs Platform

## 🎉 Welcome!

Your project architecture is now complete! Here's how to get started.

## ✅ What's Been Set Up

1. **Backend (FastAPI)**
   - ✅ API endpoints for auth, programs, and athletes
   - ✅ Database models (User, Athlete, Program, etc.)
   - ✅ Battleship program logic migrated and enhanced
   - ✅ Security utilities (JWT, password hashing)
   - ✅ Alembic for database migrations

2. **Frontend (React + TypeScript)**
   - ✅ Vite build setup
   - ✅ React Router for navigation
   - ✅ TanStack Query for API calls
   - ✅ Tailwind CSS for styling
   - ✅ Basic app structure

3. **DevOps**
   - ✅ Docker Compose configuration
   - ✅ PostgreSQL database setup
   - ✅ Development environment ready

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Services

```bash
# Make sure you're in the project directory
cd /Users/abordas/projects/cursor/strength_programs

# Start everything with Docker
docker-compose up --build
```

Wait for all services to start. You'll see:
- `strength_programs_db` - PostgreSQL
- `strength_programs_backend` - FastAPI
- `strength_programs_frontend` - React

### Step 2: Run Database Migrations

Open a new terminal and run:

```bash
# Enter the backend container
docker exec -it strength_programs_backend bash

# Run migrations
alembic upgrade head

# Exit container
exit
```

### Step 3: Access the Application

- **Frontend:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs
- **API Health:** http://localhost:8000/health

## 📋 Next Development Tasks

Based on the build plan, here's what to work on next:

### Task 1: Test the Battleship Program Logic ✅ READY NOW

You can test the Battleship program generation right away:

```bash
# Enter backend container
docker exec -it strength_programs_backend bash

# Start Python shell
python

# Test the program
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

print(program)
```

### Task 2: Create Initial Database Migration

```bash
docker exec -it strength_programs_backend bash
alembic revision --autogenerate -m "Initial tables"
alembic upgrade head
```

### Task 3: Test API Endpoints

Visit http://localhost:8000/docs to see interactive API documentation.

Try the health check:
```bash
curl http://localhost:8000/health
```

### Task 4: Build Authentication UI

Create login/register forms in the frontend:
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/auth/RegisterForm.tsx`
- `frontend/src/pages/LoginPage.tsx`

### Task 5: Build Program Creation Form

Create the form to generate Battleship programs:
- `frontend/src/components/programs/ProgramForm.tsx`
- `frontend/src/pages/CreateProgramPage.tsx`

## 🛠️ Development Workflow

### Making Backend Changes

1. Edit files in `backend/app/`
2. FastAPI will auto-reload (watch the logs)
3. Test at http://localhost:8000/docs

### Making Frontend Changes

1. Edit files in `frontend/src/`
2. Vite will hot-reload automatically
3. See changes at http://localhost:5173

### Adding Database Changes

1. Modify models in `backend/app/models/`
2. Create migration: `alembic revision --autogenerate -m "description"`
3. Review the migration file in `backend/alembic/versions/`
4. Apply: `alembic upgrade head`

### Installing New Dependencies

**Backend:**
```bash
# Add to requirements.txt, then:
docker-compose down
docker-compose up --build
```

**Frontend:**
```bash
docker exec -it strength_programs_frontend npm install <package>
```

## 🐛 Troubleshooting

### Port Already in Use

If you get port errors:
```bash
# Check what's using the port
lsof -i :5432  # PostgreSQL
lsof -i :8000  # Backend
lsof -i :5173  # Frontend

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# View database logs
docker logs strength_programs_db

# Restart just the database
docker-compose restart db
```

### Frontend Not Loading

```bash
# Check frontend logs
docker logs strength_programs_frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Backend Errors

```bash
# Check backend logs
docker logs strength_programs_backend

# Enter container to debug
docker exec -it strength_programs_backend bash
```

## 📚 Useful Commands

### Docker Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild everything
docker-compose up --build

# View logs
docker-compose logs -f

# Enter a container
docker exec -it strength_programs_backend bash
```

### Database Commands
```bash
# Connect to PostgreSQL
docker exec -it strength_programs_db psql -U postgres -d strength_programs

# Backup database
docker exec strength_programs_db pg_dump -U postgres strength_programs > backup.sql

# Restore database
docker exec -i strength_programs_db psql -U postgres strength_programs < backup.sql
```

### Alembic Commands
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history

# View current version
alembic current
```

## 🎯 Development Phases

### Phase 1.2: Backend Core (Current)
- [ ] Create initial database migration
- [ ] Test user registration endpoint
- [ ] Test login endpoint
- [ ] Test program creation endpoint
- [ ] Add proper error handling

### Phase 1.3: Frontend Core (Next)
- [ ] Set up API client service
- [ ] Create authentication context
- [ ] Build login/register pages
- [ ] Build program creation form
- [ ] Build program display component

### Phase 1.4: Integration
- [ ] Connect frontend to backend
- [ ] Test full user flow
- [ ] Add loading states
- [ ] Add error handling
- [ ] Polish UI/UX

## 📖 Learning Resources

### FastAPI
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

### React + TypeScript
- React Docs: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/

### SQLAlchemy
- Docs: https://docs.sqlalchemy.org/
- ORM Tutorial: https://docs.sqlalchemy.org/en/20/tutorial/

### Docker
- Getting Started: https://docs.docker.com/get-started/
- Compose: https://docs.docker.com/compose/

## 💡 Tips

1. **Keep Docker running** - Leave `docker-compose up` running in a terminal
2. **Use the API docs** - http://localhost:8000/docs is your friend
3. **Check logs often** - `docker-compose logs -f` shows all logs
4. **Test incrementally** - Test each feature as you build it
5. **Commit often** - Save your progress with git commits

## 🎊 You're Ready!

Everything is set up and ready to go. Start with testing the Battleship program logic, then move on to building out the authentication system.

Good luck with your development! 💪

---

**Questions?** Refer to the [Build Plan](docs/build-plan.md) for detailed architecture and planning information.
