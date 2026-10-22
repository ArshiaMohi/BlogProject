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
        category.setSlug(categoryCreateDto.getSlug());

        return category;
    }

    private CategoryResponseDto convertCategoryToResponse(Category category) {

        CategoryResponseDto dto = new CategoryResponseDto();

        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setSlug(category.getSlug());

        return dto;
    }

    @Override
    public CategoryResponseDto save(CategoryCreateDto categoryCreateDto) {
        Category category = convertCreateToCategory(categoryCreateDto);
        Category saved = categoryRepository.save(category);
        return convertCategoryToResponse(saved);
    }

    @Override
    public CategoryResponseDto update(int id, CategoryCreateDto categoryCreateDto) {
        Category category = convertCreateToCategory(categoryCreateDto);
        category.setId(id);
        Category saved = categoryRepository.save(category);
        return convertCategoryToResponse(saved);
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
