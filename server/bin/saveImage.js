module.exports = function saveImage(param,token){
 
    contentType = param.mimetype;
    if(!contentType.includes("image")){
      return send("check the file type");
    }
    
    photoname = param.originalname.split(".")[0];
    const nativeData = param.buffer;
    const data = Array.from(Buffer.from(nativeData, 'binary'));
    
    var file = new Parse.File(photoname, data, contentType);
    
    file.save({ sessionToken: token });
    
    return file;
}
