package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.category.CategoryCreateDto;
import com.arshia.blogproject.dto.category.CategoryResponseDto;
import com.arshia.blogproject.entity.Category;
import com.arshia.blogproject.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private Category convertCreateToCategory(CategoryCreateDto categoryCreateDto) {

        Category category = new Category();

        category.setName(categoryCreateDto.getName());
        category.setDescription(categoryCreateDto.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return savedCategory;
    }

    private CategoryResponseDto convertCategoryToResponse(Category category) {

        CategoryResponseDto dto = new CategoryResponseDto();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());

        return dto;
    }

    @Override
    public CategoryResponseDto save(CategoryCreateDto categoryCreateDto) {
        Category category = convertCreateToCategory(categoryCreateDto);
        return convertCategoryToResponse(category);
    }

    @Override
    public CategoryResponseDto findById(int id) {
        Category category = categoryRepository.findById(id).orElseThrow();
        return convertCategoryToResponse(category);
    }

    @Override
    public List<CategoryResponseDto> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertCategoryToResponse)
                .toList();
    }

    @Override
    public void deleteById(int id) {
        categoryRepository.deleteById(id);
    }
}
