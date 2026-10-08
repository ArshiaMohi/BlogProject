package com.arshia.blogproject.dto.applicationUser;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationUserRegisterDto {

    private String username;

    private String email;

    private String password;

    private String fullName;
}
