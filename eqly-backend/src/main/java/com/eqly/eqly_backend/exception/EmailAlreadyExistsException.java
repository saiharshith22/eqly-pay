package com.eqly.eqly_backend.exception;

public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super(String.format("Email already registered: %s", email));
    }
}
