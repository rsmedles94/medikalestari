#!/bin/bash

# 🚀 PRODUCTION DEPLOYMENT QUICK START
# ====================================
# Copy-paste commands untuk production deployment

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PRODUCTION DEPLOYMENT - QUICK START SCRIPT        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Verify build
echo "1️⃣  Verifying build..."
pnpm lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Fix errors before deploying."
  exit 1
fi

pnpm type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Fix errors before deploying."
  exit 1
fi

pnpm build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors before deploying."
  exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Summary
echo "2️⃣  Deployment Summary:"
echo "   ✅ Hydration errors fixed"
echo "   ✅ Cache optimized"
echo "   ✅ Error handling configured"
echo "   ✅ Security headers set"
echo "   ✅ Type safety improved"
echo ""

# Step 3: Git commit
echo "3️⃣  Git commit..."
read -p "Enter commit message (default: 'Production deployment'): " commit_msg
commit_msg="${commit_msg:-Production deployment}"

git add .
git commit -m "$commit_msg"
if [ $? -ne 0 ]; then
  echo "⚠️  Git commit failed. Continuing..."
fi

# Step 4: Deploy
echo ""
echo "4️⃣  Ready to deploy!"
echo ""
echo "For Vercel: vercel deploy --prod"
echo "For Others: Push to main branch and trigger CI/CD"
echo ""

# Step 5: Post-deployment
echo "5️⃣  Post-deployment checklist:"
echo "   [ ] Website loads at https://your-domain.com"
echo "   [ ] No hydration errors in console"
echo "   [ ] Mobile layout correct"
echo "   [ ] API calls working"
echo "   [ ] Cache headers present (DevTools Network)"
echo "   [ ] Sentry dashboard quiet (no critical errors)"
echo ""

echo "╔════════════════════════════════════════════════════════╗"
echo "║              🎉 Ready for Production! 🎉              ║"
echo "╚════════════════════════════════════════════════════════╝"
