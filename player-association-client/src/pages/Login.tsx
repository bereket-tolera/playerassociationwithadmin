import { useState, FormEvent } from "react";
import { AuthService } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { User, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        
        navigate('/admin'); 
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE - The Brand/Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Background Image - Football/Stadium context */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1856&q=80')",
            // You should replace this URL with a photo of the Ethiopian National Stadium or Ethiopian players
          }} 
        />

        {/* The Ethiopian Gradient Overlay - Green/Yellow/Red but sophisticated */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-green-900/90 via-yellow-900/60 to-red-900/90 mix-blend-multiply" />

        {/* Content over the image */}
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
            {/* Logo Placeholder */}
            <div className="w-10 h-10 bg-gradient-to-tr from-green-500 via-yellow-400 to-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider uppercase text-yellow-500">EPA Admin</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-extrabold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-200 to-yellow-400">
                Unity in Sport.
              </span>
              <br />
              Excellence in Action.
            </h1>
            <p className="text-lg text-gray-200 font-light leading-relaxed">
              Welcome to the official administration portal of the <strong className="text-white">Ethiopian Players Association</strong>. Managing the future of our national talent.
            </p>
          </div>

          <div className="flex gap-2 opacity-70">
            <div className="h-2 w-16 bg-green-600 rounded-full" />
            <div className="h-2 w-16 bg-yellow-500 rounded-full" />
            <div className="h-2 w-16 bg-red-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 relative">
        {/* Tibeb Pattern Decoration (Subtle top border) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 lg:hidden" />

        <div className="max-w-md w-full space-y-10 bg-white p-10 rounded-2xl shadow-xl lg:shadow-none lg:bg-transparent">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign in to Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your admin credentials to proceed.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-pulse">
                <div className="flex-shrink-0 text-red-500">⚠️</div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-green-700 hover:text-green-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white 
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Secure Sign In"
              )}
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-gray-200 text-center">
             <p className="text-xs text-gray-400">
               &copy; {new Date().getFullYear()} Ethiopian Players Association. <br/>Powered by Unity & Passion.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}