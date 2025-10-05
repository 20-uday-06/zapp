# Troubleshooting Guide

## If Waitlist Form Doesn't Work:

### 1. Check Netlify Function Logs:
- Go to your Netlify dashboard
- Click on "Functions" tab
- Look for "waitlist" function
- Check the logs for errors

### 2. Check Browser Console:
- Open your website
- Press F12 to open developer tools
- Go to "Console" tab
- Fill out waitlist form
- Look for any error messages

### 3. Verify Environment Variable:
- Netlify dashboard → Site settings → Environment variables
- Make sure `MONGODB_URI` is set correctly
- Value should be: `mongodb+srv://udaytyagi:uday2006@cluster0.4vyv1dd.mongodb.net/gemini-ds-copilot?retryWrites=true&w=majority&appName=Cluster0`

### 4. Force Redeploy:
- Go to "Deploys" tab
- Click "Trigger deploy" → "Deploy site"
- Wait for deployment to complete

### 5. Test Different Browsers:
- Try Chrome, Firefox, Safari
- Make sure JavaScript is enabled

## Common Issues:

### "Function invocation failed"
- Environment variable not set or incorrect
- MongoDB connection string has typos

### "Network error" 
- Function didn't deploy properly
- Try redeploying

### Form submits but no success message
- Check browser console for JavaScript errors
- Verify Netlify functions are enabled

## Success Indicators:
- ✅ Form shows "Joining..." then "✓ Welcome to Zapp!"
- ✅ Success notification appears
- ✅ Data appears in MongoDB Atlas
- ✅ No errors in browser console