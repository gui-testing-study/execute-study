#!/bin/bash
pid=$(ps -eaf | lsof -t -i:${PORT} | grep -v grep 2>&1)
echo ${pid}
if [ -z "${pid// }" ]; then
  cd workstation/${DIR}
  nohup ./mvnw clean install > ./log.txt 2>&1 & 
  sleep 10
  nohup ./mvnw spring-javaformat:apply > ./log.txt 2>&1 & 
  sleep 10
  nohup ./mvnw spring-boot:run > ./log.txt 2>&1 & 
  exit 0
fi
kill -9 ${pid}
cd workstation/${DIR}
nohup ./mvnw clean install > ./log.txt 2>&1 & 
sleep 10
nohup ./mvnw spring-javaformat:apply > ./log.txt 2>&1 & 
sleep 10
nohup ./mvnw spring-boot:run > ./log.txt 2>&1 & 
exit 0
