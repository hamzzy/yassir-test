DOCKER_COMPOSE = docker-compose
APP_SERVICE = secretnote-app


start-dev:
	$(DOCKER_COMPOSE) up --build


migrate-dev:
	$ npx prisma migrate deploy  && yarn start:dev


migration: ## migrate database schema after application is available.
	echo  "Applying database migrations..." 
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npx prisma migrate deploy
	echo "Database migrations applied successfully."

test-app:
	$ yarn test:int

migrate-status:
	$(DOCKER_COMPOSE) exec $(APP_SERVICE) npx prisma migrate status


generate-key: 
	$ openssl genrsa -out private.key 2048
	$ mkdir key
	$ cp private.key ./key

	