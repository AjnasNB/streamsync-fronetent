# StreamSync: Personalized Streaming, Perfectly Timed

StreamSync is a revolutionary streaming platform that synchronizes personalized video content to a global timeline, ensuring perfectly timed delivery for millions of concurrent users without lag or buffering.

## 🚀 The Challenge

Inspired by real-world events where even major streaming platforms struggled with massive concurrent viewership:

- Netflix experiencing lag during the Paul vs. Mike Tyson knockout moment
- ICC Men's Cricket World Cup 2023 setting a world record with 59 million concurrent viewers

## 💡 Our Solution

StreamSync takes a novel approach to this problem by:

1. Pre-calculating personalized video sequences for each user
2. Synchronizing all streams to a global timeline
3. Allowing users to join at any time and instantly pick up at the exact point in their sequence
4. Optimizing compute and storage resources for cost efficiency

## 🛠️ Technical Architecture

### Backend (Python/Flask)

- **Global Timeline Orchestration**: Precise synchronization across all user streams
- **Personalized Content Sequencing**: Custom video sequence for each user
- **Video Management**: Easy upload and management of video content
- **RESTful API**: Clean interface for frontend communication

### Frontend (Next.js/TypeScript/TailwindCSS)

- **Beautiful UI**: Modern, responsive interface with smooth animations
- **Video Player**: Custom-built player with time synchronization
- **Admin Dashboard**: Easy content and stream management
- **Persistent User Sessions**: Users can leave and return without losing sync

## 📋 Features

- **Perfect Sync**: No matter when users join, they see exactly what they should be seeing
- **Personalized Streams**: Each user gets their own unique content sequence
- **Admin Controls**: Start global streams and manage video content
- **Efficient Resource Usage**: Optimized for minimal bandwidth and compute requirements

## 🖥️ Presentation

- **https://streamsync.ajnasnb.com/presentation**


## 🔧 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- FFmpeg (for video processing)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/AjnasNB/streamsync.git
   cd streamsync
   ```

2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   python run.py
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 🌐 How to Use

### As a Viewer

1. Visit the homepage and allow the system to register you
2. Once the global stream is started, your personalized stream will begin automatically
3. You can leave and return at any time - the stream will always be in sync

### As an Admin

1. Click "Admin Mode" on the home page
2. Navigate to the Admin Dashboard
3. Upload videos and manage content
4. Start the global stream when ready

## 📱 Responsive Design

StreamSync is fully responsive and works on all device sizes:
- Desktop
- Tablet
- Mobile

## ⚙️ Environment Variables

Backend (`.env` file in the `backend` directory):
```
DEBUG=True
PORT=5000
HOST=0.0.0.0
```

Frontend (`.env.local` file in the `frontend` directory):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🔒 Future Enhancements

- User authentication and profiles
- Content recommendation engine
- Adaptive bitrate streaming
- Multi-region deployment for global scalability
- Real-time analytics dashboard

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the perfect streaming experience. 