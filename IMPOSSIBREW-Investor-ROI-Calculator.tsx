import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Slider, Tabs, Tab } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdvancedROICalculator = () => {
  const [investment, setInvestment] = useState(100000);
  const [growthRate, setGrowthRate] = useState(170);
  const [exitMultiple, setExitMultiple] = useState(8.9);
  const [exitYear, setExitYear] = useState(5);
  const [scenario, setScenario] = useState('moderate');
  const [showComparison, setShowComparison] = useState(false);

  const calculateReturns = (years, growth, multiple) => {
    const discountedInvestment = investment * 0.9; // 10% discount
    const initialEquityStake = discountedInvestment / 10000000; // Assuming £10m valuation
    const futureRevenue = 10000000 / 4.35 * Math.pow((1 + growth / 100), years);
    const exitValuation = futureRevenue * multiple;
    return exitValuation * initialEquityStake;
  };

  const generateChartData = () => {
    const scenarios = {
      conservative: { growth: growthRate * 0.7, multiple: exitMultiple * 0.8 },
      moderate: { growth: growthRate, multiple: exitMultiple },
      optimistic: { growth: growthRate * 1.3, multiple: exitMultiple * 1.2 },
    };

    return Object.entries(scenarios).reduce((acc, [key, { growth, multiple }]) => {
      const data = Array.from({ length: 11 }, (_, i) => ({
        year: 2024 + i,
        [key]: calculateReturns(i, growth, multiple),
      }));
      return data.map((item, i) => ({ ...item, ...(acc[i] || {}) }));
    }, []);
  };

  const chartData = generateChartData();
  const currentScenarioReturn = chartData[exitYear][scenario] - investment;
  const roi = ((currentScenarioReturn / investment) * 100).toFixed(2);

  const marketComparison = [
    { name: 'IMPOSSIBREW®', value: roi },
    { name: 'S&P 500 Avg', value: 10 },
    { name: 'FTSE 100 Avg', value: 7 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-2xl font-sans">
      <h1 className="text-5xl font-extrabold mb-4 text-indigo-900">IMPOSSIBREW® Investor ROI Projector</h1>
      <p className="text-xl text-indigo-700 mb-8">Visualize your potential returns with our cutting-edge non-alcoholic beer technology</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-lg font-medium text-indigo-900 mb-2">Investment Amount</label>
          <input
            type="text"
            value={`£${investment.toLocaleString()}`}
            onChange={(e) => setInvestment(Number(e.target.value.replace(/[£,]/g, '')))}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg bg-white text-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-indigo-900 mb-2">Projected Annual Growth</label>
          <Slider
            min={50}
            max={300}
            step={1}
            value={[growthRate]}
            onValueChange={(value) => setGrowthRate(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-indigo-600 mt-2">
            <span>50%</span>
            <span>{growthRate}%</span>
            <span>300%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-lg font-medium text-indigo-900 mb-2">Exit Multiple</label>
          <select
            value={exitMultiple}
            onChange={(e) => setExitMultiple(Number(e.target.value))}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg bg-white text-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={5.9}>Camden (AB InBev, 2015) - 5.9x Sales</option>
            <option value={8.9}>Athletic Brewing (July 2024) - 8.9x Sales</option>
            <option value={16}>Premium Exit - 16x Sales</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-medium text-indigo-900 mb-2">Exit Year</label>
          <Slider
            min={3}
            max={10}
            step={1}
            value={[exitYear]}
            onValueChange={(value) => setExitYear(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-indigo-600 mt-2">
            <span>3 years</span>
            <span>{exitYear} years</span>
            <span>10 years</span>
          </div>
        </div>
      </div>

      <Tabs value={scenario} onValueChange={setScenario} className="mb-8">
        <Tab value="conservative">Conservative</Tab>
        <Tab value="moderate">Moderate</Tab>
        <Tab value="optimistic">Optimistic</Tab>
      </Tabs>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-4xl font-bold text-green-600 mb-2">+£{currentScenarioReturn.toLocaleString()}</h2>
        <p className="text-2xl text-indigo-900">Projected Return on Investment: {roi}%</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-indigo-900 mb-4">Projected Investment Growth</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `£${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, "Investment Value"]} />
              <Area type="monotone" dataKey="conservative" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="moderate" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Area type="monotone" dataKey="optimistic" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        onClick={() => setShowComparison(!showComparison)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {showComparison ? "Hide Market Comparison" : "Show Market Comparison"}
      </button>

      {showComparison && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">Market Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "ROI"]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <Alert>
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          This calculator provides hypothetical estimates based on the given inputs and assumptions. Past performance does not guarantee future results. Please consult with a financial advisor before making investment decisions. IMPOSSIBREW® is an innovative startup in the rapidly growing non-alcoholic beverage market, which carries both high potential returns and associated risks.
        </AlertDescription>
      </Alert>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">Why Invest in IMPOSSIBREW®?</h3>
          <ul className="list-disc list-inside text-indigo-800">
            <li>Rapidly growing non-alcoholic beer market</li>
            <li>Proprietary Social Blend™ technology</li>
            <li>Strong brand presence and marketing strategy</li>
            <li>Experienced management team</li>
            <li>Potential for international expansion</li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">Key Financial Metrics</h3>
          <ul className="list-disc list-inside text-indigo-800">
            <li>Current Revenue Run Rate: £2.5M</li>
            <li>YoY Growth: 170%</li>
            <li>Gross Margin: 65%</li>
            <li>Customer Acquisition Cost: £8.94</li>
            <li>Lifetime Value: £78.29</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvancedROICalculator;
