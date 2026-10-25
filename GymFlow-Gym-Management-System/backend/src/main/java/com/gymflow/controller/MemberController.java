package com.gymflow.controller;

import com.gymflow.model.GymMember;
import com.gymflow.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public List<GymMember> getMembers() {
        return memberService.findAll();
    }

    @GetMapping("/{id}")
    public GymMember getMember(@PathVariable Long id) {
        return memberService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GymMember createMember(@Valid @RequestBody MemberRequest request) {
        return memberService.create(request.toMember(), request.planId());
    }

    @PutMapping("/{id}")
    public GymMember updateMember(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return memberService.update(id, request.toMember(), request.planId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberService.delete(id);
    }

    public record MemberRequest(
            @jakarta.validation.constraints.NotBlank(message = "Full name is required") String fullName,
            @jakarta.validation.constraints.NotBlank(message = "Email is required")
            @jakarta.validation.constraints.Email(message = "Enter a valid email address") String email,
            @jakarta.validation.constraints.NotBlank(message = "Phone number is required") String phone,
            @jakarta.validation.constraints.NotNull(message = "Join date is required") java.time.LocalDate joinDate,
            @jakarta.validation.constraints.NotNull(message = "Expiry date is required") java.time.LocalDate expiryDate,
            @jakarta.validation.constraints.NotNull(message = "Membership plan is required") Long planId
    ) {
        public GymMember toMember() {
            GymMember member = new GymMember();
            member.setFullName(fullName);
            member.setEmail(email);
            member.setPhone(phone);
            member.setJoinDate(joinDate);
            member.setExpiryDate(expiryDate);
            return member;
        }
    }
}
