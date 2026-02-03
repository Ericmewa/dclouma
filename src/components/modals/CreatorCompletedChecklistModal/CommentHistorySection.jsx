import React from "react";
import CommentHistory from "../../common/CommentHistory";

const CommentHistorySection = ({ comments, isLoading }) => {
  return (
    <div style={{ marginTop: 24 }}>
      <h4>Comment Trail & History</h4>
      <CommentHistory comments={comments} isLoading={isLoading} />
    </div>
  );
};

export default CommentHistorySection;