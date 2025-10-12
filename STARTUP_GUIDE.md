# 🚀 The Battleship Program - Quick Start Guide

## Starting the Application

### 1. Start All Services
From the project root directory, run:
```bash
docker-compose up
```

This will start:
- **PostgreSQL Database** (port 5432)
- **FastAPI Backend** (http://localhost:8000)
- **React Frontend** (http://localhost:5174)

**Note:** The first time you run this, it may take a few minutes to build the images.

### 2. Access the Application
Open your browser and navigate to:
```
http://localhost:5174
```

### 3. Stop the Application
When you're done, press `Ctrl+C` in the terminal, then run:
```bash
docker-compose down
```

---

## Quick Reference

### Backend API Documentation
- **Swagger UI:** http://localhost:8000/docs
- **API Base URL:** http://localhost:8000/api

### Database
- **Host:** localhost
- **Port:** 5432
- **Database:** strength_programs
- **Username:** postgres
- **Password:** postgres

---

## Creating Your First Program

1. **Register an Account**
   - Navigate to http://localhost:5174
   - Click "Get Started" or "Register"
   - Fill in your details
   - Select role: "Coach" or "Athlete"

2. **Create a Program**
   - From the Dashboard, click "Create New Program"
   - **Step 1: Configure Program**
     - Enter a program name
     - Select number of lifts (3, 4, or 6)
     - Select sessions per week (3 or 4)
     - For each lift, enter the weights for:
       - **Heavy (H):** 85% of your 1RM
       - **Medium (M):** 75% of your 1RM
       - **Light (L):** 65% of your 1RM
   - **Step 2: Enter Rep Maxes**
     - For each lift at each intensity, enter how many reps you can complete
     - Example: If your Heavy Squat weight is 225 lbs, how many reps can you do? (e.g., 10)
   - Click "Generate Program"

3. **View Your Program**
   - **Weekly NL:** See total reps per intensity for each lift
   - **Week-by-Week:** Calendar view of all sessions in the week
   - **Day-by-Day:** Detailed view of a single session with suggested rep schemes
   - Use the week selector (1-8) to navigate through the 8-week program

4. **Program Features**
   - **Save & Finalize:** Give your program a name and change status from DRAFT to ACTIVE
   - **Reroll Dice:** 
     - Reroll all lifts for a week
     - Reroll individual lifts (click 🔄 next to each lift's dice)
   - **Export:**
     - Download as Markdown (Coach's View - full details)
     - Download as Markdown (Athlete's View - simplified)

---

## Understanding the Program

### The Battleship Logic
- The program uses **4-sided dice** with values: **1, 2, 4, 6**
- Each lift gets a unique dice roll each week
- Dice rolls determine the total reps (NL) for that lift at each intensity (H, M, L)
- Each week's dice roll is different from the previous week

### Intensity Levels
- **Heavy (H):** 85% of 1RM - Lower reps, maximal effort
- **Medium (M):** 75% of 1RM - Moderate reps and effort
- **Light (L):** 65% of 1RM - Higher reps, technique work

### Rep Schemes
- The app automatically suggests rep schemes based on your RM at each weight
- For Heavy: All reps must be completed, even if it means a final small set
- For Medium/Light: Remaining reps are distributed across previous sets to keep all reps within the ladder range

---

## Troubleshooting

### Port Already in Use
If you see an error about port 5174 being in use:
```bash
# Find the process using the port
lsof -i :5174

# Kill the process (replace PID with actual process ID)
kill <PID>

# Restart the application
docker-compose up
```

### Database Connection Issues
If the backend can't connect to the database:
```bash
# Stop all services
docker-compose down

# Remove volumes and restart fresh
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading
1. Check that all containers are running: `docker ps`
2. Check backend logs: `docker logs strength_programs_backend`
3. Check frontend logs: `docker logs strength_programs_frontend`

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up --build
```

---

## Project Structure

```
strength_programs/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Config & security
│   │   ├── db/          # Database setup
│   │   ├── models/      # SQLAlchemy models
│   │   ├── programs/    # Battleship logic
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── alembic/         # Database migrations
├── frontend/            # React frontend
│   └── src/
│       ├── components/  # Reusable components
│       ├── contexts/    # React contexts (Auth)
│       ├── pages/       # Page components
│       ├── services/    # API calls
│       ├── types/       # TypeScript types
│       └── utils/       # Helper functions
├── docs/                # Documentation
└── docker-compose.yml   # Docker orchestration
```

---

## Development Tips

### View Backend Logs
```bash
docker logs -f strength_programs_backend
```

### View Frontend Logs
```bash
docker logs -f strength_programs_frontend
```

### Access Database Directly
```bash
docker exec -it strength_programs_db psql -U postgres -d strength_programs
```

### Restart a Single Service
```bash
# Restart just the backend
docker restart strength_programs_backend

# Restart just the frontend
docker restart strength_programs_frontend
```

### Run Backend Commands
```bash
# Run Alembic migrations
docker exec strength_programs_backend alembic upgrade head

# Access Python shell
docker exec -it strength_programs_backend python
```

---

## Next Steps

- ✅ Create your first program
- ✅ Test the reroll functionality
- ✅ Export your program as Markdown
- ✅ Create programs for your athletes (if you're a coach)

For more details, see:
- **Build Plan:** `docs/build-plan.md`
- **API Documentation:** http://localhost:8000/docs (when backend is running)

---

## Need Help?

1. Check the logs: `docker logs strength_programs_backend`
2. Check the API docs: http://localhost:8000/docs
3. Verify all containers are running: `docker ps`
4. Try a fresh restart: `docker-compose down && docker-compose up`

---

**Happy training! 💪**

