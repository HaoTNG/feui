/**
 * Smart Device Management Page
 * Integrated device and module control using new hooks
 */

import { useState, useEffect } from 'react';
import { Plus, X, Zap, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useDeviceControl } from '../hooks/useDeviceControl';
import { useModuleControl } from '../hooks/useModuleControl';
import { DeviceListItem } from './DeviceListItem';
import { ModuleControlCard } from './ModuleControlCard';
import type { DeviceDTO, CreateDeviceRequest, AddModuleRequest, DeviceChannelDTO } from '../types/api';
import { useApp } from '../contexts/AppContext';

export function SmartDeviceManagement() {
  const { isDarkMode, selectedHomeId } = useApp();
  const homeId = selectedHomeId || 'home-default';

  // Device management
  const {
    devices,
    channels,
    loading: devicesLoading,
    error: devicesError,
    fetchDevices,
    createDevice,
    deleteDevice,
    moveDevice,
    fetchChannels,
    clearError: clearDeviceError,
  } = useDeviceControl();

  // Module control
  const { modules, addModule, deleteModule, toggle, setBrightness, isCommandLoading } =
    useModuleControl();

  // Local state
  const [selectedDevice, setSelectedDevice] = useState<DeviceDTO | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceFirmwareId, setNewDeviceFirmwareId] = useState('');
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleType, setNewModuleType] = useState<any>('LIGHT');
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Load devices on mount
  useEffect(() => {
    if (homeId) {
      console.log('Loading devices for home:', homeId);
      fetchDevices(homeId)
        .then((loadedDevices) => {
          console.log('Devices loaded:', loadedDevices);
          // Auto-select first device if available
          if (loadedDevices && loadedDevices.length > 0) {
            setSelectedDevice(loadedDevices[0]);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch devices:', err);
          toast.error('Không thể tải thiết bị: ' + (err?.message || 'Unknown error'));
        });
    }
  }, [homeId, fetchDevices]);

  // Load channels when device selected
  useEffect(() => {
    if (selectedDevice) {
      console.log('[SmartDeviceManagement] Loading channels for device:', selectedDevice.id);
      fetchChannels(selectedDevice.id)
        .then((loadedChannels) => {
          console.log('[SmartDeviceManagement] Channels loaded:', loadedChannels);
        })
        .catch((err) => {
          console.error('[SmartDeviceManagement] Failed to fetch channels:', err);
          toast.error('Không thể tải kênh: ' + (err?.message || 'Unknown error'));
        });
    }
  }, [selectedDevice?.id, fetchChannels]);

  // Filter devices by search
  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.firmwareId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get modules for selected device
  const deviceModules = selectedDevice
    ? Array.from(modules.values()).filter((m) => 
        m.deviceChannelId !== undefined && m.deviceChannelId !== null
      )
    : [];

  // Handle create device
  const handleCreateDevice = async () => {
    if (!newDeviceName.trim() || !newDeviceFirmwareId.trim()) {
      toast.error('Vui lòng nhập tên và Firmware ID');
      return;
    }

    setIsCreating(true);
    try {
      const deviceData: CreateDeviceRequest = {
        name: newDeviceName,
        firmwareId: newDeviceFirmwareId,
        roomId: null,
      };
      console.log('Creating device:', deviceData);
      const result = await createDevice(homeId, deviceData);
      console.log('Device created:', result);
      setNewDeviceName('');
      setNewDeviceFirmwareId('');
      setShowAddDevice(false);
      toast.success('Thiết bị đã được tạo');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create device:', error);
      toast.error('Lỗi tạo thiết bị: ' + errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle add module
  const handleAddModule = async () => {
    if (!selectedDevice || !selectedChannelId || !newModuleName.trim()) {
      toast.error('Vui lòng chọn kênh và nhập tên module');
      return;
    }

    setIsCreating(true);
    try {
      const moduleData: AddModuleRequest = {
        name: newModuleName,
        type: newModuleType,
        channelId: selectedChannelId,
      };
      console.log('Adding module:', moduleData);
      const result = await addModule(selectedDevice.id, moduleData);
      console.log('Module added:', result);
      setNewModuleName('');
      setSelectedChannelId('');
      setShowAddModule(false);
      toast.success('Module đã được thêm');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to add module:', error);
      toast.error('Lỗi thêm module: ' + errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Smart Device Control
              </h1>
              <p
                className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Quản lý và điều khiển thiết bị thông minh
              </p>
            </div>
            <button
              onClick={() => setShowAddDevice(true)}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
            >
              <Plus size={20} />
              Thêm Thiết Bị
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-6'>
        {/* LEFT: Device List */}
        <div
          className={`col-span-1 rounded-lg shadow-md overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Thiết Bị ({devices.length})
            </h2>
            <input
              type='text'
              placeholder='Tìm kiếm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Add Device Form */}
          {showAddDevice && (
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-blue-50'}`}>
              <input
                type='text'
                placeholder='Tên thiết bị'
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-2 ${
                  isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <input
                type='text'
                placeholder='Firmware ID'
                value={newDeviceFirmwareId}
                onChange={(e) => setNewDeviceFirmwareId(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border mb-2 ${
                  isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <div className='flex gap-2'>
                <button
                  onClick={handleCreateDevice}
                  disabled={isCreating}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors'
                >
                  {isCreating ? <Loader size={16} className='inline animate-spin mr-2' /> : ''}
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddDevice(false)}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors'
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Device List */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 max-h-96 ${devicesError ? 'bg-red-50' : ''}`}>
            {devicesError && (
              <div className='bg-red-100 border border-red-300 rounded-lg p-3 flex items-start gap-2'>
                <AlertCircle size={18} className='text-red-600 flex-shrink-0 mt-0.5' />
                <div>
                  <p className='text-sm text-red-700 font-medium'>{devicesError}</p>
                  <button
                    onClick={clearDeviceError}
                    className='text-xs text-red-600 hover:text-red-700 mt-1'
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {devicesLoading && (
              <div className='text-center text-gray-500 py-4'>
                <Loader size={20} className='inline animate-spin' />
              </div>
            )}

            {!devicesLoading && filteredDevices.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Không có thiết bị nào
              </div>
            )}

            {filteredDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDevice?.id === device.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : `border-gray-200 dark:border-gray-700 ${isDarkMode ? 'hover:border-blue-400' : 'hover:border-blue-300'}`
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {device.name}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {device.firmwareId}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          device.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {device.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        console.log('Deleting device:', device.id);
                        await deleteDevice(device.id);
                        toast.success('Thiết bị đã được xóa');
                      } catch (error) {
                        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                        console.error('Failed to delete device:', error);
                        toast.error('Lỗi xóa thiết bị: ' + errorMsg);
                      }
                    }}
                    className='text-red-500 hover:text-red-700'
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Device Details */}
        <div
          className={`col-span-1 rounded-lg shadow-md overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {selectedDevice ? (
            <div className='h-full flex flex-col'>
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDevice.name}
                </h2>
                <div className={`mt-3 space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>
                    <span className='font-medium'>Firmware ID:</span> {selectedDevice.firmwareId}
                  </p>
                  <p>
                    <span className='font-medium'>Phòng:</span> {selectedDevice.roomName || 'Chưa gán'}
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='font-medium'>Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedDevice.status === 'ONLINE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {selectedDevice.status}
                    </span>
                  </p>
                </div>
              </div>
              <div
                className={`flex-1 p-4 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <div className='text-center'>
                  <Zap size={32} className='mx-auto mb-2 opacity-30' />
                  <p className='text-sm'>Chọn thiết bị để xem module</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
              <p>Chọn thiết bị để xem chi tiết</p>
            </div>
          )}
        </div>

        {/* RIGHT: Module Controls */}
        <div
          className={`col-span-1 rounded-lg shadow-md overflow-hidden flex flex-col ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Module
            </h2>
            {selectedDevice && selectedDevice.status === 'ONLINE' && (
              <button
                onClick={() => setShowAddModule(!showAddModule)}
                className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm'
              >
                <Plus size={18} />
                Thêm Module
              </button>
            )}
          </div>

          {/* Add Module Form */}
          {showAddModule && selectedDevice && (
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-green-50'} space-y-3`}>
              <input
                type='text'
                placeholder='Tên module'
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <select
                value={newModuleType}
                onChange={(e) => setNewModuleType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value='LIGHT'>Đèn</option>
                <option value='SWITCH'>Công tắc</option>
                <option value='FAN'>Quạt</option>
                <option value='LED'>LED</option>
                <option value='TEMPERATURE'>Cảm biến nhiệt độ</option>
                <option value='HUMIDITY'>Cảm biến độ ẩm</option>
                <option value='MOTION'>Cảm biến chuyển động</option>
              </select>
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Chọn kênh
                </label>
                <select
                  value={selectedChannelId}
                  onChange={(e) => setSelectedChannelId(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value=''>-- Chọn kênh --</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name} ({ch.id})
                    </option>
                  ))}
                </select>
                {channels.length === 0 && (
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Không có kênh nào. Hãy chọn device khác hoặc tải lại.
                  </p>
                )}
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleAddModule}
                  disabled={isCreating}
                  className='flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors'
                >
                  {isCreating ? <Loader size={16} className='inline animate-spin mr-2' /> : ''}
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddModule(false)}
                  className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors'
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Module List */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {!selectedDevice && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Chọn thiết bị để xem module
              </div>
            )}
            {selectedDevice && deviceModules.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Không có module nào
              </div>
            )}
            {deviceModules.map((module) => (
              <ModuleControlCard key={module.id} module={module} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartDeviceManagement;
