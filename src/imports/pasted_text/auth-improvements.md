Hello Figma AI, I need you to enhance the login system with frontend-only improvements. Please follow these precise instructions to make the authentication flow more polished and user-friendly while keeping the role switcher temporarily.

OVERVIEW OF REQUIRED ENHANCEMENTS
The login system currently works for demo purposes but needs these improvements:

Persistent login state with localStorage/sessionStorage

Loading states on all auth buttons

Form validation with real-time feedback

Demo credentials helper for easy testing

Complete mock reset password flow

Session timeout warning

TASK 1: IMPLEMENT PERSISTENT LOGIN STATE
Step 1: Update AppContext.tsx with Auth State Management

Locate the AppContext.tsx file. Find where userRole is currently defined and replace it with a proper auth state system.

Add this import at the top:
import { useEffect } from "react";

Find the existing userRole state and replace it with:

const [user, setUser] = useState<{
isAuthenticated: boolean;
role: "owner" | "family" | "guest";
email: string;
name: string;
} | null>(() => {
const saved = localStorage.getItem('smartHome_user');
if (saved) {
return JSON.parse(saved);
}
const sessionSaved = sessionStorage.getItem('smartHome_user');
if (sessionSaved) {
return JSON.parse(sessionSaved);
}
return {
isAuthenticated: true,
role: 'owner',
email: 'demo@example.com',
name: 'Demo User'
};
});

Step 2: Add Login and Logout Functions

Add these functions inside the AppProvider component:

const login = (email: string, password: string, rememberMe: boolean) => {
let role = 'family';
if (email.toLowerCase().includes('owner')) role = 'owner';
else if (email.toLowerCase().includes('guest')) role = 'guest';

const userData = {
isAuthenticated: true,
role,
email,
name: email.split('@')[0],
};

setUser(userData);

const storage = rememberMe ? localStorage : sessionStorage;
storage.setItem('smartHome_user', JSON.stringify(userData));

if (rememberMe) {
sessionStorage.removeItem('smartHome_user');
} else {
localStorage.removeItem('smartHome_user');
}

return true;
};

const logout = () => {
setUser(null);
localStorage.removeItem('smartHome_user');
sessionStorage.removeItem('smartHome_user');
};

Step 3: Update the Context Value

In the AppContext.Provider value object, add:

user: user,
login: login,
logout: logout,
userRole: user?.role || 'owner',
setUserRole: (role) => {
if (user) {
const updatedUser = { ...user, role };
setUser(updatedUser);
if (localStorage.getItem('smartHome_user')) {
localStorage.setItem('smartHome_user', JSON.stringify(updatedUser));
}
if (sessionStorage.getItem('smartHome_user')) {
sessionStorage.setItem('smartHome_user', JSON.stringify(updatedUser));
}
}
},

Step 4: Update ProtectedRoute.tsx

Modify ProtectedRoute.tsx:

export function ProtectedRoute({ children, allowedRoles = ["owner", "family", "guest"] }) {
const { user } = useApp();
const navigate = useNavigate();

useEffect(() => {
if (!user?.isAuthenticated) {
navigate("/auth/login");
return;
}

if (user.role === "guest" && !allowedRoles.includes("guest")) {
navigate("/guest");
}
else if (!allowedRoles.includes(user.role)) {
navigate("/");
}
}, [user, allowedRoles, navigate]);

if (!user?.isAuthenticated || !allowedRoles.includes(user.role)) {
return null;
}

return <>{children}</>;
}

Step 5: Update MainLayout.tsx Logout Function

Find handleLogout and update:

const handleLogout = () => {
logout();
navigate("/auth/login");
};

Update user display:

const user = {
name: userData?.name || (userData?.role === "owner" ? "John Smith" : "Jane Doe"),
email: userData?.email || (userData?.role === "owner" ? "john@example.com" : "jane@example.com"),
avatar: userData?.name ? userData.name.split(' ').map(n => n[0]).join('') : (userData?.role === "owner" ? "JS" : "JD"),
role: userData?.role,
unreadNotifications: unreadNotificationCount,
};

