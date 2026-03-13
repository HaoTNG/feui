import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Home } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { DemoCredentials } from "./DemoCredentials";

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'password') {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = login(formData.email, formData.password, formData.rememberMe);
    
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Home className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">Smart Home</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Log in to your account</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              validateField('email', e.target.value);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="your password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                validateField('password', e.target.value);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
            />
            <span className="text-sm text-gray-700">Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <DemoCredentials />

      <p className="text-center mt-6 text-gray-600">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
