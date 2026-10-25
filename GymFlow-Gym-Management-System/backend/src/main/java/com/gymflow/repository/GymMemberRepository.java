package com.gymflow.repository;

import com.gymflow.model.GymMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GymMemberRepository extends JpaRepository<GymMember, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    List<GymMember> findAllByOrderByJoinDateDesc();
}
