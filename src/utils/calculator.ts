import { CalculationResult, SlabBreakdownItem, ApplianceEquivalent } from '../types/calculator';

export const COMMON_IMP_PRESETS = [800, 1000, 1200, 1600, 3200, 6400];

export type TariffMode = 'tangedco' | 'flat';

/**
 * Calculates Tamil Nadu TANGEDCO domestic bi-monthly bill (60 days)
 * based on the official tiered slabs provided:
 *
 * Case A (Total bi-monthly units <= 500):
 *  0 - 200 units: Free
 *  201 - 400 units: ₹4.70 / unit
 *  401 - 500 units: ₹6.30 / unit
 *
 * Case B (Total bi-monthly units > 500):
 *  0 - 100 units: Free
 *  101 - 400 units: ₹4.70 / unit
 *  401 - 500 units: ₹6.30 / unit
 *  501 - 600 units: ₹8.40 / unit
 *  601 - 800 units: ₹9.45 / unit
 *  801 - 1000 units: ₹10.50 / unit
 *  1000+ units: ₹11.55 / unit
 */
export function calculateTangedcoCost(unitsBiMonthly: number): {
  totalCost: number;
  breakdown: SlabBreakdownItem[];
} {
  const units = Math.max(0, unitsBiMonthly);
  const breakdown: SlabBreakdownItem[] = [];

  if (units <= 500) {
    // Slab 1: 0 - 200 (Free)
    const slab1Units = Math.min(units, 200);
    breakdown.push({
      slab: '0 - 200 Units (Subsidy)',
      units: slab1Units,
      rate: 0,
      cost: 0,
    });

    // Slab 2: 201 - 400 (₹4.70)
    if (units > 200) {
      const slab2Units = Math.min(units - 200, 200);
      const cost = slab2Units * 4.7;
      breakdown.push({
        slab: '201 - 400 Units',
        units: slab2Units,
        rate: 4.7,
        cost,
      });
    }

    // Slab 3: 401 - 500 (₹6.30)
    if (units > 400) {
      const slab3Units = Math.min(units - 400, 100);
      const cost = slab3Units * 6.3;
      breakdown.push({
        slab: '401 - 500 Units',
        units: slab3Units,
        rate: 6.3,
        cost,
      });
    }
  } else {
    // Over 500 units tier
    // Slab 1: 0 - 100 (Free)
    const slab1Units = Math.min(units, 100);
    breakdown.push({
      slab: '0 - 100 Units (Free)',
      units: slab1Units,
      rate: 0,
      cost: 0,
    });

    // Slab 2: 101 - 400 (300 units @ ₹4.70)
    if (units > 100) {
      const slab2Units = Math.min(units - 100, 300);
      const cost = slab2Units * 4.7;
      breakdown.push({
        slab: '101 - 400 Units',
        units: slab2Units,
        rate: 4.7,
        cost,
      });
    }

    // Slab 3: 401 - 500 (100 units @ ₹6.30)
    if (units > 400) {
      const slab3Units = Math.min(units - 400, 100);
      const cost = slab3Units * 6.3;
      breakdown.push({
        slab: '401 - 500 Units',
        units: slab3Units,
        rate: 6.3,
        cost,
      });
    }

    // Slab 4: 501 - 600 (100 units @ ₹8.40)
    if (units > 500) {
      const slab4Units = Math.min(units - 500, 100);
      const cost = slab4Units * 8.4;
      breakdown.push({
        slab: '501 - 600 Units',
        units: slab4Units,
        rate: 8.4,
        cost,
      });
    }

    // Slab 5: 601 - 800 (200 units @ ₹9.45)
    if (units > 600) {
      const slab5Units = Math.min(units - 600, 200);
      const cost = slab5Units * 9.45;
      breakdown.push({
        slab: '601 - 800 Units',
        units: slab5Units,
        rate: 9.45,
        cost,
      });
    }

    // Slab 6: 801 - 1000 (200 units @ ₹10.50)
    if (units > 800) {
      const slab6Units = Math.min(units - 800, 200);
      const cost = slab6Units * 10.5;
      breakdown.push({
        slab: '801 - 1000 Units',
        units: slab6Units,
        rate: 10.5,
        cost,
      });
    }

    // Slab 7: > 1000 (@ ₹11.55)
    if (units > 1000) {
      const slab7Units = units - 1000;
      const cost = slab7Units * 11.55;
      breakdown.push({
        slab: '1000+ Units',
        units: slab7Units,
        rate: 11.55,
        cost,
      });
    }
  }

  const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
  return { totalCost, breakdown };
}

