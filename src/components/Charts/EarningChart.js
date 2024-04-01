import React from "react";
import styles from "../../styles/EarningChart.module.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EarningChart = ({ title, data, x }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <div className={styles.earningChartContainer}>
        <h6 className="boxTitle">{title}</h6>
        <AreaChart
          className={styles.areaChart}
          data={data}
          width={480}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} />
          {/* <YAxis /> */}
          <Tooltip />
          <Area
            type="monotone"
            dataKey="taka"
            stroke="#7ba383"
            fill="#ade6b9"
          />
        </AreaChart>
      </div>
    </ResponsiveContainer>
  );
};

export default EarningChart;
