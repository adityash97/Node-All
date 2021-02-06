const http = require('http')
const fs = require('fs')
const requests = require('requests')

let homeFile = fs.readFileSync('index.html','utf-8')
// console.log(homeFile)

const fromatDegree = (degree) => {
    degree-=273.15
    return degree.toFixed(2)
}

const replace = (file,data) =>{
    let newFile = file.replace('{%min-temp%}',fromatDegree( data['main']['temp_min']))
    newFile = newFile.replace('{%max-temp%}',fromatDegree( data['main']['temp_max']))
    newFile = newFile.replace('{%city%}',data['name'])
    newFile = newFile.replace('{%temp%}',fromatDegree( data['main']['temp']))
    

    return newFile
}



server = http.createServer((req,res)=>{
    if(req.url == '/'){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=42fd79392390d302a8e4de77c098d5ca')
        .on('data', (chunk) =>{
        let newChunk = JSON.parse(chunk)
        // console.log(newChunk)
        let newFile = replace(homeFile,newChunk)
        res.write(newFile)
        })
        .on('end', (err) =>{
        if (err) return console.log('connection closed due to errors', err);
        res.end()
        });
    }
})


server.listen(5000,()=> console.log("listening at 5000"))
