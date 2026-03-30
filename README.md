# Chatify (Chatori) 🚀

A premium, feature-rich real-time chat application built with the MERN stack and Socket.io. Chatify features a beautiful, dynamic **Violet/Fuchsia** dark theme with glassmorphism, smooth animations, and advanced messaging capabilities.

![Chatify UI](https://img.shields.io/badge/UI-Glassmorphism_Dark_Theme-8b5cf6?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN-10b981?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

---

## ✨ Features

### 💬 Advanced Messaging
- **Real-time Chat**: Instant messaging powered by Socket.io.
- **Read Receipts**: Live message status (grey `✓` for sent, violet `✓✓` for delivered, **pink `✓✓`** for read).
- **Emoji Picker**: Built-in 40-emoji selector UI with a character counter.
- **Image Sharing**: Upload and send images via Cloudinary.
- **Online Indicators**: Real-time "online" dots on avatars and active user count.

### 🔐 Authentication & Security
- **JWT Authentication**: Secure login and signup with HTTP-only cookies.
- **Forgot/Reset Password**: Complete password recovery flow utilizing crypto-tokens and NodeMailer (Gmail SMTP) for real email delivery.
- **Show/Hide Password**: UI toggles on all password fields.

### 🎨 Stunning UI/UX
- **Premium Theme**: Deep purple-black backgrounds with interactive violet/fuchsia glow blobs.
- **Custom Animations**: Slide-in chat bubbles, floating auth illustrations, and pulsing online indicators.
- **Search & Filter**: Live frontend search bars for finding contacts and chats instantly.
- **Quick Actions**: "Say Hello" and "How are you?" one-click buttons for empty conversations.
- **Responsive Design**: Built entirely with TailwindCSS.

---

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Zustand (Global State Management)
- TailwindCSS (Styling & Animations)
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Socket.io-client

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io (Real-time syncing)
- Cloudinary (Image storage)
- Nodemailer (Email transport for password resets)
- Bcrypt.js & JSON Web Tokens (Auth)

---

## 🚀 Running Locally

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/ShivamxRaj/Chatori.git
cd Chatori
```

### 2. Setup Backend environment variables
Create a `.env` file in the `backend/` directory with the following structure:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatify
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Config (App Password required for Gmail)
EMAIL_FROM_NAME=Chatify
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_letter_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start the Application
You can run the backend and frontend simultaneously:
```bash
# In the backend folder
npm run dev

# In a separate terminal, in the frontend folder
npm run dev
```

Visit `http://localhost:5173` in your browser!

---
*Innovation to talk with relatives privately... and beautifully.* 💜
