const server = require('./app');

const port = process.env.PORT || 3000 ; 

server.listen(port, () => {
    console.log('server is up on port '+ port);
})