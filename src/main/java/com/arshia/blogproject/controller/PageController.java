
package com.arshia.blogproject.controller;

import com.arshia.blogproject.service.CategoryService;
import com.arshia.blogproject.service.PostService;
import com.arshia.blogproject.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class PageController {

    private final PostService postService;
    private final CategoryService categoryService;
    private final TagService tagService;

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
}


