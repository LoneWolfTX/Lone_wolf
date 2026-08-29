import { NextRequest, NextResponse } from 'next/server';
import { getCampaignsFromRedis, getSpendEntriesFromRedis } from '@/lib/marketing';
import { LeadSubmission } from '@/lib/redis';
import { LoneWolfDocument } from '@/lib/documents';

export const dynamic = 'force-dynamic';

const UPSTASH_URL = process.env.UPSTASH_REDIS_LW_KV_REST_API_URL || process.env.KV_REST_API_URL || 'https://glowing-rabbit-227227.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_LW_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAA3ebAAIgcDJlMzRjNDdlZjI1OWQ0NGE2OWYzMjQ3ODQzMzFlZDBmYg';

function isAuthorized(req: NextRequest): boolean {
  const pwd = req.headers.get('X-Admin-Password');
  const validPwd = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';
  return pwd === validPwd;
}

async function getAllLeads(): Promise<LeadSubmission[]> {
  try {
    const listRes = await fetch(`${UPSTASH_URL}/lrange/lonewolf:leads/0/-1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });
    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    const leads: LeadSubmission[] = [];
    for (const id of ids) {
      const itemRes = await fetch(`${UPSTASH_URL}/get/lonewolf:lead:${id}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (itemRes.ok) {
        const data = await itemRes.json();
        if (data?.result) {
          try {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            if (parsed && parsed.id) leads.push(parsed);
          } catch {
            // Ignore parse error
          }
        }
      }
    }
    return leads;
  } catch {
    return [];
  }
}

