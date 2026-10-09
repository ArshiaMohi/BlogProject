package com.arshia.blogproject.repository;

import com.arshia.blogproject.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByApprovedTrue();

    List<Comment> findByPost_IdAndApprovedTrue(int postId);
}
