package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.category.CategoryCreateDto;
import com.arshia.blogproject.dto.category.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    CategoryResponseDto save(CategoryCreateDto categoryCreateDto);

    CategoryResponseDto findById(int id);

    List<CategoryResponseDto> findAll();

    void deleteById(int id);
}
