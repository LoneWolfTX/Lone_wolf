'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Link,
  Plus,
  HelpCircle,
  Copy,
  Check,
  Phone,
  AlertTriangle,
  FileText,
  PieChart,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { MarketingCampaign, MarketingSpendEntry } from '@/lib/marketing';

interface MarketingDashboardProps {
  adminPassword?: string;
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ adminPassword }) => {
  const [range, setRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Link Builder state
  const [utmPage, setUtmPage] = useState('/dumpster-rentals/20-yard');
  const [utmSource, setUtmSource] = useState('google');
  const [utmMedium, setUtmMedium] = useState('cpc');
  const [utmCampaign, setUtmCampaign] = useState('dfw_20yard');

  // New Campaign Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [cmpName, setCmpName] = useState('');
  const [cmpPlatform, setCmpPlatform] = useState('Google Ads');
  const [cmpUtm, setCmpUtm] = useState('');
  const [cmpCity, setCmpCity] = useState('');
  const [cmpNotes, setCmpNotes] = useState('');
  const [savingCmp, setSavingCmp] = useState(false);

  // New Spend Entry Modal
  const [showSpendModal, setShowSpendModal] = useState(false);
  const [spendCmpId, setSpendCmpId] = useState('');
  const [spendAmount, setSpendAmount] = useState(500);
  const [spendStartDate, setSpendStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [spendEndDate, setSpendEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [savingSpend, setSavingSpend] = useState(false);

  // Phone / Manual Lead Modal
  const [showPhoneLeadModal, setShowPhoneLeadModal] = useState(false);
  const [phoneName, setPhoneName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [phoneAddr, setPhoneAddr] = useState('');
  const [phoneSvc, setPhoneSvc] = useState('20 Yard Dumpster');
  const [phoneSource, setPhoneSource] = useState('Repeat Customer');
  const [savingPhoneLead, setSavingPhoneLead] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marketing/stats?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setStatsData(json);
          setCampaigns(json.campaigns || []);
        }
      }
    } catch (err) {
      console.error('Failed to load marketing stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  const generatedTrackingUrl = `https://lonewolfdumpsters.com${utmPage}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedTrackingUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpName.trim()) return;
    setSavingCmp(true);
    try {
      await fetch('/api/admin/marketing/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_campaign',
          campaign: {
            name: cmpName,
            platform: cmpPlatform,
            utmCampaign: cmpUtm || cmpName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            targetCity: cmpCity,
            notes: cmpNotes,
            active: true,
          },
        }),
      });
      setShowCampaignModal(false);
      setCmpName('');
      fetchStats();
    } catch (err) {
      console.error('Failed to save campaign:', err);
    } finally {
      setSavingCmp(false);
    }
  };

  const handleSaveSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spendCmpId || !spendAmount) return;
    setSavingSpend(true);
    try {
      await fetch('/api/admin/marketing/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_spend_entry',
          spendEntry: {
            campaignId: spendCmpId,
            amount: Number(spendAmount),
            startDate: spendStartDate,
            endDate: spendEndDate,
          },
        }),
      });
      setShowSpendModal(false);
      fetchStats();
    } catch (err) {
      console.error('Failed to save spend:', err);
    } finally {
      setSavingSpend(false);
    }
  };

  const handleSavePhoneLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneName.trim() || !phoneNum.trim()) return;
    setSavingPhoneLead(true);
    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: phoneName,
          phone: phoneNum,
          deliveryAddress: phoneAddr || 'DFW Area',
          service: phoneSvc,
          leadMethod: 'Phone',
          normalizedSource: phoneSource,
          reportingAttributionSource: phoneSource,
        }),
      });
      setShowPhoneLeadModal(false);
      setPhoneName('');
      setPhoneNum('');
      fetchStats();
    } catch (err) {
      console.error('Failed to save phone lead:', err);
    } finally {
      setSavingPhoneLead(false);
    }
  };

  const sum = statsData?.summary || {};
  const dq = statsData?.dataQuality || {};

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '24px', borderRadius: '12px', minHeight: '80vh' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp color="#dc2626" size={26} />
            MARKETING ATTRIBUTION &amp; AD YIELD DASHBOARD
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Owner-facing advertising yield connecting Traffic Source → Lead → Quote → Booking → Revenue. (Attribution Model: <strong>Last Non-Direct Touch</strong>)
          </p>
        </div>

        {/* Action Controls & Date Selector */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '8px 14px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>

          <button
            type="button"
            onClick={() => setShowPhoneLeadModal(true)}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Phone size={14} />
            <span>+ Record Phone Lead</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSpendModal(true)}
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <DollarSign size={14} />
            <span>+ Add Ad Spend</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCampaignModal(true)}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} />
            <span>+ New Campaign</span>
          </button>
        </div>
      </div>

      {/* Data Quality Notice Banner */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '12px 18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} color="#f59e0b" />
          <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
            Data Quality &amp; Coverage: <strong>{dq.attributionCoverage || 100}% Known Lead Sources</strong>
            {dq.unknownLeadsCount > 0 && ` (${dq.unknownLeadsCount} leads unattributed)`}
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '4px' }}>
          Profit ROAS: <em>Not enough cost data yet (Job variable costs not tracked)</em>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Ad Spend</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>${(sum.totalSpend || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Recorded manual spend for range</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Leads Logged</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', margin: '4px 0' }}>{sum.totalLeads || 0}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{sum.websiteLeads || 0} web • {sum.phoneLeads || 0} phone</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Cost Per Lead (CPL)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#facc15', margin: '4px 0' }}>${(sum.costPerLead || 0).toFixed(2)}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Ad Spend ÷ Total Leads</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Acquisition Cost (CAC)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f87171', margin: '4px 0' }}>${(sum.cac || 0).toFixed(2)}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Ad Spend ÷ New Booked Customers</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Collected Revenue ROAS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', margin: '4px 0' }}>{(sum.collectedRoas || 0).toFixed(2)}x</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>${(sum.collectedRoas || 0).toFixed(2)} collected per $1 ad spend</div>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Collected Revenue</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', margin: '4px 0' }}>${(sum.totalCollectedRevenue || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Booked: ${(sum.totalBookedRevenue || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Actionable Insights Box */}
      {statsData?.insights && statsData.insights.length > 0 && (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px 20px', marginBottom: '28px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            💡 Deterministic Performance Insights
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {statsData.insights.map((text: string, idx: number) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Campaign Performance Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Campaign Performance Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '10px 14px' }}>Campaign Name</th>
                <th style={{ padding: '10px 14px' }}>Platform</th>
                <th style={{ padding: '10px 14px' }}>UTM Campaign</th>
                <th style={{ padding: '10px 14px' }}>Spend</th>
                <th style={{ padding: '10px 14px' }}>Leads</th>
                <th style={{ padding: '10px 14px' }}>Bookings</th>
                <th style={{ padding: '10px 14px' }}>CPL</th>
                <th style={{ padding: '10px 14px' }}>CAC</th>
                <th style={{ padding: '10px 14px' }}>Revenue</th>
                <th style={{ padding: '10px 14px' }}>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((cmp) => (
                <tr key={cmp.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{cmp.name}</td>
                  <td style={{ padding: '12px 14px', color: '#38bdf8' }}>{cmp.platform}</td>
                  <td style={{ padding: '12px 14px' }}><code>{cmp.utmCampaign}</code></td>
                  <td style={{ padding: '12px 14px', fontWeight: 700 }}>${(cmp.spend || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 14px' }}>{cmp.leads || 0}</td>
                  <td style={{ padding: '12px 14px' }}>{cmp.bookings || 0}</td>
                  <td style={{ padding: '12px 14px' }}>${(cmp.cpl || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 14px' }}>${(cmp.cac || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#4ade80' }}>${(cmp.revenue || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#4ade80' }}>{(cmp.roas || 0).toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Source Performance & Service Area Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Acquisition Source Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>Channel Source Performance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '8px 10px' }}>Channel</th>
                <th style={{ padding: '8px 10px' }}>Leads</th>
                <th style={{ padding: '8px 10px' }}>Bookings</th>
                <th style={{ padding: '8px 10px' }}>Conv %</th>
                <th style={{ padding: '8px 10px' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(statsData?.sources || []).map((src: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#ffffff' }}>{src.name}</td>
                  <td style={{ padding: '10px' }}>{src.leads}</td>
                  <td style={{ padding: '10px' }}>{src.bookings}</td>
                  <td style={{ padding: '10px' }}>{(src.conversion || 0).toFixed(1)}%</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#4ade80' }}>${(src.revenue || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* City / Service Area Table */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>City / Service Area Performance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '8px 10px' }}>City / Area</th>
                <th style={{ padding: '8px 10px' }}>Leads</th>
                <th style={{ padding: '8px 10px' }}>Bookings</th>
                <th style={{ padding: '8px 10px' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(statsData?.cities || []).map((city: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#38bdf8' }}>{city.name}</td>
                  <td style={{ padding: '10px' }}>{city.leads}</td>
                  <td style={{ padding: '10px' }}>{city.bookings}</td>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#4ade80' }}>${(city.revenue || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Link Generator Tool */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link size={18} color="#38bdf8" />
          UTM Campaign Tracking Link Builder
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Landing Page Path</label>
            <input
              type="text"
              value={utmPage}
              onChange={(e) => setUtmPage(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>UTM Source</label>
            <input
              type="text"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>UTM Medium</label>
            <input
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>UTM Campaign Name</label>
            <input
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            readOnly
            value={generatedTrackingUrl}
            style={{ flex: 1, padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#38bdf8', fontSize: '0.82rem', fontFamily: 'monospace' }}
          />
          <button
            type="button"
            onClick={handleCopyUrl}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedUrl ? 'Copied!' : 'Copy Tracking URL'}</span>
          </button>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showCampaignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Create New Marketing Campaign</h3>
            <form onSubmit={handleSaveCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Campaign Name</label>
                <input type="text" required value={cmpName} onChange={(e) => setCmpName(e.target.value)} placeholder="e.g. Google — DFW 20 Yard — Fall 2026" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Platform</label>
                <select value={cmpPlatform} onChange={(e) => setCmpPlatform(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }}>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook / Meta Ads</option>
                  <option value="Google Maps">Google Maps</option>
                  <option value="Craigslist">Craigslist</option>
                  <option value="Facebook Marketplace">Facebook Marketplace</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>UTM Campaign ID</label>
                <input type="text" value={cmpUtm} onChange={(e) => setCmpUtm(e.target.value)} placeholder="e.g. dfw_20yard" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCampaignModal(false)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={savingCmp} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>{savingCmp ? 'Saving...' : 'Save Campaign'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Spend Modal */}
      {showSpendModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Record Ad Spend Entry</h3>
            <form onSubmit={handleSaveSpend} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Select Campaign</label>
                <select value={spendCmpId} onChange={(e) => setSpendCmpId(e.target.value)} required style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }}>
                  <option value="">-- Choose Campaign --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Spend Amount ($)</label>
                <input type="number" required value={spendAmount} onChange={(e) => setSpendAmount(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Start Date</label>
                  <input type="date" required value={spendStartDate} onChange={(e) => setSpendStartDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>End Date</label>
                  <input type="date" required value={spendEndDate} onChange={(e) => setSpendEndDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowSpendModal(false)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={savingSpend} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>{savingSpend ? 'Saving...' : 'Record Spend'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Phone Lead Modal */}
      {showPhoneLeadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Record Phone or Manual Lead</h3>
            <form onSubmit={handleSavePhoneLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Customer Name</label>
                <input type="text" required value={phoneName} onChange={(e) => setPhoneName(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Phone Number</label>
                <input type="text" required value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Delivery Address / City</label>
                <input type="text" value={phoneAddr} onChange={(e) => setPhoneAddr(e.target.value)} placeholder="e.g. Fort Worth, TX" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '4px' }}>Source</label>
                <select value={phoneSource} onChange={(e) => setPhoneSource(e.target.value)} style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: '#fff' }}>
                  <option value="Repeat Customer">Repeat Customer</option>
                  <option value="Google Organic">Google Search</option>
                  <option value="Google Maps / Business Profile">Google Maps</option>
                  <option value="Referral">Contractor / Friend Referral</option>
                  <option value="Craigslist">Craigslist</option>
                  <option value="Facebook Marketplace">Facebook Marketplace</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowPhoneLeadModal(false)} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={savingPhoneLead} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>{savingPhoneLead ? 'Saving...' : 'Save Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
