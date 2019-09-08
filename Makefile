# Directory of files inside docker container
DEV_FOLDER := scripts

# location of docker-compose file
DEV_COMPOSE_FILE := docker-compose.yml

build:
	@ docker-compose -f ${DEV_COMPOSE_FILE} up
	# @ docker-compose -f ${DEV_COMPOSE_FILE} exec app ${DEV_FOLDER}/start.sh

test:
	@ echo "Lender backend tests running..."
	@ docker-compose run test

down:
	@ echo "Lender going down..."
	@ docker-compose -f ${DEV_COMPOSE_FILE} down

clean: down
	@ echo "Removing containers..."
	@ docker stop Lender_app
	@ docker rm Lender_app mongoDB