#!/bin/bash

##########################
#
# Tasks used for building and runing the application.
# @package build
# @author Constantin Dumitrescu <dum.constantin@gmail.com>
#
##########################

TASK=$1
PARAM1=$2
PARAM2=$3
PARAM3=$4

GULP_SCRIPT="/app/node_modules/.bin/gulp --gulpfile /app/build/gulpfile.babel.js"
TASKS_SCRIPT="/app/build/tasks.sh"

APP_CONTAINER_NAME=jsonmvc.local
APP_IMAGE_NAME=jsonmvc

# Display variables
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`
bold=`tput bold`
newline=$'\n'
separator_char="="

#####################
#     HELPERS       #
#####################

# Trim the leading and the trailling whitespace from the
# provided string
# @type helper
# @environment any
# @param string
trim() {
  echo "$(echo -e "${1}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
}

# Echoes a string consisting of a char repeated a number of times
# usage: repeatChar 10 "foo"
# @type helper
# @environment any
# @param number of repetition
# @param character
repeat_char() {
  times=$1
  char=$2
  result=""
  for ((i = 0; i < $times; i++)); do
    result="${result}${char}"
  done
  echo $result
}

# Wraps a text with around special chars
# Makes it easy to distinguish important sections.
# @type helper
# @environment any
# @param string
wrap_text() {
  chars=$(repeat_char 3 $separator_char)
  echo "${chars} ${1} ${chars}"
}

# Repeats an element so that it can hover on top
# or the bottom of the given text
# @type helper
# @environment any
# @param string
separator() {
  text=$1
  len=$(expr length "${text}")
  chars=$(repeat_char $len $separator_char)
  echo $chars
}

# Formats the text and wraps it to be displyed nicely on the screen
# @type helper
# @environment any
# @param string
format_text() {
  text=$1
  text=$(trim "${text}")
  text=$(wrap_text "${text}")

  echo $text
}

# Echos a title formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
title() {
  text=$(format_text "${1}")
  text_separator=$(separator "${text}")

  echo "${text_separator}${newline}${text}${newline}${text_separator}${newline}"
}
# Echos a subtitle formated text that is easily distinguashable
# in the the terminal output
# @type helper
# @environment any
# @param string
subtitle() {
  text=$(format_text "${1}")

  echo "${text}${newline}"
}

# Sets the hosts for the docker container on the local machine
# so that it can be accessed at http://appname
# @type helper
# @environment local machine
# @param host name
set_host() {
  IP="$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' ${1})"
  HOST=${1}

  sudo sed -i "/$HOST/ s/.*/$IP\t$HOST/g" /etc/hosts
  sudo grep $HOST /etc/hosts || echo "$IP $HOST" | sudo tee -a /etc/hosts
}

# Stops and removes a container
# @type helper
# @environment any
# @param container name
docker_rm() {
  docker rm -f $1 || :
}

# Holds the execution of a script until a port on a given port is opened
# UDP ports are not supported
# @type helper
# @environment any
# @param hostname
# @param port
wait_for_port() {

	host=$(echo "${1}_PORT_${2}_TCP_ADDR" | awk '{print toupper($0)}')
	port=$(echo "${1}_PORT_${2}_TCP_PORT" | awk '{print toupper($0)}')

  printf "Waiting for ${1}:${2} to be available "

	while [ "$(nmap -p ${!port} ${!host} 2>&1 | grep "tcp open")" = "" ]
	do
		printf "."
		sleep 1
	done

}

#####################
# APPLICATION TASKS #
#####################

# Starts the application container and the application server
# @type build
# @environment local machine
app_start() {
  app_stop

  if [ ! -f ./build/custom.env ]; then
    echo "

    Please create the /build/custom.env file.
    Check /build/default.env for available variables to overwrite

    "
    exit 0
  fi

  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    -d \
    --env-file ./build/default.env \
    --env-file ./build/custom.env \
    -t \
    --name $APP_CONTAINER_NAME \
    $APP_IMAGE_NAME bash -c "${TASKS_SCRIPT} start_server" > /dev/null

  set_host $APP_CONTAINER_NAME

  docker logs -f $APP_CONTAINER_NAME
}

# Stops and removes the application container
# @type build
# @environment local machine
app_stop() {
  docker rm -f $APP_CONTAINER_NAME > /dev/null || :
}

# Opens the app page in a browser with the disabled CORS settings
# @type build
# @environment local machine
browser_start() {
  chromium-browser --user-data-dir --disable-web-security http://$APP_CONTAINER_NAME:8080 &
}

# Starts the application server
# It will use webpack dev server or the production server
# depending on the NODE_ENV variable or the default
# one set in /app/conf/docker.env
# @type build
# @environment container
start_server() {

  case $NODE_ENV in
    development)
      task_start "start:development"
      ;;
    production)
      task_start "start:production"
      ;;
    test)
      task_start "start:test"
      ;;
    *)
      echo "NODE_ENV must be one of the following: {development|production|test}"
      exit 1
  esac
}

# Builds the docker file
# @type build
# @environment local machine
app_build() {
  cd build
  docker build -t $APP_IMAGE_NAME .
}

# Execute tasks
# @type build
# @environment container
app_exec() {
  docker run \
    -v $PWD:/app \
    -h $APP_CONTAINER_NAME \
    --env-file ./build/default.env \
    --env-file ./build/custom.env \
    -t \
    --rm \
    $APP_IMAGE_NAME bash -c "${GULP_SCRIPT} ${1} ${2} ${3} ${4} ${5}"
}

postinstall() {
  app_build
}

# Start a task
# @type build
# @environment container
# @param gulp task name
task_start() {
  eval "${GULP_SCRIPT} ${1}"
}

# ------ RUN TASK ------
title "Running task ${TASK} ${PARAM1} ${PARAM2} ${PARAM3}"
$TASK $PARAM1 $PARAM2 $PARAM3
