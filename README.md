# usuarios-app

*Build image:* docker build . -t usuarios

*Run container:* 
docker run -e PORT=8081 -e MONGO_URL="mongodb+srv://user:password@usuarios.wr8o2r4.mongodb.net/?retryWrites=true&w=majority" -e NODE_ENV="development" -p 3002:8081 usuarios

Where user and password should be replaced with mongo atlas credentials.