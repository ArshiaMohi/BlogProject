package com.arshia.blogproject.dto.applicationUser;

import com.arshia.blogproject.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationUserResponseDto {

    private int id;

    private String username;

    private String email;

    private String fullName;

    private Role role;

    private Boolean active;
}
