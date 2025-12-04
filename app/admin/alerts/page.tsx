'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  XCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  Clock,
  DollarSign,
  Shield,
  Bell
} from 'lucide-react';

interface Alert {
  id: string;
  createdAt: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  metadata?: string;
  isRead: boolean;
  readAt?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolution?: string;
}

interface Dispute {
  id: string;
  createdAt: string;
  disputeId: string;
  amount?: number;
  reason: string;
  status: string;
  outcome?: string;
  order?: {
    paypalOrderId: string;
    packageName: string;
  };
  client?: {
    businessName: string;
    email: string;
  };
}

interface Refund {
  id: string;
  createdAt: string;
  refundId: string;
  amount?: number;
  refundType: string;
  status: string;
  order?: {
    paypalOrderId: string;
    packageName: string;
  };
  client?: {
    businessName: string;
    email: string;
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'disputes' | 'refunds'>('alerts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, disputesRes, refundsRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/disputes'),
        fetch('/api/refunds'),
      ]);

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data);
      }
      if (disputesRes.ok) {
        const data = await disputesRes.json();
        setDisputes(data);
      }
      if (refundsRes.ok) {
        const data = await refundsRes.json();
        setRefunds(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAlertRead = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      setAlerts(alerts.map(a =>
        a.id === alertId ? { ...a, isRead: true, readAt: new Date().toISOString() } : a
      ));
    } catch (error) {
      console.error('Error marking alert read:', error);
    }
  };

  const resolveAlert = async (alertId: string, resolution: string) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isResolved: true, resolution }),
      });
      setAlerts(alerts.map(a =>
        a.id === alertId ? { ...a, isResolved: true, resolvedAt: new Date().toISOString(), resolution } : a
      ));
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatCurrency = (cents?: number) => {
    if (!cents) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const openDisputesCount = disputes.filter(d => d.status === 'open' || d.status === 'OPEN').length;
  const pendingRefundsCount = refunds.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Alerts & Disputes</h1>
                <p className="text-sm text-gray-500">Monitor critical events and financial issues</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread Alerts</p>
                <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Disputes</p>
                <p className="text-3xl font-bold text-red-600">{openDisputesCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Refunds</p>
                <p className="text-3xl font-bold text-orange-600">{pendingRefundsCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Alerts {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('disputes')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'disputes'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Disputes {openDisputesCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                    {openDisputesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('refunds')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'refunds'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Refunds
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            ) : (
              <>
                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
                        <p className="mt-2 text-gray-500">No alerts at this time</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${
                            alert.isRead ? 'bg-gray-50' : 'bg-white'
                          } ${getSeverityColor(alert.severity)}`}
                        >
                          <div className="flex items-start gap-4">
                            {getSeverityIcon(alert.severity)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${alert.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                  {alert.title}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {formatDate(alert.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                              {alert.isResolved && (
                                <p className="mt-2 text-xs text-green-600">
                                  Resolved: {alert.resolution}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-3">
                                {!alert.isRead && (
                                  <button
                                    onClick={() => markAlertRead(alert.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" /> Mark as read
                                  </button>
                                )}
                                {!alert.isResolved && (
                                  <button
                                    onClick={() => resolveAlert(alert.id, 'Reviewed and addressed')}
                                    className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" /> Resolve
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Disputes Tab */}
                {activeTab === 'disputes' && (
                  <div className="space-y-4">
                    {disputes.length === 0 ? (
                      <div className="text-center py-12">
                        <Shield className="w-12 h-12 mx-auto text-green-400" />
                        <p className="mt-2 text-gray-500">No disputes</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                              <th className="pb-3">Dispute ID</th>
                              <th className="pb-3">Client</th>
                              <th className="pb-3">Amount</th>
                              <th className="pb-3">Reason</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {disputes.map((dispute) => (
                              <tr key={dispute.id} className="hover:bg-gray-50">
                                <td className="py-3">
                                  <span className="font-mono text-sm">{dispute.disputeId.slice(0, 12)}...</span>
                                </td>
                                <td className="py-3">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {dispute.client?.businessName || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500">{dispute.client?.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 font-medium text-red-600">
                                  {formatCurrency(dispute.amount)}
                                </td>
                                <td className="py-3 text-sm text-gray-600">
                                  {dispute.reason.replace(/_/g, ' ')}
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    dispute.status.toLowerCase() === 'open'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {dispute.status}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">
                                  {formatDate(dispute.createdAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Refunds Tab */}
                {activeTab === 'refunds' && (
                  <div className="space-y-4">
                    {refunds.length === 0 ? (
                      <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 mx-auto text-green-400" />
                        <p className="mt-2 text-gray-500">No refunds processed</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                              <th className="pb-3">Refund ID</th>
                              <th className="pb-3">Client</th>
                              <th className="pb-3">Amount</th>
                              <th className="pb-3">Type</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {refunds.map((refund) => (
                              <tr key={refund.id} className="hover:bg-gray-50">
                                <td className="py-3">
                                  <span className="font-mono text-sm">{refund.refundId.slice(0, 12)}...</span>
                                </td>
                                <td className="py-3">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {refund.client?.businessName || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500">{refund.client?.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 font-medium text-orange-600">
                                  {formatCurrency(refund.amount)}
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    refund.refundType === 'full'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {refund.refundType}
                                  </span>
                                </td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    refund.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {refund.status}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-gray-500">
                                  {formatDate(refund.createdAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
