package com.arshia.blogproject.dto.post;

import com.arshia.blogproject.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostResponseDto {

    private int id;

    private String title;

    private String slug;

    private String excerpt;

    private String content;

    private byte[] image;

    private Status status;

    private Integer views;

    private int authorId;
    private String authorName;

    private int categoryId;
    private String categoryName;

    private List<Integer> tagIds;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
