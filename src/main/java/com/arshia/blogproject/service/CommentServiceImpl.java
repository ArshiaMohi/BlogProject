package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.comment.CommentCreateDto;
import com.arshia.blogproject.dto.comment.CommentResponseDto;
import com.arshia.blogproject.entity.Comment;
import com.arshia.blogproject.entity.Post;
import com.arshia.blogproject.repository.CommentRepository;
import com.arshia.blogproject.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    private Comment convertCreateToComment(CommentCreateDto commentCreateDto) {

        Comment comment = new Comment();

        comment.setName(commentCreateDto.getName());
        comment.setEmail(commentCreateDto.getEmail());
        comment.setContent(commentCreateDto.getContent());

        Post post = postRepository.findById(commentCreateDto.getPostId())
                .orElseThrow();
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);
        return savedComment;
    }

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

    @Override
    public CommentResponseDto save(CommentCreateDto commentCreateDto) {
        Comment comment = convertCreateToComment(commentCreateDto);
        return convertCommentToResponse(comment);
    }

    @Override
    public CommentResponseDto findById(int id) {
        Comment comment = commentRepository.findById(id).orElseThrow();
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
    public List<CommentResponseDto> findApprovedByPostId(int postId) {
        return commentRepository.findByPost_IdAndApprovedTrue(postId)
                .stream()
                .map(this::convertCommentToResponse)
                .toList();
    }

    @Override
    public CommentResponseDto approve(int id) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setApproved(true);
        Comment saved = commentRepository.save(comment);
        return convertCommentToResponse(saved);
    }

    @Override
    public CommentResponseDto unapprove(int id) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setApproved(false);
        Comment saved = commentRepository.save(comment);
        return convertCommentToResponse(saved);
    }

    @Override
    public void deleteById(int id) {
        commentRepository.deleteById(id);
    }
}
