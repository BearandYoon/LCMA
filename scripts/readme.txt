
grunt build
ssh -i VinhLe.pem ubuntu@52.23.150.135 'sudo mkdir /opt/lcma-ui/v0.1.8'
scp -r -i /users/andrejkaurin/.ssh/id_rsa lcma/dist akaurin@52.23.150.135:/opt/lcma-ui/v0.1.17
ssh -i VinhLe.pem ubuntu@52.23.150.135 'cd /opt/lcma-ui/v0.1.8/dist'
ssh -i VinhLe.pem ubuntu@52.23.150.135 'sudo npm install'
ssh -i VinhLe.pem ubuntu@52.23.150.135 'bower install'
ssh -i VinhLe.pem ubuntu@52.23.150.135 'pm2 stop node'

ssh -i VinhLe.pem ubuntu@52.23.150.135 NODE_ENV='qa' pm2 start dist/server/app.js --name="ui-qa"
ssh -i VinhLe.pem ubuntu@52.23.150.135 NODE_ENV='uat' pm2 start server/app.js --name="ui-uat"
