# Debug: Why Collections Might Not Appear

## Possible Reasons:

1. **Form submission failed silently**
   - Check browser console for errors
   - Check Netlify function logs

2. **Data went to different database**
   - Collections only appear after first document is inserted
   - Form might not have submitted successfully

3. **Environment variable issue**
   - MongoDB connection string might be incorrect

## Quick Debug Steps:

### Step 1: Test Form Again
1. Go to your Netlify site
2. Open browser console (F12)
3. Fill out waitlist form
4. Submit and watch console for errors

### Step 2: Check Netlify Function Logs
1. Go to Netlify dashboard
2. Click "Functions" tab
3. Look for "waitlist" function
4. Check recent invocations and logs

### Step 3: Force Create Collection
You can manually create the collection:
1. In MongoDB Atlas, click "Create Collection"
2. Name it "user_waitlist"
3. Then test the form again

### Step 4: Verify Environment Variable
- In Netlify: Site Settings → Environment Variables
- Make sure MONGODB_URI is exactly:
  `mongodb+srv://udaytyagi:uday2006@cluster0.4vyv1dd.mongodb.net/gemini-ds-copilot?retryWrites=true&w=majority&appName=Cluster0`