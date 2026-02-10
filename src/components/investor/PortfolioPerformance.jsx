import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PortfolioPerformance({ investments }) {
  // Generate mock performance data based on investments
  const generatePerformanceData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseValue = 100000;
    
    return months.map((month, idx) => ({
      month,
      value: baseValue + (idx * 15000) + (Math.random() * 10000),
      projected: baseValue + (idx * 18000) + 5000,
    }));
  };

  const performanceData = generatePerformanceData();
  const currentValue = performanceData[performanceData.length - 1].value;
  const previousValue = performanceData[0].value;
  const growth = ((currentValue - previousValue) / previousValue) * 100;
  const isPositive = growth > 0;

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Portfolio Performance</h3>
            <p className="text-sm text-gray-500">Track your investment growth over time</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              ₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{growth.toFixed(2)}% (6 months)
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
            <YAxis stroke="#999" style={{ fontSize: '12px' }} />
            <Tooltip 
              formatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 4 }}
              name="Actual Value"
            />
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Projected"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}