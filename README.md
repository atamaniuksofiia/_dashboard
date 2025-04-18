# React Mosaic Company Dashboard

This is a responsive dashboard built with **React**, **Tailwind CSS**, **TypeScript**, and **React Mosaic**, displaying company information widgets using data from a mock API.

## 🚀 Features

- 🔳 3 resizable Company Info Widgets using `react-mosaic-component`
- 📄 Data is loaded from a mock API (`companies-lookup.json`)
- 🎚️ Dropdown to select companies dynamically
- ⚡ Fast build with **Vite**
- 🐳 Dockerized for easy deployment

## 🧪 Technologies Used

- React
- TypeScript (TSX)
- Tailwind CSS
- React Mosaic
- Vite
- Docker

## 🛠️ Installation (Development)

```bash
git clone https://github.com/yourusername/react-mosaic-dashboard.git
cd react-mosaic-dashboard
npm install
npm run dev

docker build -t company-dashboard .
docker run -p 5173:5173 company-dashboard
```

## ✅ Requirements Met

✅ Uses React, Tailwind, TypeScript, React Mosaic

✅ Fetches data from a fake API (companies-lookup.json)

✅ Displays company widgets with dropdown selector

✅ Responsive design

✅ Dockerized setup

✅ Clean code with comments moved to this README
