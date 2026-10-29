/**
 * @file-id ER-FILE-SERVER-ENTRY-0001
 * @module-id ER-MOD-SERVER-APP-0001
 * @doc ../../docs/source/server-index.ts.docs.md
 * @master-doc ../../docs/MASTER_DOCUMENTATION.md
 * Purpose: expose health, world seed, and persistent guest profile endpoints.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { pool } from "./db/pool.js";
const app=express();
const port=Number(process.env.PORT??3001);
const allowedOrigin=process.env.CLIENT_ORIGIN??"http://localhost:5173";
app.use(cors({origin:allowedOrigin}));
app.use(express.json({limit:"32kb"}));
app.get("/api/health",async(_req,res)=>{
 let database:"ok"|"unavailable"="ok";
 try{await pool.query("SELECT 1");}catch{database="unavailable";}
 res.status(database==="ok"?200:503).json({ok:database==="ok",service:"earthbound-realms-api",database,version:"0.2.0"});
});
app.get("/api/config",(_req,res)=>res.json({buildName:"Earthbound Realms",buildId:"ER-TS-MMORPG-0.2.0",apiVersion:1,onlineMultiplayer:"not-implemented"}));
app.get("/api/world-seed",async(_req,res)=>{
 try{
  const [rows]=await pool.execute("SELECT seed_value FROM world_seeds WHERE seed_key = ? LIMIT 1",["primary"]);
  const list=rows as {seed_value:number}[];
  if(list.length){res.json({seed:list[0].seed_value});return;}
  const seed=Number(process.env.WORLD_SEED??"20261029");
  await pool.execute("INSERT INTO world_seeds (seed_key, seed_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE seed_value = VALUES(seed_value)",["primary",seed]);
  res.json({seed});
 }catch(error){res.status(503).json({error:"World seed storage unavailable. Initialize database/schema.sql.",detail:process.env.NODE_ENV==="development"&&error instanceof Error?error.message:undefined});}
});
app.post("/api/guest",async(req,res)=>{
 const displayName=String(req.body?.displayName??"").trim();
 if(displayName.length<2||displayName.length>24||!/^[\p{L}\p{N}_ -]+$/u.test(displayName)){res.status(400).json({error:"Display name must be 2–24 letters, numbers, spaces, underscores, or hyphens."});return;}
 const id=randomUUID();
 try{
  await pool.execute("INSERT INTO players (id, display_name, character_class, level, xp, gold) VALUES (?, ?, ?, 1, 0, 0)",[id,displayName,"Fighter"]);
  res.status(201).json({profile:{id,displayName,characterClass:"Fighter",level:1,xp:0,gold:0},note:"Guest profile saved. This is not an authenticated account."});
 }catch(error){res.status(503).json({error:"Player storage unavailable. Initialize database/schema.sql.",detail:process.env.NODE_ENV==="development"&&error instanceof Error?error.message:undefined});}
});
app.listen(port,()=>console.log(`Earthbound Realms API listening on http://localhost:${port}`));
