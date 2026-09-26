package com.thegrind.backend.controller;

import com.thegrind.backend.model.Habit;
import com.thegrind.backend.repository.HabitRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "*")
public class HabitController {

    private final HabitRepository habitRepository;

    public HabitController(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }


    // =========================
    // GET HABITS
    // =========================

    @GetMapping("/{userId}")
    public List<Habit> getHabits(@PathVariable Integer userId) {

        if (!habitRepository.hasHabits(userId)) {
            habitRepository.createDefaultHabits(userId);
        }

        return habitRepository.getHabits(userId);
    }


    // =========================
    // COMPLETE HABIT
    // =========================

    @PostMapping("/{habitId}/complete")
    public String completeHabit(
            @PathVariable Integer habitId) {

        habitRepository.completeHabit(habitId);

        return "Habit completed";
    }


    // =========================
    // UNCOMPLETE HABIT
    // =========================

    @DeleteMapping("/{habitId}/complete")
    public String uncompleteHabit(
            @PathVariable Integer habitId) {

        habitRepository.uncompleteHabit(habitId);

        return "Habit marked pending";
    }


    // =========================
    // COMPLETED TODAY
    // =========================

    @GetMapping("/progress/{userId}")
    public int completedToday(
            @PathVariable Integer userId) {

        return habitRepository.getCompletedToday(userId);
    }


    // =========================
    // TOTAL COMPLETIONS
    // =========================

    @GetMapping("/progress/{userId}/total")
    public int totalCompletions(
            @PathVariable Integer userId) {

        return habitRepository.getTotalCompletions(userId);
    }
    // =========================
    // CURRENT STREAK
    // =========================

    @GetMapping("/progress/{userId}/streak")
    public int currentStreak(
            @PathVariable Integer userId) {

        return habitRepository.getCurrentStreak(userId);
    }
    @GetMapping("/history/{userId}")
    public List<Map<String, Object>> getHistory(
        @PathVariable Integer userId) {

    return habitRepository.getHistory(userId);
}

@PostMapping("/add")
public String addHabit(@RequestBody Habit habit) {

    habitRepository.addHabit(
            habit.getUserId(),
            habit.getName(),
            habit.getDescription(),
            habit.getIcon()
    );

    return "Habit added successfully";
}

@DeleteMapping("/{habitId}")
public String deleteHabit(@PathVariable Integer habitId) {

    habitRepository.deleteHabit(habitId);

    return "Habit deleted successfully";
}
}