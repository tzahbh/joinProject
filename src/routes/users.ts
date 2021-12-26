import express from "express";
import UserService from "services/user.service";
import {verifyJwt} from "../utils/jwt"
var router = express.Router();

// Upload Router

// Service to upload file.
router.post("/login", async (req: express.Request, res: express.Response) => {
  try{
    const { phone, password } = req.body;
    const userService = new UserService();
    const authToken = await userService.login({phone: phone, password: password},{req: req, res: res, user: null});
    return res.status(200).send(authToken)
  }
  catch(err){
    return res.status(400).send(err) 
  }
  
  });

  router.post("/register", async (req: express.Request, res: express.Response) => {
    try{
      const { phone, name, password} = req.body;
      const userService = new UserService();
      const user = await userService.createUser({name: name, password: password, phone: phone})
      return res.status(201).send({phone: user.phone, name: user.name})
    }
    catch(err){
      return res.status(400).send(err) 
    }
    
    });

  router.post("/valid", async (req: express.Request, res: express.Response) => {
    try{;
      const {accessToken} = req.cookies
      const user = verifyJwt(accessToken)
      if (!user){
        return res.status(400).send("Unvalid.")
      }
      return res.status(200).send("Valid.")
    }
    catch(err){
      return res.status(400).send(err) 
    }
    
    });

  router.post("/logout", async (req: express.Request, res: express.Response) => {
    try{;
      return res.clearCookie('accessToken').status(200).send("Logout Successfuly.")
    }
    catch(err){
      return res.status(400).send(err) 
    }
    
    });

export { router }