import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, "uploads")
    },

    filename: (req, file, callback) =>{
        const ext = path.extname(file.originalname);
        callback(null, Date.now() + ext);
    }
});



const fileFilter = (req, file, callback) =>{
    if(file.mimetype.startsWith("image/")){
        callback(null, true)
    }else{
        callback(new Error("Only images allowed"), false)
    }
};


export const upload = multer({
    storage,
    fileFilter,
});