# Strength Programs Platform - Build Plan

## Project Overview
A web-based strength training platform for coaches to generate, manage, and distribute customized strength programs to athletes. Starting with "The Battleship" program with plans to expand to multiple training methodologies.

---

## Phase 1: The Battleship Program (MVP)

### Goals
- Accept user input: number of lifts (3, 4, or 6) and RM for each lift
- Define and store weekly templates
- Generate 8-week Battleship programs
- Display programs in a clean, week-by-week format
- Export programs as printable PDFs (monthly view)
- Basic athlete/coach user management

### Core Features
1. **Program Generator**
   - Input form for lift selection and RM values
   - Dice roll mechanics (2d6) for weekly variation
   - NL (Number of Lifts) calculation based on intensity
   - Rep ladder assignment based on RM

2. **Weekly Templates**
   - Define training day structures (which lifts on which days)
   - Intensity assignment per day per lift
   - Template library for different training splits

3. **Output & Display**
   - Week-by-week program view
   - Monthly calendar view
   - PDF export functionality
   - Print-optimized layouts

4. **User Management**
   - Coach accounts
   - Athlete/student accounts
   - Program assignment and tracking

---

## Phase 2: Multi-Program Platform

### Goals
- Add additional strength programs (5/3/1, Texas Method, etc.)
- Program comparison and selection tools
- Progress tracking and analytics
- Program switching/periodization

### Features
1. **Program Library**
   - Multiple program types
   - Program selection wizard
   - Program comparison tool

2. **Progress Tracking**
   - Log completed workouts
   - Track RM improvements
   - Visual progress charts

3. **Advanced Coach Tools**
   - Manage multiple athletes
   - Bulk program generation
   - Custom program templates
   - Notes and feedback system

---

## Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
  - Fast, modern, async support
  - Automatic API documentation (Swagger/OpenAPI)
  - Type hints and validation with Pydantic
  - Easy testing

- **Database:** PostgreSQL
  - Robust relational database
  - JSON support for flexible data structures
  - Good for production scaling

- **ORM:** SQLAlchemy 2.0
  - Powerful Python ORM
  - Async support
  - Migration management with Alembic

- **Authentication:** FastAPI-Users or JWT
  - Secure token-based auth
  - Role-based access control (Coach/Athlete)

- **PDF Generation:** WeasyPrint or ReportLab
  - HTML to PDF conversion
  - Custom styling support

### Frontend
- **Framework:** React 18 + TypeScript
  - Component-based architecture
  - Type safety
  - Large ecosystem

- **UI Library:** Tailwind CSS + shadcn/ui
  - Modern, responsive design
  - Pre-built accessible components
  - Easy customization

- **State Management:** TanStack Query (React Query)
  - Server state management
  - Caching and synchronization
  - Optimistic updates

- **Routing:** React Router v6
  - Client-side routing
  - Protected routes for auth

- **Forms:** React Hook Form + Zod
  - Type-safe form validation
  - Great UX with minimal re-renders

### DevOps & Deployment
- **Containerization:** Docker + Docker Compose
  - Consistent dev/prod environments
  - Easy local development

- **Hosting Options:**
  - **Backend:** Railway, Render, or Fly.io
  - **Frontend:** Vercel or Netlify
  - **Database:** Railway, Supabase, or managed PostgreSQL

- **CI/CD:** GitHub Actions
  - Automated testing
  - Automated deployment

---

## Database Schema (Initial)

### Users Table
```sql
- id (UUID, PK)
- email (unique)
- hashed_password
- role (coach/athlete)
- full_name
- created_at
- updated_at
```

### Athletes Table
```sql
- id (UUID, PK)
- user_id (FK to Users)
- coach_id (FK to Users, nullable)
- notes
```

### Programs Table
```sql
- id (UUID, PK)
- athlete_id (FK to Athletes)
- program_type (battleship, 531, etc.)
- created_by (FK to Users - coach)
- created_at
- start_date
- status (draft/active/completed)
```

