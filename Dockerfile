FROM ubuntu:20:04
#Setup user
RUN useradd -ms/bin/bash sandbox

#Setup working directory
WORKDIR /home/sandbox

#update the ubuntu machine
RUN apt update && apt upgrade -y

#Install nano and curl
RUN apt install nano curl -y

#Install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs

#Configuring terminal to display current working directory
RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

#Setup the final working directory
WORKDIR /home/sandbox/app
