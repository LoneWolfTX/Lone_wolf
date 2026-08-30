'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Edit3,
  Trash2,
  X,
  Save,
  MessageSquare,
  DollarSign,
  FileText,
  Settings,
  Layers,
  Sparkles,
  Package,
  HelpCircle,
  Image as ImageIcon,
  AlertTriangle,
  Upload,
  Eye,
  Check,
  Crosshair,
  LayoutGrid,
  TrendingUp,
} from 'lucide-react';
import { MarketingDashboard } from '@/components/admin/marketing/MarketingDashboard';

import {
  DEFAULT_SITE_CONTENT,
  SiteContent,
  DumpsterPageContent,
  PageCard,
  FAQItem,
  GuideItem,
  ImageAssignment,
} from '@/lib/contentStore';
import { EXISTING_IMAGE_LIBRARY, StockImageItem } from '@/lib/imageLibrary';
import { LoneWolfDocument, DocumentType } from '@/lib/documents';
import { DocumentModal } from '@/components/admin/DocumentModal';

export interface Lead {
  id: string;
  timestamp?: string;
  date?: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  deliveryAddress?: string;
  city?: string;
  service?: string;
  size?: string;
  price?: string;
  projectType: string;
  preferredDate?: string;
  rentalDuration?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Booked' | 'Completed' | 'Lost / Not Moving Forward';
  archived?: boolean;
  updatedAt?: string;
  source?: string;
  notes?: string;
  mail_sent?: boolean;
  leadMethod?: 'Website Form' | 'Phone' | 'Manual' | 'Other';
  normalizedSource?: string;
  reportingAttributionSource?: string;
  reportingAttributionCampaignId?: string;
  attributedCampaignId?: string;
  manuallyOverriddenSource?: string;
  isRepeatCustomer?: boolean;
  lostReason?: string;
  lostReasonNote?: string;
}

