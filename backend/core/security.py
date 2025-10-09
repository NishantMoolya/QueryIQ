class Security():
    # Define public routes that do not require auth
    PRIVATE_PATHS = [
                     "/api/v1/user/profile",
                     "/api/v1/file/upload",
                     "/api/v1/file/add",
                    ]
    
security = Security()