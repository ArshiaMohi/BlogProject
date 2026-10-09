package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;

import java.util.List;

public interface CommentService {

    CommentResponseDto save(CommentCreateDto commentCreateDto);

    CommentResponseDto findById(int id);

    List<CommentResponseDto> findAll();

    void deleteById(int id);
}
