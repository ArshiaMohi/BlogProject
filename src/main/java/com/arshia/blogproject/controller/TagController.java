package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.tag.TagCreateDto;
import com.arshia.blogproject.dto.tag.TagResponseDto;
import com.arshia.blogproject.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    public TagResponseDto create(@RequestBody TagCreateDto tagCreateDto) {
        return tagService.save(tagCreateDto);
    }

    @GetMapping
    public List<TagResponseDto> findAll() {
        return tagService.findAll();
    }

    @GetMapping("/{id}")
    public TagResponseDto findById(@PathVariable int id) {
        return tagService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        tagService.deleteById(id);
    }
}
