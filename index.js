const express=require("express");
const cors=require("cors");
const mysql=require("mysql2");
const fs=require("fs");
const multer=require("multer");
const path=require("path");
const port=process.env.PORT || 9000;

const app=express();
app.use(cors());
app.use(express.json());
		
const con=mysql.createConnection({
	host:"sql12.freesqldatabase.com",
	user:"sql12726594",
	password:"F3GXK8CAwE",
	database:"sql12726594"

});

const storage=multer.diskStorage({
destination: (req,file,cb)=>{
cb(null,'uploads/');
},
filename:(req,file,cb)=>{
cb(null,Date.now() + path.extname(file.originalname));
},
});
const upload=multer({storage});
app.use('/uploads',express.static('uploads'));
app.post("/save",upload.single('file'),(req,res)=>{
	let data=[req.body.rno, req.body.name, req.body.marks,req.file.filename];
	console.log(data);
	let sql="insert into adult values(?,?,?,?)";
	con.query(sql,data,(err,result)=>{
		if (err)	res.send(err);
		else	res.send(result);
	});

});

app.get("/read",(req,res)=>{
	let sql="select * from adult";
	con.query(sql, (err,result)=>{
		if (err)	res.send(err);
		else	res.send(result);	

	});

});

app.delete("/remove",(req,res)=>{
	let data=[req.body.rno];
	fs.unlink("./uploads/" + req.body.file, ()=>{});
	let sql="delete from adult where rno=?";
	con.query(sql,data,(err,result)=>{
		if (err)	res.send(err);
		else	res.send(result);
	});	
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const file = path.join(__dirname, 'uploads', filename);

    res.download(file, (err) => {
        if (err) {
            console.log("Error downloading file:", err);
            res.status(500).send("Could not download the file.");
        }
    });
});


app.listen(port, () =>{console.log("ready @ 9000");});
