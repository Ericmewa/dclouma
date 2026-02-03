import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { checklistInfoCardStyles } from "../../styles/componentStyle";
// import { checklistInfoCardStyles } from "../styles";

const ChecklistInfoCard = ({ checklist }) => {
  if (!checklist) return null;

  return (
    <Card
      size="small"
      title={
        <span style={checklistInfoCardStyles.title}>Checklist Details</span>
      }
      style={checklistInfoCardStyles.card}
    >
      <Descriptions size="middle" column={{ xs: 1, sm: 2, lg: 3 }}>
        <Descriptions.Item label="DCL No">
          {checklist.dclNo || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer number">
          {checklist.customerNumber || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="IBPS No">
          {checklist.ibpsNo || "Not provided"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {checklist.createdAt || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Loan Type">
          {checklist.loanType || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {checklist.createdBy?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="RM">
          {checklist.assignedToRM?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Co-Checker">
          {checklist.assignedToCoChecker?.name || "Pending"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color="green">{checklist.status || "N/A"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Completed At">
          {checklist.completedAt || checklist.updatedAt || "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ChecklistInfoCard;
