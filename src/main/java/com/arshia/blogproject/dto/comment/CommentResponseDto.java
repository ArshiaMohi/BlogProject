package com.arshia.blogproject.dto.comment;

import com.arshia.blogproject.entity.CommentStatus;
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

    private CommentStatus status;

    private int userId;

    private String username;

    private int postId;

    private String postTitle;

    private LocalDateTime createdAt;
}


