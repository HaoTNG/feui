export function DemoCredentials() {
  return (
    <div className="mt-6 p-4 rounded-lg border bg-blue-50 border-blue-200">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-800">
        <span className="text-lg">🚀</span>
        Demo Credentials
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between p-2 rounded bg-white/50">
          <span className="font-mono">owner@demo.com</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            Owner
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-white/50">
          <span className="font-mono">family@demo.com</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            Family
          </span>
        </div>
        <div className="flex items-center justify-between p-2 rounded bg-white/50">
          <span className="font-mono">guest@demo.com</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            Guest
          </span>
        </div>
        <p className="text-xs mt-2 text-blue-600">
          Any password works (min 6 characters)
        </p>
      </div>
    </div>
  );
}
