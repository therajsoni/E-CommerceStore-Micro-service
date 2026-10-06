from node:20-alpine 
workdir /app
copy package*.json . 
run npm install
copy . . 
expose 3000
cmd ["npm" , "run" , "start"]
