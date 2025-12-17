 🚀 Startup Pitch Platform

A full-stack **MERN** application that connects **entrepreneurs** with **mentors/investors**.  
Entrepreneurs can submit startup pitches, while mentors can review, evaluate, and **accept or reject pitches** based on interest and feasibility.

This platform models a real-world startup funding and mentorship workflow.

 🌟 Features
- Role-based authentication (Entrepreneur / Mentor)
- Secure user authentication using JWT
- Entrepreneurs can submit and manage startup pitches
- Mentors can review, accept, or reject pitches
- Pitch status tracking (Pending / Accepted / Rejected)
- RESTful API architecture
- Responsive and user-friendly UI

---

 🛠 Tech Stack

**Frontend**
- React
- JavaScript (ES6+)
- HTML5
- CSS3
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

⚙️ Setup Instructions
Clone the repository
bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
Backend
bash
Copy code
cd server
npm install
npm start
Frontend
bash
Copy code
cd client
npm install
npm start
Frontend runs on http://localhost:3000
Backend runs on http://localhost:5000

🔐 Environment Variables
Create a .env file inside the server directory:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


🚀 How It Works
Users register and choose a role (Entrepreneur or Mentor)

Entrepreneurs submit startup pitches with funding details

Mentors review submitted pitches on their dashboard

Mentors accept or reject pitches

Entrepreneurs track the status of their submissions


👤 Author
Karthik Darapu

📜 License
This project is licensed under the MIT License.
