'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  UserCheck,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Activity,
  CreditCard,
  Eye
} from 'lucide-react';

// Types
interface Lead {
  id: string;
  createdAt: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  businessName: string | null;
  packageInterest: string | null;
  status: string;
  score: number;
  source: string;
  budgetRange: string | null;
}

interface Client {
  id: string;
  createdAt: string;
  businessName: string;
  contactName: string;
  email: string;
  paymentStatus: string;
  paymentAmount: number | null;
  package: string | null;
  projectStatus: string;
}

interface Order {
  id: string;
  createdAt: string;
  packageName: string;
  totalAmount: number;
  payerEmail: string | null;
  payerName: string | null;
  status: string;
}

interface Activity {
  id: string;
  type: 'lead' | 'status_change' | 'payment';
  timestamp: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

// Lead statuses for pipeline
const LEAD_STATUSES = [
  { key: 'NEW', label: 'New', color: 'bg-gray-100 text-gray-800' },
  { key: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { key: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'NEGOTIATING', label: 'Negotiating', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'WON', label: 'Won', color: 'bg-green-100 text-green-800' },
  { key: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-800' },
  { key: 'NURTURING', label: 'Nurturing', color: 'bg-orange-100 text-orange-800' }
];

export default function CRMDashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, clientsRes, ordersRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/clients'),
        fetch('/api/orders')
      ]);

      const leadsData = await leadsRes.json();
      const clientsData = await clientsRes.json();
      const ordersData = await ordersRes.json();

      setLeads(leadsData.leads || []);
      setClients(clientsData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate date filter
  const filterByDate = (date: string) => {
    const itemDate = new Date(date);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    switch (dateFilter) {
      case 'this_week':
        return itemDate >= startOfWeek;
      case 'this_month':
        return itemDate >= startOfMonth;
      case 'all_time':
        return true;
      default:
        return true;
    }
  };

  // Filter leads based on search and date
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchQuery === '' ||
        lead.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.businessName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = filterByDate(lead.createdAt);

      return matchesSearch && matchesDate;
    });
  }, [leads, searchQuery, filterByDate]);

  // Calculate stats
  const stats = useMemo(() => {
    const thisMonthLeads = leads.filter(lead => filterByDate(lead.createdAt));
    const thisMonthOrders = orders.filter(order => filterByDate(order.createdAt));

    const wonLeads = thisMonthLeads.filter(lead => lead.status === 'WON').length;
    const totalLeads = thisMonthLeads.length;
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';

    const totalRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const activeClients = clients.filter(client =>
      client.projectStatus !== 'delivered' &&
      client.paymentStatus === 'paid'
    ).length;

    return {
      totalLeads,
      conversionRate,
      totalRevenue,
      activeClients
    };
  }, [leads, clients, orders, filterByDate]);

  // Group leads by status for pipeline
  const pipelineData = useMemo(() => {
    return LEAD_STATUSES.map(status => ({
      ...status,
      leads: filteredLeads.filter(lead => lead.status === status.key)
    }));
  }, [filteredLeads]);

  // Generate activity feed
  const recentActivity = useMemo((): Activity[] => {
    const activities: Activity[] = [];

    // Add new leads
    leads.slice(0, 5).forEach(lead => {
      activities.push({
        id: `lead-${lead.id}`,
        type: 'lead',
        timestamp: lead.createdAt,
        title: 'New Lead',
        description: `${lead.fullName || 'Anonymous'} - ${lead.businessName || 'No business name'}`,
        icon: Users
      });
    });

    // Add status changes (simulate - in real app you'd track this)
    leads.filter(l => l.status === 'WON').slice(0, 3).forEach(lead => {
      activities.push({
        id: `status-${lead.id}`,
        type: 'status_change',
        timestamp: lead.createdAt,
        title: 'Lead Won',
        description: `${lead.fullName || 'Anonymous'} converted to client`,
        icon: CheckCircle
      });
    });

    // Add payments
    orders.slice(0, 5).forEach(order => {
      activities.push({
        id: `payment-${order.id}`,
        type: 'payment',
        timestamp: order.createdAt,
        title: 'Payment Received',
        description: `$${(order.totalAmount / 100).toFixed(2)} - ${order.packageName}`,
        icon: CreditCard
      });
    });

    // Sort by timestamp descending
    return activities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  }, [leads, orders]);

  // Drag and drop handler (simplified - you can enhance this)
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');

    // Update lead status via API
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your leads and track your pipeline</p>
        </div>
        <button
          onClick={() => setShowAddLeadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.conversionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Lead to client</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${(stats.totalRevenue / 100).toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeClients}</p>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="all_time">All Time</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline View - Kanban Style */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pipeline View</h2>

        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {pipelineData.map(column => (
              <div
                key={column.key}
                onDrop={(e) => handleDrop(e, column.key)}
                onDragOver={handleDragOver}
                className="flex-shrink-0 w-72"
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{column.label}</h3>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {column.leads.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {column.leads.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No leads
                      </div>
                    ) : (
                      column.leads.map(lead => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {lead.fullName || 'Anonymous'}
                            </h4>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {lead.score}
                            </span>
                          </div>

                          {lead.businessName && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                              <Building className="w-3 h-3" />
                              {lead.businessName}
                            </div>
                          )}

                          {lead.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </div>
                          )}

                          {lead.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                            {lead.packageInterest && (
                              <span className="text-xs text-green-600 font-medium">
                                ${lead.packageInterest}
                              </span>
                            )}
                          </div>

                          <button className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1">
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No recent activity
            </div>
          ) : (
            recentActivity.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'lead' ? 'bg-blue-100' :
                    activity.type === 'status_change' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      activity.type === 'lead' ? 'text-blue-600' :
                      activity.type === 'status_change' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <AddLeadModal
          onClose={() => setShowAddLeadModal(false)}
          onSuccess={() => {
            setShowAddLeadModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Add Lead Modal Component
function AddLeadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    packageInterest: '',
    budgetRange: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'manual'
        })
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type / Industry
              </label>
              <input
                type="text"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Interest
              </label>
              <select
                value={formData.packageInterest}
                onChange={(e) => setFormData({ ...formData, packageInterest: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select package</option>
                <option value="Launch Kit">Launch Kit</option>
                <option value="Content Engine">Content Engine</option>
                <option value="Content Engine Pro">Content Engine Pro</option>
                <option value="Authority Engine">Authority Engine</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select range</option>
                <option value="Under $1,000">Under $1,000</option>
                <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
