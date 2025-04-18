# E-commerce Application for Fans and Air Conditioners

A full-stack e-commerce application for selling fans and air conditioners with multiple variants.

## Project Structure

- **frontend**: React.js customer-facing application with TailwindCSS
- **backend**: Node.js with Express REST API
- **admin-panel**: React.js admin dashboard
- **rider-app**: React PWA for delivery riders

## Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: Google OAuth
- **Admin Panel**: Custom React Dashboard
- **Rider App**: React PWA

## Features

### Customer App
- Product listing with variants (color, size)
- Product detail pages
- Shopping cart
- Google authentication
- Checkout process

### Admin Panel
- Order management
- Rider assignment
- Order status updates

### Rider App
- Order delivery management
- Status updates
- Mobile responsive PWA

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Admin Panel
```bash
cd admin-panel
npm install
npm start
```

### Rider App
```bash
cd rider-app
npm install
npm start
```

## Environment Variables
Create .env files in each directory with the following variables:

### Backend
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

### Frontend, Admin Panel, Rider App
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```
# CoolBreeze
# Cool_Breeze
# Cool_Breeze
# Cool_Breeze
