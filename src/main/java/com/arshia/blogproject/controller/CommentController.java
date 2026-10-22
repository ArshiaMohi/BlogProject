package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public CommentResponseDto save(@RequestBody CommentCreateDto commentCreateDto) {
        return commentService.save(commentCreateDto);
    }

    @GetMapping
    public List<CommentResponseDto> findAll() {
        return commentService.findAll();
    }

    @GetMapping("/{id}")
    public CommentResponseDto findById(@PathVariable int id) {
        return commentService.findById(id);
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponseDto> findApprovedByPostId(@PathVariable int postId) {
        return commentService.findApprovedByPostId(postId);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable int id) {
        commentService.deleteById(id);
    }
}
