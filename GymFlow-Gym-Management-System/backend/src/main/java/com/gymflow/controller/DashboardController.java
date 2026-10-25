package com.gymflow.controller;

import com.gymflow.dto.DashboardSummary;
import com.gymflow.model.GymMember;
import com.gymflow.repository.GymMemberRepository;
import com.gymflow.repository.MembershipPlanRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final GymMemberRepository memberRepository;
    private final MembershipPlanRepository planRepository;

    public DashboardController(GymMemberRepository memberRepository, MembershipPlanRepository planRepository) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
    }

    @GetMapping
    public DashboardSummary getSummary() {
        var members = memberRepository.findAll();
        long active = members.stream()
                .filter(member -> !member.getExpiryDate().isBefore(LocalDate.now()))
                .filter(member -> !"SUSPENDED".equalsIgnoreCase(member.getStatus()))
                .count();
        long expired = members.size() - active;
        BigDecimal revenue = members.stream()
                .filter(member -> !member.getExpiryDate().isBefore(LocalDate.now()))
                .filter(member -> !"SUSPENDED".equalsIgnoreCase(member.getStatus()))
                .map(GymMember::getPlan)
                .filter(plan -> plan != null && plan.getPrice() != null)
                .map(plan -> plan.getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardSummary(
                members.size(),
                active,
                expired,
                planRepository.count(),
                revenue
        );
    }
}
