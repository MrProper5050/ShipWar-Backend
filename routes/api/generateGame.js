const {Router} = require('express')
const shortid = require('shortid');
const m_Games = require('../../db/models/games')
const fs = require('fs')
const path = require('path')
const router = new Router()



router.post('/api/generateGame', async (req,res)=>{
    //ГЕНЕРАЦИЯ И ОТПРАВКА ОТВЕТА ? перенаправление на страницу игры : 404
    //генерируем игру
    ///создаём сессию игры (json file)
        ///// пользователь проверяется на авторизованность
        ///// cоздаётся стркоа в БД
        ///// создаётся новый json файл с игрой
    // console.log(req.body)

    fs.open(path.join('.',  'gameSessions', req.body.gameName+'.json'),'r', async(err)=>{
        //если файла не существует -> err нам нужно его создать
        //иначе ошибка, что сессия-файл уже существует
        if(err) {
            // console.log(err)
            if( req.body.owner === '' || typeof req.body.owner === 'undefined' ){
                return res.status(400).json({message:'NOK'})
            }
            const gameId = shortid.generate()
            try {
                //DB
                
                const game = new m_Games({
                    id:gameId,
                    gameName:req.body.gameName,
                    owner_id_name:req.body.owner,
                    players:[req.body.owner]
                })
                
                await game.save()
                game.save()
                //session file
                fs.open('gameSessions/'+req.body.gameName+'.json','w',(err, fd)=>{
                //    console.log(fd)
        
                    if(err) return res.status(400).json({error:err})
        
                    gameStats = {gameId:gameId,gameName:req.body.gameName,  playersInRoom:1,players_TheirShoots_TheirShipsMatrix:[{
                        pName:req.body.owner.userName,
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
        
                    }], WhoShoots:'Player1'}
                   fs.writeFileSync('gameSessions/'+req.body.gameName+'.json', JSON.stringify(gameStats))
                   
                })
               
        
                return res.status(201).json( {message:'OK', gameName:req.body.gameName, nickName:req.body.owner.userName} )
        
            } catch (e) {
                console.log(e)
                return res.status(400).json({message:'NOK', error: e})
            }
        }else{
            res.status(400).json({message:'Игра уже существует'})
        }
    })

    


   

})

module.exports = router