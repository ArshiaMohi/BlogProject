package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.applicationUser.ApplicationUserRegisterDto;
import com.arshia.blogproject.dto.applicationUser.ApplicationUserResponseDto;
import com.arshia.blogproject.entity.ApplicationUser;
import com.arshia.blogproject.repository.ApplicationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationUserServiceImpl implements ApplicationUserService {

    private final ApplicationUserRepository applicationUserRepository;

    private ApplicationUser convertRegisterToUser(ApplicationUserRegisterDto applicationUserRegisterDto) {
        ApplicationUser applicationUser = new ApplicationUser();

        applicationUser.setUsername(applicationUserRegisterDto.getUsername());
        applicationUser.setEmail(applicationUserRegisterDto.getEmail());
        applicationUser.setPassword(applicationUserRegisterDto.getPassword());
        applicationUser.setFullName(applicationUserRegisterDto.getFullName());

        ApplicationUser saved = applicationUserRepository.save(applicationUser);
        return saved;
    }

    private ApplicationUserResponseDto convertUserToResponse(ApplicationUser applicationUser){
        ApplicationUserResponseDto applicationUserResponseDto = new ApplicationUserResponseDto();

        applicationUserResponseDto.setId(applicationUser.getId());
        applicationUserResponseDto.setUsername(applicationUser.getUsername());
        applicationUserResponseDto.setEmail(applicationUser.getEmail());
        applicationUserResponseDto.setFullName(applicationUser.getFullName());
        applicationUserResponseDto.setRole(applicationUser.getRole());
        applicationUserResponseDto.setActive(applicationUser.getActive());

        return applicationUserResponseDto;
    }

    @Override
    public ApplicationUserResponseDto save(ApplicationUserRegisterDto applicationUserRegisterDto) {
        ApplicationUser applicationUser = convertRegisterToUser(applicationUserRegisterDto);
        ApplicationUser saved = applicationUserRepository.save(applicationUser);
        return convertUserToResponse(saved);
    }

    @Override
    public ApplicationUserResponseDto findById(int id) {
        ApplicationUser applicationUser = applicationUserRepository.findById(id).orElseThrow();
        return convertUserToResponse(applicationUser);
    }

    @Override
    public List<ApplicationUserResponseDto> findAll() {
        return applicationUserRepository.findAll()
                .stream()
                .map(this::convertUserToResponse)
                .toList();
    }

    @Override
    public void deleteById(int id) {
        applicationUserRepository.deleteById(id);
    }
}
