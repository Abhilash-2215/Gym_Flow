package com.gymflow.controller;

import com.gymflow.model.MembershipPlan;
import com.gymflow.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<MembershipPlan> getPlans() {
        return planService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MembershipPlan createPlan(@Valid @RequestBody MembershipPlan plan) {
        return planService.create(plan);
    }

    @PutMapping("/{id}")
    public MembershipPlan updatePlan(@PathVariable Long id, @Valid @RequestBody MembershipPlan plan) {
        return planService.update(id, plan);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long id) {
        planService.delete(id);
    }
}
