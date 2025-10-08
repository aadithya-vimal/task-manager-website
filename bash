# Install Wrangler globally
pnpm add -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=task-manager