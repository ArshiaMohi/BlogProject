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
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE post SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String title;

    private String slug;

    private String excerpt;

    private String content;

    private byte[] image;

    @Enumerated(EnumType.STRING)
    private Status status = Status.DRAFT;

    private Integer views = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Boolean deleted = false;

    @ManyToOne
    private ApplicationUser author;

    @ManyToOne
    private Category category;

    @ManyToMany
    private List<Tag> tags;

    @OneToMany(mappedBy = "post")
    private List<Comment> comments;
}
