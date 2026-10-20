package com.arshia.blogproject.service;

import com.arshia.blogproject.entity.ApplicationUser;
import com.arshia.blogproject.repository.ApplicationUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final ApplicationUserRepository applicationUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        ApplicationUser applicationUser =
                applicationUserRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found"));

        return User.withUsername(applicationUser.getUsername())
                .password(applicationUser.getPassword())
                .roles(applicationUser.getRole().name().replace("ROLE_", ""))
                .disabled(!Boolean.TRUE.equals(applicationUser.getActive()))
                .build();
    }
}
