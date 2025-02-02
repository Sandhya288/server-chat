import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e0f7ff] text-center px-6">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">Welcome to ChatMouse</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-lg">
      Connect effortlessly and experience next-level communication with us.
      </p>
      <button 
        onClick={() => navigate('/auth')} 
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition transform duration-300"
      >
        Get Started
      </button>
    </div>
  );
}
