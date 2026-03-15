import { useState, useRef, useEffect } from "react";
import { Camera, Lock, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { userService } from "../api/services/userService";

// Sample profile avatars for demo
const SAMPLE_AVATARS = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
];

export function Profile() {
  const { userProfile, updateUserProfileAsync, isDarkMode, userRole } = useApp();
  
  const [formData, setFormData] = useState({
    name: userProfile.name,
    avatar: userProfile.avatar || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data when userProfile loads from API
  useEffect(() => {
    setFormData({
      name: userProfile.name || "",
      avatar: userProfile.avatar || "",
    });
    setHasChanges(false);
    setErrors({});
  }, [userProfile.id]); // Only sync when userProfile.id changes (after login/fetch)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Validate on change
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    
    if (field === "name") {
      if (!value.trim()) {
        error = "Name is required";
      } else if (value.trim().length < 2) {
        error = "Name must be at least 2 characters";
      }
    }
    
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      // Call API to update profile
      await updateUserProfileAsync({
        name: formData.name,
        avatar: formData.avatar,
      });
      
      setHasChanges(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isFormValid) {
      setShowDiscardDialog(true);
    }
  };

  const handleDiscard = () => {
    setFormData({
      name: userProfile.name,
      avatar: userProfile.avatar || "",
    });
    setErrors({});
    setHasChanges(false);
    setShowDiscardDialog(false);
    toast.info("Changes discarded");
  };

  const handlePhotoUpload = () => {
    if (selectedAvatar) {
      updateUserProfileAsync({ avatar: selectedAvatar });
      setShowPhotoModal(false);
      setSelectedAvatar(null);
      toast.success("Profile photo updated successfully");
    }
  };

  // Form is valid if no errors exist and name is not empty
  const isFormValid = Object.keys(errors).length === 0 && formData.name && formData.name.trim().length > 0;

  // Role badge config
  const getRoleBadge = () => {
    switch (userRole) {
      case "owner":
        return { text: "Owner", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
      case "family":
        return { text: "Family", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
      case "guest":
        return { text: "Guest", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
      default:
        return { text: "User", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Profile Settings
        </h1>
        <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage your personal information and preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Photo */}
        <div className={`lg:col-span-1 rounded-xl shadow-sm border p-6 h-fit ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Profile Photo
          </h2>
          
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            {userProfile.avatar?.startsWith("http") ? (
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-40 h-40 rounded-full object-cover border-2 border-gray-200 dark:border-white/20"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-semibold border-2 border-gray-200 dark:border-white/20">
                {userProfile.avatar}
              </div>
            )}
            
            {/* Change Photo Button */}
            <button
              onClick={() => setShowPhotoModal(true)}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                isDarkMode
                  ? "border-blue-500 text-blue-400 hover:bg-blue-900/20"
                  : "border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Camera className="w-4 h-4" />
              Change Photo
            </button>
            
            <p className={`mt-2 text-xs text-center ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              Click to upload. JPG, PNG or GIF. Max 2MB
            </p>
          </div>
        </div>

        {/* Right Column - Personal Information */}
        <div className={`lg:col-span-2 rounded-xl shadow-sm border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Personal Information
          </h2>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userProfile.email}
                  disabled
                  className={`w-full px-4 py-3 rounded-lg border cursor-not-allowed ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-gray-500"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                />
                <Lock className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                Email cannot be changed
              </p>
            </div>

            {/* Your Role */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Your Role
              </label>
              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-300"
              }`}>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge.color}`}>
                  {roleBadge.text}
                </span>
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  (Assigned by system)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  !saving
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={!isFormValid}
                className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
                  isFormValid
                    ? isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Select an image to upload
              </h3>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setSelectedAvatar(null);
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sample Avatars Grid */}
              <div className="grid grid-cols-2 gap-4">
                {SAMPLE_AVATARS.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-4 transition-all ${
                      selectedAvatar === avatar
                        ? "border-blue-600 scale-95"
                        : isDarkMode
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePhotoUpload}
                  disabled={!selectedAvatar}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedAvatar
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Upload
                </button>
                <button
                  onClick={() => {
                    setShowPhotoModal(false);
                    setSelectedAvatar(null);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discard Changes Dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Discard changes?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDiscardDialog(false)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Keep Editing
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
