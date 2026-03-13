import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Home, Check, X } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function Register() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const validateField = (field: string, value: string, allValues = formData) => {
    const newErrors = { ...errors };
    
    if (field === 'fullName') {
      if (!value) {
        newErrors.fullName = "Full name is required";
      } else if (value.length < 2) {
        newErrors.fullName = "Name must be at least 2 characters";
      } else {
        delete newErrors.fullName;
      }
    }
    
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
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(value)) {
        newErrors.password = "Password must contain an uppercase letter";
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = "Password must contain a number";
      } else {
        delete newErrors.password;
      }
      
      // Re-validate confirmPassword if it exists
      if (allValues.confirmPassword) {
        validateField('confirmPassword', allValues.confirmPassword, allValues);
      }
    }
    
    if (field === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (value !== allValues.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login(formData.email, formData.password, false);
    navigate("/");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Home className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">Smart Home</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Sign up to get started</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                validateField('fullName', e.target.value);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formData.fullName && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {errors.fullName ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            )}
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
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
            {formData.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {errors.email ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </div>
            )}
          </div>
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
                validateField('password', e.target.value, { ...formData, password: e.target.value });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white pr-20 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.password && (
                <>
                  {errors.password ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase and number
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="confirm password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                validateField('confirmPassword', e.target.value);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white pr-20 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {formData.confirmPassword && (
                <>
                  {errors.confirmPassword ? (
                    <X className="w-5 h-5 text-red-500" />
                  ) : (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
            required
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}
