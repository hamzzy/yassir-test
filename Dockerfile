# FROM node:18-alpine
# # Set the working directory
# WORKDIR /app

# # Copy the package.json and package-lock.json files to the working directory
# COPY ["package*.json","yarn.lock","./"]

# RUN apk update && apk add bash && apk add make
# # Install dependencies
# RUN yarn install

# # Copy the rest of the application to the working directory
# COPY . .

# CMD ["yarn","start:dev"]
