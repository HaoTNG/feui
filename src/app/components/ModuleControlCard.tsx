/**
 * ModuleControlCard Component
 * Shows a single module with appropriate controls based on module type
 */

import { FC, useState, useRef } from 'react';
import { Settings, Loader } from 'lucide-react';
import { toast } from 'sonner';
import type { ModuleDTO } from '../../types/api';
import { useModuleControl } from '../../hooks/useModuleControl';

interface ModuleControlCardProps {
  module: ModuleDTO;
  onCommandSent?: () => void;
}

export const ModuleControlCard: FC<ModuleControlCardProps> = ({ module, onCommandSent }) => {
  const { toggle, setBrightness, setSpeed, setColor, sendCommand, isCommandLoading } =
    useModuleControl();
  const [brightnessValue, setBrightnessValue] = useState(50);
  const [speedValue, setSpeedValue] = useState(1);
  const [colorValue, setColorValue] = useState('FF5733');
  const [error, setError] = useState<string | null>(null);

  const isLoading = isCommandLoading(module.id);
  const moduleState = module.state ? JSON.parse(module.state) : {};
  const isOn = moduleState?.action === 1 || moduleState?.power === true;

  // Helper to execute command safely
  const executeCommand = async (fn: () => Promise<void>, actionName: string = 'Hành động') => {
    setError(null);
    try {
      console.log(`[ModuleControl] Executing ${actionName} for module ${module.id}`);
      await fn();
      console.log(`[ModuleControl] ${actionName} completed for module ${module.id}`);
      toast.success(`${actionName} thành công`);
      onCommandSent?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error(`[ModuleControl] ${actionName} failed:`, err);
      setError(errorMsg);
      toast.error(`Lỗi ${actionName}: ${errorMsg}`);
    }
  };

  // ============================================================
  // RENDER BASED ON MODULE TYPE
  // ============================================================

  if (module.type === 'TEMPERATURE' || module.type === 'HUMIDITY' || module.type === 'MOTION') {
    // Sensor modules - display only
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-semibold text-gray-900'>{module.name}</h3>
            <p className='text-sm text-gray-500 mt-1'>{module.type}</p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-blue-600'>{module.state}</p>
            <span
              className={`text-xs font-medium ${module.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'}`}
            >
              {module.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (module.type === 'LIGHT' || module.type === 'SWITCH') {
    // Toggle on/off
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='font-semibold text-gray-900'>{module.name}</h3>
            <p className='text-sm text-gray-500'>{module.type}</p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              module.status === 'ONLINE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {module.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến'}
          </span>
        </div>

        {error && <div className='text-sm text-red-500 mb-3'>{error}</div>}

        <div className='flex gap-2'>
          <button
            onClick={() => executeCommand(() => toggle(module.id, true), 'Bật')}
            disabled={isLoading || module.status === 'OFFLINE'}
            className={`flex-1 py-2 px-3 rounded font-medium transition-colors ${
              isOn
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
            } disabled:opacity-50`}
          >
            {isLoading ? <Loader size={16} className='inline animate-spin' /> : 'Bật'}
          </button>
          <button
            onClick={() => executeCommand(() => toggle(module.id, false), 'Tắt')}
            disabled={isLoading || module.status === 'OFFLINE'}
            className={`flex-1 py-2 px-3 rounded font-medium transition-colors ${
              !isOn
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
            } disabled:opacity-50`}
          >
            {isLoading ? <Loader size={16} className='inline animate-spin' /> : 'Tắt'}
          </button>
        </div>
      </div>
    );
  }

  if (module.type === 'LED') {
    // Color picker
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='font-semibold text-gray-900'>{module.name}</h3>
            <p className='text-sm text-gray-500'>LED</p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              module.status === 'ONLINE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {module.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến'}
          </span>
        </div>

        {error && <div className='text-sm text-red-500 mb-3'>{error}</div>}

        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <label className='text-sm font-medium text-gray-700 w-20'>Màu:</label>
            <div className='flex items-center gap-2'>
              <input
                type='color'
                value={`#${colorValue}`}
                onChange={(e) => setColorValue(e.target.value.slice(1))}
                className='w-12 h-10 rounded cursor-pointer'
              />
              <input
                type='text'
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value.toUpperCase())}
                className='flex-1 px-2 py-1 text-sm border border-gray-200 rounded'
                placeholder='FF5733'
              />
            </div>
          </div>

          <button
            onClick={() => executeCommand(() => setColor(module.id, colorValue), 'Đặt màu')}
            disabled={isLoading || module.status === 'OFFLINE'}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded font-medium transition-colors disabled:opacity-50'
          >
            {isLoading ? <Loader size={16} className='inline animate-spin mr-2' /> : ''}
            Áp dụng
          </button>
        </div>
      </div>
    );
  }

  if (module.type === 'FAN') {
    // Speed control
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='font-semibold text-gray-900'>{module.name}</h3>
            <p className='text-sm text-gray-500'>Quạt</p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              module.status === 'ONLINE'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {module.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến'}
          </span>
        </div>

        {error && <div className='text-sm text-red-500 mb-3'>{error}</div>}

        <div className='space-y-3'>
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-2'>
              Tốc độ: {speedValue}
            </label>
            <input
              type='range'
              min='0'
              max='3'
              value={speedValue}
              onChange={(e) => setSpeedValue(Number(e.target.value))}
              className='w-full'
            />
          </div>

          <div className='flex gap-2'>
            <button
              onClick={() => executeCommand(() => toggle(module.id, true), 'Bật')}
              disabled={isLoading || module.status === 'OFFLINE'}
              className='flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-3 rounded font-medium transition-colors disabled:opacity-50'
            >
              Bật
            </button>
            <button
              onClick={() => executeCommand(() => setSpeed(module.id, speedValue), 'Đặt tốc độ')}
              disabled={isLoading || module.status === 'OFFLINE'}
              className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded font-medium transition-colors disabled:opacity-50'
            >
              {isLoading ? <Loader size={16} className='inline animate-spin' /> : 'Áp dụng'}
            </button>
            <button
              onClick={() => executeCommand(() => toggle(module.id, false), 'Tắt')}
              disabled={isLoading || module.status === 'OFFLINE'}
              className='flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded font-medium transition-colors disabled:opacity-50'
            >
              Tắt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default for unknown types
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-semibold text-gray-900'>{module.name}</h3>
          <p className='text-sm text-gray-500'>{module.type}</p>
        </div>
        <Settings size={16} className='text-gray-400' />
      </div>
    </div>
  );
};

export default ModuleControlCard;
