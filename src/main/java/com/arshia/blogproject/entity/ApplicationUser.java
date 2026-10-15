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
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor()
@SQLDelete(sql = "UPDATE application_user SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class ApplicationUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Username can not be null")
    private String username;

    @NotBlank(message = "Email can not be null")
    private String email;

    @NotBlank(message = "Password can not be null")
    private String password;

    @NotBlank(message = "FullName can not be null")
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Boolean active = true;

    private Boolean deleted = false;

    @OneToMany(mappedBy = "author")
    private List<Post> posts;
}
