package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.post.PostCreateDto;
import com.arshia.blogproject.dto.post.PostResponseDto;

import java.util.List;

public interface PostService {

    PostResponseDto save(PostCreateDto postCreateDto);

    PostResponseDto findById(int id);

    PostResponseDto findPublishedById(int id);

    List<PostResponseDto> findAll();

    List<PostResponseDto> findAllPublished();

    List<PostResponseDto> searchPublishedByTitle(String title);

    PostResponseDto publish(int id);

    PostResponseDto unpublish(int id);

    PostResponseDto incrementViews(int id);

    void deleteById(int id);
}
