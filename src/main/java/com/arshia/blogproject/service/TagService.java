package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.tag.TagCreateDto;
import com.arshia.blogproject.dto.tag.TagResponseDto;

import java.util.List;

public interface TagService {

    TagResponseDto save(TagCreateDto tagCreateDto);

    TagResponseDto findById(int id);

    List<TagResponseDto> findAll();

    void deleteById(int id);
}
