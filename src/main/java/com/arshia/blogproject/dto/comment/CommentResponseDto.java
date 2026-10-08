package com.arshia.blogproject.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponseDto {

    private int id;

    private String name;

    private String content;

    private Boolean approved;

    private int postId;
    private String postName;

    private LocalDateTime createdAt;
}
