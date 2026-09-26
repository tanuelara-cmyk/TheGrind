package com.thegrind.backend.repository;

import com.thegrind.backend.model.Habit;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HabitRepository {

    private final JdbcTemplate jdbcTemplate;

    public HabitRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    // =========================
    // CREATE DEFAULT HABITS
    // =========================

    public void createDefaultHabits(Integer userId) {

        String sql = """
                INSERT INTO habits
                (user_id, name, description, icon)
                VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                userId,
                "Drink 2L Water",
                "Stay hydrated throughout the day.",
                "💧"
        );

        jdbcTemplate.update(
                sql,
                userId,
                "30-min Workout",
                "Move your body and stay active.",
                "🏃"
        );

        jdbcTemplate.update(
                sql,
                userId,
                "Read 10 Pages",
                "Learn something new every day.",
                "📖"
        );

        jdbcTemplate.update(
                sql,
                userId,
                "Meditate 10 Mins",
                "Give your mind a moment to slow down.",
                "🧘"
        );
    }


    // =========================
    // CHECK IF USER HAS HABITS
    // =========================

    public boolean hasHabits(Integer userId) {

        String sql =
                "SELECT COUNT(*) FROM habits WHERE user_id = ?";

        Integer count =
                jdbcTemplate.queryForObject(
                        sql,
                        Integer.class,
                        userId
                );

        return count != null && count > 0;
    }


    // =========================
    // GET USER HABITS
    // =========================

    public List<Habit> getHabits(Integer userId) {

        String sql = """
                SELECT
                    h.id,
                    h.user_id,
                    h.name,
                    h.description,
                    h.icon,
                    CASE
                        WHEN hc.id IS NOT NULL THEN TRUE
                        ELSE FALSE
                    END AS completed
                FROM habits h
                LEFT JOIN habit_completions hc
                    ON h.id = hc.habit_id
                    AND hc.completion_date = CURDATE()
                WHERE h.user_id = ?
                ORDER BY h.id
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {

                    Habit habit = new Habit();

                    habit.setId(rs.getInt("id"));
                    habit.setUserId(rs.getInt("user_id"));
                    habit.setName(rs.getString("name"));
                    habit.setDescription(
                            rs.getString("description")
                    );
                    habit.setIcon(rs.getString("icon"));
                    habit.setCompleted(
                            rs.getBoolean("completed")
                    );

                    return habit;
                },
                userId
        );
    }


    // =========================
    // COMPLETE HABIT
    // =========================

    public void completeHabit(Integer habitId) {

        String sql = """
                INSERT IGNORE INTO habit_completions
                (habit_id, completion_date)
                VALUES (?, CURDATE())
                """;

        jdbcTemplate.update(sql, habitId);
    }


    // =========================
    // UNCOMPLETE HABIT
    // =========================

    public void uncompleteHabit(Integer habitId) {

        String sql = """
                DELETE FROM habit_completions
                WHERE habit_id = ?
                AND completion_date = CURDATE()
                """;

        jdbcTemplate.update(sql, habitId);
    }


    // =========================
    // COMPLETED TODAY
    // =========================

    public int getCompletedToday(Integer userId) {

        String sql = """
                SELECT COUNT(*)
                FROM habit_completions hc
                JOIN habits h
                    ON hc.habit_id = h.id
                WHERE h.user_id = ?
                AND hc.completion_date = CURDATE()
                """;

        Integer count =
                jdbcTemplate.queryForObject(
                        sql,
                        Integer.class,
                        userId
                );

        return count == null ? 0 : count;
    }


    // =========================
    // TOTAL COMPLETIONS
    // =========================

    public int getTotalCompletions(Integer userId) {

        String sql = """
                SELECT COUNT(*)
                FROM habit_completions hc
                JOIN habits h
                    ON hc.habit_id = h.id
                WHERE h.user_id = ?
                """;

        Integer count =
                jdbcTemplate.queryForObject(
                        sql,
                        Integer.class,
                        userId
                );

        return count == null ? 0 : count;
    }


    // =========================
    // CURRENT STREAK
    // =========================

    public int getCurrentStreak(Integer userId) {

        String sql = """
                SELECT DISTINCT hc.completion_date
                FROM habit_completions hc
                JOIN habits h
                    ON hc.habit_id = h.id
                WHERE h.user_id = ?
                ORDER BY hc.completion_date DESC
                """;

        List<java.sql.Date> dates =
                jdbcTemplate.query(
                        sql,
                        (rs, rowNum) ->
                                rs.getDate("completion_date"),
                        userId
                );

        if (dates.isEmpty()) {
            return 0;
        }

        java.time.LocalDate today =
                java.time.LocalDate.now();

        java.time.LocalDate latestDate =
                dates.get(0).toLocalDate();

        /*
         * The latest completion must be
         * today or yesterday.
         */

        if (!latestDate.equals(today)
                && !latestDate.equals(today.minusDays(1))) {

            return 0;
        }

        int streak = 0;

        java.time.LocalDate expectedDate =
                latestDate;

        for (java.sql.Date date : dates) {

            java.time.LocalDate completionDate =
                    date.toLocalDate();

            if (completionDate.equals(expectedDate)) {

                streak++;

                expectedDate =
                        expectedDate.minusDays(1);

            } else {

                break;
            }
        }

        return streak;
    }
public List<java.util.Map<String, Object>> getHistory(Integer userId) {

    String sql = """
            SELECT
                hc.completion_date,
                h.name,
                h.icon
            FROM habit_completions hc
            JOIN habits h
                ON hc.habit_id = h.id
            WHERE h.user_id = ?
            ORDER BY hc.completion_date DESC, h.id
            """;

    return jdbcTemplate.queryForList(sql, userId);
}

public void addHabit(
        Integer userId,
        String name,
        String description,
        String icon) {

    String sql = """
            INSERT INTO habits
            (user_id, name, description, icon)
            VALUES (?, ?, ?, ?)
            """;

    jdbcTemplate.update(
            sql,
            userId,
            name,
            description,
            icon
    );
}

public void deleteHabit(Integer habitId) {

    // First delete completion records
    String deleteCompletions = """
            DELETE FROM habit_completions
            WHERE habit_id = ?
            """;

    jdbcTemplate.update(
            deleteCompletions,
            habitId
    );


    // Then delete the habit
    String deleteHabit = """
            DELETE FROM habits
            WHERE id = ?
            """;

    jdbcTemplate.update(
            deleteHabit,
            habitId
    );
}
}