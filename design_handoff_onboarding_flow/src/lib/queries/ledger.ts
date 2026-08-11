import type { Database } from '../database.types';

type LedgerRow = Database['public']['Tables']['credit_ledger']['Row'];
type RedemptionRow = Database['public']['Tables']['redemptions']['Row'];

export type MergedLedgerEntry = {
  key: string;
  date: string;
  label: string;
  amount: number; // positive = earned, negative = redeemed
  statusLabel: string;
  statusColor: string;
};

const SOURCE_LABEL: Record<LedgerRow['source'], string> = {
  sale: 'Crédito de venda',
  content: 'Crédito de conteúdo',
};

const LEDGER_STATUS_COLOR: Record<LedgerRow['status'], string> = {
  active: '#5a8f6a',
  redeemed: '#8c8078',
  expired: '#c05a4e',
};

/**
 * The schema keeps earn events (`credit_ledger`, always positive) and spend events
 * (`redemptions`, a separate table) apart — this merges both into one dated feed for
 * "extrato" views, matching how the mockups showed a single mixed statement.
 */
export function mergeLedger(ledger: LedgerRow[], redemptions: RedemptionRow[]): MergedLedgerEntry[] {
  const earned: MergedLedgerEntry[] = ledger.map((l) => ({
    key: 'l' + l.id,
    date: l.created_at,
    label: SOURCE_LABEL[l.source],
    amount: Number(l.amount),
    statusLabel: l.status,
    statusColor: LEDGER_STATUS_COLOR[l.status],
  }));
  const spent: MergedLedgerEntry[] = redemptions.map((r) => ({
    key: 'r' + r.id,
    date: r.created_at,
    label: 'Resgate · ' + r.item_redeemed,
    amount: -Number(r.amount_deducted),
    statusLabel: r.status,
    statusColor: r.status === 'enviado' ? '#5a8f6a' : r.status === 'recusado' ? '#c05a4e' : '#b08a3a',
  }));
  return [...earned, ...spent].sort((a, b) => (a.date < b.date ? 1 : -1));
}
