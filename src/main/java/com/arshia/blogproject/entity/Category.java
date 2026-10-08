package com.arshia.blogproject.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE category SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String description;

    private Boolean deleted = false;

    @OneToMany(mappedBy = "category")
    private List<Post> posts;
}
