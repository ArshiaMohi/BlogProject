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
@SQLDelete(sql = "UPDATE tag SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private Boolean deleted = false;

    @ManyToMany(mappedBy = "tags")
    private List<Post> posts;
}
