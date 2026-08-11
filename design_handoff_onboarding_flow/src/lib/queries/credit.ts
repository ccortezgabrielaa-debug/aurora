import { supabase } from '../supabase';
import type { Database } from '../database.types';
import { mergeLedger, type MergedLedgerEntry } from './ledger';

type RedemptionRow = Database['public']['Tables']['redemptions']['Row'];

export type RedemptionItem = RedemptionRow & { ambassadorName: string };

export async function fetchRedemptions(): Promise<RedemptionItem[]> {
  const [redemptionsRes, ambRes] = await Promise.all([
    supabase.from('redemptions').select('*').order('created_at', { ascending: false }),
    supabase.from('ambassadors').select('id, name'),
  ]);
  const nameById = new Map((ambRes.data ?? []).map((a) => [a.id, a.name]));
  return (redemptionsRes.data ?? []).map((r) => ({ ...r, ambassadorName: nameById.get(r.ambassador_id) ?? '—' }));
}

export async function fetchRedemption(id: string): Promise<RedemptionItem | null> {
  const { data: row } = await supabase.from('redemptions').select('*').eq('id', id).maybeSingle();
  if (!row) return null;
  const { data: amb } = await supabase.from('ambassadors').select('name').eq('id', row.ambassador_id).maybeSingle();
  return { ...row, ambassadorName: amb?.name ?? '—' };
}

export async function setRedemptionStatus(id: string, status: Database['public']['Enums']['redemption_status']) {
  const { error } = await supabase.from('redemptions').update({ status }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function fetchAmbassadorBalance(ambassadorId: string): Promise<number> {
  const { data } = await supabase.from('ambassador_stats').select('credit_balance').eq('id', ambassadorId).maybeSingle();
  return data?.credit_balance ?? 0;
}

export type CreditSummary = { outstanding: number; issuedMonth: number; redeemedMonth: number; pendingCount: number };

export async function fetchCreditSummary(): Promise<CreditSummary> {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthAgoIso = monthAgo.toISOString();

  const [activeLedgerRes, monthLedgerRes, monthRedemptionsRes, pendingRes] = await Promise.all([
    supabase.from('credit_ledger').select('amount').eq('status', 'active'),
    supabase.from('credit_ledger').select('amount').gte('created_at', monthAgoIso),
    supabase.from('redemptions').select('amount_deducted').gte('created_at', monthAgoIso),
    supabase.from('redemptions').select('id', { count: 'exact', head: true }).eq('status', 'solicitado'),
  ]);

  return {
    outstanding: (activeLedgerRes.data ?? []).reduce((s, l) => s + Number(l.amount), 0),
    issuedMonth: (monthLedgerRes.data ?? []).reduce((s, l) => s + Number(l.amount), 0),
    redeemedMonth: (monthRedemptionsRes.data ?? []).reduce((s, r) => s + Number(r.amount_deducted), 0),
    pendingCount: pendingRes.count ?? 0,
  };
}

export type BrandLedgerEntry = MergedLedgerEntry & { who: string };

export async function fetchBrandLedger(): Promise<BrandLedgerEntry[]> {
  const [ledgerRes, redemptionsRes, ambRes] = await Promise.all([
    supabase.from('credit_ledger').select('*').order('created_at', { ascending: false }).limit(40),
    supabase.from('redemptions').select('*').order('created_at', { ascending: false }).limit(40),
    supabase.from('ambassadors').select('id, name'),
  ]);
  const nameById = new Map((ambRes.data ?? []).map((a) => [a.id, a.name]));
  const ledger = ledgerRes.data ?? [];
  const redemptions = redemptionsRes.data ?? [];
  const whoByKey = new Map<string, string>();
  for (const l of ledger) whoByKey.set('l' + l.id, nameById.get(l.ambassador_id) ?? '—');
  for (const r of redemptions) whoByKey.set('r' + r.id, nameById.get(r.ambassador_id) ?? '—');

  return mergeLedger(ledger, redemptions).map((e) => ({ ...e, who: whoByKey.get(e.key) ?? '—' }));
}
