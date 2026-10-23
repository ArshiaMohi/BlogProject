package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.post.PostCreateDto;
import com.arshia.blogproject.dto.post.PostImageDto;
import com.arshia.blogproject.dto.post.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {

    PostResponseDto save(PostCreateDto postCreateDto);

    PostResponseDto update(int id, PostCreateDto postCreateDto);

    PostResponseDto findById(int id);

    PostResponseDto findPublishedById(int id);

    List<PostResponseDto> findAll();

    Page<PostResponseDto> findAllPublished(Pageable pageable);

    List<PostResponseDto> searchPublishedByTitle(String title);

    Page<PostResponseDto> findPublishedByTagId(
            int tagId, Pageable pageable);

    PostResponseDto publish(int id);

    PostResponseDto unpublish(int id);

    PostImageDto findImageByPostId(int id);

    PostResponseDto incrementViews(int id);

    void deleteById(int id);
}
