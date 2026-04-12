/**
 * DeviceControlPanel Component
 * Main component for device management and module control
 */

import { FC, useState, useEffect } from 'react';
import { Plus, Search, X, AlertCircle } from 'lucide-react';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import { useModuleControl } from '../../hooks/useModuleControl';
import { DeviceListItem } from './DeviceListItem';
import { ModuleControlCard } from './ModuleControlCard';
import type { DeviceDTO, CreateDeviceRequest, AddModuleRequest } from '../../types/api';

interface DeviceControlPanelProps {
  homeId: string;
  roomId?: string; // Filter by room if provided
  onDeviceSelected?: (device: DeviceDTO) => void;
}

export const DeviceControlPanel: FC<DeviceControlPanelProps> = ({
  homeId,
  roomId,
  onDeviceSelected,
}) => {
  const { devices, loading: devicesLoading, error: devicesError, fetchDevices, createDevice, deleteDevice, moveDevice } =
    useDeviceControl();
  const { modules, addModule, getModule } = useModuleControl();
  const { rooms } = useRooms?.() || { rooms: [] };

  const [selectedDevice, setSelectedDevice] = useState<DeviceDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceFirmwareId, setNewDeviceFirmwareId] = useState('');
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleType, setNewModuleType] = useState<'LIGHT' | 'FAN' | 'SWITCH' | 'LED' | 'TEMPERATURE' | 'HUMIDITY' | 'MOTION'>('LIGHT');
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [deviceChannels, setDeviceChannels] = useState<any[]>([]);

  // Fetch devices on mount or when homeId changes
  useEffect(() => {
    if (homeId) {
      fetchDevices(homeId);
    }
  }, [homeId, fetchDevices]);

  // Filter devices by room if specified
  const filteredDevices = devices.filter((device) => {
    const matchesRoom = roomId ? device.roomId === roomId : true;
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.firmwareId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoom && matchesSearch;
  });

  // Get modules for selected device
  const deviceModules = selectedDevice
    ? Array.from(modules.values()).filter((m) => 'deviceChannelId' in m)
    : [];

  const handleSelectDevice = async (device: DeviceDTO) => {
    setSelectedDevice(device);
    onDeviceSelected?.(device);
  };

  const handleAddDevice = async () => {
    if (!newDeviceName.trim() || !newDeviceFirmwareId.trim()) {
      alert('Vui lòng nhập tên và Firmware ID');
      return;
    }

    try {
      const deviceData: CreateDeviceRequest = {
        name: newDeviceName,
        firmwareId: newDeviceFirmwareId,
        roomId: roomId || null,
      };
      await createDevice(homeId, deviceData);
      setNewDeviceName('');
      setNewDeviceFirmwareId('');
      setShowAddDevice(false);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  const handleAddModule = async () => {
    if (!selectedDevice || !selectedChannelId || !newModuleName.trim()) {
      alert('Vui lòng chọn kênh và nhập tên module');
      return;
    }

    try {
      const moduleData: AddModuleRequest = {
        name: newModuleName,
        type: newModuleType,
        channelId: selectedChannelId,
      };
      await addModule(selectedDevice.id, moduleData);
      setNewModuleName('');
      setSelectedChannelId('');
      setShowAddModule(false);
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  return (
    <div className='grid grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen'>
      {/* LEFT PANEL - Device List */}
      <div className='col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>Thiết Bị</h2>

          <div className='relative mb-3'>
            <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
            <input
              type='text'
              placeholder='Tìm kiếm...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            onClick={() => setShowAddDevice(!showAddDevice)}
            className='w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-colors'
          >
            <Plus size={18} />
            Thêm Thiết Bị
          </button>
        </div>

        {/* Add Device Form */}
        {showAddDevice && (
          <div className='p-4 border-b border-gray-200 bg-blue-50'>
            <input
              type='text'
              placeholder='Tên thiết bị'
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              placeholder='Firmware ID'
              value={newDeviceFirmwareId}
              onChange={(e) => setNewDeviceFirmwareId(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <div className='flex gap-2'>
              <button
                onClick={handleAddDevice}
                className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm transition-colors'
              >
                Thêm
              </button>
              <button
                onClick={() => setShowAddDevice(false)}
                className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors'
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Device List */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          {devicesLoading && <div className='text-center text-gray-500'>Đang tải...</div>}
          {devicesError && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2'>
              <AlertCircle size={18} className='text-red-500 flex-shrink-0 mt-0.5' />
              <p className='text-sm text-red-700'>{devicesError}</p>
            </div>
          )}
          {filteredDevices.length === 0 && !devicesLoading && (
            <div className='text-center text-gray-500 py-8'>Không có thiết bị nào</div>
          )}
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => handleSelectDevice(device)}
              className={`cursor-pointer rounded-lg border-2 transition-all ${
                selectedDevice?.id === device.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <DeviceListItem
                device={device}
                onSelect={handleSelectDevice}
                onDelete={deleteDevice}
                onMove={() => {
                  // Handle move to another room
                  const newRoomId = prompt('Nhập Room ID (để trống để bỏ gán):');
                  if (newRoomId !== null) {
                    moveDevice(device.id, newRoomId || null);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE PANEL - Device Details */}
      <div className='col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col'>
        {selectedDevice ? (
          <>
            <div className='p-4 border-b border-gray-200'>
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-lg font-semibold text-gray-900'>{selectedDevice.name}</h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    ID: {selectedDevice.firmwareId}
                  </p>
                  <p className='text-sm text-gray-500'>Phòng: {selectedDevice.roomName}</p>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      selectedDevice.status === 'ONLINE' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {selectedDevice.status === 'ONLINE' ? '✓ Trực tuyến' : '✗ Ngoài tuyến'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <X size={20} className='text-gray-400' />
                </button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4'>
              <div className='mb-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='font-semibold text-gray-900'>Thông Tin Thiết Bị</h3>
                </div>
                <div className='text-sm text-gray-600 space-y-1'>
                  <p>
                    <span className='font-medium'>Tạo lúc:</span>{' '}
                    {new Date(selectedDevice.createdAt).toLocaleString('vi-VN')}
                  </p>
                  <p>
                    <span className='font-medium'>Cập nhật:</span>{' '}
                    {new Date(selectedDevice.updatedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='flex items-center justify-center h-full text-gray-500'>
            Chọn thiết bị để xem chi tiết
          </div>
        )}
      </div>

      {/* RIGHT PANEL - Module Control */}
      <div className='col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>Module</h2>
          {selectedDevice && selectedDevice.status === 'ONLINE' && (
            <button
              onClick={() => setShowAddModule(!showAddModule)}
              className='w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm'
            >
              <Plus size={18} />
              Thêm Module
            </button>
          )}
        </div>

        {/* Add Module Form */}
        {showAddModule && selectedDevice && (
          <div className='p-4 border-b border-gray-200 bg-green-50 space-y-3'>
            <input
              type='text'
              placeholder='Tên module'
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <select
              value={newModuleType}
              onChange={(e) => setNewModuleType(e.target.value as any)}
              className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value='LIGHT'>Đèn</option>
              <option value='FAN'>Quạt</option>
              <option value='SWITCH'>Công tắc</option>
              <option value='LED'>LED</option>
              <option value='TEMPERATURE'>Cảm biến nhiệt độ</option>
              <option value='HUMIDITY'>Cảm biến độ ẩm</option>
              <option value='MOTION'>Cảm biến chuyển động</option>
            </select>
            <div className='flex gap-2'>
              <button
                onClick={handleAddModule}
                className='flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium text-sm transition-colors'
              >
                Thêm
              </button>
              <button
                onClick={() => setShowAddModule(false)}
                className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors'
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Module List */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          {!selectedDevice && (
            <div className='text-center text-gray-500 py-8'>Chọn thiết bị để xem module</div>
          )}
          {selectedDevice && deviceModules.length === 0 && (
            <div className='text-center text-gray-500 py-8'>Không có module nào</div>
          )}
          {deviceModules.map((module) => (
            <ModuleControlCard
              key={module.id}
              module={module}
              onCommandSent={() => {
                console.log('Command sent for module:', module.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock hook for rooms - replace with actual implementation
function useRooms() {
  return { rooms: [] };
}

export default DeviceControlPanel;