export function calculatePowerMetrics(
  impPerKwh: number,
  intervalSeconds: number,
  tariffMode: TariffMode = 'tangedco',
  flatRate: number = 7.0
): CalculationResult {
  if (impPerKwh <= 0 || intervalSeconds <= 0) {
    return {
      watts: 0,
      kilowatts: 0,
      unitsPerDay: 0,
      unitsPerMonth: 0,
      unitsBiMonthly: 0,
      costPerDay: 0,
      costPerMonth: 0,
      costBiMonthly: 0,
      blinksPerMinute: 0,
      costBreakdownBiMonthly: [],
      loadCategory: 'standby',
    };
  }

  // Formula:
  // 1 impulse represents (1 / impPerKwh) kWh = (1000 / impPerKwh) Wh
  // If interval between impulses is T seconds:
  // Power (Watts) = (3600 * 1000) / (T * impPerKwh)
  const watts = (3600 * 1000) / (intervalSeconds * impPerKwh);
  const kilowatts = watts / 1000;
  const unitsPerDay = kilowatts * 24;
  const unitsPerMonth = unitsPerDay * 30;
  const unitsBiMonthly = unitsPerDay * 60; // 60 days
  const blinksPerMinute = 60 / intervalSeconds;

  let costBiMonthly = 0;
  let costPerMonth = 0;
  let costPerDay = 0;
  let costBreakdownBiMonthly: SlabBreakdownItem[] = [];

  if (tariffMode === 'tangedco') {
    const res = calculateTangedcoCost(unitsBiMonthly);
    costBiMonthly = res.totalCost;
    costBreakdownBiMonthly = res.breakdown;
    // Monthly and daily approximations from the bi-monthly cycle
    costPerMonth = costBiMonthly / 2;
    costPerDay = costBiMonthly / 60;
  } else {
    // Flat rate
    costPerDay = unitsPerDay * flatRate;
    costPerMonth = unitsPerMonth * flatRate;
    costBiMonthly = unitsBiMonthly * flatRate;
    costBreakdownBiMonthly = [
      {
        slab: 'Flat Rate',
        units: unitsBiMonthly,
        rate: flatRate,
        cost: costBiMonthly,
      },
    ];
  }

  let loadCategory: CalculationResult['loadCategory'] = 'standby';
  if (watts < 150) {
    loadCategory = 'standby';
  } else if (watts < 800) {
    loadCategory = 'low';
  } else if (watts < 2200) {
    loadCategory = 'moderate';
  } else if (watts < 4500) {
    loadCategory = 'high';
  } else {
    loadCategory = 'peak';
  }

  return {
    watts,
    kilowatts,
    unitsPerDay,
    unitsPerMonth,
    unitsBiMonthly,
    costPerDay,
    costPerMonth,
    costBiMonthly,
    blinksPerMinute,
    costBreakdownBiMonthly,
    loadCategory,
  };
}

export function getApplianceEquivalents(watts: number): ApplianceEquivalent[] {
  return [
    {
      name: 'LED Bulbs (9W)',
      icon: 'Lightbulb',
      watts: 9,
      count: Math.round(watts / 9),
      unit: 'bulbs running',
      description: 'Standard bright household LED bulb',
    },
    {
      name: 'Ceiling Fans (75W)',
      icon: 'Fan',
      watts: 75,
      count: Number((watts / 75).toFixed(1)),
      unit: 'fans at full speed',
      description: 'Standard 1200mm induction ceiling fan',
    },
    {
      name: 'Refrigerators (150W)',
      icon: 'Refrigerator',
      watts: 150,
      count: Number((watts / 150).toFixed(1)),
      unit: 'compressors active',
      description: 'Double door frost-free refrigerator compressor running',
    },
    {
      name: '1.5-Ton Inverter AC (1,400W)',
      icon: 'AirVent',
      watts: 1400,
      count: Number((watts / 1400).toFixed(2)),
      unit: 'split ACs running',
      description: 'Modern 5-star inverter air conditioner at cooling load',
    },
    {
      name: 'Electric Water Geyser (2,000W)',
      icon: 'Flame',
      watts: 2000,
      count: Number((watts / 2000).toFixed(2)),
      unit: 'geysers heating',
      description: '25L storage bathroom water heater element',
    },
    {
      name: 'Induction Cooktop (1,800W)',
      icon: 'CookingPot',
      watts: 1800,
      count: Number((watts / 1800).toFixed(2)),
      unit: 'induction cooktops',
      description: 'Medium-high heat cooking on induction stove',
    },
  ];
}
