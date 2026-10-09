package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;

import java.util.List;

public interface CommentService {

    CommentResponseDto save(CommentCreateDto commentCreateDto);

    CommentResponseDto findById(int id);

    List<CommentResponseDto> findAll();

    List<CommentResponseDto> findApprovedByPostId(int postId);

    CommentResponseDto approve(int id);

    CommentResponseDto unapprove(int id);

    void deleteById(int id);
}