async function getAllDocuments(): Promise<LoneWolfDocument[]> {
  try {
    const listRes = await fetch(`${UPSTASH_URL}/lrange/lonewolf:documents/0/-1`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    });
    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const ids: string[] = Array.isArray(listData?.result) ? listData.result : [];

    const docs: LoneWolfDocument[] = [];
    for (const id of ids) {
      const itemRes = await fetch(`${UPSTASH_URL}/get/lonewolf:doc:${id}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (itemRes.ok) {
        const data = await itemRes.json();
        if (data?.result) {
          try {
            const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            if (parsed && parsed.id) docs.push(parsed);
          } catch {
            // Ignore parse error
          }
        }
      }
    }
    return docs;
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30days';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    const now = new Date();
    let startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (range === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (range === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (range === 'lastMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (range === 'thisYear') {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    } else if (range === 'custom' && customStart && customEnd) {
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
    }

    const campaigns = await getCampaignsFromRedis();
    const spendEntries = await getSpendEntriesFromRedis();
    const leads = await getAllLeads();
    const docs = await getAllDocuments();

    // 1. Calculate Spend for Date Range
    let totalSpend = 0;
    const campaignSpendMap: Record<string, number> = {};

    spendEntries.forEach((entry) => {
      const eStartStr = entry.startDate.includes('T') ? entry.startDate : `${entry.startDate}T00:00:00`;
      const eEndStr = entry.endDate.includes('T') ? entry.endDate : `${entry.endDate}T23:59:59`;
      const eStart = new Date(eStartStr);
      const eEnd = new Date(eEndStr);
      if (eStart <= endDate && eEnd >= startDate) {
        totalSpend += Number(entry.amount) || 0;
        campaignSpendMap[entry.campaignId] = (campaignSpendMap[entry.campaignId] || 0) + (Number(entry.amount) || 0);
      }
    });

    // 2. Filter Leads for Date Range & Repeat Customer Detection
    const phoneMap: Record<string, number> = {};
    leads.forEach((l) => {
      const cleanPhone = (l.phone || '').replace(/\D/g, '');
      if (cleanPhone) phoneMap[cleanPhone] = (phoneMap[cleanPhone] || 0) + 1;
    });

    const rangeLeads = leads.filter((l) => {
      const created = new Date(l.createdAt);
      return created >= startDate && created <= endDate;
    });

    // 3. Lead Method & Source Counters
    let websiteLeads = 0;
    let phoneLeads = 0;
    let manualLeads = 0;
    let knownSourceLeads = 0;
    let repeatLeadsCount = 0;
    let newBookedCustomersCount = 0;

    const sourceStats: Record<string, { leads: number; bookings: number; revenue: number }> = {};
    const campaignStats: Record<string, { leads: number; bookings: number; revenue: number }> = {};
    const cityStats: Record<string, { leads: number; bookings: number; revenue: number }> = {};
    const serviceStats: Record<string, { leads: number; bookings: number; revenue: number }> = {};
    const lostReasonsMap: Record<string, number> = {};

    let totalQuotedRevenue = 0;
    let totalBookedRevenue = 0;
    let totalInvoicedRevenue = 0;
    let totalCollectedRevenue = 0;
    let totalBookings = 0;

    rangeLeads.forEach((l) => {
      const method = l.leadMethod || 'Website Form';
      if (method === 'Website Form') websiteLeads++;
      else if (method === 'Phone') phoneLeads++;
      else manualLeads++;

      const isRepeat = l.isRepeatCustomer || (l.phone && (phoneMap[l.phone.replace(/\D/g, '')] || 0) > 1);
      if (isRepeat) repeatLeadsCount++;

      const src = l.manuallyOverriddenSource || l.reportingAttributionSource || l.normalizedSource || 'Unknown';
      if (src !== 'Unknown') knownSourceLeads++;

      if (!sourceStats[src]) sourceStats[src] = { leads: 0, bookings: 0, revenue: 0 };
      sourceStats[src].leads++;

      // Campaign Resolution
      let cmpId = l.attributedCampaignId || l.reportingAttributionCampaignId;
      if (!cmpId && l.lastTouchCampaign) {
        const match = campaigns.find((c) => c.utmCampaign === l.lastTouchCampaign || c.id === l.lastTouchCampaign);
        if (match) cmpId = match.id;
      }
      if (cmpId) {
        if (!campaignStats[cmpId]) campaignStats[cmpId] = { leads: 0, bookings: 0, revenue: 0 };
        campaignStats[cmpId].leads++;
      }

      // City & Service
      const city = l.deliveryAddress ? l.deliveryAddress.split(',')[1]?.trim() || l.deliveryAddress.trim() : 'DFW Area';
      if (!cityStats[city]) cityStats[city] = { leads: 0, bookings: 0, revenue: 0 };
      cityStats[city].leads++;

      const svc = l.service || '20 Yard Dumpster';
      if (!serviceStats[svc]) serviceStats[svc] = { leads: 0, bookings: 0, revenue: 0 };
      serviceStats[svc].leads++;

      // Lost Reason
      if (l.status === 'Lost / Not Moving Forward' && l.lostReason) {
        lostReasonsMap[l.lostReason] = (lostReasonsMap[l.lostReason] || 0) + 1;
      }

      // Financials linked to Lead
      const leadDocs = docs.filter((d) => d.leadId === l.id);
      let leadBookedRev = 0;
      let leadCollectedRev = 0;

      leadDocs.forEach((d) => {
        if (d.type === 'QUOTE') totalQuotedRevenue += d.total || 0;
        if (d.type === 'INVOICE') {
          totalInvoicedRevenue += d.total || 0;
          leadBookedRev += d.total || 0;
        }
        if (d.type === 'RECEIPT') {
          const paid = d.totalPaid || d.total || 0;
          totalCollectedRevenue += paid;
          leadCollectedRev += paid;
        }
      });

      const isBooked = l.status === 'Booked' || l.status === 'Completed' || leadDocs.some((d) => d.type === 'INVOICE' || d.type === 'RECEIPT');
      if (isBooked) {
        totalBookings++;
        sourceStats[src].bookings++;
        if (cmpId && campaignStats[cmpId]) campaignStats[cmpId].bookings++;
        cityStats[city].bookings++;
        serviceStats[svc].bookings++;

        if (!isRepeat) newBookedCustomersCount++;

        totalBookedRevenue += leadBookedRev || 425;
        sourceStats[src].revenue += leadCollectedRev || leadBookedRev;
        if (cmpId && campaignStats[cmpId]) campaignStats[cmpId].revenue += leadCollectedRev || leadBookedRev;
        cityStats[city].revenue += leadCollectedRev || leadBookedRev;
        serviceStats[svc].revenue += leadCollectedRev || leadBookedRev;
      }
    });

    const totalLeads = rangeLeads.length;
    const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const cac = newBookedCustomersCount > 0 ? totalSpend / newBookedCustomersCount : 0;
    const conversionRate = totalLeads > 0 ? (totalBookings / totalLeads) * 100 : 0;
    const collectedRoas = totalSpend > 0 ? totalCollectedRevenue / totalSpend : 0;
    const bookedRoas = totalSpend > 0 ? totalBookedRevenue / totalSpend : 0;
    const attributionCoverage = totalLeads > 0 ? Math.round((knownSourceLeads / totalLeads) * 100) : 100;

    // Actionable Insights Generation
    const insights: string[] = [];
    if (totalLeads > 0) {
      insights.push(`Logged ${totalLeads} total leads (${websiteLeads} website, ${phoneLeads} phone, ${manualLeads} manual) generating ${totalBookings} booked customer rentals.`);
    }
    if (totalSpend > 0) {
      insights.push(`Total ad spend of $${totalSpend.toFixed(2)} yielded $${totalCollectedRevenue.toFixed(2)} collected revenue (${collectedRoas.toFixed(2)}x ROAS).`);
      insights.push(`Average Customer Acquisition Cost (CAC) for new booked customers is $${cac.toFixed(2)}.`);
    }
    if (lostReasonsMap['No inventory available']) {
      insights.push(`${lostReasonsMap['No inventory available']} leads were lost specifically due to inventory/dumpster availability constraints.`);
    }

    return NextResponse.json({
      success: true,
      range,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        totalSpend,
        totalLeads,
        websiteLeads,
        phoneLeads,
        manualLeads,
        repeatLeadsCount,
        newBookedCustomersCount,
        totalBookings,
        totalQuotedRevenue,
        totalBookedRevenue,
        totalInvoicedRevenue,
        totalCollectedRevenue,
        costPerLead,
        cac,
        conversionRate,
        collectedRoas,
        bookedRoas,
        attributionCoverage,
      },
      dataQuality: {
        attributionCoverage,
        unknownLeadsCount: totalLeads - knownSourceLeads,
        missingPaymentCount: rangeLeads.filter((l) => (l.status === 'Completed' || l.status === 'Booked') && !docs.some((d) => d.leadId === l.id && d.type === 'RECEIPT')).length,
        profitDataAvailable: false,
      },
      campaigns: campaigns.map((c) => ({
        ...c,
        spend: campaignSpendMap[c.id] || 0,
        leads: campaignStats[c.id]?.leads || 0,
        bookings: campaignStats[c.id]?.bookings || 0,
        revenue: campaignStats[c.id]?.revenue || 0,
        cpl: campaignStats[c.id]?.leads ? (campaignSpendMap[c.id] || 0) / campaignStats[c.id].leads : 0,
        cac: campaignStats[c.id]?.bookings ? (campaignSpendMap[c.id] || 0) / campaignStats[c.id].bookings : 0,
        roas: (campaignSpendMap[c.id] || 0) > 0 ? (campaignStats[c.id]?.revenue || 0) / (campaignSpendMap[c.id] || 1) : 0,
      })),
      sources: Object.entries(sourceStats).map(([name, stat]) => ({
        name,
        leads: stat.leads,
        bookings: stat.bookings,
        conversion: stat.leads > 0 ? (stat.bookings / stat.leads) * 100 : 0,
        revenue: stat.revenue,
      })),
      cities: Object.entries(cityStats).map(([name, stat]) => ({
        name,
        leads: stat.leads,
        bookings: stat.bookings,
        revenue: stat.revenue,
      })),
      services: Object.entries(serviceStats).map(([name, stat]) => ({
        name,
        leads: stat.leads,
        bookings: stat.bookings,
        revenue: stat.revenue,
      })),
      lostReasons: lostReasonsMap,
      insights,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
