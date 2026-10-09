package com.arshia.blogproject.repository;

import com.arshia.blogproject.entity.Post;
import com.arshia.blogproject.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    List<Post> findByStatus(Status status);

    List<Post> findByTitleContainingIgnoreCaseAndStatus(String title, Status status);

    Optional<Post> findByIdAndStatus(int id, Status status);
}
