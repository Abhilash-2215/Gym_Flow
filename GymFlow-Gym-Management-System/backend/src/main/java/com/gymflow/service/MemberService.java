package com.gymflow.service;

import com.gymflow.exception.ResourceNotFoundException;
import com.gymflow.model.GymMember;
import com.gymflow.model.MembershipPlan;
import com.gymflow.repository.GymMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class MemberService {
    private final GymMemberRepository memberRepository;
    private final PlanService planService;

    public MemberService(GymMemberRepository memberRepository, PlanService planService) {
        this.memberRepository = memberRepository;
        this.planService = planService;
    }

    @Transactional(readOnly = true)
    public List<GymMember> findAll() {
        return memberRepository.findAllByOrderByJoinDateDesc();
    }

    @Transactional(readOnly = true)
    public GymMember findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym member not found: " + id));
    }

    public GymMember create(GymMember member, Long planId) {
        if (memberRepository.existsByEmailIgnoreCase(member.getEmail().trim())) {
            throw new IllegalArgumentException("A member with this email already exists.");
        }
        applyValues(member, member, planId);
        return memberRepository.save(member);
    }

    public GymMember update(Long id, GymMember updatedMember, Long planId) {
        GymMember existing = findById(id);
        if (memberRepository.existsByEmailIgnoreCaseAndIdNot(updatedMember.getEmail().trim(), id)) {
            throw new IllegalArgumentException("A member with this email already exists.");
        }
        applyValues(updatedMember, existing, planId);
        return memberRepository.save(existing);
    }

    public void delete(Long id) {
        memberRepository.delete(findById(id));
    }

    private void applyValues(GymMember source, GymMember target, Long planId) {
        MembershipPlan plan = planService.findById(planId);
        if (source.getExpiryDate().isBefore(source.getJoinDate())) {
            throw new IllegalArgumentException("Expiry date cannot be earlier than join date.");
        }
        target.setFullName(source.getFullName().trim());
        target.setEmail(source.getEmail().trim().toLowerCase());
        target.setPhone(source.getPhone().trim());
        target.setJoinDate(source.getJoinDate());
        target.setExpiryDate(source.getExpiryDate());
        target.setPlan(plan);
        target.setStatus(source.getExpiryDate().isBefore(LocalDate.now()) ? "EXPIRED" : "ACTIVE");
    }
}
