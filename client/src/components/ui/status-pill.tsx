import * as React from "react"
import { CheckCircle, Clock, XCircle, AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatusPillProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
  isExpired?: boolean
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

const statusConfig = {
  // Invitation statuses
  used: {
    icon: CheckCircle,
    label: "Used",
    className: "bg-green-200 text-green-700 border-green-300 shadow-green-500/20",
    iconClassName: "text-green-700"
  },
  pending: {
    icon: Clock,
    label: "Pending", 
    className: "bg-yellow-200 text-yellow-700 border-yellow-300 shadow-yellow-500/20",
    iconClassName: "text-yellow-700"
  },
  expired: {
    icon: XCircle,
    label: "Expired",
    className: "bg-red-200 text-red-700 border-red-300 shadow-red-500/20",
    iconClassName: "text-red-700"
  },
  // Leave statuses
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    className: "bg-green-200 text-green-700 border-green-300 shadow-green-500/20",
    iconClassName: "text-white"
  },
  rejected: {
    icon: X,
    label: "Rejected",
    className: "bg-red-200 text-red-700 border-red-300 shadow-red-500/20",
    iconClassName: "text-white"
  },
  // Attendance statuses
  present: {
    icon: CheckCircle,
    label: "Present",
    className: "bg-green-200 text-green-700 border-green-300 shadow-green-500/20",
    iconClassName: "text-white"
  },
  absent: {
    icon: XCircle,
    label: "Absent",
    className: "bg-red-200 text-red-700 border-red-300 shadow-red-500/20",
    iconClassName: "text-white"
  },
  late: {
    icon: Clock,
    label: "Late",
    className: "bg-yellow-200 text-yellow-700 border-yellow-300 shadow-yellow-500/20",
    iconClassName: "text-white"
  },
  // General statuses
  active: {
    icon: CheckCircle,
    label: "Active",
    className: "bg-green-200 text-green-700 border-green-300 shadow-green-500/20",
    iconClassName: "text-white"
  },
  inactive: {
    icon: XCircle,
    label: "Inactive",
    className: "bg-gray-200 text-gray-700 border-gray-300 shadow-gray-500/20",
    iconClassName: "text-white"
  },
  success: {
    icon: CheckCircle2,
    label: "Success",
    className: "bg-green-200 text-green-700 border-green-300 shadow-green-500/20",
    iconClassName: "text-white"
  },
  warning: {
    icon: AlertCircle,
    label: "Warning",
    className: "bg-yellow-200 text-yellow-700 border-yellow-300 shadow-yellow-500/20",
    iconClassName: "text-white"
  },
  error: {
    icon: XCircle,
    label: "Error",
    className: "bg-red-200 text-red-700 border-red-300 shadow-red-500/20",
    iconClassName: "text-white"
  }
}

const sizeConfig = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-xs", 
  lg: "px-4 py-2 text-sm"
}

function StatusPill({ 
  status, 
  isExpired = false, 
  showIcon = true,
  size = "md",
  className, 
  ...props 
}: StatusPillProps) {
  // Override status to expired if isExpired is true and status is pending
  const actualStatus = (isExpired && status === 'pending') ? 'expired' : status.toLowerCase()
  const config = statusConfig[actualStatus as keyof typeof statusConfig]
  
  // Fallback for unknown statuses
  const fallbackConfig = {
    icon: AlertCircle,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    className: "bg-gray-500 hover:bg-gray-600 text-white border-gray-600 shadow-gray-500/20",
    iconClassName: "text-white"
  }
  
  const finalConfig = config || fallbackConfig
  const Icon = finalConfig.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200",
        "border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1",
        "transform hover:scale-105 active:scale-95",
        sizeConfig[size],
        finalConfig.className,
        className
      )}
      {...props}
    >
      {showIcon && <Icon className={cn("h-3 w-3", finalConfig.iconClassName)} />}
      <span className="font-medium">{finalConfig.label}</span>
    </div>
  )
}

export { StatusPill }
2