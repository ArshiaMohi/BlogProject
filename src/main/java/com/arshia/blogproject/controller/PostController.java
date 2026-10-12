package com.arshia.blogproject.controller;

import com.arshia.blogproject.dto.post.PostCreateDto;
import com.arshia.blogproject.dto.post.PostImageDto;
import com.arshia.blogproject.dto.post.PostResponseDto;
import com.arshia.blogproject.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public PostResponseDto save(
            @ModelAttribute PostCreateDto postCreateDto,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
            throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            postCreateDto.setImage(imageFile.getBytes());
            postCreateDto.setImageContentType(imageFile.getContentType());
            postCreateDto.setImageName(imageFile.getOriginalFilename());
        }

        return postService.save(postCreateDto);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable int id) {
        PostImageDto image = postService.findImageByPostId(id);

        MediaType contentType = MediaType.APPLICATION_OCTET_STREAM;

        if (image.getContentType() != null) {
            contentType = MediaType.parseMediaType(image.getContentType());
        }

        return ResponseEntity.ok()
                .contentType(contentType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + image.getImageName() + "\""
                )
                .body(image.getImage());
    }

    @GetMapping
    public List<PostResponseDto> findAll() {
        return postService.findAllPublished();
    }

    @GetMapping("/{id}")
    public PostResponseDto findById(@PathVariable int id) {
        return postService.findPublishedById(id);
    }

    @GetMapping("/search")
    public List<PostResponseDto> search(@RequestParam String title) {
        return postService.searchPublishedByTitle(title);
    }

    @PutMapping("/publish/{id}")
    public PostResponseDto publish(@PathVariable int id) {
        return postService.publish(id);
    }

    @PutMapping("/unpublish/{id}")
    public PostResponseDto unpublish(@PathVariable int id) {
        return postService.unpublish(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable int id) {
        postService.deleteById(id);
    }
}
