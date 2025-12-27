#!/bin/bash

# ================================================
# RHS MDM System V2.0 - Deployment Preparation Script
# This script helps prepare your system for deployment
# ================================================

echo "🚀 RHS MDM System V2.0 - Deployment Preparation"
echo "================================================"
echo ""

# Color codes for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ========================================
# Step 1: Check Node.js installation
# ========================================
echo "📋 Step 1: Checking Node.js installation..."
if command -v node &> /dev/null
then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js is NOT installed${NC}"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# ========================================
# Step 2: Check npm installation
# ========================================
echo ""
echo "📋 Step 2: Checking npm installation..."
if command -v npm &> /dev/null
then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm is installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm is NOT installed${NC}"
    exit 1
fi

# ========================================
# Step 3: Check Git installation
# ========================================
echo ""
echo "📋 Step 3: Checking Git installation..."
if command -v git &> /dev/null
then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git is installed: $GIT_VERSION${NC}"
else
    echo -e "${RED}❌ Git is NOT installed${NC}"
    echo "Please install Git from: https://git-scm.com/"
    exit 1
fi

# ========================================
# Step 4: Install dependencies
# ========================================
echo ""
echo "📦 Step 4: Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

# ========================================
# Step 5: Check .env file
# ========================================
echo ""
echo "🔐 Step 5: Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo -e "${YELLOW}⚠️  Please make sure all variables are configured!${NC}"
else
    echo -e "${YELLOW}⚠️  .env file NOT found${NC}"
    echo "Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env file and add your configuration!${NC}"
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
        exit 1
    fi
fi

# ========================================
# Step 6: Generate JWT Secret
# ========================================
echo ""
echo "🔑 Step 6: Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}✅ JWT Secret generated:${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}⚠️  Copy this and add to your .env file as JWT_SECRET${NC}"
echo ""

# ========================================
# Step 7: Test local server (optional)
# ========================================
echo ""
read -p "Do you want to test the server locally? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🧪 Testing local server..."
    echo "Starting server on http://localhost:3000"
    echo "Press Ctrl+C to stop"
    echo ""
    npm start
fi

# ========================================
# Step 8: Git initialization
# ========================================
echo ""
echo "📤 Step 8: Git repository setup..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git repository already initialized${NC}"
else
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - RHS MDM System V2.0"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

# ========================================
# Final Instructions
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Preparation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit .env file with your configuration:"
echo "   - MongoDB Atlas connection string"
echo "   - JWT secret (generated above)"
echo "   - Email credentials (optional)"
echo ""
echo "2. Create GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Create repository: rhs-mdm-system-v2"
echo ""
echo "3. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/rhs-mdm-system-v2.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Deploy to hosting platform:"
echo "   - Render.com (Recommended): https://render.com/"
echo "   - Railway.app: https://railway.app/"
echo ""
echo "5. Read the complete guide:"
echo "   - Open: FREE_DEPLOYMENT_GUIDE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Good luck with your deployment! 🚀${NC}"
echo ""
