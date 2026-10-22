
package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.post.PostResponseDto;
import com.arshia.blogproject.entity.ApplicationUser;
import com.arshia.blogproject.repository.ApplicationUserRepository;
import com.arshia.blogproject.service.CategoryService;
import com.arshia.blogproject.service.CommentService;
import com.arshia.blogproject.service.PostService;
import com.arshia.blogproject.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class PageController {

    private final PostService postService;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final CommentService commentService;
    private final ApplicationUserRepository applicationUserRepository;

    @GetMapping("/")
    public String index() {
        return "redirect:/register";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/home")
    public String homePage(
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        var postsPage = postService.findAllPublished(
                org.springframework.data.domain.PageRequest.of(
                        Math.max(page, 0), 8
                )
        );

        model.addAttribute("posts", postsPage.getContent());
        model.addAttribute("currentPage", postsPage.getNumber());
        model.addAttribute("totalPages", postsPage.getTotalPages());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("tags", tagService.findAll());

        return "home";
    }

    @GetMapping("/post/{id}")
    public String postDetail(@PathVariable int id, Model model) {
        PostResponseDto post = postService.findPublishedById(id);

        model.addAttribute("post", post);
        model.addAttribute(
                "comments",
                commentService.findApprovedByPostId(id)
        );
        return "post";
    }

    @GetMapping("/create-post")
    public String createPostPage(
            Authentication authentication,
            Model model) {

        ApplicationUser user = applicationUserRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "کاربر واردشده در سیستم پیدا نشد."
                        ));

        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("tags", tagService.findAll());
        model.addAttribute("authorId", user.getId());

        return "create-post";
    }

    @GetMapping("/admin/content")
    public String contentManagement(Model model) {
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("tags", tagService.findAll());

        return "admin/content-management";
    }

    @GetMapping("/admin/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/admin/posts")
    public String managePosts(Model model) {
        model.addAttribute("posts", postService.findAll());
        return "admin/post-management";
    }
}