### ProgramConfigs Table
```sql
- id (UUID, PK)
- program_id (FK to Programs)
- num_lifts (3/4/6)
- lift_rms (JSONB) - stores lift names and RM values
- weekly_template (JSONB) - stores template structure
```

### ProgramWeeks Table
```sql
- id (UUID, PK)
- program_id (FK to Programs)
- week_number (1-8)
- dice_roll_1
- dice_roll_2
- weekly_data (JSONB) - stores NL values for each lift/intensity
```

### WorkoutLogs Table (Phase 2)
```sql
- id (UUID, PK)
- athlete_id (FK to Athletes)
- program_week_id (FK to ProgramWeeks)
- date
- lift_name
- sets_completed (JSONB)
- notes
```

---

## API Endpoints (RESTful)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Programs
- `POST /api/programs` - Create new program
- `GET /api/programs` - List programs (filtered by user role)
- `GET /api/programs/{id}` - Get program details
- `PUT /api/programs/{id}` - Update program
- `DELETE /api/programs/{id}` - Delete program
- `GET /api/programs/{id}/pdf` - Export program as PDF

### Athletes (Coach only)
- `GET /api/athletes` - List coach's athletes
- `POST /api/athletes` - Add new athlete
- `GET /api/athletes/{id}` - Get athlete details
- `PUT /api/athletes/{id}` - Update athlete info

### Templates
- `GET /api/templates` - List available weekly templates
- `POST /api/templates` - Create custom template (coach)

### Workout Logs (Phase 2)
- `POST /api/logs` - Log a workout
- `GET /api/logs` - Get workout history
- `GET /api/logs/stats` - Get progress statistics

---

## Frontend Pages/Routes

### Public
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Athlete Dashboard
- `/dashboard` - Athlete home (current program overview)
- `/programs` - My programs list
- `/programs/:id` - Program detail view
- `/programs/:id/week/:weekNum` - Weekly workout view
- `/profile` - Profile settings

### Coach Dashboard
- `/coach/dashboard` - Coach home (athletes overview)
- `/coach/athletes` - Athletes list
- `/coach/athletes/:id` - Athlete detail
- `/coach/programs/new` - Create new program
- `/coach/programs/:id` - Program detail (with edit)
- `/coach/templates` - Manage templates

---

## Development Phases

### Phase 1.1: Project Setup (Week 1)
- [x] Initialize project structure
- [ ] Set up Docker development environment
- [ ] Configure PostgreSQL database
- [ ] Set up FastAPI backend skeleton
- [ ] Set up React frontend skeleton
- [ ] Configure environment variables
- [ ] Set up Git repository and .gitignore

### Phase 1.2: Backend Core (Week 2-3)
- [ ] Implement database models (SQLAlchemy)
- [ ] Set up Alembic migrations
- [ ] Implement authentication system
- [ ] Create user registration/login endpoints
- [ ] Migrate Battleship logic to backend service
- [ ] Create program generation endpoints
- [ ] Add API documentation

### Phase 1.3: Frontend Core (Week 3-4)
- [ ] Set up routing and navigation
- [ ] Create authentication flow (login/register)
- [ ] Build program creation form
- [ ] Create program display components
- [ ] Implement week-by-week view
- [ ] Add responsive design

### Phase 1.4: PDF Export & Polish (Week 5)
- [ ] Implement PDF generation
- [ ] Create print-optimized templates
- [ ] Add monthly view
- [ ] Testing and bug fixes
- [ ] UI/UX improvements

### Phase 1.5: Coach Features (Week 6)
- [ ] Athlete management interface
- [ ] Program assignment system
- [ ] Coach dashboard
- [ ] Multi-athlete view

### Phase 1.6: Deployment (Week 7)
- [ ] Set up production database
- [ ] Configure backend hosting
- [ ] Configure frontend hosting
- [ ] Set up CI/CD pipeline
- [ ] Domain and SSL setup

### Phase 1.7: Testing & Launch (Week 8)
- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Launch!

