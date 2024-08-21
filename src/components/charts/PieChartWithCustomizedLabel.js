import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// Colors for the chart options
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartWithCustomizedLabel = ({
  data,
  surveyName,
  questionNumber,
  submissionsCount,
}) => {
  // Log the data to check its structure
  console.log("Chart Data:", data);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].option} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <h3>
        {questionNumber}. {surveyName}
      </h3>
      <p>Submissions: {submissionsCount}</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWithCustomizedLabel;
