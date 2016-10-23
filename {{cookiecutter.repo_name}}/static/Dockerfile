# Based on Node 6.6.0 image
FROM node:6.6.0

# Copy code
COPY . /static

# Set the default directory where CMD will execute
WORKDIR /static

# Install node requirements
RUN npm install

# Set the default command to execute when creating a new container
CMD ["npm", "run", "build"]
