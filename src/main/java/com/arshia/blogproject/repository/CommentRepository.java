package com.arshia.blogproject.repository;

import com.arshia.blogproject.entity.Comment;
import com.arshia.blogproject.entity.CommentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByStatus(CommentStatus status);

    List<Comment> findByPost_IdAndStatus(
            int postId,
            CommentStatus status
    );
}