const defaultLeads: Lead[] = [];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'leads' | 'marketing' | 'homepage' | 'about' | 'images' | 'pricing' | 'dumpsters' | 'cards' | 'faqs' | 'guides'
  >('leads');
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [savedServerContent, setSavedServerContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isDirty, setIsDirty] = useState(false);

  // Honest save status state: 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveErrorMessage, setSaveErrorMessage] = useState('');

  // Navigation State
  const [adminTab, setAdminTab] = useState<'leads' | 'marketing' | 'content'>('leads');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>(defaultLeads);
  const [isRefreshingLeads, setIsRefreshingLeads] = useState(false);
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [statusNotice, setStatusNotice] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Documents State
  const [leadDocuments, setLeadDocuments] = useState<Record<string, LoneWolfDocument[]>>({});
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocLead, setSelectedDocLead] = useState<Lead | null>(null);
  const [editingDoc, setEditingDoc] = useState<LoneWolfDocument | null>(null);
  const [docInitialType, setDocInitialType] = useState<DocumentType>('QUOTE');
  const [globalDocMenuOpen, setGlobalDocMenuOpen] = useState(false);
  const [leadDocMenuId, setLeadDocMenuId] = useState<string | null>(null);
  const [historyModalLead, setHistoryModalLead] = useState<Lead | null>(null);

  const fetchDocumentsForLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/admin/documents?leadId=${leadId}&t=${Date.now()}`, {
        headers: { 'X-Admin-Password': 'LoneWolf2026!' },
        cache: 'no-store',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && Array.isArray(data.documents)) {
        setLeadDocuments((prev) => ({ ...prev, [leadId]: data.documents }));
      }
    } catch {}
  };

  // Image Library Picker Modal State
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [activeImageSlotTarget, setActiveImageSlotTarget] = useState<{
    type: 'homepage_hero' | 'homepage_showcase' | 'homepage_closing' | 'about_owner' | 'dumpster_page';
    dumpsterId?: string;
  } | null>(null);
  const [libraryFilterCategory, setLibraryFilterCategory] = useState<string>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');

  // Custom Uploaded Images Cache
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchLeads = async () => {
    setIsRefreshingLeads(true);
    try {
      const res = await fetch('/api/leads?t=' + Date.now(), {
        headers: { 'X-Admin-Password': 'LoneWolf2026!' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.leads)) {
          setLeads(data.leads);
          data.leads.forEach((l: Lead) => {
            fetchDocumentsForLead(l.id);
          });
        }
      } else {
        console.error('Failed to refresh leads: HTTP', res.status);
      }
    } catch (err) {
      console.error('Error refreshing leads:', err);
    } finally {
      setIsRefreshingLeads(false);
    }
  };

  // Fetch canonical content on mount from Vercel + Upstash Redis
  useEffect(() => {
    fetch('/api/admin/content?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => {
        if (res.ok) return res.json();
        return fetch('/api/content.php?t=' + Date.now(), { cache: 'no-store' }).then((r) => r.json());
      })
      .then((data) => {
        if (data && typeof data === 'object' && (data.homepage || data.business)) {
          const merged = { ...DEFAULT_SITE_CONTENT, ...data };
          setSiteContent(merged);
          setSavedServerContent(merged);
        }
      })
      .catch((err) => {
        console.warn('Using default content store:', err);
      });

    fetchLeads();
  }, []);

  // Update dirty state whenever siteContent changes relative to savedServerContent
  useEffect(() => {
    const isDifferent = JSON.stringify(siteContent) !== JSON.stringify(savedServerContent);
    setIsDirty(isDifferent);
    if (isDifferent && saveStatus === 'saved') {
      setSaveStatus('idle');
    }
  }, [siteContent, savedServerContent]);

  // Save Content to Vercel + Upstash Redis Endpoint /api/admin/content
  const handleSaveAllContent = async () => {
    setSaveStatus('saving');
    setSaveErrorMessage('');

    try {
      let res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'LoneWolf2026!',
        },
        body: JSON.stringify(siteContent),
      });

      let data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        // Fallback to PHP endpoint if Redis API is unavailable
        const phpRes = await fetch('/api/content.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteContent),
          credentials: 'same-origin',
        });
        if (phpRes.ok) {
          data = await phpRes.json().catch(() => null);
          res = phpRes;
        }
      }

      if (res.ok && data?.success) {
        setSavedServerContent(siteContent);
        setIsDirty(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        setSaveStatus('error');
        setSaveErrorMessage(data?.error || 'Server error occurred while publishing content.');
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveErrorMessage(err.message || 'Network error: could not connect to server.');
    }
  };

  // Revert changes back to server state
  const handleRevertChanges = () => {
    if (window.confirm('Revert all unsaved changes back to the last saved server version?')) {
      setSiteContent(savedServerContent);
      setIsDirty(false);
      setSaveStatus('idle');
    }
  };

  // Upload image handler
  const handleFileUploadForSlot = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slotTarget?: { type: string; dumpsterId?: string }
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);

    try {
      const res = await fetch('/api/upload-image.php', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        setUploadedImages((prev) => [data.url, ...prev]);

        // Automatically assign if target specified
        const target = slotTarget || activeImageSlotTarget;
        if (target) {
          applyImageToSlot(data.url, file.name, target);
        }
        setLibraryModalOpen(false);
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Apply selected image from library to an active slot
  const applyImageToSlot = (
    src: string,
    altDefault: string,
    targetOverride?: { type: string; dumpsterId?: string }
  ) => {
    const target = targetOverride || activeImageSlotTarget;
    if (!target) return;

    if (target.type === 'homepage_hero') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          heroImage: {
            ...siteContent.homepage.heroImage,
            src,
            alt: siteContent.homepage.heroImage?.alt || altDefault,
          },
        },
      });
    } else if (target.type === 'homepage_showcase') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          showcaseImage: {
            ...siteContent.homepage.showcaseImage,
            src,
            alt: siteContent.homepage.showcaseImage?.alt || altDefault,
          },
        },
      });
    } else if (target.type === 'homepage_closing') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          closingBannerImage: {
            ...siteContent.homepage.closingBannerImage,
            src,
            alt: siteContent.homepage.closingBannerImage?.alt || altDefault,
          },
        },
      });
    } else if (target.type === 'about_owner') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          aboutOwnerImage: {
            ...siteContent.homepage.aboutOwnerImage,
            src,
            alt: siteContent.homepage.aboutOwnerImage?.alt || altDefault,
          },
        },
      });
    } else if (target.type === 'commercial_header') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          commercialHeaderImage: {
            src,
            alt: siteContent.homepage.commercialHeaderImage?.alt || altDefault,
            position: 'center center',
          },
        },
      });
    } else if (target.type === 'contractor_header') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          contractorHeaderImage: {
            src,
            alt: siteContent.homepage.contractorHeaderImage?.alt || altDefault,
            position: 'center center',
          },
        },
      });
    } else if (target.type === 'residential_header') {
      setSiteContent({
        ...siteContent,
        homepage: {
          ...siteContent.homepage,
          residentialHeaderImage: {
            src,
            alt: siteContent.homepage.residentialHeaderImage?.alt || altDefault,
            position: 'center center',
          },
        },
      });
    } else if (target.type === 'dumpster_page' && target.dumpsterId) {
      const updatedPages = siteContent.dumpsterPages.map((p) => {
        if (p.id === target.dumpsterId) {
          return {
            ...p,
            image: {
              src,
              alt: p.image?.alt || altDefault,
              position: p.image?.position || 'center center',
            },
          };
        }
        return p;
      });
      setSiteContent({ ...siteContent, dumpsterPages: updatedPages });
    }

    setLibraryModalOpen(false);
  };

  // Helper to open library modal for specific slot
  const openLibraryModalForSlot = (type: any, dumpsterId?: string) => {
    setActiveImageSlotTarget({ type, dumpsterId });
    setLibraryModalOpen(true);
  };

  // Handle lead status updates with immediate persistence to Upstash Redis
  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    const prevLeads = [...leads];
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    setStatusNotice((prev) => ({ ...prev, [leadId]: 'saving' }));
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'LoneWolf2026!',
        },
        body: JSON.stringify({ action: 'update_status', leadId, status: newStatus }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatusNotice((prev) => ({ ...prev, [leadId]: 'saved' }));
        setTimeout(() => {
          setStatusNotice((prev) => {
            const copy = { ...prev };
            delete copy[leadId];
            return copy;
          });
        }, 2500);
      } else {
        setLeads(prevLeads);
        setStatusNotice((prev) => ({ ...prev, [leadId]: 'error' }));
      }
    } catch {
      setLeads(prevLeads);
      setStatusNotice((prev) => ({ ...prev, [leadId]: 'error' }));
    }
  };

  // Handle lead archive / restore
  const handleArchive = async (leadId: string, archiveState: boolean = true) => {
    const prevLeads = [...leads];
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, archived: archiveState } : l)));

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'LoneWolf2026!',
        },
        body: JSON.stringify({ action: archiveState ? 'archive' : 'restore', leadId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setLeads(prevLeads);
        alert('Failed to update archive status on server.');
      }
    } catch {
      setLeads(prevLeads);
      alert('Network error while archiving lead.');
    }
  };

  // Handle permanent lead deletion
  const handleDelete = async (leadId: string, leadName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to PERMANENTLY delete lead "${leadName}" (${leadId})?\n\nThis action will remove it permanently from Upstash Redis.`
      )
    ) {
      return;
    }

    const prevLeads = [...leads];
    setLeads(leads.filter((l) => l.id !== leadId));

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': 'LoneWolf2026!',
        },
        body: JSON.stringify({ action: 'delete', leadId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        alert('Failed to delete lead from server. Restoring list.');
        setLeads(prevLeads);
      }
    } catch {
      alert('Network error while deleting lead. Restoring list.');
      setLeads(prevLeads);
    }
  };

  // Filtered Leads & Active / Archive counts
  const activeLeadsCount = leads.filter((l) => !l.archived).length;
  const archivedLeadsCount = leads.filter((l) => !!l.archived).length;

  const filteredLeads = leads.filter((lead) => {
    const isArchived = !!lead.archived;
    if (viewMode === 'active' && isArchived) return false;
    if (viewMode === 'archived' && !isArchived) return false;

    const matchesSearch =
      (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone || '').includes(searchQuery) ||
      (lead.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.projectType || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || (lead.status || 'New') === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', border: '#ef4444' };
      case 'Contacted':
        return { bg: 'rgba(168, 85, 247, 0.2)', text: '#d8b4fe', border: '#a855f7' };
      case 'Quoted':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d', border: '#f59e0b' };
      case 'Booked':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#93c5fd', border: '#3b82f6' };
      case 'Completed':
        return { bg: 'rgba(34, 197, 94, 0.2)', text: '#86efac', border: '#22c55e' };
      case 'Lost / Not Moving Forward':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#d1d5db', border: '#6b7280' };
      default:
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', border: '#ef4444' };
    }
  };

  return (
    <div style={{ backgroundColor: '#090d16', minHeight: '100vh', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* Top Header Bar */}
      <header style={{ backgroundColor: '#000000', borderBottom: '1px solid #1e293b', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '40px', height: '40px' }}>
              <Image src="/images/lone-wolf/logo.png" alt="Lone Wolf Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                LONE WOLF <span style={{ color: 'var(--accent-red)' }}>DUMPSTERS</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                Owner &amp; Site Management Studio
              </div>
            </div>
          </div>

          {/* Action Bar: Save States, Revert, View Website */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            
            {/* Dirty State Indicator */}
            {isDirty && (
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#facc15', backgroundColor: 'rgba(234,179,8,0.15)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(234,179,8,0.4)' }}>
                ● Unsaved Changes
              </span>
            )}

            {/* Revert Button */}
            {isDirty && (
              <button
                onClick={handleRevertChanges}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RotateCw size={14} />
                <span>Revert</span>
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveAllContent}
              disabled={saveStatus === 'saving'}
              style={{
                backgroundColor: saveStatus === 'saved' ? '#16a34a' : 'var(--accent-red)',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RotateCw size={16} className="spin" />
                  <span>Saving...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check size={16} />
                  <span>Saved to Website</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            {/* View Live Website Link */}
            <Link
              href="/"
              target="_blank"
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '9px 14px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Eye size={14} />
              <span>View Website &rarr;</span>
            </Link>

            <a
              href="/admin/index.php?action=logout"
              style={{
                backgroundColor: 'transparent',
                color: '#94a3b8',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Logout
            </a>

          </div>
        </div>

        {/* Error Alert Bar */}
        {saveStatus === 'error' && (
          <div style={{ maxWidth: '1440px', margin: '12px auto 0 auto', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 16px', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700 }}>
            ⚠ Save Failed: {saveErrorMessage || 'Check server connection and file permissions.'}
          </div>
        )}
      </header>

      {/* Main Studio Navigation Tabs */}
      <div style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
          
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'leads' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'leads' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'leads' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <Clock size={16} color={activeTab === 'leads' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Leads ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketing')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'marketing' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'marketing' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'marketing' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <TrendingUp size={16} color={activeTab === 'marketing' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>📊 Marketing Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'homepage' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'homepage' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'homepage' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <LayoutGrid size={16} color={activeTab === 'homepage' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Homepage Copy</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'about' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'about' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'about' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={16} color={activeTab === 'about' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>About Page</span>
          </button>


          <button
            onClick={() => setActiveTab('images')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'images' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'images' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'images' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <ImageIcon size={16} color={activeTab === 'images' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Image Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'pricing' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'pricing' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'pricing' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <DollarSign size={16} color={activeTab === 'pricing' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Pricing &amp; 4.5T Capacity</span>
          </button>

          <button
            onClick={() => setActiveTab('dumpsters')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'dumpsters' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'dumpsters' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'dumpsters' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <Package size={16} color={activeTab === 'dumpsters' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Dumpster Detail Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'cards' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'cards' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'cards' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <Layers size={16} color={activeTab === 'cards' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Project Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'faqs' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'faqs' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'faqs' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <HelpCircle size={16} color={activeTab === 'faqs' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>FAQs ({siteContent.faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            style={{
              padding: '14px 16px',
              backgroundColor: activeTab === 'guides' ? '#1e293b' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'guides' ? '3px solid var(--accent-red)' : '3px solid transparent',
              color: activeTab === 'guides' ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
            }}
          >
            <FileText size={16} color={activeTab === 'guides' ? 'var(--accent-red)' : '#94a3b8'} />
            <span>Guides ({siteContent.guides.length})</span>
          </button>

        </div>
      </div>

      {/* Main Content Body */}
      <main style={{ maxWidth: '1440px', margin: '24px auto', padding: '0 24px' }}>

        {/* TAB: MARKETING PERFORMANCE DASHBOARD */}
        {activeTab === 'marketing' && (
          <MarketingDashboard adminPassword="LoneWolf2026!" />
        )}

        {/* TAB 1: LEADS DASHBOARD */}
        {activeTab === 'leads' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  CUSTOMER QUOTE &amp; DISPATCH INBOX
                </h1>
                <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Real-time lead logging from website quote forms, SMS inquiries, and phone calls.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={fetchLeads}
                  disabled={isRefreshingLeads}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                    padding: '8px 14px',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isRefreshingLeads ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isRefreshingLeads ? 0.7 : 1,
                  }}
                >
                  <RotateCw size={14} style={{ animation: isRefreshingLeads ? 'spin 1s linear infinite' : 'none' }} />
                  <span>{isRefreshingLeads ? 'Refreshing...' : 'Refresh Inbox'}</span>
                </button>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    data-testid="global-new-doc-btn"
                    onClick={() => setGlobalDocMenuOpen(!globalDocMenuOpen)}
                    style={{
                      backgroundColor: 'var(--accent-red)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={14} />
                    <span>+ New Document</span>
                  </button>

                  {globalDocMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '6px',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        zIndex: 50,
                        minWidth: '180px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        data-testid="global-new-quote-btn"
                        onClick={() => {
                          setSelectedDocLead(null);
                          setEditingDoc(null);
                          setDocInitialType('QUOTE');
                          setDocModalOpen(true);
                          setGlobalDocMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #334155',
                          color: '#ffffff',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>📄</span>
                        <span>Quote / Estimate</span>
                      </button>
                      <button
                        type="button"
                        data-testid="global-new-invoice-btn"
                        onClick={() => {
                          setSelectedDocLead(null);
                          setEditingDoc(null);
                          setDocInitialType('INVOICE');
                          setDocModalOpen(true);
                          setGlobalDocMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #334155',
                          color: '#38bdf8',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>🧾</span>
                        <span>Direct Invoice</span>
                      </button>
                      <button
                        type="button"
                        data-testid="global-new-receipt-btn"
                        onClick={() => {
                          setSelectedDocLead(null);
                          setEditingDoc(null);
                          setDocInitialType('RECEIPT');
                          setDocModalOpen(true);
                          setGlobalDocMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#4ade80',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span>🟢</span>
                        <span>Direct Receipt</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active / Archive View Filter Tabs & Search Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('active')}
                  style={{
                    backgroundColor: viewMode === 'active' ? '#0284c7' : '#1e293b',
                    color: '#ffffff',
                    border: '1px solid ' + (viewMode === 'active' ? '#0369a1' : '#334155'),
                    padding: '7px 16px',
                    borderRadius: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Active Leads ({activeLeadsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('archived')}
                  style={{
                    backgroundColor: viewMode === 'archived' ? '#475569' : '#1e293b',
                    color: '#ffffff',
                    border: '1px solid ' + (viewMode === 'archived' ? '#64748b' : '#334155'),
                    padding: '7px 16px',
                    borderRadius: '4px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Archived ({archivedLeadsCount})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search leads by name, phone, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: '1 1 200px', maxWidth: '320px', padding: '8px 12px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                />
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">🔴 New</option>
                  <option value="Contacted">🟣 Contacted</option>
                  <option value="Quoted">🟠 Quoted</option>
                  <option value="Booked">🔵 Booked</option>
                  <option value="Completed">🟢 Completed</option>
                  <option value="Lost / Not Moving Forward">⚫ Lost / Not Moving Forward</option>
                </select>
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1f2937', color: '#9ca3af', borderBottom: '1px solid #374151' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Lead ID / Date</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Customer &amp; Contact</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Delivery Location</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Size Requested</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Project &amp; Duration</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.74rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                        No {viewMode} leads found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const curStatus = lead.status || 'New';
                      const sColor = getStatusColor(curStatus);
                      const notice = statusNotice[lead.id];

                      const leadDocs = leadDocuments[lead.id] || [];

                      return (
                        <tr key={lead.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#ffffff' }}>{lead.id}</div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{lead.date || lead.timestamp}</div>
                            {leadDocs.length > 0 && (
                              <div style={{ marginTop: '6px' }}>
                                <button
                                  type="button"
                                  data-testid={`lead-docs-btn-${lead.id}`}
                                  onClick={() => setHistoryModalLead(lead)}
                                  title="Click to view full document history & actions"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    backgroundColor:
                                      leadDocs.length === 1 && leadDocs[0].type === 'QUOTE'
                                        ? '#1e293b'
                                        : leadDocs.length === 1 && leadDocs[0].type === 'INVOICE'
                                        ? '#0369a1'
                                        : leadDocs.length === 1 && leadDocs[0].type === 'RECEIPT'
                                        ? '#14532d'
                                        : '#1e293b',
                                    color: leadDocs.length === 1 ? '#ffffff' : '#38bdf8',
                                    border:
                                      '1px solid ' +
                                      (leadDocs.length === 1 && leadDocs[0].type === 'QUOTE'
                                        ? '#334155'
                                        : leadDocs.length === 1 && leadDocs[0].type === 'INVOICE'
                                        ? '#0284c7'
                                        : leadDocs.length === 1 && leadDocs[0].type === 'RECEIPT'
                                        ? '#16a34a'
                                        : '#0284c7'),
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.71rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <span>📄</span>
                                  <span>
                                    {leadDocs.length === 1
                                      ? `${leadDocs[0].docNumber} (${leadDocs[0].status})`
                                      : `Documents (${leadDocs.length})`}
                                  </span>
                                </button>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{lead.name}</div>
                            <div style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{lead.phone}</div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{lead.email}</div>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.68rem', backgroundColor: '#1e293b', color: '#38bdf8', padding: '1px 5px', borderRadius: '3px', border: '1px solid #334155' }}>
                                🎯 {lead.manuallyOverriddenSource || lead.reportingAttributionSource || lead.normalizedSource || 'Direct'}
                              </span>
                              {lead.leadMethod && (
                                <span style={{ fontSize: '0.68rem', backgroundColor: '#0f172a', color: '#94a3b8', padding: '1px 5px', borderRadius: '3px' }}>
                                  {lead.leadMethod}
                                </span>
                              )}
                              {lead.isRepeatCustomer && (
                                <span style={{ fontSize: '0.68rem', backgroundColor: '#16537e', color: '#38bdf8', padding: '1px 5px', borderRadius: '3px', fontWeight: 800 }}>
                                  Repeat Customer
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: '#ffffff' }}>{lead.address || lead.deliveryAddress}</div>
                            {lead.city && <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>{lead.city}</div>}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#f87171', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.76rem' }}>
                              {lead.size || lead.service}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                            <div style={{ color: '#e2e8f0', fontWeight: 700 }}>{lead.projectType}</div>
                            {lead.rentalDuration && (
                              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600, marginTop: '2px' }}>
                                ⏱️ {lead.rentalDuration}
                              </div>
                            )}
                            {lead.notes && (
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>📝 {lead.notes}</div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <select
                                value={curStatus}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                                style={{
                                  backgroundColor: sColor.bg,
                                  color: sColor.text,
                                  border: `1px solid ${sColor.border}`,
                                  borderRadius: '12px',
                                  padding: '4px 10px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="New">🔴 New</option>
                                <option value="Contacted">🟣 Contacted</option>
                                <option value="Quoted">🟠 Quoted</option>
                                <option value="Booked">🔵 Booked</option>
                                <option value="Completed">🟢 Completed</option>
                                <option value="Lost / Not Moving Forward">⚫ Lost / Not Moving Forward</option>
                              </select>

                              {notice === 'saving' && <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>Saving...</span>}
                              {notice === 'saved' && <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700 }}>✓ Saved</span>}
                              {notice === 'error' && <span style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 700 }}>Save Failed</span>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  data-testid="lead-create-doc-btn"
                                  onClick={() => setLeadDocMenuId(leadDocMenuId === lead.id ? null : lead.id)}
                                  style={{
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <FileText size={13} />
                                  <span>Create Document</span>
                                </button>

                                {leadDocMenuId === lead.id && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: '100%',
                                      marginTop: '4px',
                                      backgroundColor: '#1e293b',
                                      border: '1px solid #334155',
                                      borderRadius: '6px',
                                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                      zIndex: 50,
                                      minWidth: '170px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <button
                                      type="button"
                                      data-testid="lead-quote-btn"
                                      onClick={() => {
                                        setSelectedDocLead(lead);
                                        setEditingDoc(null);
                                        setDocInitialType('QUOTE');
                                        setDocModalOpen(true);
                                        setLeadDocMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 12px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid #334155',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                      }}
                                    >
                                      <span>📄</span>
                                      <span>Quote / Estimate</span>
                                    </button>
                                    <button
                                      type="button"
                                      data-testid="lead-invoice-btn"
                                      onClick={() => {
                                        setSelectedDocLead(lead);
                                        setEditingDoc(null);
                                        setDocInitialType('INVOICE');
                                        setDocModalOpen(true);
                                        setLeadDocMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 12px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid #334155',
                                        color: '#38bdf8',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                      }}
                                    >
                                      <span>🧾</span>
                                      <span>Direct Invoice</span>
                                    </button>
                                    <button
                                      type="button"
                                      data-testid="lead-receipt-btn"
                                      onClick={() => {
                                        setSelectedDocLead(lead);
                                        setEditingDoc(null);
                                        setDocInitialType('RECEIPT');
                                        setDocModalOpen(true);
                                        setLeadDocMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 12px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: '#4ade80',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                      }}
                                    >
                                      <span>🟢</span>
                                      <span>Direct Receipt</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <a
                                href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                                style={{ backgroundColor: '#1e293b', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, textDecoration: 'none', border: '1px solid #334155' }}
                              >
                                Call
                              </a>
                              <a
                                href={`sms:${lead.phone.replace(/[^0-9+]/g, '')}?&body=Hi%20${encodeURIComponent(lead.name)}%2C%20this%20is%20Wayne%20from%20Lone%20Wolf%20Dumpsters.`}
                                style={{ backgroundColor: 'rgba(220,38,38,0.2)', color: '#fca5a5', padding: '5px 10px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none', border: '1px solid rgba(220,38,38,0.4)' }}
                              >
                                Text
                              </a>

                              {viewMode === 'active' ? (
                                <button
                                  type="button"
                                  onClick={() => handleArchive(lead.id, true)}
                                  style={{ backgroundColor: '#334155', color: '#e2e8f0', border: '1px solid #475569', padding: '5px 10px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Archive
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleArchive(lead.id, false)}
                                  style={{ backgroundColor: '#0369a1', color: '#ffffff', border: '1px solid #0284c7', padding: '5px 10px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  Restore
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDelete(lead.id, lead.name)}
                                title="Delete Lead Permanently"
                                style={{ backgroundColor: '#451a1a', color: '#f87171', border: '1px solid #7f1d1d', padding: '5px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: HOMEPAGE COPY & CONTACT INFO */}
        {activeTab === 'homepage' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              HOMEPAGE HEADLINES &amp; CONTACT INFORMATION
            </h1>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '24px', display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Hero Headline White Text
                </label>
                <input
                  type="text"
                  value={siteContent.homepage.heroHeadlineWhite}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    homepage: { ...siteContent.homepage, heroHeadlineWhite: e.target.value }
                  })}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Hero Headline Red Text
                </label>
                <input
                  type="text"
                  value={siteContent.homepage.heroHeadlineRed}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    homepage: { ...siteContent.homepage, heroHeadlineRed: e.target.value }
                  })}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#f87171', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={siteContent.homepage.heroDescription}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    homepage: { ...siteContent.homepage, heroDescription: e.target.value }
                  })}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.94rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Business Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteContent.contact.phone}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      contact: { ...siteContent.contact, phone: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.94rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Business Email Address
                  </label>
                  <input
                    type="email"
                    value={siteContent.contact.email}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      contact: { ...siteContent.contact, email: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.94rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Dispatch Yard Address
                </label>
                <input
                  type="text"
                  value={siteContent.contact.yardAddress}
                  onChange={(e) => setSiteContent({
                    ...siteContent,
                    contact: { ...siteContent.contact, yardAddress: e.target.value }
                  })}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.94rem' }}
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: VISUAL IMAGE MANAGER & LIBRARY PICKER */}
        {activeTab === 'images' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  VISUAL IMAGE MANAGER &amp; FOCAL POSITIONING
                </h1>
                <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Assign images to key site slots, upload new files, or choose from existing library photos without typing file paths manually.
                </p>
              </div>
            </div>

            {/* Editable Image Slots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              
              {/* Slot 1: Homepage Hero Image */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Homepage Hero Image
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Slot: Hero Main
                  </span>
                </div>

                {/* Preview Box */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155', backgroundColor: '#0a0d14' }}>
                  <Image
                    src={siteContent.homepage.heroImage?.src || '/images/lone-wolf/real/hero_main.jpg'}
                    alt={siteContent.homepage.heroImage?.alt || 'Hero Image'}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: siteContent.homepage.heroImage?.position || 'center center',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#fff', fontWeight: 700 }}>
                    Focal: {siteContent.homepage.heroImage?.position || 'center center'}
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => openLibraryModalForSlot('homepage_hero')}
                    style={{ flex: 1, backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ImageIcon size={14} />
                    <span>Choose from Library</span>
                  </button>
                  <label
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUploadForSlot(e, { type: 'homepage_hero' })}
                    />
                  </label>
                </div>

                {/* Alt Text & Focal Position */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.homepage.heroImage?.alt || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        heroImage: { ...siteContent.homepage.heroImage, alt: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Focal Alignment / Object Position
                  </label>
                  <select
                    value={siteContent.homepage.heroImage?.position || 'center center'}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        heroImage: { ...siteContent.homepage.heroImage, position: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="center center">Center (Default)</option>
                    <option value="top center">Top Center</option>
                    <option value="bottom center">Bottom Center</option>
                    <option value="left center">Left Center</option>
                    <option value="right center">Right Center</option>
                    <option value="center 30%">Top 30%</option>
                    <option value="center 70%">Bottom 70%</option>
                  </select>
                </div>
              </div>

              {/* Slot 2: Homepage Showcase Callout Image */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Showcase Callout Image
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Slot: Junk Removal Callout
                  </span>
                </div>

                {/* Preview Box */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155', backgroundColor: '#0a0d14' }}>
                  <Image
                    src={siteContent.homepage.showcaseImage?.src || '/images/lone-wolf/real/hero_fleet_environment.jpg'}
                    alt={siteContent.homepage.showcaseImage?.alt || 'Showcase Image'}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: siteContent.homepage.showcaseImage?.position || 'center center',
                    }}
                  />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => openLibraryModalForSlot('homepage_showcase')}
                    style={{ flex: 1, backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ImageIcon size={14} />
                    <span>Choose from Library</span>
                  </button>
                  <label
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUploadForSlot(e, { type: 'homepage_showcase' })}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.homepage.showcaseImage?.alt || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        showcaseImage: { ...siteContent.homepage.showcaseImage, alt: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Focal Alignment / Object Position
                  </label>
                  <select
                    value={siteContent.homepage.showcaseImage?.position || 'center center'}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        showcaseImage: { ...siteContent.homepage.showcaseImage, position: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="center center">Center (Default)</option>
                    <option value="top center">Top Center</option>
                    <option value="bottom center">Bottom Center</option>
                    <option value="left center">Left Center</option>
                    <option value="right center">Right Center</option>
                  </select>
                </div>
              </div>

              {/* Slot 3: About Page Owner Photo */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    About Page Owner Photo
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    Slot: Owner Photo
                  </span>
                </div>

                {/* Preview Box */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #334155', backgroundColor: '#0a0d14' }}>
                  <Image
                    src={siteContent.homepage.aboutOwnerImage?.src || '/images/lone-wolf/real/about_owner_photo.jpg'}
                    alt={siteContent.homepage.aboutOwnerImage?.alt || 'Wayne Owner'}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: siteContent.homepage.aboutOwnerImage?.position || 'center top',
                    }}
                  />
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => openLibraryModalForSlot('about_owner')}
                    style={{ flex: 1, backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ImageIcon size={14} />
                    <span>Choose from Library</span>
                  </button>
                  <label
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Upload size={14} />
                    <span>Upload New</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUploadForSlot(e, { type: 'about_owner' })}
                    />
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={siteContent.homepage.aboutOwnerImage?.alt || ''}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        aboutOwnerImage: { ...siteContent.homepage.aboutOwnerImage, alt: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                    Focal Alignment / Object Position
                  </label>
                  <select
                    value={siteContent.homepage.aboutOwnerImage?.position || 'center top'}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      homepage: {
                        ...siteContent.homepage,
                        aboutOwnerImage: { ...siteContent.homepage.aboutOwnerImage, position: e.target.value }
                      }
                    })}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="center top">Top Center (Recommended for Portraits)</option>
                    <option value="center center">Center</option>
                    <option value="center bottom">Bottom Center</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PRICING & 4.5-TON CAPACITY */}
        {activeTab === 'pricing' && (
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              DUMPSTER PRICING &amp; 4.5-TON MAXIMUM ROAD CAPACITY
            </h1>

            {/* Warning Callout */}
            <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid var(--accent-red)', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <AlertTriangle size={24} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem', textTransform: 'uppercase' }}>
                  MANDATORY 4.5 TONS (9,000 LBS) MAXIMUM LOAD CAPACITY
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '4px', lineHeight: 1.4 }}>
                  Due to Texas public highway safety regulations and roll-off truck hydraulic hoist ratings, no container can exceed 4.5 tons (9,000 lbs) in total load. This limit is enforced across all sizing cards and terms.
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '24px', display: 'grid', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    15 Yard Dumpster Price ($)
                  </label>
                  <input
                    type="number"
                    value={siteContent.pricing.fifteenYard}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, fifteenYard: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Includes 1.5 Tons (3,000 lbs)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    20 Yard Dumpster Price ($)
                  </label>
                  <input
                    type="number"
                    value={siteContent.pricing.twentyYard}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, twentyYard: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Includes 2.0 Tons (4,000 lbs)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    25 Yard Dumpster Price ($)
                  </label>
                  <input
                    type="number"
                    value={siteContent.pricing.twentyFiveYard}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, twentyFiveYard: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Includes 2.2 Tons (4,400 lbs)</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Additional Rental Days ($ / day)
                  </label>
                  <input
                    type="number"
                    value={siteContent.pricing.extraDay}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, extraDay: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Extra Tonnage Fee ($ / ton)
                  </label>
                  <input
                    type="number"
                    value={siteContent.pricing.extraTonnage}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, extraTonnage: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Billed prorated ($40 per 1,000 lbs)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Maximum Load Capacity (Tons)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={siteContent.pricing.maxCapacityTons}
                    onChange={(e) => setSiteContent({
                      ...siteContent,
                      pricing: { ...siteContent.pricing, maxCapacityTons: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #dc2626', borderRadius: '4px', color: '#fff', fontSize: '1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#f87171' }}>4.5 Tons = 9,000 lbs absolute max</span>
                </div>
              </div>

              {/* Physical Dimensions Section */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase' }}>
                  PHYSICAL CONTAINER DIMENSIONS (LENGTH × WIDTH × HEIGHT)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      15 Yard Dimensions
                    </label>
                    <input
                      type="text"
                      value={siteContent.dimensions?.fifteenYard || "16' L × 8' W × 4' H"}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        dimensions: { ...siteContent.dimensions, fifteenYard: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      20 Yard Dimensions
                    </label>
                    <input
                      type="text"
                      value={siteContent.dimensions?.twentyYard || "16' L × 8' W × 5.4' H"}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        dimensions: { ...siteContent.dimensions, twentyYard: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      25 Yard Dimensions
                    </label>
                    <input
                      type="text"
                      value={siteContent.dimensions?.twentyFiveYard || "16' L × 8' W × 6.5' H"}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        dimensions: { ...siteContent.dimensions, twentyFiveYard: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Standard Rental Periods & Contractor Rates */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px', textTransform: 'uppercase' }}>
                  RENTAL PERIODS &amp; CONTRACTOR DISCOUNT RATES
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Standard Included Rental Days Text
                    </label>
                    <input
                      type="text"
                      value={siteContent.rentalPeriods?.standardDays || "1 to 7 Days Included"}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        rentalPeriods: { ...siteContent.rentalPeriods, standardDays: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Contractor Multi-Load Discount Note
                    </label>
                    <input
                      type="text"
                      value={siteContent.contractorRates?.multiLoadDiscount || "Contractor Rates & Multi-Load Discounts"}
                      onChange={(e) => setSiteContent({
                        ...siteContent,
                        contractorRates: { ...siteContent.contractorRates, multiLoadDiscount: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Prohibited Materials List Editor */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                    PROHIBITED MATERIALS &amp; HEAVY RESTRICTED ITEMS
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const item = prompt('Enter new prohibited item description:');
                      if (item && item.trim()) {
                        setSiteContent({
                          ...siteContent,
                          prohibitedMaterialsList: [...(siteContent.prohibitedMaterialsList || []), item.trim()]
                        });
                      }
                    }}
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {(siteContent.prohibitedMaterialsList || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...siteContent.prohibitedMaterialsList];
                          updated[idx] = e.target.value;
                          setSiteContent({ ...siteContent, prohibitedMaterialsList: updated });
                        }}
                        style={{ flex: 1, padding: '8px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = siteContent.prohibitedMaterialsList.filter((_, i) => i !== idx);
                          setSiteContent({ ...siteContent, prohibitedMaterialsList: updated });
                        }}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Served DFW Zip Codes Editor */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                    SERVED DFW ZIP CODES &amp; COVERAGE AREAS ({siteContent.zipCodes?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const zip = prompt('Enter 5-digit ZIP code:');
                      const city = prompt('Enter City Name:');
                      if (zip && city) {
                        setSiteContent({
                          ...siteContent,
                          zipCodes: [...(siteContent.zipCodes || []), { zip: zip.trim(), city: city.trim(), active: true }]
                        });
                      }
                    }}
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} />
                    <span>Add Zip Code</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  {(siteContent.zipCodes || []).map((z, idx) => (
                    <div key={idx} style={{ backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{z.zip}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{z.city}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = siteContent.zipCodes.filter((_, i) => i !== idx);
                          setSiteContent({ ...siteContent, zipCodes: updated });
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Remove Zip Code"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: DUMPSTER DETAIL PAGES */}
        {activeTab === 'dumpsters' && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              DUMPSTER DETAIL PAGES SPECIFICATIONS &amp; WARNINGS
            </h1>

            <div style={{ display: 'grid', gap: '24px' }}>
              {siteContent.dumpsterPages.map((page, index) => (
                <div
                  key={page.id}
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    padding: '24px',
                    display: 'grid',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {page.id.replace('-', ' ').toUpperCase()}
                    </h3>
                    <button
                      onClick={() => openLibraryModalForSlot('dumpster_page', page.id)}
                      style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ImageIcon size={14} />
                      <span>Change Container Photo</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={page.badgeText}
                        onChange={(e) => {
                          const updated = [...siteContent.dumpsterPages];
                          updated[index].badgeText = e.target.value;
                          setSiteContent({ ...siteContent, dumpsterPages: updated });
                        }}
                        style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                        Price Display
                      </label>
                      <input
                        type="text"
                        value={page.priceDisplay}
                        onChange={(e) => {
                          const updated = [...siteContent.dumpsterPages];
                          updated[index].priceDisplay = e.target.value;
                          setSiteContent({ ...siteContent, dumpsterPages: updated });
                        }}
                        style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                        Weight Included Text
                      </label>
                      <input
                        type="text"
                        value={page.weightIncludedText}
                        onChange={(e) => {
                          const updated = [...siteContent.dumpsterPages];
                          updated[index].weightIncludedText = e.target.value;
                          setSiteContent({ ...siteContent, dumpsterPages: updated });
                        }}
                        style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Hero Description Paragraph
                    </label>
                    <textarea
                      rows={2}
                      value={page.heroDescription}
                      onChange={(e) => {
                        const updated = [...siteContent.dumpsterPages];
                        updated[index].heroDescription = e.target.value;
                        setSiteContent({ ...siteContent, dumpsterPages: updated });
                      }}
                      style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Body Description &amp; Applications Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={page.bodyDescription}
                      onChange={(e) => {
                        const updated = [...siteContent.dumpsterPages];
                        updated[index].bodyDescription = e.target.value;
                        setSiteContent({ ...siteContent, dumpsterPages: updated });
                      }}
                      style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                      ⚠ Safety / Weight Warning Notice
                    </label>
                    <textarea
                      rows={2}
                      value={page.importantNotice}
                      onChange={(e) => {
                        const updated = [...siteContent.dumpsterPages];
                        updated[index].importantNotice = e.target.value;
                        setSiteContent({ ...siteContent, dumpsterPages: updated });
                      }}
                      style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #dc2626', borderRadius: '4px', color: '#fff', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROJECT & INDUSTRY CARDS */}
        {activeTab === 'cards' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              RESIDENTIAL, CONTRACTOR &amp; COMMERCIAL PROJECT CARDS
            </h1>

            {/* Residential Cards Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', margin: '0 0 12px 0' }}>
                RESIDENTIAL PROJECT CARDS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {siteContent.residentialCards.map((card, idx) => (
                  <div key={card.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '6px', padding: '16px', display: 'grid', gap: '8px' }}>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...siteContent.residentialCards];
                        updated[idx].title = e.target.value;
                        setSiteContent({ ...siteContent, residentialCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontWeight: 800 }}
                    />
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...siteContent.residentialCards];
                        updated[idx].description = e.target.value;
                        setSiteContent({ ...siteContent, residentialCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1', fontSize: '0.84rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>


            {/* Commercial Industry Cards Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', margin: '0 0 12px 0' }}>
                COMMERCIAL INDUSTRY CARDS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {(siteContent.commercialCards || []).map((card, idx) => (
                  <div key={card.id || idx} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '6px', padding: '16px', display: 'grid', gap: '8px' }}>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8' }}>Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...(siteContent.commercialCards || [])];
                        updated[idx].title = e.target.value;
                        setSiteContent({ ...siteContent, commercialCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontWeight: 800 }}
                    />
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8' }}>Card Description</label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...(siteContent.commercialCards || [])];
                        updated[idx].description = e.target.value;
                        setSiteContent({ ...siteContent, commercialCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1', fontSize: '0.84rem' }}
                    />
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8' }}>Tag / Badge</label>
                    <input
                      type="text"
                      value={card.tag || ''}
                      onChange={(e) => {
                        const updated = [...(siteContent.commercialCards || [])];
                        updated[idx].tag = e.target.value;
                        setSiteContent({ ...siteContent, commercialCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fca5a5', fontSize: '0.82rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Contractor Cards Section */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', margin: '0 0 12px 0' }}>
                CONTRACTOR TRADE CARDS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {siteContent.contractorCards.map((card, idx) => (
                  <div key={card.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '6px', padding: '16px', display: 'grid', gap: '8px' }}>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...siteContent.contractorCards];
                        updated[idx].title = e.target.value;
                        setSiteContent({ ...siteContent, contractorCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontWeight: 800 }}
                    />
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...siteContent.contractorCards];
                        updated[idx].description = e.target.value;
                        setSiteContent({ ...siteContent, contractorCards: updated });
                      }}
                      style={{ padding: '6px 8px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1', fontSize: '0.84rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FAQS */}
        {activeTab === 'faqs' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              FREQUENTLY ASKED QUESTIONS ({siteContent.faqs.length})
            </h1>

            <div style={{ display: 'grid', gap: '16px' }}>
              {siteContent.faqs.map((faq, idx) => (
                <div key={faq.id || idx} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...siteContent.faqs];
                        updated[idx].question = e.target.value;
                        setSiteContent({ ...siteContent, faqs: updated });
                      }}
                      style={{ flex: 1, padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontWeight: 700 }}
                    />
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this FAQ item?')) {
                          const updated = siteContent.faqs.filter((_, i) => i !== idx);
                          setSiteContent({ ...siteContent, faqs: updated });
                        }
                      }}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...siteContent.faqs];
                      updated[idx].answer = e.target.value;
                      setSiteContent({ ...siteContent, faqs: updated });
                    }}
                    style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GUIDES */}
        {activeTab === 'guides' && (
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
              CUSTOMER GUIDES &amp; BLOG POSTS ({siteContent.guides.length})
            </h1>

            <div style={{ display: 'grid', gap: '16px' }}>
              {siteContent.guides.map((guide, idx) => (
                <div key={guide.slug || idx} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {guide.title}
                    </h3>
                    <Link
                      href={`/blog/${guide.slug}`}
                      target="_blank"
                      style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      View Live &rarr;
                    </Link>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
                    {guide.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* VISUAL IMAGE LIBRARY PICKER MODAL */}
      {libraryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', width: '100%', maxWidth: '1000px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  SELECT IMAGE FROM LONE WOLF LIBRARY
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Choose an authentic photography asset or upload a new photo.
                </div>
              </div>
              <button
                onClick={() => setLibraryModalOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ padding: '14px 24px', backgroundColor: '#111827', borderBottom: '1px solid #1e293b', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search images by name..."
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                style={{ flex: '1 1 200px', padding: '8px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
              />

              <select
                value={libraryFilterCategory}
                onChange={(e) => setLibraryFilterCategory(e.target.value)}
                style={{ padding: '8px 12px', backgroundColor: '#0a0d14', border: '1px solid #334155', borderRadius: '4px', color: '#fff', fontSize: '0.84rem' }}
              >
                <option value="all">All Categories</option>
                <option value="real">Real Fleet Photography</option>
                <option value="general">Equipment &amp; Cutouts</option>
                <option value="gallery">Gallery &amp; Action</option>
                <option value="catalog">Catalog</option>
              </select>

              <label style={{ backgroundColor: 'var(--accent-red)', color: '#fff', padding: '8px 16px', borderRadius: '4px', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={15} />
                <span>Upload New File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileUploadForSlot}
                />
              </label>
            </div>

            {/* Thumbnail Grid */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', flex: 1 }}>
              
              {/* Render Uploaded Images first if any */}
              {uploadedImages.map((url, idx) => (
                <div
                  key={'uploaded-' + idx}
                  onClick={() => applyImageToSlot(url, 'Uploaded Image')}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '2px solid var(--accent-red)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', backgroundColor: '#0a0d14' }}>
                    <Image src={url} alt="Uploaded Image" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px 10px', fontSize: '0.76rem', color: '#fff', fontWeight: 700, backgroundColor: '#0f172a' }}>
                    🟢 Newly Uploaded
                  </div>
                </div>
              ))}

              {/* Render Existing Stock Library */}
              {EXISTING_IMAGE_LIBRARY
                .filter((item) => {
                  const matchesCat = libraryFilterCategory === 'all' || item.category === libraryFilterCategory;
                  const matchesQuery = item.name.toLowerCase().includes(librarySearchQuery.toLowerCase());
                  return matchesCat && matchesQuery;
                })
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyImageToSlot(item.src, item.name)}
                    style={{
                      backgroundColor: '#111827',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', backgroundColor: '#0a0d14' }}>
                      <Image src={item.src} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '8px 10px', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 700, backgroundColor: '#0f172a', lineHeight: 1.25 }}>
                      {item.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Lead Document History Modal */}
      {historyModalLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 16, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '40px 16px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              width: '100%',
              maxWidth: '840px',
              margin: '30px auto',
              maxHeight: 'calc(100vh - 80px)',
              borderRadius: '12px',
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 22px',
                backgroundColor: '#1e293b',
                borderBottom: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#38bdf8" />
                  <span>Document History — {historyModalLead.name}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                  Lead ID: <strong style={{ color: '#fff' }}>{historyModalLead.id}</strong> • {historyModalLead.phone || 'No phone'} • {historyModalLead.size || historyModalLead.service || 'Dumpster'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocLead(historyModalLead);
                    setEditingDoc(null);
                    setDocInitialType('QUOTE');
                    setDocModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Plus size={14} />
                  <span>New Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryModalLead(null)}
                  aria-label="Close document history"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Modal Body / Document List */}
            <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
              {(!leadDocuments[historyModalLead.id] || leadDocuments[historyModalLead.id].length === 0) ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>No documents created for this lead yet.</p>
                  <p style={{ margin: '8px 0 16px 0', fontSize: '0.8rem' }}>Create a Quote, Direct Invoice, or Paid Receipt.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDocLead(historyModalLead);
                      setEditingDoc(null);
                      setDocInitialType('QUOTE');
                      setDocModalOpen(true);
                    }}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    + Create Quote / Estimate
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    Attached Documents ({leadDocuments[historyModalLead.id].length})
                  </div>
                  {leadDocuments[historyModalLead.id].map((doc) => {
                    const typeColor =
                      doc.type === 'QUOTE'
                        ? { bg: '#1e293b', border: '#334155', text: '#cbd5e1' }
                        : doc.type === 'INVOICE'
                        ? { bg: '#082f49', border: '#0284c7', text: '#38bdf8' }
                        : { bg: '#052e16', border: '#16a34a', text: '#4ade80' };

                    const statusColor =
                      doc.status === 'Paid'
                        ? { bg: '#14532d', text: '#4ade80' }
                        : doc.status === 'Due' || doc.status === 'Overdue'
                        ? { bg: '#7f1d1d', text: '#fca5a5' }
                        : doc.status === 'Accepted'
                        ? { bg: '#16537e', text: '#38bdf8' }
                        : { bg: '#334155', text: '#cbd5e1' };

                    return (
                      <div
                        key={doc.id}
                        style={{
                          backgroundColor: '#111827',
                          border: `1px solid #1f2937`,
                          borderRadius: '8px',
                          padding: '12px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              backgroundColor: typeColor.bg,
                              border: `1px solid ${typeColor.border}`,
                              color: typeColor.text,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                            }}
                          >
                            {doc.type}
                          </span>
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>
                              {doc.docNumber}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                              {doc.date || doc.createdAt?.slice(0, 10)} {doc.total ? `• Total: $${Number(doc.total).toFixed(2)}` : ''}
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          >
                            {doc.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDocLead(historyModalLead);
                              setEditingDoc(doc);
                              setDocInitialType(doc.type);
                              setDocModalOpen(true);
                            }}
                            style={{
                              backgroundColor: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <FileText size={13} />
                            <span>Open / Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to permanently delete ${doc.type} ${doc.docNumber}?`)) return;
                              try {
                                const res = await fetch(`/api/admin/documents?docId=${encodeURIComponent(doc.id)}&leadId=${encodeURIComponent(historyModalLead.id)}&force=true`, {
                                  method: 'DELETE',
                                  headers: { 'X-Admin-Password': 'LoneWolf2026!' },
                                });
                                const data = await res.json();
                                if (data.success) {
                                  fetchDocumentsForLead(historyModalLead.id);
                                } else {
                                  alert(`Failed to delete document: ${data.error || 'Unknown error'}`);
                                }
                              } catch (err: any) {
                                alert(`Error deleting document: ${err.message}`);
                              }
                            }}
                            title="Delete Document"
                            style={{
                              backgroundColor: '#451a1a',
                              color: '#f87171',
                              border: '1px solid #7f1d1d',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 22px',
                backgroundColor: '#1e293b',
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Total: <strong>{leadDocuments[historyModalLead.id]?.length || 0} document(s)</strong>
              </span>
              <button
                type="button"
                onClick={() => setHistoryModalLead(null)}
                style={{
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal (Quote, Invoice, Receipt) */}
      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => {
          setDocModalOpen(false);
          setSelectedDocLead(null);
          setEditingDoc(null);
        }}
        lead={selectedDocLead}
        existingDoc={editingDoc}
        initialType={docInitialType}
        siteContent={siteContent}
        onDocumentSaved={(doc) => {
          if (selectedDocLead) {
            fetchDocumentsForLead(selectedDocLead.id);
          }
        }}
      />
    </div>
  );
}
