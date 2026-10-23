package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public CommentResponseDto save(
            @Valid @RequestBody CommentCreateDto dto,
            Authentication authentication
    ) {
        return commentService.save(dto, authentication.getName());
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponseDto> findApprovedByPostId(
            @PathVariable int postId
    ) {
        return commentService.findApprovedByPostId(postId);
    }
}


