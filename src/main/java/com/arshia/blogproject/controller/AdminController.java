package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.applicationUser.ApplicationUserResponseDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.dto.post.PostResponseDto;
import com.arshia.blogproject.entity.CommentStatus;
import com.arshia.blogproject.service.ApplicationUserService;
import com.arshia.blogproject.service.CommentService;
import com.arshia.blogproject.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ApplicationUserService applicationUserService;
    private final CommentService commentService;
    private final PostService postService;

    @PutMapping("/user/active/{id}")
    public ApplicationUserResponseDto active(@PathVariable int id) {
        return applicationUserService.active(id);
    }

    @PutMapping("/user/deactivate/{id}")
    public ApplicationUserResponseDto deactivate(@PathVariable int id) {
        return applicationUserService.deactivate(id);
    }

    @GetMapping("/comments/search")
    public List<CommentResponseDto> searchComments(
            @RequestParam(required = false) CommentStatus status,
            @RequestParam(required = false) String q
    ) {
        return commentService.search(status, q);
    }

    @PutMapping("/comment/approve/{id}")
    public CommentResponseDto approve(@PathVariable int id) {
        return commentService.approve(id);
    }

    @PutMapping({
            "/comment/reject/{id}",
            "/comment/unapprove/{id}"
    })
    public CommentResponseDto reject(@PathVariable int id) {
        return commentService.reject(id);
    }

    @DeleteMapping("/comment/{id}")
    public void deleteComment(@PathVariable int id) {
        commentService.deleteById(id);
    }

    @PutMapping("/post/publish/{id}")
    public PostResponseDto publish(@PathVariable int id) {
        return postService.publish(id);
    }

    @PutMapping("/post/unpublish/{id}")
    public PostResponseDto unpublish(@PathVariable int id) {
        return postService.unpublish(id);
    }
}

