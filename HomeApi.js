
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const path = require('path');
const { globalAgent } = require('https');


app  = express();

app.use(cors({
    origin: 'http://buccihouse.xyz'
}));
app.use(express.static(__dirname + '/dist/HomeApi'));



app.use(
    express.json()
  );

const port = 3000;

let lights = {

    body:{
    light1: {
        status: false,
        id: 'light1',
        name: 'Desktop light',
    },
    light2: {
        status: false,
        id: 'light2',
        name: 'Bedroom light ',
    },
    light3: {
        status: false,
        id: 'light3',
        name: 'Bathroom light',
    },
   
    },
    code: uuid.v1(),

}



let message={
    body:[
        {
            text:'First message',
            lang:'en',
            time: 0,
            id: '0',
        }
    ]
}

//get reqs for lights data

app.get('/lightsModule', (req, res)=>{

    res.send(lights);
});

app.get('/lightsModule/:lightid/status', (req, res)=>{
    let id = req.params.lightid;
    res.send(`{
        "res": "status: ${lights[id].status}"
    }`);
});


app.get('/lightsModule/:lightid/id', (req, res)=>{
    let id = req.params.lightid;
    res.send(`{
        "res": "status: ${lights[id].id}"
    }`);
});







//get reqs for incoming messages

app.get('/message', (req, res)=>{
    res.send(message);
});

//get reqs for home page (actual ui)
app.get('/*' , (req, res)=>{
    res.sendFile(__dirname + '/dist/HomeApi/index.html');
})



//Post requests logic

//Post req for incoming messages
app.post('/message', async (req, res)=>{

    let now = Date.now();
    let now1 = new Date(now);
    let formattedDate = now1.toUTCString();
    
    message.body[0].text = req.body.text;
    message.body[0].lang = req.body.lang;
    message.body[0].time = formattedDate;
    message.body[0].id= uuid.v1();

    console.log(message.body[0]);
    res.send(`{
        "res": "you posted",
        "status": 200
    }`);
});

//post reqs for lights (turning them on and off)

app.post('/lightsModule/:lightid', async (req, res)=>{
    let selector =  req.params.lightid;
    let selectedLight = lights.body[selector];
    selectedLight.status = req.body.newStatus;
    lights.code = uuid.v1();
    console.log({
        'light': selector,
        'newStat': req.body.newStatus? 'on': 'off',
    });

    res.send(`{
        "res": "light${req.params.lightid} turned ${req.body.newStatus }",
        "status": 200
    }`);
});


//Delete requests logic
app.delete('/', (req, res)=>{
    res.send('DELETE');
});


//Put requests logic
app.put('/lights/:lightid/status', (req, res)=>{
   let id = req.params.lightid;
    console.log(req.body);
    res.send(`{
        "res": "good", 
        "status": "200",
        "message": "changed to ${lights[id].status}"
    }`);
});

app.listen(port, ()=>{
    console.log('running on' + port);
})
