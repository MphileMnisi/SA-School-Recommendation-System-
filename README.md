# SA School Recommender

An intelligent web application designed to assist South African high school students in finding suitable tertiary institutions (Universities, TVET Colleges, and Private Colleges) based on their academic results. Powered by Google's Gemini AI.

**🚀 Live Demo:** [https://sa-school-recommendation-system.vercel.app/](https://sa-school-recommendation-system.vercel.app/)

## Features

- **Smart Recommendations**: Input your high school subject marks to receive personalized recommendations for institutions and courses you qualify for.
- **Automatic Calculations**: Built-in tools to calculate your average mark automatically based on your subject inputs.
- **Interactive Chatbot**: A built-in "Career Counselor" bot to answer questions about careers, subject choices, and university life.
- **Detailed Insights**: View admission requirements, APS scores, and direct website links for recommended institutions.
- **Modern UI**: Fully responsive design with Dark Mode support and a glassmorphism aesthetic.

## Technologies Used

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
- **Runtime**: Native ES Modules with Import Maps

## Prerequisites

To run this application, you need a Google Gemini API Key.

1. Get an API Key from [Google AI Studio](https://aistudio.google.com/).

## Setup & Usage

1. **Clone or Download** the repository.

2. **API Key Configuration**:
   The application expects the API key to be available via `process.env.API_KEY`. Ensure this is configured in your runtime environment.

3. **Running the App**:
   This application uses ES Modules and cannot be opened directly from the file system. You must serve it using a local web server.

   **Using Python:**
   ```bash
   python3 -m http.server 8000
   ```

   **Using Node.js (serve):**
   ```bash
   npx serve .
   ```

   **VS Code:**
   Use the "Live Server" extension.

4. **Interact**:
   - **Enter Marks**: Add your subjects (e.g., Mathematics, English) and the percentage obtained.
   - **Get Recommendations**: Click "Get Recommendations" to let the AI analyze your profile and suggest suitable schools.
   - **Chat**: Click the "Chat Bot" button to ask specific ca
