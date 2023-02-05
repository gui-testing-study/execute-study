#!/bin/bash
pid=$(ps -eaf | lsof -t -i:8080 | grep -v grep 2>&1)
echo ${pid}
if [ -z "${pid// }" ]; then
  echo "nada pra derrubar"
  cd workstation/spring-petclinic
  nohup ./mvnw spring-boot:run > ./log.txt 2>&1 & 
  exit 0
fi
kill -9 ${pid}
echo "derrubei aqui"
exit 0
