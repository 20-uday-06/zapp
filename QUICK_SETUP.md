# Quick Setup Guide for Your Specific Setup

## Your MongoDB Connection Details:
- **Cluster**: cluster0.4vyv1dd.mongodb.net
- **Username**: udaytyagi
- **Database**: zapp (will be created automatically)

## Step-by-Step Setup:

### 1. Complete Your MongoDB Setup:
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Make sure you remember the password for user `udaytyagi`
3. If you forgot the password:
   - Go to "Database Access"
   - Find user `udaytyagi`
   - Click "Edit"
   - Click "Edit Password"
   - Set a new password and SAVE IT

### 2. Your Connection String:
```
mongodb+srv://udaytyagi:YOUR_PASSWORD_HERE@cluster0.4vyv1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Replace `YOUR_PASSWORD_HERE` with your actual password!**

### 3. Deploy to Netlify:
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your `zapp` repository
5. Click "Deploy site"

### 4. Add Environment Variable:
1. In your Netlify site dashboard
2. Go to "Site settings" → "Environment variables"
3. Click "Add variable"
4. **Key**: `MONGODB_URI`
5. **Value**: `mongodb+srv://udaytyagi:YOUR_ACTUAL_PASSWORD@cluster0.4vyv1dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
6. Click "Create variable"

### 5. Redeploy:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"

## Testing:
1. Visit your Netlify site URL
2. Fill out the waitlist form
3. Check MongoDB Atlas → Browse Collections to see your data

## Your Data Will Be Stored In:
- Database: `zapp`
- Collections: `user_waitlist` and `business_waitlist`

## ⚠️ Important Security Note:
Never put your actual password in any code files! Only add it to Netlify environment variables.