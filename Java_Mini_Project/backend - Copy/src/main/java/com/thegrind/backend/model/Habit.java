package com.thegrind.backend.model;

public class Habit {

    private Integer id;
    private Integer userId;
    private String name;
    private String description;
    private String icon;
    private Boolean completed;

    public Habit() {
    }

    public Habit(Integer id, Integer userId, String name,
                 String description, String icon, Boolean completed) {

        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.completed = completed;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean isCompleted() {
    return completed;
     }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}