# Quick Function Test

## Test if your Netlify function is working:

### Method 1: Direct Function Test
Open your browser and go to:
```
https://YOUR-SITE-NAME.netlify.app/.netlify/functions/waitlist
```

You should see an error message like "Method not allowed" - this means the function exists.

### Method 2: Test with curl (if you have it)
```bash
curl -X POST https://YOUR-SITE-NAME.netlify.app/.netlify/functions/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","type":"user"}'
```

### What to look for:
- ✅ Function responds (even with error) = Function is deployed
- ❌ 404 error = Function not deployed properly
- ❌ Timeout = Function has issues

## Common Issues:

### Issue 1: Environment Variable Missing
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Check if `MONGODB_URI` exists
- Value should be: `mongodb+srv://udaytyagi:uday2006@cluster0.4vyv1dd.mongodb.net/gemini-ds-copilot?retryWrites=true&w=majority&appName=Cluster0`

### Issue 2: Function Not Deployed
- Go to Netlify Dashboard → Functions tab
- Should see "waitlist" function listed
- If not there, redeploy the site

### Issue 3: JavaScript Errors
- Form might have JavaScript errors preventing submission
- Check browser console for errors