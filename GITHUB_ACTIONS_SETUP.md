# GitHub Actions Setup for Music Releases

This guide will help you set up GitHub Actions to automatically check for new music releases daily.

## 🚀 Quick Setup

### 1. Create GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VERCEL_URL` | Your Vercel app URL | `https://your-app.vercel.app` |
| `CRON_SECRET` | Random secure string | `your-super-secret-random-string-here` |

### 2. Update Your Cron Route

Make sure your `/api/cron/check-releases/route.ts` has the security check:

```typescript
const authHeader = request.headers.get('authorization')
const cronSecret = process.env.CRON_SECRET

if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 3. Deploy Your App

Push your code to GitHub and deploy to Vercel. The workflow file is already created at `.github/workflows/check-releases.yml`.

## 📅 Schedule Options

The workflow is set to run daily at 9:00 AM UTC. You can modify the schedule in `.github/workflows/check-releases.yml`:

```yaml
schedule:
  - cron: '0 9 * * *'  # Daily at 9 AM UTC
```

### Common Schedule Examples:

- `'0 9 * * *'` - Daily at 9:00 AM UTC
- `'0 9,21 * * *'` - Twice daily at 9:00 AM and 9:00 PM UTC
- `'0 */6 * * *'` - Every 6 hours
- `'0 9 * * 1'` - Every Monday at 9:00 AM UTC
- `'0 9 1 * *'` - First day of every month at 9:00 AM UTC

## 🔧 Manual Testing

### Test the API Endpoint

```bash
curl -X GET "https://your-app.vercel.app/api/cron/check-releases" \
  -H "Authorization: Bearer your-cron-secret"
```

### Test the GitHub Action

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Check Music Releases" workflow
4. Click "Run workflow" button
5. Click "Run workflow" to trigger manually

## 📊 Monitoring

### View Workflow Runs

1. Go to GitHub repository → Actions tab
2. Click on "Check Music Releases" workflow
3. View run history and logs

### Check Logs

Each run will show:
- HTTP status code
- Number of artists checked
- Number of new releases found
- Any errors that occurred

### Workflow Summary

GitHub Actions will create a summary for each run showing:
- ✅ Success status
- 📊 Statistics (artists checked, new releases found)
- ⏰ Next scheduled run time

## 🛠️ Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check that `CRON_SECRET` matches in both GitHub secrets and your Vercel environment variables
   - Verify the Authorization header format

2. **404 Not Found**
   - Ensure your Vercel app is deployed and accessible
   - Check that the URL in `VERCEL_URL` secret is correct

3. **500 Internal Server Error**
   - Check your Vercel function logs
   - Verify all environment variables are set in Vercel
   - Check Spotify API credentials

4. **Workflow Not Running**
   - GitHub Actions may be disabled for your repository
   - Check repository settings → Actions → General
   - Ensure the workflow file is in the correct location (`.github/workflows/`)

### Debug Steps

1. **Check Vercel Logs**:
   - Go to Vercel dashboard → Functions tab
   - Look for `/api/cron/check-releases` function logs

2. **Test API Manually**:
   ```bash
   curl -v -X GET "https://your-app.vercel.app/api/cron/check-releases" \
     -H "Authorization: Bearer your-cron-secret"
   ```

3. **Check GitHub Actions Logs**:
   - Go to Actions tab → Click on failed run
   - Expand the "Check for new music releases" step
   - Look for error messages

## 🔒 Security Notes

- The `CRON_SECRET` should be a long, random string
- Never commit secrets to your repository
- Use GitHub's secret management for sensitive data
- Consider rotating secrets periodically

## 📈 Performance

- GitHub Actions provides 2,000 minutes/month for free
- Each run takes about 10-30 seconds
- Daily runs = ~15 minutes/month (well within free tier)
- No additional costs for this setup

## 🎯 Next Steps

1. Set up the secrets in GitHub
2. Deploy your app to Vercel
3. Test the workflow manually
4. Monitor the first few automatic runs
5. Adjust the schedule if needed

Your music releases will now be automatically checked daily! 🎵
