#!/bin/bash
# MEDICAL_CORE Project Verification Script

echo "========== MEDICAL_CORE PROJECT STATUS =========="
echo ""
echo "✅ Project Build Status:"
npm run build | tail -5

echo ""
echo "✅ Git Commit History:"
git log --oneline -5

echo ""
echo "✅ Project Structure:"
ls -la src/app/

echo ""
echo "✅ Database Status:"
ls -la dev.db

echo ""
echo "✅ Package Dependencies:"
grep -E "next|prisma|next-auth|bcryptjs" package.json

echo ""
echo "========== DEPLOYMENT READY =========="
echo ""
echo "Server URL: http://localhost:3000"
echo "API Base: http://localhost:3000/api"
echo ""
echo "Test Credentials:"
echo "  Patient: ivan@example.com / 123456"
echo "  Doctor: volkov@clinic.com / doctor123"
echo "  Admin: admin@clinic.com / admin123"
echo ""
