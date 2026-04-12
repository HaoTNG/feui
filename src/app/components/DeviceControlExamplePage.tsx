/**
 * Example: Complete Device Control Page
 * Demonstrates full device management and module control
 */

import React, { useState, useEffect } from 'react';
import { Home, Grid, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { useDeviceControl } from '../../hooks/useDeviceControl';
import { useModuleControl } from '../../hooks/useModuleControl';
import { DeviceListItem } from '../../components/DeviceListItem';
import { ModuleControlCard } from '../../components/ModuleControlCard';
import type { DeviceDTO } from '../../types/api';

/**
 * Complete page showing device management and control
 */
export function DeviceControlExamplePage() {
  const homeId = 'home-123'; // Get from route params in real app

  // Device management
  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
    fetchDevices,
    createDevice,
    deleteDevice,
    moveDevice,
  } = useDeviceControl();

  // Module control
  const { modules, addModule, deleteModule, toggle, setBrightness } = useModuleControl();

  // Local state
  const [selectedDevice, setSelectedDevice] = useState<DeviceDTO | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeviceForm, setNewDeviceForm] = useState({
    name: '',
    firmwareId: '',
  });

  // Load devices on mount
  useEffect(() => {
    fetchDevices(homeId);
  }, [homeId, fetchDevices]);

  // Handle create device
  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDeviceForm.name || !newDeviceForm.firmwareId) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createDevice(homeId, {
        name: newDeviceForm.name,
        firmwareId: newDeviceForm.firmwareId,
        roomId: null,
      });

      setNewDeviceForm({ name: '', firmwareId: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create device:', error);
    }
  };

  // Get modules for selected device
  const selectedDeviceModules = selectedDevice
    ? Array.from(modules.values()).filter((m) => m.id === selectedDevice.id)
    : [];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center gap-3'>
          <Home size={28} className='text-blue-600' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Device Control System</h1>
            <p className='text-sm text-gray-600'>Manage and control all your smart home devices</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-4 gap-6 p-6'>
        {/* LEFT: Device List */}
        <div className='col-span-1 space-y-4'>
          <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            {/* Device List Header */}
            <div className='p-4 border-b border-gray-200'>
              <div className='flex items-center gap-2 mb-4'>
                <Grid size={20} className='text-blue-600' />
                <h2 className='font-semibold text-gray-900'>Devices ({devices.length})</h2>
              </div>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors'
              >
                + Add Device
              </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className='p-4 bg-blue-50 border-b border-gray-200'>
                <form onSubmit={handleCreateDevice} className='space-y-3'>
                  <input
                    type='text'
                    placeholder='Device Name'
                    value={newDeviceForm.name}
                    onChange={(e) =>
                      setNewDeviceForm({ ...newDeviceForm, name: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <input
                    type='text'
                    placeholder='Firmware ID'
                    value={newDeviceForm.firmwareId}
                    onChange={(e) =>
                      setNewDeviceForm({ ...newDeviceForm, firmwareId: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <div className='flex gap-2'>
                    <button
                      type='submit'
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors'
                    >
                      Add
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowCreateForm(false)}
                      className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Device List */}
            <div className='p-4 space-y-2 max-h-96 overflow-y-auto'>
              {devicesLoading && <div className='text-center text-gray-500 py-4'>Loading...</div>}

              {devicesError && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2'>
                  <AlertCircle size={18} className='text-red-500 flex-shrink-0' />
                  <p className='text-sm text-red-700'>{devicesError}</p>
                </div>
              )}

              {devices.length === 0 && !devicesLoading && (
                <div className='text-center text-gray-500 py-8'>No devices added yet</div>
              )}

              {devices.map((device) => (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedDevice?.id === device.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>{device.name}</p>
                      <p className='text-xs text-gray-500'>{device.firmwareId}</p>
                      <div className='flex items-center gap-2 mt-1'>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            device.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className='text-xs text-gray-600'>
                          {device.status === 'ONLINE' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDevice(device.id);
                      }}
                      className='text-red-500 hover:text-red-700 text-sm'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Device Details */}
        <div className='col-span-1 bg-white rounded-lg shadow-md overflow-hidden'>
          {selectedDevice ? (
            <div className='h-full flex flex-col'>
              <div className='p-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>{selectedDevice.name}</h2>
                <div className='mt-3 space-y-2 text-sm text-gray-600'>
                  <p>
                    <span className='font-medium'>Firmware ID:</span> {selectedDevice.firmwareId}
                  </p>
                  <p>
                    <span className='font-medium'>Room:</span> {selectedDevice.roomName || 'Unassigned'}
                  </p>
                  <p className='flex items-center gap-2'>
                    <span className='font-medium'>Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedDevice.status === 'ONLINE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedDevice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className='flex-1 p-4 text-center text-gray-500'>
                <Zap size={32} className='mx-auto mb-2 opacity-50' />
                <p className='text-sm'>Select a device to see its modules</p>
              </div>
            </div>
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
              <div className='text-center'>
                <Home size={48} className='mx-auto mb-2 opacity-30' />
                <p>Select a device to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Module Controls */}
        <div className='col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col'>
          <div className='p-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
              <Zap size={20} className='text-yellow-500' />
              Module Controls
            </h2>
          </div>

          <div className='flex-1 p-4 overflow-y-auto space-y-3'>
            {!selectedDevice ? (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <p>Select a device to control its modules</p>
              </div>
            ) : selectedDeviceModules.length === 0 ? (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <p>No modules available for this device</p>
              </div>
            ) : (
              selectedDeviceModules.map((module) => (
                <ModuleControlCard key={module.id} module={module} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className='fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500'>
        <div className='flex items-center gap-2 mb-2'>
          <CheckCircle size={18} className='text-green-500' />
          <span className='font-semibold text-gray-900'>System Status</span>
        </div>
        <div className='text-sm text-gray-600 space-y-1'>
          <p>Devices: {devices.length}</p>
          <p>
            Online:{' '}
            {devices.filter((d) => d.status === 'ONLINE').length}
          </p>
          <p>Modules: {modules.size}</p>
        </div>
      </div>
    </div>
  );
}

export default DeviceControlExamplePage;
