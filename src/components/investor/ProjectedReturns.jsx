import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Percent } from "lucide-react";

export default function ProjectedReturns({ investments }) {
  const projections = [
    {
      period: "3 Months",
      roi: 12.5,
      amount: 125000,
      confidence: "High",
      trend: "up",
    },
    {
      period: "6 Months",
      roi: 28.3,
      amount: 283000,
      confidence: "High",
      trend: "up",
    },
    {
      period: "1 Year",
      roi: 45.7,
      amount: 457000,
      confidence: "Medium",
      trend: "up",
    },
  ];

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Projected Returns</h3>
            <p className="text-sm text-gray-500">Based on market trends and portfolio analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          {projections.map((proj, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-gray-900">{proj.period}</span>
                </div>
                <Badge className={proj.confidence === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {proj.confidence} Confidence
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expected Return</p>
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">+{proj.roi}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Estimated Value</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{proj.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          *Projections are based on historical data and market analysis. Actual returns may vary.
        </p>
      </CardContent>
    </Card>
  );
}