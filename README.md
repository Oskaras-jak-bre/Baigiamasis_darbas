# Direct Sales Art Platform

This is my web development project which I build using the MERN stack. It is a C2C marketplace which allows artists to connect with customers in a much more easier way.

---

## Key Features

* **User Authentication & Authorization:** Secure registration and login featuring password hashing (`bcryptjs`) and stateless session management via JSON Web Tokens (JWT).
* **Multiple Artwork Uploads:** Authenticated artists can upload new pieces with up to 3 images per submission and select a primary cover image via custom radio toggles.
* **Featured Artist of the Week:** An automated date-indexing algorithm that selects and highlights a rotating artist profile every week.
* **Dynamic Search & Filtering:** Efficient data fetching and presentation directly from MongoDB.
* **Modern UI/UX Design:** Custom success modal with a backdrop blur and automated redirect (3-second delay) for seamless UX, paired with a fully responsive layout.

---

## Tech Stack

### Backend
* **Node.js & Express.js** – RESTful API architecture
* **MongoDB (via Mongoose)** – NoSQL document database
* **Multer** – File upload handling and media storage
* **jsonwebtoken (JWT) & bcryptjs** – Security, authentication, and data protection

### Frontend
* **React.js (powered by Vite)** – Single Page Application framework
* **React Router Dom** – Client-side routing and navigation
* **Vanilla CSS** – Custom responsive styling without external CSS frameworks

---

## Local Setup Instructions


```bash
1. Clone the repository

git clone https://github.com/Oskaras-jak-bre/Baigiamasis_darbas.git
cd Baigiamasis_darbas

2. Configure & run the Backend

cd server
npm install

Create a .env file in the server directory (refer to .env.example) and supply your environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Start the server:

npm start

3. Configure & run the Frontend

cd ../client
npm install
npm run dev

