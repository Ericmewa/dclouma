import React from "react";
import { Progress } from "antd";
import { COLORS } from "./constants";
// import { progressSectionStyles } from "../styles";
// import { calculateDocumentStats } from "../utils";
import { progressSectionStyles } from "../../styles/componentStyle";
import { calculateDocumentStats } from "../../../utils/documentUtils";

const ProgressStatsSection = ({ docs }) => {
  const documentStats = calculateDocumentStats(docs);
  const {
    total,
    submitted,
    pendingFromRM,
    pendingFromCo,
    deferred,
    sighted,
    waived,
    tbo,
    progressPercent,
  } = documentStats;

  const stats = [
    { label: "Total", value: total, color: COLORS.PRIMARY_BLUE },
    { label: "Submitted", value: submitted, color: "green" },
    {
      label: "Pending RM",
      value: pendingFromRM,
      color: pendingFromRM > 0 ? "#f59e0b" : "#8b5cf6",
      highlight: pendingFromRM > 0,
    },
    {
      label: "Pending Co",
      value: pendingFromCo,
      color: "#8b5cf6",
      highlight: pendingFromCo > 0,
    },
    { label: "Deferred", value: deferred, color: "#ef4444" },
    { label: "Sighted", value: sighted, color: "#3b82f6" },
    { label: "Waived", value: waived, color: "#f59e0b" },
    { label: "TBO", value: tbo, color: "#06b6d4" },
  ];

  return (
    <div style={progressSectionStyles.container}>
      <div style={progressSectionStyles.statsRow}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              ...progressSectionStyles.statItem,
              color: stat.color,
              ...(stat.highlight && {
                border: `2px solid ${stat.color}`,
                padding: "2px 6px",
                borderRadius: "4px",
                background: "#f3f4f6",
              }),
            }}
          >
            {stat.label}: {stat.value}
          </div>
        ))}
      </div>

      <div style={progressSectionStyles.progressContainer}>
        <div style={progressSectionStyles.progressText}>
          <span style={progressSectionStyles.progressLabel}>
            Completion Progress
          </span>
          <span style={progressSectionStyles.progressPercent}>
            {progressPercent}%
          </span>
        </div>
        <Progress
          percent={progressPercent}
          strokeColor={{
            "0%": COLORS.PRIMARY_BLUE,
            "100%": COLORS.ACCENT_LIME,
          }}
          strokeWidth={6}
        />
      </div>
    </div>
  );
};

export default ProgressStatsSection;
