/**
 * AlertRuleManagement Component
 * Manages alert rules for sensor modules (TEMPERATURE, HUMIDITY, LIGHT_SENSOR, MOTION)
 */

import { FC, useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit2, Loader, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import type { AlertRuleDTO, CreateAlertRuleRequest, UpdateAlertRuleRequest, AlertOperator, ModuleDTO } from '../types/api';
import { alertRuleService } from '../api/services/alertRuleService';

interface AlertRuleManagementProps {
  module: ModuleDTO;
  onRulesChanged?: () => void;
}

const SENSOR_TYPES = ['TEMPERATURE', 'HUMIDITY', 'LIGHT_SENSOR', 'MOTION'];

const OPERATORS: { value: AlertOperator; label: string; symbol: string }[] = [
  { value: 'GREATER_THAN', label: 'Lớn hơn', symbol: '>' },
  { value: 'GREATER_THAN_OR_EQUAL', label: 'Lớn hơn hoặc bằng', symbol: '>=' },
  { value: 'LESS_THAN', label: 'Nhỏ hơn', symbol: '<' },
  { value: 'LESS_THAN_OR_EQUAL', label: 'Nhỏ hơn hoặc bằng', symbol: '<=' },
  { value: 'EQUAL', label: 'Bằng', symbol: '=' },
  { value: 'NOT_EQUAL', label: 'Khác', symbol: '!=' },
];

const getOperatorSymbol = (operator: AlertOperator): string => {
  return OPERATORS.find((op) => op.value === operator)?.symbol ?? operator;
};

const getUnitForType = (type: string): string => {
  switch (type) {
    case 'TEMPERATURE':
      return '°C';
    case 'HUMIDITY':
      return '%';
    case 'LIGHT_SENSOR':
      return 'lux';
    case 'MOTION':
      return '';
    default:
      return '';
  }
};

export const AlertRuleManagement: FC<AlertRuleManagementProps> = ({ module, onRulesChanged }) => {
  const [rules, setRules] = useState<AlertRuleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRuleDTO | null>(null);

  const [formData, setFormData] = useState<CreateAlertRuleRequest>({
    value: '',
    message: '',
    enabled: true,
    operator: 'GREATER_THAN',
  });

  const isSensorModule = SENSOR_TYPES.includes(module.type);
  const unit = getUnitForType(module.type);

  useEffect(() => {
    if (isSensorModule) {
      loadRules();
    }
  }, [module.id, isSensorModule]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await alertRuleService.getAlertRules(module.id);
      setRules(data);
    } catch (error) {
      console.error('Failed to load alert rules:', error);
      toast.error('Không thể tải danh sách cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      value: '',
      message: '',
      enabled: true,
      operator: 'GREATER_THAN',
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.value.trim()) {
      toast.error('Vui lòng nhập giá trị ngưỡng');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Vui lòng nhập nội dung cảnh báo');
      return;
    }

    setLoading(true);
    try {
      if (editingRule) {
        const updateData: UpdateAlertRuleRequest = {
          value: formData.value,
          message: formData.message,
          enabled: formData.enabled,
          operator: formData.operator,
        };
        await alertRuleService.updateAlertRule(module.id, editingRule.id, updateData);
        toast.success('Cập nhật cảnh báo thành công');
      } else {
        await alertRuleService.createAlertRule(module.id, formData);
        toast.success('Tạo cảnh báo thành công');
      }
      await loadRules();
      resetForm();
      onRulesChanged?.();
    } catch (error) {
      console.error('Failed to save alert rule:', error);
      toast.error(editingRule ? 'Không thể cập nhật cảnh báo' : 'Không thể tạo cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: AlertRuleDTO) => {
    setEditingRule(rule);
    setFormData({
      value: rule.value,
      message: rule.message,
      enabled: rule.enabled,
      operator: rule.operator,
    });
    setShowForm(true);
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Bạn có chắc muốn xóa cảnh báo này?')) return;

    setLoading(true);
    try {
      await alertRuleService.deleteAlertRule(module.id, ruleId);
      toast.success('Xóa cảnh báo thành công');
      await loadRules();
      onRulesChanged?.();
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      toast.error('Không thể xóa cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (rule: AlertRuleDTO) => {
    setLoading(true);
    try {
      await alertRuleService.toggleAlertRule(module.id, rule.id, !rule.enabled);
      toast.success(rule.enabled ? 'Đã tắt cảnh báo' : 'Đã bật cảnh báo');
      await loadRules();
      onRulesChanged?.();
    } catch (error) {
      console.error('Failed to toggle alert rule:', error);
      toast.error('Không thể thay đổi trạng thái cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  if (!isSensorModule) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900">Cảnh báo</h3>
          {rules.length > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {rules.length}
            </span>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Thêm
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">
            {editingRule ? 'Chỉnh sửa cảnh báo' : 'Tạo cảnh báo mới'}
          </h4>

          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Điều kiện</label>
                <select
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value as AlertOperator })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label} ({op.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng {unit && `(${unit})`}</label>
                <input
                  type="number"
                  step="any"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Vd: 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Vd: Nhiệt độ quá cao!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="enabled" className="text-sm text-gray-700">
                Kích hoạt ngay
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                {editingRule ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Hủy
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && rules.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader size={20} className="animate-spin mr-2" />
          Đang tải...
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <AlertTriangle size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Chưa có cảnh báo nào</p>
          <p className="text-xs text-gray-400 mt-1">Thêm cảnh báo để nhận email khi vượt ngưỡng</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                rule.enabled ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      rule.enabled ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {getOperatorSymbol(rule.operator)} {rule.value}
                    {unit}
                  </span>
                  {!rule.enabled && (
                    <span className="text-xs text-gray-400">(Đã tắt)</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 truncate">{rule.message}</p>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => handleToggle(rule)}
                  disabled={loading}
                  className={`p-1.5 rounded transition-colors ${
                    rule.enabled
                      ? 'text-orange-600 hover:bg-orange-100'
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                  title={rule.enabled ? 'Tắt cảnh báo' : 'Bật cảnh báo'}
                >
                  <Bell size={16} />
                </button>
                <button
                  onClick={() => handleEdit(rule)}
                  disabled={loading}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  disabled={loading}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertRuleManagement;
