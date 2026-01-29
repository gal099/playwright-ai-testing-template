#!/bin/bash

# Script to initialize a new project from this template
# Usage: ./scripts/init-new-project.sh <project-name> <target-directory>

set -e

PROJECT_NAME=$1
TARGET_DIR=$2

if [ -z "$PROJECT_NAME" ] || [ -z "$TARGET_DIR" ]; then
  echo "Usage: ./scripts/init-new-project.sh <project-name> <target-directory>"
  echo "Example: ./scripts/init-new-project.sh my-app-tests ~/projects/my-app-tests"
  exit 1
fi

echo "🚀 Initializing new Playwright AI testing project: $PROJECT_NAME"
echo ""

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy template files
echo "📋 Copying template files..."
cp -r . "$TARGET_DIR/"

# Navigate to target directory
cd "$TARGET_DIR"

# Remove git history if exists
if [ -d .git ]; then
  echo "🗑️  Removing existing git history..."
  rm -rf .git
fi

# Remove scripts directory (not needed in new projects)
rm -rf scripts/

# Initialize new git repo
echo "📦 Initializing new git repository..."
git init

# Update package.json with new project name
echo "✏️  Updating package.json..."
if command -v node &> /dev/null; then
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    pkg.name = '$PROJECT_NAME';
    pkg.version = '0.1.0';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
fi

# Create .env from .env.example
echo "🔧 Creating .env file..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   ⚠️  Remember to update .env with your app URL and credentials!"
fi

# Install dependencies
echo ""
read -p "📦 Install npm dependencies now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo ""
echo "✅ Project initialized successfully!"
echo ""
echo "📍 Project location: $TARGET_DIR"
echo ""
echo "Next steps:"
echo "1. cd $TARGET_DIR"
echo "2. Edit .env with your app configuration"
echo "3. npm test (to verify setup)"
echo "4. Read GETTING-STARTED.md for usage guide"
echo ""
echo "Happy testing! 🎭✨"
