// export default CommentHistory;
import React from "react";
import { Avatar, Tag, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

/* ---------------------------
   Role badge helper
---------------------------- */
const getRoleTag = (role) => {
  switch ((role || "").toLowerCase()) {
    case "rm":
      return <Tag color="blue">RM</Tag>;
    case "cochecker":
      return <Tag color="green">CO</Tag>;
    case "cocreator":
      return <Tag color="purple">CREATOR</Tag>;
    default:
      return <Tag>{role || "UNKNOWN"}</Tag>;
  }
};

/* ---------------------------
   System message detector
   (status & workflow text)
---------------------------- */
const isSystemGeneratedMessage = (text = "") => {
  const message = text.toLowerCase();

  const systemPatterns = [
    // workflow / status transitions
    "checklist submitted",
    "submitted back",
    "submitted to",
    "returned to",
    "approved",
    "rejected",
    "completed",
    "initiated",
    "status updated",

    // auto activity
    "document uploaded",
    "checklist created",
    "draft saved",
  ];

  return systemPatterns.some((pattern) => message.includes(pattern));
};

/* ---------------------------
   Component
---------------------------- */
const CommentHistory = ({ comments = [], isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ padding: 12, display: "flex", justifyContent: "center" }}>
        <Spin size="small" />
      </div>
    );
  }

  /* ---------------------------
     FINAL FILTER LOGIC
     Only REAL human comments survive
  ---------------------------- */
  const filteredComments = comments.filter((item) => {
    const role = (item.userId?.role || item.role || "").toLowerCase();
    const message = item.message || item.comment || "";

    // 1. Remove system role completely
    if (role === "system") return false;

    // 2. Remove auto-generated workflow/status messages
    if (isSystemGeneratedMessage(message)) return false;

    // 3. Remove empty / whitespace-only comments
    if (!message.trim()) return false;

    return true;
  });

  /* ---------------------------
     SORT COMMENTS BY TIMESTAMP
     Newest first (descending order)
  ---------------------------- */
  const sortedComments = [...filteredComments].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return timeB - timeA; // Newest first
  });

  if (sortedComments.length === 0) {
    return (
      <div style={{ padding: 8, fontSize: 12, color: "#9ca3af" }}>
        No user comments yet.
      </div>
    );
  }

  return (
    <div
      style={{
        maxHeight: "320px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px 4px",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        background: "#fafbfc",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#1f2937",
          padding: "0 8px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "6px",
        }}
      >
        Comment Trail ({sortedComments.length})
      </div>

      {/* Comments */}
      {sortedComments.map((item, index) => (
        <div
          key={item._id || index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: "12px",
            color: "#374151",
            padding: "8px 8px",
            borderRadius: "4px",
            background: "#ffffff",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Header: Avatar, Name, Role, Time */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Avatar */}
            <Avatar
              size={20}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#164679", flexShrink: 0 }}
            />

            {/* Name */}
            <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
              {item.userId?.name ||
                (typeof item.user === "object" ? item.user?.name : item.user) ||
                "Unknown"}
            </span>

            {/* Role */}
            {getRoleTag(item.userId?.role || item.role)}

            {/* Time */}
            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginLeft: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {new Date(item.createdAt || item.timestamp).toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>

          {/* Comment Text */}
          <div
            style={{
              color: "#4b5563",
              lineHeight: "1.4",
              wordBreak: "break-word",
              paddingLeft: "28px",
              fontSize: "12px",
            }}
          >
            {item.message || item.comment}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentHistory;
