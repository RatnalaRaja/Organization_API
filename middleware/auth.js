const jwt=require("jsonwebtoken");

const Org= require("../models/organization");


const protect = async(req,res,next)=>{
    let token;
    console.log("Hello");
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
             token = req.headers['authorization']?.split(' ')[1];
            const decoded =jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            
            req.org = await Org.findOne({ where: { org_id: decoded.id } });
            next()
        }catch(error){
            return res.status(401).json({message:"Not authorized,token failed"});
        }
    }
    if(!token){
        return res.status(401).json({message:"Not authorized,no token"});
    }
};

module.exports = protect;