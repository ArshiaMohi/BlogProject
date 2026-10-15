package com.arshia.blogproject.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE comment SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Name can not be null")
    private String name;

    @NotBlank(message = "Email can not be null")
    private String email;

    @NotBlank(message = "Content can not be null")
    private String content;

    private Boolean approved = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Boolean deleted = false;

    @ManyToOne
    private Post post;
}
