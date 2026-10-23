package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.entity.CommentStatus;

import java.util.List;

public interface CommentService {

    CommentResponseDto save(
            CommentCreateDto commentCreateDto,
            String username
    );

    CommentResponseDto findById(int id);

    List<CommentResponseDto> findAll();

    List<CommentResponseDto> search(
            CommentStatus status,
            String query
    );

    List<CommentResponseDto> findApprovedByPostId(int postId);

    CommentResponseDto approve(int id);

    CommentResponseDto reject(int id);

    CommentResponseDto unapprove(int id);

    void deleteById(int id);
}

