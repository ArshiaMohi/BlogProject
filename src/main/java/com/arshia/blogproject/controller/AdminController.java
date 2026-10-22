package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.applicationUser.ApplicationUserResponseDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.dto.post.PostResponseDto;
import com.arshia.blogproject.service.ApplicationUserService;
import com.arshia.blogproject.service.CommentService;
import com.arshia.blogproject.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PutMapping("/comment/approve/{id}")
    public CommentResponseDto approve(@PathVariable int id) {
        return commentService.approve(id);
    }

    @PutMapping("/comment/unapprove/{id}")
    public CommentResponseDto unapprove(@PathVariable int id) {
        return commentService.unapprove(id);
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
