# Vercel Deployment Guide for Frontend

## Backend URL
Your backend is deployed at: **https://banking-system-backend-six.vercel.app/**

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Backend already deployed and working
3. Vercel CLI installed (optional): `npm i -g vercel`

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your frontend code to GitHub**
   ```bash
   cd frontend
   git init  # if not already initialized
   git add .
   git commit -m "Frontend ready for deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory (or deploy from root with frontend as subdirectory)

3. **Configure Build Settings**
   - **Framework Preset**: Vite (or Other)
   - **Root Directory**: `frontend` (if deploying from monorepo root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variables**
   In Vercel dashboard, go to Project Settings → Environment Variables:
   
   ```
   VITE_API_URL=https://banking-system-backend-six.vercel.app/api
   ```
   
   **Important**: 
   - Variable name must start with `VITE_` for Vite to expose it
   - Make sure to add this for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be available at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? No (first time)
   - Project name: simple-banking-frontend (or your choice)
   - Directory: ./
   - Override settings? No

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://banking-system-backend-six.vercel.app/api
   # Select: Production, Preview, Development
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Configuration Details

### API Configuration
The frontend is configured to use environment variables:
- **Development**: Uses `http://localhost:4000/api` (fallback)
- **Production**: Uses `VITE_API_URL` from environment variables

### Vercel Configuration (`vercel.json`)
- Framework: Vite
- Build output: `dist/`
- SPA routing: All routes redirect to `index.html` for React Router

## Testing Deployment

1. **Visit your deployed URL**
   - Example: `https://your-project.vercel.app`

2. **Test Signup**
   - Navigate to signup page
   - Create a new account
   - Should successfully create user

3. **Test Login**
   - Login with created credentials
   - Should redirect to dashboard

4. **Test Transactions**
   - Try depositing/withdrawing funds
   - Check if balance updates correctly
   - Verify transactions appear in history

5. **Test Banker Login**
   - Login as banker
   - Should see customer list
   - Click on customer to view transactions

## Troubleshooting

### API Connection Issues
- **Check Environment Variable**: Ensure `VITE_API_URL` is set correctly in Vercel
- **CORS Errors**: Backend already has CORS enabled, but verify backend URL is correct
- **Network Errors**: Check browser console for API call failures

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `vite.config.js` is correct
- Check build logs in Vercel dashboard

### Routing Issues (404 on refresh)
- Vercel config includes SPA rewrite rules
- If issues persist, verify `vercel.json` is in root of frontend folder

### Environment Variables Not Working
- Vite only exposes variables starting with `VITE_`
- Rebuild after adding environment variables
- Check variable is set for correct environment (Production/Preview/Development)

## Local Development After Deployment

For local development, create a `.env.local` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:4000/api
```

This will override the production URL when running `npm run dev` locally.

## Production URLs

After deployment, you'll have:
- **Frontend**: `https://your-frontend-project.vercel.app`
- **Backend**: `https://banking-system-backend-six.vercel.app`

## Next Steps

1. ✅ Backend deployed: https://banking-system-backend-six.vercel.app
2. ✅ Frontend configured for deployment
3. ⏭️ Deploy frontend to Vercel
4. ⏭️ Test full application
5. ⏭️ Share live URLs with interviewer!

## Quick Checklist

- [ ] Frontend code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variable `VITE_API_URL` set in Vercel
- [ ] Build successful
- [ ] Frontend accessible via Vercel URL
- [ ] Signup/Login working
- [ ] Transactions working
- [ ] Banker dashboard working

