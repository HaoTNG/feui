import { useState } from "react";
import { Link } from "react-router";
import { Home, Check } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
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

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Reset link sent!</p>
          </div>
          <p className="text-sm text-green-700">
            Check <strong>{email}</strong> for password reset instructions.
          </p>
          <p className="text-xs text-green-600 mt-2">
            (Demo mode: In production, an email would be sent. For testing, click the link below.)
          </p>
        </div>
      )}

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
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      ) : (
        <div className="mt-4 text-center">
          <Link to="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-700">
            Demo: Continue to reset password →
          </Link>
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
