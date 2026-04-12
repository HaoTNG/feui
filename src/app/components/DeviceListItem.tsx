/**
 * DeviceListItem Component
 * Displays a single device with status and basic controls
 */

import { FC, useState } from 'react';
import { Trash2, MapPin, Edit2, ChevronRight } from 'lucide-react';
import type { DeviceDTO } from '../../types/api';

interface DeviceListItemProps {
  device: DeviceDTO;
  onSelect: (device: DeviceDTO) => void;
  onDelete: (deviceId: string) => void;
  onMove?: (deviceId: string) => void;
  onRename?: (deviceId: string) => void;
}

export const DeviceListItem: FC<DeviceListItemProps> = ({
  device,
  onSelect,
  onDelete,
  onMove,
  onRename,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColor = device.status === 'ONLINE' ? 'text-green-500' : 'text-red-500';
  const statusLabel = device.status === 'ONLINE' ? 'Trực tuyến' : 'Ngoài tuyến';

  const handleDelete = async () => {
    if (confirm(`Bạn có muốn xóa ${device.name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(device.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      onClick={() => onSelect(device)}
      className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer'
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-gray-900'>{device.name}</h3>
            <span className={`text-xs font-medium ${statusColor}`}>{statusLabel}</span>
          </div>
          <div className='flex items-center gap-2 mt-2 text-sm text-gray-500'>
            <MapPin size={14} />
            <span>{device.roomName || 'Chưa gán phòng'}</span>
          </div>
          <p className='text-xs text-gray-400 mt-1'>ID: {device.firmwareId}</p>
        </div>

        <div className='flex items-center gap-2 ml-4'>
          {device.status === 'ONLINE' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename?.(device.id);
              }}
              className='p-2 text-gray-400 hover:text-blue-500 transition-colors'
              title='Đổi tên'
            >
              <Edit2 size={16} />
            </button>
          )}

          {device.roomId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove?.(device.id);
              }}
              className='p-2 text-gray-400 hover:text-blue-500 transition-colors'
              title='Di chuyển phòng'
            >
              <MapPin size={16} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className='p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50'
            title='Xóa'
          >
            <Trash2 size={16} />
          </button>

          <ChevronRight size={16} className='text-gray-300' />
        </div>
      </div>
    </div>
  );
};

export default DeviceListItem;
