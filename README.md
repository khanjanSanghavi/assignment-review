# Backend

- cd backend
- copy .env.example to .env and set DATABASE_URL and PORT
- npm install
- npx prisma generate
- npx prisma migrate dev --name init
- npm run dev (or node index.js)

  
# Frontend

- cd frontend
- npm install
- npm run dev
