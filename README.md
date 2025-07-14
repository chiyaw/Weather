# Weather App

A simple, modern weather application built with **React** and **Vite**. Instantly check the current weather, temperature, humidity, and wind speed for any city worldwide.

🌐 **[Live Demo](https://weather-three-inky.vercel.app/)**

---

## Features

- 🔍 **City Search:** Enter any city to get real-time weather data.
- 🌤️ **Weather Details:** Displays temperature, humidity, wind speed, and weather condition.
- 🎨 **Modern UI:** Clean, responsive design with custom weather icons.
- 🚀 **Fast & Lightweight:** Powered by Vite for instant loading and hot module replacement.
- 🌎 **Default City:** Shows weather for Delhi on first load.

## Screenshots

![Weather App Screenshot](imgwea)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your OpenWeatherMap API key:**
   - Create a `.env` file in the project root.
   - Add the following line, replacing `YOUR_API_KEY` with your OpenWeatherMap API key:
     ```
     VITE_APP_ID=YOUR_API_KEY
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Build for Production

```bash
npm run build
```
The optimized build will be in the `dist` folder.

---

## Project Structure

```
src/
  assets/         # Weather icons and images
  components/
    Weather.jsx   # Main weather component
    Weather.css   # Component styles
  App.jsx         # App entry point
  main.jsx        # React DOM bootstrap
public/
  index.html      # HTML template
```

---

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [ESLint](https://eslint.org/) (with recommended rules)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/).
- UI inspired by modern weather apps.

---

**Enjoy using the Weather App!**  
For feedback or contributions, feel free to open an issue or pull request.
