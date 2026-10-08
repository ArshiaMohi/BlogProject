package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.post.PostCreateDto;
import com.arshia.blogproject.dto.post.PostResponseDto;

import java.util.List;

public interface PostService {

    PostResponseDto save(PostCreateDto postCreateDto);

    PostResponseDto findById(int id);

    List<PostResponseDto> findAll();

    void deleteById(int id);
}
