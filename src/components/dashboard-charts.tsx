"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0f6a5f", "#d4a017", "#c23b3b"];

export function DepartmentBarChart({
  data,
}: {
  data: { name: string; score: number }[];
}) {
  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d5e2de" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#5b6f6a" }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={60}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#5b6f6a" }} unit="%" />
          <Tooltip
            formatter={(value) => [`${value}%`, "نسبة الجاهزية"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d5e2de",
              direction: "rtl",
            }}
          />
          <Bar dataKey="score" name="النسبة" radius={[8, 8, 0, 0]} fill="#0f6a5f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}`, String(name)]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d5e2de",
              direction: "rtl",
            }}
          />
          <Legend
            verticalAlign="bottom"
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
