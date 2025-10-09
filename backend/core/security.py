class Security():
    # Define public routes that do not require auth
    PRIVATE_PATHS = ["/api/v1/files/upload", 
                     "/api/v1/files/extract", 
                     "/api/v1/files/text", 
                     "/api/v1/files/text/image", 
                     "/api/v1/user/profile",
                     "/api/v1/files/",
                    ]
    
security = Security()