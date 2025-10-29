import React from "react";
import { StatusPill } from "./status-pill";

const StatusPillDemo: React.FC = () => {
  const statuses = [
    "used",
    "pending", 
    "expired",
    "approved",
    "rejected",
    "present",
    "absent",
    "late",
    "active",
    "inactive",
    "success",
    "warning",
    "error"
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Status Pill Demo</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Status Types</h3>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <StatusPill key={status} status={status} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-16 text-sm">Small:</span>
            <StatusPill status="pending" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-sm">Medium:</span>
            <StatusPill status="pending" size="md" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 text-sm">Large:</span>
            <StatusPill status="pending" size="lg" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Without Icons</h3>
        <div className="flex flex-wrap gap-2">
          <StatusPill status="used" showIcon={false} />
          <StatusPill status="pending" showIcon={false} />
          <StatusPill status="expired" showIcon={false} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Expired Pending Status</h3>
        <div className="flex flex-wrap gap-2">
          <StatusPill status="pending" isExpired={true} />
          <StatusPill status="pending" isExpired={false} />
        </div>
      </div>
    </div>
  );
};

export default StatusPillDemo;
