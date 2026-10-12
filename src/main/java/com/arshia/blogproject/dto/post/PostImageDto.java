package com.arshia.blogproject.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostImageDto {

    private byte[] image;

    private String contentType;

    private String imageName;
}