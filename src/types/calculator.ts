export interface TariffSlab {
  min: number;
  max: number | null; // null represents infinity / 1000+
  rate: number; // 0 for free
  label: string;
}

export interface SlabBreakdownItem {
  slab: string;
  units: number;
  rate: number;
  cost: number;
}

export interface CalculationResult {
  watts: number;
  kilowatts: number;
  unitsPerDay: number;
  unitsPerMonth: number; // 30 days
  unitsBiMonthly: number; // 60 days (standard TN TANGEDCO billing)
  costPerDay: number;
  costPerMonth: number;
  costBiMonthly: number;
  blinksPerMinute: number;
  costBreakdownBiMonthly: SlabBreakdownItem[];
  loadCategory: 'standby' | 'low' | 'moderate' | 'high' | 'peak';
}

export interface ApplianceEquivalent {
  name: string;
  icon: string;
  watts: number;
  count: number;
  unit: string;
  description: string;
}

export interface SavedSessionLog {
  id: string;
  timestamp: number;
  label: string;
  impPerKwh: number;
  intervalSeconds: number;
  watts: number;
  unitsPerDay: number;
  unitsBiMonthly: number;
  costBiMonthly: number;
}
