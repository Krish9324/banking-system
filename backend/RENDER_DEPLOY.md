# Render Deployment Guide for Backend

## Prerequisites

1. Render account (sign up at https://render.com)
2. PostgreSQL database (can create on Render or use external like Neon)
3. GitHub repository with your backend code

## Step-by-Step Deployment

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Push your backend code to GitHub**
   ```bash
   cd backend
   git init  # if not already initialized
   git add .
   git commit -m "Backend ready for Render deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create New Web Service in Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend

3. **Configure Service Settings**

   **Basic Settings:**
   - **Name**: `banking-system-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if deploying from monorepo) or leave blank if backend is root

   **Build & Deploy:**
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

   **Advanced Settings:**
   - **Auto-Deploy**: `Yes` (deploys on every push)

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV = production
   DATABASE_URL = postgresql://user:password@host:5432/database?sslmode=require
   PORT = 10000 (Render sets this automatically, but you can specify)
   ```
   
   **Important**: 
   - Get your `DATABASE_URL` from your PostgreSQL provider
   - For Render PostgreSQL: Go to your database dashboard → "Connections" → "Internal Database URL"
   - For external (Neon/Supabase): Use the connection string they provide

5. **Create PostgreSQL Database (if using Render)**
   - Go to Dashboard → "New +" → "PostgreSQL"
   - Name: `banking-db` (or your choice)
   - Plan: Free tier is fine for testing
   - Copy the "Internal Database URL" and use it as `DATABASE_URL`

6. **Run Database Migrations**
   After first deployment, you need to run migrations:
   
   **Option A: Via Render Shell**
   - Go to your service → "Shell"
   - Run: `npx prisma migrate deploy`
   
   **Option B: Via Local Machine**
   ```bash
   # Set your production DATABASE_URL
   export DATABASE_URL="your-render-database-url"
   
   # Run migrations
   cd backend
   npx prisma migrate deploy
   ```

7. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (2-5 minutes)
   - Your API will be available at: `https://your-service-name.onrender.com`

### Option 2: Deploy via render.yaml (Infrastructure as Code)

1. **The `render.yaml` file is already created in your backend folder**

2. **In Render Dashboard:**
   - Go to "New +" → "Blueprint"
   - Connect your GitHub repo
   - Render will detect `render.yaml` automatically
   - Review and deploy

3. **Set Environment Variables:**
   - Still need to set `DATABASE_URL` manually in Render dashboard
   - Go to your service → "Environment" → Add `DATABASE_URL`

## Configuration Details

### Build Command
```bash
npm install && npx prisma generate
```
- Installs dependencies
- Generates Prisma Client for your database

### Start Command
```bash
npm start
```
- Runs `node src/server.js`
- Server listens on port from `PORT` env var (Render sets this automatically)

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |

## CORS Configuration

The backend is configured to allow:
- `https://banking-system-pearl.vercel.app` (your frontend)
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (alternative local)

If your frontend URL changes, update `backend/src/server.js` CORS configuration.

## Testing Deployment

1. **Test Health Endpoint**
   ```bash
   curl https://your-service-name.onrender.com/
   ```
   Should return: `{"status":"ok","message":"Bank API running"}`

2. **Test Signup**
   ```bash
   curl -X POST https://your-service-name.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"CUSTOMER"}'
   ```

3. **Test Login**
   ```bash
   curl -X POST https://your-service-name.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","role":"CUSTOMER"}'
   ```

## Update Frontend

After backend is deployed on Render, update your frontend `api.js`:

```javascript
const api = axios.create({
  baseURL: "https://your-service-name.onrender.com/api",
});
```

And set in Vercel environment variables:
```
VITE_API_URL=https://your-service-name.onrender.com/api
```

## Troubleshooting

### Build Fails
- Check that `DATABASE_URL` is set correctly
- Verify `prisma generate` runs successfully
- Check build logs in Render dashboard

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- For Render PostgreSQL, use "Internal Database URL" (not external)
- Check database is running and accessible

### CORS Errors
- Verify frontend URL is in CORS allowed origins in `server.js`
- Check that CORS middleware is applied before routes

### Migrations Not Applied
- Run `npx prisma migrate deploy` via Render Shell
- Or run locally with production `DATABASE_URL`

### Service Goes to Sleep (Free Tier)
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading to paid plan for always-on service

## Render Free Tier Limitations

- Services sleep after 15 min inactivity
- 750 hours/month free
- Slower cold starts
- For production, consider paid plan ($7/month for always-on)

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get Render backend URL
3. ⏭️ Update frontend API URL
4. ⏭️ Test full application
5. ⏭️ Share live URLs!

## Quick Checklist

- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created (Render or external)
- [ ] Web service created in Render
- [ ] Environment variables set (`DATABASE_URL`, `NODE_ENV`)
- [ ] Build successful
- [ ] Migrations run (`prisma migrate deploy`)
- [ ] Backend accessible via Render URL
- [ ] Health endpoint working
- [ ] Frontend updated with new backend URL
- [ ] CORS working (no errors in browser console)