---

## Weekly Template System

### Template Structure
Each template defines:
- Training days per week (3-6 days)
- Which lifts are performed on which days
- Intensity level for each lift on each day

### Example Templates

#### 3-Day Full Body (3 Lifts)
```python
{
  "name": "3-Day Full Body",
  "days_per_week": 3,
  "schedule": {
    "day_1": {
      "upper_body_press": "H",
      "upper_body_pull": "M",
      "squat": "L"
    },
    "day_2": {
      "upper_body_press": "M",
      "upper_body_pull": "L",
      "squat": "H"
    },
    "day_3": {
      "upper_body_press": "L",
      "upper_body_pull": "H",
      "squat": "M"
    }
  }
}
```

#### 4-Day Upper/Lower Split (4 Lifts)
```python
{
  "name": "4-Day Upper/Lower",
  "days_per_week": 4,
  "schedule": {
    "day_1": {  # Upper Heavy
      "upper_body_press": "H",
      "upper_body_pull": "H",
      "hip_hinge": None,
      "squat": None
    },
    "day_2": {  # Lower Heavy
      "upper_body_press": None,
      "upper_body_pull": None,
      "hip_hinge": "H",
      "squat": "H"
    },
    "day_3": {  # Upper Light
      "upper_body_press": "L",
      "upper_body_pull": "L",
      "hip_hinge": None,
      "squat": None
    },
    "day_4": {  # Lower Medium
      "upper_body_press": None,
      "upper_body_pull": None,
      "hip_hinge": "M",
      "squat": "M"
    }
  }
}
```

#### 6-Day Push/Pull/Legs (6 Lifts)
```python
{
  "name": "6-Day PPL",
  "days_per_week": 6,
  "schedule": {
    "day_1": {  # Push Heavy
      "vert_press": "H",
      "horz_press": "M",
      # ... other lifts
    },
    # ... more days
  }
}
```

---

## Design Considerations

### User Experience
1. **Simplicity First:** The program generation should be quick (< 2 minutes)
2. **Mobile-Friendly:** Athletes should be able to view programs on phones at the gym
3. **Offline Access:** Consider PWA for offline program viewing
4. **Clear Visual Hierarchy:** Easy to scan workouts at a glance

### Performance
1. **Fast Program Generation:** Pre-calculate where possible
2. **Efficient PDF Generation:** Consider background jobs for large PDFs
3. **Caching:** Cache generated programs and static data
4. **Pagination:** For coaches with many athletes

### Security
1. **Data Privacy:** Athletes can only see their own programs
2. **Coach Verification:** Consider verification system for coaches
3. **Secure Password Storage:** bcrypt hashing
4. **JWT Expiration:** Reasonable token expiration times
5. **HTTPS Only:** Enforce SSL in production

### Scalability
1. **Stateless API:** Easy to scale horizontally
2. **Database Indexing:** Proper indexes on foreign keys
3. **Connection Pooling:** Efficient database connections
4. **CDN for Static Assets:** Fast frontend delivery

---

## Future Enhancements (Phase 3+)

### Advanced Features
- **Mobile Apps:** React Native iOS/Android apps
- **Video Library:** Exercise demonstration videos
- **Form Checks:** Video upload for form review
- **Community Features:** Forum, program sharing
- **Nutrition Integration:** Meal planning and tracking
- **Wearable Integration:** Sync with fitness trackers
- **AI Recommendations:** ML-based program suggestions
- **Marketplace:** Coaches can sell custom programs

### Analytics
- **Progress Visualization:** Charts and graphs
- **Strength Standards:** Compare to population norms
- **Predictive Analytics:** Estimate future progress
- **Volume Tracking:** Total volume over time

---

## Testing Strategy

### Backend Testing
- **Unit Tests:** Test individual functions (pytest)
- **Integration Tests:** Test API endpoints
- **Database Tests:** Test with test database
- **Load Testing:** Ensure performance under load

