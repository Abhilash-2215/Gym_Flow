package com.gymflow.service;

import com.gymflow.exception.ResourceNotFoundException;
import com.gymflow.model.MembershipPlan;
import com.gymflow.repository.MembershipPlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlanService {
    private final MembershipPlanRepository planRepository;

    public PlanService(MembershipPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Transactional(readOnly = true)
    public List<MembershipPlan> findAll() {
        return planRepository.findAll();
    }

    public MembershipPlan create(MembershipPlan plan) {
        if (planRepository.existsByNameIgnoreCase(plan.getName().trim())) {
            throw new IllegalArgumentException("A plan with this name already exists.");
        }
        plan.setName(plan.getName().trim());
        return planRepository.save(plan);
    }

    public MembershipPlan update(Long id, MembershipPlan updatedPlan) {
        MembershipPlan existing = findById(id);
        if (planRepository.existsByNameIgnoreCaseAndIdNot(updatedPlan.getName().trim(), id)) {
            throw new IllegalArgumentException("A plan with this name already exists.");
        }
        existing.setName(updatedPlan.getName().trim());
        existing.setDescription(updatedPlan.getDescription().trim());
        existing.setPrice(updatedPlan.getPrice());
        existing.setDurationDays(updatedPlan.getDurationDays());
        return planRepository.save(existing);
    }

    public void delete(Long id) {
        planRepository.delete(findById(id));
    }

    public MembershipPlan findById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found: " + id));
    }
}
