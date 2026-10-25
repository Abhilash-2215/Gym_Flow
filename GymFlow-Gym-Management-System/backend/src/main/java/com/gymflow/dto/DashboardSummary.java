package com.gymflow.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        long totalMembers,
        long activeMembers,
        long expiredMembers,
        long totalPlans,
        BigDecimal estimatedMonthlyRevenue
) {
}
