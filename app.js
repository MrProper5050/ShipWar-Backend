const {express, app, server, io} = require('./serverConfig')
const exphbs  = require('express-handlebars');
const sequelize = require('./db/connect')
const m_Games = require('./db/models/games')
const path = require('path')
const fs = require('fs')



const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(express.static('client'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))





app.get('/',(req,res)=>{
    if(req.accepts('text/html')){
        res.sendFile(path.join(__dirname,'client','index.html'))
    }
})
app.get('/:gameName',(req,res)=>{

    //если такая сессия существует, то рендерим страницу

    fs.open(path.join(__dirname,'gameSessions', req.params.gameName+'.json'),'r',(err) => {
        if(err) return res.status(403).json({message:'Такой игры не существует'})

        let gameFile = require('./gameSessions/'+req.params.gameName)
        // console.log('1)gameFile:', gameFile)
        // console.log('2)gameFile.players_TheirShoots_TheirShipsMatrix:', gameFile.players_TheirShoots_TheirShipsMatrix)
        //Если в сессии юзер с таким ником зареган, то впускаем
        let errors = []
        
        for (const player of gameFile.players_TheirShoots_TheirShipsMatrix) {
            if(player.pName === req.query.nickName){
                return res.render('game',{
                    gameName: req.params.gameName,
                    nickName:req.query.nickName
                })
            }else{
                errors.push('Лжедмитрий')
            }
        }
        return res.status(333).json({message:'ХА-ХА самозванец!'})
        // gameFile.players_TheirShoots_TheirShipsMatrix.forEach((player, index) => {
        //     console.log('---------',index,'--------')
        //     console.log('1)player:', player)
        //     if(!(player.pName === req.query.nickName)){
        //         errors.push('Лжедмитрий')
               
        //     }
        // });
        // console.log('2)errors.length', errors.length)
        // if(errors.length >= 1){
        //     return res.status(333).json({message:'ХА-ХА самозванец!'})
        // }else{
        //     return res.render('game',{
        //         gameName: req.params.gameName,
        //         nickName:req.query.nickName
        //     })
        // }
        //Не зарегистрирован в игре    
        
        
    })

})
app.get('*',(req,res)=>{
    if(req.accepts('text/html')){
        res.sendFile(path.join(__dirname,'client','404.html'))
    }
})



app.use(require('./routes/api/generateGame'))
app.use(require('./routes/api/connectToGame'))
// в каждом запросе будет приходить id сессии, в которой сидит пользователь. 
// Если его нет в данной сесси, то мы его дисконнектаем 




io.on('connection',(socket)=>{
    socket.emit('connected','Connected!')

   
        socket.on('gameName', (gameName)=>{
            gameName = gameName.slice(1)
            // console.log('0)gameName:',gameName)
            // console.log('1)ROOMS:',socket.adapter.rooms)
            // console.log('2)ROOMS get:',socket.adapter.rooms.get(gameName))

            if(typeof socket.adapter.rooms.get(gameName) === 'undefined' || socket.adapter.rooms.get(gameName).size < 2  ){
                
                        
                socket.gameName = gameName;
                socket.join(gameName);
                        // console.log( '2)rooms:',socket.adapter.rooms)
                        // console.log( '3)rooms:',socket.adapter.rooms.get(gameName).size)
            }else{
                socket.send('Комната заполнена!')
            }
        })
    
        socket.on('hello everybody',(msg) => {
            socket.to(socket.gameName).send(msg)
        })
    
   
})

async function start() {
    try {
        sequelize.sync({logging:false})
        
        server.listen(3000,()=>{
            console.log('Сервер запущен')
        })
    } catch (e) {
        return console.log('!!!Нам пизда!!!')
    }
}start()
    
  
