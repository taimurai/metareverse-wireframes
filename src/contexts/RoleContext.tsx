"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "owner" | "co-owner" | "manager" | "publisher" | "approver" | "analyst";
export type BatchId = "all" | "batch-a" | "batch-b" | "batch-c";

export const ROLE_CONFIG: Record<Role, {
  label: string;
  color: string;
  canViewRevenue: boolean;
  canViewRpm: boolean;
  canViewBilling: boolean;
  canManageTeam: boolean;
  canManagePages: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canViewSettings: boolean;
}> = {
  owner:      { label: "Owner",     color: "#FF6B2B", canViewRevenue: true,  canViewRpm: true,  canViewBilling: true,  canManageTeam: true,  canManagePages: true,  canApprove: true,  canPublish: true,  canViewSettings: true  },
  "co-owner": { label: "Co-Owner",  color: "#F97316", canViewRevenue: true,  canViewRpm: true,  canViewBilling: true,  canManageTeam: true,  canManagePages: true,  canApprove: true,  canPublish: true,  canViewSettings: true  },
  manager:    { label: "Manager",   color: "#4ADE80", canViewRevenue: false, canViewRpm: true,  canViewBilling: false, canManageTeam: true,  canManagePages: true,  canApprove: true,  canPublish: true,  canViewSettings: true  },
  publisher:  { label: "Publisher", color: "#3B82F6", canViewRevenue: false, canViewRpm: false, canViewBilling: false, canManageTeam: false, canManagePages: false, canApprove: false, canPublish: true,  canViewSettings: false },
  approver:   { label: "Approver",  color: "#FBBF24", canViewRevenue: false, canViewRpm: false, canViewBilling: false, canManageTeam: false, canManagePages: false, canApprove: true,  canPublish: false, canViewSettings: false },
  analyst:    { label: "Analyst",   color: "#6366F1", canViewRevenue: false, canViewRpm: false, canViewBilling: false, canManageTeam: false, canManagePages: false, canApprove: false, canPublish: false, canViewSettings: false },
};

export const BATCH_CONFIG: Record<BatchId, { label: string; color: string; pages: string[] }> = {
  all:       { label: "All Batches",             color: "#FF6B2B", pages: ["lc","hu","tb","mm","dh","ff","khn"] },
  "batch-a": { label: "Partner A — Lifestyle",   color: "#8B5CF6", pages: ["lc","ff","dh"] },
  "batch-b": { label: "Partner B — Education",   color: "#FF6B2B", pages: ["hu","tb","mm"] },
  "batch-c": { label: "Partner C — Women's",     color: "#0EA5E9", pages: ["khn"] },
};

interface RoleContextType {
  role: Role;
  setRole: (r: Role) => void;
  batch: BatchId;
  setBatch: (b: BatchId) => void;
  config: typeof ROLE_CONFIG[Role];
  batchConfig: typeof BATCH_CONFIG[BatchId];
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("owner");
  const [batch, setBatchState] = useState<BatchId>("all");

  useEffect(() => {
    const r = localStorage.getItem("mr_role") as Role;
    const b = localStorage.getItem("mr_batch") as BatchId;
    if (r && ROLE_CONFIG[r]) setRoleState(r);
    if (b && BATCH_CONFIG[b]) setBatchState(b);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("mr_role", r);
    if (r === "owner" || r === "co-owner") {
      setBatchState("all");
      localStorage.setItem("mr_batch", "all");
    } else {
      const current = localStorage.getItem("mr_batch") as BatchId;
      if (!current || current === "all") {
        setBatchState("batch-a");
        localStorage.setItem("mr_batch", "batch-a");
      }
    }
  };

  const setBatch = (b: BatchId) => {
    setBatchState(b);
    localStorage.setItem("mr_batch", b);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, batch, setBatch, config: ROLE_CONFIG[role], batchConfig: BATCH_CONFIG[batch] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
