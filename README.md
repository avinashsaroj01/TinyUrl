
Deployment Link: https://tinylink-client.onrender.com

````markdown
# 🚀 TinyLink – Full-Stack URL Shortener  
A production-ready monorepo built using **React + Redux Toolkit**, **Express.js**, and **MongoDB**.  
This document outlines the complete architecture, folder structure, environment handling, and deployment guide.

---

## 📦 Monorepo Structure

```bash
LINK-SHORTNER/
├── TinyLink-Client/      # Frontend (React/Redux)
├── TinyLink-Server/      # Backend (Express/MongoDB)

````

---

# 🛠️ Frontend — TinyLink-Client

## 1️⃣ Key Technologies & Architecture

* **React.js**
* **Redux Toolkit** (`createAsyncThunk` for API interactions)
* **Tailwind CSS**
* **react-router-dom** (Routes: `/`, `/code/:code`, `/healthz-ui`)

---

## 2️⃣ Critical Implementation Details

### 🔗 API Interaction (`linksAPI.js`)

All API calls use **relative paths**:

* `/api/links`
* `/api/healthz`

---

### 🌍 Environment Handling (VERY IMPORTANT FOR REDIRECTS)

In `LinkTable.jsx` and `StatsPage.jsx`:

```js
const BACKEND_ORIGIN = process.env.REACT_APP_BACKEND_ORIGIN;
```

| Environment                      | Value                   | Purpose                                                        |
| -------------------------------- | ----------------------- | -------------------------------------------------------------- |
| Development (`.env.development`) | `http://localhost:5000` | Prevents React router from intercepting short-link redirects   |
| Production (`.env.production`)   | *(empty string)*        | Redirection uses `/${code}` directly to backend on same domain |

---

### ❤️ Health Check Integration

`HealthCheckPage.jsx` uses the `fetchHealth` Redux thunk:

* Centralized loading/error states
* Automatic polling
* Displays platform + database status

---

## 3️⃣ Frontend File Paths

| File Path                          | Purpose                                          |
| ---------------------------------- | ------------------------------------------------ |
| `src/app/store.js`                 | Configures Redux store                           |
| `src/features/links/linksAPI.js`   | Raw fetch API utilities                          |
| `src/features/links/linksSlice.js` | Thunks + reducers + selectors                    |
| `src/components/LinkTable.jsx`     | Table UI + short-link redirect fix               |
| `src/pages/StatsPage.jsx`          | Stats page + redirect fix                        |
| `src/pages/HealthCheckPage.jsx`    | Health status UI                                 |
| `.env.development`                 | `REACT_APP_BACKEND_ORIGIN=http://localhost:5000` |
| `.env.production`                  | `REACT_APP_BACKEND_ORIGIN=` (empty)              |

---

# 🌐 Backend — TinyLink-Server

## 1️⃣ Key Technologies

* **Node.js / Express.js**
* **MongoDB via Mongoose**
* Server-driven redirection + atomic click tracking

---

## 2️⃣ Critical Implementation Details

### 🔁 Redirect Handler (`GET /:code`)

* Sends **302 Redirect**
* Uses `incrementClicks()` (atomic update)
* Increments:

  * `totalClicks`
  * `lastClickedTime`

---

### 🩺 Health Check Endpoint (`GET /api/healthz`)

Returns standardized status response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

### 📦 Static Asset Serving

In production, Express serves `TinyLink-Client/build`:

```js
app.use(express.static(path.join(__dirname, "../TinyLink-Client/build")));
```

---

### 🧮 Atomic Click Counting (Race Condition Safe)

`TinyLink-Server/db/Link.js`:

```js
LinkSchema.statics.incrementClicks = function (code) {
  return this.findOneAndUpdate(
    { code },
    {
      $inc: { totalClicks: 1 },
      lastClickedTime: new Date()
    },
    { new: true }
  );
};
```

---

## 3️⃣ Backend File Paths

| File Path                       | Purpose                          |
| ------------------------------- | -------------------------------- |
| `server.js`                     | Express app + redirect logic     |
| `controllers/linkController.js` | Business logic for CRUD          |
| `routes/linkRoutes.js`          | `/api/links/` routes             |
| `db/db.js`                      | MongoDB connection               |
| `db/Link.js`                    | Mongoose schema + static methods |

---

# 🚀 Local Development Guide

## ▶️ 1. Install Dependencies

From **project root**:

```bash
npm install
```

## ▶️ 2. Add MongoDB URI

Create file:

```
TinyLink-Server/.env
```

Add:

```env
MONGO_URI=your_connection_string
```

## ▶️ 3. Run the App

```bash
npm run dev
```

This starts:

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend:** [http://localhost:5000](http://localhost:5000)

---

# 🌍 Deployment (Render / Vercel)

### 1. Push code to GitHub

### 2. On Render Dashboard:

| Setting              | Value            |
| -------------------- | ---------------- |
| Root Directory       | `LINK-SHORTNER/` |
| Build Command        | `npm install`    |
| Start Command        | `npm start`      |
| Environment Variable | `MONGO_URI`      |

The frontend automatically handles:

* Localhost redirects
* Production relative paths

No additional configuration needed.

---

# 🎯 Final Notes

✔ Clean monorepo design
✔ Atomic click tracking
✔ Production-grade redirect handling
✔ Environment-safe deployment
✔ Client + Server fully integrated

