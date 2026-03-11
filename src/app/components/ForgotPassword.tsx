import { useState } from "react";
import { Link } from "react-router";
import { Home } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Home className="w-8 h-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">Smart Home</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-600">
          {submitted
            ? "Check your email for reset instructions"
            : "Enter your email to receive a password reset link"}
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Send Reset Link
          </button>
        </form>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
          <p className="text-green-800 text-center">
            If an account exists with <strong>{email}</strong>, you will receive a password reset
            link shortly.
          </p>
        </div>
      )}

      <p className="text-center mt-6 text-gray-600">
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to Log In
        </Link>
      </p>
    </div>
  );
}
