package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.category.CategoryCreateDto;
import com.arshia.blogproject.dto.category.CategoryResponseDto;
import com.arshia.blogproject.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public CategoryResponseDto create(@RequestBody CategoryCreateDto categoryCreateDto) {
        return categoryService.save(categoryCreateDto);
    }

    @GetMapping
    public List<CategoryResponseDto> findAll() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public CategoryResponseDto findById(@PathVariable int id) {
        return categoryService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        categoryService.deleteById(id);
    }
}
