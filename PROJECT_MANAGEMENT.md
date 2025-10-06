# Managing Multiple Projects

## 🎯 Your Projects & Ports

You have multiple projects that use similar ports. Here's how to manage them:

### Current Setup

**Strength Programs (This Project)**
- Frontend: http://localhost:5174 (changed from 5173 to avoid conflicts)
- Backend: http://localhost:8000
- Database: localhost:5432
- Container names: `strength_programs_*`

**Your Other Project**
- Frontend: http://localhost:5173 (original port)
- Runs directly with Node.js (not Docker)

---

## 🚦 Starting & Stopping Projects

### This Project (Strength Programs)

**Start:**
```bash
cd /Users/abordas/projects/cursor/strength_programs
docker-compose up
```

**Start in background (recommended):**
```bash
docker-compose up -d
```

**Stop:**
```bash
docker-compose down
```

**Stop and remove all data:**
```bash
docker-compose down -v
```

**Check if running:**
```bash
docker-compose ps
```

### Your Other Project

**Find if it's running:**
```bash
lsof -i :5173 | grep node
```

**Stop it:**
```bash
# Find the PID (process ID)
lsof -i :5173 | grep node

# Kill it (replace XXXXX with the actual PID)
kill XXXXX
```

**Or use pkill:**
```bash
pkill -f "node.*5173"
```

---

## 🔍 Quick Port Check

Use this to see what's running on your common ports:

```bash
# Check all your project ports at once
lsof -i :5173 -i :5174 -i :8000 -i :5432 | grep -v "COMMAND"
```

**What you'll see:**
- `node` = Your other project running directly
- `com.docker` or `docker` = Docker containers
- `postgres` = PostgreSQL database

---

## 📋 Daily Workflow

### When Starting Work on Strength Programs

```bash
# 1. Navigate to project
cd /Users/abordas/projects/cursor/strength_programs

# 2. Start Docker containers
docker-compose up -d

# 3. Check they're running
docker-compose ps

# 4. View logs (optional)
docker-compose logs -f
```

**Access your app:**
- Frontend: http://localhost:5174
- API Docs: http://localhost:8000/docs

### When Finishing Work

```bash
# Option 1: Leave it running (uses resources but faster to restart)
# Do nothing - it stays running

# Option 2: Stop containers (recommended)
docker-compose down

# Option 3: Stop and free up all resources
docker-compose down -v  # WARNING: Deletes database data!
```

---

## 🛑 Emergency: Stop Everything

If ports are conflicting or things aren't working:

```bash
# Stop all Docker containers
docker stop $(docker ps -q)

# Or just stop your Strength Programs containers
docker-compose down

# Kill any rogue Node processes
pkill -f "node.*vite"
pkill -f "node.*5173"
```

---

## 🔧 Changing Ports

If you need to change ports again, edit `docker-compose.yml`:

```yaml
ports:
  - "HOST_PORT:CONTAINER_PORT"
```

**Examples:**
- `"5174:5173"` = Access on localhost:5174, container uses 5173
- `"8000:8000"` = Access on localhost:8000, container uses 8000
- `"5432:5432"` = Access on localhost:5432, container uses 5432

After changing, restart:
```bash
docker-compose down
docker-compose up -d
```

---

## 📊 Understanding Docker vs Direct Node

### Docker (Strength Programs)
**Pros:**
- ✅ Isolated environment
- ✅ Easy to start/stop everything
- ✅ Same setup on any computer
- ✅ Includes database automatically

**Cons:**
- ❌ Uses more resources
- ❌ Slightly slower startup

**Commands:**
```bash
docker-compose up -d    # Start
docker-compose down     # Stop
docker-compose ps       # Check status
```

### Direct Node (Your Other Project)
**Pros:**
- ✅ Faster startup
- ✅ Uses less resources
- ✅ Direct file access

**Cons:**
- ❌ Manual setup required
- ❌ Harder to share with others
- ❌ Can forget it's running

**Commands:**
```bash
npm run dev             # Start
Ctrl+C                  # Stop (in terminal)
lsof -i :5173          # Check if running
kill <PID>             # Force stop
```

---

## 🎯 Best Practices

### 1. Always Check Before Starting

```bash
# Quick check script
echo "=== Port 5173 (Other Project) ==="
lsof -i :5173 | grep -v COMMAND

echo "=== Port 5174 (Strength Programs) ==="
lsof -i :5174 | grep -v COMMAND

echo "=== Port 8000 (Backend) ==="
lsof -i :8000 | grep -v COMMAND

echo "=== Docker Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

Save this as `check-ports.sh` and run it before starting work!

### 2. Use Docker Desktop

If you have Docker Desktop installed:
- Open it to see all running containers
- Click containers to stop them
- Visual interface is easier than commands

### 3. Create Aliases

Add these to your `~/.bashrc` or `~/.zshrc`:

```bash
# Strength Programs shortcuts
alias sp-start="cd /Users/abordas/projects/cursor/strength_programs && docker-compose up -d"
alias sp-stop="cd /Users/abordas/projects/cursor/strength_programs && docker-compose down"
alias sp-logs="cd /Users/abordas/projects/cursor/strength_programs && docker-compose logs -f"
alias sp-status="cd /Users/abordas/projects/cursor/strength_programs && docker-compose ps"

# Port checking
alias check-ports="lsof -i :5173 -i :5174 -i :8000 -i :5432"
```

Then you can just type:
```bash
sp-start    # Start Strength Programs
sp-stop     # Stop it
sp-logs     # View logs
```

---

## 🐛 Troubleshooting

### "Port already in use"

**Problem:** Another process is using the port

**Solution:**
```bash
# Find what's using it
lsof -i :5174

# Kill it
kill <PID>

# Or change your port in docker-compose.yml
```

### "Cannot connect to Docker daemon"

**Problem:** Docker isn't running

**Solution:**
- Open Docker Desktop
- Wait for it to start
- Try again

### "Container name already exists"

**Problem:** Old container with same name exists

**Solution:**
```bash
docker rm strength_programs_frontend
docker rm strength_programs_backend
docker rm strength_programs_db

# Or remove all stopped containers
docker container prune
```

### Old Project Won't Stop

**Problem:** Node process keeps running

**Solution:**
```bash
# Nuclear option - kill all Node processes
pkill node

# Or find and kill specific one
ps aux | grep node
kill <PID>
```

---

## 📝 Quick Reference Card

**Start Strength Programs:**
```bash
cd /Users/abordas/projects/cursor/strength_programs
docker-compose up -d
```
Access: http://localhost:5174

**Stop Strength Programs:**
```bash
docker-compose down
```

**Check What's Running:**
```bash
docker ps
lsof -i :5174
```

**View Logs:**
```bash
docker-compose logs -f
```

**Restart After Code Changes:**
```bash
docker-compose restart
```

---

## 🎊 Summary

**Your Strength Programs app is now on port 5174 to avoid conflicts!**

- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

You can now run both projects simultaneously if needed, or easily stop/start them independently.

**Pro Tip:** Always run `docker-compose down` when you're done working to free up system resources!

