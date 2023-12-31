const express = require("express");
const app = express();
const fs = require("fs");
const mongodb = require('mongodb');
const {MongoClient, ObjectId} = require("mongodb");
const url = 'mongodb://localhost:27017';

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// app.get('/init-video', function (req, res) {
//     mongodb.MongoClient.connect(url, function (error, client) {
//         if (error) {
//             res.json(error);
//             return;
//         }
//         // connect to the videos database
//         const db = client.db('myTestDatabase');
//
//         // Create GridFS bucket to upload a large file
//         const bucket = new mongodb.GridFSBucket(db);
//
//         // create upload stream using GridFS bucket
//         const videoUploadStream = bucket.openUploadStream('1minchainsawman');
//
//         // You can put your file instead of bigbuck.mp4
//         const videoReadStream = fs.createReadStream('./1minchainsawman.mp4');
//
//         // Finally Upload!
//         videoReadStream.pipe(videoUploadStream);
//
//         // All done!
//         res.status(200).send("Done...");
//     });
// });

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});

// STREAMING ----
app.get("/mongo-video-upload", async (req, res) => {
    // upload file
    const client = new MongoClient(url)
    const db = client.db('fs')
    const bucket = new mongodb.GridFSBucket(db, {bucketName : "myTestBucket"})
    // fs.createReadStream(__dirname + '/public/1minchainsawman.mp4')
    //     .pipe(bucket.openUploadStream('chain',
    //     {
    //     chunkSizeBytes: 1048576,
    //     metadata: {field: 'medium video', value: '1 min'}
    // }

    fs.createReadStream(__dirname + '/public/1minchainsawman.mp4')
        .pipe(bucket.openUploadStream('cnn'));

    res.sendStatus(200)

})

app.post("/video-stats", async (req,res)=>{
    const client = new MongoClient(url)
    const db = client.db('fs')
    const bucket = new mongodb.GridFSBucket(db, {bucketName: "myTestBucket"})
    const file = req.query.filename
    let cursor = bucket.find({filename: file})
    let array = []
    for await (const doc of cursor) {
        array.push(doc)
    }
    res.send(array)
})

app.post("/delete-video-by-id", async (req, res) =>{
    try{
        var client = new MongoClient(url);
        const db = client.db('fs')
        const bucket = new mongodb.GridFSBucket(db, {bucketName: "myTestBucket"})
        const idFileToDelete = req.query.id
        console.log(idFileToDelete)
        await bucket.delete(ObjectId(`${idFileToDelete}`))
        res.sendStatus(200)
    }
    catch (err){
        res.send(err)
    }
    finally {
        client.close()
    }
})

app.post("/mongo-video-get", async (req, res) => {
    const client = new MongoClient(url)
    const db = client.db('fs')
    const bucket = new mongodb.GridFSBucket(db, {bucketName: "myTestBucket"})
    const videoName = req.query.filename
    res.setHeader('Content-Disposition', `attachment; filename=${videoName}.mp4`);
    res.setHeader('Content-Type', 'video/mp4');
    const downloadStream = bucket.openDownloadStreamByName(videoName);

    downloadStream.pipe(res);
})


//         // const db = client.db('myTestDatabase');
//         const db = client.db('myTestDatabase');
//         console.log(db.collection('phones').findOne());
//         // GridFS Collection
//         const collection = db.collection('fs.files')
//         collection.find({}, (err, video) => {
//             if (!video) {
//                 console.log("this is what i found:\t" + collection.findOne())
//                 res.status(404).send("No video uploaded!");
//                 return;
//             }
//
//             // Create response headers
//             const videoSize = video.length;
//             const start = Number(range.replace(/\D/g, ""));
//             const end = videoSize - 1;
//
//             const contentLength = end - start + 1;
//             const headers = {
//                 "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//                 "Accept-Ranges": "bytes",
//                 "Content-Length": contentLength,
//                 "Content-Type": "video/mp4",
//             };
//
//             // HTTP Status 206 for Partial Content
//             res.writeHead(206, headers);
//
//             // Get the bucket and download stream from GridFS
//             const bucket = new mongodb.GridFSBucket(db);
//             const downloadStream = bucket.openDownloadStreamByName('1minchainsawman', {
//                 start
//             });
//
//             // Finally pipe video to response
//             downloadStream.pipe(res);
//         });
//     })
//
// });