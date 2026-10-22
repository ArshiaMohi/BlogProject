package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.tag.TagCreateDto;
import com.arshia.blogproject.dto.tag.TagResponseDto;
import com.arshia.blogproject.entity.Tag;
import com.arshia.blogproject.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    private Tag convertCreateToTag(TagCreateDto tagCreateDto) {
        Tag tag = new Tag();

        tag.setName(tagCreateDto.getName());
        tag.setSlug(tagCreateDto.getSlug());

        return tag;
    }

    private TagResponseDto convertTagToResponse(Tag tag) {

        TagResponseDto dto = new TagResponseDto();

        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setSlug(tag.getSlug());

        return dto;
    }

    @Override
    public TagResponseDto save(TagCreateDto tagCreateDto) {
        Tag tag = convertCreateToTag(tagCreateDto);
        Tag saved = tagRepository.save(tag);
        return convertTagToResponse(saved);
    }

    @Override
    public TagResponseDto update(int id, TagCreateDto tagCreateDto) {
        Tag tag = convertCreateToTag(tagCreateDto);
        tag.setId(id);
        Tag saved = tagRepository.save(tag);
        return convertTagToResponse(saved);
    }

    @Override
    public TagResponseDto findById(int id) {
        Tag tag = tagRepository.findById(id).orElseThrow();
        return convertTagToResponse(tag);
    }

    @Override
    public List<TagResponseDto> findAll() {
        return tagRepository.findAll()
                .stream()
                .map(this::convertTagToResponse)
                .toList();
    }

    @Override
    public void deleteById(int id) {
        tagRepository.deleteById(id);
    }
}
