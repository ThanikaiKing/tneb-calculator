# PulseWatt ⚡ — Interactive Electricity Consumption & Blink Calculator

> Calculate real-time active power draw (**Watts** and **kW**), daily units, monthly units, and **Tamil Nadu (TANGEDCO)** electricity bills directly from your electric meter's red calibration LED blink interval and `imp/kWh` rating.

Hosted seamlessly on [Vercel](https://vercel.com). Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ⚡ Key Features

- **Live Tap-to-Measure Stopwatch**: Stand in front of your energy meter and tap the button each time the red LED pulses. Averages consecutive intervals with millisecond accuracy and haptic feedback.
- **Simulated Meter LED Pulse**: Realistic on-screen red calibration LED pulsing in real-time synced to your measured interval, featuring an optional synthesized audio tick.
- **Precision Speedometer Power Gauge**: High-contrast glowing SVG arc gauge indicating instantaneous Watts, kilowatts, and load severity classification (Standby, Light, Moderate, Heavy, Peak).
- **Comprehensive Unit & Bill Projections**:
  - **Instantaneous Load**: Watts (W) and Kilowatts (kW)
  - **Daily Consumption**: Units / 24h (kWh) & daily bill projection
  - **Monthly Consumption**: Units / 30d (kWh) & monthly projection
  - **Official Bi-Monthly EB Bill**: 60-day cycle matching Tamil Nadu TANGEDCO residential billing
- **Tamil Nadu TANGEDCO Domestic Tariff Preset**:
  - Incorporates the official tiered tariff structure (including 100/200 free units subsidies, ₹4.70, ₹6.30, ₹8.40, ₹9.45, ₹10.50, ₹11.55 slabs).
  - Interactive **Slab Breakdown Modal** explaining each tier's calculation.
- **Household Appliance Load Equivalency**: Visualizes what running appliances (LED bulbs, ceiling fans, refrigerators, inverter ACs, geysers, induction cooktops) consume that exact wattage.
- **Session Load Comparison Log**: Save readings with custom labels (e.g., *“Base Standby”*, *“AC On”*, *“Water Pump On”*) to calculate the exact power and financial delta added by specific appliances. Stored locally via `localStorage`.
- **Educational Guide**: Clear breakdown of the physics, formulas, and tips to lower your electricity bill.

---

## 📐 The Physics & Formula

Every electronic static energy meter has a calibration constant $C$ (in **imp/kWh**).
If the time between two consecutive pulses is $T$ seconds:

$$\text{Power (Watts)} = \frac{3,600 \times 1,000}{T \times \text{imp/kWh}}$$
$$\text{Daily Units (kWh/day)} = \frac{\text{Watts} \times 24}{1,000}$$
$$\text{Monthly Units (kWh/month)} = \text{Daily Units} \times 30$$
$$\text{Bi-Monthly Units (60 Days)} = \text{Daily Units} \times 60$$

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd intelligent-heisenberg
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

The repository is fully configured for zero-config deployment on Vercel:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com/new).
3. Import the repository.
4. Click **Deploy**. Vercel will automatically detect Next.js and deploy.

---

## 🏛️ Tamil Nadu Domestic Tariff Reference

| Slab Range (60-day cycle) | Tariff Rate (≤ 500 Units Total) | Tariff Rate (> 500 Units Total) |
|---|---|---|
| **0 – 100 Units** | Free (Subsidy) | Free (Subsidy) |
| **101 – 200 Units** | Free (Subsidy) | ₹4.70 / unit |
| **201 – 400 Units** | ₹4.70 / unit | ₹4.70 / unit |
| **401 – 500 Units** | ₹6.30 / unit | ₹6.30 / unit |
| **501 – 600 Units** | — | ₹8.40 / unit |
| **601 – 800 Units** | — | ₹9.45 / unit |
| **801 – 1,000 Units** | — | ₹10.50 / unit |
| **1,000+ Units** | — | ₹11.55 / unit |
