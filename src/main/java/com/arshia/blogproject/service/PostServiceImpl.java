package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.dto.post.PostCreateDto;
import com.arshia.blogproject.dto.post.PostResponseDto;
import com.arshia.blogproject.entity.*;
import com.arshia.blogproject.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ApplicationUserRepository applicationUserRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;

    private CommentResponseDto convertCommentToResponse(Comment comment) {

        CommentResponseDto dto = new CommentResponseDto();

        dto.setId(comment.getId());
        dto.setName(comment.getName());
        dto.setContent(comment.getContent());
        dto.setApproved(comment.getApproved());
        dto.setPostId(comment.getPost().getId());
        dto.setPostTitle(comment.getPost().getTitle());
        dto.setCreatedAt(comment.getCreatedAt());

        return dto;
    }

    private Post convertCreateToPost(PostCreateDto postCreateDto) {

        Post post = new Post();

        post.setTitle(postCreateDto.getTitle());
        post.setSlug(postCreateDto.getSlug());
        post.setExcerpt(postCreateDto.getExcerpt());
        post.setContent(postCreateDto.getContent());
        post.setImage(postCreateDto.getImage());
        post.setStatus(postCreateDto.getStatus());

        ApplicationUser author = applicationUserRepository
                .findById(postCreateDto.getAuthorId()).orElseThrow();

        Category category = categoryRepository.findById(postCreateDto.getCategoryId())
                .orElseThrow();

        List<Tag> tags = postCreateDto.getTagIds() == null
                ? List.of()
                : tagRepository.findAllById(postCreateDto.getTagIds());

        post.setAuthor(author);
        post.setCategory(category);
        post.setTags(tags);

        Post saved = postRepository.save(post);
        return saved;
    }

    private PostResponseDto convertPostToResponse(Post post) {

        PostResponseDto dto = new PostResponseDto();

        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSlug(post.getSlug());
        dto.setExcerpt(post.getExcerpt());
        dto.setContent(post.getContent());
        dto.setImage(post.getImage());
        dto.setStatus(post.getStatus());
        dto.setViews(post.getViews());

        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getFullName());

        dto.setCategoryId(post.getCategory().getId());
        dto.setCategoryName(post.getCategory().getName());

        List<CommentResponseDto> comments =
                commentRepository.findByPost_IdAndApprovedTrue(post.getId())
                                .stream()
                                        .map(this::convertCommentToResponse)
                                                .toList();
        dto.setComments(comments);

        dto.setTagIds(
                post.getTags()
                        .stream()
                        .map(Tag::getId)
                        .toList()
        );

        dto.setTagNames(
                post.getTags()
                        .stream()
                        .map(Tag::getName)
                        .toList()
        );



        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        return dto;
    }

    @Override
    public PostResponseDto save(PostCreateDto postCreateDto) {
        Post post = convertCreateToPost(postCreateDto);
        return convertPostToResponse(post);
    }

    @Override
    public PostResponseDto findById(int id) {
        Post post = postRepository.findById(id).orElseThrow();
        return convertPostToResponse(post);
    }

    @Override
    public PostResponseDto findPublishedById(int id) {
        Post post = postRepository.findByIdAndStatus(id, Status.PUBLISHED).orElseThrow();
        return convertPostToResponse(post);
    }

    @Override
    public List<PostResponseDto> findAll() {
        return postRepository.findAll()
                .stream()
                .map(this::convertPostToResponse)
                .toList();
    }

    @Override
    public List<PostResponseDto> findAllPublished() {
        return postRepository.findByStatus(Status.PUBLISHED)
                .stream()
                .map(this::convertPostToResponse)
                .toList();
    }

    @Override
    public List<PostResponseDto> searchPublishedByTitle(String title) {
        return postRepository.findByTitleContainingIgnoreCaseAndStatus(title, Status.PUBLISHED)
                .stream()
                .map(this::convertPostToResponse)
                .toList();
    }

    @Override
    public PostResponseDto publish(int id) {
        Post post = postRepository.findById(id)
                .orElseThrow();
        post.setStatus(Status.PUBLISHED);
        Post savedPost = postRepository.save(post);
        return convertPostToResponse(savedPost);
    }

    @Override
    public PostResponseDto unpublish(int id) {
        Post post = postRepository.findById(id)
                .orElseThrow();
        post.setStatus(Status.DRAFT);
        Post savedPost = postRepository.save(post);
        return convertPostToResponse(savedPost);
    }

    @Override
    public PostResponseDto incrementViews(int id) {
        Post post = postRepository.findByIdAndStatus(id, Status.PUBLISHED)
                .orElseThrow();
        int currentViews = post.getViews() == null ? 0 : post.getViews();
        post.setViews(currentViews + 1);
        Post savedPost = postRepository.save(post);
        return convertPostToResponse(savedPost);
    }

    @Override
    public void deleteById(int id) {
        postRepository.deleteById(id);
    }
}
