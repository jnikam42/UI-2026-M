  echo "++++++++++++++++++++++++++++++++++++++"
  echo "Now Start the building of Angular Code"

  START_TIME=$(date +%s)
  rm -rf dist
  ng build

  cd dist/*-web && tar -zcf dist_UI.tar.gz *

  ELAPSED=$(($(date +%s) - ${START_TIME}))
  echo ">> Main Script Step.1 [OK] : ${ELAPSED} secs <<"

  echo "++++++++++++++++++++++++++++++++++++++"
  echo "Now ship the UI-Components to API path"

#   DEST_LOCATION=../../ehub/modules/ehub-api/src/main/webapp
  DEST_LOCATION=/home/sarvatra.in/jalindar.nikam/Desktop/Git_Repo_UI/ehub/modules/ehub-api/src/main/webapp
  echo "BackEnd Path :${DEST_LOCATION}"

  rm -rf ${DEST_LOCATION}/assets
  rm -f ${DEST_LOCATION}/*

  echo "Old UI-Components deleted from API path [ This will raise error above (but can be ignored ;) ]"

  cp -p dist_UI.tar.gz ${DEST_LOCATION} && cd ${DEST_LOCATION} && tar -xf dist_UI.tar.gz && rm dist_UI.tar.gz
  echo "New UI-Components copied to API path"

  cd ../../../../../

  # Now build the REST API war file with UI
  echo "--------------------------------------"
  echo "--------------------------------------"
  echo "Now execute ./build.sh of API project "

  ./build.sh

  echo "--------------------------------------"
  echo "--------------------------------------"

  ELAPSED=$(($(date +%s) - ${START_TIME}))   
  echo ">> Main Script Step.2 [OK] : ${ELAPSED} secs <<"