### Frontend Testing
- **Component Tests:** Test React components (Jest + React Testing Library)
- **E2E Tests:** Full user flows (Playwright or Cypress)
- **Visual Regression:** Catch UI bugs (Percy or Chromatic)

---

## Documentation Needs

1. **API Documentation:** Auto-generated from FastAPI
2. **User Guide:** How to use the platform
3. **Coach Guide:** How to manage athletes
4. **Developer Docs:** Setup and contribution guide
5. **Program Methodology:** Explain The Battleship program

---

## Success Metrics

### Phase 1 Launch Goals
- 10 coaches using the platform
- 50 athletes with active programs
- < 2 second program generation time
- < 5 second PDF generation time
- 95%+ uptime
- Positive user feedback

### Phase 2 Goals
- 50+ coaches
- 500+ athletes
- 3+ program types available
- Active workout logging usage
- Mobile app beta

---

## Budget Considerations

### Development Costs
- **Time Investment:** ~8 weeks for Phase 1 (solo dev)
- **Learning Curve:** React/FastAPI if new to stack

### Hosting Costs (Monthly Estimates)
- **Hobby/MVP:**
  - Railway/Render: $5-10/month (backend + DB)
  - Vercel/Netlify: Free tier (frontend)
  - **Total: ~$10/month**

- **Small Scale (50 users):**
  - Backend: $20/month
  - Database: $10/month
  - Frontend: Free
  - **Total: ~$30/month**

- **Medium Scale (500 users):**
  - Backend: $50/month
  - Database: $25/month
  - CDN/Storage: $10/month
  - **Total: ~$85/month**

### Monetization Options
- **Freemium:** Free for athletes, paid for coaches
- **Subscription:** $10-30/month per coach
- **One-time:** $100-300 lifetime license
- **Commission:** Take % if coaches charge athletes

---

## Risk Mitigation

### Technical Risks
- **Risk:** Complex program logic bugs
  - **Mitigation:** Comprehensive testing, gradual rollout

- **Risk:** Database performance issues
  - **Mitigation:** Proper indexing, query optimization, monitoring

- **Risk:** PDF generation slowness
  - **Mitigation:** Background jobs, caching, optimization

### Business Risks
- **Risk:** Low user adoption
  - **Mitigation:** Beta testing with real coaches, gather feedback

- **Risk:** Competition from existing platforms
  - **Mitigation:** Focus on unique Battleship methodology, coach-first design

- **Risk:** Data loss
  - **Mitigation:** Regular backups, database replication

---

## Next Steps

1. **Immediate (This Session):**
   - ✅ Create project structure
   - ✅ Write build plan
   - [ ] Set up development environment
   - [ ] Initialize Git repository

2. **This Week:**
   - [ ] Complete backend skeleton
   - [ ] Complete frontend skeleton
   - [ ] Get Docker running locally
   - [ ] First database migration

3. **Next Week:**
   - [ ] Implement authentication
   - [ ] Migrate Battleship logic
   - [ ] Build program creation form

---

## Questions to Answer During Development

1. Should athletes be able to create their own programs, or coach-only?
2. What level of customization should coaches have for templates?
3. Should there be a public program gallery/sharing feature?
4. How should we handle program modifications mid-cycle?
5. What happens when an athlete completes a program?
6. Should we support multiple concurrent programs per athlete?
7. How detailed should workout logging be in Phase 2?

---

## Resources & References

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- SQLAlchemy: https://docs.sqlalchemy.org/
- Tailwind CSS: https://tailwindcss.com/
- shadcn/ui: https://ui.shadcn.com/

### Tutorials
- FastAPI + React: https://testdriven.io/blog/fastapi-react/
- JWT Auth: https://fastapi.tiangolo.com/tutorial/security/
- Docker Compose: https://docs.docker.com/compose/

### Inspiration
- StrongLifts 5x5 app
- JEFIT workout planner
- TrainHeroic coaching platform

---

*Last Updated: October 5, 2025*
*Version: 1.0*
