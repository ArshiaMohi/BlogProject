package com.arshia.blogproject.dto.post;

import com.arshia.blogproject.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateDto {

    private String title;

    private String slug;

    private String excerpt;

    private String content;

    private byte[] image;

    private Status status;

    private int authorId;

    private int categoryId;

    private List<Integer> tagIds;
}
