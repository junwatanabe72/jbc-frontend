import { create } from "zustand";
// import { useBillingStore } from "./billingStore";
// import { useBuildingStore } from "./buildingStore";
import { useRequestStore } from "./requestStore";
// import { useBookingStore } from "./bookingStore";

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface OccupancyData {
  month: string;
  occupancyRate: number;
  totalUnits: number;
  occupiedUnits: number;
}

export interface RequestAnalytics {
  type: string;
  count: number;
  avgProcessingTime: number; // 日単位
  approvalRate: number; // パーセント
}

export interface BookingAnalytics {
  month: string;
  totalBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  utilizationRate: number;
}

export interface AnalyticsData {
  // 収益分析
  revenueData: RevenueData[];
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number; // 前月比

  // 入居率分析
  occupancyData: OccupancyData[];
  currentOccupancyRate: number;
  occupancyTrend: number; // 前月比

  // 申請分析
  requestAnalytics: RequestAnalytics[];
  totalRequests: number;
  pendingRequests: number;
  avgProcessingTime: number;

  // 予約分析
  bookingAnalytics: BookingAnalytics[];
  monthlyBookings: number;
  bookingUtilization: number;

  // テナント分析
  tenantRetentionRate: number;
  avgContractLength: number; // 月単位

  // その他のKPI
  maintenanceCost: number;
  customerSatisfaction: number; // スコア
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  selectedPeriod: "week" | "month" | "quarter" | "year";
  generateReport: () => void;
  setPeriod: (period: "week" | "month" | "quarter" | "year") => void;
  exportReport: (format: "csv" | "pdf") => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: null,
  isLoading: false,
  selectedPeriod: "month",

  generateReport: () => {
    set({ isLoading: true });

    // 他のストアからデータを取得

    // const buildingStore = useBuildingStore.getState();
    const requestStore = useRequestStore.getState();
    // const bookingStore = useBookingStore.getState();

    // 収益データの生成（過去12ヶ月）
    const revenueData: RevenueData[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
      });

      // 実際のデータの代わりにサンプルデータを生成
      const baseRevenue = 2000000 + Math.random() * 500000;
      const baseExpenses = 500000 + Math.random() * 200000;

      revenueData.push({
        month: monthStr,
        revenue: Math.round(baseRevenue),
        expenses: Math.round(baseExpenses),
        profit: Math.round(baseRevenue - baseExpenses),
      });
    }

    // 入居率データの生成
    const occupancyData: OccupancyData[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
      });

      const totalUnits = 50;
      const occupiedUnits = Math.round(
        totalUnits * (0.8 + Math.random() * 0.2)
      );

      occupancyData.push({
        month: monthStr,
        occupancyRate: Math.round((occupiedUnits / totalUnits) * 100),
        totalUnits,
        occupiedUnits,
      });
    }

    // 申請分析データ
    const requestTypes = [
      "maintenance",
      "construction",
      "move_in_out",
      "equipment",
      "other",
    ];
    const requestAnalytics: RequestAnalytics[] = requestTypes.map((type) => {
      const typeRequests = requestStore.requests.filter((r) => r.type === type);
      const approvedRequests = typeRequests.filter(
        (r) => r.status === "approved"
      );

      return {
        type:
          type === "maintenance"
            ? "メンテナンス"
            : type === "construction"
            ? "工事"
            : type === "move_in_out"
            ? "搬入・搬出"
            : type === "equipment"
            ? "設備"
            : "その他",
        count: typeRequests.length,
        avgProcessingTime: 3 + Math.random() * 7, // 3-10日
        approvalRate:
          typeRequests.length > 0
            ? (approvedRequests.length / typeRequests.length) * 100
            : 0,
      };
    });

    // 予約分析データ
    const bookingAnalytics: BookingAnalytics[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
      });

      const total = Math.round(50 + Math.random() * 100);
      const approved = Math.round(total * (0.8 + Math.random() * 0.15));
      const rejected = total - approved;

      bookingAnalytics.push({
        month: monthStr,
        totalBookings: total,
        approvedBookings: approved,
        rejectedBookings: rejected,
        utilizationRate: Math.round((approved / 200) * 100), // 200 = 総予約可能枠
      });
    }

    // 現在の値を計算
    const currentRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
    const previousRevenue = revenueData[revenueData.length - 2]?.revenue || 0;
    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const currentOccupancy =
      occupancyData[occupancyData.length - 1]?.occupancyRate || 0;
    const previousOccupancy =
      occupancyData[occupancyData.length - 2]?.occupancyRate || 0;
    const occupancyTrend = currentOccupancy - previousOccupancy;

    const analyticsData: AnalyticsData = {
      revenueData,
      monthlyRevenue: currentRevenue,
      yearlyRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,

      occupancyData,
      currentOccupancyRate: currentOccupancy,
      occupancyTrend: Math.round(occupancyTrend * 100) / 100,

      requestAnalytics,
      totalRequests: requestStore.requests.length,
      pendingRequests: requestStore.requests.filter(
        (r) => r.status === "submitted" || r.status === "under_review"
      ).length,
      avgProcessingTime: 5.2,

      bookingAnalytics,
      monthlyBookings:
        bookingAnalytics[bookingAnalytics.length - 1]?.totalBookings || 0,
      bookingUtilization:
        bookingAnalytics[bookingAnalytics.length - 1]?.utilizationRate || 0,

      tenantRetentionRate: 95.2,
      avgContractLength: 24,

      maintenanceCost: 450000,
      customerSatisfaction: 4.2,
    };

    set({ data: analyticsData, isLoading: false });
  },

  setPeriod: (period) => {
    set({ selectedPeriod: period });
    get().generateReport();
  },

  exportReport: (format) => {
    const { data } = get();
    if (!data) return;

    if (format === "csv") {
      // CSV形式でのエクスポート（簡易版）
      const csvContent = [
        "月,売上,支出,利益",
        ...data.revenueData.map(
          (item) =>
            `${item.month},${item.revenue},${item.expenses},${item.profit}`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "pdf") {
      // PDF形式でのエクスポート（実際の実装では専用ライブラリを使用）
      alert("PDF エクスポート機能は開発中です");
    }
  },
}));