TASK 2: ADD LOADING STATES TO ALL AUTH BUTTONS
Step 1: Update Login.tsx

Add state variables:

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

Update handleSubmit:

const handleSubmit = async (e) => {
e.preventDefault();

if (!formData.email || !formData.password) {
setError("Please fill in all fields");
return;
}

setIsLoading(true);
setError("");

await new Promise(resolve => setTimeout(resolve, 1000));

const success = login(formData.email, formData.password, formData.rememberMe);

if (success) {
navigate("/");
} else {
setError("Invalid email or password");
setIsLoading(false);
}
};

Update the submit button:

<button
type="submit"
disabled={isLoading}
className={w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${ isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700" } text-white}

{isLoading ? (
<>
<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
Logging in...
</>
) : (
"Log In"
)}
</button>

Add error display:

{error && (

<div className="p-3 bg-red-50 border border-red-200 rounded-lg"> <p className="text-sm text-red-600">{error}</p> </div> )}
Step 2: Update Register.tsx

Add state:

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

Update handleSubmit:

const handleSubmit = async (e) => {
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

await new Promise(resolve => setTimeout(resolve, 1500));

login(formData.email, formData.password, false);
navigate("/");
};

Update button with same loading spinner pattern.

Step 3: Update ForgotPassword.tsx

Add state:

const [isLoading, setIsLoading] = useState(false);

Update handleSubmit:

const handleSubmit = async (e) => {
e.preventDefault();
setIsLoading(true);
await new Promise(resolve => setTimeout(resolve, 1500));
setIsLoading(false);
setSubmitted(true);
};

Update button with loading spinner.

Step 4: Update ResetPassword.tsx

Apply same loading pattern.

TASK 3: ADD FORM VALIDATION WITH REAL-TIME FEEDBACK
Step 1: Add Validation to Login.tsx

Add state:

const [errors, setErrors] = useState({});

Add validation function:

const validateField = (field, value) => {
const newErrors = { ...errors };

if (field === 'email') {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
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

Update inputs with validation:

<input
type="email"
value={formData.email}
onChange={(e) => {
setFormData({ ...formData, email: e.target.value });
validateField('email', e.target.value);
}}
className={w-full px-4 py-3 border rounded-lg ${ errors.email ? 'border-red-500' : 'border-gray-300' }}
/>

{errors.email && (

<p className="mt-1 text-sm text-red-600">{errors.email}</p> )}
Step 2: Add Validation to Register.tsx

Add comprehensive validation:

const [errors, setErrors] = useState({});

const validateField = (field, value, allValues = formData) => {
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
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
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

Add visual indicators with Lucide icons:

import { Check, X } from "lucide-react";

In each input, add:

<div className="relative"> <input ... /> {formData.password && ( <div className="absolute right-3 top-1/2 -translate-y-1/2"> {errors.password ? ( <X className="w-5 h-5 text-red-500" /> ) : ( <Check className="w-5 h-5 text-green-500" /> )} </div> )} </div>
TASK 4: ADD DEMO CREDENTIALS HELPER
Step 1: Create DemoCredentials Component

Create new file DemoCredentials.tsx:

import { useApp } from "../../contexts/AppContext";

export function DemoCredentials() {
const { isDarkMode } = useApp();

return (

<div className={`mt-6 p-4 rounded-lg border ${ isDarkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200" }`}> <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${ isDarkMode ? "text-blue-300" : "text-blue-800" }`}> <span className="text-lg">🚀</span> Demo Credentials </h4> <div className="space-y-2 text-sm"> <div className={`flex items-center justify-between p-2 rounded ${ isDarkMode ? "bg-blue-900/30" : "bg-white/50" }`}> <span className="font-mono">owner@demo.com</span> <span className={`px-2 py-0.5 rounded text-xs font-medium ${ isDarkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700" }`}> Owner </span> </div> <div className={`flex items-center justify-between p-2 rounded ${ isDarkMode ? "bg-blue-900/30" : "bg-white/50" }`}> <span className="font-mono">family@demo.com</span> <span className={`px-2 py-0.5 rounded text-xs font-medium ${ isDarkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700" }`}> Family </span> </div> <div className={`flex items-center justify-between p-2 rounded ${ isDarkMode ? "bg-blue-900/30" : "bg-white/50" }`}> <span className="font-mono">guest@demo.com</span> <span className={`px-2 py-0.5 rounded text-xs font-medium ${ isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700" }`}> Guest </span> </div> <p className={`text-xs mt-2 ${ isDarkMode ? "text-blue-400" : "text-blue-600" }`}> Any password works (min 6 characters) </p> </div> </div> ); }
Step 2: Import and Use in Login.tsx

Add import:

import { DemoCredentials } from "./DemoCredentials";

Add component below the form but above the footer:

<DemoCredentials />
TASK 5: COMPLETE MOCK RESET PASSWORD FLOW
Step 1: Enhance ForgotPassword.tsx

Add success message with more detail:

{submitted && (

<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5"> <div className="flex items-center gap-2 mb-2"> <Check className="w-5 h-5 text-green-600" /> <p className="text-green-800 font-medium">Reset link sent!</p> </div> <p className="text-sm text-green-700"> Check <strong>{email}</strong> for password reset instructions. </p> <p className="text-xs text-green-600 mt-2"> (Demo mode: In production, an email would be sent. For testing, click the link below.) </p> </div> )}
Add demo override link:

{submitted && (

<div className="mt-4 text-center"> <Link to="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-700" > Demo: Continue to reset password → </Link> </div> )}
Step 2: Enhance ResetPassword.tsx

Add token validation simulation:

const [isValidToken, setIsValidToken] = useState(true);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
const token = new URLSearchParams(window.location.search).get('token');
if (!token) {
setIsValidToken(false);
}
}, []);

if (!isValidToken) {
return (

<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"> <div className="text-center"> <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"> <X className="w-8 h-8 text-red-600" /> </div> <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2> <p className="text-gray-600 mb-6"> This password reset link is invalid or has expired. </p> <Link to="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium" > Request a new link </Link> </div> </div> ); }
Add success state after submission:

const [resetComplete, setResetComplete] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setIsLoading(true);
await new Promise(resolve => setTimeout(resolve, 1500));
setIsLoading(false);
setResetComplete(true);
};

if (resetComplete) {
return (

<div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"> <div className="text-center"> <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"> <Check className="w-8 h-8 text-green-600" /> </div> <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset</h2> <p className="text-gray-600 mb-6"> Your password has been successfully reset. </p> <Link to="/auth/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium" > Log In </Link> </div> </div> ); }
TASK 6: ADD SESSION TIMEOUT WARNING
Step 1: Add Session Timeout to AppContext.tsx

Add useEffect for session timeout:

useEffect(() => {
if (!user?.isAuthenticated) return;

const timeoutId = setTimeout(() => {
const shouldStay = window.confirm(
"Your session will expire in 30 minutes due to inactivity. Stay logged in?"
);

if (!shouldStay) {
logout();
}
}, 23.5 * 60 * 60 * 1000);

return () => clearTimeout(timeoutId);
}, [user]);

Step 2: Add Activity Reset

Add function to reset timer on user activity:

const resetSessionTimer = () => {
if (!user?.isAuthenticated) return;

if (window.sessionTimeoutId) {
clearTimeout(window.sessionTimeoutId);
}

window.sessionTimeoutId = setTimeout(() => {
const shouldStay = window.confirm(
"Your session will expire in 30 minutes due to inactivity. Stay logged in?"
);

if (!shouldStay) {
logout();
}
}, 23.5 * 60 * 60 * 1000);
};

Add event listeners in MainLayout:

useEffect(() => {
const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];

const handleActivity = () => {
resetSessionTimer();
};

events.forEach(event => {
window.addEventListener(event, handleActivity);
});

return () => {
events.forEach(event => {
window.removeEventListener(event, handleActivity);
});
};
}, []);