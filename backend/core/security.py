class Security():
    # Define public routes that do not require auth
    PRIVATE_PATHS = [
                     "/api/v1/user/profile",
                    ]
    
security = Security()