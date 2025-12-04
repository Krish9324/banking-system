# Vercel Deployment Guide for Backend

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. PostgreSQL database (Neon, Supabase, Railway, etc.)
3. Vercel CLI installed (optional): `npm i -g vercel`

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your backend code to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `backend` folder as the root directory

3. **Configure Build Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `backend` (or leave blank if deploying from backend folder)
   - **Build Command**: `npm run build` (or `prisma generate`)
   - **Output Directory**: Leave blank
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   In Vercel dashboard, go to Project Settings → Environment Variables:
   
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   NODE_ENV=production
   ```
   
   **Important**: Use your production PostgreSQL connection string here.

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your API will be available at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to backend folder**
   ```bash
   cd backend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No (first time)
   - Project name: simple-banking-backend (or your choice)
   - Directory: ./
   - Override settings? No

5. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   # Paste your database URL when prompted
   
   vercel env add NODE_ENV
   # Enter: production
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Important Notes

### Prisma on Vercel

- Prisma Client is generated during the build process
- Make sure `prisma generate` runs in your build command
- Database migrations should be run separately (not during Vercel build)
- Use `prisma migrate deploy` on your local machine or CI/CD to apply migrations

### Running Migrations

Before deploying, run migrations on your production database:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

### API Endpoints

After deployment, your API will be available at:
- Base URL: `https://your-project.vercel.app`
- Health Check: `https://your-project.vercel.app/`
- Auth: `https://your-project.vercel.app/api/auth/login`
- Customer: `https://your-project.vercel.app/api/customer/accounts`
- Banker: `https://your-project.vercel.app/api/banker/customers`

### Update Frontend

After backend is deployed, update your frontend `api.js`:

```javascript
const api = axios.create({
  baseURL: "https://your-project.vercel.app/api",  // Update this
});
```

## Troubleshooting

### Build Fails
- Check that `prisma generate` is in build command
- Verify `DATABASE_URL` is set correctly
- Check build logs in Vercel dashboard

### Database Connection Issues
- Ensure `DATABASE_URL` includes `?sslmode=require` for production
- Verify database allows connections from Vercel IPs
- Check database credentials are correct

### Function Timeout
- Vercel free tier has 10s timeout on Hobby plan
- Consider upgrading or optimizing slow queries
- Use connection pooling for Prisma

### CORS Issues
- Backend already has CORS enabled
- If issues persist, update CORS config in `api/index.js`

## Testing Deployment

1. **Test Health Endpoint**
   ```bash
   curl https://your-project.vercel.app/
   ```
   Should return: `{"status":"ok","message":"Bank API running"}`

2. **Test Signup**
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"CUSTOMER"}'
   ```

3. **Test Login**
   ```bash
   curl -X POST https://your-project.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","role":"CUSTOMER"}'
   ```

## Next Steps

1. ✅ Backend deployed to Vercel
2. ⏭️ Deploy frontend (Vercel, Netlify, or other)
3. ⏭️ Update frontend API URL
4. ⏭️ Test full application flow

