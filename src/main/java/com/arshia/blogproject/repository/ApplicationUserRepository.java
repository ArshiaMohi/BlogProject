package com.arshia.blogproject.repository;

import com.arshia.blogproject.entity.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationUserRepository  extends JpaRepository<ApplicationUser, Integer> {
}
