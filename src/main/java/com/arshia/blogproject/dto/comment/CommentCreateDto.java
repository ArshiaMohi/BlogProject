package com.arshia.blogproject.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentCreateDto {

    private String name;

    private String email;

    private String content;

    private int postId;
}
