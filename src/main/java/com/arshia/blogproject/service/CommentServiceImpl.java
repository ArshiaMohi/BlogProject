
package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.entity.ApplicationUser;
import com.arshia.blogproject.entity.Comment;
import com.arshia.blogproject.entity.Post;
import com.arshia.blogproject.repository.ApplicationUserRepository;
import com.arshia.blogproject.repository.CommentRepository;
import com.arshia.blogproject.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ApplicationUserRepository applicationUserRepository;

    private Comment convertCreateToComment(
            CommentCreateDto commentCreateDto,
            String username) {

        ApplicationUser user = applicationUserRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "کاربر واردشده پیدا نشد."
                        ));

        Post post = postRepository
                .findById(commentCreateDto.getPostId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "پست موردنظر پیدا نشد."
                        ));

        Comment comment = new Comment();

        comment.setUser(user);
        comment.setName(user.getFullName());
        comment.setEmail(user.getEmail());
        comment.setContent(commentCreateDto.getContent());
        comment.setPost(post);
        comment.setApproved(false);

        return comment;
    }

    private CommentResponseDto convertCommentToResponse(
            Comment comment) {

        CommentResponseDto dto = new CommentResponseDto();

        dto.setId(comment.getId());
        dto.setName(comment.getName());
        dto.setEmail(comment.getEmail());
        dto.setContent(comment.getContent());
        dto.setApproved(comment.getApproved());

        if (comment.getUser() != null) {
            dto.setUserId(comment.getUser().getId());
            dto.setUsername(comment.getUser().getUsername());
        }

        dto.setPostId(comment.getPost().getId());
        dto.setPostTitle(comment.getPost().getTitle());
        dto.setCreatedAt(comment.getCreatedAt());

        return dto;
    }

    @Override
    public CommentResponseDto save(
            CommentCreateDto commentCreateDto,
            String username) {

        Comment comment = convertCreateToComment(
                commentCreateDto,
                username
        );

        return convertCommentToResponse(
                commentRepository.save(comment)
        );
    }

    @Override
    public CommentResponseDto findById(int id) {

        Comment comment = commentRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "کامنت موردنظر پیدا نشد."
                        ));

        return convertCommentToResponse(comment);
    }

    @Override
    public List<CommentResponseDto> findAll() {

        return commentRepository.findAll()
                .stream()
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    public List<CommentResponseDto> findApprovedByPostId(
            int postId) {

        return commentRepository
                .findByPost_IdAndApprovedTrue(postId)
                .stream()
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    public CommentResponseDto approve(int id) {

        Comment comment = commentRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "کامنت موردنظر پیدا نشد."
                        ));

        comment.setApproved(true);

        return convertCommentToResponse(
                commentRepository.save(comment)
        );
    }

    @Override
    public CommentResponseDto unapprove(int id) {

        Comment comment = commentRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "کامنت موردنظر پیدا نشد."
                        ));

        comment.setApproved(false);

        return convertCommentToResponse(
                commentRepository.save(comment)
        );
    }

    @Override
    public void deleteById(int id) {
        commentRepository.deleteById(id);
    }
}
