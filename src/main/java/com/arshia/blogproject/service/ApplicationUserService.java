package com.arshia.blogproject.service;

import com.arshia.blogproject.dto.applicationUser.ApplicationUserRegisterDto;
import com.arshia.blogproject.dto.applicationUser.ApplicationUserResponseDto;

import java.util.List;

public interface ApplicationUserService {

    ApplicationUserResponseDto save(ApplicationUserRegisterDto applicationUserRegisterDto);

    ApplicationUserResponseDto findById(int id);

    List<ApplicationUserResponseDto> findAll();

    void deleteById(int id);
}
