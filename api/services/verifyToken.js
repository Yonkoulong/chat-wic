const verifyToken = (token) => {
        return new Promise((resolve,reject)=>{
            jwt.verify(token,PRIVATE_KEY, (err,result)=>{
                if(err) {
                    return reject(err)
                }
                resolve(result)
            })
        })
}

module.exports  = verifyToken;