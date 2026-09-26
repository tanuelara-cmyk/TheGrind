package com.thegrind.backend.repository;

import com.thegrind.backend.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int saveUser(User user) {
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        return jdbcTemplate.update(
                sql,
                user.getName(),
                user.getEmail(),
                user.getPassword()
        );
    }
    public User findUserByEmail(String email) {

        String sql = "SELECT * FROM users WHERE email = ?";

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {
                    User user = new User();

                    user.setId(rs.getInt("id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));

                    return user;
                },
                email
        );
    }
    
}