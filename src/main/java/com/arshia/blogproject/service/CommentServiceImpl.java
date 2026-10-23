package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.entity.ApplicationUser;
import com.arshia.blogproject.entity.Comment;
import com.arshia.blogproject.entity.CommentStatus;
import com.arshia.blogproject.entity.Post;
import com.arshia.blogproject.repository.ApplicationUserRepository;
import com.arshia.blogproject.repository.CommentRepository;
import com.arshia.blogproject.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ApplicationUserRepository applicationUserRepository;

    private CommentResponseDto convertCommentToResponse(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();

        dto.setId(comment.getId());
        dto.setName(comment.getName());
        dto.setContent(comment.getContent());
        dto.setStatus(comment.getStatus());
        dto.setCreatedAt(comment.getCreatedAt());

        if (comment.getPost() != null) {
            dto.setPostId(comment.getPost().getId());
            dto.setPostTitle(comment.getPost().getTitle());
        }

        if (comment.getUser() != null) {
            dto.setUserId(comment.getUser().getId());
            dto.setUsername(comment.getUser().getUsername());
        }

        return dto;
    }

    @Override
    public CommentResponseDto save(
            CommentCreateDto dto,
            String username
    ) {
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new IllegalArgumentException("متن کامنت نمی‌تواند خالی باشد.");
        }

        ApplicationUser user = applicationUserRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalStateException("کاربر واردشده پیدا نشد."));

        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() ->
                        new IllegalArgumentException("پست پیدا نشد."));

        Comment comment = new Comment();
        comment.setContent(dto.getContent().trim());
        comment.setName(user.getFullName());
        comment.setEmail(user.getEmail());
        comment.setUser(user);
        comment.setPost(post);
        comment.setStatus(CommentStatus.PENDING);

        return convertCommentToResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponseDto findById(int id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("کامنت پیدا نشد."));
        return convertCommentToResponse(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> findAll() {
        return commentRepository.findAll()
                .stream()
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> search(
            CommentStatus status,
            String query
    ) {
        List<Comment> comments = status == null
                ? commentRepository.findAll()
                : commentRepository.findByStatus(status);

        String normalizedQuery = query == null
                ? ""
                : query.trim().toLowerCase(Locale.ROOT);

        return comments.stream()
                .filter(comment -> {
                    if (normalizedQuery.isBlank()) {
                        return true;
                    }

                    String content = comment.getContent() == null
                            ? ""
                            : comment.getContent().toLowerCase(Locale.ROOT);

                    String name = comment.getName() == null
                            ? ""
                            : comment.getName().toLowerCase(Locale.ROOT);

                    String username = comment.getUser() == null
                            || comment.getUser().getUsername() == null
                            ? ""
                            : comment.getUser().getUsername()
                            .toLowerCase(Locale.ROOT);

                    String postTitle = comment.getPost() == null
                            || comment.getPost().getTitle() == null
                            ? ""
                            : comment.getPost().getTitle()
                            .toLowerCase(Locale.ROOT);

                    return content.contains(normalizedQuery)
                            || name.contains(normalizedQuery)
                            || username.contains(normalizedQuery)
                            || postTitle.contains(normalizedQuery);
                })
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> findApprovedByPostId(int postId) {
        return commentRepository
                .findByPost_IdAndStatus(postId, CommentStatus.APPROVED)
                .stream()
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    public CommentResponseDto approve(int id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("کامنت پیدا نشد."));

        comment.setStatus(CommentStatus.APPROVED);
        return convertCommentToResponse(commentRepository.save(comment));
    }

    @Override
    public CommentResponseDto reject(int id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("کامنت پیدا نشد."));

        comment.setStatus(CommentStatus.REJECTED);
        return convertCommentToResponse(commentRepository.save(comment));
    }

    @Override
    public CommentResponseDto unapprove(int id) {
        return reject(id);
    }

    @Override
    public void deleteById(int id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("کامنت پیدا نشد.");
        }

        commentRepository.deleteById(id);
    }
}

