# Product Data Explorer - Step-by-Step Setup Guide

## 🎯 Overview
A full-stack product exploration platform that scrapes World of Books data and provides a modern browsing experience.

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or Docker)
- **Git** (for version control)

## 🚀 Step-by-Step Setup

### Step 1: Install MongoDB

#### Option A: Install MongoDB Locally
```bash
# On macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# On Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# On Windows
# Download from https://www.mongodb.com/try/download/community
```

#### Option B: Use Docker (Recommended)
```bash
# Start MongoDB with Docker
docker run -d --name mongodb -p 27017:27017 mongo:7.0
```

### Step 2: Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings (optional - defaults work)
# MONGODB_URI=mongodb://localhost:27017/product-explorer
# PORT=3001
# NODE_ENV=development
```

### Step 3: Start Backend Server

```bash
# In the backend directory
npm run start:dev
```

You should see:
```
🚀 Application is running on: http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
```

### Step 4: Test Backend (Optional)

Open your browser and visit:
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api/docs

### Step 5: Setup Frontend

Open a **new terminal window** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# The .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 6: Start Frontend Server

```bash
# In the frontend directory (new terminal)
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### Step 7: Seed Sample Data

Open a **third terminal window** and:

```bash
# Navigate to project root
cd /path/to/your/project

# Run the seed script
node scripts/seed-sample-data.js
```

You should see:
```
🌱 Seeding sample data...
✅ Sample data seeded successfully!
📚 5 navigation items
📂 5 categories
📖 6 products
```

### Step 8: Test the Complete System

1. **Visit Frontend**: http://localhost:3000
2. **You should see**:
   - Hero section with "Discover Amazing Books"
   - Navigation categories (Books, Fiction, etc.)
   - No more "Failed to load" errors

3. **Test Navigation**:
   - Click on any category
   - Should show products from that category

4. **Test Search**:
   - Use the search bar
   - Try searching for "Dune" or "Orwell"

### Step 9: Test Scraping (Optional)

1. **Visit API Docs**: http://localhost:3001/api/docs
2. **Find the scraping endpoints**:
   - `POST /scraping/navigation`
   - Click "Execute" to trigger scraping
3. **Check results**:
   - `GET /navigation` - Should show scraped data

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
mongosh # Should connect without errors

# Check if port 3001 is free
lsof -i :3001

# Restart with clean install
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Frontend Shows Errors
```bash
# Check if backend is running
curl http://localhost:3001/health

# Restart frontend
npm run dev
```

### Database Issues
```bash
# Reset database (if needed)
mongosh
use product-explorer
db.dropDatabase()

# Re-run seed script
node scripts/seed-sample-data.js
```

## 📁 Project Structure

```
product-explorer/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── database/       # Schemas and models
│   │   └── main.ts        # Application entry point
│   └── package.json
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── scripts/               # Utility scripts
│   └── seed-sample-data.js
└── docker-compose.yml     # Docker setup
```

## 🎉 Success Checklist

- [ ] MongoDB is running
- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 3000
- [ ] Sample data is seeded
- [ ] Frontend shows navigation categories
- [ ] Search functionality works
- [ ] API documentation is accessible

## 🚀 Next Steps

Once everything is working:

1. **Explore the API**: http://localhost:3001/api/docs
2. **Test all features**: Search, categories, product details
3. **Customize the data**: Add more products via the seed script
4. **Deploy**: Follow deployment guides for production

## 📞 Need Help?

If you encounter issues:
1. Check the terminal logs for error messages
2. Verify all prerequisites are installed
3. Make sure ports 3000 and 3001 are available
4. Restart both servers if needed

Happy coding! 🎯