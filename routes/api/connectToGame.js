const {Router} = require('express')
const fs = require('fs')
const path = require('path')
const router = new Router()


router.post('/api/connectToGame',(req,res)=>{
    //приходит код(id игры) и ник игрока
    //проверяется сессия игры, id которой указал юзер, на занятость.
    //если всё окей, то заносим этого юзера в сессию
    //ы

  
    
    const pathToFile = path.join('.','gameSessions',req.body.gameName+'.json')
    // console.log('1)PATH_TO_FILE:', pathToFile)
    //Если игра не доступна, не такого файла сессии, то ошибка, иначе же - гуд
    fs.readFile(pathToFile,'utf-8',(err,data)=>{
        if(err){
            return res.status(400).json({message:'Такой игры не существует. Создай свою!'})
        }
    })
    // fs.open(pathToFile, 'r', (err)=>{
    //     if(err) 
    //     {
    //         // console.log("2)ERROR:", err) 
    //         
    //     }
    // })

    //Если сессия игры не заполнена? входим : комната заполнена
    let gameFile = require('../../gameSessions/'+req.body.gameName)
    // console.log('1)GAME_FILE:', gameFile)

    if(gameFile.playersInRoom === 1){
        gameFile.playersInRoom = 2;

        const player = {
            pName:req.body.user.userName, 
            shoots:[                            // 10x10 mash
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','','']
            ],
            myShipsMatrix:[
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','',''],
                ['','','','','','','','','','']
            ]
        }

        gameFile.players_TheirShoots_TheirShipsMatrix.push(player)

        // console.log('2)GAME_FILE:', gameFile)

        fs.writeFileSync(pathToFile, JSON.stringify(gameFile))
        return res.status(200).json( {message:'OK', gameName:req.body.gameName, nickName:req.body.user.userName} )
    }else{
        return res.status(400).json({message:'Комната переполнена.'})
    }


        // console.log(gameFile)
    

    // gameFile
    // fs.writeFile()


})

module.exports = router