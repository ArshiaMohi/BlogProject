package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.applicationUser.ApplicationUserRegisterDto;
import com.arshia.blogproject.dto.applicationUser.ApplicationUserResponseDto;
import com.arshia.blogproject.service.ApplicationUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class ApplicationUserController {

    private final ApplicationUserService applicationUserService;

    @PostMapping
    public ApplicationUserResponseDto register(@RequestBody ApplicationUserRegisterDto applicationUserRegisterDto) {
        return applicationUserService.save(applicationUserRegisterDto);
    }

    @GetMapping
    public List<ApplicationUserResponseDto> findAll() {
        return applicationUserService.findAll();
    }

    @GetMapping("/{id}")
    public ApplicationUserResponseDto findById(@PathVariable int id) {
        return applicationUserService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable int id) {
        applicationUserService.deleteById(id);
    }
}
