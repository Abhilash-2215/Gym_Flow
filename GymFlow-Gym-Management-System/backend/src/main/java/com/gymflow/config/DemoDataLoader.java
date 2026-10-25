package com.gymflow.config;

import com.gymflow.model.GymMember;
import com.gymflow.model.MembershipPlan;
import com.gymflow.repository.GymMemberRepository;
import com.gymflow.repository.MembershipPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DemoDataLoader {
    @Bean
    CommandLineRunner loadDemoData(MembershipPlanRepository planRepository, GymMemberRepository memberRepository) {
        return args -> {
            if (planRepository.count() == 0) {
                planRepository.save(new MembershipPlan("Monthly", "Full gym access for one month", new BigDecimal("1200.00"), 30));
                planRepository.save(new MembershipPlan("Quarterly", "Three months of gym access", new BigDecimal("3200.00"), 90));
                planRepository.save(new MembershipPlan("Annual", "Best value for twelve months", new BigDecimal("11000.00"), 365));
            }

            if (memberRepository.count() == 0) {
                var plans = planRepository.findAll();
                if (!plans.isEmpty()) {
                    LocalDate today = LocalDate.now();
                    GymMember first = new GymMember();
                    first.setFullName("Arjun Kumar");
                    first.setEmail("arjun@example.com");
                    first.setPhone("9876543210");
                    first.setJoinDate(today.minusDays(18));
                    first.setExpiryDate(today.plusDays(12));
                    first.setPlan(plans.get(0));
                    first.setStatus("ACTIVE");
                    memberRepository.save(first);

                    GymMember second = new GymMember();
                    second.setFullName("Priya Reddy");
                    second.setEmail("priya@example.com");
                    second.setPhone("9123456780");
                    second.setJoinDate(today.minusDays(50));
                    second.setExpiryDate(today.minusDays(2));
                    second.setPlan(plans.get(1 % plans.size()));
                    second.setStatus("EXPIRED");
                    memberRepository.save(second);
                }
            }
        };
    }
}
