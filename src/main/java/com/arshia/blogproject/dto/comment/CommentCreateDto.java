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

    private int name;

    private String email;

    private String content;

    private int postId;
}
